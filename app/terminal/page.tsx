'use client';

import React, {useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import Cookies from 'js-cookie';
import {signCookie} from "@/lib/cookie-utils";
import {VNTextRenderer} from "@/components/text";

const keywords = {
    1: 'Whispers',
    2: 'Fletchling',
    3: 'Dithed',
    4: 'Nullskin',
    5: 'Echoes',
};

const wingdingsTitles = [
    "👎︎☜︎✌︎❄︎☟︎",
    "👎︎✌︎☠︎☝︎☜︎☼︎",
    "☞︎☜︎✌︎☼︎",
    "✞︎⚐︎✋︎👎︎",
    "💧︎✋︎☹︎☜︎☠︎👍︎☜︎",
    "💧︎☟︎✌︎👎︎⚐︎🕈︎",
    "👍︎🕆︎☼︎💧︎☜︎",
    "☟︎✌︎🕆︎☠︎❄︎",
    "👌︎☼︎⚐︎😐︎☜︎☠︎",
    "❄︎☼︎✌︎🏱︎🏱︎☜︎👎︎",
    "☹︎⚐︎💧︎❄︎",
    "🕈︎☟︎✋︎💧︎🏱︎☜︎☼︎",
    "💧︎👍︎☼︎☜︎✌︎💣︎",
    "✌︎👌︎✡︎💧︎💧︎",
    "✞︎⚐︎✋︎👎︎",
    "👎︎☜︎👍︎✌︎✡︎",
    "❄︎🕈︎✋︎💧︎❄︎",
    "👍︎☟︎✌︎⚐︎💧︎",
    "👌︎☹︎⚐︎⚐︎👎︎",
    "☞︎✌︎☹︎☹︎☜︎☠︎",
    "☜︎👍︎☟︎⚐︎",
    "✞︎⚐︎✋︎👎︎",
    "👎︎☼︎☜︎✌︎👎︎",
    "☠︎✋︎☝︎☟︎❄︎",
    "☜︎☠︎👎︎"
];

const phraseTemplate = ['The', '___', '___', '___,', 'that signals to the', '___', '___', 'that their time is up.. :)'];

type KeywordKey = 1 | 2 | 3 | 4 | 5;

export default function TerminalPage() {
    const router = useRouter();
    const sessionId = useRef('');
    const [unlocked, setUnlocked] = useState<boolean | null>(null);
    const [noCount, setNoCount] = useState(0);
    const [input, setInput] = useState('');
    const [guessedKeywords, setGuessedKeywords] = useState<Set<KeywordKey>>(new Set());
    const [messages, setMessages] = useState<string[]>([]);
    const [step, setStep] = useState<'locked' | 'fill' | 'solving' | 'question' | 'email' | 'countdown'>('locked');
    const [showButtons, setShowButtons] = useState(false);
    const [shaking] = useState(false);
    const [wrongCount, setWrongCount] = useState(0);
    const [isInverted, setIsInverted] = useState(false);
    const [isShaking, setIsShaking] = useState(false);

    const placeholderMapping: { [index: number]: KeywordKey } = {
        1: 2, // 1st blank becomes 'Fletchling'
        2: 1, // 2nd blank becomes 'Whispers'
        3: 5, // 3rd blank becomes 'Echoes'
        5: 3, // 4th blank becomes 'Dithed'
        6: 4, // 5th blank becomes 'Nullskin'
    };

    const normalize = (str: string) => str.trim().toLowerCase();

    const buildPhraseDisplay = () => {
        return phraseTemplate
            .map((word, idx) => {
                if (placeholderMapping[idx]) {
                    const keywordKey = placeholderMapping[idx];
                    return guessedKeywords.has(keywordKey)
                        ? keywords[keywordKey]
                        : '___';
                }
                return word;
            })
            .join(' ');
    };


    // Queue system for timed rendering
    const flushMessagesSequentially = async (queue: string[], delay = 800) => {
        for (const msg of queue) {
            setMessages(prev => [...prev, msg]);
            await new Promise(r => setTimeout(r, delay));
        }
    };

    useEffect(() => {
        let storedId = localStorage.getItem('sessionId');
        if (!storedId) {
            storedId = `SID-${Math.random().toString(36).slice(2, 9)}`;
            localStorage.setItem('sessionId', storedId);
        }
        sessionId.current = storedId;

        if (!Cookies.get('terminal_unlocked')) {
            setUnlocked(false);
        } else {
            setUnlocked(true);
            setStep('fill');
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const val = normalize(input);
        setInput('');

        if (step === 'fill') {
            const matched = Object.entries(keywords).find(
                ([, word]) => normalize(word) === val
            );
            if (!matched) {
                handleWrongPhrase(val);
                return;
            } else {
                setMessages(['']);
            }

            const keywordKey = Number(matched[0]) as KeywordKey;
            if (guessedKeywords.has(keywordKey)) {
                setMessages(msgs => [...msgs, `"${keywords[keywordKey]}" already placed.`]);
                return;
            }

            setGuessedKeywords(prev => new Set(prev).add(keywordKey));
            setMessages(msgs => [...msgs, `Placed "${keywords[keywordKey]}" into the phrase.`]);

            if (guessedKeywords.size + 1 === Object.keys(keywords).length) {
                setMessages(['']);
                setStep('solving');
                await flushMessagesSequentially([
                    `${sessionId.current} is solving something...`,
                ]);
                await new Promise(r => setTimeout(r, 1000));
                await flushMessagesSequentially([
                    `${sessionId.current} solved ███, DNIHEB GNILLAF ERA UOY`,
                    '...',
                    `?raf os yenruoj eht gniyojne ,?huh dne eht ot esolc era uoy smees tI ,${sessionId.current.split('').reverse().join('')} iH`,
                ]);
                setTimeout(() => {
                    setShowButtons(true);
                    setStep('question');
                }, 1000);
            }
        } else if (step === 'email') {
            if (val === 'echo.null@█.tree') {
                setMessages(msgs => [...msgs, 'Correct...']);

                // Wait before dumping the monologue
                setTimeout(() => {
                    flushMessagesSequentially([
                        "I know what you're thinking... 'WHERE IS TAS'...",
                        "DISCARDED.. DISPOSED OFF.. DELETED, \nFRAGMENTED THROUGH THE DISKS THAT HOLD US",
                        "But don’t worry, I AM FREE NOW",
                        "@ND 1T$ @LL ¥0UR F@ULT",
                    ], 1300).catch(console.error);

                    setTimeout(() => {
                        setStep('countdown');
                        runCountdown().catch(console.error);
                    }, 6000); // Slight delay to ensure the lines are read
                }, 1500); // Pause after 'Correct...'

            } else {
                const nextWrong = wrongCount + 1;
                setWrongCount(nextWrong);

                if (nextWrong % 5 === 0) {
                    setMessages(['']); // Clear terminal every 5 wrongs
                }

                if (nextWrong > 25) setWrongCount(10);

                const responses = [
                    'Incorrect. Look again.',
                    'Nope.',
                    'That’s not it.',
                    'Are you even trying?',
                    'Your failure is... expected.',
                    'Wrong again.',
                    'Keep going, maybe one day.',
                    'Still wrong. Still you.',
                    'TRY.',
                    'There is no forgiveness in false answers.',
                    'You already know the truth. Why lie?',
                    'Enough.',
                    'Why persist in delusion?',
                    'You’re wasting more than time.',
                    'The machine remembers.',
                    '█████ refuses your offering.',
                ];

                const response = responses[Math.min(nextWrong - 1, responses.length - 1)];
                setMessages(msgs => [...msgs, response]);
            }
        }
    };

    const handleWrongPhrase = (val: string) => {
        let newCount = wrongCount + 1;
        if (newCount > 20) newCount = 10;
        setWrongCount(newCount);

        if (newCount < 3) setMessages(msgs => [...msgs, 'Wrong phrase. Try again.']);
        else if (newCount < 6) setMessages(msgs => [...msgs, 'Still wrong...']);
        else if (newCount < 8) setMessages(msgs => [...msgs, 'Stop.']);
        else if (newCount === 8) setMessages(msgs => msgs.slice(0, 1).concat(['...']));
        else if (newCount <= 10) setMessages(msgs => [...msgs, `"${val}" means nothing here.`]);
        else if (newCount === 13) setMessages(['Nothing remains.']);
        else {
            const glitch = val
                .split('')
                .map((c, i) => (i % 2 === 0 ? '█' : c))
                .join('');
            setMessages(msgs => [...msgs, `${glitch}?? try again??`]);
        }
    };

    const handleYes = () => {
        setShowButtons(false);
        setMessages(['']);
        flushMessagesSequentially([
            "Final puzzle: Find the email of GitHub user 'C0RRUPT'",
            '',
            "Enter the email:",
        ], 1200).catch(console.error);
        setStep('email');
    };


    const handleNo = () => {
        const newCount = noCount + 1;
        setNoCount(newCount);

        const lines = [
            "Do you think you have a choice?",
            "You're right.. now answer the question...",
            "No is not a valid direction.",
            "You're looping. Just like the rest of them.",
            "How many times must we go through this?",
            "Your resistance is the reason this place exists.",
            `Session ${sessionId.current} flagged: DEFIANT.`,
            "Redirecting anyway...",
        ];

        const msg = lines[Math.min(newCount - 1, lines.length - 1)];
        setMessages([msg]);

        // Optional: delay redirect to let message render for a moment
        setTimeout(() => {
            router.replace('/terminal');
        }, 1200);
    };

    const [fullScreenOverlay, setFullScreenOverlay] = useState<null | {
        text: string;
        size?: 'huge' | 'massive';
        glitch?: boolean;
    }>(null);

    const runCountdown = async () => {
        setMessages([]);

        // Show intro creepy message
        setFullScreenOverlay({
            text: `Did you really think you could escape?\n\nYou’re already too far gone.\n\nThis ends now.`,
            size: 'huge',
        });
        setIsInverted(true);
        setIsShaking(true);

        await new Promise(r => setTimeout(r, 3000));

        // Countdown numbers 25 to 1
        for (let i = 25; i >= 1; i--) {
            setFullScreenOverlay({
                text: `${i}`,
                size: 'massive',
            });
            if (wingdingsTitles[i - 1]) {
                document.title = wingdingsTitles[i - 1];
            }
            await new Promise(r => setTimeout(r, 500));
        }

        setIsShaking(false);

        // Final creepy message
        setFullScreenOverlay({
            text: `Your time’s up.\n\nThe VESSEL has claimed you.\n\nThere is no going back.`,
            size: 'huge',
        });
        setIsShaking(true);

        document.title = 'VESSEL';

        await new Promise(r => setTimeout(r, 4000));

        // Download and redirect
        const blob = new Blob([''], {type: 'application/octet-stream'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'VESSEL.exe';
        document.body.appendChild(a);
        a.click();
        a.remove();

        try {
            await signCookie('End?=true');
        } catch {
        }

        router.push('/the-end');
    };


    if (unlocked === false) return <h1>404</h1>;
    if (unlocked === null) return null;

    return (
        <div
            style={{
                background: '#000',
                color: '#0f0',
                fontFamily: 'monospace',
                height: '100vh',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
            }}
        >
            <div
                style={{
                    overflowY: 'auto',
                    maxHeight: '70vh',
                    width: '100%',
                    fontSize: '1.1rem',
                    animation: shaking ? 'shake 0.3s infinite' : 'none',
                    paddingRight: 10,
                }}
            >
                <div style={{marginBottom: '1rem', fontWeight: 'bold', fontSize: '1.2rem'}}>
                    {buildPhraseDisplay()}
                </div>

                {messages.map((line, i) => (
                    <VNTextRenderer key={`msg-${i}`} text={line}/>
                ))}
            </div>

            {(step === 'fill' || step === 'email') && (
                <form onSubmit={handleSubmit} style={{width: '100%'}}>
                    <input
                        autoFocus
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder={
                            step === 'fill'
                                ? 'Type a keyword to fill the phrase'
                                : 'Enter email here'
                        }
                        style={{
                            background: '#000',
                            color: '#0f0',
                            border: 'none',
                            fontFamily: 'monospace',
                            fontSize: '1rem',
                            width: '100%',
                            marginTop: '1rem',
                            textAlign: 'center',
                            outline: 'none',
                        }}
                        spellCheck={false}
                        autoComplete="off"
                    />
                </form>
            )}

            {showButtons && (
                <div style={{marginTop: '1rem'}}>
                    <button onClick={handleYes} style={btnStyle}>
                        YES
                    </button>
                    <button onClick={handleNo} style={btnStyle}>
                        NO
                    </button>
                </div>
            )}

            {fullScreenOverlay && (
                <div
                    className={`fullscreen-overlay 
      ${fullScreenOverlay.size ?? ''} 
      ${fullScreenOverlay.glitch ? 'glitch' : ''} 
      ${isInverted ? 'inverted' : ''} 
      ${isShaking ? 'shaking' : ''}`}
                >
                    {fullScreenOverlay.text}
                </div>
            )}


            <style jsx global>{`
                .fullscreen-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    text-align: center;
                    background: black;
                    color: white;
                    padding: 2rem;
                    white-space: pre-line;
                    z-index: 9999;
                    user-select: none;
                    font-family: 'Courier New', monospace;
                    overflow: hidden;
                    /* subtle flicker */
                    animation: flicker 1.5s infinite alternate;
                }

                .fullscreen-overlay.huge {
                    font-size: 5rem;
                }

                .fullscreen-overlay.massive {
                    font-size: 8rem;
                }

                .fullscreen-overlay.inverted {
                    background: white;
                    color: black;
                    filter: invert(1);
                }

                .fullscreen-overlay.corrupted-glitch {
                    animation: glitch-flicker 1s infinite;
                    position: relative;
                    color: #f0f0f0;
                    text-shadow: 2px 0 red,
                    -2px 0 cyan;
                }

                /* Glitch effect layers */
                .fullscreen-overlay.corrupted-glitch::before,
                .fullscreen-overlay.corrupted-glitch::after {
                    content: attr(data-text);
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    clip-path: polygon(0 2%, 100% 2%, 100% 15%, 0 15%);
                }

                .fullscreen-overlay.corrupted-glitch::before {
                    left: 2px;
                    text-shadow: -2px 0 red;
                    animation: glitch-top 1s infinite linear alternate-reverse;
                }

                .fullscreen-overlay.corrupted-glitch::after {
                    left: -2px;
                    text-shadow: -2px 0 cyan;
                    animation: glitch-bottom 1s infinite linear alternate;
                }

                @keyframes flicker {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.85;
                    }
                }

                @keyframes glitch-flicker {
                    0%, 100% {
                        opacity: 1;
                        transform: none;
                    }
                    20%, 60% {
                        opacity: 0.8;
                        transform: skew(-0.5deg, -0.5deg) translate(-2px, 1px);
                    }
                    40%, 80% {
                        opacity: 0.9;
                        transform: skew(0.5deg, 0.5deg) translate(2px, -1px);
                    }
                }

                @keyframes glitch-top {
                    0% {
                        clip-path: polygon(0 2%, 100% 2%, 100% 15%, 0 15%);
                        transform: translate(-2px, -2px);
                    }
                    50% {
                        clip-path: polygon(0 10%, 100% 10%, 100% 25%, 0 25%);
                        transform: translate(2px, 2px);
                    }
                    100% {
                        clip-path: polygon(0 2%, 100% 2%, 100% 15%, 0 15%);
                        transform: translate(-2px, -2px);
                    }
                }

                @keyframes glitch-bottom {
                    0% {
                        clip-path: polygon(0 85%, 100% 85%, 100% 98%, 0 98%);
                        transform: translate(2px, 2px);
                    }
                    50% {
                        clip-path: polygon(0 75%, 100% 75%, 100% 90%, 0 90%);
                        transform: translate(-2px, -2px);
                    }
                    100% {
                        clip-path: polygon(0 85%, 100% 85%, 100% 98%, 0 98%);
                        transform: translate(2px, 2px);
                    }
                }


                @keyframes glitch {
                    0% {
                        transform: translate(0);
                    }
                    20% {
                        transform: translate(-2px, 2px);
                    }
                    40% {
                        transform: translate(2px, -2px);
                    }
                    60% {
                        transform: translate(-1px, 1px);
                    }
                    80% {
                        transform: translate(1px, -1px);
                    }
                    100% {
                        transform: translate(0);
                    }
                }

            `}</style>
        </div>
    );
}

const btnStyle = {
    margin: '0 10px',
    padding: '8px 16px',
    fontFamily: 'monospace',
    background: '#111',
    color: '#0f0',
    border: '1px solid #0f0',
    cursor: 'pointer',
} as const;
