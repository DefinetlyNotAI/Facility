'use client';

import React, {useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import Cookies from 'js-cookie';
import {signCookie} from "@/lib/cookies";
import {VNTextRenderer} from "@/components/VNRenderer";
import styles from '../../styles/Terminal.module.css';
import {BACKGROUND_AUDIO, playSafeSFX, SFX_AUDIO, useBackgroundAudio} from "@/lib/audio";
import {
    cutsceneMetaCountdown,
    errorMessages,
    fakeEmail,
    keywords,
    keywordsMapping,
    phrase,
    placeholders,
    terminalMsg,
    vesselLoc,
    wingdingsTitles
} from '@/lib/data/terminal';
import {FullScreenOverlay, KeywordKey, TerminalStep} from "@/lib/types/all";
import {getOrCreateSessionId} from "@/lib/utils";

export default function TerminalPage() {
    const router = useRouter();
    const [sessionId] = useState(() => getOrCreateSessionId());
    const [unlocked, setUnlocked] = useState<boolean | null>(null);
    const [noCount, setNoCount] = useState(0);
    const [input, setInput] = useState('');
    const [guessedKeywords, setGuessedKeywords] = useState<Set<KeywordKey>>(new Set());
    const [messages, setMessages] = useState<string[]>([]);
    const [step, setStep] = useState<TerminalStep>('locked');
    const [showButtons, setShowButtons] = useState(false);
    const [wrongCount, setWrongCount] = useState(0);
    const [fullScreenOverlay, setFullScreenOverlay] = useState<null | FullScreenOverlay>(null);
    const [isReplay, setIsReplay] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    const normalize = (str: string) => str.trim().toLowerCase();

    const buildPhraseDisplay = () => {
        return phrase.template
            .map((word, idx) => {
                if (keywordsMapping[idx]) {
                    const keywordKey = keywordsMapping[idx];
                    return guessedKeywords.has(keywordKey)
                        ? keywords[keywordKey]
                        : phrase.placeholder;
                }
                return word;
            })
            .join(' ');
    };

    useBackgroundAudio(audioRef, BACKGROUND_AUDIO.TERMINAL, (unlocked && !fullScreenOverlay));

    // Queue system for timed rendering
    const flushMessagesSequentially = async (queue: string[], delay = 800) => {
        for (const msg of queue) {
            setMessages(prev => [...prev, msg]);
            await new Promise(r => setTimeout(r, delay));
        }
    };

    useEffect(() => {
        if (!Cookies.get('terminal_unlocked')) {
            setUnlocked(false);
        } else {
            setUnlocked(true);
            setStep('fill');
        }

        setIsReplay(!!Cookies.get('End?'));
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
                // Play success sound for correct keyword
                playSafeSFX(audioRef, SFX_AUDIO.SUCCESS, false);
                setMessages(['']);
            }

            const keywordKey = Number(matched[0]) as KeywordKey;
            if (guessedKeywords.has(keywordKey)) {
                setMessages(msgs => [...msgs, terminalMsg.alrPlaced(keywords[keywordKey])]);
                return;
            }

            setGuessedKeywords(prev => new Set(prev).add(keywordKey));
            setMessages(msgs => [...msgs, terminalMsg.successPlaced(keywords[keywordKey])]);

            if (guessedKeywords.size + 1 === Object.keys(keywords).length) {
                setMessages(['']);
                setStep('solving');
                await flushMessagesSequentially(terminalMsg.afterSuccess.part1(sessionId));
                await new Promise(r => setTimeout(r, 1000));
                setMessages(['']);
                await flushMessagesSequentially(terminalMsg.afterSuccess.part2(sessionId));
                setTimeout(() => {
                    setShowButtons(true);
                    setStep('question');
                }, 1000);
            }
        } else if (step === 'email') {
            if (val === fakeEmail) {
                // Play success sound
                playSafeSFX(audioRef, SFX_AUDIO.SUCCESS, false);
                setMessages(msgs => [...msgs, terminalMsg.successPlacedEmail]);

                // Wait before dumping the monologue
                setTimeout(() => {
                    flushMessagesSequentially(terminalMsg.afterSuccess.part3, 1300).catch(console.error);

                    setTimeout(() => {
                        setStep('countdown');
                        runCountdown().catch(console.error);
                    }, 6000); // Slight delay to ensure the lines are read
                }, 1500); // Pause after terminalMsg.successPlacedEmail msg

            } else {
                // Play error sound
                playSafeSFX(audioRef, SFX_AUDIO.ERROR, false);

                const nextWrong = wrongCount + 1;
                setWrongCount(nextWrong);

                if (nextWrong % 5 === 0) {
                    setMessages(['']); // Clear terminal every 5 wrongs
                }

                if (nextWrong > 25) setWrongCount(10);

                const response = terminalMsg.wrongPlaced[Math.min(nextWrong - 1, terminalMsg.wrongPlaced.length - 1)];
                setMessages(msgs => [...msgs, response]);
            }
        }
    };

    // --- Helpers for Input Animation ---
    const handleWrongPhrase = (val: string) => {
        // Play error sound
        playSafeSFX(audioRef, SFX_AUDIO.ERROR, false);

        function handleMessage(val: string, newCount: number) {
            const message = errorMessages[newCount];

            if (typeof message === 'string') {
                setMessages(msgs => [...msgs, message]);
            } else if (typeof message === 'function') {
                if (newCount === 8) {
                    // Slice all but first message, then add '...'
                    setMessages(msgs => msgs.slice(0, 1).concat([message(val)]));
                } else {
                    setMessages(msgs => [...msgs, message(val)]);
                }
            } else {
                // Fallback glitch logic
                const glitch = val
                    .split('')
                    .map((c, i) => (i % 2 === 0 ? '█' : c))
                    .join('');
                setMessages(msgs => [...msgs, `${glitch}?? try again??`]);
            }
        }

        let newCount = wrongCount + 1;
        if (newCount > 20) newCount = 10;
        setWrongCount(newCount);
        handleMessage(val, newCount);
    };

    const handleYes = () => {
        // Play interaction sound
        playSafeSFX(audioRef, SFX_AUDIO.SUCCESS, false);

        setShowButtons(false);
        setMessages(['']);
        flushMessagesSequentially(terminalMsg.afterSuccess.part4, 1200).catch(console.error);
        setStep('email');
    };

    const handleNo = () => {
        // Play error sound
        playSafeSFX(audioRef, SFX_AUDIO.ERROR, false);

        const newCount = noCount + 1;
        setNoCount(newCount);

        const msgQueue: string[] = terminalMsg.wrongChoice(sessionId);
        setMessages([msgQueue[Math.min(newCount - 1, msgQueue.length - 1)]]);

        // Optional: delay redirect to let message render for a moment
        setTimeout(() => {
            router.replace('/terminal');
        }, 1200);
    };

    function downloadVESSEL() {
        const a = document.createElement('a');
        a.href = vesselLoc.href;
        a.download = vesselLoc.name;
        document.body.appendChild(a);
        a.click();
        a.remove();
    }

    const runCountdown = async () => {
        setMessages([]);

        if (audioRef.current) {
            audioRef.current.pause();
        }

        if (isReplay) {
            for (const line of terminalMsg.afterSuccess.endCutsceneText.metaLines) {
                setFullScreenOverlay({
                    text: line,
                    size: 'huge',
                });
                await new Promise(r => setTimeout(r, 1800));
            }

            for (let i = cutsceneMetaCountdown; i >= 1; i--) {
                setFullScreenOverlay({
                    text: terminalMsg.afterSuccess.endCutsceneText.metaReplayTitle(i),
                    size: 'massive',
                });
                document.title = terminalMsg.afterSuccess.endCutsceneText.metaReplayTitle(i);
                await new Promise(r => setTimeout(r, 500));
            }

            setFullScreenOverlay({
                text: terminalMsg.afterSuccess.endCutsceneText.metaFinalMessage,
                size: 'huge',
            });
            document.title = terminalMsg.afterSuccess.endCutsceneText.metaFinalTitle;
            await new Promise(r => setTimeout(r, 3500));

            downloadVESSEL();

            try {
                await signCookie('End?=true');
            } catch {
            }

            router.push('/the-end');
            return;
        }

        for (const line of terminalMsg.afterSuccess.endCutsceneText.poeticLines) {
            setFullScreenOverlay({
                text: line,
                size: 'huge',
            });
            await new Promise(r => setTimeout(r, 1700));
        }

        for (let i = 24; i >= 1; i--) {
            setFullScreenOverlay({
                text: `${i}`,
                size: 'massive',
            });
            if (wingdingsTitles[i - 1]) {
                document.title = wingdingsTitles[i - 1];
            }
            await new Promise(r => setTimeout(r, i > 5 ? 700 : 350));
        }

        for (const line of terminalMsg.afterSuccess.endCutsceneText.finaleLines) {
            setFullScreenOverlay({
                text: line,
                size: 'huge',
            });
            await new Promise(r => setTimeout(r, 1400));
        }

        document.title = terminalMsg.afterSuccess.endCutsceneText.vesselFinalTitle;

        await new Promise(r => setTimeout(r, 2000));

        downloadVESSEL();

        try {
            await signCookie('End?=true');
        } catch {
        }

        router.push('/the-end');
    };

    if (unlocked === false) return <h1>404</h1>;
    if (unlocked === null) return null;

    return (
        <>
            <audio
                ref={audioRef}
                src={BACKGROUND_AUDIO.TERMINAL}
                loop
                preload="auto"
                style={{display: 'none'}}
            />
            <div className={styles.container}>
                {/* Hide phraseDisplay during cutscene */}
                {!fullScreenOverlay && (
                    <div className={styles.phraseDisplay}>
                        {buildPhraseDisplay()}
                    </div>
                )}

                <div className={styles.messageContainer}>
                    {messages.map((line, i) => (
                        <VNTextRenderer key={`msg-${i}`} text={line}/>
                    ))}
                </div>

                {(step === 'fill' || step === 'email') && !fullScreenOverlay && (
                    <form onSubmit={handleSubmit} className={styles.inputForm}>
                        <input
                            autoFocus
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder={placeholders[step as 'fill' | 'email']}
                            className={styles.input}
                            spellCheck={false}
                            autoComplete="off"
                        />
                    </form>
                )}

                {showButtons && !fullScreenOverlay && (
                    <div className={styles.buttonContainer}>
                        <button onClick={handleYes} className={styles.choiceButton}>
                            YES
                        </button>
                        <button onClick={handleNo} className={styles.choiceButton}>
                            NO
                        </button>
                    </div>
                )}

                {fullScreenOverlay && (
                    <div
                        className={`${styles.fullscreenOverlay} ${fullScreenOverlay.size || ''} ${fullScreenOverlay.glitch ? 'corrupted-glitch' : ''}`}>
                        {fullScreenOverlay.text}
                    </div>
                )}
            </div>
        </>
    );
}
