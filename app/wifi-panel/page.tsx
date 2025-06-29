'use client';

import {useEffect, useState} from 'react';
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
            await signCookie('Media_Unlocked=true');
            router.push('/media');
        } else {
            setErrorMsg('42 6F 74 68 20 61 20 66 6F 6F 6C 20 61 6E 64 20 61 6E 20 69 64 69 6F 74');
        }
    };

    return (
        <div className={styles.container}>
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
                    <p><em>I ASK THEE:</em></p>
                    <div className={styles.codeBlock}>
                        {question}
                    </div>
                    <div className={styles.hint}>
                        {/* Algorithm: Base64 decode this string */}
                        Decode the transmission to reveal the challenge
                    </div>
                    <input
                        type="text"
                        placeholder="Provide keyword[1] to access Send function"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={styles.input}
                    />
                </div>
            )}

            {mode === 'send' && sendUnlocked && (
                <div className={styles.contentBox}>
                    <h2>Send Response</h2>
                    <p>Password accepted. Submit your answer to the decoded challenge:</p>
                    <input
                        type="text"
                        placeholder="Your numerical answer"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        className={styles.input}
                    />
                    <button onClick={handleSendAnswer} className={styles.submitButton}>
                        Submit Answer
                    </button>
                </div>
            )}

            {mode === 'caesar' && (
                <div className={styles.contentBox}>
                    <h2>Encryption Required</h2>
                    <p>Transmission error detected. Apply Caesar cipher (shift -3) to your answer:</p>
                    <input
                        type="text"
                        placeholder="Caesar-shifted answer"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        className={styles.input}
                    />
                    <button onClick={handleCaesarSubmit} className={styles.submitButton}>
                        Finalize Transmission
                    </button>
                </div>
            )}

            {errorMsg && <div className={styles.error}>{errorMsg}</div>}
        </div>
    );
}