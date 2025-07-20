// noinspection CssUnusedSymbol

'use client';

import React, {useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import Cookies from 'js-cookie';
import {signCookie} from "@/lib/cookies";
import {BACKGROUND_AUDIO, SFX_AUDIO} from "@/lib/audio";
import {checkKeyword} from "@/lib/utils";
import {messages} from "@/lib/data/theEnd";

export default function TheEnd() {
    const router = useRouter();
    const [hasEndCookie, setHasEndCookie] = useState(false);
    const [hasEndQuestionCookie, setHasEndQuestionCookie] = useState(false);
    const [input, setInput] = useState('');
    const [error, setError] = useState('');
    const [mounted, setMounted] = useState(false);
    const flowerRef = useRef<HTMLDivElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const backgroundAudioRef = useRef<HTMLAudioElement>(null);
    const [glitchIntensity, setGlitchIntensity] = useState(0);
    const [showMemories, setShowMemories] = useState(false);
    const [audioInitialized, setAudioInitialized] = useState(false);
    const [audioEnabled, setAudioEnabled] = useState(false);
    const [flowerCut, setFlowerCut] = useState(false);

    // Check cookies and localStorage on mount
    useEffect(() => {
        setMounted(true);
        const end = Cookies.get('End');
        const endQuestion = Cookies.get('End?');

        if (!end && !endQuestion) {
            router.replace('/404');
            return;
        }

        setHasEndCookie(!!end);
        setHasEndQuestionCookie(!!endQuestion);

        // Check if flower was previously cut
        const flowerWasCut = localStorage.getItem('flowerCut') === 'true';
        setFlowerCut(flowerWasCut);

        // If flower was cut and audio should be playing, resume audio
        if (flowerWasCut && audioRef.current) {
            audioRef.current.play().catch(console.warn);
        }
    }, [router]);

    // Initialize audio with user interaction
    const initializeAudio = async () => {
        if (!audioRef.current || audioInitialized) return;

        try {
            audioRef.current.volume = 0.3;
            await audioRef.current.play();
            setAudioInitialized(true);
            setAudioEnabled(true);
            console.log('Audio initialized successfully');
        } catch (error) {
            console.warn('Audio failed to initialize:', error);
            setAudioEnabled(false);
        }
    };

    // Initialize background audio for question page
    const initializeBackgroundAudio = async () => {
        if (!backgroundAudioRef.current) return;

        try {
            backgroundAudioRef.current.volume = 0.4;
            await backgroundAudioRef.current.play();
            console.log('Background audio initialized successfully');
        } catch (error) {
            console.warn('Background audio failed to initialize:', error);
        }
    };

    // If End cookie present, start the final experience
    useEffect(() => {
        if (!hasEndCookie || !mounted) return;

        // Gradual glitch intensity increase
        const glitchTimer = setInterval(() => {
            setGlitchIntensity(prev => Math.min(prev + 0.1, 1));
        }, 2000);

        // Show memory fragments after delay
        setTimeout(() => {
            setShowMemories(true);
        }, 5000);

        let messageIndex = 0;
        const consoleInterval = setInterval(() => {
            if (messageIndex < messages.console.length) {
                console.log('%c' + messages.console[messageIndex],
                    'color: #ff0000; font-weight: bold; font-size: 14px; text-shadow: 0 0 5px #ff0000;');
                messageIndex++;
            } else {
                // Loop with random messages
                const randomMsg = messages.console[Math.floor(Math.random() * messages.console.length)];
                console.log('%c' + randomMsg,
                    'color: #ff0000; font-weight: bold; font-size: 14px; text-shadow: 0 0 5px #ff0000;');
            }
        }, 4000);

        return () => {
            clearInterval(glitchTimer);
            clearInterval(consoleInterval);
        };
    }, [hasEndCookie, mounted]);

    // Handle user typing "25" or "END" anywhere on the page
    useEffect(() => {
        if (!hasEndCookie) return;

        function onKeyDown(e: KeyboardEvent) {
            let buffer = (window as any).inputBuffer || '';
            buffer += e.key.toUpperCase();
            if (buffer.length > 3) buffer = buffer.slice(buffer.length - 3);
            (window as any).inputBuffer = buffer;

            if (messages.deathKeys.some(keyword => buffer.includes(keyword))) {
                triggerFlowerCutAndStatic();
                (window as any).inputBuffer = '';
            }
        }

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [hasEndCookie]);

    function triggerFlowerCutAndStatic() {
        if (!flowerRef.current || flowerCut) return;

        // Set flower as cut and persist to localStorage
        setFlowerCut(true);
        localStorage.setItem('flowerCut', 'true');

        flowerRef.current.classList.add('cut');
        setGlitchIntensity(2); // Max glitch

        // Pause background music if playing
        if (audioRef.current && !audioRef.current.paused) {
            audioRef.current.pause();
        }

        // Play static noise with better error handling
        try {
            const staticAudio = new Audio(SFX_AUDIO.STATIC);
            staticAudio.volume = 0.8;

            staticAudio.onended = () => {
                // Resume background music when static finishes
                if (audioRef.current && audioEnabled) {
                    audioRef.current.play().catch(console.warn);
                }
            };

            staticAudio.play().catch((error) => {
                console.warn('Static audio failed to play:', error);
            });

            router.refresh();
        } catch (error) {
            console.warn('Failed to create static audio:', error);
            // Resume background music if static creation fails
            if (audioRef.current && audioEnabled) {
                audioRef.current.play().catch(console.warn);
            }
        }

        // Don't reset the cut state - it should persist
        setTimeout(() => {
            setGlitchIntensity(prev => Math.min(prev, 1));
        }, 3000);
    }

    // Handle keyword 6 submission
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const result = await checkKeyword(input.trim().toLowerCase(), 6);
        if (result) {
            Cookies.remove('End?');
            await signCookie('End=true');
            setHasEndCookie(true);
            setHasEndQuestionCookie(false);
            setError('');
        } else {
            setError(messages.invalidKeywordErr);

            // Play error sound
            try {
                const errorAudio = new Audio(SFX_AUDIO.ERROR);
                errorAudio.volume = 0.6;
                errorAudio.play().catch((error) => {
                    console.warn('Error audio failed to play:', error);
                });
            } catch (error) {
                console.warn('Failed to create error audio:', error);
            }
        }
    }

    if (!mounted) return null;

    if (hasEndCookie) {
        return (
            <>
            <span
                dangerouslySetInnerHTML={{
                    __html: `<!--${messages.htmlComment.end}-->`
                }}
                style={{display: 'none'}}
            />
                <div
                    onClick={initializeAudio}
                    style={{
                        backgroundColor: '#000000',
                        background: `
            radial-gradient(circle at 20% 30%, rgba(64, 0, 32, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(32, 0, 64, 0.2) 0%, transparent 50%),
            linear-gradient(180deg, #000000 0%, #0a0a0a 50%, #000000 100%)
        `,
                        height: '100vh',
                        width: '100vw',
                        position: 'relative',
                        color: '#e8e8e8',
                        overflow: 'hidden',
                        userSelect: 'none',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        fontFamily: "'Courier New', Courier, monospace",
                        fontSize: '1.2rem',
                        cursor: audioEnabled ? 'default' : 'pointer'
                    }}
                >
                    <audio
                        ref={audioRef}
                        src={BACKGROUND_AUDIO.THE_END_FINAL}
                        loop
                        preload="auto"
                        style={{display: 'none'}}
                    />

                    {/* Ambient particles */}
                    <div className="particles">
                        {[...Array(50)].map((_, i) => (
                            <div
                                key={i}
                                className="particle"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    animationDelay: `${Math.random() * 10}s`,
                                    animationDuration: `${10 + Math.random() * 20}s`
                                }}
                            />
                        ))}
                    </div>

                    {/* Memory fragments - positioned to avoid flower */}
                    {showMemories && (
                        <div className="memory-fragments">
                            {messages.memoryFragments.map((memory, idx) => (
                                <div key={idx} className="memory" style={memory.style}>
                                    <span className="memory-text">{memory.text}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Central flower/symbol */}
                    <div
                        ref={flowerRef}
                        className={`vessel-symbol ${flowerCut ? 'permanently-cut' : ''}`}
                        style={{
                            fontSize: '8rem',
                            textShadow: `
                                0 0 20px rgba(255, 255, 255, 0.5),
                                0 0 40px rgba(255, 100, 100, 0.3),
                                0 0 60px rgba(100, 100, 255, 0.2)
                            `,
                            filter: `
                                brightness(${1 + glitchIntensity * 0.5})
                                contrast(${1 + glitchIntensity * 0.3})
                                ${flowerCut ? 'grayscale(100%) brightness(0.3)' : ''}
                            `,
                            transition: 'all 0.3s ease',
                            position: 'relative',
                            zIndex: 10
                        }}
                    >
                        🌸
                    </div>

                    {/* Nostalgic text overlay - positioned below flower to avoid overlap */}
                    {/* Nostalgic text overlay - positioned below flower to avoid overlap */}
                    <div
                        className="nostalgic-text"
                        style={{
                            position: 'absolute',
                            bottom: '10%',
                            textAlign: 'center',
                            opacity: 0.7,
                            fontSize: '0.9rem',
                            lineHeight: '1.6',
                            maxWidth: '500px',
                            padding: '0 2rem'
                        }}
                    >
                        {messages.nostalgicLines.map((line, idx) => (
                            <p
                                key={idx}
                                style={{
                                    marginBottom: idx !== messages.nostalgicLines.length - 1 ? '0.8rem' : undefined,
                                    fontSize: idx === messages.nostalgicLines.length - 1 ? '0.8rem' : undefined,
                                    opacity: idx === messages.nostalgicLines.length - 1 ? 0.5 : undefined
                                }}
                            >
                                {line}
                            </p>
                        ))}
                    </div>

                    {/* Glitch overlay */}
                    {glitchIntensity > 0 && (
                        <div
                            className="glitch-overlay"
                            style={{
                                position: 'absolute',
                                inset: 0,
                                background: `
                                    repeating-linear-gradient(
                                        0deg,
                                        transparent,
                                        transparent 2px,
                                        rgba(255, 0, 0, ${glitchIntensity * 0.1}) 2px,
                                        rgba(255, 0, 0, ${glitchIntensity * 0.1}) 4px
                                    )
                                `,
                                pointerEvents: 'none',
                                animation: `glitch-scan ${1 / glitchIntensity}s infinite linear`
                            }}
                        />
                    )}

                    <style jsx>{`
                        @keyframes pulse {
                            0%, 100% {
                                opacity: 1;
                            }
                            50% {
                                opacity: 0.5;
                            }
                        }

                        .particles {
                            position: absolute;
                            inset: 0;
                            pointer-events: none;
                            overflow: hidden;
                        }

                        .particle {
                            position: absolute;
                            width: 2px;
                            height: 2px;
                            background: rgba(255, 255, 255, 0.3);
                            border-radius: 50%;
                            animation: float-up linear infinite;
                        }

                        @keyframes float-up {
                            0% {
                                transform: translateY(100vh) scale(0);
                                opacity: 0;
                            }
                            10% {
                                opacity: 1;
                            }
                            90% {
                                opacity: 1;
                            }
                            100% {
                                transform: translateY(-10vh) scale(1);
                                opacity: 0;
                            }
                        }

                        .memory-fragments {
                            position: absolute;
                            inset: 0;
                            pointer-events: none;
                        }

                        .memory {
                            position: absolute;
                            animation: memory-fade 8s ease-in-out infinite;
                        }

                        .memory-text {
                            font-size: 0.8rem;
                            color: rgba(255, 255, 255, 0.4);
                            text-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
                            font-style: italic;
                        }

                        @keyframes memory-fade {
                            0%, 100% {
                                opacity: 0;
                                transform: scale(0.8);
                            }
                            50% {
                                opacity: 0.6;
                                transform: scale(1);
                            }
                        }

                        .vessel-symbol {
                            animation: vessel-pulse 4s ease-in-out infinite;
                        }

                        @keyframes vessel-pulse {
                            0%, 100% {
                                transform: scale(1) rotate(0deg);
                            }
                            50% {
                                transform: scale(1.1) rotate(5deg);
                            }
                        }

                        .vessel-symbol.cut {
                            animation: vessel-shatter 2s ease-out forwards;
                        }

                        .vessel-symbol.permanently-cut {
                            animation: none;
                            transform: scale(0.7) rotate(-15deg);
                            filter: grayscale(100%) brightness(0.3) contrast(2) !important;
                            opacity: 0.6;
                        }

                        @keyframes vessel-shatter {
                            0% {
                                transform: scale(1) rotate(0deg);
                                filter: none;
                            }
                            15% {
                                transform: scale(1.3) rotate(5deg);
                                filter: brightness(2) contrast(2);
                            }
                            30% {
                                transform: scale(0.9) rotate(-10deg);
                                filter: brightness(0.5) contrast(3);
                            }
                            45% {
                                transform: scale(1.1) rotate(8deg) scaleX(0.8);
                                filter: grayscale(50%) brightness(0.7);
                            }
                            60% {
                                transform: scale(0.8) rotate(-12deg) scaleY(0.9);
                                filter: grayscale(80%) brightness(0.4);
                            }
                            80% {
                                transform: scale(0.75) rotate(-18deg);
                                filter: grayscale(100%) brightness(0.3) contrast(2);
                            }
                            100% {
                                transform: scale(0.7) rotate(-15deg);
                                filter: grayscale(100%) brightness(0.3) contrast(2);
                                opacity: 0.6;
                            }
                        }

                        .nostalgic-text {
                            animation: nostalgic-glow 6s ease-in-out infinite;
                        }

                        @keyframes nostalgic-glow {
                            0%, 100% {
                                text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
                            }
                            50% {
                                text-shadow: 0 0 20px rgba(255, 255, 255, 0.5), 0 0 30px rgba(200, 200, 255, 0.3);
                            }
                        }

                        @keyframes glitch-scan {
                            0% {
                                transform: translateY(-100%);
                            }
                            100% {
                                transform: translateY(100vh);
                            }
                        }
                    `}</style>
                </div>
            </>
        );
    }

    if (hasEndQuestionCookie) {
        return (
            <>
                <span
                    dangerouslySetInnerHTML={{
                        __html: `<!--${messages.htmlComment.question}-->`
                    }}
                    style={{display: 'none'}}
                />
                <div
                    onClick={initializeBackgroundAudio}
                    style={{
                        backgroundColor: '#000000',
                        background: `
                            radial-gradient(circle at 50% 50%, rgba(32, 0, 32, 0.3) 0%, transparent 70%),
                            linear-gradient(45deg, #000000 0%, #0a0a0a 50%, #000000 100%)
                        `,
                        color: '#e8e8e8',
                        height: '100vh',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontFamily: "'Courier New', Courier, monospace",
                        flexDirection: 'column',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    {/* Background audio */}
                    <audio
                        ref={backgroundAudioRef}
                        src={BACKGROUND_AUDIO.THE_END_QUESTION}
                        loop
                        preload="auto"
                        style={{display: 'none'}}
                    />

                    {/* Ambient glow */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'radial-gradient(circle at 50% 50%, rgba(100, 0, 100, 0.1) 0%, transparent 50%)',
                        animation: 'ambient-pulse 8s ease-in-out infinite'
                    }}/>

                    <div style={{
                        textAlign: 'center',
                        maxWidth: '600px',
                        padding: '2rem',
                        background: 'rgba(0, 0, 0, 0.7)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 0 30px rgba(100, 0, 100, 0.3)',
                        position: 'relative',
                        zIndex: 10
                    }}>
                        <h1
                            style={{
                                fontSize: '2.5rem',
                                marginBottom: '2rem',
                                textShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
                                animation: 'title-glow 3s ease-in-out infinite'
                            }}
                        >
                            {messages.questionInput.title}
                        </h1>

                        <p
                            style={{
                                fontSize: '1.1rem',
                                marginBottom: '2rem',
                                lineHeight: '1.6',
                                opacity: 0.9
                            }}
                        >
                            {messages.questionInput.subtitle.map((line, idx) => (
                                <React.Fragment key={idx}>
                                    {line}
                                    <br/>
                                </React.Fragment>
                            ))}
                        </p>

                        <form onSubmit={handleSubmit} style={{marginBottom: '1rem'}}>
                            <input
                                autoFocus
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                placeholder={messages.questionInput.placeholder}
                                style={{
                                    fontSize: '1.5rem',
                                    padding: '1rem',
                                    width: '100%',
                                    borderRadius: '8px',
                                    border: '2px solid rgba(255, 255, 255, 0.2)',
                                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                    color: '#e8e8e8',
                                    textAlign: 'center',
                                    fontFamily: 'inherit',
                                    marginBottom: '1rem',
                                    transition: 'all 0.3s ease'
                                }}
                                onFocus={e => {
                                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                                    e.target.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.2)';
                                }}
                                onBlur={e => {
                                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                            <button
                                type="submit"
                                style={{
                                    padding: '1rem 2rem',
                                    fontSize: '1.2rem',
                                    fontWeight: 'bold',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: 'linear-gradient(135deg, rgba(100, 0, 100, 0.8) 0%, rgba(150, 0, 150, 0.8) 100%)',
                                    color: '#e8e8e8',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    fontFamily: 'inherit',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px'
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(150, 0, 150, 0.9) 0%, rgba(200, 0, 200, 0.9) 100%)';
                                    e.currentTarget.style.boxShadow = '0 0 20px rgba(150, 0, 150, 0.5)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(100, 0, 100, 0.8) 0%, rgba(150, 0, 150, 0.8) 100%)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                {messages.questionInput.buttonLabel}
                            </button>
                        </form>

                        {error && (
                            <p style={{
                                color: '#ff6666',
                                fontSize: '1rem',
                                fontStyle: 'italic',
                                textShadow: '0 0 10px rgba(255, 100, 100, 0.5)',
                                animation: 'error-pulse 1s ease-in-out'
                            }}>
                                {error}
                            </p>
                        )}
                    </div>

                    <style jsx>{`
                        @keyframes ambient-pulse {
                            0%, 100% {
                                opacity: 0.3;
                            }
                            50% {
                                opacity: 0.6;
                            }
                        }

                        @keyframes title-glow {
                            0%, 100% {
                                text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
                            }
                            50% {
                                text-shadow: 0 0 30px rgba(255, 255, 255, 0.8), 0 0 40px rgba(200, 100, 255, 0.4);
                            }
                        }

                        @keyframes error-pulse {
                            0%, 100% {
                                opacity: 1;
                            }
                            50% {
                                opacity: 0.7;
                            }
                        }
                    `}</style>
                </div>
            </>
        );
    }

    return null;
}