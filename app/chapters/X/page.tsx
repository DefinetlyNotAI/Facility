'use client';

import {chapterXData, fileLinks} from "@/lib/data/chapters/chapters";
import ChapterTemplate from "@/components/ChapterTemplate";
import {BACKGROUND_AUDIO, useBackgroundAudio} from "@/lib/data/audio";
import {useRef} from "react";

export default function ChapterXPage() {
    const audioRef = useRef<HTMLAudioElement>(null);

    useBackgroundAudio(audioRef, BACKGROUND_AUDIO.BONUS.X);
    return (
        <>
            <audio ref={audioRef} src={BACKGROUND_AUDIO.BONUS.X} loop preload="auto" style={{display: 'none'}}/>
            <ChapterTemplate
                chapterId="X"
                chapterData={chapterXData}
                fileLink={fileLinks.X.Narrator}/></>
    );
}
