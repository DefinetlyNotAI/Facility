'use client';

import {useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import Cookies from 'js-cookie';

const KEYWORD_5 = 'Echoes';

export default function BlackAndWhitePage() {
    const router = useRouter();
    const [bnwUnlocked, setBnwUnlocked] = useState<boolean | null>(null);
    const inputBufferRef = useRef('');
    const topLeftBufferRef = useRef('');
    const [message, setMessage] = useState<string | null>(null);

    // On mount: check cookie, else redirect 404
    useEffect(() => {
        const unlocked = Cookies.get('BnW unlocked');
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

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key.length === 1) {
                inputBufferRef.current += e.key.toLowerCase();
                if (inputBufferRef.current.length > maxLength) {
                    inputBufferRef.current = inputBufferRef.current.slice(-maxLength);
                }

                if (inputBufferRef.current.endsWith(KEYWORD_5.toLowerCase())) {
                    if (window.innerWidth === 666 && window.innerHeight === 666) {
                        Cookies.set('Choice Unlocked', 'true');
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

    if (bnwUnlocked === null) {
        return null;
    }

    return (
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
            {/* Barely visible top-left corner 404 */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    fontSize: '10px',
                    color: 'rgba(255,255,255,0.05)',
                    padding: '0.25rem',
                    fontWeight: 'bold',
                    userSelect: 'none',
                    pointerEvents: 'none',
                    zIndex: 9999,
                    fontFamily: 'Courier New, monospace',
                }}
            >
                [404]
            </div>

            <h1 style={{textAlign: 'center', marginBottom: '2rem'}}>
                The Black and White Page
            </h1>

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '4rem',
                    flexWrap: 'wrap',
                }}
            >
                {/* Image 1 QR code */}
                <figure style={{maxWidth: '300px', textAlign: 'center'}}>
                    <img
                        src="/black-and-white/qr.png"
                        alt="QR Code"
                        style={{width: '100%', height: 'auto', userSelect: 'none'}}
                        draggable={false}
                    />
                    <figcaption style={{marginTop: '0.5rem'}}>QR code</figcaption>
                </figure>

                {/* Image 2 QR code */}
                <figure style={{maxWidth: '300px', textAlign: 'center'}}>
                    <img
                        src="/black-and-white/qr-doppelganger.png"
                        alt="QR Code Doppelganger"
                        style={{width: '100%', height: 'auto', userSelect: 'none'}}
                        draggable={false}
                    />
                    <figcaption style={{marginTop: '0.5rem'}}>QR?</figcaption>
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
                    fontFamily: 'Courier New, monospace',
                }}
            >
                Type the correct keyword in the console to continue...
            </p>
        </div>
    );
}
