'use client';

import {useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import Cookies from 'js-cookie';
import {signCookie} from "@/lib/cookie-utils";

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

interface ResearchLog {
    id: string;
    title: string;
    researcher: string;
    date: string;
    classification: string;
    content: string;
    corrupted?: boolean;
}

const researchLogs: ResearchLog[] = [
    {
        id: "LOG-001",
        title: "Initial Subject Response Analysis",
        researcher: "Dr. Sarah Chen",
        date: "2025-01-15",
        classification: "CONFIDENTIAL",
        content: `Subject 31525 shows remarkable adaptation to neural interface protocols. Initial consciousness mapping reveals unusual patterns in temporal perception sectors. Recommend continued observation with enhanced monitoring protocols.

Neural coherence: 94.7%
Temporal displacement: 0.003ms
Memory retention: 98.2%

Note: Subject exhibits heightened awareness during interface sessions. Possible breakthrough in consciousness transfer technology.`
    },
    {
        id: "LOG-002",
        title: "Anomalous Readings - Session 47",
        researcher: "Dr. Marcus Webb",
        date: "2025-01-18",
        classification: "SECRET",
        content: `WARNING: Unprecedented neural feedback detected during today's session. Subject 31525 appears to be accessing restricted memory sectors without authorization.

Timeline corruption detected at 15:25:00
Reality anchor stability: 67% (CRITICAL)
Containment breach probability: 12%

Immediate protocol review required. Recommend temporary suspension of deep interface procedures.`,
        corrupted: true
    },
    {
        id: "LOG-003",
        title: "Consciousness Transfer Protocol Update",
        researcher: "Dr. Elena Vasquez",
        date: "2025-01-20",
        classification: "TOP SECRET",
        content: `New developments in Project VESSEL show promising results. Subject demonstrates ability to maintain coherent thought patterns during extended transfer sessions.

Transfer duration: 47 minutes (new record)
Consciousness integrity: 99.1%
Side effects: Minimal temporal displacement

Proceeding to Phase 3 trials with enhanced safety protocols.`
    },
    {
        id: "LOG-004",
        title: "█████████ ███ ████████",
        researcher: "██████████",
        date: "2025-01-██",
        classification: "████████",
        content: `[DATA CORRUPTED]

███ subject shows ████████ to ███████ protocols. ████████ in sector ██ requires immediate ████████.

WARNING: ████████ breach detected
Reality ██████: ██%
Containment ████████: ███%

[TRANSMISSION INTERRUPTED]
[ERROR: MEMORY SECTOR DAMAGED]
[ATTEMPTING RECOVERY...]
[RECOVERY FAILED]`,
        corrupted: true
    },
    {
        id: "LOG-005",
        title: "Facility Security Breach Report",
        researcher: "Security Chief Rodriguez",
        date: "2025-01-22",
        classification: "EYES ONLY",
        content: `Unauthorized access detected in Sector 7. Subject 31525 somehow accessed restricted terminals during routine maintenance window.

Security footage shows subject interacting with systems beyond their clearance level. No physical breach detected - appears to be consciousness-based infiltration.

Recommend immediate review of neural interface security protocols. This should not be possible with current containment measures.`
    },
    {
        id: "LOG-006",
        title: "Project VESSEL - Final Phase",
        researcher: "Dr. ████████",
        date: "2025-01-██",
        classification: "COSMIC",
        content: `The tree grows deeper than we anticipated. Subject 31525 has exceeded all parameters. The vessel is ready.

Phase 4 initiation: ██:██:██
Consciousness transfer: COMPLETE
Reality anchor: DISABLED
Containment: ████████

They are no longer just a subject. They are becoming something else. Something we cannot control.

[LOG ENDS]`,
        corrupted: true
    }
];

export default function HomeClient({initialCookies}: {initialCookies: InitialCookies}) {
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [countdown, setCountdown] = useState<number | null>(null);
    const [voiceTriggered, setVoiceTriggered] = useState(false);
    const [showBinary, setShowBinary] = useState(false);
    const [systemStatus, setSystemStatus] = useState('INITIALIZING');
    const [selectedLog, setSelectedLog] = useState<ResearchLog | null>(null);
    const [showLogModal, setShowLogModal] = useState(false);
    
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const indexRef = useRef(0);

    // Static facility data
    const facilityData = {
        temperature: '22.4°C',
        pressure: '1013.25 hPa',
        humidity: '45%',
        radiation: '0.12 μSv/h',
        powerOutput: '2.4 MW',
        networkLatency: '0.3ms'
    };

    const securityMetrics = {
        biometricScans: '1,247',
        accessAttempts: '89',
        breachAlerts: '0',
        activePersonnel: '23'
    };

    const systemMetrics = {
        cpuUsage: '67%',
        memoryUsage: '8.2/16 GB',
        diskSpace: '2.1/5.0 TB',
        networkTraffic: '156 MB/s'
    };

    useEffect(() => {
        // Start ambient music
        const audio = new Audio('/media/sweethome.mp3');
        audio.loop = true;
        audio.volume = 0.3;
        audioRef.current = audio;
        
        audio.play().catch(() => {
            // Autoplay failed, user interaction required
        });

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

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, [initialCookies.noCorruption]);

    useEffect(() => {
        if (countdown === null || countdown <= 0 || voiceTriggered) return;

        const timer = setInterval(() => {
            setCountdown(c => {
                if (c === null) return null;
                if (c <= 1) {
                    if (!voiceTriggered) {
                        // Pause ambient music
                        if (audioRef.current) {
                            audioRef.current.pause();
                        }
                        
                        const utterance = new SpeechSynthesisUtterance("Time dissolves into the void... here, eternity and instant are one");
                        utterance.rate = 0.8;
                        utterance.pitch = 0.7;
                        utterance.onend = () => {
                            // Resume ambient music
                            if (audioRef.current) {
                                audioRef.current.play().catch(() => {});
                            }
                        };
                        speechSynthesis.speak(utterance);
                        setVoiceTriggered(true);
                    }
                    clearInterval(timer);
                    return '∞';
                }
                return c - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [countdown, voiceTriggered]);

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

    useEffect(() => {
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
    }, [initialCookies.fileUnlocked]);

    const openLog = (log: ResearchLog) => {
        setSelectedLog(log);
        setShowLogModal(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
            {/* Classification Banner */}
            <div className="bg-red-900 text-white text-center py-2 font-mono text-sm font-bold">
                TOP SECRET//SCI//COSMIC - FACILITY 05-B - VESSEL PROJECT COMPARTMENT - AUTHORIZED PERSONNEL ONLY
            </div>

            {/* Header */}
            <header className="border-b border-green-500/30 bg-black/50 backdrop-blur-sm">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="text-green-400 text-2xl font-mono font-bold">
                                RESEARCH FACILITY 05-B
                            </div>
                            <div className="text-sm text-gray-400">
                                Neural Interface Research Division • Consciousness Transfer Laboratory
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
                            {new Date().toLocaleString()} | CLEARANCE: LEVEL-5
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                {/* Main Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    
                    {/* Left Column - Main Terminal */}
                    <div className="lg:col-span-2">
                        <div className="card mb-6">
                            <div className="card-header">
                                <h1 className="card-title text-green-400">
                                    NEURAL INTERFACE TERMINAL
                                </h1>
                                <p className="card-subtitle">
                                    Subject Testing Protocol • Project VESSEL • Session Active
                                </p>
                            </div>

                            <div className="terminal mb-6">
                                <div className="terminal-header">
                                    <div className="terminal-dot red"></div>
                                    <div className="terminal-dot yellow"></div>
                                    <div className="terminal-dot green"></div>
                                    <span className="text-xs text-gray-400 ml-2">NEURAL LINK ESTABLISHED</span>
                                </div>
                                <div className="terminal-content">
                                    <div className="terminal-line">
                                        <span className="terminal-prompt">FACILITY:</span> Neural Interface Research Division Online
                                    </div>
                                    <div className="terminal-line">
                                        <span className="terminal-prompt">PROJECT:</span> VESSEL - Consciousness Transfer Protocol
                                    </div>
                                    <div className="terminal-line">
                                        <span className="terminal-prompt">SUBJECT:</span> ID-31525 | Status: ACTIVE | Clearance: COSMIC
                                    </div>
                                    <div className="terminal-line">
                                        <span className="terminal-prompt">NEURAL:</span> Bandwidth: 10.7 THz | Coherence: 94.7% | Latency: 0.003ms
                                    </div>
                                    <div className="terminal-line">
                                        <span className="terminal-prompt">DATA:</span>
                                        <span
                                            onMouseEnter={() => setShowBinary(true)}
                                            onMouseLeave={() => setShowBinary(false)}
                                            className="cursor-pointer text-blue-400 hover:text-blue-300 transition-colors ml-2"
                                            title="Hover to reveal encrypted data stream"
                                        >
                                            {showBinary ? binaryStr : '[ENCRYPTED_DATA_STREAM]'}
                                        </span>
                                    </div>
                                    <div className="terminal-line">
                                        <span className="terminal-prompt">QUANTUM:</span> Processor Array: 16-Core | Memory: 2.1 PB | Sync: 99.97%
                                    </div>
                                    <div className="terminal-line">
                                        <span className="terminal-prompt">TEMPORAL:</span> Displacement: Minimal | Anchor: Stable | Drift: 0.001%
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                                    <h3 className="text-green-400 font-mono text-sm mb-2">TEMPORAL COUNTDOWN</h3>
                                    <div className="text-3xl font-mono text-white">
                                        {countdown === null ? 'Loading...' : countdown}
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1">System Synchronization</div>
                                </div>

                                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                                    <h3 className="text-green-400 font-mono text-sm mb-2">REFERENCE CODE</h3>
                                    <div className="text-xl font-mono text-cyan-400">
                                        {hexCode}
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1">Neural Access Key</div>
                                </div>
                            </div>
                        </div>

                        {/* Research Logs Section */}
                        <div className="card">
                            <div className="card-header">
                                <h2 className="card-title text-green-400">RESEARCH LOGS</h2>
                                <p className="card-subtitle">Project VESSEL Documentation Archive</p>
                            </div>
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {researchLogs.map((log) => (
                                    <div
                                        key={log.id}
                                        onClick={() => openLog(log)}
                                        className={`p-3 rounded border cursor-pointer transition-all hover:bg-gray-700/50 ${
                                            log.corrupted 
                                                ? 'border-red-500/30 bg-red-900/10' 
                                                : 'border-gray-600 bg-gray-800/30'
                                        }`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className={`font-mono text-sm ${log.corrupted ? 'text-red-400' : 'text-green-400'}`}>
                                                    {log.id} - {log.title}
                                                </div>
                                                <div className="text-xs text-gray-400">
                                                    {log.researcher} | {log.date}
                                                </div>
                                            </div>
                                            <div className={`text-xs px-2 py-1 rounded ${
                                                log.classification === 'COSMIC' ? 'bg-purple-900/50 text-purple-300' :
                                                log.classification === 'TOP SECRET' ? 'bg-red-900/50 text-red-300' :
                                                log.classification === 'SECRET' ? 'bg-orange-900/50 text-orange-300' :
                                                'bg-blue-900/50 text-blue-300'
                                            }`}>
                                                {log.classification}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Status Panels */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Top Row - Facility Status */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="card">
                                <div className="card-header">
                                    <h2 className="card-title text-sm">ENVIRONMENTAL SYSTEMS</h2>
                                </div>
                                <div className="space-y-3">
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
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400 text-sm">Power Output</span>
                                        <span className="text-green-400 font-mono">{facilityData.powerOutput}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400 text-sm">Network Latency</span>
                                        <span className="text-green-400 font-mono">{facilityData.networkLatency}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="card">
                                <div className="card-header">
                                    <h2 className="card-title text-sm">SECURITY METRICS</h2>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400 text-sm">Biometric Scans</span>
                                        <span className="text-green-400 font-mono">{securityMetrics.biometricScans}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400 text-sm">Access Attempts</span>
                                        <span className="text-yellow-400 font-mono">{securityMetrics.accessAttempts}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400 text-sm">Breach Alerts</span>
                                        <span className="text-green-400 font-mono">{securityMetrics.breachAlerts}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400 text-sm">Active Personnel</span>
                                        <span className="text-green-400 font-mono">{securityMetrics.activePersonnel}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Middle Row - System Performance */}
                        <div className="card">
                            <div className="card-header">
                                <h2 className="card-title text-sm">SYSTEM PERFORMANCE</h2>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">CPU Usage</span>
                                    <span className="text-yellow-400 font-mono">{systemMetrics.cpuUsage}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">Memory</span>
                                    <span className="text-green-400 font-mono">{systemMetrics.memoryUsage}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">Disk Space</span>
                                    <span className="text-green-400 font-mono">{systemMetrics.diskSpace}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">Network</span>
                                    <span className="text-green-400 font-mono">{systemMetrics.networkTraffic}</span>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Row - Warnings */}
                        <div className="card card-danger">
                            <div className="card-header">
                                <h2 className="card-title text-sm text-red-400">SYSTEM ALERTS</h2>
                            </div>
                            <div className="text-sm text-red-300 space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                                    <span>Neural interface anomaly detected in Sector 7</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                                    <span>Consciousness transfer protocol requires calibration</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                                    <span>Reality anchor stability below optimal threshold</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                                    <span>Temporal displacement monitoring active</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Information */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                        <h3 className="text-green-400 font-mono text-sm mb-2">EMERGENCY CONTACTS</h3>
                        <div className="text-xs text-gray-300 space-y-1">
                            <div>Security: Ext. 2847</div>
                            <div>Medical: Ext. 3156</div>
                            <div>Technical: Ext. 4729</div>
                            <div>Command: Ext. 1001</div>
                        </div>
                    </div>
                    
                    <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                        <h3 className="text-green-400 font-mono text-sm mb-2">FACILITY SPECIFICATIONS</h3>
                        <div className="text-xs text-gray-300 space-y-1">
                            <div>Neural Cores: 16 Active</div>
                            <div>Quantum Processors: 8 Online</div>
                            <div>Memory Banks: 2.1 PB</div>
                            <div>Power Grid: 2.4 MW</div>
                        </div>
                    </div>
                    
                    <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                        <h3 className="text-green-400 font-mono text-sm mb-2">CLASSIFICATION</h3>
                        <div className="text-xs text-gray-300 space-y-1">
                            <div>Level: TOP SECRET//SCI</div>
                            <div>Compartment: COSMIC</div>
                            <div>Project: VESSEL</div>
                            <div>Facility: 05-B</div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Research Log Modal */}
            {showLogModal && selectedLog && (
                <div className="modal-overlay" onClick={() => setShowLogModal(false)}>
                    <div className="modal-content max-w-4xl" onClick={e => e.stopPropagation()}>
                        <div className="mb-4">
                            <div className="flex justify-between items-start mb-2">
                                <h2 className={`text-xl font-bold ${selectedLog.corrupted ? 'text-red-400' : 'text-green-400'}`}>
                                    {selectedLog.title}
                                </h2>
                                <button
                                    onClick={() => setShowLogModal(false)}
                                    className="text-gray-400 hover:text-white text-2xl"
                                >
                                    ×
                                </button>
                            </div>
                            <div className="text-sm text-gray-400 mb-4">
                                <span className="font-mono">{selectedLog.id}</span> | 
                                <span className="ml-2">{selectedLog.researcher}</span> | 
                                <span className="ml-2">{selectedLog.date}</span> | 
                                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                                    selectedLog.classification === 'COSMIC' ? 'bg-purple-900/50 text-purple-300' :
                                    selectedLog.classification === 'TOP SECRET' ? 'bg-red-900/50 text-red-300' :
                                    selectedLog.classification === 'SECRET' ? 'bg-orange-900/50 text-orange-300' :
                                    'bg-blue-900/50 text-blue-300'
                                }`}>
                                    {selectedLog.classification}
                                </span>
                            </div>
                        </div>
                        <div className={`terminal ${selectedLog.corrupted ? 'border-red-500/50' : ''}`}>
                            <div className="terminal-content">
                                <pre className={`whitespace-pre-wrap text-sm ${
                                    selectedLog.corrupted ? 'text-red-300' : 'text-green-300'
                                }`}>
                                    {selectedLog.content}
                                </pre>
                            </div>
                        </div>
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