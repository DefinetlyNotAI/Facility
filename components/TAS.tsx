'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Cookies from 'js-cookie';

interface TASProps {
    className?: string;
}

// Page-specific hints for TAS
const PAGE_HINTS: Record<string, string[]> = {
    '/': [
        "Welcome to the facility. Click accept to proceed, but know that every choice has consequences.",
        "The warnings are real. This isn't just a game - it's a test of your resolve.",
        "Audio permissions are required. The voices need to reach you."
    ],
    '/home': [
        "This is your new reality. The facility monitors everything - even your refreshes.",
        "Try the Konami code when you're ready to embrace corruption. Up, Up, Down, Down, Left, Right, Left, Right, B, A.",
        "The research logs contain fragments of truth. Read them carefully.",
        "Time moves differently here. Watch the countdown - it's not just decoration.",
        "The tree remembers how many times you've been here. It's counting."
    ],
    '/h0m3': [
        "You chose corruption. Now live with the consequences.",
        "The scrolling never ends. Each loop makes it worse.",
        "The reset button appears after enough suffering. Will you use it?",
        "The voices aren't just in your head anymore. They're in the system."
    ],
    '/scroll': [
        "Keep scrolling. That's all you can do now.",
        "Your legs will go numb. Your identity will fade. But you'll keep scrolling.",
        "The escape button appears when you've scrolled enough. But escape to where?",
        "I can see your IP address. I know where you are. Keep scrolling."
    ],
    '/black-and-white': [
        "Two QR codes. One truth, one lie. Choose wisely.",
        "Type '404' to find the moon. But only if you're lucky.",
        "The keyword is hidden in echoes. Listen carefully.",
        "Your screen size matters. 666x666 is the key to the next realm."
    ],
    '/choices': [
        "This is where I die. Where TAS becomes just another echo in the void.",
        "Answer the questions correctly. The entity is watching, waiting.",
        "Some keywords unlock memories. Others unlock nightmares.",
        "The final puzzle requires sacrifice. Are you ready to lose me?"
    ],
    '/terminal': [
        "Fill the phrase with the keywords you've collected. Each one is a piece of the puzzle.",
        "The email you seek belongs to a ghost. Look beyond the obvious.",
        "Caesar's cipher shifts by three. Remember that when the time comes.",
        "This is the end of our journey together. Make it count."
    ],
    '/the-end': [
        "The flower blooms in the garden of forgotten dreams.",
        "Type '25' or 'END' to cut the flower. But know that some cuts never heal.",
        "The word of unmaking waits on your lips. Speak it when you're ready.",
        "This is where vessels become entities. Where the cycle completes."
    ]
};

const SNARKY_COMMENTS = [
    "Oh, you're back. How... predictable.",
    "Still clicking around aimlessly? The tree finds your confusion amusing.",
    "Your mouse left the site. Running away won't save you.",
    "Muted the site? The silence won't protect you from what's coming.",
    "AFK for too long? Time doesn't stop just because you do.",
    "Refreshing again? The tree remembers every reload.",
    "Trying to cheat? The system sees everything you do.",
    "Lost? That's the point. Embrace the confusion.",
    "Still here? Most people would have left by now.",
    "The facility has been watching you for exactly [TIME] minutes now."
];

