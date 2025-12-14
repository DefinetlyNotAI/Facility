'use client';

import {chapterVData, fileLinks} from "@/lib/data/noBundle/chapters";
import ChapterTemplate from "@/components/ChapterTemplate";
import {BACKGROUND_AUDIO, useBackgroundAudio} from "@/lib/data/audio";
import {useRef} from "react";

export default function ChapterVPage() {
    const audioRef = useRef<HTMLAudioElement>(null);

    useBackgroundAudio(audioRef, BACKGROUND_AUDIO.BONUS.V);
    return (
        <>
            <audio ref={audioRef} src={BACKGROUND_AUDIO.BONUS.V} loop preload="auto" style={{display: 'none'}}/>
            <ChapterTemplate
                chapterId="V"
                chapterData={chapterVData}
                fileLink={fileLinks.V.Narrator}/></>
    );
}
