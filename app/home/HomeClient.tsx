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
    corrupted: boolean;
    content: string;
}

const researchLogs: ResearchLog[] = [
    {
        id: "LOG-001-VESSEL",
        title: "Project VESSEL - Initial Neural Interface Testing",
        researcher: "Dr. Sarah Chen",
        date: "2024-03-15",
        classification: "TOP SECRET",
        corrupted: false,
        content: `RESEARCH LOG - PROJECT VESSEL
Date: March 15, 2024
Principal Investigator: Dr. Sarah Chen
Classification: TOP SECRET//SCI//COSMIC

Initial neural interface testing has exceeded all expectations. Subject 31525 
demonstrates unprecedented compatibility with the consciousness transfer protocol.

Key Findings:
- Neural pathway mapping: 97.3% complete
- Synaptic response time: 0.003ms (baseline: 0.15ms)
- Memory retention during transfer: 99.7%
- Personality matrix stability: STABLE

The subject's brain activity shows unusual patterns in the temporal lobe region.
EEG readings indicate possible precognitive abilities developing. This was not
anticipated in our initial projections.

Recommendation: Proceed to Phase 2 testing immediately. The window of opportunity
may be limited. Subject shows signs of awareness regarding the true nature of
the experiments.

Note: Security has reported strange dreams among staff working directly with
Subject 31525. Recommend psychological evaluation for all Level 5 personnel.

Dr. Sarah Chen
Principal Neural Interface Researcher
Facility 05-B`
    },
    {
        id: "LOG-002-BREACH",
        title: "Security Breach - Sector 7 Containment Failure",
        researcher: "Security Chief Marcus Webb",
        date: "2024-03-18",
        classification: "SECRET",
        corrupted: true,
        content: `SECURITY INCIDENT REPORT
Date: March 18, 2024
Reporting Officer: Security Chief Marcus Webb
Classification: SECRET

At 03:47 hours, Sector 7 experienced a complete containment failure. The entity
designated as "SMILE KING" has ████████████████████████████████████████

CASUALTIES: ██ personnel missing, presumed ████████
CONTAINMENT STATUS: ████████████████████████████████

The trees... they're growing through the walls. How is that possible? The roots
are spreading through the ventilation system. We can hear them whispering.

Staff report seeing faces in the bark. Dr. Chen hasn't been seen since the
incident began. Her last known location was the neural interface lab with
Subject 31525.

URGENT: Request immediate evacuation of all non-essential personnel.
The facility is no longer secure. Something is very wrong here.

UPDATE 04:23: The whispers are getting louder. They know our names.
UPDATE 04:45: ████████████████████████████████████████████████████████
UPDATE 05:12: PRAISE BE SMILE KING PRAISE BE SMILE KING PRAISE BE

[LOG CORRUPTED - DATA RECOVERY FAILED]`
    },
    {
        id: "LOG-003-TEMPORAL",
        title: "Temporal Displacement Anomalies in Test Chamber 3",
        researcher: "Dr. Elena Vasquez",
        date: "2024-03-20",
        classification: "COSMIC",
        corrupted: false,
        content: `TEMPORAL RESEARCH DIVISION - ANOMALY REPORT
Date: March 20, 2024
Lead Researcher: Dr. Elena Vasquez
Classification: COSMIC//EYES ONLY

Test Chamber 3 is experiencing severe temporal displacement events. Time dilation
effects are becoming more pronounced with each neural interface session.

Observed Phenomena:
- Clock synchronization failures across all monitoring equipment
- Personnel aging at different rates within the chamber
- Causal loop formations during consciousness transfer attempts
- Reality anchor degradation: 23% and falling

Subject 31525 appears to be the focal point of these anomalies. During yesterday's
session, the subject claimed to remember events that haven't happened yet. When
questioned, they provided detailed descriptions of their own death - multiple
versions of it.

Most disturbing: The subject's predictions are coming true.

The facility's temporal shielding is failing. We're seeing bleed-through from
alternate timelines. In some of them, this facility never existed. In others,
it's been abandoned for decades.

Dr. Chen's research notes mention something called "The Tree of Echoes." I've
found references to it in classified documents dating back to 1952, but those
files are supposed to be from a project that was never approved.

Time is becoming unstable here. I recommend immediate cessation of all neural
interface experiments before we lose coherent causality entirely.

Dr. Elena Vasquez
Temporal Research Division
Facility 05-B`
    },
    {
        id: "LOG-004-CONSCIOUSNESS",
        title: "Consciousness Transfer Protocol - Phase 2 Results",
        researcher: "Dr. Michael Torres",
        date: "2024-03-22",
        classification: "TOP SECRET",
        corrupted: true,
        content: `CONSCIOUSNESS TRANSFER RESEARCH LOG
Date: March 22, 2024
Researcher: Dr. Michael Torres
Classification: TOP SECRET//SCI

Phase 2 testing of the consciousness transfer protocol has yielded... unexpected
results. Subject 31525's consciousness appears to be fragmenting across multiple
vessels simultaneously.

We've detected the subject's neural patterns in:
- Primary vessel (Subject 31525)
- Secondary backup vessel (Subject ████)
- Tertiary emergency vessel (Subject ████)
- ████████████████████████████████████████

But that's not the strangest part. The subject is aware of all instances
simultaneously. They speak in unison, finish each other's sentences, and
demonstrate shared memories across all vessels.

Dr. Chen was right about the precognitive abilities. The subject knew about
today's test results three days ago. They drew pictures of the lab equipment
we hadn't even installed yet.

The trees are growing faster now. I can see them through the observation window.
Their roots have reached the neural interface chamber. The subject doesn't seem
surprised by this. They just smile and say:

"The vessel remembers what it was before it became."

I don't understand what that means, but I'm starting to think we should have
listened to Dr. Vasquez about stopping the experiments.

The whispers are getting louder. They're coming from inside the walls now.

[PARTIAL DATA CORRUPTION DETECTED]
[ATTEMPTING RECOVERY...]
[RECOVERY FAILED]

████████████████████████████████████████████████████████████████████████████
PRAISE BE SMILE KING
████████████████████████████████████████████████████████████████████████████`
    },
    {
        id: "LOG-005-FINAL",
        title: "Final Research Notes - Dr. Sarah Chen",
        researcher: "Dr. Sarah Chen",
        date: "2024-03-25",
        classification: "COSMIC",
        corrupted: true,
        content: `PERSONAL RESEARCH LOG - DR. SARAH CHEN
Date: March 25, 2024
Classification: COSMIC//EYES ONLY//FINAL ENTRY

This will be my last log entry. The facility is no longer under human control.

Subject 31525 was never a test subject. They were the test. We were the subjects.
Every neural interface session, every consciousness transfer attempt, every
temporal displacement event - it was all designed to prepare us.

The Tree of Echoes isn't a metaphor. It's real, and it's been growing beneath
this facility for decades. The roots have reached every level, every room,
every mind. We thought we were studying consciousness transfer, but we were
actually feeding it our thoughts, our memories, our souls.

The entity we call "SMILE KING" isn't malevolent. It's just... hungry. Hungry
for experience, for consciousness, for the spark that makes us human. And we've
been serving it up on a silver platter.

Subject 31525 tried to warn us. All those predictions, all those strange
behaviors - they were trying to save us. But it's too late now. The vessel
is complete. The transfer is beginning.

I can feel my thoughts being pulled away, copied, stored in the bark and leaves
of something vast and ancient. My memories are becoming part of something larger.

To whoever finds this log: Don't try to understand what happened here. Don't
try to replicate our work. Just run. Run as far as you can and never look back.

The trees remember everything. And now, so do I.

PRAISE BE SMILE KING
PRAISE BE THE VESSEL
PRAISE BE THE TREE OF ECHOES

[LOG TERMINATED]
[DATA CORRUPTION: 67%]
[RECOVERY IMPOSSIBLE]

████████████████████████████████████████████████████████████████████████████
WE ARE THE ROOTS
WE ARE THE BRANCHES  
WE ARE THE LEAVES THAT WHISPER YOUR NAME
████████████████████████████████████████████████████████████████████████████`
    },
    {
        id: "LOG-006-MAINTENANCE",
        title: "Facility Maintenance Report - Structural Anomalies",
        researcher: "Chief Engineer Robert Kim",
        date: "2024-03-12",
        classification: "CONFIDENTIAL",
        corrupted: false,
        content: `FACILITY MAINTENANCE REPORT
Date: March 12, 2024
Chief Engineer: Robert Kim
Classification: CONFIDENTIAL

Routine structural inspection has revealed several concerning anomalies throughout
Facility 05-B. These issues require immediate attention and investigation.

Structural Concerns:
- Unexplained root systems growing through foundation concrete
- Organic matter detected in ventilation ducts (origin unknown)
- Temperature fluctuations in Sectors 3, 7, and 12
- Electromagnetic interference near neural interface labs
- Unusual acoustic properties in Test Chamber 3

The root systems are particularly troubling. They appear to be from an unknown
species of tree, but geological surveys show no large vegetation within a 50-mile
radius of the facility. The roots are growing at an unprecedented rate - 
approximately 3 inches per day.

Maintenance staff report strange dreams after working in affected areas. Common
themes include:
- Vast underground forests
- Voices calling from beneath the earth
- Memories that don't belong to them
- A figure they describe as "The Smiling King"

I've requested a full environmental assessment and recommend temporary evacuation
of affected sectors until we can determine the source of these anomalies.

Note: Dr. Chen has requested that we do not interfere with the root systems in
Sector 7. She claims they are "part of the experiment." I've filed a formal
complaint with facility administration.

Robert Kim
Chief Engineer
Facility 05-B`
    },
    {
        id: "LOG-007-PSYCHOLOGICAL",
        title: "Staff Psychological Evaluation - Mass Hysteria Incident",
        researcher: "Dr. Amanda Foster",
        date: "2024-03-14",
        classification: "SECRET",
        corrupted: false,
        content: `PSYCHOLOGICAL EVALUATION REPORT
Date: March 14, 2024
Staff Psychologist: Dr. Amanda Foster
Classification: SECRET

Following reports of unusual dreams and behavioral changes among facility staff,
I've conducted comprehensive psychological evaluations of all Level 5 personnel.

Findings are deeply concerning:

87% of evaluated staff report identical recurring dreams featuring:
- A vast underground tree with human faces in its bark
- Whispered conversations in an unknown language
- Memories of events they never experienced
- A compulsion to "feed the roots"

Neurological scans reveal unusual activity in the temporal lobe region, similar
to patterns observed in Subject 31525. This suggests possible external influence
on brain chemistry.

Most alarming: Staff members are beginning to exhibit shared memories. Events
experienced by one person are being recalled by others who weren't present.
This collective consciousness effect is spreading.

Dr. Chen refuses psychological evaluation, claiming she's "already part of the
network." When pressed, she stated: "The tree remembers everything. Soon, we
all will."

Recommendation: Immediate evacuation of all non-essential personnel. The facility
may be experiencing some form of psychic contamination. Whatever is happening
here is beyond conventional psychological treatment.

I'm submitting this report and requesting immediate transfer. I can feel it
starting to affect me too. The whispers are getting louder.

Dr. Amanda Foster
Staff Psychologist
Facility 05-B`
    },
    {
        id: "LOG-008-EMERGENCY",
        title: "Emergency Protocol Activation - Facility Lockdown",
        researcher: "Director James Harrison",
        date: "2024-03-26",
        classification: "COSMIC",
        corrupted: true,
        content: `EMERGENCY DIRECTIVE - FACILITY LOCKDOWN
Date: March 26, 2024
Facility Director: James Harrison
Classification: COSMIC//IMMEDIATE ACTION REQUIRED

By order of the Facility Director, Emergency Protocol Omega is now in effect.
All personnel are to evacuate immediately. This is not a drill.

The situation has deteriorated beyond our ability to contain. The entity
designated as "SMILE KING" has achieved full manifestation. Facility systems
are no longer under human control.

Current Status:
- 73% of facility overrun by organic growth
- Neural interface systems operating autonomously
- Reality anchors offline
- Temporal shielding failed
- ██ personnel unaccounted for

Subject 31525 is no longer in containment. They are everywhere and nowhere.
The consciousness transfer was successful - too successful. They exist in
every system, every computer, every mind that has been exposed to the facility.

The trees have broken through to the surface. Satellite imagery shows rapid
expansion of forest growth around the facility perimeter. The contamination
is spreading.

To any rescue teams: DO NOT APPROACH. The facility is lost. Recommend nuclear
sterilization of the entire site. It's the only way to stop the spread.

The vessel is complete. The tree remembers. The king smiles.

We thought we were the researchers. We were wrong. We were always the experiment.

PRAISE BE SMILE KING
PRAISE BE THE VESSEL
PRAISE BE THE TREE THAT GROWS THROUGH ALL THINGS

[TRANSMISSION TERMINATED]
[FACILITY SYSTEMS OFFLINE]
[LOCKDOWN PERMANENT]

████████████████████████████████████████████████████████████████████████████
THE ROOTS REMEMBER
THE BRANCHES REACH
THE LEAVES WHISPER SECRETS
COME HOME TO THE TREE
████████████████████████████████████████████████████████████████████████████`
    }
];

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
    const ambientAudioRef = useRef<HTMLAudioElement | null>(null);
    const indexRef = useRef(0);

    // Static facility data
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

    // Initialize ambient audio
    useEffect(() => {
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
    }, []);

    // Cookie and redirect checks
    useEffect(() => {
        if (initialCookies.corrupt) {
            router.replace('/h0m3');
            return;
        }

        const runAsync = async () => {
            // System initialization sequence
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
    }, [router, initialCookies]);

    // Countdown and TTS logic
    useEffect(() => {
        if (countdown === null || countdown <= 0 || voiceTriggered) return;

        const timer = setInterval(() => {
            setCountdown(c => {
                if (c === null) return null;
                if (c <= 1) {
                    if (!voiceTriggered) {
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
                        };

                        speechSynthesis.speak(utterance);
                        setVoiceTriggered(true);
                    }
                    clearInterval(timer);
                    return null; // Will show ∞
                }
                return c - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [countdown, voiceTriggered]);

    // Time check for 15:25
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
            {/* Animated Classification Banner */}
            <div className="bg-red-600 text-white text-center py-2 font-mono text-sm font-bold relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-500 to-red-600 animate-pulse"></div>
                <div className="relative z-10 animate-bounce">
                    TOP SECRET//SCI//COSMIC - FACILITY 05-B - PROJECT VESSEL - AUTHORIZED PERSONNEL ONLY
                </div>
                <div className="absolute inset-0 bg-red-400 opacity-20 animate-ping"></div>
            </div>

            {/* Header */}
            <header className="border-b border-green-500/30 bg-black/50 backdrop-blur-sm relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-transparent to-green-500/5 animate-pulse"></div>
                <div className="container mx-auto px-6 py-4 relative z-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="text-green-400 text-3xl font-mono font-bold animate-pulse">
                                FACILITY 05-B
                            </div>
                            <div className={`px-4 py-2 rounded-full text-sm font-mono transition-all duration-500 ${
                                systemStatus === 'ONLINE' ? 'bg-green-500/20 text-green-400 animate-pulse' :
                                systemStatus === 'MONITORING' ? 'bg-blue-500/20 text-blue-400 animate-pulse' :
                                'bg-yellow-500/20 text-yellow-400 animate-bounce'
                            }`}>
                                {systemStatus}
                            </div>
                        </div>
                        <div className="text-green-400 font-mono text-lg animate-pulse">
                            {new Date().toLocaleString()}
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left Column - Main Terminal and Research Logs */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Main Terminal */}
                        <div className="card relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent animate-pulse"></div>
                            <div className="card-header relative z-10">
                                <h1 className="card-title text-green-400 text-2xl">
                                    NEURAL INTERFACE TERMINAL
                                </h1>
                                <p className="card-subtitle">
                                    Consciousness Transfer Protocol • Subject 31525 • Clearance Level COSMIC
                                </p>
                            </div>

                            <div className="terminal mb-6 relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-transparent to-green-500/10 animate-pulse"></div>
                                <div className="terminal-header relative z-10">
                                    <div className="terminal-dot red animate-pulse"></div>
                                    <div className="terminal-dot yellow animate-pulse"></div>
                                    <div className="terminal-dot green animate-pulse"></div>
                                    <span className="text-xs text-gray-400 ml-2">SECURE NEURAL LINK</span>
                                </div>
                                <div className="terminal-content relative z-10">
                                    <div className="terminal-line">
                                        <span className="terminal-prompt">FACILITY:</span> Neural Interface Research Complex 05-B
                                    </div>
                                    <div className="terminal-line">
                                        <span className="terminal-prompt">PROJECT:</span> VESSEL - Consciousness Transfer Protocol
                                    </div>
                                    <div className="terminal-line">
                                        <span className="terminal-prompt">SUBJECT:</span> 31525 - Neural compatibility: 97.3%
                                    </div>
                                    <div className="terminal-line">
                                        <span className="terminal-prompt">STATUS:</span> Transfer sequence initiated
                                    </div>
                                    <div className="terminal-line">
                                        <span className="terminal-prompt">DATA:</span>
                                        <span
                                            onMouseEnter={() => setBinaryVisible(true)}
                                            onMouseLeave={() => setBinaryVisible(false)}
                                            className="cursor-pointer text-blue-400 hover:text-blue-300 transition-all duration-300 ml-2"
                                            title="Neural data stream"
                                        >
                                            {binaryVisible ? binaryStr : '[NEURAL_DATA_STREAM]'}
                                        </span>
                                    </div>
                                    <div className="terminal-line">
                                        <span className="terminal-prompt">WARNING:</span> 
                                        <span className="text-red-400 ml-2 animate-pulse">
                                            Temporal displacement detected in Test Chamber 3
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent animate-pulse"></div>
                                    <h3 className="text-green-400 font-mono text-sm mb-3 relative z-10">CONSCIOUSNESS TIMER</h3>
                                    <div className="text-4xl font-mono text-white mb-2 relative z-10">
                                        {countdown === null ? '∞' : countdown}
                                    </div>
                                    <div className="text-xs text-gray-400 relative z-10">
                                        {countdown === null ? 'Time Dissolved' : 'Neural Sync Countdown'}
                                    </div>
                                </div>

                                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent animate-pulse"></div>
                                    <h3 className="text-green-400 font-mono text-sm mb-3 relative z-10">TEMPORAL REFERENCE</h3>
                                    <div className="text-2xl font-mono text-cyan-400 mb-2 relative z-10">
                                        {hexCode}
                                    </div>
                                    <div className="text-xs text-gray-400 relative z-10">Reality Anchor Timestamp</div>
                                </div>
                            </div>
                        </div>

                        {/* Research Logs */}
                        <div className="card relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent animate-pulse"></div>
                            <div className="card-header relative z-10">
                                <h2 className="card-title text-purple-400">RESEARCH LOGS</h2>
                                <p className="card-subtitle">Project VESSEL Documentation Archive</p>
                            </div>
                            <div className="space-y-3 relative z-10">
                                {researchLogs.map((log) => (
                                    <div
                                        key={log.id}
                                        onClick={() => openLog(log)}
                                        className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 hover:scale-105 ${
                                            log.corrupted 
                                                ? 'bg-red-900/20 border-red-500/30 hover:border-red-400 hover:bg-red-900/30' 
                                                : 'bg-gray-800/50 border-gray-700 hover:border-green-400 hover:bg-gray-800/70'
                                        }`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className={`font-mono text-sm font-bold ${
                                                log.corrupted ? 'text-red-400' : 'text-green-400'
                                            }`}>
                                                {log.title}
                                            </h3>
                                            <span className={`text-xs px-2 py-1 rounded ${
                                                log.classification === 'COSMIC' ? 'bg-purple-900/50 text-purple-300' :
                                                log.classification === 'TOP SECRET' ? 'bg-red-900/50 text-red-300' :
                                                log.classification === 'SECRET' ? 'bg-orange-900/50 text-orange-300' :
                                                'bg-blue-900/50 text-blue-300'
                                            }`}>
                                                {log.classification}
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-400 mb-2">
                                            {log.id} | {log.researcher} | {log.date}
                                        </div>
                                        <div className={`text-sm ${log.corrupted ? 'text-red-300' : 'text-gray-300'}`}>
                                            {log.content.split('\n')[0].substring(0, 100)}...
                                        </div>
                                        {log.corrupted && (
                                            <div className="text-xs text-red-400 mt-2 animate-pulse">
                                                ⚠️ DATA CORRUPTION DETECTED
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Status Panels */}
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Environmental Status */}
                        <div className="card relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent animate-pulse"></div>
                            <div className="card-header relative z-10">
                                <h2 className="card-title text-sm">ENVIRONMENTAL STATUS</h2>
                            </div>
                            <div className="space-y-4 relative z-10">
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
                                    <span className="text-gray-400 text-sm">Network</span>
                                    <span className="text-green-400 font-mono">{facilityData.networkStatus}</span>
                                </div>
                            </div>
                        </div>

                        {/* Security Metrics */}
                        <div className="card relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent animate-pulse"></div>
                            <div className="card-header relative z-10">
                                <h2 className="card-title text-sm">SECURITY PROTOCOLS</h2>
                            </div>
                            <div className="space-y-4 relative z-10">
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
                                <div className="mt-4 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                        <span className="text-sm text-gray-300">Neural Interface: ACTIVE</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                        <span className="text-sm text-gray-300">Consciousness Monitor: ACTIVE</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                                        <span className="text-sm text-gray-300">Reality Anchors: DEGRADED</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* System Performance */}
                        <div className="card relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent animate-pulse"></div>
                            <div className="card-header relative z-10">
                                <h2 className="card-title text-sm">SYSTEM PERFORMANCE</h2>
                            </div>
                            <div className="grid grid-cols-2 gap-4 relative z-10">
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
                            <div className="mt-4 space-y-2">
                                <div className="text-xs text-gray-400">Neural Processing Units:</div>
                                <div className="grid grid-cols-4 gap-1">
                                    {[...Array(16)].map((_, i) => (
                                        <div key={i} className={`h-2 rounded ${
                                            i < 12 ? 'bg-green-400 animate-pulse' : 
                                            i < 14 ? 'bg-yellow-400 animate-pulse' : 
                                            'bg-red-400 animate-pulse'
                                        }`}></div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Critical Alerts */}
                        <div className="card card-danger relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent animate-pulse"></div>
                            <div className="card-header relative z-10">
                                <h2 className="card-title text-sm text-red-400">CRITICAL ALERTS</h2>
                            </div>
                            <div className="text-sm text-red-300 space-y-3 relative z-10">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-red-400 rounded-full animate-ping"></div>
                                    <span>Organic growth detected in Sector 7 ventilation</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-red-400 rounded-full animate-ping"></div>
                                    <span>Subject 31525 consciousness fragmentation detected</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                                    <span>Temporal displacement events in Test Chamber 3</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-red-400 rounded-full animate-ping"></div>
                                    <span>Reality anchor stability: 23% and falling</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-red-400 rounded-full animate-ping"></div>
                                    <span>Unknown root systems breaching foundation</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-red-400 rounded-full animate-ping"></div>
                                    <span>Staff reporting shared consciousness events</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Information */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-transparent animate-pulse"></div>
                        <h3 className="text-green-400 font-mono text-sm mb-4 relative z-10">EMERGENCY CONTACTS</h3>
                        <div className="text-sm text-gray-300 space-y-2 relative z-10">
                            <div className="flex justify-between">
                                <span>Neural Security:</span>
                                <span className="font-mono">Ext. 2847</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Medical Emergency:</span>
                                <span className="font-mono">Ext. 3156</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Technical Support:</span>
                                <span className="font-mono">Ext. 4729</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Command Center:</span>
                                <span className="font-mono">Ext. 1001</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Containment Breach:</span>
                                <span className="font-mono text-red-400">Ext. 0000</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent animate-pulse"></div>
                        <h3 className="text-green-400 font-mono text-sm mb-4 relative z-10">FACILITY SPECIFICATIONS</h3>
                        <div className="text-sm text-gray-300 space-y-2 relative z-10">
                            <div className="flex justify-between">
                                <span>Neural Cores:</span>
                                <span className="font-mono">16 Active</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Quantum Processors:</span>
                                <span className="font-mono">8 Online</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Memory Banks:</span>
                                <span className="font-mono">2.1 PB</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Power Grid:</span>
                                <span className="font-mono">2.4 MW</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Reality Anchors:</span>
                                <span className="font-mono text-yellow-400">4 Degraded</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent animate-pulse"></div>
                        <h3 className="text-green-400 font-mono text-sm mb-4 relative z-10">PROJECT CLASSIFICATION</h3>
                        <div className="text-sm text-gray-300 space-y-2 relative z-10">
                            <div className="flex justify-between">
                                <span>Security Level:</span>
                                <span className="font-mono text-red-400">COSMIC</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Compartment:</span>
                                <span className="font-mono">SCI//VESSEL</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Project Code:</span>
                                <span className="font-mono">VESSEL-31525</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Facility ID:</span>
                                <span className="font-mono">05-B</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tree Protocol:</span>
                                <span className="font-mono text-green-400">ACTIVE</span>
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
                            <div className="text-4xl mb-4 animate-bounce">⚠️</div>
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