'use client';
import React, {useEffect, useRef, useState} from 'react';
import styles from '@/styles/ChaptersVI.module.css';
import {BACKGROUND_AUDIO, usePlayBackgroundAudio} from '@/audio';
import {useChapterAccess} from "@/hooks";
import {localStorageKeys} from "@/lib/saveData";
import {chapterVIData} from "@/lib/client/data/chapters/VI";
import {getSecureItem, setSecureItem} from "@/lib/client/utils/secureStorage";
import {chapter} from "@/lib/client/data/chapters";

export default function ChapterVIPage() {
    const {isCurrentlySolved, setIsCurrentlySolved} = useChapterAccess() as any;
    const [seconds, setSeconds] = useState(0);
    const intervalRef = useRef<number | null>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [petals, setPetals] = useState<{ left: string; duration: string; delay: string }[]>([]);

    // Side-puzzle state
    const [sideSolved, setSideSolved] = useState<boolean | null>(null);
    const [showSidePuzzle, setShowSidePuzzle] = useState(false);
    const [sideFeedback, setSideFeedback] = useState<string | null>(null);

    // New hold-to-wait puzzle state (patience-themed)
    const [holding, setHolding] = useState(false);
    const [holdProgress, setHoldProgress] = useState(0); // 0..1
    const holdStartRef = useRef<number | null>(null);
    const lastTickRef = useRef<number | null>(null);
    const holdIntervalRef = useRef<number | null>(null);
    const [requiredHoldSeconds, setRequiredHoldSeconds] = useState(10); // seconds required to demonstrate patience (can increase with impatience)
    const [impatienceCount, setImpatienceCount] = useState(0);

    // Load saved time and side-puzzle solved flag
    useEffect(() => {
        const loadSaved = async () => {
            try {
                const stored = await getSecureItem(localStorageKeys.chapterVISeconds);
                if (stored) setSeconds(Number(stored));
                const side = await getSecureItem(localStorageKeys.chapterVISidePuzzleSolved as any);
                if (side) setSideSolved(Boolean(Number(side)));
                else setSideSolved(false);
            } catch (e) {
                console.error(e);
                setSideSolved(false);
            }
        };
        loadSaved().catch(console.error);
    }, []);

    // Timer
    useEffect(() => {
        if (isCurrentlySolved) return;

        intervalRef.current = window.setInterval(() => {
            setSeconds((prev) => prev + 1);
        }, 1000);

        const beforeunload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = '';
        };
        window.addEventListener('beforeunload', beforeunload);

        return () => {
            if (intervalRef.current) window.clearInterval(intervalRef.current);
            window.removeEventListener('beforeunload', beforeunload);
        };
    }, [isCurrentlySolved]);

    // Save time
    useEffect(() => {
        setSecureItem(localStorageKeys.chapterVISeconds, seconds.toString()).catch(console.error);
    }, [seconds]);

    usePlayBackgroundAudio(audioRef, BACKGROUND_AUDIO.BONUS.VI);

    // When time reaches duration, either show side-puzzle or reveal prize if side already solved
    useEffect(() => {
        if (seconds >= chapterVIData.duration && !isCurrentlySolved) {
            if (sideSolved) {
                setIsCurrentlySolved(true);
            } else {
                setShowSidePuzzle(true);
            }
        }
    }, [seconds, isCurrentlySolved, sideSolved]);

    // When user solves side puzzle, persist and reveal prize
    useEffect(() => {
        if (sideSolved) {
            setSecureItem(localStorageKeys.chapterVISidePuzzleSolved as any, '1').catch(console.error);
            if (seconds >= chapterVIData.duration && !isCurrentlySolved) {
                setIsCurrentlySolved(true);
            }
        }
    }, [sideSolved]);

    useEffect(() => {
        const generated = Array.from({length: 20}).map(() => ({
            left: `${Math.random() * 100}%`,
            duration: `${8 + Math.random() * 5}s`,
            delay: `${Math.random() * 5}s`,
        }));
        setPetals(generated);

    }, []);

    const formatTime = (totalSeconds: number) => {
        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        const pad = (n: number) => String(n).padStart(2, '0');
        return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    };

    const progress = seconds / chapterVIData.duration;
    const messageIndex = Math.floor(progress * chapterVIData.msgs.length);
    const currentMessage = chapterVIData.msgs[Math.min(messageIndex, chapterVIData.msgs.length - 1)];

    // Hold-to-wait puzzle handlers
    const startHold = () => {
        if (sideSolved) return;
        setSideFeedback(null);
        // don't reset progress on every hold; patience can be built across multiple holds,
        // but we track precise time while holding to avoid exploitation.
        setHolding(true);
        holdStartRef.current = performance.now();
        lastTickRef.current = performance.now();
        if (holdIntervalRef.current) window.clearInterval(holdIntervalRef.current);
        holdIntervalRef.current = window.setInterval(() => {
            if (!lastTickRef.current) return;
            const now = performance.now();
            const delta = (now - lastTickRef.current) / 1000;
            lastTickRef.current = now;
            setHoldProgress((prev) => {
                const next = Math.min(prev + delta / requiredHoldSeconds, 1);
                if (next >= 1) {
                    // solved
                    if (holdIntervalRef.current) {
                        window.clearInterval(holdIntervalRef.current);
                        holdIntervalRef.current = null;
                    }
                    setHolding(false);
                    setSideFeedback('You finally waited. The prize is revealed.');
                    setSideSolved(true);
                    setShowSidePuzzle(false);
                }
                return next;
            });
        }, 100);
    };

    const stopHold = () => {
        if (holdIntervalRef.current) {
            window.clearInterval(holdIntervalRef.current);
            holdIntervalRef.current = null;
        }
        if (!holdStartRef.current) {
            setHolding(false);
            setHoldProgress(0);
            return;
        }
        const elapsed = (performance.now() - holdStartRef.current) / 1000;
        holdStartRef.current = null;
        lastTickRef.current = null;
        setHolding(false);
        if (holdProgress < 1) {
            // Premature release: penalize progress and increase required time slightly to simulate "harder to be patient"
            setImpatienceCount((c) => {
                const next = c + 1;
                // increase difficulty up to +5s max
                setRequiredHoldSeconds((prev) => Math.min(10, prev + 1));
                return next;
            });
            setHoldProgress((p) => Math.max(0, p - 0.25));
            setSideFeedback(`You released early after ${elapsed.toFixed(1)}s. Progress regresses and patience becomes harder.`);
        }
    };

    // Passive decay when not holding: gentle regression to encourage continuous patience
    useEffect(() => {
        if (!showSidePuzzle) return;
        if (holding) return;
        const decay = window.setInterval(() => {
            setHoldProgress((p) => Math.max(0, p - 0.02));
        }, 400);
        return () => window.clearInterval(decay);
    }, [showSidePuzzle, holding]);

    // cleanup intervals on unmount
    useEffect(() => {
        return () => {
            if (holdIntervalRef.current) window.clearInterval(holdIntervalRef.current);
        };
    }, []);

    return (
        <div className={`${styles.chapterVI} ${isCurrentlySolved ? 'solved' : ''}`}>
            <audio ref={audioRef} src={BACKGROUND_AUDIO.BONUS.VI} loop preload="auto" style={{display: 'none'}}/>
            <div className={styles.flowerBlackHole} aria-hidden></div>

            {petals.map((petal, i) => (
                <div
                    key={i}
                    className={styles.petal}
                    style={{
                        left: petal.left,
                        animationDuration: petal.duration,
                        animationDelay: petal.delay,
                    }}
                />
            ))}

            <div className={styles.messageBox} role="status" aria-live="polite">
                {showSidePuzzle && !sideSolved ? (
                    // ...replace typing puzzle with a hold-to-wait patience puzzle...
                    <div>
                        <div style={{fontWeight: 600, marginBottom: 8}}>Todays word of the day
                            is <strong>PATIENCE</strong></div>
                        <div style={{marginBottom: 8}}>
                            Demonstrate patience: press and hold the button below for {requiredHoldSeconds} seconds to
                            claim your prize.
                        </div>
                        <div style={{fontSize: '.8rem', opacity: 0.85, marginBottom: 8}}>
                            Current required hold: {requiredHoldSeconds}s — Impatience strikes: {impatienceCount}
                        </div>

                        <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
                            <button
                                type="button"
                                onPointerDown={startHold}
                                onPointerUp={stopHold}
                                onPointerCancel={stopHold}
                                onPointerLeave={stopHold}
                                onKeyDown={(e) => {
                                    if (e.key === ' ' || e.key === 'Enter') {
                                        e.preventDefault();
                                        startHold();
                                    }
                                }}
                                onKeyUp={(e) => {
                                    if (e.key === ' ' || e.key === 'Enter') {
                                        e.preventDefault();
                                        stopHold();
                                    }
                                }}
                                aria-pressed={holding}
                                style={{padding: '10px 14px', fontWeight: 700, cursor: 'pointer'}}
                            >
                                {holding ? 'Holding…' : 'Hold to wait'}
                            </button>

                            <div style={{flex: 1}} aria-hidden>
                                <div style={{
                                    height: 12,
                                    background: 'rgba(255,255,255,0.08)',
                                    borderRadius: 6,
                                    overflow: 'hidden'
                                }}>
                                    <div style={{
                                        width: `${Math.round(holdProgress * 100)}%`,
                                        height: '100%',
                                        background: 'linear-gradient(90deg,#8ee7ff,#7bffb2)'
                                    }}/>
                                </div>
                                <div style={{fontSize: '.8rem', opacity: 0.85, marginTop: 6}}>
                                    {Math.round(holdProgress * requiredHoldSeconds * 10) / 10}/{requiredHoldSeconds}s
                                </div>
                            </div>
                        </div>

                        <div style={{display: 'flex', gap: 8, marginTop: 10}}>
                            <button type="button" onClick={() => {
                                setShowSidePuzzle(false);
                                setSideFeedback(null);
                                setHoldProgress(0);
                            }} style={{padding: '6px 10px'}}>Close
                            </button>
                        </div>

                        {sideFeedback && <div style={{marginTop: 8, opacity: 0.9}}>{sideFeedback}</div>}
                    </div>

                ) : isCurrentlySolved === null ? (
                    <div className="text-white font-mono">{chapter.loading}</div>
                ) : isCurrentlySolved ? (
                    <>
                        <div style={{fontStyle: 'normal', marginBottom: 8, fontWeight: 600}}>
                            {chapterVIData.solveText.title}
                        </div>
                        <div style={{fontSize: '.9rem', opacity: 0.85}}>
                            {chapterVIData.solveText.subtitle}
                        </div>
                    </>
                ) : (
                    <>
                        <div>{currentMessage}</div>
                        <div style={{marginTop: 8, fontSize: '.9rem', opacity: 0.8}}>
                            {formatTime(seconds)} endured.
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
