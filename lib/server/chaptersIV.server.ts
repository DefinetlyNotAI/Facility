// Server-only chapter IV secrets and validation helpers
export type PlaqueId = 'TREE' | 'TAS' | 'Entity';

const PUZZLES: Record<PlaqueId, { keyword: string; stageAnswers: string[] }> = {
    TREE: {keyword: 'looped time bearing false tree fruit', stageAnswers: []},
    TAS: {
        keyword: 'your own reflection in the clock\'s glass',
        stageAnswers: [
            'entropy',      // 0 Fragmented Logs
            '11001',        // 1 Circuit Emulation
            'consensus',    // 2 Consensus Assembly
            '52815',        // 3 Signal Spike
            '10101',        // 4 XOR Grid
            'lead',         // 5 Forensics Riddle
            'consensus-merged', // 6 Consensus Merge
            'drift',        // 7 Entropy Drift
            'mirror9',      // 8 Mirror Panel
            '11100',        // 9 Parity Locks
            'taptap',       // 10 Relay Taps
            'clockwise',    // 11 Clockwork Puzzle
            'merged-final', // 12 Merge Final
            'echohollow',   // 13 Echo Hollow
            'signalgrave',  // 14 Signal Grave
            'tokenscrape',  // 15 Token Scrape
            'threshold',    // 16 Threshold
            'pulserelay',   // 17 Pulse Relay
            'entropyecho',  // 18 Entropy Echo
            'mirrorvault',  // 19 Mirror Vault
            'paritymirror', // 20 Parity Mirror
            'relaydepths',  // 21 Relay Depths
            'clockcleave',  // 22 Clock Cleave
            'finalmerged',  // 23 Final Merged
            'finalproof'    // 24 Final Proof
        ]
    },
    Entity: {
        keyword: 'the void where names dissolve',
        stageAnswers: [
            'watch',        // 0 Blindwatch Audio
            'mirror',       // 1 Reflection Maze
            'jump',         // 2 Temporal Markers
            'anomaly',      // 3 Anomaly Harvest
            'weave',        // 4 Token Weave
            'proof',        // 5 Timeline Proof
            'eldritch',     // 6 Eldritch Foray
            'drift',        // 7 Eldritch Drift
            'mirroridx',    // 8 Mirror Index
            'woven',        // 9 Weave Final
            'chronicle',    // 10 Chronicle Merge
            'oracle',       // 11 Oracle Page
            'spire',        // 12 Riddle Spire
            'whisper',      // 13 Whisper
            'driftecho',    // 14 Drift Echo
            'wells',        // 15 Wells
            'indexfold',    // 16 Index Fold
            'weavedepth',   // 17 Weave Depth
            'vault',        // 18 Vault
            'gate',         // 19 Gate
            'descent',      // 20 Descent
            'echovault',    // 21 Echo Vault
            'depthmerge',   // 22 Depth Merge
            'finalseal'     // 23 Final Seal
        ]
    },
};

export function normalize(input?: unknown) {
    if (typeof input !== 'string') return '';
    return input.trim().toLowerCase();
}

export function validateKeyword(plaqueId: string, provided: string): boolean {
    if (!plaqueId) return false;
    const id = plaqueId as PlaqueId;
    const p = PUZZLES[id];
    if (!p) return false;
    console.log('Validating keyword for', plaqueId, 'provided:', provided, 'expected:', p.keyword);
    return normalize(p.keyword) === normalize(provided);
}

export function validateStageAnswer(plaqueId: string, stageIndex: number, provided: string): boolean {
    const id = plaqueId as PlaqueId;
    const p = PUZZLES[id];
    if (!p) return false;
    const ans = p.stageAnswers?.[stageIndex];
    if (!ans) return false;
    return normalize(ans) === normalize(provided);
}
