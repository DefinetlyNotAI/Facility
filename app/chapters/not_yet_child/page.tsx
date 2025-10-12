'use client';

import styles from '@/styles/Bonus.module.css';
import {bonusErrorText} from "@/lib/data/bonus";
import {useEffect, useRef} from "react";
import {useBackgroundAudio} from "@/hooks/useBackgroundAudio";
import {BACKGROUND_AUDIO, playSafeSFX, SFX_AUDIO} from "@/lib/data/audio";
import {router} from "next/client";


export default function NotYetChild() {
    const audioRef = useRef<HTMLAudioElement>(null);

    // Initialize background audio
    useBackgroundAudio(audioRef, BACKGROUND_AUDIO.N404)

    useEffect(() => {
        playSafeSFX(audioRef, SFX_AUDIO.ERROR, true);
    }, [router])

    return (
        <div className={styles.container}>
            <p className={styles.text}>
                {bonusErrorText.notYetChild}
            </p>
        </div>
    );
}