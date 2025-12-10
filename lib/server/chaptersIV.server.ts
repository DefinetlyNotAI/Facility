// Server-only chapter IV secrets and validation helpers
export type PlaqueId = 'TREE' | 'TAS' | 'Entity';

const PUZZLES: Record<PlaqueId, { keyword: string; stageAnswers: string[] }> = {
    TREE: { keyword: 'looped time bearing false tree fruit', stageAnswers: ['deeproot', '5281', 'canopy'] },
    TAS: { keyword: 'your own reflection in the clock\'s glass', stageAnswers: ['entropy', '11001', 'consensus'] },
    Entity: { keyword: 'the void where names dissolve', stageAnswers: ['watch', 'mirror', 'anomaly'] },
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
