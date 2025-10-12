'use client';

import styles from '@/styles/NoTimeLeft.module.css';
import { useSearchParams, useRouter } from "next/navigation";
import { chapterMessages, chapterStyles } from "@/lib/data/bonus";
import { BACKGROUND_AUDIO, playSafeSFX, SFX_AUDIO, useBackgroundAudio } from "@/lib/data/audio";
import { useEffect, useRef, useState } from "react";
import {bonusApi} from "@/lib/utils";
import {ActionState, BonusAct} from "@/lib/types/api";

export default function NoTimeLeft() {
    const searchParams = useSearchParams();
    const chapterId = searchParams.get('chapter')?.toUpperCase();
    const audioRef = useRef<HTMLAudioElement>(null);
    const router = useRouter();
    const [isValid, setIsValid] = useState<boolean | null>(null);

    // Initialize background audio
    useBackgroundAudio(audioRef, BACKGROUND_AUDIO.N404);

    // Play SFX on router change
    useEffect(() => {
        playSafeSFX(audioRef, SFX_AUDIO.ERROR, true);
    }, [router]);

    // Check act status
    useEffect(() => {
        if (!chapterId) return;

        bonusApi.getOne(chapterId as BonusAct)
            .then(res => {
                const state = res[chapterId as BonusAct]; // <--- get the state of the specific act
                if (state === ActionState.NotReleased) {
                    router.push("/bonus/not_yet_child");
                } else {
                    setIsValid(true);
                }
            })
            .catch(() => {
                router.push("/bonus/not_yet_child");
            });
    }, [chapterId, router]);


    if (!chapterId || !chapterMessages[chapterId] || isValid === false) return null;

    return (
        <div className={styles.container}>
            <p className={chapterStyles[chapterId]}>
                {chapterMessages[chapterId]}
            </p>
        </div>
    );
}

// TODO - Add the db bonusApi.getAll to the /smileking page, and add toggle via bonusApi.changeToOpp to unlock the chapters as I will
