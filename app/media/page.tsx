'use client';

import {useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import Cookies from 'js-cookie';
import {signCookie} from "@/lib/cookie-utils";
import {BACKGROUND_AUDIO, SFX_AUDIO, MEDIA_AUDIO, initializeBackgroundAudio, cleanupAudio, playAudio} from "@/lib/audio-config";
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
        const initAudio = initializeBackgroundAudio(audioRef, BACKGROUND_AUDIO.MEDIA);
        initAudio();
        return () => cleanupAudio(audioRef);
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
        if (inputKey.trim().toLowerCase() === KEYWORD_2.toLowerCase()) {
            playAudio(SFX_AUDIO.SUCCESS);
            setAccessGranted(true);
            setMsg('');
        } else {
            playAudio(SFX_AUDIO.ERROR);
            setMsg('Incorrect keyword.');
        }
    };

    return (
        <>
            <audio
                ref={audioRef}
                src={BACKGROUND_AUDIO.MEDIA}
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
                            <audio controls onPlay={() => setPlayed(true)}>
                                <source src={MEDIA_AUDIO.MORSE_CODE} type="audio/wav"/>
                                Your browser does not support audio playback.
                            </audio>
                        </div>

                        <div className={styles.item}>
                            <label>File 1 [4] - First letter is caps!:</label>
                            <a
                                href="/media/Password_Is_Keyword%5B3%5D.zip"
                                download
                                onClick={() => setDl1(true)}
                            >
                                Download ZIP 1
                            </a>
                        </div>

                        <div className={styles.item}>
                            <label>File 2 [To go next] - First letter is caps!:</label>
                            <a
                                href="/media/Password_Is_Keyword%5B4%5D.zip"
                                download
                                onClick={() => setDl2(true)}
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