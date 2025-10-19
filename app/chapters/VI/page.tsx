'use client';
import React, { useEffect, useRef, useState } from 'react';
import styles from '@/styles/ChaptersVI.module.css';
import { useBackgroundAudio } from '@/lib/data/audio';
// import {useChapterAccess} from "@/hooks/BonusActHooks/useChapterAccess";
import { BACKGROUND_AUDIO } from '@/lib/data/audio';

const CHAPTER_VI = {
    ID: 'VI',
    STORAGE_KEY: 'chapterVISeconds',
    DURATION_SECONDS: 50,
    MESSAGES: [
        'To escape time, you must endure it.',
        'Time is fleeting, but so am I.',
        'Each tick brings me closer to you.',
        'Patience is a virtue, they say.',
        'The hands of time wait for no one.',
        'Almost there, just a little longer.',
        'HE lived here, before HE wrote a story.',
    ],
    SOLVED_TEXT: {
        TITLE:
            'All for nothing, No prize today, too early too early, just wait, but to escape the clock, share this to HIM, for he can fix it for all, and not need more death to fall',
        SUBTITLE: 'You endured the clock.',
    },
} as const;

export default function ChapterVIPage() {
    // const {isCurrentlySolved, setIsCurrentlySolved} = useChapterAccess() as any;
    const [isCurrentlySolved, setIsCurrentlySolved] = useState<boolean | null>(false);
    const [seconds, setSeconds] = useState(0);
    const intervalRef = useRef<number | null>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

    // Load saved time
    useEffect(() => {
        const stored = localStorage.getItem(CHAPTER_VI.STORAGE_KEY);
        if (stored) setSeconds(Number(stored));
    }, []);

    // Timer
    useEffect(() => {
        if (isCurrentlySolved) return;

        intervalRef.current = window.setInterval(() => {
            setSeconds((prev) => prev + 1);
        }, 1000);

        const beforeunload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            // noinspection JSDeprecatedSymbols
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
        localStorage.setItem(CHAPTER_VI.STORAGE_KEY, seconds.toString());
    }, [seconds]);

    useBackgroundAudio(audioRef, BACKGROUND_AUDIO.BONUS.VI);

    // Solve check
    useEffect(() => {
        if (seconds >= CHAPTER_VI.DURATION_SECONDS && !isCurrentlySolved) {
            setIsCurrentlySolved(true);
        }
    }, [seconds, isCurrentlySolved]);

    const formatTime = (totalSeconds: number) => {
        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        const pad = (n: number) => String(n).padStart(2, '0');
        return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    };

    const currentMessage = CHAPTER_VI.MESSAGES[0]; // You could optionally rotate through messages by time

    return (
        <div className={`${styles.chapterVI} ${isCurrentlySolved ? 'solved' : ''}`}>
            <audio ref={audioRef} src={BACKGROUND_AUDIO.BONUS.VI} loop preload="auto" style={{ display: 'none' }} />
            <div className="clock" aria-hidden />

            <div className="messageBox" role="status" aria-live="polite">
                {isCurrentlySolved ? (
                    <>
                        <div style={{ fontStyle: 'normal', marginBottom: 8, fontWeight: 600 }}>
                            {CHAPTER_VI.SOLVED_TEXT.TITLE}
                        </div>
                        <div style={{ fontSize: '.9rem', opacity: 0.85 }}>{CHAPTER_VI.SOLVED_TEXT.SUBTITLE}</div>
                    </>
                ) : (
                    <>
                        <div>{currentMessage}</div>
                        <div style={{ marginTop: 8, fontSize: '.9rem', opacity: 0.8 }}>{formatTime(seconds)} endured.</div>
                    </>
                )}
            </div>
        </div>
    );
}