export default function TAS({ className = '' }: TASProps) {
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(false);
    const [currentHint, setCurrentHint] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);
    const [mouseOutside, setMouseOutside] = useState(false);
    const [isAFK, setIsAFK] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [startTime] = useState(Date.now());
    
    const afkTimeoutRef = useRef<NodeJS.Timeout>();
    const lastActivityRef = useRef(Date.now());
    const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

    // Check if TAS should exist (not after Choices is unlocked)
    useEffect(() => {
        const choiceUnlocked = Cookies.get('Choice_Unlocked');
        const killTasSeen = Cookies.get('KILLTAS_cutscene_seen');
        
        if (choiceUnlocked || killTasSeen) {
            setIsVisible(false);
            return;
        }
        
        setIsVisible(true);
    }, [pathname]);

    // Initialize page-specific hints
    useEffect(() => {
        if (!isVisible) return;
        
        const hints = PAGE_HINTS[pathname] || [
            "I don't have specific guidance for this area. Proceed with caution.",
            "The facility's systems are unpredictable here. Stay alert.",
            "You're in uncharted territory. The tree's influence is strong here."
        ];
        
        setCurrentHint(hints[0]);
    }, [pathname, isVisible]);

    // Mouse tracking for outside detection
    useEffect(() => {
        if (!isVisible) return;

        const handleMouseLeave = () => {
            setMouseOutside(true);
            setTimeout(() => {
                if (Math.random() < 0.3) { // 30% chance
                    speakSnarkyComment("Your mouse left the site. Running away won't save you.");
                }
            }, 2000);
        };

        const handleMouseEnter = () => {
            setMouseOutside(false);
        };

        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('mouseenter', handleMouseEnter);

        return () => {
            document.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('mouseenter', handleMouseEnter);
        };
    }, [isVisible]);

    // AFK detection
    useEffect(() => {
        if (!isVisible) return;

        const resetAFKTimer = () => {
            lastActivityRef.current = Date.now();
            setIsAFK(false);
            
            if (afkTimeoutRef.current) {
                clearTimeout(afkTimeoutRef.current);
            }
            
            afkTimeoutRef.current = setTimeout(() => {
                setIsAFK(true);
                if (Math.random() < 0.4) { // 40% chance
                    speakSnarkyComment("AFK for too long? Time doesn't stop just because you do.");
                }
            }, 60000); // 1 minute
        };

        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
        events.forEach(event => {
            document.addEventListener(event, resetAFKTimer, true);
        });

        resetAFKTimer(); // Initialize timer

        return () => {
            events.forEach(event => {
                document.removeEventListener(event, resetAFKTimer, true);
            });
            if (afkTimeoutRef.current) {
                clearTimeout(afkTimeoutRef.current);
            }
        };
    }, [isVisible]);

    // Audio context detection for muting
    useEffect(() => {
        if (!isVisible) return;

        const checkAudioContext = () => {
            // Check if any audio elements are muted
            const audioElements = document.querySelectorAll('audio');
            const anyMuted = Array.from(audioElements).some(audio => audio.muted || audio.volume === 0);
            
            if (anyMuted && !isMuted) {
                setIsMuted(true);
                setTimeout(() => {
                    if (Math.random() < 0.5) { // 50% chance
                        showAlert("Muted the site? The silence won't protect you from what's coming.");
                    }
                }, 1000);
            } else if (!anyMuted && isMuted) {
                setIsMuted(false);
            }
        };

        const interval = setInterval(checkAudioContext, 5000); // Check every 5 seconds
        return () => clearInterval(interval);
    }, [isVisible, isMuted]);

    const speakSnarkyComment = (comment: string) => {
        if (!isVisible) return;
        
        // Replace [TIME] placeholder with actual time
        const timeMinutes = Math.floor((Date.now() - startTime) / 60000);
        const finalComment = comment.replace('[TIME]', timeMinutes.toString());
        
        // Cancel any existing speech
        if (speechRef.current) {
            speechSynthesis.cancel();
        }
        
        const utterance = new SpeechSynthesisUtterance(finalComment);
        utterance.rate = 0.8;
        utterance.pitch = 0.6;
        utterance.volume = 0.9;
        utterance.voice = speechSynthesis.getVoices().find(voice => 
            voice.name.includes('Male') || voice.name.includes('David')
        ) || speechSynthesis.getVoices()[0];
        
        speechRef.current = utterance;
        speechSynthesis.speak(utterance);
    };

    const showAlert = (message: string) => {
        alert(`TAS: ${message}`);
    };

    const handleTASClick = () => {
        if (!isVisible) return;
        
        setIsExpanded(!isExpanded);
        
        if (!isExpanded) {
            // Speak the current hint
            const hints = PAGE_HINTS[pathname] || ["No specific guidance available for this area."];
            const randomHint = hints[Math.floor(Math.random() * hints.length)];
            setCurrentHint(randomHint);
            
            // TTS the hint
            speakSnarkyComment(randomHint);
        }
    };

    const getRandomSnarkyComment = () => {
        const comments = [...SNARKY_COMMENTS];
        return comments[Math.floor(Math.random() * comments.length)];
    };

    if (!isVisible) return null;

    return (
        <>
            {/* TAS Button */}
            <div
                className={`fixed bottom-4 left-4 z-50 ${className}`}
                style={{
                    fontFamily: "'Courier New', monospace",
                }}
            >
                <div
                    onClick={handleTASClick}
                    className={`
                        bg-black border-2 border-green-400 rounded-lg p-3 cursor-pointer
                        transition-all duration-300 hover:bg-green-900/20 hover:border-green-300
                        ${isExpanded ? 'w-80' : 'w-16 h-16'}
                        ${mouseOutside ? 'animate-pulse border-red-400' : ''}
                        ${isAFK ? 'animate-bounce border-yellow-400' : ''}
                    `}
                    style={{
                        boxShadow: '0 0 20px rgba(0, 255, 0, 0.3)',
                        backdropFilter: 'blur(10px)',
                    }}
                >
                    {!isExpanded ? (
                        <div className="flex items-center justify-center h-full">
                            <span className="text-green-400 text-xl font-bold">TAS</span>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-green-400 font-bold text-lg">TAS Support</span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsExpanded(false);
                                    }}
                                    className="text-green-400 hover:text-green-300 text-xl"
                                >
                                    ×
                                </button>
                            </div>
                            
                            <div className="text-green-300 text-sm leading-relaxed">
                                {currentHint}
                            </div>
                            
                            <div className="flex gap-2 text-xs">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const hints = PAGE_HINTS[pathname] || ["No hints available."];
                                        const randomHint = hints[Math.floor(Math.random() * hints.length)];
                                        setCurrentHint(randomHint);
                                        speakSnarkyComment(randomHint);
                                    }}
                                    className="bg-green-700 hover:bg-green-600 text-white px-2 py-1 rounded transition-colors"
                                >
                                    New Hint
                                </button>
                                
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const comment = getRandomSnarkyComment();
                                        speakSnarkyComment(comment);
                                    }}
                                    className="bg-red-700 hover:bg-red-600 text-white px-2 py-1 rounded transition-colors"
                                >
                                    Snarky Comment
                                </button>
                            </div>
                            
                            {/* Status indicators */}
                            <div className="flex gap-2 text-xs">
                                {mouseOutside && (
                                    <span className="text-red-400">📍 Mouse Outside</span>
                                )}
                                {isAFK && (
                                    <span className="text-yellow-400">😴 AFK Detected</span>
                                )}
                                {isMuted && (
                                    <span className="text-orange-400">🔇 Audio Muted</span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Floating status indicators */}
            {mouseOutside && (
                <div className="fixed top-4 left-4 bg-red-900/80 border border-red-400 text-red-300 px-3 py-2 rounded-lg text-sm font-mono z-40">
                    🚨 Mouse left the facility perimeter
                </div>
            )}
            
            {isAFK && (
                <div className="fixed top-4 right-4 bg-yellow-900/80 border border-yellow-400 text-yellow-300 px-3 py-2 rounded-lg text-sm font-mono z-40">
                    ⏰ Subject appears inactive
                </div>
            )}

            <style jsx>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }
                
                @keyframes bounce {
                    0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
                    40%, 43% { transform: translateY(-10px); }
                    70% { transform: translateY(-5px); }
                    90% { transform: translateY(-2px); }
                }
            `}</style>
        </>
    );
}