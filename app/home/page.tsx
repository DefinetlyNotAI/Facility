'use client';

import {useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import Cookies from 'js-cookie';
import {signCookie} from "@/lib/cookie-utils";

const binaryStr = "01010111 01101000 01101001 01110011 01110000 01100101 01110010 01110011";
const hexCode = "0x31353a3235"; // 15:25

const decodeBase64 = (bin: string) => {
    try {
        const byteStr = bin
            .split(' ')
            .map(b => String.fromCharCode(parseInt(b, 2)))
            .join('');
        return btoa(byteStr);
    } catch {
        return 'Error';
    }
};

// Fake log entries for atmosphere
const generateFakeLogs = () => [
    "SYSTEM: Neural pathway mapping initiated...",
    "WARNING: Anomalous brain activity detected in sector 7",
    "INFO: Subject 31525 showing resistance patterns",
    "ERROR: Memory fragmentation at 0x7FF8A2B4",
    "SYSTEM: Consciousness transfer at 23.7% completion",
    "WARNING: Temporal displacement detected",
    "INFO: Dream state synchronization active",
    "ERROR: Reality anchor failing - code 0xDEAD",
    "SYSTEM: Psychological barriers weakening",
    "WARNING: Subject awareness increasing beyond parameters",
    "INFO: Facility lockdown protocols engaged",
    "ERROR: Time loop detected in chamber 15",
    "SYSTEM: Memory wipe sequence standby",
    "WARNING: Entity breach in containment zone",
    "INFO: Smile King protocol activated",
];

export default function Home() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
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
        radiation: '0.12 μSv/h'
    });
    const [logs, setLogs] = useState<string[]>([]);
    const [showInfinity, setShowInfinity] = useState(false);
    const [currentTime, setCurrentTime] = useState<Date | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const loopAudioRef = useRef<HTMLAudioElement | null>(null);

    // Handle mounting to prevent hydration issues
    useEffect(() => {
        setMounted(true);
        setCurrentTime(new Date());
    }, []);

    // Handle redirects based on cookies
    useEffect(() => {
        if (!mounted) return;

        const corrupt = Cookies.get('Corrupt');
        const end = Cookies.get('End');
        const endQuestion = Cookies.get('End?');

        if (corrupt) {
            router.replace('/h0m3');
            return;
        }

        if (end || endQuestion) {
            router.replace('/the-end');
            return;
        }
    }, [router, mounted]);

    // Initialize system and populate logs
    useEffect(() => {
        if (!mounted) return;

        const runAsync = async () => {
            // System initialization sequence
            setTimeout(() => setSystemStatus('ONLINE'), 1000);
            setTimeout(() => setSystemStatus('MONITORING'), 2000);

            // Populate initial logs
            const initialLogs = generateFakeLogs().slice(0, 5);
            setLogs(initialLogs);

            // Handle No_corruption cookie
            if (Cookies.get('No_corruption')) {
                setModalMessage('System integrity verified. Proceed to diagnostic scroll.');
                setShowModal(true);
                await signCookie('Scroll_unlocked=true');
            }

            // Set initial countdown
            setCountdown(Math.floor(Math.random() * 6) + 5);
        };

        runAsync().catch(error => {
            console.error('Error caught:', error);
        });

        // Update facility data periodically
        const dataInterval = setInterval(() => {
            setFacilityData({
                temperature: (22 + Math.random() * 2).toFixed(1) + '°C',
                pressure: (1013 + Math.random() * 10 - 5).toFixed(2) + ' hPa',
                humidity: (45 + Math.random() * 10 - 5).toFixed(0) + '%',
                radiation: (0.1 + Math.random() * 0.1).toFixed(2) + ' μSv/h'
            });
        }, 3000);

        // Add new logs periodically
        const logInterval = setInterval(() => {
            const allLogs = generateFakeLogs();
            const randomLog = allLogs[Math.floor(Math.random() * allLogs.length)];
            setLogs(prev => {
                const newLogs = [...prev, randomLog];
                return newLogs.slice(-8); // Keep only last 8 logs
            });
        }, 4000);

        // Update current time every second
        const timeInterval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => {
            clearInterval(dataInterval);
            clearInterval(logInterval);
            clearInterval(timeInterval);
        };
    }, [router, mounted]);

    // Countdown logic with audio and infinity
    useEffect(() => {
        if (!mounted || countdown === null || countdown <= 0 || voiceTriggered) return;

        const timer = setInterval(() => {
            setCountdown(c => {
                if (c === null) return null;
                if (c <= 1) {
                    if (!voiceTriggered) {
                        // Play the "Time doesn't exist here" audio
                        const utterance = new SpeechSynthesisUtterance("Time doesn't exist here");
                        utterance.rate = 0.8;
                        utterance.pitch = 0.7;
                        speechSynthesis.speak(utterance);
                        setVoiceTriggered(true);
                        setShowInfinity(true);

                        // Start looping audio
                        if (loopAudioRef.current) {
                            loopAudioRef.current.play().catch(() => {});
                        }
                    }
                    clearInterval(timer);
                    return 0;
                }
                return c - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [countdown, voiceTriggered, mounted]);

    // Handle data hover to show binary
    const handleHover = () => {
        try {
            const base64 = decodeBase64(binaryStr);
            const decodedStr = atob(base64);
            setDecoded(decodedStr);
        } catch {
            setDecoded('Error decoding');
        }
    };

    // Check for 15:25 time
    useEffect(() => {
        if (!mounted) return;

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

        checkTime().catch(error => {
            console.error('Error caught:', error);
        });
        const interval = setInterval(checkTime, 60000);
        return () => clearInterval(interval);
    }, [router, mounted]);

    // Konami code for corruption
    const indexRef = useRef(0);
    useEffect(() => {
        if (!mounted) return;

        const sequence = [
            'ArrowUp', 'ArrowUp',
            'ArrowDown', 'ArrowDown',
            'ArrowLeft', 'ArrowRight',
            'ArrowLeft', 'ArrowRight',
            'KeyB', 'KeyA'
        ];

        const handler = async (e: KeyboardEvent) => {
            if (e.code === sequence[indexRef.current]) {
                indexRef.current++;
                if (indexRef.current === sequence.length) {
                    if (Cookies.get('File_Unlocked')) {
                        await signCookie('Corrupt=true');
                        setModalMessage('CRITICAL ERROR: System corruption detected. Initiating emergency protocols...');
                        setShowModal(true);
                        setTimeout(() => window.location.reload(), 3000);
                    }
                    indexRef.current = 0;
                }
            } else {
                indexRef.current = 0;
            }
        };

        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [mounted]);

    // Handle modal acknowledgment
    const handleAcknowledge = async () => {
        setShowModal(false);
        
        if (Cookies.get('No_corruption')) {
            // Wait a moment before redirecting to /scroll
            setTimeout(() => {
                router.push('/scroll');
            }, 500);
        } else if (Cookies.get('Corrupt')) {
            // Wait for user press before redirect to h0m3
            setTimeout(() => {
                router.push('/h0m3');
            }, 1000);
        }
    };

    // Don't render until mounted to prevent hydration issues
    if (!mounted || !currentTime) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-green-400 text-2xl font-mono animate-pulse">
                    INITIALIZING FACILITY SYSTEMS...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
            {/* Hidden audio elements */}
            <audio ref={audioRef} preload="auto">
                <source src="/sfx/time-loop.mp3" type="audio/mpeg" />
            </audio>
            <audio ref={loopAudioRef} loop preload="auto">
                <source src="/sfx/ambient-loop.mp3" type="audio/mpeg" />
            </audio>

            {/* Header */}
            <header className="border-b border-green-500/30 bg-black/50 backdrop-blur-sm">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="text-green-400 text-2xl font-mono font-bold">
                                FACILITY 05-B
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-mono ${
                                systemStatus === 'ONLINE' ? 'bg-green-500/20 text-green-400' :
                                    systemStatus === 'MONITORING' ? 'bg-blue-500/20 text-blue-400' :
                                        'bg-yellow-500/20 text-yellow-400'
                            }`}>
                                {systemStatus}
                            </div>
                        </div>
                        <div className="text-green-400 font-mono text-sm">
                            {currentTime.toLocaleString()}
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Terminal */}
                    <div className="lg:col-span-2">
                        <div className="card">
                            <div className="card-header">
                                <h1 className="card-title text-green-400">
                                    RESEARCH TERMINAL ACCESS
                                </h1>
                                <p className="card-subtitle">
                                    Subject Testing Protocol • Clearance Level 5
                                </p>
                            </div>

                            <div className="terminal mb-6">
                                <div className="terminal-header">
                                    <div className="terminal-dot red"></div>
                                    <div className="terminal-dot yellow"></div>
                                    <div className="terminal-dot green"></div>
                                    <span className="text-xs text-gray-400 ml-2">SECURE SESSION</span>
                                </div>
                                <div className="terminal-content">
                                    <div className="terminal-line">
                                        <span className="terminal-prompt">FACILITY:</span> Welcome to Research Facility 05-B
                                    </div>
                                    <div className="terminal-line">
                                        <span className="terminal-prompt">SYSTEM:</span> Subject testing protocols initialized
                                    </div>
                                    <div className="terminal-line">
                                        <span className="terminal-prompt">STATUS:</span> Standby for experimental results
                                    </div>
                                    <div className="terminal-line">
                                        <span className="terminal-prompt">DATA:</span>
                                        <span
                                            onMouseEnter={handleHover}
                                            className="cursor-pointer text-blue-400 hover:text-blue-300 transition-colors ml-2"
                                            title="Hover to decode binary data"
                                        >
                                            {decoded || binaryStr}
                                        </span>
                                    </div>
                                    {decoded && (
                                        <div className="terminal-line text-yellow-400">
                                            <span className="terminal-prompt">DECODED:</span> {decoded}
                                        </div>
                                    )}
                                    
                                    {/* Live logs */}
                                    <div className="mt-4 border-t border-gray-700 pt-2">
                                        <div className="text-xs text-gray-500 mb-2">LIVE SYSTEM LOGS:</div>
                                        {logs.map((log, index) => (
                                            <div key={index} className="terminal-line text-xs text-gray-400 animate-fadeInUp">
                                                <span className="text-green-500">[{currentTime.toLocaleTimeString()}]</span> {log}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                                    <h3 className="text-green-400 font-mono text-sm mb-2">SYSTEM TIMESTAMP</h3>
                                    <div className="text-2xl font-mono text-white">
                                        {showInfinity ? '∞' : (countdown === null ? 'Loading...' : countdown)}
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1">
                                        {showInfinity ? 'Time Loop Active' : 'Countdown Active'}
                                    </div>
                                </div>

                                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                                    <h3 className="text-green-400 font-mono text-sm mb-2">HEX REFERENCE</h3>
                                    <div className="text-xl font-mono text-cyan-400">
                                        {hexCode}
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1">System Reference Code</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Facility Status */}
                    <div className="space-y-6">
                        <div className="card">
                            <div className="card-header">
                                <h2 className="card-title text-sm">FACILITY STATUS</h2>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">Temperature</span>
                                    <span className="text-green-400 font-mono">{facilityData.temperature}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">Pressure</span>
                                    <span className="text-green-400 font-mono">{facilityData.pressure}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">Humidity</span>
                                    <span className="text-green-400 font-mono">{facilityData.humidity}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">Radiation</span>
                                    <span className="text-green-400 font-mono">{facilityData.radiation}</span>
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-header">
                                <h2 className="card-title text-sm">SECURITY PROTOCOLS</h2>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    <span className="text-sm text-gray-300">Biometric Scan: ACTIVE</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    <span className="text-sm text-gray-300">Network Monitor: ACTIVE</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                                    <span className="text-sm text-gray-300">Anomaly Detection: STANDBY</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                                    <span className="text-sm text-gray-300">Temporal Stability: UNSTABLE</span>
                                </div>
                            </div>
                        </div>

                        <div className="card card-danger">
                            <div className="card-header">
                                <h2 className="card-title text-sm text-red-400">WARNINGS</h2>
                            </div>
                            <div className="text-sm text-red-300">
                                <p>• Unauthorized access attempts detected</p>
                                <p>• Psychological evaluation in progress</p>
                                <p>• Emergency protocols on standby</p>
                                <p>• Time anomaly detected in sector 15</p>
                                <p>• Memory fragmentation increasing</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="text-center">
                            <div className="text-4xl mb-4">⚠️</div>
                            <h2 className="text-xl font-bold text-green-400 mb-4">SYSTEM NOTIFICATION</h2>
                            <p className="text-gray-300 mb-6">{modalMessage}</p>
                            <button
                                onClick={handleAcknowledge}
                                className="btn btn-primary"
                            >
                                ACKNOWLEDGE
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}