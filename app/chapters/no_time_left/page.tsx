'use client';

import styles from '@/styles/NoTimeLeft.module.css';
import { useSearchParams, useRouter } from "next/navigation";
import { chapterMessages, chapterStyles } from "@/lib/data/bonus";
import { BACKGROUND_AUDIO, playSafeSFX, SFX_AUDIO, useBackgroundAudio } from "@/lib/data/audio";
import React, { useEffect, useRef, useState } from "react";
import {bonusApi} from "@/lib/utils";
import {ActionState, BonusAct} from "@/lib/types/api";
import {routes} from "@/lib/saveData";


// No Time Left when chapter failed
// Valid chapters: i, ii, vi, vii, viii, ix
// To use: /no_time_left?chapter=i etc.
// You can also use routes.bonus.noTimeChID('i') to get the route with the correct query param already set
export default function NoTimeLeft() {
    const searchParams = useSearchParams();
    const roman = searchParams.get('chapter');
    const audioRef = useRef<HTMLAudioElement>(null);
    const router = useRouter();
    const [isValid, setIsValid] = useState<boolean | null>(null);

    // Initialize background audio
    useBackgroundAudio(audioRef, BACKGROUND_AUDIO.BONUS.NO_TIME);

    // Play SFX on router change
    useEffect(() => {
        playSafeSFX(audioRef, SFX_AUDIO.ERROR, true);
    }, [router]);

    // Check act status
    useEffect(() => {
        const validRomans = ['i', 'ii', 'vi', 'vii', 'viii', 'ix'];

        if (!roman || !validRomans.includes(roman.toLowerCase())) {
            router.push(routes.notFound);
            return;
        }

        bonusApi.getOne(roman)
            .then(res => {
                const actKey = `Act_${roman.toUpperCase()}` as BonusAct;
                const state = res[actKey];
                if (state === ActionState.NotReleased) {
                    router.push(routes.bonus.notYet);
                } else if (state === ActionState.Succeeded || state === ActionState.Released) {
                    router.push(routes.notFound);
                } else {
                    setIsValid(true);
                }
            })
            .catch(() => {
                router.push(routes.bonus.notYet);
            });
    }, [roman, router]);


    if (!roman || !chapterMessages[roman.toUpperCase()] || isValid === false) return null;

    return (
        <>
            <audio
                ref={audioRef}
                src={BACKGROUND_AUDIO.BONUS.NO_TIME}
                loop={true}
                preload="auto"
                style={{display: "none"}}/>
            <div className={styles.container}>
                <p className={chapterStyles[roman.toUpperCase()]}>
                    {chapterMessages[roman.toUpperCase()]}
                </p>
            </div>
        </>
    );
}
