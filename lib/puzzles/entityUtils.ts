// Utility functions for the Entity puzzle — kept pure for testing
export const SYMBOLS = ['◆', '◇', '◈', '◉', '○', '●', '△', '▽'];

export function makeMemorySequence(length: number, symbols = SYMBOLS) {
    const seq: string[] = [];
    for (let i = 0; i < length; i++) {
        seq.push(symbols[Math.floor(Math.random() * symbols.length)]);
    }
    return seq;
}

export function isMemoryCorrect(input: string, sequence: string[]) {
    return input === sequence.join('');
}

export function clamp(v: number, min = 0, max = 100) {
    return Math.max(min, Math.min(max, v));
}

export function selectTimeMarkerEffects(markerReal: boolean, temporalDrift: number) {
    if (!markerReal) {
        return clamp(temporalDrift + 10, 0, 100);
    }
    return temporalDrift;
}

export function nameConfidenceDelta(selectedIsTrue: boolean, previousConfidence: number) {
    return clamp(previousConfidence + (selectedIsTrue ? 25 : -10), 0, 100);
}

