// Server-only chapter IV secrets and validation helpers
export type PlaqueId = 'TREE' | 'TAS' | 'Entity';

export const PUZZLES: Record<PlaqueId, { keyword: string; stageAnswers: string[] }> = {
    TREE: {keyword: 'looped time bearing false tree fruit', stageAnswers: []},
    TAS: {
        keyword: 'your own reflection in the clock\'s glass',
        stageAnswers: [
            'entropy',              // 0 Fragmented Logs - decode base64 "token:entropy"
            '00111',                // 1 Circuit Pattern - "entropy" = 7 letters in binary
            'consensus',            // 2 Word Assembly - 00111 has three 1s
            '53633',                // 3 Numpad - consensus properties
            'consensus',            // 4 The Question - word of the day (from stage 2)
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

// Chapter III server only data (used by API routes and server logic)
export const chapterIIIData = {
    startDate: new Date('2025-12-08T00:00:00Z'),
    clocks: [
        {id: 1, keyword: 'BrokenMe', symbol: '∞', revealDay: 1},
        {id: 2, keyword: 'IntelligentYou', symbol: 'Ω', revealDay: 3},
        {id: 3, keyword: 'NoNameForHim', symbol: '0', revealDay: 6},
    ],
};
