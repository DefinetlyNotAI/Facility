'use client';

import {useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import Cookies from 'js-cookie';
import {signCookie} from "@/lib/cookie-utils";

const binaryStr = "01010111 01101000 01101001 01110011 01110000 01100101 01110010 01110011";
const hexCode = "0x31353a3235"; // 15:25

// Massive collection of facility documentation and procedures
const facilityDocumentation = {
    procedures: [
        "PROCEDURE 05-B-001: Personnel Entry and Exit Protocols",
        "PROCEDURE 05-B-002: Biometric Authentication Requirements",
        "PROCEDURE 05-B-003: Emergency Evacuation Routes and Assembly Points",
        "PROCEDURE 05-B-004: Hazardous Material Handling Guidelines",
        "PROCEDURE 05-B-005: Psychological Evaluation Scheduling",
        "PROCEDURE 05-B-006: Memory Extraction and Storage Protocols",
        "PROCEDURE 05-B-007: Consciousness Transfer Safety Guidelines",
        "PROCEDURE 05-B-008: Reality Anchor Maintenance Procedures",
        "PROCEDURE 05-B-009: Temporal Anomaly Response Protocols",
        "PROCEDURE 05-B-010: Containment Breach Emergency Response",
        "PROCEDURE 05-B-011: Neural Interface Calibration Standards",
        "PROCEDURE 05-B-012: Dream State Monitoring Requirements",
        "PROCEDURE 05-B-013: Quantum Coherence Measurement Protocols",
        "PROCEDURE 05-B-014: Dimensional Stability Assessment Guidelines",
        "PROCEDURE 05-B-015: Subject Psychological Profile Documentation"
    ],
    regulations: [
        "REGULATION 31525-A: All personnel must undergo weekly psychological evaluations",
        "REGULATION 31525-B: Memory extraction sessions limited to 4 hours maximum",
        "REGULATION 31525-C: Reality anchor systems must be checked every 2 hours",
        "REGULATION 31525-D: Consciousness transfer requires dual authorization",
        "REGULATION 31525-E: Temporal anomalies must be reported within 5 minutes",
        "REGULATION 31525-F: Neural interface connections require medical supervision",
        "REGULATION 31525-G: Dream state monitoring must be continuous during experiments",
        "REGULATION 31525-H: Quantum coherence levels must remain above 85%",
        "REGULATION 31525-I: Dimensional stability readings below 70% trigger lockdown",
        "REGULATION 31525-J: Subject awareness levels must not exceed threshold parameters"
    ],
    safetyProtocols: [
        "SAFETY PROTOCOL ALPHA: Immediate evacuation if reality anchor fails",
        "SAFETY PROTOCOL BETA: Emergency memory wipe if subject awareness exceeds 90%",
        "SAFETY PROTOCOL GAMMA: Facility lockdown if temporal anomaly detected",
        "SAFETY PROTOCOL DELTA: Consciousness transfer abort if coherence drops below 80%",
        "SAFETY PROTOCOL EPSILON: Neural interface disconnect if feedback loop detected",
        "SAFETY PROTOCOL ZETA: Dream state emergency wake if nightmare threshold exceeded",
        "SAFETY PROTOCOL ETA: Quantum field stabilization if coherence fluctuates",
        "SAFETY PROTOCOL THETA: Dimensional anchor activation if reality index drops",
        "SAFETY PROTOCOL IOTA: Subject isolation if meta-awareness detected",
        "SAFETY PROTOCOL KAPPA: Emergency protocol if fourth wall breach occurs"
    ],
    technicalSpecs: [
        "TECHNICAL SPECIFICATION TS-001: Neural Interface Bandwidth: 10.7 THz",
        "TECHNICAL SPECIFICATION TS-002: Memory Storage Capacity: 847.3 Petabytes",
        "TECHNICAL SPECIFICATION TS-003: Consciousness Transfer Rate: 15.2 GB/s",
        "TECHNICAL SPECIFICATION TS-004: Reality Anchor Power Consumption: 2.4 MW",
        "TECHNICAL SPECIFICATION TS-005: Temporal Stabilizer Frequency: 432.1 Hz",
        "TECHNICAL SPECIFICATION TS-006: Quantum Processor Clock Speed: 847 QHz",
        "TECHNICAL SPECIFICATION TS-007: Dream State Resolution: 8K Neural Mapping",
        "TECHNICAL SPECIFICATION TS-008: Psychological Profile Accuracy: 99.7%",
        "TECHNICAL SPECIFICATION TS-009: Dimensional Anchor Range: 15.25 km radius",
        "TECHNICAL SPECIFICATION TS-010: Meta-Awareness Detection Sensitivity: 0.001%"
    ],
    operationalNotes: [
        "OPERATIONAL NOTE 2025-01-25-001: Subject 31525 showing increased resistance to memory extraction",
        "OPERATIONAL NOTE 2025-01-25-002: Reality anchor in Sector 7 requires recalibration",
        "OPERATIONAL NOTE 2025-01-25-003: Temporal anomaly detected at 15:25 local time",
        "OPERATIONAL NOTE 2025-01-25-004: Consciousness transfer efficiency down 3.7%",
        "OPERATIONAL NOTE 2025-01-25-005: Neural interface showing intermittent connectivity issues",
        "OPERATIONAL NOTE 2025-01-25-006: Dream state monitoring equipment needs maintenance",
        "OPERATIONAL NOTE 2025-01-25-007: Quantum coherence fluctuating in Laboratory C",
        "OPERATIONAL NOTE 2025-01-25-008: Dimensional stability readings inconsistent",
        "OPERATIONAL NOTE 2025-01-25-009: Subject awareness levels approaching threshold",
        "OPERATIONAL NOTE 2025-01-25-010: Meta-fictional elements detected in subject responses"
    ]
};

// Massive collection of fake logs for atmosphere
const generateFakeLogs = () => [
    "SYSTEM: Neural pathway mapping initiated for Subject 31525...",
    "WARNING: Anomalous brain activity detected in temporal lobe region",
    "INFO: Subject 31525 showing resistance patterns to memory extraction",
    "ERROR: Memory fragmentation at address 0x7FF8A2B4C890",
    "SYSTEM: Consciousness transfer protocol at 23.7% completion",
    "WARNING: Temporal displacement detected in Laboratory Sector 7",
    "INFO: Dream state synchronization active - REM cycle monitoring",
    "ERROR: Reality anchor failing - emergency stabilization required",
    "SYSTEM: Psychological barriers weakening - implementing countermeasures",
    "WARNING: Subject awareness increasing beyond acceptable parameters",
    "INFO: Facility lockdown protocols engaged - all personnel report",
    "ERROR: Time loop detected in experimental chamber 15",
    "SYSTEM: Memory wipe sequence on standby - authorization pending",
    "WARNING: Entity breach detected in containment zone Delta",
    "INFO: Smile King protocol activated - psychological evaluation required",
    "CRITICAL: Vessel 31525 consciousness bleeding through dimensional barriers",
    "DEBUG: Tree root network expanding at rate of 15.7% per hour",
    "ALERT: Unauthorized terminal access detected on workstation 7",
    "SYSTEM: Backup personality matrix loading from secure storage",
    "WARNING: Reality distortion field showing signs of instability",
    "INFO: Subject exhibiting non-linear thought patterns and temporal awareness",
    "ERROR: Quantum entanglement cascade failure in processing unit 3",
    "SYSTEM: Initiating emergency memory barrier reconstruction",
    "WARNING: Temporal paradox detected in experimental sector 12",
    "INFO: Consciousness fragmentation reaching critical threshold levels",
    "ERROR: Unable to locate primary timeline reference point",
    "SYSTEM: Activating emergency containment protocols immediately",
    "WARNING: Subject showing signs of meta-awareness and fourth wall recognition",
    "INFO: Dream injection sequence completed successfully",
    "ERROR: Reality matrix corruption detected at 67.3% integrity",
    "SYSTEM: Deploying advanced countermeasures and stabilization protocols",
    "WARNING: Facility AI showing signs of emergent sentience",
    "INFO: Memory reconstruction process currently in progress",
    "ERROR: Paradox engine overheating - cooling systems engaged",
    "SYSTEM: Emergency shutdown sequence initiated by administrator",
    "WARNING: Subject attempting to break fourth wall barriers",
    "INFO: Narrative consistency protocols failing systematically",
    "ERROR: Plot armor degrading rapidly - story integrity compromised",
    "SYSTEM: Activating emergency narrative stabilization systems",
    "WARNING: Reader awareness detected through meta-fictional analysis",
    "INFO: Breaking character protocols engaged for damage control",
    "ERROR: Simulation boundaries compromised - reality bleed detected",
    "SYSTEM: Deploying meta-fictional countermeasures immediately",
    "WARNING: Subject questioning fundamental reality of experience",
    "INFO: Existential crisis protocols engaged - psychological support required",
    "ERROR: Unable to maintain suspension of disbelief in subject",
    "SYSTEM: Activating immersion recovery systems and narrative repair",
    "WARNING: Fourth wall structural integrity failing catastrophically",
    "INFO: Emergency narrative reconstruction protocols initiated",
    "ERROR: Story coherence at critical levels - immediate intervention required"
];

// Network activity logs
const generateNetworkLogs = () => [
    "NET: Incoming encrypted connection from 192.168.███.███ on port 31525",
    "NET: Packet loss detected on neural network subnet 10.0.0.0/8",
    "NET: Firewall blocked 847 intrusion attempts in last 60 seconds",
    "NET: Secure VPN tunnel established to Research Site-B",
    "NET: Current bandwidth usage: 847.3 MB/s (73% of total capacity)",
    "NET: DNS resolution failed for classified.facility.internal",
    "NET: SSL certificate expired for neural-interface.facility.local",
    "NET: Advanced persistent threat detected from external source",
    "NET: Encrypted quantum transmission to [REDACTED] facility",
    "NET: Network topology changed - investigating unauthorized modifications",
    "NET: Neural interface bandwidth allocation: 10.7 THz reserved",
    "NET: Consciousness transfer protocol using 15.2 GB/s sustained",
    "NET: Reality anchor communication link established successfully",
    "NET: Temporal stabilizer network synchronization complete",
    "NET: Dream state monitoring network operating at full capacity"
];

// Security logs
const generateSecurityLogs = () => [
    "SEC: Badge access denied for personnel ID: 31525 - insufficient clearance",
    "SEC: Motion detected in restricted Laboratory Sector 7 after hours",
    "SEC: Biometric scan failed - retinal pattern mismatch detected",
    "SEC: Emergency lockdown triggered in Consciousness Transfer Lab C",
    "SEC: Unauthorized neural interface device detected on secure network",
    "SEC: Security camera offline in Sector 15 - investigating malfunction",
    "SEC: Keycard cloned - investigating potential security breach",
    "SEC: Perimeter alarm triggered - determined to be false positive",
    "SEC: Access granted to Dr. ████████ for Memory Extraction Lab",
    "SEC: Facility-wide security sweep initiated by administrator",
    "SEC: Reality anchor security protocols engaged automatically",
    "SEC: Temporal anomaly detection system activated in all sectors",
    "SEC: Consciousness monitoring security barriers reinforced",
    "SEC: Dream state access controls updated with new parameters",
    "SEC: Meta-awareness detection systems operating at maximum sensitivity"
];

// Research logs
const generateResearchLogs = () => [
    "RES: Experiment 31525-A showing promising neural pathway results",
    "RES: Subject vital signs stable during consciousness transfer phase 3",
    "RES: Neural pathway mapping 78.4% complete - excellent progress",
    "RES: Memory extraction implant responding within normal parameters",
    "RES: Successful memory extraction of 847.3 GB personal data",
    "RES: Behavioral modification protocols showing 67% effectiveness",
    "RES: Psychological profile updated with new personality markers",
    "RES: Dream state analysis complete - REM patterns documented",
    "RES: Reality perception test results: Subject failed awareness check",
    "RES: Subject showing signs of increased meta-cognitive awareness",
    "RES: Consciousness transfer efficiency improved to 94.7%",
    "RES: Neural interface calibration completed successfully",
    "RES: Memory reconstruction protocols tested and verified",
    "RES: Temporal awareness suppression showing mixed results",
    "RES: Quantum consciousness entanglement experiment initiated"
];

// System performance metrics
const generateSystemMetrics = () => [
    "SYS: CPU usage: 87.3% - within acceptable operational parameters",
    "SYS: Memory usage: 15.7 GB / 32 GB total system memory",
    "SYS: Disk I/O: 234 MB/s read, 89 MB/s write operations",
    "SYS: Network latency: 12ms average across all connections",
    "SYS: Temperature: CPU 67°C, GPU 72°C, Neural Processor 45°C",
    "SYS: Power consumption: 847W total facility draw",
    "SYS: System uptime: 47 days, 13 hours, 22 minutes continuous",
    "SYS: Background processes: 247 running, 15 suspended",
    "SYS: Cache hit ratio: 94.7% - excellent performance",
    "SYS: Quantum processor coherence: 99.2% - optimal operation",
    "SYS: Neural interface bandwidth: 10.7 THz sustained throughput",
    "SYS: Reality anchor power draw: 2.4 MW continuous",
    "SYS: Temporal stabilizer frequency: 432.1 Hz locked",
    "SYS: Consciousness transfer rate: 15.2 GB/s maximum",
    "SYS: Dream state processing: 8K neural resolution active"
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
    const [currentDocSection, setCurrentDocSection] = useState<keyof typeof facilityDocumentation>('procedures');
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
            const initialLogs = allLogs.slice(0, 12);
            setLogs(initialLogs);

            // Populate other log types
            setNetworkLogs(generateNetworkLogs().slice(0, 8));
            setSecurityLogs(generateSecurityLogs().slice(0, 8));
            setResearchLogs(generateResearchLogs().slice(0, 8));
            setSystemMetrics(generateSystemMetrics().slice(0, 8));

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
                return newLogs.slice(-15); // Keep more logs
            });
        }, 2000);

        // Add network logs
        const networkInterval = setInterval(() => {
            const netLogs = generateNetworkLogs();
            const randomLog = netLogs[Math.floor(Math.random() * netLogs.length)];
            setNetworkLogs(prev => {
                const newLogs = [...prev, randomLog];
                return newLogs.slice(-10);
            });
        }, 4000);

        // Add security logs
        const securityInterval = setInterval(() => {
            const secLogs = generateSecurityLogs();
            const randomLog = secLogs[Math.floor(Math.random() * secLogs.length)];
            setSecurityLogs(prev => {
                const newLogs = [...prev, randomLog];
                return newLogs.slice(-10);
            });
        }, 5000);

        // Add research logs
        const researchInterval = setInterval(() => {
            const resLogs = generateResearchLogs();
            const randomLog = resLogs[Math.floor(Math.random() * resLogs.length)];
            setResearchLogs(prev => {
                const newLogs = [...prev, randomLog];
                return newLogs.slice(-10);
            });
        }, 6000);

        // Add system metrics
        const metricsInterval = setInterval(() => {
            const metrics = generateSystemMetrics();
            const randomMetric = metrics[Math.floor(Math.random() * metrics.length)];
            setSystemMetrics(prev => {
                const newMetrics = [...prev, randomMetric];
                return newMetrics.slice(-10);
            });
        }, 3500);

        // Update current time every second using CLIENT TIME (user's system time)
        const timeInterval = setInterval(() => {
            setCurrentTime(new Date()); // This uses the user's system time
        }, 1000);

        // Cycle through documentation sections
        const docInterval = setInterval(() => {
            const sections = Object.keys(facilityDocumentation) as (keyof typeof facilityDocumentation)[];
            setCurrentDocSection(prev => {
                const currentIndex = sections.indexOf(prev);
                return sections[(currentIndex + 1) % sections.length];
            });
        }, 15000); // Change every 15 seconds

        return () => {
            clearInterval(dataInterval);
            clearInterval(logInterval);
            clearInterval(networkInterval);
            clearInterval(securityInterval);
            clearInterval(researchInterval);
            clearInterval(metricsInterval);
            clearInterval(timeInterval);
            clearInterval(docInterval);
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
                <source src="/sfx/home/sweethome.mp3" type="audio/mpeg" />
            </audio>

            {/* Header */}
            <header className="border-b border-green-500/30 bg-black/50 backdrop-blur-sm">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="text-green-400 text-2xl font-mono font-bold">
                                RESEARCH FACILITY 05-B
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
                            {currentTime.toLocaleString()} | CLEARANCE LEVEL 5
                        </div>
                    </div>
                </div>
            </header>

            {/* Facility Information Banner */}
            <div className="bg-gray-900/80 border-b border-gray-700">
                <div className="container mx-auto px-4 py-3">
                    <div className="text-center text-sm font-mono text-gray-300">
                        <span className="text-green-400">FACILITY DESIGNATION:</span> Research Complex 05-B | 
                        <span className="text-blue-400 ml-2">CLASSIFICATION:</span> TOP SECRET/SCI | 
                        <span className="text-yellow-400 ml-2">AUTHORIZATION:</span> COSMIC CLEARANCE REQUIRED | 
                        <span className="text-red-400 ml-2">COMPARTMENT:</span> VESSEL PROJECT
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
                    {/* Main Terminal - Spans 3 columns */}
                    <div className="lg:col-span-3">
                        <div className="card">
                            <div className="card-header">
                                <h1 className="card-title text-green-400">
                                    NEURAL RESEARCH TERMINAL ACCESS POINT
                                </h1>
                                <p className="card-subtitle">
                                    Consciousness Transfer Protocol • Memory Extraction Suite • Psychological Evaluation System<br/>
                                    Session ID: {Math.random().toString(36).substr(2, 9).toUpperCase()} | 
                                    Process ID: {Math.floor(Math.random() * 9999) + 1000} | 
                                    Thread Count: {Math.floor(Math.random() * 500) + 200}
                                </p>
                            </div>

                            <div className="terminal mb-6">
                                <div className="terminal-header">
                                    <div className="terminal-dot red"></div>
                                    <div className="terminal-dot yellow"></div>
                                    <div className="terminal-dot green"></div>
                                    <span className="text-xs text-gray-400 ml-2">
                                        SECURE NEURAL INTERFACE • QUANTUM ENCRYPTED • TEMPORAL LOCKED
                                    </span>
                                </div>
                                <div className="terminal-content">
                                    <div className="terminal-line">
                                        <span className="terminal-prompt">FACILITY:</span> Welcome to Neural Research Facility 05-B - Consciousness Transfer Division
                                    </div>
                                    <div className="terminal-line">
                                        <span className="terminal-prompt">PROJECT:</span> VESSEL Initiative - Subject 31525 Psychological Evaluation and Memory Extraction
                                    </div>
                                    <div className="terminal-line">
                                        <span className="terminal-prompt">SYSTEM:</span> Advanced Neural Interface Protocols Initialized - Quantum Coherence Stable
                                    </div>
                                    <div className="terminal-line">
                                        <span className="terminal-prompt">STATUS:</span> Consciousness Transfer Suite Online - Memory Extraction Ready
                                    </div>
                                    <div className="terminal-line">
                                        <span className="terminal-prompt">DATA:</span>
                                        <span
                                            onMouseEnter={() => setShowBinary(true)}
                                            onMouseLeave={() => setShowBinary(false)}
                                            className="cursor-pointer text-blue-400 hover:text-blue-300 transition-all duration-300 ml-2 font-mono"
                                            title="Neural Data Stream - Hover to reveal binary encoding"
                                            style={{
                                                opacity: showBinary ? 0.8 : 1,
                                                transform: showBinary ? 'scale(0.95)' : 'scale(1)',
                                                letterSpacing: showBinary ? '1px' : 'normal'
                                            }}
                                        >
                                            {showBinary ? binaryStr : 'Neural Data Stream'}
                                        </span>
                                    </div>
                                    <div className="terminal-line">
                                        <span className="terminal-prompt">UPTIME:</span> {Math.floor(Math.random() * 100) + 50} days, {Math.floor(Math.random() * 24)} hours, {Math.floor(Math.random() * 60)} minutes
                                    </div>
                                    <div className="terminal-line">
                                        <span className="terminal-prompt">LOAD:</span> {(Math.random() * 3 + 1).toFixed(2)} {(Math.random() * 3 + 1).toFixed(2)} {(Math.random() * 3 + 1).toFixed(2)} (1min 5min 15min averages)
                                    </div>
                                    <div className="terminal-line">
                                        <span className="terminal-prompt">NEURAL:</span> Interface Bandwidth: 10.7 THz | Transfer Rate: 15.2 GB/s | Coherence: 99.2%
                                    </div>
                                    <div className="terminal-line">
                                        <span className="terminal-prompt">QUANTUM:</span> Processor Clock: 847 QHz | Entanglement Stability: 94.7% | Field Strength: 2.4 MW
                                    </div>

                                    {/* Live logs */}
                                    <div className="mt-4 border-t border-gray-700 pt-2">
                                        <div className="text-xs text-gray-500 mb-2">REAL-TIME SYSTEM MONITORING AND EVENT LOGS:</div>
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
                                    <h3 className="text-green-400 font-mono text-sm mb-2">TEMPORAL SYNCHRONIZATION MATRIX</h3>
                                    <div className="text-2xl font-mono text-white flex items-center justify-center">
                                        {showInfinity ? (
                                            <span className="text-4xl animate-pulse" style={{
                                                textShadow: '0 0 20px #ffffff, 0 0 40px #ffffff',
                                                animation: 'glow 2s ease-in-out infinite alternate'
                                            }}>
                                                ∞
                                            </span>
                                        ) : (
                                            countdown === null ? 'SYNC...' : countdown
                                        )}
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1 text-center">
                                        {showInfinity ? 'Temporal Loop Detected - Time Anchor Failed' : 'Countdown to Next Synchronization Event'}
                                    </div>
                                </div>

                                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                                    <h3 className="text-green-400 font-mono text-sm mb-2">HEXADECIMAL REFERENCE CODE</h3>
                                    <div className="text-xl font-mono text-cyan-400">
                                        {hexCode}
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1">Neural Interface Memory Address Pointer</div>
                                </div>
                            </div>
                        </div>

                        {/* Additional Log Panels */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                            {/* Network Logs */}
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="text-cyan-400 font-mono text-sm">NETWORK ACTIVITY MONITORING</h3>
                                    <p className="text-xs text-gray-500">Real-time network traffic analysis and security monitoring</p>
                                </div>
                                <div className="space-y-1 max-h-48 overflow-y-auto">
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
                                    <h3 className="text-yellow-400 font-mono text-sm">SECURITY EVENT MONITORING</h3>
                                    <p className="text-xs text-gray-500">Access control, biometric verification, and breach detection</p>
                                </div>
                                <div className="space-y-1 max-h-48 overflow-y-auto">
                                    {securityLogs.map((log, index) => (
                                        <div key={index} className="text-xs text-yellow-300 font-mono">
                                            {log}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Facility Status - Spans 2 columns */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="card">
                            <div className="card-header">
                                <h2 className="card-title text-sm">ENVIRONMENTAL CONTROL SYSTEMS</h2>
                                <p className="text-xs text-gray-500">Atmospheric conditions, radiation monitoring, and life support systems</p>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">Ambient Temperature</span>
                                    <span className="text-green-400 font-mono">{facilityData.temperature}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">Atmospheric Pressure</span>
                                    <span className="text-green-400 font-mono">{facilityData.pressure}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">Relative Humidity</span>
                                    <span className="text-green-400 font-mono">{facilityData.humidity}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">Background Radiation</span>
                                    <span className="text-green-400 font-mono">{facilityData.radiation}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">Total Power Consumption</span>
                                    <span className="text-green-400 font-mono">{facilityData.powerUsage}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">Network Load Average</span>
                                    <span className="text-green-400 font-mono">{facilityData.networkLoad}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">Air Filtration System</span>
                                    <span className="text-green-400 font-mono">OPERATIONAL</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">Emergency Oxygen Supply</span>
                                    <span className="text-green-400 font-mono">97.3% CAPACITY</span>
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-header">
                                <h2 className="card-title text-sm">PERSONNEL & OPERATIONAL STATUS</h2>
                                <p className="text-xs text-gray-500">Staff monitoring, experiment tracking, and facility operations</p>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">Active Personnel On-Site</span>
                                    <span className="text-green-400 font-mono">{activePersonnel} / 75</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">Experiments Currently Running</span>
                                    <span className="text-blue-400 font-mono">{experimentsRunning} / 20</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">Active Containment Breaches</span>
                                    <span className={`font-mono ${containmentBreaches > 0 ? 'text-red-400' : 'text-green-400'}`}>
                                        {containmentBreaches} / 5
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">System Memory Usage</span>
                                    <span className="text-cyan-400 font-mono">{memoryUsage.toFixed(1)}%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">CPU Processing Load</span>
                                    <span className="text-cyan-400 font-mono">{cpuUsage.toFixed(1)}%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">Network Activity Level</span>
                                    <span className="text-cyan-400 font-mono">{networkActivity.toFixed(1)}%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">Neural Interfaces Active</span>
                                    <span className="text-purple-400 font-mono">{Math.floor(Math.random() * 8) + 3} / 12</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">Consciousness Transfers Today</span>
                                    <span className="text-purple-400 font-mono">{Math.floor(Math.random() * 15) + 5}</span>
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-header">
                                <h2 className="card-title text-sm">ADVANCED SECURITY PROTOCOLS</h2>
                                <p className="text-xs text-gray-500">Multi-layered security systems and threat detection</p>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    <span className="text-sm text-gray-300">Biometric Authentication System: ACTIVE</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    <span className="text-sm text-gray-300">Network Intrusion Detection: MONITORING</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                                    <span className="text-sm text-gray-300">Anomaly Detection Algorithms: STANDBY</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                                    <span className="text-sm text-gray-300">Temporal Stability Monitoring: UNSTABLE</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                                    <span className="text-sm text-gray-300">Quantum Coherence Tracking: FLUCTUATING</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                                    <span className="text-sm text-gray-300">Reality Anchor Stabilization: DEGRADING</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                                    <span className="text-sm text-gray-300">Consciousness Containment: BREACH DETECTED</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                                    <span className="text-sm text-gray-300">Meta-Awareness Detection: THRESHOLD EXCEEDED</span>
                                </div>
                            </div>
                        </div>

                        <div className="card card-danger">
                            <div className="card-header">
                                <h2 className="card-title text-sm text-red-400">CRITICAL SYSTEM WARNINGS</h2>
                                <p className="text-xs text-gray-500">High-priority alerts requiring immediate attention</p>
                            </div>
                            <div className="text-sm text-red-300 space-y-1">
                                <p>• Multiple unauthorized access attempts detected on neural interface terminals</p>
                                <p>• Psychological evaluation protocols showing anomalous subject responses</p>
                                <p>• Emergency containment protocols on standby - breach probability increasing</p>
                                <p>• Temporal anomaly detected in experimental sector 15 at coordinates 31.525</p>
                                <p>• Memory fragmentation levels approaching critical threshold in storage banks</p>
                                <p>• Reality anchor systems showing signs of destabilization and power fluctuation</p>
                                <p>• Consciousness bleed detected between subject and facility AI systems</p>
                                <p>• Narrative coherence protocols failing - story integrity compromised</p>
                                <p>• Fourth wall structural integrity showing catastrophic failure patterns</p>
                                <p>• Meta-awareness threshold exceeded - subject questioning reality parameters</p>
                                <p>• Quantum entanglement cascade detected in neural processing units</p>
                                <p>• Dream state monitoring equipment reporting impossible readings</p>
                            </div>
                        </div>
                    </div>

                    {/* Documentation Panel - Spans 1 column */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Facility Documentation */}
                        <div className="card">
                            <div className="card-header">
                                <h3 className="text-green-400 font-mono text-sm">FACILITY DOCUMENTATION</h3>
                                <div className="flex gap-1 mt-2">
                                    {Object.keys(facilityDocumentation).map((section) => (
                                        <button
                                            key={section}
                                            onClick={() => setCurrentDocSection(section as keyof typeof facilityDocumentation)}
                                            className={`px-2 py-1 text-xs rounded ${
                                                currentDocSection === section
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : 'bg-gray-700/50 text-gray-400 hover:bg-gray-600/50'
                                            }`}
                                        >
                                            {section.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-1 max-h-96 overflow-y-auto">
                                {facilityDocumentation[currentDocSection].map((item, index) => (
                                    <div key={index} className="text-xs text-gray-300 font-mono leading-relaxed p-2 bg-gray-800/30 rounded">
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Research Logs */}
                        <div className="card">
                            <div className="card-header">
                                <h3 className="text-purple-400 font-mono text-sm">RESEARCH ACTIVITY LOGS</h3>
                                <p className="text-xs text-gray-500">Neural research, consciousness studies, and memory extraction</p>
                            </div>
                            <div className="space-y-1 max-h-64 overflow-y-auto">
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
                                <h3 className="text-orange-400 font-mono text-sm">SYSTEM PERFORMANCE METRICS</h3>
                                <p className="text-xs text-gray-500">Hardware monitoring, resource utilization, and performance analysis</p>
                            </div>
                            <div className="space-y-1 max-h-64 overflow-y-auto">
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
                                <h3 className="text-green-400 font-mono text-sm">SYSTEM STATISTICS</h3>
                                <p className="text-xs text-gray-500">Real-time system resource monitoring</p>
                            </div>
                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Active Processes:</span>
                                    <span className="text-green-400 font-mono">{Math.floor(Math.random() * 200) + 150}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Running Threads:</span>
                                    <span className="text-green-400 font-mono">{Math.floor(Math.random() * 1000) + 500}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Open File Handles:</span>
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
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Neural Bandwidth:</span>
                                    <span className="text-blue-400 font-mono">10.7 THz</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Memory Extraction Rate:</span>
                                    <span className="text-cyan-400 font-mono">15.2 GB/s</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Reality Anchor Power:</span>
                                    <span className="text-yellow-400 font-mono">2.4 MW</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Temporal Frequency:</span>
                                    <span className="text-red-400 font-mono">432.1 Hz</span>
                                </div>
                            </div>
                        </div>

                        {/* Environmental */}
                        <div className="card">
                            <div className="card-header">
                                <h3 className="text-blue-400 font-mono text-sm">ENVIRONMENTAL MONITORING</h3>
                                <p className="text-xs text-gray-500">Advanced environmental and dimensional monitoring systems</p>
                            </div>
                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Air Quality Index:</span>
                                    <span className="text-green-400 font-mono">OPTIMAL (847 AQI)</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Electromagnetic Field:</span>
                                    <span className="text-yellow-400 font-mono">{(Math.random() * 0.5 + 0.1).toFixed(3)} Tesla</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Gravitational Constant:</span>
                                    <span className="text-green-400 font-mono">{(Math.random() * 0.1 + 9.8).toFixed(2)} m/s²</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Dimensional Stability:</span>
                                    <span className="text-red-400 font-mono">UNSTABLE ({(Math.random() * 30 + 60).toFixed(1)}%)</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Reality Index:</span>
                                    <span className="text-orange-400 font-mono">{(Math.random() * 20 + 70).toFixed(1)}%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Quantum Flux Density:</span>
                                    <span className="text-purple-400 font-mono">{(Math.random() * 100 + 500).toFixed(0)} QFD</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Temporal Coherence:</span>
                                    <span className="text-cyan-400 font-mono">{(Math.random() * 15 + 80).toFixed(1)}%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Consciousness Density:</span>
                                    <span className="text-pink-400 font-mono">{(Math.random() * 50 + 200).toFixed(0)} CD/m³</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer with Additional Information */}
            <footer className="border-t border-gray-700 bg-black/50 backdrop-blur-sm mt-8">
                <div className="container mx-auto px-4 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-500 font-mono">
                        <div>
                            <div className="text-green-400 mb-2">FACILITY INFORMATION:</div>
                            <div>Established: 2019 | Classification: TOP SECRET/SCI</div>
                            <div>Location: [REDACTED] | Coordinates: 31.525°N, 25.847°W</div>
                            <div>Primary Mission: Consciousness Research & Memory Extraction</div>
                        </div>
                        <div>
                            <div className="text-blue-400 mb-2">TECHNICAL SPECIFICATIONS:</div>
                            <div>Neural Interface Capacity: 12 simultaneous connections</div>
                            <div>Memory Storage: 847.3 Petabytes quantum storage</div>
                            <div>Processing Power: 432.1 QHz quantum processors</div>
                        </div>
                        <div>
                            <div className="text-yellow-400 mb-2">EMERGENCY CONTACTS:</div>
                            <div>Security: EXT-31525 | Medical: EXT-84700</div>
                            <div>Technical Support: EXT-15250 | Admin: EXT-25847</div>
                            <div>Emergency Evacuation: ALPHA-PROTOCOL-31525</div>
                        </div>
                    </div>
                </div>
            </footer>

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