"use client"

import React, {useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import CryptoJS from 'crypto-js';
import Cookies from "js-cookie";
import {signCookie} from "@/lib/cookies";
import styles from '../../styles/WifiLogin.module.css';
import {BACKGROUND_AUDIO, SFX_AUDIO, useBackgroundAudio} from "@/lib/audio";

const CurlHintPopup: React.FC<{ onDismiss: () => void }> = ({onDismiss}) => {
    useEffect(() => {
        const timer = setTimeout(onDismiss, 6000);
        return () => clearTimeout(timer);
    }, [onDismiss]);

    return (
        <div className={styles.container}>
            <div className={styles.loginForm}>
                <div className={styles.title} style={{fontSize: '1.8rem', marginBottom: '2rem'}}>
                    ACCESS GRANTED
                </div>
                <div style={{fontSize: '1.2rem', whiteSpace: 'pre-line', textAlign: 'center', lineHeight: '1.6'}}>
                    {'BUT SOMETHING\nSTILL WATCHES...\n\n54 52 59 20 41 4E 44 20 50 52 45 46 49 58 20 2F 61 70 69 2F 20 41 4E 44 20 46 4F 4C 4C 4F 57 20 54 48 45 20 50 52 45 56 49 4F 55 53 20 54 49 50 2E'}
                </div>
                <div className={styles.loading} style={{marginTop: '2rem'}}>
                    Redirecting...
                </div>
            </div>
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
        <div className={styles.container} style={{
            filter: 'contrast(1.5) brightness(0.7)',
            background: 'black'
        }}>
            <div className={styles.loginForm} style={{
                border: '2px solid #ff0000',
                boxShadow: '0 0 30px rgba(255, 0, 0, 0.5)'
            }}>
                <div style={{
                    fontSize: '2rem',
                    whiteSpace: 'pre-line',
                    minHeight: '4rem',
                    color: '#ff0000',
                    textShadow: '0 0 15px #ff0000'
                }}>
                    {step > 0 ? messages.slice(0, step).join('\n\n') : ''}
                    <span style={{animation: 'blink 0.5s infinite'}}>
                        {step < messages.length ? '|' : ''}
                    </span>
                </div>
            </div>
        </div>
    );
};

const WifiLoginPage: React.FC = () => {
    const router = useRouter();
    const [showCutscene, setShowCutscene] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showCurlHint, setShowCurlHint] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    useBackgroundAudio(audioRef, BACKGROUND_AUDIO.WIFI_LOGIN);


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

        const sha256 = (str: string) => CryptoJS.SHA256(str).toString();
        const correctHashUser = '6c5a39f1f7e832645fae99669dc949ea848b7dec62d60d914a3e8b3e3c78a756';
        const inputHashUser = sha256(username.trim().toLowerCase());

        if (inputHashUser !== correctHashUser) {
            // Play error sound
            try {
                const errorAudio = new Audio(SFX_AUDIO.ERROR);
                errorAudio.volume = 0.6;
                errorAudio.play().catch(console.warn);
            } catch (error) {
                console.warn('Failed to play error audio:', error);
            }

            setError('Invalid username.');
            return;
        }

        const correctHashPass = 'e6d7a4c1389cffecac2b41b4645a305dcc137e81';
        const inputHashPass = sha1(password.trim().toLowerCase());

        if (inputHashPass !== correctHashPass) {
            // Play error sound
            try {
                const errorAudio = new Audio(SFX_AUDIO.ERROR);
                errorAudio.volume = 0.6;
                errorAudio.play().catch(console.warn);
            } catch (error) {
                console.warn('Failed to play error audio:', error);
            }

            setError(`Invalid password. Your hash: ${inputHashPass}`);
            return;
        }

        // Play success sound
        try {
            const successAudio = new Audio(SFX_AUDIO.SUCCESS);
            successAudio.volume = 0.6;
            successAudio.play().catch(console.warn);
        } catch (error) {
            console.warn('Failed to play success audio:', error);
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
            <audio
                ref={audioRef}
                src={BACKGROUND_AUDIO.WIFI_LOGIN}
                loop
                preload="auto"
                style={{display: 'none'}}
            />
            <span
                dangerouslySetInnerHTML={{
                    __html: `<!--
            If you ever forgot your name: https://youtu.be/zZzx9qt1Q9s
            Hash of the sha1 pass is e6d7a4c1389cffecac2b41b4645a305dcc137e81
            -->`
                }}
                style={{display: 'none'}}
            />
            <div className={styles.container}>
                <h1 className={styles.title}>Wifi Login</h1>
                <form onSubmit={handleSubmit} className={styles.loginForm}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Username:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            className={styles.input}
                            placeholder="Enter username"
                            autoComplete="off"
                            spellCheck={false}
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => {
                                if (/^[a-z]{0,6}$/.test(e.target.value)) {
                                    setPassword(e.target.value);
                                }
                            }}
                            className={styles.input}
                            placeholder="Enter password (max 6 chars)"
                            minLength={1}
                            maxLength={6}
                            autoComplete="off"
                            spellCheck={false}
                            required
                        />
                    </div>
                    <button type="submit" className={styles.submitButton} disabled={loading}>
                        {loading ? 'Authenticating...' : 'Login'}
                    </button>
                    {error && <div className={styles.error}>{error}</div>}
                    {loading && <div className={styles.loading}>Establishing secure connection...</div>}
                </form>
            </div>
        </>
    );
};

export default WifiLoginPage;