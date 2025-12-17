'use client';

import {useEffect, useRef} from 'react';
import {chapterIXData, fileLinks} from "@/lib/data/chapters/chapters";
import styles from '@/styles/Philosophy.module.css';
import {useChapterAccess, useFailed} from "@/hooks";
import {BACKGROUND_AUDIO, usePlayBackgroundAudio} from "@/audio";

export default function Philosophy() {
    const {isCurrentlySolved, setIsCurrentlySolved} = useChapterAccess();
    const audioRef = useRef<HTMLAudioElement>(null);

    usePlayBackgroundAudio(audioRef, BACKGROUND_AUDIO.BONUS.IX);
    useFailed('IX');

    useEffect(() => {
        setIsCurrentlySolved(true)
    }, []);

    useEffect(() => {
        if (isCurrentlySolved === false) {
            const link = document.createElement('a');
            link.href = fileLinks.IX.txt15;
            link.download = '15.txt';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }, [isCurrentlySolved]);

    return (
        <>
            <audio ref={audioRef} src={BACKGROUND_AUDIO.BONUS.IX} loop preload="auto" style={{display: 'none'}}/>
            <main className={styles.main}>
                <div className={styles.overlay}></div>
                <div className={styles.noise}></div>

                <h1 className={styles.glitch} data-text={chapterIXData.title}>
                    {chapterIXData.title}
                </h1>

                <p className={styles.text}>
                    Email{' '}
                    <a
                        className={styles.email}
                        href={`mailto:${chapterIXData.email}`}
                        data-text={chapterIXData.email}
                    >
                        {chapterIXData.email}
                    </a>{' '}
                    {chapterIXData.instructions}
                    <br/><br/>
                    <span className={styles.smalltext}>
                    {chapterIXData.smallText.split('\n').map((line, idx) => (
                        <span key={idx}>{line}<br/></span>
                    ))}
                </span>
                </p>

                <div className={`${styles.status} ${isCurrentlySolved ? styles.statusSolved : styles.statusPending}`}>
                    {isCurrentlySolved === null && (
                        <p className={styles.awaiting}>{chapterIXData.status.initializing}</p>
                    )}
                    {isCurrentlySolved === false && (
                        <div className={styles.pendingBlock}>
                            {chapterIXData.status.pending.map((line, idx) => (
                                <p key={idx} className={idx === 0 ? styles.awaiting : styles.awaitingSub}>
                                    {line}
                                </p>
                            ))}
                        </div>
                    )}
                    {isCurrentlySolved === true && (
                        <div className={styles.solvedBlock}>
                            <p className={styles.solvedGlitch} data-text={chapterIXData.status.solved.main}>
                                {chapterIXData.status.solved.main}
                            </p>
                            <p className={styles.aftertext}>
                                {chapterIXData.status.solved.afterText}
                            </p>
                        </div>
                    )}
                </div>

                <div className={styles.glow}></div>
            </main>
        </>
    );
}
