'use client';

import {chapterVData, fileLinksVX} from "@/lib/client/data/chapters/V&X";
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
                fileLink={fileLinksVX.V.Narrator}/></>
    );
}
