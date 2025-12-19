'use client';

import {chapterXData, fileLinks} from "@/lib/client/data/chapters";
import {ChapterTemplate} from "@/components/ChapterTemplate";
import {BACKGROUND_AUDIO, usePlayBackgroundAudio} from "@/audio";
import {useRef} from "react";

export default function ChapterXPage() {
    const audioRef = useRef<HTMLAudioElement>(null);

    usePlayBackgroundAudio(audioRef, BACKGROUND_AUDIO.BONUS.X);
    return (
        <>
            <audio ref={audioRef} src={BACKGROUND_AUDIO.BONUS.X} loop preload="auto" style={{display: 'none'}}/>
            <ChapterTemplate
                chapterId="X"
                chapterData={chapterXData}
                fileLink={fileLinks.X.Narrator}/></>
    );
}
