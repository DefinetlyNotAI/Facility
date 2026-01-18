'use client';

import {useEffect, useRef, useState} from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import {useRouter} from 'next/navigation';
import styles from '@/styles/Buttons.module.css';
import {BACKGROUND_AUDIO, playSafeSFX, SFX_AUDIO, usePlayBackgroundAudio} from "@/audio";
import {buttons} from '@/lib/client/data/buttons';
import {BrowserName} from "@/types";
import {cookies, routes} from "@/lib/saveData";
import {signCookie} from "@/lib/client/utils";


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
    usePlayBackgroundAudio(audioRef, BACKGROUND_AUDIO.BUTTONS)

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

                // Helper: normalize incoming browser names to the canonical BrowserName
                function normalizeBrowserName(raw: any): BrowserName | null {
                    if (typeof raw !== 'string') return null;
                    const s = raw.trim().toLowerCase();
                    if (s === 'chrome') return 'Chrome';
                    if (s === 'firefox') return 'Firefox';
                    if (s === 'safari') return 'Safari';
                    if (s === 'edge') return 'Edge';
                    // Some APIs send 'opr' or 'opera'
                    if (s === 'opr' || s === 'opera') return 'Opera';
                    return null;
                }

                for (const entry of res.data) {
                    const name = normalizeBrowserName(entry.browser);
                    if (name && buttons.browsers.includes(name)) {
                        // coerce clicked to a boolean (handles "true"/"false" strings, etc.)
                        newStates[name] = Boolean(entry.clicked);
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
                <h1 className={styles.title}>{buttons.title}</h1>

                <p className={styles.subtitle}>
                    {buttons.subtitleText.split('\n').map((line, idx) => (
                        <span key={idx}>
                            {line}
                            {idx < buttons.subtitleText.split('\n').length - 1 && <br/>}
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
                    {buttons.browsers.map((browser) => {
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
                                            ? buttons.tooltip.onlyThisBrowser(browser)
                                            : buttons.tooltip.alreadyPressed
                                        : buttons.tooltip.clickToPress(browser)
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
                            {buttons.wingding}
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
