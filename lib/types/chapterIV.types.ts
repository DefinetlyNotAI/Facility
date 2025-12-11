// Chapter IV Types

export type PlaqueId = 'TREE' | 'TAS' | 'Entity';

export type StageType =
    | 'payload'
    | 'switches'
    | 'assembly'
    | 'timed'
    | 'grid'
    | 'riddle'
    | 'riddle-chain'
    | 'path'
    | 'weave'
    | 'validate'
    | 'merge'
    | 'final';

export interface StageData {
    stage: number;
    title: string;
    instruction: string;
    payload?: string;
    type: StageType;
    answer?: string;
    hint?: string;
}

export interface PuzzleData {
    stages: string[];
    stageData: StageData[];
}

export interface StageResults {
    [stageIndex: number]: string;
}

export interface PlaqueProgress {
    [plaqueId: string]: number; // 0=not started, 1=keyword entered, 2=started, 3=completed
}

export interface RiddleData {
    p: string; // prompt
    a: string; // answer
}

export interface ValidationResponse {
    ok: boolean;
    message?: string;
}

