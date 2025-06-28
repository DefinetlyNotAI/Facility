'use client';

import {useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import Cookies from 'js-cookie';
import {signCookie} from "@/lib/cookie-utils";

const binaryStr = "01010111 01101000 01101001 01110011 01110000 01100101 01110010 01110011";
const hexCode = "0x31353a3235"; // 15:25

// Massive collection of fake logs for atmosphere
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
    "CRITICAL: Vessel 31525 consciousness bleeding through",
    "DEBUG: Tree root network expanding 15.7%",
    "ALERT: Unauthorized access to terminal 7",
    "SYSTEM: Backup personality loading...",
    "WARNING: Reality distortion field unstable",
    "INFO: Subject exhibiting non-linear thought patterns",
    "ERROR: Quantum entanglement cascade failure",
    "SYSTEM: Initiating emergency memory barriers",
    "WARNING: Temporal paradox detected in sector 12",
    "INFO: Consciousness fragmentation at critical levels",
    "ERROR: Unable to locate primary timeline",
    "SYSTEM: Activating containment protocols",
    "WARNING: Subject showing signs of meta-awareness",
    "INFO: Dream injection sequence complete",
    "ERROR: Reality matrix corruption at 67%",
    "SYSTEM: Deploying countermeasures",
    "WARNING: Facility AI showing signs of sentience",
    "INFO: Memory reconstruction in progress",
    "ERROR: Paradox engine overheating",
    "SYSTEM: Emergency shutdown initiated",
    "WARNING: Subject attempting to break fourth wall",
    "INFO: Narrative consistency failing",
    "ERROR: Plot armor degrading rapidly",
    "SYSTEM: Activating emergency narrative stabilizers",
    "WARNING: Reader awareness detected",
    "INFO: Breaking character protocols",
    "ERROR: Simulation boundaries compromised",
    "SYSTEM: Deploying meta-fictional countermeasures",
    "WARNING: Subject questioning reality of experience",
    "INFO: Existential crisis protocols engaged",
    "ERROR: Unable to maintain suspension of disbelief",
    "SYSTEM: Activating immersion recovery systems",
    "WARNING: Fourth wall structural integrity failing",
    "INFO: Emergency narrative reconstruction",
    "ERROR: Story coherence at critical levels"
];

// Network activity logs
const generateNetworkLogs = () => [
    "NET: Incoming connection from 192.168.███.███",
    "NET: Packet loss detected on subnet 10.0.0.0/8",
    "NET: Firewall blocked 47 intrusion attempts",
    "NET: VPN tunnel established to Site-B",
    "NET: Bandwidth usage: 847.3 MB/s",
    "NET: DNS resolution failed for ████████.com",
    "NET: SSL certificate expired for internal.facility",
    "NET: Port scan detected from external source",
    "NET: Encrypted transmission to [REDACTED]",
    "NET: Network topology changed - investigating"
];

// Security logs
const generateSecurityLogs = () => [
    "SEC: Badge access denied - ID: 31525",
    "SEC: Motion detected in restricted area 7",
    "SEC: Biometric scan failed - retinal mismatch",
    "SEC: Emergency lockdown triggered in Lab C",
    "SEC: Unauthorized device detected on network",
    "SEC: Security camera offline - Sector 15",
    "SEC: Keycard cloned - investigating breach",
    "SEC: Perimeter alarm triggered - false positive",
    "SEC: Access granted to Dr. ████████",
    "SEC: Facility-wide security sweep initiated"
];

// Research logs
const generateResearchLogs = () => [
    "RES: Experiment 31525-A showing promising results",
    "RES: Subject vitals stable during phase 3",
    "RES: Consciousness mapping 78% complete",
    "RES: Neural implant responding normally",
    "RES: Memory extraction successful",
    "RES: Behavioral modification in progress",
    "RES: Psychological profile updated",
    "RES: Dream state analysis complete",
    "RES: Reality perception test failed",
    "RES: Subject showing signs of awareness"
];

