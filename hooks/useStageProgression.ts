// Stage Progression Hook for Chapter IV Puzzles

import {useCallback, useEffect, useRef, useState} from 'react';
import {getSavedStageIndex, saveStageIndex} from '@/lib/utils/storage';
import type {StageData} from '@/types';

interface UseStageProgressionOptions {
    plaqueId: string;
    stages: StageData[];
}

interface UseStageProgressionReturn {
    stageIndex: number;
    unlockedStage: number;
    completed: boolean;
    setStageIndex: (index: number) => void;
    setCompleted: (completed: boolean) => void;
    advanceTo: (index: number) => void;
}

/**
 * Hook to manage stage progression with localStorage persistence
 */
export function useStageProgression({
                                        plaqueId,
                                        stages,
                                    }: UseStageProgressionOptions): UseStageProgressionReturn {
    const [stageIndex, setStageIndexState] = useState<number>(0);
    const [unlockedStage, setUnlockedStage] = useState<number>(0);
    const [completed, setCompleted] = useState<boolean>(false);

    const isInitialized = useRef(false);

    // Load saved progress on mount
    useEffect(() => {
        if (isInitialized.current) return;
        isInitialized.current = true;

        const saved = getSavedStageIndex(plaqueId, stages.length);
        setStageIndexState(saved.stageIndex);
        setUnlockedStage(saved.unlockedStage);
        setCompleted(saved.isCompleted);
    }, [plaqueId, stages.length]);

    // Persist progress when stageIndex changes
    useEffect(() => {
        if (!isInitialized.current) return;
        saveStageIndex(plaqueId, stageIndex);
    }, [stageIndex, plaqueId]);

    // Clamp stageIndex to unlockedStage
    useEffect(() => {
        if (stageIndex > unlockedStage) {
            setStageIndexState(unlockedStage);
        }
    }, [stageIndex, unlockedStage]);

    /**
     * Advance to a specific stage (unlocking it and all previous stages)
     */
    const advanceTo = useCallback((index: number) => {
        saveStageIndex(plaqueId, index);
        setUnlockedStage(prev => Math.max(prev, index));
        setStageIndexState(index);
    }, [plaqueId]);

    return {
        stageIndex,
        unlockedStage,
        completed,
        setStageIndex: setStageIndexState,
        setCompleted,
        advanceTo,
    };
}

