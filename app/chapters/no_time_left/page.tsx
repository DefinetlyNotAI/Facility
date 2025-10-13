'use client';
import styles from '@/styles/NoTimeLeft.module.css';
import { useSearchParams, useRouter } from 'next/navigation';
import { chapterMessages, chapterStyles } from '@/lib/data/bonus';
import { BACKGROUND_AUDIO, playSafeSFX, SFX_AUDIO, useBackgroundAudio } from '@/lib/data/audio';
import React, { useRef, useEffect } from 'react';
import { cookies, routes } from '@/lib/saveData';
import Cookies from 'js-cookie';
import {usePreloadActStates} from "@/hooks/usePreloadActStates";


// --- Main component ---
export default function NoTimeLeft() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const roman = searchParams.get('chapter')?.toLowerCase() ?? null;
    const audioRef = useRef<HTMLAudioElement>(null);

    // Redirect if global end cookie not set
    useEffect(() => {
        if (!Cookies.get(cookies.end)) {
            router.replace(routes.bonus.locked);
        }
    }, [router]);

    // Initialize background audio
    useBackgroundAudio(audioRef, BACKGROUND_AUDIO.BONUS.NO_TIME);

    // Run all act checks before showing anything
    if (!roman) { return null }
    const ready: boolean = usePreloadActStates(roman);
    // Wait for readiness or invalid roman
    if (!ready || !chapterMessages[roman.toUpperCase()]) { return null }

    // Play error SFX on mount
    useEffect(() => {
        playSafeSFX(audioRef, SFX_AUDIO.ERROR, true);
    }, []);


    return (
        <>
            <audio
                ref={audioRef}
                src={BACKGROUND_AUDIO.BONUS.NO_TIME}
                loop
                preload="auto"
                style={{ display: 'none' }}
            />
            <div className={styles.container}>
                <p className={chapterStyles[roman.toUpperCase()]}>
                    {chapterMessages[roman.toUpperCase()]}
                </p>
            </div>
        </>
    );
}
