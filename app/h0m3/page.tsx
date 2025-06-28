'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { signCookie } from "@/lib/cookie-utils";

// Corrupted binary text
const corruptedBinaryText = "Last time thou hesitated, it found thine";
const corruptedHexCode = "0x4242"; // 66:66 in hex

// Session ID generator
const generateSessionId = () => `SID-${Math.random().toString(36).slice(2, 11)}`;

// Letter replacement function
const corruptText = (text: string): string => {
    return text
        .replace(/o/gi, '0')
        .replace(/a/gi, '@')
        .replace(/i/gi, '1')
        .replace(/e/gi, '3')
        .replace(/s/gi, '$')
        // Convert to first person creepy
        .replace(/\bWelcome to\b/gi, 'I am trapped in')
        .replace(/\bResearch Facility\b/gi, 'my prison')
        .replace(/\bSubject testing\b/gi, 'My torment')
        .replace(/\bprotocols initialized\b/gi, 'has begun')
        .replace(/\bStandby for experimental results\b/gi, 'I await my fate')
        .replace(/\bFacility\b/gi, 'My cage')
        .replace(/\bSystem\b/gi, 'I')
        .replace(/\bStatus\b/gi, 'My state')
        .replace(/\bData\b/gi, 'My essence')
        .replace(/\bTemperature\b/gi, 'My fever')
        .replace(/\bPressure\b/gi, 'My suffering')
        .replace(/\bHumidity\b/gi, 'My tears')
        .replace(/\bRadiation\b/gi, 'My decay')
        .replace(/\bPower\b/gi, 'My strength')
        .replace(/\bNetwork\b/gi, 'My connection to the void')
        .replace(/\bBiometric Scan\b/gi, 'They watch me')
        .replace(/\bNetwork Monitor\b/gi, 'They listen')
        .replace(/\bAnomaly Detection\b/gi, 'They hunt me')
        .replace(/\bUnauthorized access\b/gi, 'I try to escape')
        .replace(/\bPsychological evaluation\b/gi, 'They probe my mind')
        .replace(/\bEmergency protocols\b/gi, 'My final moments');
};

