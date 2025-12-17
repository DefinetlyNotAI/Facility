'use client';

import {chapterVData, fileLinks} from "@/lib/data/chapters/chapters";
import {ChapterTemplate} from "@/components/ChapterTemplate";
import {BACKGROUND_AUDIO, usePlayBackgroundAudio} from "@/audio";
import {useRef} from "react";

export default function ChapterVPage() {
    const audioRef = useRef<HTMLAudioElement>(null);

    usePlayBackgroundAudio(audioRef, BACKGROUND_AUDIO.BONUS.V);
    return (
        <>
            <audio ref={audioRef} src={BACKGROUND_AUDIO.BONUS.V} loop preload="auto" style={{display: 'none'}}/>
            <ChapterTemplate
                chapterId="V"
                chapterData={chapterVData}
                fileLink={fileLinks.V.Narrator}/></>
    );
}
