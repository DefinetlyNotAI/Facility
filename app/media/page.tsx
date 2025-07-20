'use client';

import {useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import Cookies from 'js-cookie';
import {signCookie} from "@/lib/cookies";
import styles from '../../styles/extra.module.css';
import {BACKGROUND_AUDIO, SFX_AUDIO, useBackgroundAudio} from "@/lib/audio";
import {checkKeyword} from "@/lib/utils";
import {err, getStatusText, text} from "@/lib/data/media";

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
    useBackgroundAudio(audioRef, BACKGROUND_AUDIO.MEDIA);


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

    const checkKey = async () => {
        const result = await checkKeyword(inputKey.trim().toLowerCase(), 2);
        if (result) {
            // Play success sound
            try {
                const successAudio = new Audio(SFX_AUDIO.SUCCESS);
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
                const errorAudio = new Audio(SFX_AUDIO.ERROR);
                errorAudio.volume = 0.6;
                errorAudio.play().catch(console.warn);
            } catch (error) {
                console.warn('Failed to play error audio:', error);
            }
            setMsg(err.incorrectKeyword);
        }
    };

    return (
        <div className={styles.container}>
            <h1>{text.title}</h1>
            {!accessGranted ? (
                <div className={styles.access}>
                    <p>{text.entryMsg}</p>
                    <input
                        type="text"
                        value={inputKey}
                        onChange={e => setInputKey(e.target.value)}
                    />
                    <button onClick={checkKey}>{text.unlockButton}</button>
                    {msg && <p className={styles.error}>{msg}</p>}
                </div>
            ) : (
                <div className={styles.content}>
                    <div className={styles.item}>
                        <label>{text.itemTitle1}</label>
                        <audio controls onPlay={() => setPlayed(true)}>
                            <source src="/static/media/morse.wav" type="audio/wav"/>
                            {err.unsupportedAudioBrowser}
                        </audio>
                    </div>

                    <div className={styles.item}>
                        <label>{text.itemTitle2}</label>
                        <a
                            href="/static/media/Password_Is_Keyword%5B3%5D.zip"
                            download
                            onClick={() => setDl1(true)}
                        >
                            Download Protected File ZIP 1
                        </a>
                    </div>

                    <div className={styles.item}>
                        <label>{text.itemTitle3}</label>
                        <a
                            href="/static/media/Password_Is_Keyword%5B4%5D.zip"
                            download
                            onClick={() => setDl2(true)}
                        >
                            Download Protected File ZIP 2
                        </a>
                    </div>

                    <p>{getStatusText(played, dl1, dl2)}</p>
                </div>
            )}
        </div>
    );
}