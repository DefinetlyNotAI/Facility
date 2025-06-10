'use client';

import {useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import Cookies from 'js-cookie';

function getRandomFilename(length = 8) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export default function ScrollPage() {
    const router = useRouter();
    const [scrollUnlocked, setScrollUnlocked] = useState<boolean | null>(null);
    const [contentHeight, setContentHeight] = useState(2000); // grows as you scroll
    const [showEscape, setShowEscape] = useState(false);
    const [escapeHovered, setEscapeHovered] = useState(false);
    const [ipAddress, setIpAddress] = useState('...loading...');
    const faviconRef = useRef<HTMLLinkElement | null>(null);

    useEffect(() => {
        const unlocked = Cookies.get('Scroll unlocked');
        if (!unlocked) {
            router.replace('/404');
            return;
        }
        setScrollUnlocked(true);

        faviconRef.current = document.querySelector("link[rel~='icon']");
        if (!faviconRef.current) {
            const link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
            faviconRef.current = link;
        }

        fetch('https://api.ipify.org?format=json')
            .then(res => res.json())
            .then(data => setIpAddress(data.ip || 'Unknown IP'))
            .catch(() => setIpAddress('Unknown IP'));
    }, [router]);

    useEffect(() => {
        if (!scrollUnlocked) return;

        const scrollHandler = () => {
            const scrollTop = window.scrollY;
            const windowHeight = window.innerHeight;
            const bodyHeight = document.body.scrollHeight;

            // Extend page height if near bottom
            if (scrollTop + windowHeight >= bodyHeight - 500) {
                setContentHeight(prev => prev + 1500);
            }

            if (faviconRef.current && Math.random() < 0.1) {
                const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'cyan', 'white'];
                const color = colors[Math.floor(Math.random() * colors.length)];
                const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="${color}" />
        </svg>`;
                faviconRef.current.href = `data:image/svg+xml;base64,${btoa(svg)}`;
            }
        };

        window.addEventListener('scroll', scrollHandler);
        return () => window.removeEventListener('scroll', scrollHandler);
    }, [scrollUnlocked]);

    useEffect(() => {
        if (!scrollUnlocked) return;

        const errorLog = setInterval(() => {
            const errors = [
                'Error: Something went terribly wrong.',
                'Warning: Data breach detected!',
                'Uncaught ReferenceError: mysteryFunction is not defined',
                'TypeError: Cannot read properties of null (reading "click")',
                'Unexpected end of input in JSON',
            ];
            if (Math.random() < 0.3) {
                console.error(errors[Math.floor(Math.random() * errors.length)]);
            }
        }, 5000);

        return () => clearInterval(errorLog);
    }, [scrollUnlocked]);

    useEffect(() => {
        if (!scrollUnlocked) return;

        const triggerFileDownload = () => {
            const blob = new Blob(['PLEASE STOP'], {type: 'text/plain'});
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = getRandomFilename() + '.txt';
            document.body.appendChild(a);
            a.click();
            a.remove();
        };

        const downloadInterval = setInterval(() => {
            if (Math.random() < 0.4) {
                triggerFileDownload();
            }
        }, 20000);

        return () => clearInterval(downloadInterval);
    }, [scrollUnlocked]);

    useEffect(() => {
        if (!scrollUnlocked) return;

        const ttsTimeout = setTimeout(() => {
            const utterance = new SpeechSynthesisUtterance(
                'Do you feel your legs go numb yet? This is all you now. Your IP. Your identity. Your scrolling. It’s mine now.'
            );
            utterance.lang = 'en-US';
            window.speechSynthesis.speak(utterance);
            utterance.onend = () => setShowEscape(true);
        }, 5000);

        return () => {
            clearTimeout(ttsTimeout);
            window.speechSynthesis.cancel();
        };
    }, [scrollUnlocked]);

    if (scrollUnlocked === null) return null;

    return (
        <div className="scroll-container">
            <div
                className="scroll-glitch"
                style={{
                    minHeight: `${contentHeight}px`,
                    transition: 'filter 3s ease-in-out',
                    filter: `brightness(0.4) contrast(1.2)`,
                }}
            >
                <h1 style={{color: 'white', textAlign: 'center', paddingTop: '3rem'}}>
                    Keep scrolling, and smile
                </h1>

                {showEscape && (
                    <div style={{textAlign: 'center', marginTop: '50vh'}}>
                        <button
                            style={{
                                fontSize: '1.5rem',
                                fontFamily: 'Courier New, monospace',
                                padding: '1rem 2rem',
                                backgroundColor: 'black',
                                color: 'white',
                                border: '2px solid white',
                                cursor: 'default',
                            }}
                            onMouseEnter={() => setEscapeHovered(true)}
                            onMouseLeave={() => setEscapeHovered(false)}
                            onClick={() => {
                                Cookies.set('BnW unlocked', 'true');
                                router.push('/black-and-white');
                            }}
                        >
                            {escapeHovered ? ipAddress : 'ESCAPE'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
