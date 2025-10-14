'use client';

import {useEffect, useRef, useState} from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import {useRouter} from 'next/navigation';
import styles from '../../styles/Buttons.module.css';
import {BACKGROUND_AUDIO, playSafeSFX, SFX_AUDIO, useBackgroundAudio} from "@/lib/data/audio";
import {BROWSERS, SUBTITLE_TEXT, TITLE, TOOLTIP, WINGDING} from '@/lib/data/buttons';
import {BrowserName} from "@/lib/types/buttons";
import {cookies, routes} from "@/lib/saveData";
import {signCookie} from "@/lib/utils";


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
    async function handleUnlock() {
        await signCookie(`${cookies.fileConsole}=true`);
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
                    await signCookie(`${cookies.fileConsole}=true`);
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
        axios.get(routes.api.security.csrfToken).catch(() => {
        });
    }, []);

    useEffect(() => {
        const unlocked = Cookies.get(cookies.buttons);
        if (!unlocked) {
            router.replace(routes.notFound);
        }
    }, [router]);

    useEffect(() => {
        const detected = getBrowserName();
        setUserBrowser(detected);

        axios
            .get(routes.api.browser.getBrowserState)
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
                    await signCookie(`${cookies.fileConsole}=true`);
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
                routes.api.browser.flipBrowserState,
                {browser},
                {headers: {'X-CSRF-Token': csrfToken ?? ''}}
            );

            // Play success sound
            playSafeSFX(audioRef, SFX_AUDIO.SUCCESS, false);

            const updatedStates = {...buttonStates, [browser]: true};
            setButtonStates(updatedStates);

            if (Object.values(updatedStates).every(Boolean)) {
                await signCookie(`${cookies.fileConsole}=true`);

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
                <h1 className={styles.title}>{TITLE}</h1>

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
                                            ? TOOLTIP.ONLY_THIS_BROWSER(browser)
                                            : TOOLTIP.ALREADY_PRESSED
                                        : TOOLTIP.CLICK_TO_PRESS(browser)
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