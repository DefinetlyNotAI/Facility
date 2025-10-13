'use client';

import styles from '@/styles/Bonus.module.css';
import {bonusErrorText} from "@/lib/data/bonus";
import React, {useEffect, useRef} from "react";
import {useBackgroundAudio} from "@/hooks/useBackgroundAudio";
import {BACKGROUND_AUDIO, playSafeSFX, SFX_AUDIO} from "@/lib/data/audio";
import {router} from "next/client";

// Page when the bonus chapter is not yet released
export default function NotYetChild() {
    const audioRef = useRef<HTMLAudioElement>(null);

    // Initialize background audio
    useBackgroundAudio(audioRef, BACKGROUND_AUDIO.BONUS.NOT_YET)

    useEffect(() => {
        playSafeSFX(audioRef, SFX_AUDIO.ERROR, true);
    }, [router])

    return (
        <>
            <audio
                ref={audioRef}
                src={BACKGROUND_AUDIO.BONUS.NOT_YET}
                loop={true}
                preload="auto"
                style={{display: "none"}}/>
            <div className={styles.container}>
                <p className={styles.text}>
                    {bonusErrorText.notYetChild}
                </p>
            </div>
        </>
    );
}