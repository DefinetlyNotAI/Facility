// Stage Validation Hook for Chapter IV Puzzles

import React, {useCallback, useRef} from 'react';
import {routes} from '@/lib/saveData';
import {playSafeSFX, SFX_AUDIO} from '@/lib/audio';
import type {PlaqueId, ValidationResponse} from '@/types';

interface UseStageValidationOptions {
    plaqueId: PlaqueId;
    audioRef: React.RefObject<HTMLAudioElement>;
}

interface UseStageValidationReturn {
    validateStage: (
        stageIndex: number,
        provided: string,
        onSuccess: () => void,
        onFailure: (message: string) => void
    ) => Promise<void>;
    isValidating: boolean;
}

/**
 * Hook to handle stage answer validation with audio feedback
 */
export function useStageValidation({
                                       plaqueId,
                                       audioRef,
                                   }: UseStageValidationOptions): UseStageValidationReturn {
    const isValidatingRef = useRef(false);

    const validateStage = useCallback(
        async (
            stageIndex: number,
            provided: string,
            onSuccess: () => void,
            onFailure: (message: string) => void
        ) => {
            if (isValidatingRef.current) return;
            isValidatingRef.current = true;

            try {
                const res = await fetch(routes.api.chapters.IV.validateStage, {
                    method: 'POST',
                    body: JSON.stringify({plaqueId, stageIndex, provided}),
                });

                const json: ValidationResponse = await res.json();

                if (json?.ok) {
                    try {
                        playSafeSFX(audioRef, SFX_AUDIO.SUCCESS, false);
                    } catch (e) {
                        console.warn('Failed to play success SFX:', e);
                    }
                    onSuccess();
                } else {
                    try {
                        playSafeSFX(audioRef, SFX_AUDIO.ERROR, false);
                    } catch (e) {
                        console.warn('Failed to play error SFX:', e);
                    }
                    onFailure(json?.message || 'Incorrect answer');
                }
            } catch (e) {
                try {
                    playSafeSFX(audioRef, SFX_AUDIO.ERROR, false);
                } catch (err) {
                    console.warn('Failed to play error SFX:', err);
                }
                onFailure('Server error');
            } finally {
                isValidatingRef.current = false;
            }
        },
        [plaqueId, audioRef]
    );

    return {
        validateStage,
        isValidating: isValidatingRef.current,
    };
}

