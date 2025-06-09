/*
URL[Media] -> FOR HERE If not cookie[Media Unlocked] then 404
  Will ask for KEYWORD[2] to access the page,
  Will have 1 audio in site and 2 download buttons:
  - Audio: Has morse code that gives KEYWORD[3]
  - Download1: ZIP file that is pass protected with KEYWORD[3], has a txt file with invis ascii which is keyword[4]
  - Download2: Another ZIP file that is pass protected with KEYWORD[4], has a audio file with reversed audio that says to "Use your eyes for what you hear" where a QR is embedded in the audio that gives URL[Buttons]
  If all 3 items were interacted with, then create cookie[Button Unlocked]

  The files are in public/media - they are morse.wav, Password_Is_Keyword[3].zip, Password_Is_Keyword[4].zip
*/

'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import Cookies from 'js-cookie';
import styles from '../../styles/extra.module.css';
import {signCookie} from "@/lib/cookie-utils";

const KEYWORD_2 = 'Fletchling';

export default function MediaPage() {
    const router = useRouter();
    const [accessGranted, setAccessGranted] = useState(false);
    const [inputKey, setInputKey] = useState('');
    const [msg, setMsg] = useState('');
    const [played, setPlayed] = useState(false);
    const [dl1, setDl1] = useState(false);
    const [dl2, setDl2] = useState(false);

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
            setAccessGranted(true);
            setMsg('');
        } else {
            setMsg('Incorrect keyword.');
        }
    };

    return (
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
                    <p className={styles.error}>{msg}</p>
                </div>
            ) : (
                <div className={styles.content}>
                    <div className={styles.item}>
                        <label>Morse Audio (play to reveal keyword):</label>
                        <audio controls onPlay={() => setPlayed(true)}>
                            <source src="/media/morse.wav" type="audio/wav"/>
                            Your browser does not support audio playback.
                        </audio>
                    </div>

                    <div className={styles.item}>
                        <label>Download File 1:</label>
                        <a
                            href="/media/Password_Is_Keyword%5B3%5D.zip"
                            download
                            onClick={() => setDl1(true)}
                        >
                            Download ZIP 1
                        </a>
                    </div>

                    <div className={styles.item}>
                        <label>Download File 2:</label>
                        <a
                            href="/media/Password_Is_Keyword%5B4%5D.zip"
                            download
                            onClick={() => setDl2(true)}
                        >
                            Download ZIP 2
                        </a>
                    </div>

                    <p>
                        Current status: played audio – {played ? '✅' : '❌'}, downloaded #1 – {dl1 ? '✅' : '❌'},
                        downloaded #2 – {dl2 ? '✅' : '❌'}
                    </p>
                </div>
            )}
        </div>
    );
}
