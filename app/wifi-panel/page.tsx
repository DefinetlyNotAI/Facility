'use client';

import {useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import Cookies from 'js-cookie';
import styles from '../../styles/WifiPanel.module.css';
import {signCookie} from "@/lib/cookie-utils";

const KEYWORD_1 = 'Whispers';

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
    useEffect(() => {
        const initializeAudio = () => {
            if (audioRef.current) {
                audioRef.current.volume = 0.4;
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

        initializeAudio();

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        };
    }, []);

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
        const q = btoa('PROVE YOU ARE NOT A ROBOT: What is 3, 15 and 25 summed up?');
        setQuestion(q);
        setMode('receive');
    };

    const handleUnlockSend = () => {
        if (password.trim().toLowerCase() === KEYWORD_1.trim().toLowerCase()) {
            setSendUnlocked(true);
            setMode('send');
            setErrorMsg(null);
        } else {
            setErrorMsg('46 6F 6F 6C');
        }
    };

    const handleSendAnswer = () => {
        if (userAnswer.trim() === '43') {
            setErrorMsg('Transmission error: Encryption module failed — Caesar cipher your message for us.');
            setMode('caesar');
        } else {
            setErrorMsg('49 64 69 6F 74');
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
        if (decoded === '76') {
            setFadeOut(true);
            setTimeout(async () => {
                await signCookie('Media_Unlocked=true');
                router.push('/media');
            }, 650);
        } else {
            setErrorMsg('42 6F 74 68 20 61 20 66 6F 6F 6C 20 61 6E 64 20 61 6E 20 69 64 69 6F 74');
        }
    };

    return (
        <>
            <audio
                ref={audioRef}
                src="/sfx/music/thethirdcry.mp3"
                loop
                preload="auto"
                style={{display: 'none'}}
            />
            <div className={`${styles.container} ${fadeOut ? styles.fadeOut : ''}`}>
                <h1 className={styles.title}>Wi‑Fi Panel</h1>

                <div className={styles.buttonContainer}>
                    <button
                        onClick={handleReceive}
                        disabled={mode !== 'locked'}
                        className={styles.actionButton}
                    >
                        Receive
                    </button>
                    <button
                        onClick={() => password ? handleUnlockSend() : null}
                        disabled={!password}
                        className={styles.actionButton}
                    >
                        Send
                    </button>
                </div>

                {mode === 'receive' && (
                    <div className={styles.contentBox}>
                        <h2>Incoming Transmission</h2>
                        <p><em>Answer:</em></p>
                        <div className={styles.codeBlock}>
                            {question}
                        </div>
                        <div className={styles.hint}>
                            {/* Algorithm: Base64 decode this string */}
                            The answer lies beneath the veil.
                        </div>
                        <label className={styles.inputLabel} htmlFor="wifi-code-input">
                            To unlock networking functionality,<br/>
                            Enter Keyword[1] Access Code first.
                        </label>
                        <input
                            id="wifi-code-input"
                            type="text"
                            placeholder="Enter the secret phrase"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.input}
                        />
                    </div>
                )}

                {mode === 'send' && sendUnlocked && (
                    <div className={styles.contentBox}>
                        <h2>Transmit Your Solution</h2>
                        <p>Access granted. Input the sum, if you dare:</p>
                        <label className={styles.inputLabel} htmlFor="wifi-answer-input">
                            Response
                        </label>
                        <input
                            id="wifi-answer-input"
                            type="text"
                            placeholder="Numerical value"
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            className={styles.input}
                        />
                        <button onClick={handleSendAnswer} className={styles.submitButton}>
                            Submit
                        </button>
                    </div>
                )}

                {mode === 'caesar' && (
                    <div className={styles.contentBox}>
                        <h2>Encryption Protocol</h2>
                        <p>Signal scrambled. Apply Caesar shift (-3) to your answer and try again:</p>
                        <label className={styles.inputLabel} htmlFor="wifi-caesar-input">
                            Ciphertext
                        </label>
                        <input
                            id="wifi-caesar-input"
                            type="text"
                            placeholder="Caesar-shifted answer"
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            className={styles.input}
                        />
                        <button onClick={handleCaesarSubmit} className={styles.submitButton}>
                            Finalize
                        </button>
                    </div>
                )}

                {errorMsg && <div className={styles.error}>{errorMsg}</div>}
            </div>
        </>
    );
}