// Chapter IV Types fir hooks
export type PlaqueId = 'TREE' | 'TAS' | 'Entity';

type StageType =
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

// Other types used in code
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

// Ch IV Const arg (text)
type StartupTextArgs = {
    sessionId: string | number;
    pid: string | number;
};

export interface vesselConstType {
    horrorMessageSets: Record<number, string[]>;
    randomProcessNames: string[];
    tasPredictionCommands: string[];

    heartbeatWindow: {
        min: number;
        max: number;
    };

    horrorTiming: {
        baseInterval: number;
        minInterval: number;
        reductionPerFragment: number;
    };

    processTiming: {
        spawnInterval: number;
        spawnProbability: number;
        cpuSpikeDuration: number;
    };

    cdGaslightProbability: number;

    treeConstants: {
        newPid: number;
        newName: string;
        cpuUsage: number;
        metamorphosisDelay: number;
    };

    fileBuild: FsNode;

    startupText: (args: StartupTextArgs) => LogEntry[];
}
