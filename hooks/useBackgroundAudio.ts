import React, {useEffect} from "react";
import {cleanupAudio, initializeBackgroundAudio} from "@/lib/audio";

// Custom hook to manage background audio with user interaction
// You will need to pass a html audio element reference with both the audioRef and audioSrc for this to work
export function useBackgroundAudio(audioRef: React.RefObject<HTMLAudioElement>, audioSrc: string, conditional: boolean | null | undefined = true) {
    useEffect(() => {
        if (!conditional) {
            cleanupAudio(audioRef);
            return;
        }
        let hasInteracted = false;
        const startAudio = () => {
            if (!hasInteracted) {
                hasInteracted = true;
                const initAudio = initializeBackgroundAudio(audioRef, audioSrc);
                initAudio();
                window.removeEventListener('pointerdown', startAudio);
                window.removeEventListener('keydown', startAudio);
            }
        };
        window.addEventListener('pointerdown', startAudio);
        window.addEventListener('keydown', startAudio);
        return () => {
            window.removeEventListener('pointerdown', startAudio);
            window.removeEventListener('keydown', startAudio);
            cleanupAudio(audioRef);
        };
    }, [audioRef, audioSrc, conditional]);
}
