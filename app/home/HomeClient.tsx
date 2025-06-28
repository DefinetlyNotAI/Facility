'use client';

import {useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import {signCookie} from "@/lib/cookie-utils";
import {ResearchLog, researchLogs} from "@/app/home/ResearchLogs";

const binaryStr = "01010111 01101000 01101001 01110011 01110000 01100101 01110010 01110011";
const hexCode = "0x31353a3235"; // 15:25
const facilityData = {
    temperature: '22.7°C',
    pressure: '1013.42 hPa',
    humidity: '43%',
    radiation: '0.09 μSv/h',
    powerOutput: '2.4 MW',
    networkStatus: 'SECURE'
};

const securityMetrics = {
    biometricScans: '1,247',
    accessAttempts: '23',
    breachAlerts: '0',
    activePersonnel: '156'
};

const systemMetrics = {
    cpuUsage: '67%',
    memoryUsage: '8.2/16 GB',
    diskSpace: '2.1/4.8 TB',
    networkTraffic: '847 MB/s'
};

interface InitialCookies {
    corrupt: boolean;
    end: boolean;
    endQuestion: boolean;
    noCorruption: boolean;
    fileUnlocked: boolean;
    bnwUnlocked: boolean;
}

export default function HomeClient({initialCookies}: {initialCookies: InitialCookies}) {
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [countdown, setCountdown] = useState<number | null>(null);
    const [voiceTriggered, setVoiceTriggered] = useState(false);
    const [binaryVisible, setBinaryVisible] = useState(false);
    const [systemStatus, setSystemStatus] = useState('INITIALIZING');
    const [showLogModal, setShowLogModal] = useState(false);
    const [selectedLog, setSelectedLog] = useState<ResearchLog | null>(null);
    const [currentTime, setCurrentTime] = useState<string>('');
    const [mounted, setMounted] = useState(false);
    const ambientAudioRef = useRef<HTMLAudioElement | null>(null);
    const indexRef = useRef(0);
    const ttsTriggeredRef = useRef(false); // Prevent TTS from triggering multiple times

    // Handle client-side mounting and time updates
    useEffect(() => {
        setMounted(true);

        const updateTime = () => {
            setCurrentTime(new Date().toLocaleString());
        };

        updateTime(); // Set initial time
        const timeInterval = setInterval(updateTime, 1000);

        return () => clearInterval(timeInterval);
    }, []);

    // Initialize ambient audio
    useEffect(() => {
        if (!mounted) return;

        const audio = new Audio('/audio/sweethome.mp3');
        audio.loop = true;
        audio.volume = 0.3;
        ambientAudioRef.current = audio;

        // Auto-play with user interaction fallback
        const playAudio = () => {
            audio.play().catch(() => {
                // If autoplay fails, wait for user interaction
                const handleInteraction = () => {
                    audio.play().catch(console.warn);
                    document.removeEventListener('click', handleInteraction);
                    document.removeEventListener('keydown', handleInteraction);
                };
                document.addEventListener('click', handleInteraction);
                document.addEventListener('keydown', handleInteraction);
            });
        };

        playAudio();

        return () => {
            audio.pause();
            audio.src = '';
        };
    }, [mounted]);

    // Cookie and redirect checks
    useEffect(() => {
        if (!mounted) return;

        if (initialCookies.corrupt) {
            router.replace('/h0m3');
            return;
        }

        const runAsync = async () => {
            // System initialization sequence
            setTimeout(() => setSystemStatus('ONLINE'), 1000);
            setTimeout(() => setSystemStatus('MONITORING'), 2000);

            if (initialCookies.noCorruption && !initialCookies.fileUnlocked) {
                setModalMessage('System integrity verified. Proceed to diagnostic scroll.');
                setShowModal(true);
                await signCookie('Scroll_unlocked=true');
            }

            setCountdown(Math.floor(Math.random() * 6) + 5);
        };

        runAsync().catch(console.error);
    }, [router, initialCookies, mounted]);

    // Countdown and TTS logic - FIXED to prevent double triggering
    useEffect(() => {
        if (!mounted || countdown === null || countdown <= 0 || voiceTriggered || ttsTriggeredRef.current) return;

        const timer = setInterval(() => {
            setCountdown(c => {
                if (c === null) return null;
                if (c <= 1) {
                    if (!ttsTriggeredRef.current) {
                        ttsTriggeredRef.current = true; // Prevent multiple triggers

                        // Pause ambient music for TTS
                        if (ambientAudioRef.current) {
                            ambientAudioRef.current.pause();
                        }

                        const utterance = new SpeechSynthesisUtterance(
                            "Time dissolves into the void... here, eternity and instant are one."
                        );
                        utterance.rate = 0.7;
                        utterance.pitch = 0.6;
                        utterance.volume = 0.8;

                        utterance.onend = () => {
                            // Resume ambient music after TTS
                            if (ambientAudioRef.current) {
                                ambientAudioRef.current.play().catch(console.warn);
                            }
                            setVoiceTriggered(true);
                        };

                        speechSynthesis.speak(utterance);
                    }
                    clearInterval(timer);
                    return null; // Will show ∞
                }
                return c - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [countdown, voiceTriggered, mounted]);

    // Time check for 15:25
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

        checkTime().catch(console.error);
        const interval = setInterval(checkTime, 60000);
        return () => clearInterval(interval);
    }, [router, mounted]);

    // Konami code detection
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
    }, [initialCookies.fileUnlocked, mounted]);

    const openLog = (log: ResearchLog) => {
        setSelectedLog(log);
        setShowLogModal(true);
    };

    // Don't render until mounted to prevent hydration mismatch
    if (!mounted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
                <div className="text-green-400 text-2xl font-mono animate-pulse">
                    INITIALIZING FACILITY SYSTEMS...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black facility-layout">
            {/* Scrolling Classification Banner */}
            <div className="classification-banner">
                <div className="classification-content">
                    <span>TOP SECRET//SCI//COSMIC - FACILITY 05-B - PROJECT VESSEL - AUTHORIZED PERSONNEL ONLY</span>
                    <span>TOP SECRET//SCI//COSMIC - FACILITY 05-B - PROJECT VESSEL - AUTHORIZED PERSONNEL ONLY</span>
                    <span>TOP SECRET//SCI//COSMIC - FACILITY 05-B - PROJECT VESSEL - AUTHORIZED PERSONNEL ONLY</span>
                </div>
            </div>

            {/* Main Header */}
            <header className="facility-header">
                <div className="container mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-8">
                            <div className="facility-logo">
                                <div className="text-4xl font-mono font-bold text-green-400">
                                    FACILITY 05-B
                                </div>
                                <div className="text-sm text-gray-400 font-mono">
                                    NEURAL INTERFACE RESEARCH COMPLEX
                                </div>
                            </div>
                            <div className={`status-indicator ${systemStatus.toLowerCase()}`}>
                                <div className="status-dot"></div>
                                <span className="status-text">{systemStatus}</span>
                            </div>
                        </div>
                        <div className="facility-time">
                            <div className="text-green-400 font-mono text-xl">
                                {currentTime}
                            </div>
                            <div className="text-xs text-gray-400">
                                FACILITY LOCAL TIME
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Grid */}
            <main className="facility-main">
                <div className="container mx-auto px-6 py-8">
                    {/* Top Row - Mission Critical Systems */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                        {/* Primary Terminal */}
                        <div className="lg:col-span-2">
                            <div className="facility-panel primary-terminal">
                                <div className="panel-header">
                                    <h2 className="panel-title">NEURAL INTERFACE TERMINAL</h2>
                                    <div className="panel-subtitle">Project VESSEL • Subject 31525 • Clearance COSMIC</div>
                                </div>

                                <div className="terminal-display">
                                    <div className="terminal-header">
                                        <div className="terminal-dots">
                                            <div className="dot red"></div>
                                            <div className="dot yellow"></div>
                                            <div className="dot green"></div>
                                        </div>
                                        <span className="terminal-label">SECURE NEURAL LINK</span>
                                    </div>

                                    <div className="terminal-content">
                                        <div className="terminal-line">
                                            <span className="prompt">FACILITY:</span> Neural Interface Research Complex 05-B
                                        </div>
                                        <div className="terminal-line">
                                            <span className="prompt">PROJECT:</span> VESSEL - Consciousness Transfer Protocol
                                        </div>
                                        <div className="terminal-line">
                                            <span className="prompt">SUBJECT:</span> 31525 - Neural compatibility: 97.3%
                                        </div>
                                        <div className="terminal-line">
                                            <span className="prompt">STATUS:</span> Transfer sequence initiated
                                        </div>
                                        <div className="terminal-line">
                                            <span className="prompt">DATA:</span>
                                            <span
                                                onMouseEnter={() => setBinaryVisible(true)}
                                                onMouseLeave={() => setBinaryVisible(false)}
                                                className="data-stream"
                                            >
                                                {binaryVisible ? binaryStr : '[NEURAL_DATA_STREAM]'}
                                            </span>
                                        </div>
                                        <div className="terminal-line warning">
                                            <span className="prompt">WARNING:</span>
                                            <span className="warning-text">
                                                Temporal displacement detected in Test Chamber 3
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="metrics-grid">
                                    <div className="metric-card consciousness">
                                        <div className="metric-label">CONSCIOUSNESS TIMER</div>
                                        <div className="metric-value">
                                            {countdown === null ? '∞' : countdown}
                                        </div>
                                        <div className="metric-unit">
                                            {countdown === null ? 'Time Dissolved' : 'Neural Sync Countdown'}
                                        </div>
                                    </div>
                                    <div className="metric-card temporal">
                                        <div className="metric-label">TEMPORAL REFERENCE</div>
                                        <div className="metric-value">{hexCode}</div>
                                        <div className="metric-unit">Reality Anchor Timestamp</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* System Status */}
                        <div className="facility-panel system-status">
                            <div className="panel-header">
                                <h2 className="panel-title">SYSTEM STATUS</h2>
                                <div className="panel-subtitle">Real-time Monitoring</div>
                            </div>

                            <div className="status-grid">
                                <div className="status-item">
                                    <span className="status-label">Temperature</span>
                                    <span className="status-value">{facilityData.temperature}</span>
                                </div>
                                <div className="status-item">
                                    <span className="status-label">Pressure</span>
                                    <span className="status-value">{facilityData.pressure}</span>
                                </div>
                                <div className="status-item">
                                    <span className="status-label">Humidity</span>
                                    <span className="status-value">{facilityData.humidity}</span>
                                </div>
                                <div className="status-item">
                                    <span className="status-label">Radiation</span>
                                    <span className="status-value">{facilityData.radiation}</span>
                                </div>
                                <div className="status-item">
                                    <span className="status-label">Power Output</span>
                                    <span className="status-value">{facilityData.powerOutput}</span>
                                </div>
                                <div className="status-item">
                                    <span className="status-label">Network</span>
                                    <span className="status-value">{facilityData.networkStatus}</span>
                                </div>
                            </div>

                            <div className="system-indicators">
                                <div className="indicator active">
                                    <div className="indicator-dot"></div>
                                    <span>Neural Interface: ACTIVE</span>
                                </div>
                                <div className="indicator active">
                                    <div className="indicator-dot"></div>
                                    <span>Consciousness Monitor: ACTIVE</span>
                                </div>
                                <div className="indicator warning">
                                    <div className="indicator-dot"></div>
                                    <span>Reality Anchors: DEGRADED</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Middle Row - Research and Security */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {/* Research Logs */}
                        <div className="facility-panel research-logs">
                            <div className="panel-header">
                                <h2 className="panel-title">RESEARCH LOGS</h2>
                                <div className="panel-subtitle">Project VESSEL Documentation Archive</div>
                            </div>

                            <div className="logs-container">
                                {researchLogs.slice(0, 6).map((log) => (
                                    <div
                                        key={log.id}
                                        onClick={() => openLog(log)}
                                        className={`log-entry ${log.corrupted ? 'corrupted' : 'normal'}`}
                                    >
                                        <div className="log-header">
                                            <h3 className="log-title">{log.title}</h3>
                                            <span className={`classification ${log.classification.toLowerCase().replace(' ', '-')}`}>
                                                {log.classification}
                                            </span>
                                        </div>
                                        <div className="log-meta">
                                            {log.id} | {log.researcher} | {log.date}
                                        </div>
                                        <div className="log-preview">
                                            {log.content.split('\n')[0].substring(0, 80)}...
                                        </div>
                                        {log.corrupted && (
                                            <div className="corruption-warning">
                                                ⚠️ DATA CORRUPTION DETECTED
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Security and Performance */}
                        <div className="space-y-8">
                            {/* Security Metrics */}
                            <div className="facility-panel security-panel">
                                <div className="panel-header">
                                    <h2 className="panel-title">SECURITY PROTOCOLS</h2>
                                    <div className="panel-subtitle">Access Control & Monitoring</div>
                                </div>

                                <div className="security-grid">
                                    <div className="security-metric">
                                        <span className="metric-label">Biometric Scans</span>
                                        <span className="metric-value">{securityMetrics.biometricScans}</span>
                                    </div>
                                    <div className="security-metric">
                                        <span className="metric-label">Access Attempts</span>
                                        <span className="metric-value warning">{securityMetrics.accessAttempts}</span>
                                    </div>
                                    <div className="security-metric">
                                        <span className="metric-label">Breach Alerts</span>
                                        <span className="metric-value">{securityMetrics.breachAlerts}</span>
                                    </div>
                                    <div className="security-metric">
                                        <span className="metric-label">Active Personnel</span>
                                        <span className="metric-value">{securityMetrics.activePersonnel}</span>
                                    </div>
                                </div>
                            </div>

                            {/* System Performance */}
                            <div className="facility-panel performance-panel">
                                <div className="panel-header">
                                    <h2 className="panel-title">SYSTEM PERFORMANCE</h2>
                                    <div className="panel-subtitle">Neural Processing Units</div>
                                </div>

                                <div className="performance-grid">
                                    <div className="perf-metric">
                                        <span className="metric-label">CPU Usage</span>
                                        <span className="metric-value warning">{systemMetrics.cpuUsage}</span>
                                    </div>
                                    <div className="perf-metric">
                                        <span className="metric-label">Memory</span>
                                        <span className="metric-value">{systemMetrics.memoryUsage}</span>
                                    </div>
                                    <div className="perf-metric">
                                        <span className="metric-label">Disk Space</span>
                                        <span className="metric-value">{systemMetrics.diskSpace}</span>
                                    </div>
                                    <div className="perf-metric">
                                        <span className="metric-label">Network</span>
                                        <span className="metric-value">{systemMetrics.networkTraffic}</span>
                                    </div>
                                </div>

                                <div className="neural-units">
                                    <div className="units-label">Neural Processing Units:</div>
                                    <div className="units-grid">
                                        {[...Array(16)].map((_, i) => (
                                            <div key={i} className={`unit ${
                                                i < 12 ? 'active' : i < 14 ? 'warning' : 'critical'
                                            }`}></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row - Critical Alerts and Information */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Critical Alerts */}
                        <div className="lg:col-span-2 facility-panel alert-panel">
                            <div className="panel-header">
                                <h2 className="panel-title">CRITICAL ALERTS</h2>
                                <div className="panel-subtitle">Active Incidents & Warnings</div>
                            </div>

                            <div className="alerts-container">
                                <div className="alert-item critical">
                                    <div className="alert-dot"></div>
                                    <span>Organic growth detected in Sector 7 ventilation</span>
                                </div>
                                <div className="alert-item critical">
                                    <div className="alert-dot"></div>
                                    <span>Subject 31525 consciousness fragmentation detected</span>
                                </div>
                                <div className="alert-item warning">
                                    <div className="alert-dot"></div>
                                    <span>Temporal displacement events in Test Chamber 3</span>
                                </div>
                                <div className="alert-item critical">
                                    <div className="alert-dot"></div>
                                    <span>Reality anchor stability: 23% and falling</span>
                                </div>
                                <div className="alert-item critical">
                                    <div className="alert-dot"></div>
                                    <span>Unknown root systems breaching foundation</span>
                                </div>
                                <div className="alert-item critical">
                                    <div className="alert-dot"></div>
                                    <span>Staff reporting shared consciousness events</span>
                                </div>
                            </div>
                        </div>

                        {/* Emergency Contacts */}
                        <div className="facility-panel contacts-panel">
                            <div className="panel-header">
                                <h2 className="panel-title">EMERGENCY CONTACTS</h2>
                                <div className="panel-subtitle">24/7 Response Teams</div>
                            </div>

                            <div className="contacts-list">
                                <div className="contact-item">
                                    <span>Neural Security:</span>
                                    <span className="contact-number">Ext. 2847</span>
                                </div>
                                <div className="contact-item">
                                    <span>Medical Emergency:</span>
                                    <span className="contact-number">Ext. 3156</span>
                                </div>
                                <div className="contact-item">
                                    <span>Technical Support:</span>
                                    <span className="contact-number">Ext. 4729</span>
                                </div>
                                <div className="contact-item">
                                    <span>Command Center:</span>
                                    <span className="contact-number">Ext. 1001</span>
                                </div>
                                <div className="contact-item emergency">
                                    <span>Containment Breach:</span>
                                    <span className="contact-number">Ext. 0000</span>
                                </div>
                            </div>
                        </div>

                        {/* Project Classification */}
                        <div className="facility-panel classification-panel">
                            <div className="panel-header">
                                <h2 className="panel-title">PROJECT CLASSIFICATION</h2>
                                <div className="panel-subtitle">Security Clearance Info</div>
                            </div>

                            <div className="classification-info">
                                <div className="class-item">
                                    <span>Security Level:</span>
                                    <span className="class-value cosmic">COSMIC</span>
                                </div>
                                <div className="class-item">
                                    <span>Compartment:</span>
                                    <span className="class-value">SCI//VESSEL</span>
                                </div>
                                <div className="class-item">
                                    <span>Project Code:</span>
                                    <span className="class-value">VESSEL-31525</span>
                                </div>
                                <div className="class-item">
                                    <span>Facility ID:</span>
                                    <span className="class-value">05-B</span>
                                </div>
                                <div className="class-item">
                                    <span>Tree Protocol:</span>
                                    <span className="class-value active">ACTIVE</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Research Log Modal */}
            {showLogModal && selectedLog && (
                <div className="modal-overlay" onClick={() => setShowLogModal(false)}>
                    <div className="modal-content max-w-6xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="mb-6">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className={`text-2xl font-bold ${selectedLog.corrupted ? 'text-red-400' : 'text-green-400'}`}>
                                    {selectedLog.title}
                                </h2>
                                <button
                                    onClick={() => setShowLogModal(false)}
                                    className="text-gray-400 hover:text-white text-3xl transition-colors"
                                >
                                    ×
                                </button>
                            </div>
                            <div className="text-sm text-gray-400 mb-6 flex flex-wrap gap-4">
                                <span className="font-mono bg-gray-800 px-2 py-1 rounded">{selectedLog.id}</span>
                                <span>{selectedLog.researcher}</span>
                                <span>{selectedLog.date}</span>
                                <span className={`px-3 py-1 rounded text-xs font-bold ${
                                    selectedLog.classification === 'COSMIC' ? 'bg-purple-900/50 text-purple-300' :
                                        selectedLog.classification === 'TOP SECRET' ? 'bg-red-900/50 text-red-300' :
                                            selectedLog.classification === 'SECRET' ? 'bg-orange-900/50 text-orange-300' :
                                                'bg-blue-900/50 text-blue-300'
                                }`}>
                                    {selectedLog.classification}
                                </span>
                            </div>
                        </div>
                        <div className={`terminal ${selectedLog.corrupted ? 'border-red-500/50' : ''} relative overflow-hidden`}>
                            {selectedLog.corrupted && (
                                <div className="absolute inset-0 bg-red-500/5 animate-pulse"></div>
                            )}
                            <div className="terminal-content relative z-10">
                                <pre className={`whitespace-pre-wrap text-sm leading-relaxed ${
                                    selectedLog.corrupted ? 'text-red-300' : 'text-green-300'
                                }`}>
                                    {selectedLog.content}
                                </pre>
                            </div>
                        </div>
                        {selectedLog.corrupted && (
                            <div className="mt-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                                <div className="text-red-400 text-sm font-bold mb-2 animate-pulse">
                                    ⚠️ DATA CORRUPTION WARNING
                                </div>
                                <div className="text-red-300 text-xs">
                                    This log file has been compromised by unknown interference. Some data may be
                                    unreliable or have been altered by external forces. Proceed with caution.
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* System Modal */}
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
    );
}