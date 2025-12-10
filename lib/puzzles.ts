// Shared puzzle utilities: deterministic PRNG and helpers
// Keep pure, deterministic and client-side only.
export function seedFromString(str: string) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619) >>> 0;
    return h;
}

export function mulberry32(a: number) {
    return function () {
        let t = a += 0x6D2B79F5;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
}

export function seededShuffle<T>(arr: T[], seedStr: string) {
    const seed = seedFromString(seedStr || '');
    const rnd = mulberry32(seed);
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(rnd() * (i + 1));
        const tmp = copy[i];
        copy[i] = copy[j];
        copy[j] = tmp;
    }
    return copy;
}

export function seededTokens(base: string[], seedStr: string) {
    const seed = seedFromString(seedStr || '');
    const rnd = mulberry32(seed);
    const copy = base.slice();
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(rnd() * (i + 1));
        const tmp = copy[i];
        copy[i] = copy[j];
        copy[j] = tmp;
    }
    return copy.map((c, i) => `${c}${i}`);
}