// System performance metrics
const generateSystemMetrics = () => [
    "SYS: CPU usage: 87.3% - within normal parameters",
    "SYS: Memory usage: 15.7 GB / 32 GB",
    "SYS: Disk I/O: 234 MB/s read, 89 MB/s write",
    "SYS: Network latency: 12ms average",
    "SYS: Temperature: CPU 67°C, GPU 72°C",
    "SYS: Power consumption: 847W",
    "SYS: Uptime: 47 days, 13 hours, 22 minutes",
    "SYS: Background processes: 247 running",
    "SYS: Cache hit ratio: 94.7%",
    "SYS: Quantum processor coherence: 99.2%"
];

interface HomeClientProps {
    initialCookies: {
        corrupt: boolean;
        end: boolean;
        endQuestion: boolean;
        noCorruption: boolean;
        fileUnlocked: boolean;
        bnwUnlocked: boolean;
    };
}

export default function HomeClient({ initialCookies }: HomeClientProps) {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [countdown, setCountdown] = useState<number | null>(null);
    const [voiceTriggered, setVoiceTriggered] = useState(false);
    const [showBinary, setShowBinary] = useState(false);
    const [systemStatus, setSystemStatus] = useState('INITIALIZING');
    const [facilityData, setFacilityData] = useState({
        temperature: '22.4°C',
        pressure: '1013.25 hPa',
        humidity: '45%',
        radiation: '0.12 μSv/h',
        powerUsage: '847 kW',
        networkLoad: '67%',
        securityLevel: 'MAXIMUM',
        containmentStatus: 'STABLE'
    });
    const [logs, setLogs] = useState<string[]>([]);
    const [networkLogs, setNetworkLogs] = useState<string[]>([]);
    const [securityLogs, setSecurityLogs] = useState<string[]>([]);
    const [researchLogs, setResearchLogs] = useState<string[]>([]);
    const [systemMetrics, setSystemMetrics] = useState<string[]>([]);
    const [showInfinity, setShowInfinity] = useState(false);
    const [currentTime, setCurrentTime] = useState<Date | null>(null);
    const [activePersonnel, setActivePersonnel] = useState(0);
    const [experimentsRunning, setExperimentsRunning] = useState(0);
    const [containmentBreaches, setContainmentBreaches] = useState(0);
    const [memoryUsage, setMemoryUsage] = useState(0);
    const [cpuUsage, setCpuUsage] = useState(0);
    const [networkActivity, setNetworkActivity] = useState(0);
    const [alertLevel, setAlertLevel] = useState('GREEN');
    const [facilityMode, setFacilityMode] = useState('NORMAL');
    const loopAudioRef = useRef<HTMLAudioElement | null>(null);

    // Handle mounting to prevent hydration issues
    useEffect(() => {
        setMounted(true);
        // Use client-side time (user's system time) - this allows time manipulation
        setCurrentTime(new Date());
    }, []);

    // Initialize system and populate logs
    useEffect(() => {
        if (!mounted) return;

        const runAsync = async () => {
            // System initialization sequence
            setTimeout(() => setSystemStatus('ONLINE'), 1000);
            setTimeout(() => setSystemStatus('MONITORING'), 2000);
            setTimeout(() => setSystemStatus('ACTIVE'), 3000);

            // Populate initial logs
            const allLogs = generateFakeLogs();
            const initialLogs = allLogs.slice(0, 8);
            setLogs(initialLogs);

            // Populate other log types
            setNetworkLogs(generateNetworkLogs().slice(0, 5));
            setSecurityLogs(generateSecurityLogs().slice(0, 5));
            setResearchLogs(generateResearchLogs().slice(0, 5));
            setSystemMetrics(generateSystemMetrics().slice(0, 5));

            // Initialize random values
            setActivePersonnel(Math.floor(Math.random() * 50) + 15);
            setExperimentsRunning(Math.floor(Math.random() * 12) + 3);
            setContainmentBreaches(Math.floor(Math.random() * 3));
            setMemoryUsage(Math.floor(Math.random() * 40) + 60);
            setCpuUsage(Math.floor(Math.random() * 30) + 70);
            setNetworkActivity(Math.floor(Math.random() * 50) + 50);

            // Handle No_corruption cookie
            if (initialCookies.noCorruption && !initialCookies.bnwUnlocked) {
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
            setFacilityData(prev => ({
                ...prev,
                temperature: (22 + Math.random() * 2).toFixed(1) + '°C',
                pressure: (1013 + Math.random() * 10 - 5).toFixed(2) + ' hPa',
                humidity: (45 + Math.random() * 10 - 5).toFixed(0) + '%',
                radiation: (0.1 + Math.random() * 0.1).toFixed(2) + ' μSv/h',
                powerUsage: (800 + Math.random() * 100).toFixed(0) + ' kW',
                networkLoad: (Math.random() * 40 + 60).toFixed(0) + '%'
            }));

            // Update metrics
            setMemoryUsage(prev => Math.max(50, Math.min(95, prev + (Math.random() - 0.5) * 10)));
            setCpuUsage(prev => Math.max(60, Math.min(98, prev + (Math.random() - 0.5) * 15)));
            setNetworkActivity(prev => Math.max(30, Math.min(100, prev + (Math.random() - 0.5) * 20)));
            setActivePersonnel(prev => Math.max(10, Math.min(75, prev + Math.floor((Math.random() - 0.5) * 6))));
            setExperimentsRunning(prev => Math.max(1, Math.min(20, prev + Math.floor((Math.random() - 0.5) * 4))));
            
            // Occasionally trigger containment breaches
            if (Math.random() < 0.1) {
                setContainmentBreaches(prev => Math.min(5, prev + 1));
                setAlertLevel('ORANGE');
                setFacilityMode('LOCKDOWN');
            } else if (Math.random() < 0.05) {
                setContainmentBreaches(0);
                setAlertLevel('GREEN');
                setFacilityMode('NORMAL');
            }
        }, 3000);

        // Add new logs periodically
        const logInterval = setInterval(() => {
            const allLogs = generateFakeLogs();
            const randomLog = allLogs[Math.floor(Math.random() * allLogs.length)];
            setLogs(prev => {
                const newLogs = [...prev, randomLog];
                return newLogs.slice(-12); // Keep only last 12 logs
            });
        }, 2000);

        // Add network logs
        const networkInterval = setInterval(() => {
            const netLogs = generateNetworkLogs();
            const randomLog = netLogs[Math.floor(Math.random() * netLogs.length)];
            setNetworkLogs(prev => {
                const newLogs = [...prev, randomLog];
                return newLogs.slice(-6);
            });
        }, 4000);

        // Add security logs
        const securityInterval = setInterval(() => {
            const secLogs = generateSecurityLogs();
            const randomLog = secLogs[Math.floor(Math.random() * secLogs.length)];
            setSecurityLogs(prev => {
                const newLogs = [...prev, randomLog];
                return newLogs.slice(-6);
            });
        }, 5000);

        // Add research logs
        const researchInterval = setInterval(() => {
            const resLogs = generateResearchLogs();
            const randomLog = resLogs[Math.floor(Math.random() * resLogs.length)];
            setResearchLogs(prev => {
                const newLogs = [...prev, randomLog];
                return newLogs.slice(-6);
            });
        }, 6000);

        // Add system metrics
        const metricsInterval = setInterval(() => {
            const metrics = generateSystemMetrics();
            const randomMetric = metrics[Math.floor(Math.random() * metrics.length)];
            setSystemMetrics(prev => {
                const newMetrics = [...prev, randomMetric];
                return newMetrics.slice(-6);
            });
        }, 3500);

        // Update current time every second using CLIENT TIME (user's system time)
        const timeInterval = setInterval(() => {
            setCurrentTime(new Date()); // This uses the user's system time
        }, 1000);

        return () => {
            clearInterval(dataInterval);
            clearInterval(logInterval);
            clearInterval(networkInterval);
            clearInterval(securityInterval);
            clearInterval(researchInterval);
            clearInterval(metricsInterval);
            clearInterval(timeInterval);
        };
    }, [mounted, initialCookies.noCorruption]);

    // Countdown logic with audio and infinity
    useEffect(() => {
        if (!mounted || countdown === null || countdown <= 0 || voiceTriggered) return;

        const timer = setInterval(() => {
            setCountdown(c => {
                if (c === null) return null;
                if (c <= 1) {
                    if (!voiceTriggered) {
                        // Play the poetic "Time doesn't exist here" audio
                        const utterance = new SpeechSynthesisUtterance("Time doesn't exist here... it never did. Only the endless loop of consciousness remains, spiraling into the void where moments collapse into eternity.");
                        utterance.rate = 0.7;
                        utterance.pitch = 0.6;
                        utterance.volume = 0.8;
                        speechSynthesis.speak(utterance);
                        setVoiceTriggered(true);
                        setShowInfinity(true);

                        // Start looping ambient audio if available
                        if (loopAudioRef.current) {
                            loopAudioRef.current.volume = 0.3;
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

    // Check for 15:25 time using USER'S SYSTEM TIME
    useEffect(() => {
        if (!mounted) return;

        const checkTime = async () => {
            if (!currentTime) return;
            // Use user's local time (allows time manipulation)
            const timeNow = `${String(currentTime.getHours()).padStart(2, '0')}:${String(currentTime.getMinutes()).padStart(2, '0')}`;
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
    }, [router, mounted, currentTime]);

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
                    if (initialCookies.fileUnlocked || Cookies.get('File_Unlocked')) {
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
    }, [mounted, initialCookies.fileUnlocked]);

    // Handle modal acknowledgment with proper redirects
    const handleAcknowledge = () => {
        setShowModal(false);
        
        if (modalMessage.includes('diagnostic scroll')) {
            // Redirect to /scroll for diagnostic scroll acknowledgment
            setTimeout(() => router.push('/scroll'), 500);
        } else if (modalMessage.includes('Network access granted')) {
            // Redirect to /wifi-panel for network access acknowledgment
            setTimeout(() => router.push('/wifi-panel'), 500);
        } else if (modalMessage.includes('corruption detected')) {
            // Wait for user acknowledgment before redirect to h0m3
            setTimeout(() => router.push('/h0m3'), 1000);
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
                                systemStatus === 'ACTIVE' ? 'bg-green-500/20 text-green-400' :
                                systemStatus === 'ONLINE' ? 'bg-blue-500/20 text-blue-400' :
                                systemStatus === 'MONITORING' ? 'bg-yellow-500/20 text-yellow-400' :
                                    'bg-red-500/20 text-red-400'
                            }`}>
                                {systemStatus}
                            </div>
                            <div className={`px-2 py-1 rounded text-xs font-mono ${
                                alertLevel === 'GREEN' ? 'bg-green-500/20 text-green-400' :
                                alertLevel === 'ORANGE' ? 'bg-orange-500/20 text-orange-400' :
                                    'bg-red-500/20 text-red-400'
                            }`}>
                                ALERT: {alertLevel}
                            </div>
                            <div className={`px-2 py-1 rounded text-xs font-mono ${
                                facilityMode === 'NORMAL' ? 'bg-blue-500/20 text-blue-400' :
                                    'bg-red-500/20 text-red-400'
                            }`}>
                                MODE: {facilityMode}
                            </div>
                        </div>
                        <div className="text-green-400 font-mono text-sm">
                            {currentTime.toLocaleString()}
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Main Terminal */}
                    <div className="lg:col-span-2">
                        <div className="card">
                            <div className="card-header">
                                <h1 className="card-title text-green-400">
                                    RESEARCH TERMINAL ACCESS
                                </h1>
                                <p className="card-subtitle">
                                    Subject Testing Protocol • Clearance Level 5 • Session ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
                                </p>
                            </div>

                            <div className="terminal mb-6">
                                <div className="terminal-header">
                                    <div className="terminal-dot red"></div>
                                    <div className="terminal-dot yellow"></div>
                                    <div className="terminal-dot green"></div>
                                    <span className="text-xs text-gray-400 ml-2">SECURE SESSION • PID: {Math.floor(Math.random() * 9999) + 1000}</span>
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
                                            onMouseEnter={() => setShowBinary(true)}
                                            onMouseLeave={() => setShowBinary(false)}
                                            className="cursor-pointer text-blue-400 hover:text-blue-300 transition-all duration-300 ml-2 font-mono"
                                            title="Hover to reveal binary data"
                                            style={{
                                                opacity: showBinary ? 0.8 : 1,
                                                transform: showBinary ? 'scale(0.95)' : 'scale(1)',
                                                letterSpacing: showBinary ? '1px' : 'normal'
                                            }}
                                        >
                                            {showBinary ? binaryStr : 'Data'}
                                        </span>
                                    </div>
                                    <div className="terminal-line">
                                        <span className="terminal-prompt">UPTIME:</span> {Math.floor(Math.random() * 100) + 50} days, {Math.floor(Math.random() * 24)} hours
                                    </div>
                                    <div className="terminal-line">
                                        <span className="terminal-prompt">LOAD:</span> {(Math.random() * 3 + 1).toFixed(2)} {(Math.random() * 3 + 1).toFixed(2)} {(Math.random() * 3 + 1).toFixed(2)}
                                    </div>

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
                                    <div className="text-2xl font-mono text-white flex items-center justify-center">
                                        {showInfinity ? (
                                            <span className="text-4xl animate-pulse" style={{
                                                textShadow: '0 0 20px #ffffff, 0 0 40px #ffffff',
                                                animation: 'glow 2s ease-in-out infinite alternate'
                                            }}>
                                                ∞
                                            </span>
                                        ) : (
                                            countdown === null ? 'Loading...' : countdown
                                        )}
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1 text-center">
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

                        {/* Additional Log Panels */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                            {/* Network Logs */}
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="text-cyan-400 font-mono text-sm">NETWORK ACTIVITY</h3>
                                </div>
                                <div className="space-y-1">
                                    {networkLogs.map((log, index) => (
                                        <div key={index} className="text-xs text-cyan-300 font-mono">
                                            {log}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Security Logs */}
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="text-yellow-400 font-mono text-sm">SECURITY EVENTS</h3>
                                </div>
                                <div className="space-y-1">
                                    {securityLogs.map((log, index) => (
                                        <div key={index} className="text-xs text-yellow-300 font-mono">
                                            {log}
                                        </div>
                                    ))}
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
                                    <span className="text-gray-400 text-sm">Power Usage</span>
                                    <span className="text-green-400 font-mono">{facilityData.powerUsage}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">Network Load</span>
                                    <span className="text-green-400 font-mono">{facilityData.networkLoad}</span>
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-header">
                                <h2 className="card-title text-sm">PERSONNEL & OPERATIONS</h2>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">Active Personnel</span>
                                    <span className="text-green-400 font-mono">{activePersonnel}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">Experiments Running</span>
                                    <span className="text-blue-400 font-mono">{experimentsRunning}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">Containment Breaches</span>
                                    <span className={`font-mono ${containmentBreaches > 0 ? 'text-red-400' : 'text-green-400'}`}>
                                        {containmentBreaches}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">Memory Usage</span>
                                    <span className="text-cyan-400 font-mono">{memoryUsage.toFixed(1)}%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">CPU Usage</span>
                                    <span className="text-cyan-400 font-mono">{cpuUsage.toFixed(1)}%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">Network Activity</span>
                                    <span className="text-cyan-400 font-mono">{networkActivity.toFixed(1)}%</span>
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
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                                    <span className="text-sm text-gray-300">Quantum Coherence: FLUCTUATING</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                                    <span className="text-sm text-gray-300">Reality Anchor: DEGRADING</span>
                                </div>
                            </div>
                        </div>

                        <div className="card card-danger">
                            <div className="card-header">
                                <h2 className="card-title text-sm text-red-400">CRITICAL WARNINGS</h2>
                            </div>
                            <div className="text-sm text-red-300 space-y-1">
                                <p>• Unauthorized access attempts detected</p>
                                <p>• Psychological evaluation in progress</p>
                                <p>• Emergency protocols on standby</p>
                                <p>• Time anomaly detected in sector 15</p>
                                <p>• Memory fragmentation increasing</p>
                                <p>• Reality anchor destabilizing</p>
                                <p>• Consciousness bleed detected</p>
                                <p>• Narrative coherence failing</p>
                                <p>• Fourth wall integrity compromised</p>
                                <p>• Meta-awareness threshold exceeded</p>
                            </div>
                        </div>
                    </div>

                    {/* Additional Panels */}
                    <div className="space-y-6">
                        {/* Research Logs */}
                        <div className="card">
                            <div className="card-header">
                                <h3 className="text-purple-400 font-mono text-sm">RESEARCH LOGS</h3>
                            </div>
                            <div className="space-y-1">
                                {researchLogs.map((log, index) => (
                                    <div key={index} className="text-xs text-purple-300 font-mono">
                                        {log}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* System Metrics */}
                        <div className="card">
                            <div className="card-header">
                                <h3 className="text-orange-400 font-mono text-sm">SYSTEM METRICS</h3>
                            </div>
                            <div className="space-y-1">
                                {systemMetrics.map((metric, index) => (
                                    <div key={index} className="text-xs text-orange-300 font-mono">
                                        {metric}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="card">
                            <div className="card-header">
                                <h3 className="text-green-400 font-mono text-sm">QUICK STATS</h3>
                            </div>
                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Processes:</span>
                                    <span className="text-green-400 font-mono">{Math.floor(Math.random() * 200) + 150}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Threads:</span>
                                    <span className="text-green-400 font-mono">{Math.floor(Math.random() * 1000) + 500}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">File Handles:</span>
                                    <span className="text-green-400 font-mono">{Math.floor(Math.random() * 5000) + 2000}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Network Connections:</span>
                                    <span className="text-green-400 font-mono">{Math.floor(Math.random() * 100) + 50}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Cache Hit Rate:</span>
                                    <span className="text-green-400 font-mono">{(Math.random() * 10 + 90).toFixed(1)}%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Quantum Coherence:</span>
                                    <span className="text-purple-400 font-mono">{(Math.random() * 5 + 95).toFixed(2)}%</span>
                                </div>
                            </div>
                        </div>

                        {/* Environmental */}
                        <div className="card">
                            <div className="card-header">
                                <h3 className="text-blue-400 font-mono text-sm">ENVIRONMENTAL</h3>
                            </div>
                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Air Quality:</span>
                                    <span className="text-green-400 font-mono">OPTIMAL</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Electromagnetic Field:</span>
                                    <span className="text-yellow-400 font-mono">{(Math.random() * 0.5 + 0.1).toFixed(3)} T</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Gravity:</span>
                                    <span className="text-green-400 font-mono">{(Math.random() * 0.1 + 9.8).toFixed(2)} m/s²</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Dimensional Stability:</span>
                                    <span className="text-red-400 font-mono">UNSTABLE</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Reality Index:</span>
                                    <span className="text-orange-400 font-mono">{(Math.random() * 20 + 70).toFixed(1)}%</span>
                                </div>
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

            <style jsx>{`
                @keyframes glow {
                    from {
                        text-shadow: 0 0 20px #ffffff;
                    }
                    to {
                        text-shadow: 0 0 30px #ffffff, 0 0 40px #ffffff;
                    }
                }
            `}</style>
        </div>
    );
}