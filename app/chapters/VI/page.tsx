'use client';
import React, {useEffect, useRef, useState} from 'react';
import styles from '@/styles/ChaptersVI.module.css';
import {useChapterAccess} from "@/hooks/BonusActHooks/useChapterAccess";
import {BACKGROUND_AUDIO, useBackgroundAudio} from "@/lib/data/audio";

export default function ChapterVIPage() {
    const {isCurrentlySolved, setIsCurrentlySolved} = useChapterAccess() as any;

    // Persistent seconds in localStorage
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        const stored = localStorage.getItem('chapterVISeconds');
        if (stored) setSeconds(Number(stored));
    }, []);

    const intervalRef = useRef<number | null>(null);
    const [localSolved, setLocalSolved] = useState<boolean>(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    const messages = [
        "To escape time, you must endure it.",
        "Time is fleeting, but so am I.",
        "Each tick brings me closer to you.",
        "Patience is a virtue, they say.",
        "The hands of time wait for no one.",
        "Almost there, just a little longer.",
        "HE lived here, before HE wrote a story."
    ];

    // Generate falling petals once
    const [fallingPetals] = useState(() => {
        return Array.from({length: 24}).map((_, i) => {
            const left = Math.random() * 100;
            const dur = 6 + Math.random() * 6;
            const delay = Math.random() * -12;
            return (
                <div
                    key={i}
                    className="fallingPetal"
                    style={{
                        position: 'absolute',
                        left: `${left}%`,
                        top: `${-10 - Math.random() * 30}vh`,
                        width: `${16 + Math.random() * 28}px`,
                        height: `${10 + Math.random() * 18}px`,
                        background: 'linear-gradient(180deg,#ff4b6b,#b3001b)',
                        borderRadius: '50% 50% 40% 40% / 60% 60% 40% 40%',
                        opacity: 0.95,
                        transform: `rotate(${Math.random() * 360}deg)`,
                        animation: `fallLinear ${dur}s linear ${delay}s infinite`,
                    } as React.CSSProperties}
                />
            );
        });
    });

    useEffect(() => {
        // Already solved
        if (isCurrentlySolved) {
            setLocalSolved(true);
            return;
        }

        // Start timer
        intervalRef.current = window.setInterval(() => {
            setSeconds(prev => prev + 1);
        }, 1000);

        // Warn on leaving
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

    // Persist timer
    useEffect(() => {
        localStorage.setItem('chapterVISeconds', seconds.toString());
    }, [seconds]);

    useBackgroundAudio(audioRef, BACKGROUND_AUDIO.BONUS.VI);

    useEffect(() => {
        const hours = Math.floor(seconds / 3600);
        if (hours >= 6 && !localSolved) {
            setLocalSolved(true);
            try {
                if (typeof setIsCurrentlySolved === 'function') {
                    setIsCurrentlySolved(true);
                } else {
                    fetch('/api/chapters/VI/solve', {method: 'POST'}).catch((e) => {
                        console.error('Failed to mark Chapter VI solved:', e);
                    });
                }
            } catch (e) {
                console.error(e);
            }
        }
    }, [seconds, localSolved, setIsCurrentlySolved]);

    const hoursElapsed = Math.min(6, Math.floor(seconds / 3600));
    const currentMessage = messages[Math.min(hoursElapsed, messages.length - 1)];

    const renderFallingPetals = () => <div className={`${styles.chapterVI} bgPetals`}>{fallingPetals}</div>;

    return (
        <div className={`${styles.chapterVI} ${localSolved || isCurrentlySolved ? 'solved' : ''}`}>
            <audio
                ref={audioRef}
                src={BACKGROUND_AUDIO.BONUS.VI}
                loop
                preload="auto"
                style={{display: 'none'}}
            />
            <div className="clock" aria-hidden/>
            <div className="lily" role="img" aria-label="Red spider lily">
                <div className="center" />
                {Array.from({ length: 6 }).map((_, idx) => {
                    const fallenNow = idx < hoursElapsed;
                    const rotation = -90 + idx * 60; // evenly spaced petals
                    return (
                        <div
                            key={idx}
                            className={`petal sway ${fallenNow ? 'fallen' : ''}`}
                            style={{ '--r': `${rotation}deg` } as React.CSSProperties}
                        />
                    );
                })}
            </div>

            <div className="messageBox" role="status" aria-live="polite">
                {localSolved || isCurrentlySolved ? (
                    <>
                        <div style={{fontStyle: 'normal', marginBottom: 8, fontWeight: 600}}>
                            All for nothing, No prize today, too early too early, just wait for {`{X}`}, but to escape
                            the clock, share this to HIM, for he can fix it for all, and not need more death to fall
                        </div>
                        <div style={{fontSize: '.9rem', opacity: 0.85}}>You endured the clock.</div>
                    </>
                ) : (
                    <>
                        <div>{currentMessage}</div>
                        <div style={{marginTop: 8, fontSize: '.9rem', opacity: 0.8}}>
                            {String(hoursElapsed)} hour{hoursElapsed !== 1 ? 's' : ''} endured.
                        </div>
                    </>
                )}
            </div>

            {(localSolved || isCurrentlySolved) && renderFallingPetals()}
        </div>
    );
}
