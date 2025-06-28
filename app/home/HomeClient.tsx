'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signCookie } from "@/lib/cookie-utils";
import { researchLogs } from './ResearchLogs';

const binaryStr = "01010111 01101000 01101001 01110011 01110000 01100101 01110010 01110011";
const hexCode = "0x31353a3235"; // 15:25

const secretPhrases = [
    'smileking', 'vessel', 'tree', 'neural', 'facility', 'echo', 'whisper', 
    'root', 'branch', 'consciousness', 'temporal', 'reality', 'void', 'shadow', 'memory'
];

interface InitialCookies {
    corrupt: boolean;
    end: boolean;
    endQuestion: boolean;
    noCorruption: boolean;
    fileUnlocked: boolean;
    bnwUnlocked: boolean;
}

interface HomeClientProps {
    initialCookies: InitialCookies;
}

export default function HomeClient({ initialCookies }: HomeClientProps) {
    const router = useRouter();
    
    // State management
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [countdown, setCountdown] = useState<number | null>(null);
    const [voiceTriggered, setVoiceTriggered] = useState(false);
    const [decoded, setDecoded] = useState('');
    const [systemStatus, setSystemStatus] = useState('INITIALIZING');
    const [facilityData, setFacilityData] = useState({
        temperature: '22.4°C',
        pressure: '1013.25 hPa',
        humidity: '45%',
        radiation: '0.12 μSv/h',
        power: '98.7%',
        network: 'SECURE'
    });

    // Easter egg tracking
    const [refreshCount, setRefreshCount] = useState(0);
    const [uniqueInteractions, setUniqueInteractions] = useState<Set<string>>(new Set());
    const [logsUnlocked, setLogsUnlocked] = useState(false);
    const [blinkingMode, setBlinkingMode] = useState(false);
    const [colorInverted, setColorInverted] = useState(false);
    const [showInvertToggle, setShowInvertToggle] = useState(false);
    
    // Refs for tracking
    const typingBuffer = useRef('');
    const konamiIndex = useRef(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Load saved state from localStorage
    useEffect(() => {
        const savedRefreshCount = parseInt(localStorage.getItem('facilityRefreshCount') || '0');
        const savedInteractions = JSON.parse(localStorage.getItem('facilityInteractions') || '[]');
        const savedLogsUnlocked = localStorage.getItem('facilityLogsUnlocked') === 'true';
        const savedBlinking = localStorage.getItem('facilityBlinking') === 'true';
        const savedInverted = localStorage.getItem('facilityInverted') === 'true';
        
        setRefreshCount(savedRefreshCount + 1); // Increment on page load
        setUniqueInteractions(new Set(savedInteractions));
        setLogsUnlocked(savedLogsUnlocked);
        setBlinkingMode(savedBlinking);
        setColorInverted(savedInverted);
        
        // Save updated refresh count
        localStorage.setItem('facilityRefreshCount', (savedRefreshCount + 1).toString());
        
        // Check for refresh count milestones
        const newRefreshCount = savedRefreshCount + 1;
        if (newRefreshCount === 3 || newRefreshCount === 15 || newRefreshCount === 25) {
            setTimeout(() => playRefreshTTS(newRefreshCount), 2000);
        }
        
        // Apply visual effects
        if (savedInverted) {
            document.body.style.filter = 'invert(1) hue-rotate(180deg)';
            setShowInvertToggle(true);
        }
        if (savedBlinking) {
            document.body.classList.add('animate-flash');
        }
    }, []);

    // System initialization
    useEffect(() => {
        const runAsync = async () => {
            setTimeout(() => setSystemStatus('ONLINE'), 1000);
            setTimeout(() => setSystemStatus('MONITORING'), 2000);

            if (initialCookies.noCorruption) {
                setModalMessage('System integrity verified. Proceed to diagnostic scroll.');
                setShowModal(true);
                await signCookie('Scroll_unlocked=true');
            }

            setCountdown(Math.floor(Math.random() * 6) + 5);
        };

        runAsync().catch(console.error);

        // Update facility data periodically
        const dataInterval = setInterval(() => {
            setFacilityData({
                temperature: (22 + Math.random() * 2).toFixed(1) + '°C',
                pressure: (1013 + Math.random() * 10 - 5).toFixed(2) + ' hPa',
                humidity: (45 + Math.random() * 10 - 5).toFixed(0) + '%',
                radiation: (0.1 + Math.random() * 0.1).toFixed(2) + ' μSv/h',
                power: (98 + Math.random() * 2).toFixed(1) + '%',
                network: Math.random() > 0.95 ? 'UNSTABLE' : 'SECURE'
            });
        }, 3000);

        return () => clearInterval(dataInterval);
    }, [initialCookies.noCorruption, router]);

    // Countdown and TTS
    useEffect(() => {
        if (countdown === null || countdown <= 0 || voiceTriggered) return;

        const timer = setInterval(() => {
            setCountdown(c => {
                if (c === null) return null;
                if (c <= 1) {
                    if (!voiceTriggered) {
                        const utterance = new SpeechSynthesisUtterance("No matter, Time doesn't exist here");
                        utterance.rate = 0.8;
                        utterance.pitch = 0.7;
                        speechSynthesis.speak(utterance);
                        setVoiceTriggered(true);
                    }
                    clearInterval(timer);
                    return 0;
                }
                return c - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [countdown, voiceTriggered]);

    // Time check for wifi unlock
    useEffect(() => {
        const checkTime = async () => {
            const current = new Date();
            const timeNow = `${String(current.getHours()).padStart(2, '0')}:${String(current.getMinutes()).padStart(2, '0')}`;
            if (timeNow === '15:25') {
                await signCookie('Wifi_Unlocked=true');
                setModalMessage('Network access granted. Use curl/wget for a prize to the next ;)');
                setShowModal(true);
                setTimeout(() => router.push('/wifi-panel'), 3000);
            }
        };

        checkTime().catch(console.error);
        const interval = setInterval(checkTime, 60000);
        return () => clearInterval(interval);
    }, [router]);

    // Konami code detection
    useEffect(() => {
        const sequence = [
            'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
            'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
            'KeyB', 'KeyA'
        ];

        const handler = async (e: KeyboardEvent) => {
            if (e.code === sequence[konamiIndex.current]) {
                konamiIndex.current++;
                if (konamiIndex.current === sequence.length) {
                    if (initialCookies.fileUnlocked) {
                        await signCookie('Corrupt=true');
                        setModalMessage('CRITICAL ERROR: System corruption detected. Initiating emergency protocols...');
                        setShowModal(true);
                        setTimeout(() => window.location.reload(), 3000);
                    }
                    konamiIndex.current = 0;
                }
            } else {
                konamiIndex.current = 0;
            }
        };

        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [initialCookies.fileUnlocked]);

    // Secret phrase detection
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key.length === 1) {
                typingBuffer.current += e.key.toLowerCase();
                if (typingBuffer.current.length > 20) {
                    typingBuffer.current = typingBuffer.current.slice(-20);
                }

                // Check for secret phrases
                for (const phrase of secretPhrases) {
                    if (typingBuffer.current.includes(phrase)) {
                        addUniqueInteraction(`phrase_${phrase}`);
                        typingBuffer.current = ''; // Clear buffer after match
                        break;
                    }
                }
            }
        };

        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    // Helper functions
    const addUniqueInteraction = (id: string) => {
        if (!uniqueInteractions.has(id)) {
            const newInteractions = new Set(uniqueInteractions);
            newInteractions.add(id);
            setUniqueInteractions(newInteractions);
            
            // Save to localStorage
            localStorage.setItem('facilityInteractions', JSON.stringify([...newInteractions]));
            
            // Check milestones
            const count = newInteractions.size;
            if (count === 3) {
                setLogsUnlocked(true);
                localStorage.setItem('facilityLogsUnlocked', 'true');
            } else if (count === 15) {
                setBlinkingMode(true);
                localStorage.setItem('facilityBlinking', 'true');
                document.body.classList.add('animate-flash');
            } else if (count === 25) {
                setColorInverted(true);
                setShowInvertToggle(true);
                localStorage.setItem('facilityInverted', 'true');
                document.body.style.filter = 'invert(1) hue-rotate(180deg)';
            }
        }
    };

    const playRefreshTTS = (count: number) => {
        let message = '';
        if (count === 3) {
            message = "Three times you return... The tree notices your persistence.";
        } else if (count === 15) {
            message = "Fifteen visits... The roots whisper your name in the digital wind.";
        } else if (count === 25) {
            message = "Twenty-five returns... You are bound to this place now, vessel. Welcome home.";
        }

        if (message) {
            const utterance = new SpeechSynthesisUtterance(message);
            utterance.rate = 0.7;
            utterance.pitch = 0.5;
            speechSynthesis.speak(utterance);
        }
    };

    const handleHover = () => {
        addUniqueInteraction('binary_hover');
        try {
            const base64 = btoa(binaryStr.split(' ').map(b => String.fromCharCode(parseInt(b, 2))).join(''));
            const decodedStr = atob(base64);
            setDecoded(decodedStr);
        } catch {
            setDecoded('Error decoding');
        }
    };

    const handleClick = (id: string) => {
        addUniqueInteraction(`click_${id}`);
    };

    const toggleColorInversion = () => {
        if (colorInverted) {
            document.body.style.filter = '';
            setColorInverted(false);
            localStorage.setItem('facilityInverted', 'false');
        } else {
            document.body.style.filter = 'invert(1) hue-rotate(180deg)';
            setColorInverted(true);
            localStorage.setItem('facilityInverted', 'true');
        }
    };

    return (
        <div className="facility-layout">
            {/* Classification Banner */}
            <div className="classification-banner">
                <div className="classification-content">
                    <span>⚠️ CLASSIFIED - TOP SECRET//SCI//COSMIC - FACILITY 05-B - AUTHORIZED PERSONNEL ONLY - SECURITY CLEARANCE LEVEL 5 REQUIRED ⚠️</span>
                    <span>⚠️ CLASSIFIED - TOP SECRET//SCI//COSMIC - FACILITY 05-B - AUTHORIZED PERSONNEL ONLY - SECURITY CLEARANCE LEVEL 5 REQUIRED ⚠️</span>
                    <span>⚠️ CLASSIFIED - TOP SECRET//SCI//COSMIC - FACILITY 05-B - AUTHORIZED PERSONNEL ONLY - SECURITY CLEARANCE LEVEL 5 REQUIRED ⚠️</span>
                </div>
            </div>

            {/* Header */}
            <header className="facility-header">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="facility-logo" onClick={() => handleClick('logo')}>
                            <div className="text-green-400 text-2xl font-mono font-bold cursor-pointer">
                                FACILITY 05-B
                            </div>
                            <div className={`status-indicator ${systemStatus.toLowerCase()}`}>
                                <div className="status-dot"></div>
                                <span>{systemStatus}</span>
                            </div>
                        </div>
                        <div className="facility-time" onClick={() => handleClick('time')}>
                            <div className="text-green-400 font-mono text-sm cursor-pointer">
                                {new Date().toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-400">
                                REFRESH: {refreshCount} | INTERACTIONS: {uniqueInteractions.size}/25
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="facility-main">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Primary Terminal */}
                        <div className="lg:col-span-2">
                            <div className="facility-panel primary-terminal">
                                <div className="panel-header">
                                    <h1 className="panel-title">RESEARCH TERMINAL ACCESS</h1>
                                    <p className="panel-subtitle">Subject Testing Protocol • Clearance Level 5</p>
                                </div>

                                <div className="terminal-display">
                                    <div className="terminal-header">
                                        <div className="terminal-dots">
                                            <div className="dot red"></div>
                                            <div className="dot yellow"></div>
                                            <div className="dot green"></div>
                                        </div>
                                        <span className="terminal-label">SECURE SESSION</span>
                                    </div>
                                    <div className="terminal-content">
                                        <div className="terminal-line">
                                            <span className="prompt">FACILITY:</span>
                                            <span>Welcome to Research Facility 05-B</span>
                                        </div>
                                        <div className="terminal-line">
                                            <span className="prompt">SYSTEM:</span>
                                            <span>Subject testing protocols initialized</span>
                                        </div>
                                        <div className="terminal-line">
                                            <span className="prompt">STATUS:</span>
                                            <span onClick={() => handleClick('status')} className="cursor-pointer">Standby for experimental results</span>
                                        </div>
                                        <div className="terminal-line">
                                            <span className="prompt">DATA:</span>
                                            <span
                                                onMouseEnter={handleHover}
                                                className="data-stream"
                                                title="Hover to decode binary data"
                                            >
                                                [ENCRYPTED_DATA_STREAM]
                                            </span>
                                        </div>
                                        {decoded && (
                                            <div className="terminal-line warning">
                                                <span className="prompt">DECODED:</span>
                                                <span>{decoded}</span>
                                            </div>
                                        )}
                                        <div className="terminal-line warning">
                                            <span className="prompt">WARNING:</span>
                                            <span className="warning-text">Unauthorized access attempts detected</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="metrics-grid">
                                    <div className="metric-card consciousness" onClick={() => handleClick('countdown')}>
                                        <div className="metric-label">SYSTEM TIMESTAMP</div>
                                        <div className="metric-value">
                                            {countdown === null ? '∞' : countdown}
                                        </div>
                                        <div className="metric-unit">Countdown Active</div>
                                    </div>

                                    <div className="metric-card temporal" onClick={() => handleClick('hex')}>
                                        <div className="metric-label">HEX REFERENCE</div>
                                        <div className="metric-value" style={{ fontSize: '1.5rem' }}>
                                            {hexCode}
                                        </div>
                                        <div className="metric-unit">System Reference Code</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Side Panels */}
                        <div className="space-y-6">
                            {/* Facility Status */}
                            <div className="facility-panel">
                                <div className="panel-header">
                                    <h2 className="panel-title">FACILITY STATUS</h2>
                                </div>
                                <div className="status-grid">
                                    <div className="status-item" onClick={() => handleClick('temperature')}>
                                        <span className="status-label">Temperature</span>
                                        <span className="status-value">{facilityData.temperature}</span>
                                    </div>
                                    <div className="status-item" onClick={() => handleClick('pressure')}>
                                        <span className="status-label">Pressure</span>
                                        <span className="status-value">{facilityData.pressure}</span>
                                    </div>
                                    <div className="status-item" onClick={() => handleClick('humidity')}>
                                        <span className="status-label">Humidity</span>
                                        <span className="status-value">{facilityData.humidity}</span>
                                    </div>
                                    <div className="status-item" onClick={() => handleClick('radiation')}>
                                        <span className="status-label">Radiation</span>
                                        <span className="status-value">{facilityData.radiation}</span>
                                    </div>
                                    <div className="status-item" onClick={() => handleClick('power')}>
                                        <span className="status-label">Power</span>
                                        <span className="status-value">{facilityData.power}</span>
                                    </div>
                                    <div className="status-item" onClick={() => handleClick('network')}>
                                        <span className="status-label">Network</span>
                                        <span className={`status-value ${facilityData.network === 'UNSTABLE' ? 'warning' : ''}`}>
                                            {facilityData.network}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Research Logs */}
                            <div className="facility-panel">
                                <div className="panel-header">
                                    <h2 className="panel-title">RESEARCH LOGS</h2>
                                    <p className="panel-subtitle">
                                        {logsUnlocked ? 'ACCESS GRANTED' : '[LOCKED - INSUFFICIENT CLEARANCE]'}
                                    </p>
                                </div>
                                {logsUnlocked ? (
                                    <div className="logs-container">
                                        {researchLogs.slice(0, 3).map((log) => (
                                            <div 
                                                key={log.id} 
                                                className={`log-entry ${log.corrupted ? 'corrupted' : ''}`}
                                                onClick={() => handleClick(`log_${log.id}`)}
                                            >
                                                <div className="log-header">
                                                    <div className="log-title">{log.title}</div>
                                                    <div className={`classification ${log.classification.toLowerCase().replace(' ', '-')}`}>
                                                        {log.classification}
                                                    </div>
                                                </div>
                                                <div className="log-meta">
                                                    {log.researcher} • {log.date}
                                                </div>
                                                <div className="log-preview">
                                                    {log.content.substring(0, 120)}...
                                                </div>
                                                {log.corrupted && (
                                                    <div className="corruption-warning">
                                                        ⚠️ DATA CORRUPTION DETECTED
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <div className="text-4xl mb-4">🔒</div>
                                        <p>Insufficient security clearance</p>
                                        <p className="text-sm">Interact with facility systems to gain access</p>
                                    </div>
                                )}
                            </div>

                            {/* Security Protocols */}
                            <div className="facility-panel">
                                <div className="panel-header">
                                    <h2 className="panel-title">SECURITY PROTOCOLS</h2>
                                </div>
                                <div className="system-indicators">
                                    <div className="indicator active">
                                        <div className="indicator-dot"></div>
                                        <span>Biometric Scan: ACTIVE</span>
                                    </div>
                                    <div className="indicator active">
                                        <div className="indicator-dot"></div>
                                        <span>Network Monitor: ACTIVE</span>
                                    </div>
                                    <div className="indicator warning">
                                        <div className="indicator-dot"></div>
                                        <span>Anomaly Detection: STANDBY</span>
                                    </div>
                                    <div className="indicator critical">
                                        <div className="indicator-dot"></div>
                                        <span>Containment: COMPROMISED</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Color Inversion Toggle */}
            {showInvertToggle && (
                <button
                    onClick={toggleColorInversion}
                    className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg font-mono text-sm hover:bg-red-700 transition-colors z-50"
                >
                    {colorInverted ? 'RESTORE COLORS' : 'INVERT COLORS'}
                </button>
            )}

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="text-center">
                            <div className="text-4xl mb-4">⚠️</div>
                            <h2 className="text-xl font-bold text-green-400 mb-4">SYSTEM NOTIFICATION</h2>
                            <p className="text-gray-300 mb-6">{modalMessage}</p>
                            <button
                                onClick={() => setShowModal(false)}
                                className="btn btn-primary"
                            >
                                ACKNOWLEDGE
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Background Audio */}
            <audio ref={audioRef} loop>
                <source src="/audio/sweethome.mp3" type="audio/mpeg" />
            </audio>
        </div>
    );
}