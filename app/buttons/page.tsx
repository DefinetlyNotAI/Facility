'use client';

import {useEffect, useState} from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import {useRouter} from 'next/navigation';

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
        if (Cookies.get('File Unlocked')) {
            setVisible(true);
        }
    }, []);

    function handleUnlock() {
        Cookies.set('File Unlocked', 'true', {expires: 7});
        setVisible(true);
    }

    return (
        <>
            <footer
                id="hidden-footer"
                style={{
                    position: 'fixed',
                    bottom: 0,
                    width: '100%',
                    padding: '1rem',
                    backgroundColor: 'black',
                    color: 'white',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontFamily: 'monospace',
                    fontSize: '1.2rem',
                    cursor: 'pointer',
                    opacity: 0,
                    pointerEvents: 'none',
                    userSelect: 'none',
                    transition: 'opacity 0.5s ease',
                }}
                onClick={handleUnlock}
                className={visible ? 'visible' : ''}
            >
                <a
                    href="/file-console"
                    style={{
                        color: 'white',
                        textDecoration: 'underline',
                        userSelect: 'text',
                        pointerEvents: visible ? 'auto' : 'none',
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        Cookies.set('File Unlocked', 'true', {expires: 7});
                    }}
                >
                    /file-console
                </a>
            </footer>

            <style jsx>{`
                @keyframes blink {
                    0%,
                    50% {
                        opacity: 1;
                    }
                    50.01%,
                    100% {
                        opacity: 0;
                    }
                }

                #hidden-footer.visible {
                    opacity: 1 !important;
                    pointer-events: auto !important;
                    user-select: text !important;
                    animation: blink 1s step-start infinite;
                }
            `}</style>
        </>
    );
}

export default function ButtonsPage() {
    const router = useRouter();

    const [buttonStates, setButtonStates] = useState<Record<BrowserName, boolean>>({
        Chrome: false,
        Firefox: false,
        Safari: false,
        Edge: false,
        Opera: false,
    });

    const [userBrowser, setUserBrowser] = useState<BrowserName | null>(null);

    const allPressed = Object.values(buttonStates).every(Boolean);

    useEffect(() => {
        axios.get('/api/csrf-token').catch(() => {
        });
    }, []);

    useEffect(() => {
        const unlocked = Cookies.get('Button Unlocked');
        if (!unlocked) {
            router.replace('/404');
        }
    }, [router]);

    useEffect(() => {
        const detected = getBrowserName();
        setUserBrowser(detected);

        axios
            .get('/api/state')
            .then((res) => {
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
                    Cookies.set('File Unlocked', 'true');
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

            const updatedStates = {...buttonStates, [browser]: true};
            setButtonStates(updatedStates);

            if (Object.values(updatedStates).every(Boolean)) {
                Cookies.set('File Unlocked', 'true');
            }
        } catch {
            alert('This button has already been pressed or there was an error.');
        }
    }

    return (
        <div
            style={{
                fontFamily: allPressed ? 'Wingdings, monospace' : 'sans-serif',
                padding: '2rem',
            }}
        >
            <h1>Global Browser Buttons</h1>
            <p>Click the button matching your browser to activate it globally.</p>

            <div>
                {BROWSERS.map((b) => {
                    const isDisabled = b !== userBrowser || buttonStates[b];
                    return (
                        <button
                            key={b}
                            onClick={() => pressButton(b)}
                            disabled={isDisabled}
                            title={
                                isDisabled
                                    ? b !== userBrowser
                                        ? `This button is for ${b} browser only`
                                        : 'Button already pressed'
                                    : `Press to activate ${b} button`
                            }
                            style={{
                                margin: '0.5rem',
                                padding: '0.7rem 1.2rem',
                                fontWeight: buttonStates[b] ? 'bold' : 'normal',
                                backgroundColor: buttonStates[b] ? '#888' : '#0cf',
                                cursor: isDisabled ? 'not-allowed' : 'pointer',
                                borderRadius: 4,
                                border: 'none',
                                color: 'white',
                                userSelect: 'none',
                                transition: 'background-color 0.3s',
                            }}
                        >
                            {b}
                        </button>
                    );
                })}
            </div>

            {allPressed && (
                <>
                    <div className="secret-message" aria-live="polite" role="alert">
                        👍︎♒︎♏︎♍︎🙵 ⧫︎♒︎♏︎ 👍︎💧︎💧︎ ⬧︎♏︎♍︎❒︎♏︎⧫︎
                    </div>

                    <style jsx>{`
                        .secret-message {
                            font-size: 1.5rem;
                            margin-top: 2rem;
                            user-select: none;
                            color: #400;
                            letter-spacing: 0.05em;
                        }

                        .secret::after {
                            content: 'Remove css tag from hidden-footer.visible to find the next link';
                            display: block;
                            margin-top: 1rem;
                            font-style: italic;
                            color: #666;
                        }
                    `}</style>
                    {/* Include hidden footer here */}
                    <HiddenFooter/>
                </>
            )}
        </div>
    );
}
