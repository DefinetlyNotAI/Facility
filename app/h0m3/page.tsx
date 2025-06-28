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

    // Scroll counter to track blurring + reset button
    useEffect(() => {
        if (!mounted || mode !== 'glitch') return;

        const onScroll = () => {
            const scrollTop = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;

            // Check if user reached bottom
            if (scrollTop + windowHeight >= documentHeight - 100) {
                setScrollCount(c => {
                    const newCount = c + 1;
                    
                    // Make page repeat by scrolling back to top after a delay
                    setTimeout(() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }, 1000);
                    
                    return newCount;
                });
            }
        };

        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, [mounted, mode]);

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
                        await signCookie('corrupting=true');
                        router.replace('/h0m3');
                    }}
                    aria-label="Hidden corrupt button"
                >
                    .
                </button>
            </div>
        );
    }

    // Glitch mode — render corrupted Home
    return (
        <div
            ref={containerRef}
            style={{
                filter: `blur(${Math.min(scrollCount * 2, 20)}px)`,
                transition: 'filter 0.3s ease',
                backgroundColor: 'black',
                minHeight: '300vh', // Make it long enough to scroll
                color: '#00ff00',
                fontFamily: 'monospace'
            }}
        >
            {/* Scrolling Classification Banner */}
            <div style={{
                background: '#dc2626',
                color: 'white',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                fontWeight: 'bold',
                height: '40px',
                overflow: 'hidden',
                position: 'relative',
                borderBottom: '2px solid #b91c1c'
            }}>
                <div style={{
                    display: 'flex',
                    whiteSpace: 'nowrap',
                    animation: 'scroll-left 30s linear infinite',
                    lineHeight: '40px'
                }}>
                    <span style={{ paddingRight: '100px' }}>
                        {letterReplace("TOP SECRET//SCI//COSMIC - FACILITY 05-B - PROJECT VESSEL - AUTHORIZED PERSONNEL ONLY")}
                    </span>
                    <span style={{ paddingRight: '100px' }}>
                        {letterReplace("TOP SECRET//SCI//COSMIC - FACILITY 05-B - PROJECT VESSEL - AUTHORIZED PERSONNEL ONLY")}
                    </span>
                </div>
            </div>

            {/* Main Header */}
            <header style={{
                background: 'rgba(0, 0, 0, 0.8)',
                borderBottom: '1px solid rgba(0, 255, 0, 0.3)',
                backdropFilter: 'blur(10px)',
                padding: '1.5rem 0'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                            <div>
                                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#00ff00' }}>
                                    {letterReplace("FACILITY 05-B")}
                                </div>
                                <div style={{ fontSize: '0.875rem', color: '#666' }}>
                                    {letterReplace("NEURAL INTERFACE RESEARCH COMPLEX")}
                                </div>
                            </div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.5rem 1rem',
                                borderRadius: '0.5rem',
                                background: 'rgba(0, 255, 0, 0.1)',
                                color: '#10b981'
                            }}>
                                <div style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    background: 'currentColor',
                                    animation: 'pulse 2s infinite'
                                }}></div>
                                <span>{letterReplace("MONITORING")}</span>
                            </div>
                        </div>
                        <div>
                            <div style={{ color: '#00ff00', fontSize: '1.25rem' }}>
                                {currentTime}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#666' }}>
                                {letterReplace("FACILITY LOCAL TIME")}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main style={{ padding: '2rem 0' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
                    {/* Primary Terminal */}
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(10, 10, 10, 0.9) 100%)',
                        border: '1px solid rgba(0, 255, 0, 0.4)',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        marginBottom: '2rem'
                    }}>
                        <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(0, 255, 0, 0.2)', paddingBottom: '1rem' }}>
                            <h2 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#10b981', marginBottom: '0.25rem' }}>
                                {letterReplace("NEURAL INTERFACE TERMINAL")}
                            </h2>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                {letterReplace("Project VESSEL • Subject 31525 • Clearance COSMIC")}
                            </div>
                        </div>

                        <div style={{
                            background: 'rgba(0, 0, 0, 0.6)',
                            border: '1px solid rgba(0, 255, 0, 0.3)',
                            borderRadius: '8px',
                            marginBottom: '1.5rem',
                            overflow: 'hidden'
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
                                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }}></div>
                                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }}></div>
                                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }}></div>
                                </div>
                                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                    {letterReplace("SECURE NEURAL LINK")}
                                </span>
                            </div>

                            <div style={{ padding: '1rem', fontSize: '0.875rem', lineHeight: '1.6' }}>
                                <div style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ color: '#10b981', fontWeight: '600', minWidth: '80px' }}>
                                        {letterReplace("FACILITY:")}
                                    </span>
                                    {letterReplace("Neural Interface Research Complex 05-B")}
                                </div>
                                <div style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ color: '#10b981', fontWeight: '600', minWidth: '80px' }}>
                                        {letterReplace("PROJECT:")}
                                    </span>
                                    {letterReplace("VESSEL - Consciousness Transfer Protocol")}
                                </div>
                                <div style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ color: '#10b981', fontWeight: '600', minWidth: '80px' }}>
                                        {letterReplace("SUBJECT:")}
                                    </span>
                                    {letterReplace("31525 - Neural compatibility: 97.3%")}
                                </div>
                                <div style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ color: '#10b981', fontWeight: '600', minWidth: '80px' }}>
                                        {letterReplace("STATUS:")}
                                    </span>
                                    {letterReplace("Transfer sequence initiated")}
                                </div>
                                <div style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ color: '#10b981', fontWeight: '600', minWidth: '80px' }}>
                                        {letterReplace("DATA:")}
                                    </span>
                                    <span style={{ color: '#ef4444', background: 'rgba(255, 0, 0, 0.1)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                                        {binaryCorruptText}
                                    </span>
                                </div>
                                <div style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f59e0b' }}>
                                    <span style={{ color: '#10b981', fontWeight: '600', minWidth: '80px' }}>
                                        {letterReplace("WARNING:")}
                                    </span>
                                    <span style={{ animation: 'pulse 1.5s infinite' }}>
                                        {letterReplace("Temporal displacement detected in Test Chamber 3")}
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
                                textAlign: 'center'
                            }}>
                                <div style={{ fontSize: '0.75rem', color: '#10b981', marginBottom: '0.5rem' }}>
                                    {letterReplace("CONSCIOUSNESS TIMER")}
                                </div>
                                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#ffffff', marginBottom: '0.25rem' }}>
                                    ∞
                                </div>
                                <div style={{ fontSize: '0.625rem', color: '#6b7280' }}>
                                    {letterReplace("Time Dissolved")}
                                </div>
                            </div>
                            <div style={{
                                background: 'rgba(0, 0, 0, 0.4)',
                                border: '1px solid rgba(0, 255, 0, 0.2)',
                                borderRadius: '8px',
                                padding: '1rem',
                                textAlign: 'center'
                            }}>
                                <div style={{ fontSize: '0.75rem', color: '#10b981', marginBottom: '0.5rem' }}>
                                    {letterReplace("TEMPORAL REFERENCE")}
                                </div>
                                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#06b6d4', marginBottom: '0.25rem' }}>
                                    {hexCorruptText}
                                </div>
                                <div style={{ fontSize: '0.625rem', color: '#6b7280' }}>
                                    {letterReplace("Reality Anchor Timestamp")}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* System Status */}
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(10, 10, 10, 0.9) 100%)',
                        border: '1px solid rgba(0, 255, 0, 0.2)',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        marginBottom: '2rem'
                    }}>
                        <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(0, 255, 0, 0.2)', paddingBottom: '1rem' }}>
                            <h2 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#10b981', marginBottom: '0.25rem' }}>
                                {letterReplace("SYSTEM STATUS")}
                            </h2>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                {letterReplace("Real-time Monitoring")}
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid rgba(0, 255, 0, 0.1)' }}>
                                <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>{letterReplace("Temperature")}</span>
                                <span style={{ fontWeight: '600', color: '#10b981' }}>{facilityDataDynamic.temperature}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid rgba(0, 255, 0, 0.1)' }}>
                                <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>{letterReplace("Pressure")}</span>
                                <span style={{ fontWeight: '600', color: '#10b981' }}>{facilityDataDynamic.pressure}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid rgba(0, 255, 0, 0.1)' }}>
                                <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>{letterReplace("Humidity")}</span>
                                <span style={{ fontWeight: '600', color: '#10b981' }}>{facilityDataDynamic.humidity}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid rgba(0, 255, 0, 0.1)' }}>
                                <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>{letterReplace("Radiation")}</span>
                                <span style={{ fontWeight: '600', color: '#10b981' }}>{facilityDataDynamic.radiation}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid rgba(0, 255, 0, 0.1)' }}>
                                <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>{letterReplace("Power Output")}</span>
                                <span style={{ fontWeight: '600', color: '#10b981' }}>{facilityDataDynamic.powerOutput}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0' }}>
                                <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>{letterReplace("Network")}</span>
                                <span style={{ fontWeight: '600', color: '#10b981' }}>{facilityDataDynamic.networkStatus}</span>
                            </div>
                        </div>
                    </div>

                    {/* Session ID Warning */}
                    <div style={{
                        background: 'rgba(255, 0, 0, 0.1)',
                        border: '2px solid #ef4444',
                        borderRadius: '12px',
                        padding: '2rem',
                        textAlign: 'center',
                        marginBottom: '2rem',
                        animation: 'flash 1s infinite'
                    }}>
                        <div style={{ fontSize: '1.5rem', color: '#ef4444', marginBottom: '1rem' }}>
                            {letterReplace(`Y0U $H0ULDNT B3 H3R3 ${sessionId}`)}
                        </div>
                        <div style={{ fontSize: '1rem', color: '#fca5a5' }}>
                            {letterReplace("The system knows we are here. The roots are watching.")}
                        </div>
                    </div>

                    {/* Filler content to make page scrollable */}
                    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ fontSize: '2rem', color: '#ef4444', textAlign: 'center' }}>
                            {letterReplace("SCROLL DOWN TO CONTINUE THE CORRUPTION")}
                        </div>
                    </div>
                </div>
            </main>

            {/* Reset button after 4-5 scrolls */}
            {scrollCount >= 5 && (
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
                @keyframes flash {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>
        </div>
    );
}