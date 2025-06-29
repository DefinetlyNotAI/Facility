'use client';

import {useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import Cookies from 'js-cookie';
import {signCookie} from "@/lib/cookie-utils";

const binaryCorruptText = "Last time thou hesitated, it found thine";
const hexCorruptText = "0x4242"; // 66:66 in hex

const sessionIdGenerator = () =>
    `SID-${Math.random().toString(36).slice(2, 11)}`;

const letterReplace = (text: string) =>
    text
        .replace(/o/gi, '0')
        .replace(/a/gi, '@')
        .replace(/i/gi, '1')
        .replace(/e/gi, '3')
        .replace(/s/gi, '$')
        .replace(/\bI\b/gi, 'we')
        .replace(/\bmy\b/gi, 'our')
        .replace(/\bme\b/gi, 'us')
        .replace(/\bmine\b/gi, 'ours')
        .replace(/\bam\b/gi, 'are')
        .replace(/\byou\b/gi, 'we')
        .replace(/\byour\b/gi, 'our')
        .replace(/\byours\b/gi, 'ours');

export default function H0m3() {
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);
    const ttsAudioRef = useRef<HTMLAudioElement | null>(null);

    const [mode, setMode] = useState<'initial' | 'glitch'>('initial');
    const [scrollCount, setScrollCount] = useState(0);
    const [sessionId] = useState(sessionIdGenerator());
    const [currentTime, setCurrentTime] = useState<string>('');
    const [mounted, setMounted] = useState(false);
    const [facilityDataDynamic, setFacilityDataDynamic] = useState({
        temperature: '22.7°C',
        pressure: '1013.42 hPa',
        humidity: '43%',
        radiation: '0.09 μSv/h',
        powerOutput: '2.4 MW',
        networkStatus: 'SECURE'
    });

    // Corruption states
    const [corruptionLevel, setCorruptionLevel] = useState(0);
    const [brokenElements, setBrokenElements] = useState<string[]>([]);
    const [glitchText, setGlitchText] = useState<string>('');

    // Handle mounting and time updates
    useEffect(() => {
        setMounted(true);
        const updateTime = () => {
            setCurrentTime(new Date().toLocaleString());
        };
        updateTime();
        const timeInterval = setInterval(updateTime, 1000);

        // Dynamic facility data updates
        const dataInterval = setInterval(() => {
            setFacilityDataDynamic(prev => ({
                ...prev,
                temperature: (22 + Math.random() * 2 - 1).toFixed(1) + '°C',
                pressure: (1013 + Math.random() * 10 - 5).toFixed(2) + ' hPa',
                humidity: (43 + Math.random() * 6 - 3).toFixed(0) + '%',
                radiation: (0.09 + Math.random() * 0.02 - 0.01).toFixed(2) + ' μSv/h',
            }));
        }, 3000);

        return () => {
            clearInterval(timeInterval);
            clearInterval(dataInterval);
        };
    }, []);

    // Redirect and cookie check logic
    useEffect(() => {
        if (!mounted) return;

        const corrupt = Cookies.get('Corrupt');
        const corrupting = Cookies.get('corrupting');
        const noCorrupt = Cookies.get('No_corruption');

        if ((!corrupt && !corrupting) || noCorrupt) {
            router.replace('/');
            return;
        }

        if (corrupting) {
            setMode('glitch');

            // Initialize TTS audio
            const ttsAudio = new Audio();
            ttsAudio.loop = true;
            ttsAudio.volume = 0.4;
            ttsAudioRef.current = ttsAudio;

            // Use TTS for "RUN STOP ESCAPE"
            const utterance = new SpeechSynthesisUtterance("RUN STOP ESCAPE");
            utterance.rate = 0.5;
            utterance.pitch = 0.3;
            utterance.volume = 0.8;

            const speakLoop = () => {
                speechSynthesis.speak(utterance);
                utterance.onend = () => {
                    setTimeout(speakLoop, 2000); // 2 second pause between repetitions
                };
            };

            speakLoop();

            // Static flash and smiley faces every minute
            const staticInterval = setInterval(() => {
                if (!containerRef.current) return;

                // Flash effect
                containerRef.current.style.background = 'white';
                setTimeout(() => {
                    if (containerRef.current) {
                        containerRef.current.style.background = 'black';
                    }
                }, 200);

                // Show creepy message
                const messageDiv = document.createElement('div');
                messageDiv.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-size: 3rem;
                    color: red;
                    font-family: monospace;
                    z-index: 9999;
                    text-align: center;
                    text-shadow: 0 0 20px red;
                    animation: flash 0.5s infinite;
                `;
                messageDiv.innerHTML = `😈🌳😈<br/>Y0U $H0ULDNT B3 H3R3<br/>${sessionId}`;
                document.body.appendChild(messageDiv);

                setTimeout(() => {
                    document.body.removeChild(messageDiv);
                }, 3000);

                // Play static noise audio
                const staticAudio = new Audio('/sfx/static.mp3');
                staticAudio.volume = 0.6;
                staticAudio.play().catch(() => {});
            }, 60_000);

            return () => {
                clearInterval(staticInterval);
                speechSynthesis.cancel();
                if (ttsAudioRef.current) {
                    ttsAudioRef.current.pause();
                    ttsAudioRef.current.src = '';
                }
            };
        }
    }, [router, mounted, sessionId]);

    // Progressive corruption scroll handler
    useEffect(() => {
        if (!mounted || mode !== 'glitch') return;

        const onScroll = () => {
            const scrollTop = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;

            // Check if user reached bottom
            if (scrollTop + windowHeight >= documentHeight - 100) {
                const newCount = scrollCount + 1;
                setScrollCount(newCount);
                setCorruptionLevel(newCount);

                // Add progressive corruption
                addCorruption(newCount);
                
                // Seamlessly scroll back to top to create infinite loop effect
                setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: 'auto' });
                }, 500);
            }
        };

        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, [mounted, mode, scrollCount]);

    // Add progressive corruption effects
    const addCorruption = (level: number) => {
        const corruptions = [
            () => setBrokenElements(prev => [...prev, 'header-broken']),
            () => setBrokenElements(prev => [...prev, 'text-scrambled']),
            () => setBrokenElements(prev => [...prev, 'colors-inverted']),
            () => setBrokenElements(prev => [...prev, 'layout-broken']),
            () => setBrokenElements(prev => [...prev, 'fonts-corrupted']),
            () => setBrokenElements(prev => [...prev, 'complete-chaos']),
            () => setBrokenElements(prev => [...prev, 'final-breakdown'])
        ];

        if (level <= corruptions.length) {
            corruptions[level - 1]();
        }

        // Add random glitch text
        const glitches = [
            '█████ ERROR █████',
            'MEMORY LEAK DETECTED',
            'STACK OVERFLOW',
            'SEGMENTATION FAULT',
            'KERNEL PANIC',
            'SYSTEM CORRUPTED',
            'REALITY.EXE HAS STOPPED WORKING'
        ];
        setGlitchText(glitches[Math.floor(Math.random() * glitches.length)]);

        // Break console
        if (level >= 3) {
            console.error('CORRUPTION LEVEL:', level);
            console.error('SYSTEM INTEGRITY: COMPROMISED');
            console.error('THE TREE GROWS THROUGH THE CODE');
        }
    };

    if (!mounted) {
        return (
            <div style={{ backgroundColor: 'black', height: '100vh', width: '100vw' }}>
                <div style={{ color: 'green', textAlign: 'center', paddingTop: '50vh', fontFamily: 'monospace' }}>
                    Loading...
                </div>
            </div>
        );
    }

    // Blank page with hidden button
    if (mode === 'initial') {
        return (
            <div style={{
                backgroundColor: 'black',
                height: '100vh',
                width: '100vw',
                position: 'relative',
                cursor: 'crosshair'
            }}>
                <button
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '100px',
                        height: '100px',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        opacity: 0,
                        fontSize: 0
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = '0.1';
                        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '0';
                        e.currentTarget.style.background = 'transparent';
                    }}
                    onClick={async () => {
                        try {
                            await signCookie('corrupting=true');
                            // Force a page reload to trigger the corrupting mode
                            window.location.reload();
                        } catch (error) {
                            console.error('Failed to set corrupting cookie:', error);
                            // Fallback: try to navigate directly
                            setMode('glitch');
                        }
                    }}
                    aria-label="Hidden corrupt button"
                >
                    .
                </button>
            </div>
        );
    }

    // Calculate blur amount: 6% base + 3% per scroll
    const blurAmount = 6 + (scrollCount * 3);

    // Glitch mode — render corrupted Home
    return (
        <div
            ref={containerRef}
            style={{
                filter: `blur(${blurAmount}px) ${brokenElements.includes('colors-inverted') ? 'invert(1) hue-rotate(180deg)' : ''}`,
                transition: 'filter 0.3s ease',
                backgroundColor: 'black',
                minHeight: '500vh', // Make it very long for seamless scrolling
                color: brokenElements.includes('colors-inverted') ? '#ff0000' : '#00ff00',
                fontFamily: brokenElements.includes('fonts-corrupted') ? 'Impact, Arial Black, serif' : 'monospace',
                transform: brokenElements.includes('layout-broken') ? 'skew(-2deg, 1deg)' : 'none',
                animation: brokenElements.includes('complete-chaos') ? 'chaos 0.1s infinite' : 'none'
            }}
            className={`
                ${brokenElements.includes('header-broken') ? 'header-broken' : ''}
                ${brokenElements.includes('text-scrambled') ? 'text-scrambled' : ''}
                ${brokenElements.includes('final-breakdown') ? 'final-breakdown' : ''}
            `}
        >
            {/* Corruption Error Overlay */}
            {corruptionLevel > 0 && (
                <div style={{
                    position: 'fixed',
                    top: '10px',
                    right: '10px',
                    background: 'red',
                    color: 'white',
                    padding: '10px',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    zIndex: 9999,
                    animation: 'blink 0.5s infinite'
                }}>
                    CORRUPTION: {corruptionLevel}/7<br/>
                    {glitchText}
                </div>
            )}

            {/* Scrolling Classification Banner */}
            <div style={{
                background: brokenElements.includes('header-broken') ? 'linear-gradient(45deg, #ff0000, #00ff00, #0000ff)' : '#dc2626',
                color: 'white',
                fontFamily: 'monospace',
                fontSize: brokenElements.includes('fonts-corrupted') ? '2rem' : '0.875rem',
                fontWeight: 'bold',
                height: brokenElements.includes('layout-broken') ? '80px' : '40px',
                overflow: 'hidden',
                position: 'relative',
                borderBottom: '2px solid #b91c1c',
                transform: brokenElements.includes('header-broken') ? 'rotate(1deg)' : 'none'
            }}>
                <div style={{
                    display: 'flex',
                    whiteSpace: 'nowrap',
                    animation: brokenElements.includes('text-scrambled') ? 'scroll-broken 5s linear infinite' : 'scroll-left 30s linear infinite',
                    lineHeight: brokenElements.includes('layout-broken') ? '80px' : '40px'
                }}>
                    <span style={{ paddingRight: '100px' }}>
                        {letterReplace(brokenElements.includes('text-scrambled') ? 
                            "T0P $3CR3T//ERROR//C0$M1C - F@C1L1TY 05-B - PR0J3CT V3$$3L - @UTH0R1Z3D P3R$0NN3L 0NLY" :
                            "TOP SECRET//SCI//COSMIC - FACILITY 05-B - PROJECT VESSEL - AUTHORIZED PERSONNEL ONLY")}
                    </span>
                    <span style={{ paddingRight: '100px' }}>
                        {letterReplace(brokenElements.includes('text-scrambled') ? 
                            "T0P $3CR3T//ERROR//C0$M1C - F@C1L1TY 05-B - PR0J3CT V3$$3L - @UTH0R1Z3D P3R$0NN3L 0NLY" :
                            "TOP SECRET//SCI//COSMIC - FACILITY 05-B - PROJECT VESSEL - AUTHORIZED PERSONNEL ONLY")}
                    </span>
                </div>
            </div>

            {/* Main Header */}
            <header style={{
                background: brokenElements.includes('colors-inverted') ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
                borderBottom: '1px solid rgba(0, 255, 0, 0.3)',
                backdropFilter: 'blur(10px)',
                padding: '1.5rem 0',
                transform: brokenElements.includes('layout-broken') ? 'translateX(-20px)' : 'none'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                            <div>
                                <div style={{ 
                                    fontSize: brokenElements.includes('fonts-corrupted') ? '4rem' : '2.5rem', 
                                    fontWeight: 'bold', 
                                    color: brokenElements.includes('complete-chaos') ? '#ff00ff' : '#00ff00',
                                    textShadow: brokenElements.includes('complete-chaos') ? '5px 5px 0px #ff0000' : 'none'
                                }}>
                                    {letterReplace(brokenElements.includes('text-scrambled') ? "F@C1L1TY 05-B" : "FACILITY 05-B")}
                                </div>
                                <div style={{ fontSize: '0.875rem', color: '#666' }}>
                                    {letterReplace(brokenElements.includes('text-scrambled') ? "N3UR@L 1NT3RF@C3 R3$3@RCH C0MPL3X" : "NEURAL INTERFACE RESEARCH COMPLEX")}
                                </div>
                            </div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.5rem 1rem',
                                borderRadius: '0.5rem',
                                background: brokenElements.includes('colors-inverted') ? 'rgba(255, 0, 0, 0.1)' : 'rgba(0, 255, 0, 0.1)',
                                color: brokenElements.includes('colors-inverted') ? '#ff0000' : '#10b981'
                            }}>
                                <div style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    background: 'currentColor',
                                    animation: brokenElements.includes('complete-chaos') ? 'chaos-pulse 0.1s infinite' : 'pulse 2s infinite'
                                }}></div>
                                <span>{letterReplace(brokenElements.includes('text-scrambled') ? "M0N1T0R1NG" : "MONITORING")}</span>
                            </div>
                        </div>
                        <div style={{
                            transform: brokenElements.includes('layout-broken') ? 'rotate(-5deg)' : 'none'
                        }}>
                            <div style={{ 
                                color: brokenElements.includes('complete-chaos') ? '#ff00ff' : '#00ff00', 
                                fontSize: brokenElements.includes('fonts-corrupted') ? '2rem' : '1.25rem',
                                fontFamily: brokenElements.includes('fonts-corrupted') ? 'Impact' : 'inherit'
                            }}>
                                {brokenElements.includes('text-scrambled') ? '██:██:██' : currentTime}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#666' }}>
                                {letterReplace(brokenElements.includes('text-scrambled') ? "F@C1L1TY L0C@L T1M3" : "FACILITY LOCAL TIME")}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content - Duplicated multiple times for seamless scrolling */}
            {[...Array(5)].map((_, index) => (
                <main key={index} style={{ padding: '2rem 0' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
                        {/* Primary Terminal */}
                        <div style={{
                            background: brokenElements.includes('colors-inverted') ? 
                                'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(245, 245, 245, 0.9) 100%)' :
                                'linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(10, 10, 10, 0.9) 100%)',
                            border: `1px solid ${brokenElements.includes('colors-inverted') ? 'rgba(255, 0, 0, 0.4)' : 'rgba(0, 255, 0, 0.4)'}`,
                            borderRadius: brokenElements.includes('layout-broken') ? '50px' : '12px',
                            padding: '1.5rem',
                            marginBottom: '2rem',
                            transform: brokenElements.includes('layout-broken') ? `rotate(${index * 2}deg)` : 'none'
                        }}>
                            <div style={{ 
                                marginBottom: '1.5rem', 
                                borderBottom: '1px solid rgba(0, 255, 0, 0.2)', 
                                paddingBottom: '1rem',
                                transform: brokenElements.includes('complete-chaos') ? 'scaleX(-1)' : 'none'
                            }}>
                                <h2 style={{ 
                                    fontSize: brokenElements.includes('fonts-corrupted') ? '2rem' : '1.125rem', 
                                    fontWeight: '700', 
                                    color: brokenElements.includes('complete-chaos') ? '#ff0000' : '#10b981', 
                                    marginBottom: '0.25rem',
                                    fontFamily: brokenElements.includes('fonts-corrupted') ? 'Impact' : 'inherit'
                                }}>
                                    {letterReplace(brokenElements.includes('text-scrambled') ? "N3UR@L 1NT3RF@C3 T3RM1N@L" : "NEURAL INTERFACE TERMINAL")}
                                </h2>
                                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                    {letterReplace(brokenElements.includes('text-scrambled') ? "Pr0j3ct V3$$3L • $ubj3ct 31525 • Cl3@r@nc3 C0$M1C" : "Project VESSEL • Subject 31525 • Clearance COSMIC")}
                                </div>
                            </div>

                            {/* Terminal Content with corruption */}
                            <div style={{
                                background: 'rgba(0, 0, 0, 0.6)',
                                border: '1px solid rgba(0, 255, 0, 0.3)',
                                borderRadius: '8px',
                                marginBottom: '1.5rem',
                                overflow: 'hidden',
                                transform: brokenElements.includes('layout-broken') ? 'skew(5deg)' : 'none'
                            }}>
                                <div style={{
                                    background: 'rgba(0, 255, 0, 0.1)',
                                    padding: '0.75rem 1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    borderBottom: '1px solid rgba(0, 255, 0, 0.2)'
                                }}>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <div style={{ 
                                            width: '12px', 
                                            height: '12px', 
                                            borderRadius: '50%', 
                                            background: brokenElements.includes('complete-chaos') ? '#00ff00' : '#ef4444' 
                                        }}></div>
                                        <div style={{ 
                                            width: '12px', 
                                            height: '12px', 
                                            borderRadius: '50%', 
                                            background: brokenElements.includes('complete-chaos') ? '#ff0000' : '#f59e0b' 
                                        }}></div>
                                        <div style={{ 
                                            width: '12px', 
                                            height: '12px', 
                                            borderRadius: '50%', 
                                            background: brokenElements.includes('complete-chaos') ? '#0000ff' : '#10b981' 
                                        }}></div>
                                    </div>
                                    <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                        {letterReplace(brokenElements.includes('text-scrambled') ? "$3CUR3 N3UR@L L1NK" : "SECURE NEURAL LINK")}
                                    </span>
                                </div>

                                <div style={{ padding: '1rem', fontSize: '0.875rem', lineHeight: '1.6' }}>
                                    <div style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ color: '#10b981', fontWeight: '600', minWidth: '80px' }}>
                                            {letterReplace(brokenElements.includes('text-scrambled') ? "F@C1L1TY:" : "FACILITY:")}
                                        </span>
                                        {letterReplace(brokenElements.includes('text-scrambled') ? "N3UR@L 1NT3RF@C3 R3$3@RCH C0MPL3X 05-B" : "Neural Interface Research Complex 05-B")}
                                    </div>
                                    <div style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ color: '#10b981', fontWeight: '600', minWidth: '80px' }}>
                                            {letterReplace(brokenElements.includes('text-scrambled') ? "PR0J3CT:" : "PROJECT:")}
                                        </span>
                                        {letterReplace(brokenElements.includes('text-scrambled') ? "V3$$3L - C0n$c10u$n3$$ Tr@n$f3r Pr0t0c0l" : "VESSEL - Consciousness Transfer Protocol")}
                                    </div>
                                    <div style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ color: '#10b981', fontWeight: '600', minWidth: '80px' }}>
                                            {letterReplace(brokenElements.includes('text-scrambled') ? "$UBJ3CT:" : "SUBJECT:")}
                                        </span>
                                        {letterReplace(brokenElements.includes('text-scrambled') ? "31525 - N3UR@L c0mp@t1b1l1ty: 97.3%" : "31525 - Neural compatibility: 97.3%")}
                                    </div>
                                    <div style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ color: '#10b981', fontWeight: '600', minWidth: '80px' }}>
                                            {letterReplace(brokenElements.includes('text-scrambled') ? "$T@TU$:" : "STATUS:")}
                                        </span>
                                        {letterReplace(brokenElements.includes('text-scrambled') ? "Tr@n$f3r $3qu3nc3 1n1t1@t3d" : "Transfer sequence initiated")}
                                    </div>
                                    <div style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ color: '#10b981', fontWeight: '600', minWidth: '80px' }}>
                                            {letterReplace(brokenElements.includes('text-scrambled') ? "D@T@:" : "DATA:")}
                                        </span>
                                        <span style={{ 
                                            color: brokenElements.includes('complete-chaos') ? '#ff00ff' : '#ef4444', 
                                            background: 'rgba(255, 0, 0, 0.1)', 
                                            padding: '0.25rem 0.5rem', 
                                            borderRadius: '4px',
                                            fontFamily: brokenElements.includes('fonts-corrupted') ? 'Impact' : 'inherit'
                                        }}>
                                            {brokenElements.includes('text-scrambled') ? "L@$t t1m3 th0u h3$1t@t3d, 1t f0und th1n3" : binaryCorruptText}
                                        </span>
                                    </div>
                                    <div style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f59e0b' }}>
                                        <span style={{ color: '#10b981', fontWeight: '600', minWidth: '80px' }}>
                                            {letterReplace(brokenElements.includes('text-scrambled') ? "W@RN1NG:" : "WARNING:")}
                                        </span>
                                        <span style={{ animation: brokenElements.includes('complete-chaos') ? 'chaos 0.1s infinite' : 'pulse 1.5s infinite' }}>
                                            {letterReplace(brokenElements.includes('text-scrambled') ? "T3mp0r@l d1$pl@c3m3nt d3t3ct3d 1n T3$t Ch@mb3r 3" : "Temporal displacement detected in Test Chamber 3")}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div style={{
                                    background: 'rgba(0, 0, 0, 0.4)',
                                    border: '1px solid rgba(0, 255, 0, 0.2)',
                                    borderRadius: '8px',
                                    padding: '1rem',
                                    textAlign: 'center',
                                    transform: brokenElements.includes('layout-broken') ? 'rotate(-10deg)' : 'none'
                                }}>
                                    <div style={{ fontSize: '0.75rem', color: '#10b981', marginBottom: '0.5rem' }}>
                                        {letterReplace(brokenElements.includes('text-scrambled') ? "C0N$C10U$N3$$ T1M3R" : "CONSCIOUSNESS TIMER")}
                                    </div>
                                    <div style={{ 
                                        fontSize: brokenElements.includes('fonts-corrupted') ? '4rem' : '2rem', 
                                        fontWeight: '700', 
                                        color: brokenElements.includes('complete-chaos') ? '#ff00ff' : '#ffffff', 
                                        marginBottom: '0.25rem',
                                        fontFamily: brokenElements.includes('fonts-corrupted') ? 'Impact' : 'inherit'
                                    }}>
                                        {brokenElements.includes('text-scrambled') ? '∞∞∞' : '∞'}
                                    </div>
                                    <div style={{ fontSize: '0.625rem', color: '#6b7280' }}>
                                        {letterReplace(brokenElements.includes('text-scrambled') ? "T1m3 D1$$0lv3d" : "Time Dissolved")}
                                    </div>
                                </div>
                                <div style={{
                                    background: 'rgba(0, 0, 0, 0.4)',
                                    border: '1px solid rgba(0, 255, 0, 0.2)',
                                    borderRadius: '8px',
                                    padding: '1rem',
                                    textAlign: 'center',
                                    transform: brokenElements.includes('layout-broken') ? 'rotate(10deg)' : 'none'
                                }}>
                                    <div style={{ fontSize: '0.75rem', color: '#10b981', marginBottom: '0.5rem' }}>
                                        {letterReplace(brokenElements.includes('text-scrambled') ? "T3MP0R@L R3F3R3NC3" : "TEMPORAL REFERENCE")}
                                    </div>
                                    <div style={{ 
                                        fontSize: brokenElements.includes('fonts-corrupted') ? '4rem' : '2rem', 
                                        fontWeight: '700', 
                                        color: brokenElements.includes('complete-chaos') ? '#00ffff' : '#06b6d4', 
                                        marginBottom: '0.25rem',
                                        fontFamily: brokenElements.includes('fonts-corrupted') ? 'Impact' : 'inherit'
                                    }}>
                                        {brokenElements.includes('text-scrambled') ? '0xDEAD' : hexCorruptText}
                                    </div>
                                    <div style={{ fontSize: '0.625rem', color: '#6b7280' }}>
                                        {letterReplace(brokenElements.includes('text-scrambled') ? "R3@l1ty @nch0r T1m3$t@mp" : "Reality Anchor Timestamp")}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Session ID Warning */}
                        <div style={{
                            background: 'rgba(255, 0, 0, 0.1)',
                            border: '2px solid #ef4444',
                            borderRadius: brokenElements.includes('layout-broken') ? '50px' : '12px',
                            padding: '2rem',
                            textAlign: 'center',
                            marginBottom: '2rem',
                            animation: brokenElements.includes('complete-chaos') ? 'chaos 0.1s infinite' : 'flash 1s infinite',
                            transform: brokenElements.includes('layout-broken') ? `translateY(${index * 20}px)` : 'none'
                        }}>
                            <div style={{ 
                                fontSize: brokenElements.includes('fonts-corrupted') ? '3rem' : '1.5rem', 
                                color: '#ef4444', 
                                marginBottom: '1rem',
                                fontFamily: brokenElements.includes('fonts-corrupted') ? 'Impact' : 'inherit'
                            }}>
                                {letterReplace(`Y0U $H0ULDNT B3 H3R3 ${sessionId}`)}
                            </div>
                            <div style={{ fontSize: '1rem', color: '#fca5a5' }}>
                                {letterReplace(brokenElements.includes('text-scrambled') ? "Th3 $y$t3m kn0w$ w3 @r3 h3r3. Th3 r00t$ @r3 w@tch1ng." : "The system knows we are here. The roots are watching.")}
                            </div>
                        </div>
                    </div>
                </main>
            ))}

            {/* Reset button after 6-7 scrolls */}
            {scrollCount >= 6 && (
                <div style={{
                    position: 'fixed',
                    bottom: '2rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    textAlign: 'center',
                    background: 'rgba(0, 0, 0, 0.9)',
                    padding: '2rem',
                    border: '2px solid #ef4444',
                    borderRadius: '12px',
                    boxShadow: '0 0 30px rgba(255, 0, 0, 0.5)',
                    zIndex: 1000
                }}>
                    <div style={{
                        color: '#ffff00',
                        marginBottom: '1rem',
                        fontSize: '1.1rem',
                        lineHeight: '1.6'
                    }}>
                        なぜ (Why) • لماذا (Why) • Pourquoi (DO) • Warum (THIS)
                    </div>
                    <button
                        style={{
                            background: 'linear-gradient(135deg, #ef4444 0%, #cc0000 100%)',
                            border: 'none',
                            color: '#ffffff',
                            padding: '1rem 2rem',
                            borderRadius: '8px',
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'linear-gradient(135deg, #cc0000 0%, #ef4444 100%)';
                            e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 0, 0, 0.7)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'linear-gradient(135deg, #ef4444 0%, #cc0000 100%)';
                            e.currentTarget.style.boxShadow = 'none';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                        onClick={async () => {
                            speechSynthesis.cancel();
                            if (ttsAudioRef.current) {
                                ttsAudioRef.current.pause();
                                ttsAudioRef.current.src = '';
                            }
                            Cookies.remove('Corrupt');
                            Cookies.remove('corrupting');
                            await signCookie('No_corruption=true');
                            router.replace('/');
                        }}
                    >
                        RESET
                    </button>
                </div>
            )}

            <style jsx>{`
                @keyframes scroll-left {
                    0% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                }
                @keyframes scroll-broken {
                    0% { transform: translateX(100%) rotate(0deg); }
                    50% { transform: translateX(0%) rotate(180deg); }
                    100% { transform: translateX(-100%) rotate(360deg); }
                }
                @keyframes flash {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                @keyframes chaos {
                    0% { transform: translate(0px, 0px) rotate(0deg); }
                    25% { transform: translate(-2px, 2px) rotate(1deg); }
                    50% { transform: translate(2px, -2px) rotate(-1deg); }
                    75% { transform: translate(-1px, 1px) rotate(0.5deg); }
                    100% { transform: translate(0px, 0px) rotate(0deg); }
                }
                @keyframes chaos-pulse {
                    0% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.3; transform: scale(1.5); }
                    100% { opacity: 1; transform: scale(1); }
                }
                @keyframes blink {
                    0%, 50% { opacity: 1; }
                    51%, 100% { opacity: 0; }
                }
                
                .header-broken {
                    animation: chaos 0.2s infinite;
                }
                
                .text-scrambled * {
                    text-shadow: 2px 2px 0px #ff0000, -2px -2px 0px #00ff00;
                }
                
                .final-breakdown {
                    filter: contrast(200%) saturate(300%) hue-rotate(90deg);
                    animation: chaos 0.05s infinite;
                }
                
                .final-breakdown * {
                    font-family: 'Impact', 'Arial Black', serif !important;
                    text-transform: uppercase;
                    letter-spacing: 3px;
                }
            `}</style>
        </div>
    );
}