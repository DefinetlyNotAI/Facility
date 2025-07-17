// Centralized audio configuration for the entire application
// All audio file paths are defined here for easy management and consistency

import React, {useEffect} from "react";

// Background Music
// todo add audio for /windows and sfx
export const BACKGROUND_AUDIO = {
    HOME: "/music/sweethome.mp3",
    BNW: "/music/thethirdcry.mp3",
    BUTTONS: "/music/hopeformehopeforyou.mp3",
    CHOICES: "/music/retrospect.mp3",
    TERMINAL: "/music/thethirdcry.mp3",
    WIFI_PANEL: "/music/isitreallyfine.mp3",
    WIFI_LOGIN: "/music/sweethome.mp3",
    MEDIA: "/music/isitreallyfine.mp3",
    SCROLL: "/music/nowhereissafesowillyouscroll.mp3",
    SCROLL_ESCAPE: "/sfx/█.mp3",
    H0M3: "/music/clockat3.mp3",
    CHEATER: "/music/doangelsexist.mp3",
    ROOT_PAGE: "/music/doangelsexist.mp3",
    THE_END_QUESTION: "/music/thesunwontshine.mp3",
    THE_END_FINAL: "/music/NeverendingNight_DELTARUNE_Chapter_3-4_Soundtrack_Toby_Fox.mp3",
    MOONLIGHT_NORMAL: "/music/contemplation.mp3",
    MOONLIGHT_RED: "/music/doestimeexist.mp3",
    N404: "/music/clockat3.mp3",
    FILE_CONSOLE: "/music/contempt.mp3",
    DREAM: "/music/daisybell.mp3",
} as const;

// Sound Effects
export const SFX_AUDIO = {
    SUCCESS: "/sfx/computeryay.mp3",
    ERROR: "/sfx/computerboo.mp3",
    ALERT: "/sfx/alert.mp3",
    STATIC: "/sfx/static.mp3",
    HORROR: "/sfx/horror.mp3",
    HEARTBEAT: "/sfx/heartbeat.mp3",
    FILE_DELETE: "/sfx/file_delete.m4a",
    CENSORSHIP: "/sfx/censorship.mp3",
    EGG_CRACK: "/sfx/eggcrack.mp3",
    CLOCK3: "/sfx/clockat3.mp3",
} as const;

// Utility function to play audio with error handling
export const playAudio =
    (audioPath: string, options: {
        volume?: number;
        loop?: boolean;
        onError?: (error: Error) => void;
        onSuccess?: () => void;
    } = {}) => {
        try {
            const audio = new Audio(audioPath);
            audio.volume = options.volume ?? 0.6;
            audio.loop = options.loop ?? false;

            audio.play()
                .then(() => options.onSuccess?.())
                .catch((error) => {
                    console.warn(`Failed to play audio: ${audioPath}`, error);
                    options.onError?.(error);
                });

            return audio;
        } catch (error) {
            console.warn(`Failed to create audio: ${audioPath}`, error);
            options.onError?.(error as Error);
            return null;
        }
    };

// Utility function to initialize background audio with user interaction handling
const initializeBackgroundAudio = (
    audioRef: React.RefObject<HTMLAudioElement>,
    _audioPath: string,
    options: {
        volume?: number;
        autoPlay?: boolean;
    } = {}
) => {
    const {volume = 0.3, autoPlay = true} = options;

    return () => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
            if (autoPlay) {
                audioRef.current.play().catch(() => {
                    // Autoplay failed, will try again on user interaction
                    const handleInteraction = () => {
                        if (audioRef.current) {
                            audioRef.current.play().catch(console.warn);
                        }
                        document.removeEventListener('click', handleInteraction);
                        document.removeEventListener('keydown', handleInteraction);
                    };
                    document.addEventListener('click', handleInteraction);
                    document.addEventListener('keydown', handleInteraction);
                });
            }
        }
    };
};

// Utility function to clean up audio
const cleanupAudio = (audioRef: React.RefObject<HTMLAudioElement>) => {
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
    }
};

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
