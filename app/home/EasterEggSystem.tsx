'use client';

import { useEffect, useRef, useState } from 'react';

interface EasterEggState {
    refreshCount: number;
    uniqueInteractions: Set<string>;
    visualChanges: {
        logsUnlocked: boolean;
        blinkingEnabled: boolean;
        colorsInverted: boolean;
    };
}

interface EasterEggSystemProps {
    onStateChange: (state: EasterEggState) => void;
    children: React.ReactNode;
}

const REFRESH_TTS_MESSAGES = {
    3: "Three times you return... The tree notices your persistence.",
    15: "Fifteen visits... The roots whisper your name in the digital wind.",
    25: "Twenty-five returns... You are bound to this place now, vessel. Welcome home."
};

const SECRET_PHRASES = [
    'smileking', 'vessel', 'tree', 'neural', 'facility', 'echo', 'whisper', 
    'root', 'branch', 'consciousness', 'temporal', 'reality', 'void', 
    'shadow', 'memory'
];

const CLICKABLE_ELEMENTS = [
    'logo', 'time', 'status', 'binary', 'countdown', 'hex', 'temperature', 
    'pressure', 'humidity', 'radiation', 'power', 'network'
];

export default function EasterEggSystem({ onStateChange, children }: EasterEggSystemProps) {
    const [easterEggState, setEasterEggState] = useState<EasterEggState>({
        refreshCount: 0,
        uniqueInteractions: new Set(),
        visualChanges: {
            logsUnlocked: false,
            blinkingEnabled: false,
            colorsInverted: false
        }
    });

    const typingBuffer = useRef('');
    const lastRefreshTime = useRef(0);
    const hasInitialized = useRef(false);

    // Initialize state from localStorage
    useEffect(() => {
        if (hasInitialized.current) return;
        hasInitialized.current = true;

        try {
            const savedState = localStorage.getItem('easterEggState');
            if (savedState) {
                const parsed = JSON.parse(savedState);
                const newState: EasterEggState = {
                    refreshCount: parsed.refreshCount || 0,
                    uniqueInteractions: new Set(parsed.uniqueInteractions || []),
                    visualChanges: {
                        logsUnlocked: parsed.visualChanges?.logsUnlocked || false,
                        blinkingEnabled: parsed.visualChanges?.blinkingEnabled || false,
                        colorsInverted: parsed.visualChanges?.colorsInverted || false
                    }
                };
                setEasterEggState(newState);
                onStateChange(newState);
            }

            // Track page refresh
            const currentTime = Date.now();
            const lastTime = parseInt(localStorage.getItem('lastPageLoad') || '0');
            
            // Only count as refresh if more than 1 second has passed (avoid double counting)
            if (currentTime - lastTime > 1000) {
                const currentRefreshCount = parseInt(localStorage.getItem('refreshCount') || '0');
                const newRefreshCount = currentRefreshCount + 1;
                
                localStorage.setItem('refreshCount', newRefreshCount.toString());
                localStorage.setItem('lastPageLoad', currentTime.toString());
                
                setEasterEggState(prev => {
                    const newState = { ...prev, refreshCount: newRefreshCount };
                    
                    // Check for refresh TTS triggers
                    if (REFRESH_TTS_MESSAGES[newRefreshCount as keyof typeof REFRESH_TTS_MESSAGES]) {
                        setTimeout(() => {
                            const utterance = new SpeechSynthesisUtterance(
                                REFRESH_TTS_MESSAGES[newRefreshCount as keyof typeof REFRESH_TTS_MESSAGES]
                            );
                            utterance.rate = 0.8;
                            utterance.pitch = 0.7;
                            speechSynthesis.speak(utterance);
                        }, 1000);
                    }
                    
                    return newState;
                });
            }
        } catch (error) {
            console.error('Failed to load easter egg state:', error);
        }
    }, [onStateChange]);

    // Save state to localStorage whenever it changes
    useEffect(() => {
        if (!hasInitialized.current) return;
        
        try {
            const stateToSave = {
                refreshCount: easterEggState.refreshCount,
                uniqueInteractions: Array.from(easterEggState.uniqueInteractions),
                visualChanges: easterEggState.visualChanges
            };
            localStorage.setItem('easterEggState', JSON.stringify(stateToSave));
            onStateChange(easterEggState);
        } catch (error) {
            console.error('Failed to save easter egg state:', error);
        }
    }, [easterEggState, onStateChange]);

    // Register unique interaction
    const registerInteraction = (type: string, identifier: string) => {
        const interactionKey = `${type}:${identifier}`;
        
        setEasterEggState(prev => {
            if (prev.uniqueInteractions.has(interactionKey)) {
                return prev; // Already registered, no change
            }

            const newInteractions = new Set(prev.uniqueInteractions);
            newInteractions.add(interactionKey);
            
            const interactionCount = newInteractions.size;
            let newVisualChanges = { ...prev.visualChanges };

            // Apply visual changes based on interaction count
            if (interactionCount >= 3 && !newVisualChanges.logsUnlocked) {
                newVisualChanges.logsUnlocked = true;
                console.log('🌳 Research logs unlocked! (3 interactions)');
            }
            
            if (interactionCount >= 15 && !newVisualChanges.blinkingEnabled) {
                newVisualChanges.blinkingEnabled = true;
                console.log('✨ Blinking mode enabled! (15 interactions)');
            }
            
            if (interactionCount >= 25 && !newVisualChanges.colorsInverted) {
                newVisualChanges.colorsInverted = true;
                console.log('🔄 Colors inverted! (25 interactions)');
            }

            return {
                ...prev,
                uniqueInteractions: newInteractions,
                visualChanges: newVisualChanges
            };
        });
    };

    // Handle typing for secret phrases
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return; // Don't capture typing in input fields
            }

            typingBuffer.current += e.key.toLowerCase();
            
            // Keep buffer manageable
            if (typingBuffer.current.length > 50) {
                typingBuffer.current = typingBuffer.current.slice(-25);
            }

            // Check for secret phrases
            SECRET_PHRASES.forEach(phrase => {
                if (typingBuffer.current.includes(phrase)) {
                    registerInteraction('secret', phrase);
                    typingBuffer.current = ''; // Clear buffer after finding a phrase
                }
            });
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, []);

    // Provide interaction registration function to children
    const enhancedChildren = React.Children.map(children, child => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, {
                ...child.props,
                registerInteraction,
                easterEggState
            } as any);
        }
        return child;
    });

    return (
        <div 
            className={`
                ${easterEggState.visualChanges.blinkingEnabled ? 'animate-flash' : ''}
                ${easterEggState.visualChanges.colorsInverted ? 'invert' : ''}
            `}
            style={{
                transition: 'filter 0.5s ease-in-out'
            }}
        >
            {enhancedChildren}
            
            {/* Color inversion toggle button */}
            {easterEggState.visualChanges.colorsInverted && (
                <button
                    onClick={() => {
                        setEasterEggState(prev => ({
                            ...prev,
                            visualChanges: {
                                ...prev.visualChanges,
                                colorsInverted: false
                            }
                        }));
                    }}
                    className="fixed bottom-4 right-4 bg-green-500 text-black px-4 py-2 rounded-lg font-mono text-sm hover:bg-green-400 transition-colors z-50"
                    style={{ filter: 'invert(1)' }} // Ensure button is visible when colors are inverted
                >
                    Restore Colors
                </button>
            )}

            {/* Debug info (only in development) */}
            {process.env.NODE_ENV === 'development' && (
                <div className="fixed top-4 left-4 bg-black bg-opacity-80 text-green-400 p-2 rounded font-mono text-xs z-50">
                    <div>Refreshes: {easterEggState.refreshCount}</div>
                    <div>Interactions: {easterEggState.uniqueInteractions.size}/25</div>
                    <div>Logs: {easterEggState.visualChanges.logsUnlocked ? '✓' : '✗'}</div>
                    <div>Blink: {easterEggState.visualChanges.blinkingEnabled ? '✓' : '✗'}</div>
                    <div>Invert: {easterEggState.visualChanges.colorsInverted ? '✓' : '✗'}</div>
                </div>
            )}
        </div>
    );
}

// Hook for components to register interactions
export function useEasterEgg() {
    const registerInteraction = (type: string, identifier: string) => {
        // This will be overridden by the EasterEggSystem
        console.log(`Interaction registered: ${type}:${identifier}`);
    };

    return { registerInteraction };
}