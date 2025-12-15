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

export interface ValidationResponse {
    ok: boolean;
    message?: string;
}

export type LogEntry = { text: string; color?: 'green' | 'yellow' | 'red' | 'cyan' | 'magenta' | 'gray' };

export type FsNode = {
    name?: string;        // optional for root
    dirs?: FsNode[];      // subdirectories
    files?: string[];     // file names
};

export interface Process {
    pid: number,
    name: string,
    status: 'running' | 'stalled' | 'ghost'
}

export type ContainerClassArgs = {
    styles: Record<string, string>;
    glitchActive: boolean;
    fragmentsCollected: number;
};