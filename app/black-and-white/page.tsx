'use client';

import {useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import Cookies from 'js-cookie';
import {signCookie} from "@/lib/cookie-utils";

const KEYWORD_5 = 'Echoes';

export default function BlackAndWhitePage() {
    const router = useRouter();
    const [bnwUnlocked, setBnwUnlocked] = useState<boolean | null>(null);
    const inputBufferRef = useRef('');
    const topLeftBufferRef = useRef('');
    const [message, setMessage] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

    // Initialize background audio
    useEffect(() => {
        const initializeAudio = () => {
            if (audioRef.current) {
                audioRef.current.volume = 0.3;
                audioRef.current.play().catch(() => {
                    // Auto-play failed, will try again on user interaction
                    const handleInteraction = () => {
                        if (audioRef.current) {
                            audioRef.current.play().catch(console.warn);
                        }
                        document.removeEventListener('click', handleInteraction);
                        document.removeEventListener('keydown', handleInteraction);
                    };
                    document.addEventListener('click', handleInteraction);
                    document.addEventListener('keydown', handleInteraction);
                });
            }
        };

        if (bnwUnlocked) {
            initializeAudio();
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        };
    }, [bnwUnlocked]);

    // On mount: check cookie, else redirect 404
    useEffect(() => {
        const unlocked = Cookies.get('BnW_unlocked');
        if (!unlocked) {
            router.replace('/404');
            return;
        }
        setBnwUnlocked(true);
    }, [router]);

    // Keyboard listener for typed input (console input simulation)
    useEffect(() => {
        if (!bnwUnlocked) return;

        const maxLength = 20;

        const onKeyDown = async (e: KeyboardEvent) => {
            if (e.key.length === 1) {
                inputBufferRef.current += e.key.toLowerCase();
                if (inputBufferRef.current.length > maxLength) {
                    inputBufferRef.current = inputBufferRef.current.slice(-maxLength);
                }

                if (inputBufferRef.current.endsWith(KEYWORD_5.toLowerCase())) {
                    if (window.innerWidth === 666 && window.innerHeight === 666) {
                        await signCookie('Choice_Unlocked=true');
                        router.push('/choices');
                    } else {
                        setMessage('Incorrect screen size for unlocking choice.');
                    }
                }
            }

            if (e.key.length === 1) {
                topLeftBufferRef.current += e.key;
                if (topLeftBufferRef.current.length > 3) {
                    topLeftBufferRef.current = topLeftBufferRef.current.slice(-3);
                }

                if (topLeftBufferRef.current === '404') {
                    const rand = Math.floor(Math.random() * 404);
                    if (rand === 0) {
                        await signCookie("themoon=true");
                        router.push('/moonlight');
                    } else {
                        router.push('/404');
                    }
                }
            }
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [bnwUnlocked, router]);

    if (bnwUnlocked === null) return null;

    return (
        <>
            <audio
                ref={audioRef}
                src="/sfx/music/doangelsexist.mp3"
                loop
                preload="auto"
                style={{display: 'none'}}
            />
            <div
                style={{
                    backgroundColor: 'black',
                    color: 'white',
                    height: '100vh',
                    padding: '1rem',
                    fontFamily: 'Courier New, monospace',
                    userSelect: 'none',
                    overflowY: 'auto',
                }}
            >
                {/* Hidden 404 Corner */}
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        fontSize: '10px',
                        color: 'rgba(255,255,255,0.05)',
                        padding: '0.25rem',
                        fontWeight: 'bold',
                        pointerEvents: 'none',
                        zIndex: 9999,
                    }}
                >
                    [Type 404]
                </div>

                <h1 style={{textAlign: 'center', marginBottom: '2rem'}}>
                    Black like the Night, White like the day - Bleed child, Smile king - Weep thrice but feel twice
                </h1>

                {/* QR Codes Side-by-Side */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '2rem',
                        flexWrap: 'wrap',
                    }}
                >
                    {/* Image 1 */}
                    <figure style={{
                        width: '500px',
                        height: '500px',
                        textAlign: 'center',
                        backgroundColor: '#111',
                        padding: '1rem',
                        border: '2px solid #444',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <img
                            src="/black-and-white/qr.png"
                            alt="QR Code"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                userSelect: 'none',
                            }}
                            draggable={false}
                        />
                        <figcaption style={{marginTop: '0.5rem'}}>QR code</figcaption>
                    </figure>

                    {/* Image 2 */}
                    <figure style={{
                        width: '500px',
                        height: '500px',
                        textAlign: 'center',
                        backgroundColor: '#fff',
                        padding: '1rem',
                        border: '2px solid #ccc',
                        boxShadow: '0 0 10px rgba(0,0,0,0.4)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <img
                            src="/black-and-white/qr-doppelganger.png"
                            alt="QR Code Doppelganger"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                userSelect: 'none',
                            }}
                            draggable={false}
                        />
                        <figcaption style={{marginTop: '0.5rem', fontSize: '0.9rem'}}>QR?</figcaption>
                    </figure>
                </div>

                {message && (
                    <div
                        style={{
                            marginTop: '2rem',
                            color: 'red',
                            textAlign: 'center',
                            fontWeight: 'bold',
                        }}
                    >
                        {message}
                    </div>
                )}

                <p
                    style={{
                        position: 'fixed',
                        bottom: '1rem',
                        right: '1rem',
                        fontSize: '0.8rem',
                        color: '#555',
                        userSelect: 'none',
                    }}
                >
                    Type the correct keyword when the condition is right.
                </p>
            </div>
        </>
    );
}