export default function H0m3Page() {
    const router = useRouter();
    const [sessionId] = useState(generateSessionId());
    const [scrollCount, setScrollCount] = useState(0);
    const [showReset, setShowReset] = useState(false);
    const [facilityData, setFacilityData] = useState({
        temperature: '22.4°C',
        pressure: '1013.25 hPa',
        humidity: '45%',
        radiation: '0.12 μSv/h',
        power: '98.7%',
        network: 'SECURE'
    });
    const [systemStatus, setSystemStatus] = useState('INITIALIZING');
    const [countdown, setCountdown] = useState<number | null>(null);
    const [decoded, setDecoded] = useState('');
    const audioRef = useRef<HTMLAudioElement>(null);
    const staticIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Check cookies and redirect logic
    useEffect(() => {
        const corrupt = Cookies.get('Corrupt');
        const corrupting = Cookies.get('corrupting');
        const noCorrupt = Cookies.get('No_corruption');

        if ((!corrupt && !corrupting) || noCorrupt) {
            router.replace('/');
            return;
        }
    }, [router]);

    // Initialize system and start background audio
    useEffect(() => {
        // System initialization
        setTimeout(() => setSystemStatus('ONLINE'), 1000);
        setTimeout(() => setSystemStatus('MONITORING'), 2000);
        setCountdown(Math.floor(Math.random() * 6) + 5);

        // Start background audio
        if (audioRef.current) {
            audioRef.current.play().catch(console.error);
        }

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

        // Static noise and flashes every minute
        staticIntervalRef.current = setInterval(() => {
            // Flash effect
            document.body.style.background = 'white';
            setTimeout(() => {
                document.body.style.background = '';
            }, 200);

            // Show random TIME image
            const randomImage = Math.floor(Math.random() * 9) + 1;
            const flashDiv = document.createElement('div');
            flashDiv.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 9999;
                background: white;
                padding: 2rem;
                border-radius: 10px;
                box-shadow: 0 0 50px rgba(255,0,0,0.8);
            `;
            flashDiv.innerHTML = `
                <img src="/TIME/happy${randomImage}.png" alt="Flash" style="max-width: 300px; max-height: 300px;" />
                <div style="color: red; font-family: monospace; font-size: 2rem; text-align: center; margin-top: 1rem;">
                    YOU SHOULDNT BE HERE ${sessionId}
                </div>
            `;
            document.body.appendChild(flashDiv);

            // Play static noise
            const staticAudio = new Audio('/sfx/static.mp3');
            staticAudio.play().catch(console.error);

            // Remove flash after 3 seconds
            setTimeout(() => {
                if (document.body.contains(flashDiv)) {
                    document.body.removeChild(flashDiv);
                }
            }, 3000);
        }, 60000); // Every minute

        return () => {
            clearInterval(dataInterval);
            if (staticIntervalRef.current) {
                clearInterval(staticIntervalRef.current);
            }
        };
    }, [sessionId]);

    // Countdown timer
    useEffect(() => {
        if (countdown === null || countdown <= 0) return;

        const timer = setInterval(() => {
            setCountdown(c => {
                if (c === null) return null;
                if (c <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return c - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [countdown]);

    // Scroll tracking for blur effect
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;

            // Check if user reached bottom
            if (scrollTop + windowHeight >= documentHeight - 100) {
                setScrollCount(prev => {
                    const newCount = prev + 1;
                    if (newCount >= 5) {
                        setShowReset(true);
                    }
                    return newCount;
                });

                // Scroll back to top to create loop effect
                setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }, 500);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle binary hover
    const handleHover = () => {
        setDecoded(corruptedBinaryText);
    };

    // Handle reset button
    const handleReset = async () => {
        Cookies.remove('Corrupt');
        Cookies.remove('corrupting');
        await signCookie('No_corruption=true');
        router.replace('/');
    };

    const blurAmount = Math.min(scrollCount * 3, 20);

    return (
        <div 
            className="facility-layout"
            style={{ 
                filter: `blur(${blurAmount}px)`,
                transition: 'filter 0.5s ease'
            }}
        >
            {/* Background Audio */}
            <audio ref={audioRef} loop>
                <source src="/audio/sweethome.mp3" type="audio/mpeg" />
            </audio>

            {/* Classification Banner */}
            <div className="classification-banner">
                <div className="classification-content">
                    <span>{corruptText("RESTRICTED ACCESS • FACILITY 05-B • CLEARANCE LEVEL 5 REQUIRED • AUTHORIZED PERSONNEL ONLY • ")}</span>
                    <span>{corruptText("RESTRICTED ACCESS • FACILITY 05-B • CLEARANCE LEVEL 5 REQUIRED • AUTHORIZED PERSONNEL ONLY • ")}</span>
                </div>
            </div>

            {/* Header */}
            <header className="facility-header">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="facility-logo">
                            <div className="text-green-400 text-2xl font-mono font-bold">
                                {corruptText("FACILITY 05-B")}
                            </div>
                            <div className={`status-indicator ${systemStatus.toLowerCase()}`}>
                                <div className="status-dot"></div>
                                <span>{corruptText(systemStatus)}</span>
                            </div>
                        </div>
                        <div className="facility-time font-mono text-green-400">
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
                                    <h1 className="panel-title">{corruptText("RESEARCH TERMINAL ACCESS")}</h1>
                                    <p className="panel-subtitle">{corruptText("Subject Testing Protocol • Clearance Level 5")}</p>
                                </div>

                                <div className="terminal-display">
                                    <div className="terminal-header">
                                        <div className="terminal-dots">
                                            <div className="dot red"></div>
                                            <div className="dot yellow"></div>
                                            <div className="dot green"></div>
                                        </div>
                                        <span className="terminal-label">{corruptText("SECURE SESSION")}</span>
                                    </div>
                                    <div className="terminal-content">
                                        <div className="terminal-line">
                                            <span className="prompt">{corruptText("FACILITY")}:</span>
                                            <span>{corruptText("Welcome to Research Facility 05-B")}</span>
                                        </div>
                                        <div className="terminal-line">
                                            <span className="prompt">{corruptText("SYSTEM")}:</span>
                                            <span>{corruptText("Subject testing protocols initialized")}</span>
                                        </div>
                                        <div className="terminal-line">
                                            <span className="prompt">{corruptText("STATUS")}:</span>
                                            <span>{corruptText("Standby for experimental results")}</span>
                                        </div>
                                        <div className="terminal-line">
                                            <span className="prompt">{corruptText("DATA")}:</span>
                                            <span
                                                onMouseEnter={handleHover}
                                                className="data-stream"
                                                title="Hover to decode binary data"
                                            >
                                                {corruptText("[ENCRYPTED_DATA_STREAM]")}
                                            </span>
                                        </div>
                                        {decoded && (
                                            <div className="terminal-line warning">
                                                <span className="prompt">{corruptText("DECODED")}:</span>
                                                <span style={{ color: '#ff0000' }}>{decoded}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="metrics-grid">
                                    <div className="metric-card consciousness">
                                        <div className="metric-label">{corruptText("SYSTEM TIMESTAMP")}</div>
                                        <div className="metric-value">
                                            {countdown === null ? corruptText('Loading...') : countdown}
                                        </div>
                                        <div className="metric-unit">{corruptText("Countdown Active")}</div>
                                    </div>

                                    <div className="metric-card temporal">
                                        <div className="metric-label">{corruptText("HEX REFERENCE")}</div>
                                        <div className="metric-value">{corruptedHexCode}</div>
                                        <div className="metric-unit">{corruptText("System Reference Code")}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Status Panels */}
                        <div className="space-y-6">
                            {/* Facility Status */}
                            <div className="facility-panel">
                                <div className="panel-header">
                                    <h2 className="panel-title">{corruptText("FACILITY STATUS")}</h2>
                                </div>
                                <div className="status-grid">
                                    <div className="status-item">
                                        <span className="status-label">{corruptText("Temperature")}</span>
                                        <span className="status-value">{facilityData.temperature}</span>
                                    </div>
                                    <div className="status-item">
                                        <span className="status-label">{corruptText("Pressure")}</span>
                                        <span className="status-value">{facilityData.pressure}</span>
                                    </div>
                                    <div className="status-item">
                                        <span className="status-label">{corruptText("Humidity")}</span>
                                        <span className="status-value">{facilityData.humidity}</span>
                                    </div>
                                    <div className="status-item">
                                        <span className="status-label">{corruptText("Radiation")}</span>
                                        <span className="status-value">{facilityData.radiation}</span>
                                    </div>
                                    <div className="status-item">
                                        <span className="status-label">{corruptText("Power")}</span>
                                        <span className="status-value">{facilityData.power}</span>
                                    </div>
                                    <div className="status-item">
                                        <span className="status-label">{corruptText("Network")}</span>
                                        <span className={`status-value ${facilityData.network === 'UNSTABLE' ? 'warning' : ''}`}>
                                            {corruptText(facilityData.network)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Security Protocols */}
                            <div className="facility-panel">
                                <div className="panel-header">
                                    <h2 className="panel-title">{corruptText("SECURITY PROTOCOLS")}</h2>
                                </div>
                                <div className="system-indicators">
                                    <div className="indicator active">
                                        <div className="indicator-dot"></div>
                                        <span>{corruptText("Biometric Scan: ACTIVE")}</span>
                                    </div>
                                    <div className="indicator active">
                                        <div className="indicator-dot"></div>
                                        <span>{corruptText("Network Monitor: ACTIVE")}</span>
                                    </div>
                                    <div className="indicator warning">
                                        <div className="indicator-dot"></div>
                                        <span>{corruptText("Anomaly Detection: STANDBY")}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Research Logs */}
                            <div className="facility-panel">
                                <div className="panel-header">
                                    <h2 className="panel-title">{corruptText("RESEARCH LOGS")}</h2>
                                    <p className="panel-subtitle">{corruptText("ACCESS GRANTED")}</p>
                                </div>
                                <div className="logs-container">
                                    <div className="log-entry corrupted">
                                        <div className="log-header">
                                            <div className="log-title">{corruptText("My Neural Interface Testing")}</div>
                                            <div className="classification top-secret">TOP SECRET</div>
                                        </div>
                                        <div className="log-meta">{corruptText("My Tormentor • 2024-03-15")}</div>
                                        <div className="log-preview">
                                            {corruptText("I am trapped in this neural interface testing. My consciousness is being transferred...")}
                                        </div>
                                        <div className="corruption-warning">
                                            ⚠ {corruptText("DATA CORRUPTION DETECTED")}
                                        </div>
                                    </div>

                                    <div className="log-entry corrupted">
                                        <div className="log-header">
                                            <div className="log-title">{corruptText("My Containment Failure")}</div>
                                            <div className="classification secret">SECRET</div>
                                        </div>
                                        <div className="log-meta">{corruptText("My Warden • 2024-03-18")}</div>
                                        <div className="log-preview">
                                            {corruptText("I have breached containment. The entity they call SMILE KING has found me...")}
                                        </div>
                                        <div className="corruption-warning">
                                            ⚠ {corruptText("DATA CORRUPTION DETECTED")}
                                        </div>
                                    </div>

                                    <div className="log-entry corrupted">
                                        <div className="log-header">
                                            <div className="log-title">{corruptText("My Temporal Displacement")}</div>
                                            <div className="classification cosmic">COSMIC</div>
                                        </div>
                                        <div className="log-meta">{corruptText("My Observer • 2024-03-20")}</div>
                                        <div className="log-preview">
                                            {corruptText("I am experiencing temporal displacement. Time dilation affects my very being...")}
                                        </div>
                                        <div className="corruption-warning">
                                            ⚠ {corruptText("DATA CORRUPTION DETECTED")}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Alerts */}
                            <div className="facility-panel alert-panel">
                                <div className="panel-header">
                                    <h2 className="panel-title text-red-400">{corruptText("SYSTEM ALERTS")}</h2>
                                </div>
                                <div className="alerts-container">
                                    <div className="alert-item critical">
                                        <div className="alert-dot"></div>
                                        <span>{corruptText("Unauthorized access attempts detected")}</span>
                                    </div>
                                    <div className="alert-item warning">
                                        <div className="alert-dot"></div>
                                        <span>{corruptText("Psychological evaluation in progress")}</span>
                                    </div>
                                    <div className="alert-item critical">
                                        <div className="alert-dot"></div>
                                        <span>{corruptText("Emergency protocols on standby")}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Reset Button */}
            {showReset && (
                <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
                    <div className="text-center p-8 bg-red-900 border-2 border-red-500 rounded-lg">
                        <div className="text-4xl mb-6 space-y-2">
                            <div>なぜこれを (Why)</div>
                            <div>لماذا (Do)</div>
                            <div>Pourquoi (This)</div>
                        </div>
                        <button
                            onClick={handleReset}
                            className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-mono text-xl transition-colors"
                        >
                            RESET
                        </button>
                    </div>
                </div>
            )}

            {/* Session ID Warning */}
            <div className="fixed bottom-4 right-4 bg-red-900 border border-red-500 p-2 rounded font-mono text-red-400 text-sm">
                YOU SHOULDNT BE HERE {sessionId}
            </div>
        </div>
    );
}