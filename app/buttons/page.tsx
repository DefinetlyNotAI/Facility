'use client';

import {useEffect, useRef, useState} from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import {useRouter} from 'next/navigation';
import {signCookie} from "@/lib/cookies";
import styles from '../../styles/Buttons.module.css';
import {BACKGROUND_AUDIO, playSafeSFX, SFX_AUDIO, useBackgroundAudio} from "@/lib/audio";
import {BROWSERS, SUBTITLE_TEXT, WINGDING} from '@/lib/data/buttons';
import {BrowserName} from "@/lib/types/all";


// Detect browser reliably (basic)
function getBrowserName(): BrowserName | null {
    const ua = navigator.userAgent;
    if (/Chrome/.test(ua) && !/Edge/.test(ua) && !/OPR/.test(ua)) return 'Chrome';
    if (/Firefox/.test(ua)) return 'Firefox';
    if (/Safari/.test(ua) && !/Chrome/.test(ua)) return 'Safari';
    if (/Edge/.test(ua)) return 'Edge';
    if (/OPR/.test(ua)) return 'Opera';
    return null;
}

function HiddenFooter() {
    useEffect(() => {
        if (Cookies.get('File_Unlocked')) {
        }
    }, []);

    async function handleUnlock() {
        await signCookie('File_Unlocked=true');
    }

    return (
        <footer
            className={styles.SECRET}
            onClick={handleUnlock}
        >
            <a
                href="/file-console"
                onClick={async (e) => {
                    e.stopPropagation();
                    await signCookie('File_Unlocked=true');
                }}
            >
                Go to File Console
            </a>
        </footer>
    );
}

export default function ButtonsPage() {
    const router = useRouter();
    const audioRef = useRef<HTMLAudioElement>(null);

    const [buttonStates, setButtonStates] = useState<Record<BrowserName, boolean>>({
        Chrome: false,
        Firefox: false,
        Safari: false,
        Edge: false,
        Opera: false,
    });

    const [userBrowser, setUserBrowser] = useState<BrowserName | null>(null);

    const allPressed = Object.values(buttonStates).every(Boolean);
    const pressedCount = Object.values(buttonStates).filter(Boolean).length;

    // Initialize background audio
    useBackgroundAudio(audioRef, BACKGROUND_AUDIO.BUTTONS)

    useEffect(() => {
        axios.get('/api/csrf-token').catch(() => {
        });
    }, []);

    useEffect(() => {
        const unlocked = Cookies.get('Button_Unlocked');
        if (!unlocked) {
            router.replace('/404');
        }
    }, [router]);

    useEffect(() => {
        const detected = getBrowserName();
        setUserBrowser(detected);

        axios
            .get('/api/state')
            .then(async (res) => {
                const newStates: Record<BrowserName, boolean> = {
                    Chrome: false,
                    Firefox: false,
                    Safari: false,
                    Edge: false,
                    Opera: false,
                };
                for (const entry of res.data) {
                    if (BROWSERS.includes(entry.browser)) {
                        newStates[entry.browser as BrowserName] = entry.clicked;
                    }
                }
                setButtonStates(newStates);

                if (Object.values(newStates).every(Boolean)) {
                    await signCookie('File_Unlocked=true');
                }
            })
            .catch(() => {
            });
    }, []);

    async function pressButton(browser: BrowserName) {
        if (!userBrowser || userBrowser !== browser) return;
        if (buttonStates[browser]) return;

        try {
            const csrfToken = Cookies.get('csrf-token');
            await axios.post(
                '/api/press',
                {browser},
                {headers: {'X-CSRF-Token': csrfToken ?? ''}}
            );

            // Play success sound
            playSafeSFX(audioRef, SFX_AUDIO.SUCCESS, false);

            const updatedStates = {...buttonStates, [browser]: true};
            setButtonStates(updatedStates);

            if (Object.values(updatedStates).every(Boolean)) {
                await signCookie('File_Unlocked=true');

                // Play completion sound
                playSafeSFX(audioRef, SFX_AUDIO.SUCCESS, false);
            }
        } catch {
            // Play error sound
            playSafeSFX(audioRef, SFX_AUDIO.ERROR, false);
            alert('This button has already been pressed or there was an error.');
        }
    }

    return (
        <>
            <audio
                ref={audioRef}
                src={BACKGROUND_AUDIO.BUTTONS}
                loop
                preload="auto"
                style={{display: 'none'}}
            />
            <div className={styles.container}>
                <h1 className={styles.title}>Global Browser Buttons</h1>

                <p className={styles.subtitle}>
                    {SUBTITLE_TEXT.split('\n').map((line, idx) => (
                        <span key={idx}>
                            {line}
                            {idx < SUBTITLE_TEXT.split('\n').length - 1 && <br/>}
                        </span>
                    ))}
                </p>

                {/* Progress Indicator */}
                <div className={styles.progressIndicator}>
                    <div>Progress: {pressedCount}/5</div>
                    <div className={styles.progressBar}>
                        <div
                            className={styles.progressFill}
                            style={{width: `${(pressedCount / 5) * 100}%`}}
                        />
                    </div>
                </div>

                <div className={styles.buttonGrid}>
                    {BROWSERS.map((browser) => {
                        const isDisabled = browser !== userBrowser || buttonStates[browser];
                        const isPressed = buttonStates[browser];

                        return (
                            <button
                                key={browser}
                                onClick={() => pressButton(browser)}
                                disabled={isDisabled}
                                className={`${styles.browserButton} ${isPressed ? styles.pressed : ''}`}
                                title={
                                    isDisabled
                                        ? browser !== userBrowser
                                            ? `This button is for ${browser} browser only`
                                            : 'Button already pressed'
                                        : `Press to activate ${browser} button`
                                }
                            >
                                <div>{browser}<br/></div>
                                {isPressed && (
                                    <div style={{fontSize: '0.8rem', marginTop: '0.2rem'}}>✓</div>
                                )}
                            </button>
                        );
                    })}
                </div>

                {allPressed && (
                    <>
                        <div className={styles.secretMessage}>
                            {WINGDING}
                            <div style={{
                                fontSize: '1rem',
                                marginTop: '1rem',
                                fontStyle: 'italic',
                                color: '#666',
                                fontFamily: 'JetBrains Mono, monospace'
                            }}>
                            </div>
                        </div>
                        <HiddenFooter/>
                    </>
                )}
            </div>
        </>
    );
}