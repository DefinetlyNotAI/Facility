'use client';

import {useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';
import {signCookie} from "@/lib/cookie-utils";
import styles from '../../styles/extra.module.css';

const KEYWORD_2 = 'Fletchling';

export default function MediaPage() {
    const router = useRouter();
    const [accessGranted, setAccessGranted] = useState(false);
    const [inputKey, setInputKey] = useState('');
    const [msg, setMsg] = useState('');
    const [played, setPlayed] = useState(false);
    const [dl1, setDl1] = useState(false);
    const [dl2, setDl2] = useState(false);
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

        initializeAudio();

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        };
    }, []);

    useEffect(() => {
        if (!Cookies.get('Media_Unlocked')) {
            router.replace('/404');
        }
    }, [router]);

    useEffect(() => {
        if (played && dl1 && dl2) {
            const unlockButton = async () => {
                await signCookie('Button_Unlocked=true');
            };
            unlockButton().catch(error => {
                console.error('Error caught:', error);
            });
        }
    }, [played, dl1, dl2]);

    const checkKey = () => {
        if (inputKey.trim() === KEYWORD_2) {
            // Play success sound
            try {
                const successAudio = new Audio('/sfx/all/computeryay.mp3');
                successAudio.volume = 0.6;
                successAudio.play().catch(console.warn);
            } catch (error) {
                console.warn('Failed to play success audio:', error);
            }

            setAccessGranted(true);
            setMsg('');
        } else {
            // Play error sound
            try {
                const errorAudio = new Audio('/sfx/all/computerboo.mp3');
                errorAudio.volume = 0.6;
                errorAudio.play().catch(console.warn);
            } catch (error) {
                console.warn('Failed to play error audio:', error);
            }

            setMsg('Incorrect keyword.');
        }
    };

    const handleDownload = (filename: string, isFirst: boolean) => {
        // Play download sound
        try {
            const downloadAudio = new Audio('/sfx/all/computeryay.mp3');
            downloadAudio.volume = 0.5;
            downloadAudio.play().catch(console.warn);
        } catch (error) {
            console.warn('Failed to play download audio:', error);
        }

        if (isFirst) {
            setDl1(true);
        } else {
            setDl2(true);
        }
    };

    const handleAudioPlay = () => {
        // Play interaction sound
        try {
            const interactionAudio = new Audio('/sfx/all/computeryay.mp3');
            interactionAudio.volume = 0.5;
            interactionAudio.play().catch(console.warn);
        } catch (error) {
            console.warn('Failed to play interaction audio:', error);
        }

        setPlayed(true);
    };

    return (
        <>
            <audio
                ref={audioRef}
                src="/sfx/music/doangelsexist.mp3"
                loop
                preload="auto"
                style={{display: 'none'}}
            />
            <div className={styles.container}>
                <h1>🔐 Media Repository</h1>
                {!accessGranted ? (
                    <div className={styles.access}>
                        <p>Enter access keyword[2]:</p>
                        <input
                            type="text"
                            value={inputKey}
                            onChange={e => setInputKey(e.target.value)}
                        />
                        <button onClick={checkKey}>Unlock</button>
                        {msg && <p className={styles.error}>{msg}</p>}
                    </div>
                ) : (
                    <div className={styles.content}>
                        <div className={styles.item}>
                            <label>Audio File [3]:</label>
                            <audio controls onPlay={handleAudioPlay}>
                                <source src="/media/morse.wav" type="audio/wav"/>
                                Your browser does not support audio playback.
                            </audio>
                        </div>

                        <div className={styles.item}>
                            <label>File 1 [4] - First letter is caps!:</label>
                            <a
                                href="/media/Password_Is_Keyword%5B3%5D.zip"
                                download
                                onClick={() => handleDownload('Password_Is_Keyword%5B3%5D.zip', true)}
                            >
                                Download ZIP 1
                            </a>
                        </div>

                        <div className={styles.item}>
                            <label>File 2 [To go next] - First letter is caps!:</label>
                            <a
                                href="/media/Password_Is_Keyword%5B4%5D.zip"
                                download
                                onClick={() => handleDownload('Password_Is_Keyword%5B4%5D.zip', false)}
                            >
                                Download ZIP 2
                            </a>
                        </div>

                        <p>
                            Current status: Audio – {played ? '✅' : '❌'}, Zip1 – {dl1 ? '✅' : '❌'},
                            Zip2 – {dl2 ? '✅' : '❌'}
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}