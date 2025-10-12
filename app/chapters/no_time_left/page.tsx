'use client';

import styles from '@/styles/NoTimeLeft.module.css';
import { useSearchParams } from "next/navigation";
import {chapterMessages, chapterStyles} from "@/lib/data/bonus";
import {BACKGROUND_AUDIO, playSafeSFX, SFX_AUDIO, useBackgroundAudio} from "@/lib/data/audio";
import {useEffect, useRef} from "react";
import {router} from "next/client";

export default function NoTimeLeft() {
    const searchParams = useSearchParams();
    const chapterId = searchParams.get('chapter')?.toUpperCase();
    const audioRef = useRef<HTMLAudioElement>(null);

    // Initialize background audio
    useBackgroundAudio(audioRef, BACKGROUND_AUDIO.N404)

    useEffect(() => {
        playSafeSFX(audioRef, SFX_AUDIO.ERROR, true);
    }, [router])

    if (!chapterId || !chapterMessages[chapterId]) return null;

    return (
        <div className={styles.container}>
            <p className={chapterStyles[chapterId]}>
                {chapterMessages[chapterId]}
            </p>
        </div>
    );
}

// TODO - Add check here using bonusApi.getOne if the chapter is unlocked, if not redirect to /bonus/not_yet_child
// TODO - Add the db bonusApi.getAll to the /smileking page, and add toggle via bonusApi.changeToOpp to unlock the chapters as I will
