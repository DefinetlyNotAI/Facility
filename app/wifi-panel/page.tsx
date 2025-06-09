'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import Cookies from 'js-cookie';
import styles from '../../styles/extra.module.css';
import {signCookie} from "@/lib/cookie-utils";

const KEYWORD_1 = 'Whispers';  // From your flow

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
        // Encoded phrase example: Base64 of "What is 3+15+25?"
        const q = btoa('What is 3+15+25?');
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
            <h1>Wi‑Fi Panel</h1>
            <div className={styles.buttons}>
                <button onClick={handleReceive} disabled={mode !== 'locked'}>
                    Receive
                </button>
                <button
                    onClick={() => password ? handleUnlockSend() : null}
                    disabled={!password}
                >
                    Send
                </button>
            </div>

            {mode === 'receive' && (
                <div className={styles.box}>
                    <p><em>I ASK THEE </em> <code>{question}</code></p>
                    <p className={styles.hint} /* <== hint inside HTML comments in real code */>
                        {/* Algorithm: Base64 decode this string */}
                    </p>
                    <input
                        type="text"
                        placeholder="Provide the keyword[1]"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
            )}

            {mode === 'send' && sendUnlocked && (
                <div className={styles.box}>
                    <p>Password accepted. Submit thee answer:</p>
                    <input
                        type="text"
                        placeholder="Your answer"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                    />
                    <button onClick={handleSendAnswer}>Submit Answer</button>
                </div>
            )}

            {mode === 'caesar' && (
                <div className={styles.box}>
                    <p>Submit thee answer:</p>
                    <input
                        type="text"
                        placeholder="Caesar-shifted answer"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                    />
                    <button onClick={handleCaesarSubmit}>Finalize</button>
                </div>
            )}

            {errorMsg && <p className={styles.error}>{errorMsg}</p>}
        </div>
    );
}
