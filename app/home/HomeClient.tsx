'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { signCookie } from "@/lib/cookie-utils";
import { researchLogs } from './ResearchLogs';
import EasterEggSystem from './EasterEggSystem';

const binaryStr = "01010111 01101000 01101001 01110011 01110000 01100101 01110010 01110011";
const hexCode = "0x31353a3235"; // 15:25

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
    const [easterEggState, setEasterEggState] = useState({
        refreshCount: 0,
        uniqueInteractions: new Set<string>(),
        visualChanges: {
            logsUnlocked: false,
            blinkingEnabled: false,
            colorsInverted: false
        }
    });

    const indexRef = useRef(0);
    const registerInteraction = useRef<(type: string, identifier: string) => void>(() => {});

    // Handle cookie-based redirects
    useEffect(() => {
        if (initialCookies.corrupt) {
            router.replace('/h0m3');
            return;
        }
        if (initialCookies.end || initialCookies.endQuestion) {
            router.replace('/the-end');
            return;
        }
    }, [initialCookies, router]);

    // System initialization
    useEffect(() => {
        const initSequence = async () => {
            setTimeout(() => setSystemStatus('ONLINE'), 1000);
            setTimeout(() => setSystemStatus('MONITORING'), 2000);

            if (initialCookies.noCorruption) {
                setModalMessage('System integrity verified. Proceed to diagnostic scroll.');
                setShowModal(true);
                await signCookie('Scroll_unlocked=true');
            }

            setCountdown(Math.floor(Math.random() * 6) + 5);
        };

        initSequence().catch(console.error);

        // Update facility data periodically
        const dataInterval = setInterval(() => {
            setFacilityData({
                temperature: (22 + Math.random() * 2).toFixed(1) + '°C',
                pressure: (1013 + Math.random() * 10 - 5).toFixed(2) + ' hPa',
                humidity: (45 + Math.random() * 10 - 5).toFixed(0) + '%',
                radiation: (0.1 + Math.random() * 0.1).toFixed(2) + ' μSv/h',
                power: (95 + Math.random() * 5).toFixed(1) + '%',
                network: Math.random() > 0.95 ? 'UNSTABLE' : 'SECURE'
            });
        }, 3000);

        return () => clearInterval(dataInterval);
    }, [initialCookies]);

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

    // Time-based unlock (15:25)
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

    // Konami code for corruption
    useEffect(() => {
        const sequence = [
            'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
            'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
            'KeyB', 'KeyA'
        ];

        const handler = async (e: KeyboardEvent) => {
            if (e.code === sequence[indexRef.current]) {
                indexRef.current++;
                if (indexRef.current === sequence.length) {
                    if (initialCookies.fileUnlocked) {
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
    }, [initialCookies.fileUnlocked]);

    // Handle binary hover
    const handleHover = () => {
        try {
            const decoded = binaryStr
                .split(' ')
                .map(b => String.fromCharCode(parseInt(b, 2)))
                .join('');
            setDecoded(decoded);
            registerInteraction.current('hover', 'binary');
        } catch {
            setDecoded('Error decoding');
        }
    };

    // Click handlers with interaction registration
    const handleClick = (element: string) => {
        registerInteraction.current('click', element);
    };

    const handleLogClick = (logId: string) => {
        registerInteraction.current('log', logId);
    };

    return (
        <EasterEggSystem onStateChange={setEasterEggState}>
            <div className="facility-layout">
                {/* Classification Banner */}
                <div className="classification-banner">
                    <div className="classification-content">
                        <span>RESTRICTED ACCESS • FACILITY 05-B • CLEARANCE LEVEL 5 REQUIRED • AUTHORIZED PERSONNEL ONLY • </span>
                        <span>RESTRICTED ACCESS • FACILITY 05-B • CLEARANCE LEVEL 5 REQUIRED • AUTHORIZED PERSONNEL ONLY • </span>
                    </div>
                </div>

                {/* Header */}
                <header className="facility-header">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div 
                                className="facility-logo cursor-pointer"
                                onClick={() => handleClick('logo')}
                            >
                                <div className="text-green-400 text-2xl font-mono font-bold">
                                    FACILITY 05-B
                                </div>
                                <div className={`status-indicator ${systemStatus.toLowerCase()}`}>
                                    <div className="status-dot"></div>
                                    <span>{systemStatus}</span>
                                </div>
                            </div>
                            <div 
                                className="facility-time cursor-pointer font-mono text-green-400"
                                onClick={() => handleClick('time')}
                            >
                                {new Date().toLocaleString()}
                            </div>
                        </div>
                    </div>
                </header>

                <main className="facility-main">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                                                <span 
                                                    className="cursor-pointer text-blue-400 hover:text-blue-300"
                                                    onClick={() => handleClick('status')}
                                                >
                                                    Standby for experimental results
                                                </span>
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
                                        </div>
                                    </div>

                                    <div className="metrics-grid">
                                        <div 
                                            className="metric-card consciousness cursor-pointer"
                                            onClick={() => handleClick('countdown')}
                                        >
                                            <div className="metric-label">SYSTEM TIMESTAMP</div>
                                            <div className="metric-value">
                                                {countdown === null ? 'Loading...' : countdown}
                                            </div>
                                            <div className="metric-unit">Countdown Active</div>
                                        </div>

                                        <div 
                                            className="metric-card temporal cursor-pointer"
                                            onClick={() => handleClick('hex')}
                                        >
                                            <div className="metric-label">HEX REFERENCE</div>
                                            <div className="metric-value">{hexCode}</div>
                                            <div className="metric-unit">System Reference Code</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Status Panels */}
                            <div className="space-y-6">
                                {/* Facility Status */}
                                <div className="facility-panel">
                                    <div className="panel-header">
                                        <h2 className="panel-title">FACILITY STATUS</h2>
                                    </div>
                                    <div className="status-grid">
                                        <div className="status-item">
                                            <span className="status-label">Temperature</span>
                                            <span 
                                                className="status-value cursor-pointer"
                                                onClick={() => handleClick('temperature')}
                                            >
                                                {facilityData.temperature}
                                            </span>
                                        </div>
                                        <div className="status-item">
                                            <span className="status-label">Pressure</span>
                                            <span 
                                                className="status-value cursor-pointer"
                                                onClick={() => handleClick('pressure')}
                                            >
                                                {facilityData.pressure}
                                            </span>
                                        </div>
                                        <div className="status-item">
                                            <span className="status-label">Humidity</span>
                                            <span 
                                                className="status-value cursor-pointer"
                                                onClick={() => handleClick('humidity')}
                                            >
                                                {facilityData.humidity}
                                            </span>
                                        </div>
                                        <div className="status-item">
                                            <span className="status-label">Radiation</span>
                                            <span 
                                                className="status-value cursor-pointer"
                                                onClick={() => handleClick('radiation')}
                                            >
                                                {facilityData.radiation}
                                            </span>
                                        </div>
                                        <div className="status-item">
                                            <span className="status-label">Power</span>
                                            <span 
                                                className="status-value cursor-pointer"
                                                onClick={() => handleClick('power')}
                                            >
                                                {facilityData.power}
                                            </span>
                                        </div>
                                        <div className="status-item">
                                            <span className="status-label">Network</span>
                                            <span 
                                                className={`status-value cursor-pointer ${facilityData.network === 'UNSTABLE' ? 'warning' : ''}`}
                                                onClick={() => handleClick('network')}
                                            >
                                                {facilityData.network}
                                            </span>
                                        </div>
                                    </div>
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
                                    </div>
                                </div>

                                {/* Research Logs */}
                                <div className="facility-panel">
                                    <div className="panel-header">
                                        <h2 className="panel-title">RESEARCH LOGS</h2>
                                        <p className="panel-subtitle">
                                            {easterEggState.visualChanges.logsUnlocked ? 'ACCESS GRANTED' : 'LOCKED'}
                                        </p>
                                    </div>
                                    <div className="logs-container">
                                        {researchLogs.slice(0, 3).map((log) => (
                                            <div
                                                key={log.id}
                                                className={`log-entry ${log.corrupted ? 'corrupted' : ''} ${
                                                    !easterEggState.visualChanges.logsUnlocked ? 'opacity-50 pointer-events-none' : ''
                                                }`}
                                                onClick={() => easterEggState.visualChanges.logsUnlocked && handleLogClick(log.id)}
                                            >
                                                <div className="log-header">
                                                    <div className="log-title">
                                                        {easterEggState.visualChanges.logsUnlocked ? log.title : '[LOCKED]'}
                                                    </div>
                                                    <div className={`classification ${log.classification.toLowerCase().replace(' ', '-')}`}>
                                                        {log.classification}
                                                    </div>
                                                </div>
                                                <div className="log-meta">
                                                    {easterEggState.visualChanges.logsUnlocked ? `${log.researcher} • ${log.date}` : 'CLASSIFIED'}
                                                </div>
                                                <div className="log-preview">
                                                    {easterEggState.visualChanges.logsUnlocked 
                                                        ? log.content.substring(0, 100) + '...'
                                                        : 'Access denied. Insufficient clearance level.'
                                                    }
                                                </div>
                                                {log.corrupted && easterEggState.visualChanges.logsUnlocked && (
                                                    <div className="corruption-warning">
                                                        ⚠ DATA CORRUPTION DETECTED
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Alerts */}
                                <div className="facility-panel alert-panel">
                                    <div className="panel-header">
                                        <h2 className="panel-title text-red-400">SYSTEM ALERTS</h2>
                                    </div>
                                    <div className="alerts-container">
                                        <div className="alert-item critical">
                                            <div className="alert-dot"></div>
                                            <span>Unauthorized access attempts detected</span>
                                        </div>
                                        <div className="alert-item warning">
                                            <div className="alert-dot"></div>
                                            <span>Psychological evaluation in progress</span>
                                        </div>
                                        <div className="alert-item critical">
                                            <div className="alert-dot"></div>
                                            <span>Emergency protocols on standby</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

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
            </div>
        </EasterEggSystem>
    );
}