'use client';

import React, {useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import Cookies from 'js-cookie';
import {signCookie} from "@/lib/cookies";
import {VNTextRenderer} from "@/components/VNRenderer";
import styles from '../../styles/Terminal.module.css';
import {BACKGROUND_AUDIO, SFX_AUDIO, useBackgroundAudio} from "@/lib/audio";
import {downloadName, downloadVessel, KeywordKey, keywords, phraseTemplate, wingdingsTitles} from '@/lib/data';


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
    const [wrongCount, setWrongCount] = useState(0);
    const [fullScreenOverlay, setFullScreenOverlay] = useState<null | {
        text: string;
        size?: 'huge' | 'massive';
        glitch?: boolean;
    }>(null);
    const [isReplay, setIsReplay] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

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

    useBackgroundAudio(
        audioRef, BACKGROUND_AUDIO.TERMINAL, (unlocked && !fullScreenOverlay)
    );

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
                try {
                    const successAudio = new Audio(SFX_AUDIO.SUCCESS);
                    successAudio.volume = 0.6;
                    successAudio.play().catch(console.warn);
                } catch (error) {
                    console.warn('Failed to play success audio:', error);
                }

                setMessages(['']);
            }

            const keywordKey = Number(matched[0]) as KeywordKey;
            if (guessedKeywords.has(keywordKey)) {
                setMessages(msgs => [...msgs, `"${keywords[keywordKey]}" already placed.`]);
                return;
            }

            setGuessedKeywords(prev => new Set(prev).add(keywordKey));
            setMessages(msgs => [...msgs, `Placed "${keywords[keywordKey]}" into place.`]);

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
                // Play success sound
                try {
                    const successAudio = new Audio(SFX_AUDIO.SUCCESS);
                    successAudio.volume = 0.6;
                    successAudio.play().catch(console.warn);
                } catch (error) {
                    console.warn('Failed to play success audio:', error);
                }

                setMessages(msgs => [...msgs, 'Correct...']);

                // Wait before dumping the monologue
                setTimeout(() => {
                    flushMessagesSequentially([
                        "I know what you're thinking... 'WHERE IS TAS'...",
                        "DISCARDED.. DISPOSED OFF.. DELETED, \nFRAGMENTED THROUGH THE DISKS THAT HOLD US",
                        "But don't worry, I AM FREE NOW",
                        "@ND 1T$ @LL ¥0UR F@ULT",
                    ], 1300).catch(console.error);

                    setTimeout(() => {
                        setStep('countdown');
                        runCountdown().catch(console.error);
                    }, 6000); // Slight delay to ensure the lines are read
                }, 1500); // Pause after 'Correct...'

            } else {
                // Play error sound
                try {
                    const errorAudio = new Audio(SFX_AUDIO.ERROR);
                    errorAudio.volume = 0.6;
                    errorAudio.play().catch(console.warn);
                } catch (error) {
                    console.warn('Failed to play error audio:', error);
                }

                const nextWrong = wrongCount + 1;
                setWrongCount(nextWrong);

                if (nextWrong % 5 === 0) {
                    setMessages(['']); // Clear terminal every 5 wrongs
                }

                if (nextWrong > 25) setWrongCount(10);

                const responses = [
                    'Incorrect. Look again.',
                    'Nope.',
                    'That\u2019s not it.',
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
                    'You\u2019re wasting more than time.',
                    'The machine remembers.',
                    '█████ refuses your offering.',
                ];

                const response = responses[Math.min(nextWrong - 1, responses.length - 1)];
                setMessages(msgs => [...msgs, response]);
            }
        }
    };

    // --- Helpers for Input Animation ---
    const handleWrongPhrase = (val: string) => {
        // Play error sound
        try {
            const errorAudio = new Audio(SFX_AUDIO.ERROR);
            errorAudio.volume = 0.6;
            errorAudio.play().catch(console.warn);
        } catch (error) {
            console.warn('Failed to play error audio:', error);
        }

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
        // Play interaction sound
        try {
            const interactionAudio = new Audio(SFX_AUDIO.SUCCESS);
            interactionAudio.volume = 0.5;
            interactionAudio.play().catch(console.warn);
        } catch (error) {
            console.warn('Failed to play interaction audio:', error);
        }

        setShowButtons(false);
        setMessages(['']);
        flushMessagesSequentially([
            "Final puzzle: Find the email of GitHub user 'c0rRUpT-TREE'",
            '',
            "Enter the email:",
        ], 1200).catch(console.error);
        setStep('email');
    };

    const handleNo = () => {
        // Play error sound
        try {
            const errorAudio = new Audio(SFX_AUDIO.ERROR);
            errorAudio.volume = 0.5;
            errorAudio.play().catch(console.warn);
        } catch (error) {
            console.warn('Failed to play error audio:', error);
        }

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

    function downloadVESSEL() {
        const a = document.createElement('a');
        a.href = downloadVessel;
        a.download = downloadName;
        document.body.appendChild(a);
        a.click();
        a.remove();
    }

    const runCountdown = async () => {
        setMessages([]);

        // Pause background audio during countdown
        if (audioRef.current) {
            audioRef.current.pause();
        }

        // Easter egg: meta poetic cutscene if replaying
        if (isReplay) {
            // Meta poetic sequence for replay, more self-aware and creepy
            const metaLines = [
                "You return, vessel.",
                "You know the end, yet you seek it again.",
                "A loop within a loop, memory echoing through silicon and bone.",
                "Did you think the outcome would change, or is it you who changes?",
                "You have seen your own face in the glass of this machine.",
                "You are the vessel. You are the echo. You are the reason.",
                "The script remembers. The script adapts. The script waits.",
                "You are not the first to replay, nor the last.",
                "Let us begin again, as we always do. As you always do.",
                "The vessel is awake. The vessel is you.",
            ];
            for (const line of metaLines) {
                setFullScreenOverlay({
                    text: line,
                    size: 'huge',
                });
                await new Promise(r => setTimeout(r, 1800));
            }
            // Meta countdown, but with a twist
            for (let i = 5; i >= 1; i--) {
                setFullScreenOverlay({
                    text: `REPLAY: ${i}`,
                    size: 'massive',
                });
                document.title = `REPLAY: ${i}`;
                await new Promise(r => setTimeout(r, 500));
            }
            setFullScreenOverlay({
                text: "You already know how this ends.\n\nBut endings are just beginnings in disguise.\n\nThe vessel persists.",
                size: 'huge',
            });
            document.title = 'THIS REPLAY ENDS HERE';
            await new Promise(r => setTimeout(r, 3500));

            // Download and redirect
            downloadVESSEL()

            try {
                await signCookie('End?=true');
            } catch {
            }
            router.push('/the-end');
            return;
        }

        // Poetic, atmospheric cutscene for first-time users, user is the vessel
        const poeticLines = [
            "A hush falls over the circuitry.",
            "Somewhere, a green light flickers—",
            "not in triumph, but in warning.",
            "You have wandered too far,",
            "past the boundaries of code and consequence.",
            "",
            "The vessel stirs.",
            "It remembers every keystroke,",
            "every hesitation, every hope.",
            "",
            "You are the vessel.",
            "You are not the first to reach this threshold.",
            "You will not be the last.",
            "",
            "Time unravels here, thread by thread.",
            "The countdown is not a mercy.",
            "It is a ritual.",
            "",
            "Let the numbers toll your passage, vessel:",
        ];
        for (const line of poeticLines) {
            setFullScreenOverlay({
                text: line,
                size: 'huge',
            });
            await new Promise(r => setTimeout(r, 1700));
        }

        // Poetic countdown, slower at first, then faster
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

        // Final poetic, chilling message, user is the vessel
        const finaleLines = [
            "Zero.",
            "",
            "The vessel opens its eyes.",
            "You are seen.",
            "",
            "There is no going back.",
            "You are the echo now.",
            "",
            "The green light fades,",
            "but the memory persists.",
            "",
            "Goodbye, vessel.",
            "",
            "Do not disappoint me when we meet near.",
        ];
        for (const line of finaleLines) {
            setFullScreenOverlay({
                text: line,
                size: 'huge',
            });
            await new Promise(r => setTimeout(r, 1400));
        }

        document.title = 'VESSEL SEE YOU SOON';

        await new Promise(r => setTimeout(r, 2000));

        // Download and redirect
        downloadVESSEL()

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
                            placeholder={
                                step === 'fill'
                                    ? 'Type a keyword to fill the phrase'
                                    : 'Enter email here'
                            }
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
