'use client';

import {useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import Cookies from 'js-cookie';
import styles from '../../styles/WifiPanel.module.css';
import {signCookie} from "@/lib/cookies";
import {BACKGROUND_AUDIO, SFX_AUDIO, useBackgroundAudio} from "@/lib/audio";
import {checkKeyword} from "@/lib/utils";
import {messages, wifiPanel} from "@/lib/data/wifi";


export default function WifiPanel() {
    const router = useRouter();
    const [mode, setMode] = useState<'loading' | 'locked' | 'receive' | 'send' | 'caesar'>('locked');
    const [question, setQuestion] = useState<string>('');
    const [password, setPassword] = useState('');
    const [userAnswer, setUserAnswer] = useState('');
    const [sendUnlocked, setSendUnlocked] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [fadeOut, setFadeOut] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    // Initialize background audio
    useBackgroundAudio(audioRef, BACKGROUND_AUDIO.WIFI_PANEL);

    // 404 and redirect logic
    useEffect(() => {
        if (!Cookies.get('Wifi_Unlocked')) {
            router.replace('/404');
            return;
        }

        const checkWifiPassed = async () => {
            if (!Cookies.get('wifi_passed')) {
                await signCookie('wifi_login=true');
                router.replace('/wifi-login');
                return;
            }
            setMode('locked');
        };

        checkWifiPassed().catch(error => {
            console.error('Error caught:', error);
        });
    }, [router]);

    // Generate the encoded question
    const handleReceive = () => {
        // Play interaction sound
        try {
            const interactionAudio = new Audio(SFX_AUDIO.SUCCESS);
            interactionAudio.volume = 0.5;
            interactionAudio.play().catch(console.warn);
        } catch (error) {
            console.warn('Failed to play interaction audio:', error);
        }

        const q = btoa(messages.question);
        setQuestion(q);
        setMode('receive');
    };

    const handleUnlockSend = async () => {
        const result = await checkKeyword(password.trim().toLowerCase(), 1);
        if (result) {
            // Play success sound
            try {
                const successAudio = new Audio(SFX_AUDIO.SUCCESS);
                successAudio.volume = 0.6;
                successAudio.play().catch(console.warn);
            } catch (error) {
                console.warn('Failed to play success audio:', error);
            }

            setSendUnlocked(true);
            setMode('send');
            setErrorMsg(null);
        } else {
            // Play error sound
            try {
                const errorAudio = new Audio(SFX_AUDIO.ERROR);
                errorAudio.volume = 0.6;
                errorAudio.play().catch(console.warn);
            } catch (error) {
                console.warn('Failed to play error audio:', error);
            }

            setErrorMsg(messages.err.failedUnlock);
        }
    };

    const handleSendAnswer = () => {
        if (userAnswer.trim() === messages.answer.normal) {
            // Play alert sound for transmission error
            try {
                const alertAudio = new Audio(SFX_AUDIO.ALERT);
                alertAudio.volume = 0.6;
                alertAudio.play().catch(console.warn);
            } catch (error) {
                console.warn('Failed to play alert audio:', error);
            }

            setErrorMsg(messages.err.intentionalTransmission);
            setMode('caesar');
        } else {
            // Play error sound
            try {
                const errorAudio = new Audio(SFX_AUDIO.ERROR);
                errorAudio.volume = 0.6;
                errorAudio.play().catch(console.warn);
            } catch (error) {
                console.warn('Failed to play error audio:', error);
            }

            setErrorMsg(messages.err.incorrectPass);
        }
    };

    const handleCaesarSubmit = async () => {
        const decoded = userAnswer
            .split('')
            .map((ch) => {
                if (/[a-z]/i.test(ch)) {
                    const code = ch.charCodeAt(0);
                    const base = code >= 97 ? 97 : 65;
                    return String.fromCharCode(((code - base - 3 + 26) % 26) + base);
                }
                return ch;
            })
            .join('');
        if (decoded === messages.answer.ceaser) {
            // Play success sound
            try {
                const successAudio = new Audio(SFX_AUDIO.SUCCESS);
                successAudio.volume = 0.6;
                successAudio.play().catch(console.warn);
            } catch (error) {
                console.warn('Failed to play success audio:', error);
            }

            setFadeOut(true);
            setTimeout(async () => {
                try {
                    await signCookie('Media_Unlocked=true');
                    router.push('/media');
                } catch (e) {
                    console.error('signCookie failed:', e);
                }
            }, 650);

        } else {
            // Play error sound
            try {
                const errorAudio = new Audio(SFX_AUDIO.ERROR);
                errorAudio.volume = 0.6;
                errorAudio.play().catch(console.warn);
            } catch (error) {
                console.warn('Failed to play error audio:', error);
            }

            setErrorMsg(messages.err.incorrectCeaserPass);
        }
    };

    return (
        <>
            <audio
                ref={audioRef}
                src={BACKGROUND_AUDIO.WIFI_PANEL}
                loop
                preload="auto"
                style={{display: 'none'}}/>

            <div className={`${styles.container} ${fadeOut ? styles.fadeOut : ''}`}>
                <h1 className={styles.title}>{wifiPanel.title}</h1>
                <div className={styles.buttonContainer}>
                    <button
                        onClick={handleReceive}
                        disabled={mode !== 'locked'}
                        className={styles.actionButton}
                    >
                        {wifiPanel.receiveButton}
                    </button>

                    <button
                        onClick={async () => {
                            if (mode === 'locked' || mode === 'receive') {
                                await handleUnlockSend();
                            } else if (mode === 'send') {
                                handleSendAnswer();
                            } else if (mode === 'caesar') {
                                await handleCaesarSubmit();
                            }
                        }}
                        disabled={
                            (mode === 'locked' && !password) ||
                            (mode === 'receive' && !password) ||  // add this line
                            (mode === 'send' && !userAnswer) ||
                            (mode === 'caesar' && !userAnswer)
                        }
                        className={styles.actionButton}
                    >
                        {wifiPanel.sendButton}
                    </button>


                    {errorMsg && (
                        <div
                            key={errorMsg}
                            className={styles.error}
                            onAnimationEnd={() => setErrorMsg('')}
                        >
                            {errorMsg}
                        </div>
                    )}
                </div>
                {mode === 'receive' && (
                    <div className={styles.contentBox}>
                        <h2>{wifiPanel.transmissionPanel.title}</h2>
                        <p><em>{wifiPanel.transmissionPanel.netForm.request}</em></p>
                        <input
                            id="wifi-code-input"
                            type="text"
                            placeholder={wifiPanel.transmissionPanel.netForm.placeholder}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.input}/>
                    </div>
                )}

                {mode === 'send' && sendUnlocked && (
                    <div className={styles.contentBox}>
                        <h2>{wifiPanel.transmissionPanel.mainTitle}</h2>
                        <p><em>{wifiPanel.transmissionPanel.title}</em></p>
                        <div className={styles.codeBlock}>{question}</div>
                        <div className={styles.hint}>{wifiPanel.transmissionPanel.hint}</div>
                        <label className={styles.inputLabel} htmlFor="wifi-answer-input">
                            {wifiPanel.transmissionPanel.ansForm.request}
                        </label>
                        <input
                            id="wifi-answer-input"
                            type="text"
                            placeholder={wifiPanel.transmissionPanel.ansForm.placeholder}
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            className={styles.input}/>
                    </div>
                )}

                {mode === 'caesar' && (
                    <div className={styles.contentBox}>
                        <h2>{wifiPanel.caesarPanel.title}</h2>
                        <p>{wifiPanel.caesarPanel.description}</p>
                        <input
                            id="wifi-caesar-input"
                            type="text"
                            placeholder={wifiPanel.caesarPanel.placeholder}
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            className={styles.input}/>
                    </div>
                )}
            </div>
        </>
    );
}