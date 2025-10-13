'use client';
import styles from '@/styles/NoTimeLeft.module.css';
import { useSearchParams, useRouter } from 'next/navigation';
import { chapterMessages, chapterStyles } from '@/lib/data/bonus';
import { BACKGROUND_AUDIO, playSafeSFX, SFX_AUDIO, useBackgroundAudio } from '@/lib/data/audio';
import React, { useRef, useEffect } from 'react';
import { useCheckActStatus } from '@/hooks/useCheckActStatus';
import { bonusApi } from "@/lib/utils";
import { ActionState, BonusAct } from "@/lib/types/api";
import {cookies, routes} from "@/lib/saveData";
import Cookies from "js-cookie";


// No Time Left when chapter failed
// Valid chapters: i, ii, vi, vii, viii, ix
// To use: /no_time_left?chapter=i etc.
// You can also use routes.bonus.noTimeChID('i') to get the route with the correct query param already set
export default function NoTimeLeft() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const roman = searchParams.get('chapter');
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (!Cookies.get(cookies.end)) {
            router.replace(routes.bonus.locked);
        }
    }, [router]);

    // Initialize background audio
    useBackgroundAudio(audioRef, BACKGROUND_AUDIO.BONUS.NO_TIME);

    // Hook handles act validity
    const isValid = useCheckActStatus(roman);

    // Redirect if act is invalid or not found
    useEffect(() => {
        if (!roman || !chapterMessages[roman.toUpperCase()] || isValid === false) {
            router.push(routes.notFound);
            return;
        }

        // Check act state from API
        bonusApi.getOne(roman!).then(res => {
            const actKey = `Act_${roman!.toUpperCase()}` as BonusAct;
            const state = res[actKey];
            if (state === ActionState.Succeeded || state === ActionState.Released) {
                router.push(routes.notFound);
            }
        });
    }, [roman, isValid, router]);

    // Play SFX on mount
    useEffect(() => {
        playSafeSFX(audioRef, SFX_AUDIO.ERROR, true);
    }, []);

    // Render content only if valid
    if (!roman || !chapterMessages[roman.toUpperCase()] || isValid === false) {
        return null;
    }

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
