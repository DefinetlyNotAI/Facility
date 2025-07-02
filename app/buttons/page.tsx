'use client';

import {useEffect, useRef, useState} from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import {useRouter} from 'next/navigation';
import {signCookie} from "@/lib/cookie-utils";
import {BACKGROUND_AUDIO, SFX_AUDIO, initializeBackgroundAudio, cleanupAudio, playAudio} from "@/lib/audio-config";
import styles from '../../styles/Buttons.module.css';

const BROWSERS = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera'] as const;
type BrowserName = typeof BROWSERS[number];

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
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (Cookies.get('File_Unlocked')) {
            setVisible(true);
        }
    }, []);

    async function handleUnlock() {
        await signCookie('File_Unlocked=true');
        setVisible(true);
    }

    return (
        <footer
            className={`${styles.hiddenFooter} ${visible ? styles.visible : ''}`}
            onClick={handleUnlock}
        >
            <a
                href="/file-console"
                onClick={async (e) => {
                    e.stopPropagation();
                    await signCookie('File_Unlocked=true');
                }}
            >
                /file-console
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
    useEffect(() => {
        const initAudio = initializeBackgroundAudio(audioRef, BACKGROUND_AUDIO.BUTTONS);
        initAudio();
        return () => cleanupAudio(audioRef);
    }, []);

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

            playAudio(SFX_AUDIO.SUCCESS);

            const updatedStates = {...buttonStates, [browser]: true};
            setButtonStates(updatedStates);

            if (Object.values(updatedStates).every(Boolean)) {
                await signCookie('File_Unlocked=true');
                playAudio(SFX_AUDIO.SUCCESS, { volume: 0.8 });
            }
        } catch {
            playAudio(SFX_AUDIO.ERROR);
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
                    Click the button matching your browser to activate it globally.<br/>
                    Collaboration required - each browser can only be pressed once.
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
                                {browser}
                                {isPressed && <div style={{fontSize: '0.8rem', marginTop: '0.5rem'}}>✓ ACTIVATED</div>}
                            </button>
                        );
                    })}
                </div>

                {allPressed && (
                    <>
                        <div className={styles.secretMessage}>
                            👍︎♒︎♏︎♍︎🙵 ⧫︎♒︎♏︎ 👍︎💧︎💧︎ ⬧︎♏︎♍︎❒︎♏︎⧫︎
                            <div style={{
                                fontSize: '1rem',
                                marginTop: '1rem',
                                fontStyle: 'italic',
                                color: '#666',
                                fontFamily: 'JetBrains Mono, monospace'
                            }}>
                                Remove css tag from hidden-footer.visible to find the next link
                            </div>
                        </div>
                        <HiddenFooter/>
                    </>
                )}
            </div>
        </>
    );
}