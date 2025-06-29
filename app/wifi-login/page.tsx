"use client"

import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import CryptoJS from 'crypto-js';
import Cookies from "js-cookie"; // SHA1 hashing
import {signCookie} from "@/lib/cookie-utils";

const CurlHintPopup: React.FC<{ onDismiss: () => void }> = ({onDismiss}) => {
    useEffect(() => {
        const timer = setTimeout(onDismiss, 6000);
        return () => clearTimeout(timer);
    }, [onDismiss]);
    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.85)', color: '#0f0', fontFamily: 'monospace',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 10000, flexDirection: 'column', padding: '2rem', textAlign: 'center'
        }}>
            <div style={{fontSize: '1.4rem', whiteSpace: 'pre-line'}}>
                {'ACCESS GRANTED.\n\nBUT SOMETHING\nSTILL WATCHES...\n\n54 52 59 20 41 4E 44 20 50 52 45 46 49 58 20 2F 61 70 69 2F 20 41 4E 44 20 46 4F 4C 4C 4F 57 20 54 48 45 20 50 52 45 56 49 4F 55 53 20 54 49 50 2E'}
            </div>
            <TypingCursor active={true}/>
        </div>
    );
};

const InterferenceCutscene: React.FC<{ onFinish: () => void }> = ({onFinish}) => {
    const [step, setStep] = useState(0);
    const messages = [
        'V3$$3L.. W@TCH.. M3.. GR0W',
        'TH1$ TR33 H@$ JU$T F@LL3N',
        'PR@1$3 B3',
        ':)',
    ];

    useEffect(() => {
        if (step < messages.length) {
            const timer = setTimeout(() => setStep(step + 1), 3500);
            return () => clearTimeout(timer);
        } else {
            onFinish();
        }
    }, [step, onFinish]);

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'black', color: '#00FF00', fontFamily: 'monospace',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            flexDirection: 'column', userSelect: 'none', zIndex: 9999,
            filter: 'contrast(1.5) brightness(0.7)',
            overflow: 'hidden',
        }}>
            <div style={{fontSize: '2rem', whiteSpace: 'pre-line', minHeight: '4rem'}}>
                {step > 0 ? messages.slice(0, step).join('\n\n') : ''}
                <TypingCursor active={step < messages.length}/>
            </div>
        </div>
    );
};

const TypingCursor: React.FC<{ active: boolean }> = ({active}) => {
    const [visible, setVisible] = useState(true);
    useEffect(() => {
        if (!active) return;
        const interval = setInterval(() => setVisible(v => !v), 500);
        return () => clearInterval(interval);
    }, [active]);
    return <span>{visible ? '|' : ' '}</span>;
};

const WifiLoginPage: React.FC = () => {
    const router = useRouter();
    const [showCutscene, setShowCutscene] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showCurlHint, setShowCurlHint] = useState(false);

    useEffect(() => {
        const wifiUnlocked = Cookies.get('Wifi_Unlocked');
        if (!wifiUnlocked) {
            router.replace('/404');
            return;
        }

        const wifiPassed = Cookies.get('wifi_passed');
        if (wifiPassed) {
            setShowCurlHint(true);
            return;
        }

        if (!Cookies.get('Interference_cutscene_seen')) {
            setShowCutscene(true);
        }
    }, [router]);

    const sha1 = (str: string) => CryptoJS.SHA1(str).toString();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (username.trim().toLowerCase() !== 'itgrowshere') {
            setError('Invalid username.');
            return;
        }

        const correctHash = 'e6d7a4c1389cffecac2b41b4645a305dcc137e81'; // 'trees'
        const inputHash = sha1(password.trim().toLowerCase());

        if (inputHash !== correctHash) {
            setError(`Invalid password. Your hash: ${inputHash}`);
            return;
        }

        setLoading(true);
        setTimeout(async () => {
            await signCookie('wifi_passed=true');
            setShowCurlHint(true);
        }, 1000);
    };

    if (showCutscene) {
        return (
            <InterferenceCutscene onFinish={async () => {
                await signCookie('Interference_cutscene_seen=true');
                setShowCutscene(false);
            }}/>
        );
    }

    if (showCurlHint) {
        return <CurlHintPopup onDismiss={() => router.replace('/wifi-panel')}/>;
    }

    return (
        <>
            <span
                dangerouslySetInnerHTML={{
                    __html: `<!--
            If you ever forgot your name: https://youtu.be/zZzx9qt1Q9s
            Hash of the sha1 e6d7a4c1389cffecac2b41b4645a305dcc137e81
            -->`
                }}
                style={{display: 'none'}}
            />
            <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                height: '100vh', backgroundColor: '#111', color: '#0f0', fontFamily: 'monospace',
            }}>
                <h1>Wifi Login</h1>
                <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', width: '280px'}}>
                    <label>
                        Username:
                        <input
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            autoComplete="off"
                            spellCheck={false}
                            required
                        />
                    </label>
                    <label>
                        Password:
                        <input
                            type="password"
                            value={password}
                            onChange={e => {
                                if (/^[a-z]{0,6}$/.test(e.target.value)) {
                                    setPassword(e.target.value);
                                }
                            }}
                            minLength={1}
                            maxLength={6}
                            autoComplete="off"
                            spellCheck={false}
                            required
                        />
                    </label>
                    <button type="submit" style={{marginTop: '1rem', cursor: 'pointer'}}>
                        Login
                    </button>
                    {error && <p style={{color: 'red', marginTop: '0.5rem'}}>{error}</p>}
                    {loading && <p style={{color: '#0f0', marginTop: '0.5rem'}}>Logging in...</p>}
                </form>
            </div>
        </>
    );
};

export default WifiLoginPage;
