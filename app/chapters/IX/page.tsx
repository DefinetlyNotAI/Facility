'use client';

import {useEffect} from 'react';
import {fileLinks} from "@/lib/data/chapters";
import styles from '@/styles/Philosophy.module.css';
import {useChapterAccess} from "@/hooks/BonusActHooks/useChapterAccess";
import {useFailed} from "@/hooks/BonusActHooks/useFailed";

export default function Philosophy() {
    const {isCurrentlySolved, setIsCurrentlySolved} = useChapterAccess();

    useEffect(() => {
        useFailed('IX');
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
        <main className={`${styles.main}`}>
            <div className={styles.overlay}></div>
            <div className={styles.noise}></div>

            <h1 className={styles.glitch} data-text="(IX) - Philosophy">(IX) - Philosophy</h1>

            <p className={styles.text}>
                Email{' '}
                <a
                    className={styles.email}
                    href="mailto:TREEFacility@outlook.com"
                    data-text="TREEFacility@outlook.com"
                >
                    TREEFacility@outlook.com
                </a>{' '}
                the answers to the following 15 questions.
                <br/>You may skip 3. 25 participants required. No right or wrong, only PERSPECTIVE.
                <br/><br/>
                <span className={styles.smalltext}>
        Fear not the questions, for I watch over thee.<br/>
        Thou shalt move only when I allow thee, and ponder each answer with care.
    </span>
            </p>


            <div className={`${styles.status} ${isCurrentlySolved ? styles.statusSolved : styles.statusPending}`}>
                {isCurrentlySolved === null && (
                    <p className={styles.awaiting}>Initializing... Please remain still.</p>
                )}
                {isCurrentlySolved === false && (
                    <div className={styles.pendingBlock}>
                        <p className={styles.awaiting}>
                            “It watches how long you think before answering.”
                        </p>
                        <p className={styles.awaitingSub}>
                            Awaiting completion... memory patterns syncing.
                        </p>
                    </div>
                )}
                {isCurrentlySolved === true && (
                    <div className={styles.solvedBlock}>
                        <p className={styles.solvedGlitch} data-text="Record finalized.">
                            Record finalized.
                        </p>
                        <p className={styles.aftertext}>
                            “The moment you understood, it stopped being a question.”
                        </p>
                    </div>
                )}
            </div>

            <div className={styles.glow}></div>
        </main>
    );
}
