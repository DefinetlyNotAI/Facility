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

    // Load saved time
    useEffect(() => {
        const loadSavedTime = async () => {
            const stored = await getSecureItem(localStorageKeys.chapterVISeconds);
            if (stored) setSeconds(Number(stored));
        };
        loadSavedTime().catch(console.error);
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

    // Solve check
    useEffect(() => {
        if (seconds >= chapterVIData.duration && !isCurrentlySolved) {
            setIsCurrentlySolved(true);
        }
    }, [seconds, isCurrentlySolved]);

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
                {isCurrentlySolved === null ? (
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
