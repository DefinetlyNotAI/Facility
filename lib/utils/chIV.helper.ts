// Shared puzzle utilities: deterministic PRNG and helpers
// Keep pure, deterministic and client-side only.
import {FsNode, LogEntry} from "@/lib/types/chapterIV.types";

export function seedFromString(str: string) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619) >>> 0;
    return h;
}

function mulberry32(a: number) {
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

// == Entity puzzle const ==

// Horror messages for each fragment
export const HORROR_MESSAGE_SETS: Record<number, string[]> = {
    1: [
        'something is watching',
        'containment is an illusion',
        'TREE remembers what you did'
    ],
    2: [
        'TAS knows you better than you know yourself',
        'prediction failed but observation continues',
        'you were always going to do that'
    ],
    3: [
        'your pulse is synchronized now',
        'the vessel breathes with you',
        'thump... thump... thump...'
    ],
    4: [
        'betrayal logged in permanent memory',
        'TAS will not forget',
        'some doors should stay closed'
    ],
    5: [
        'vessel integrity compromised',
        'you are becoming something else',
        'the hash was never about security'
    ],
    6: [
        'TR33 LIED and you followed the path anyway',
        'the maze knows where you are',
        'every step was recorded'
    ],
    7: [
        'you are VESSEL now',
        'identity is fluid here',
        'welcome to the other side'
    ]
};

// Random process names for initial processes
export const RANDOM_PROCESS_NAMES = [
    'svchost',
    'explorer',
    'chrome',
    'discord',
    'spotify',
    'steam',
    'winlogon',
    'csrss',
    'lsass',
    'dwm',
    'taskmgr'
];

// TAS prediction commands
export const TAS_PREDICTION_COMMANDS = ['ls', 'ps', 'whoami'];

// Heartbeat window timing
export const HEARTBEAT_WINDOW = {
    MIN: 44,
    MAX: 57
} as const;

// Fragment collection intervals
export const HORROR_TIMING = {
    BASE_INTERVAL: 45000,
    MIN_INTERVAL: 15000,
    REDUCTION_PER_FRAGMENT: 5000
} as const;

// Process timing
export const PROCESS_TIMING = {
    SPAWN_INTERVAL: 6000,
    SPAWN_PROBABILITY: 0.18,
    CPU_SPIKE_DURATION: 2500
} as const;

// Gaslighting probability for 'cd ..'
export const CD_GASLIGHT_PROBABILITY = 0.28;

// Tree metamorphosis constants
export const TREE_CONSTANTS = {
    NEW_PID: 666,
    NEW_NAME: 'TR33.exe',
    CPU_USAGE: 13,
    METAMORPHOSIS_DELAY: 1500
} as const;

// File system structure for the vessel
export const FILE_BUILD: any = {
    name: '/',
    files: ['vessel.bin', 'README.txt'],
    dirs: [
        {
            name: 'etc',
            files: ['passwd', 'shadow', 'hosts'],
            dirs: []
        },
        {
            name: 'logs',
            files: ['system.log', 'tas.log', 'heartbeat.log'],
            dirs: []
        },
        {
            name: 'noise',
            files: [],
            dirs: [
                {name: 'static', files: [], dirs: []},
                {name: 'echo', files: [], dirs: []},
            ]
        },
        {
            name: 'silence',
            files: [],
            dirs: [
                {name: 'void', files: [], dirs: []},
            ]
        },
        {name: 'random0', files: [], dirs: []},
        {name: 'random1', files: [], dirs: []},
        {
            name: 'random2',
            files: [],
            dirs: [
                {name: 'temp', files: [], dirs: []},
                {
                    name: 'tree',
                    files: [],
                    dirs: [
                        {
                            name: 'raven',
                            files: [],
                            dirs: [
                                {
                                    name: 'echo',
                                    files: [],
                                    dirs: [
                                        {
                                            name: 'echo',
                                            files: [],
                                            dirs: [
                                                {
                                                    name: 'lion',
                                                    files: [],
                                                    dirs: [
                                                        {
                                                            name: 'iris',
                                                            files: [],
                                                            dirs: [
                                                                {
                                                                    name: 'edge',
                                                                    files: [],
                                                                    dirs: [
                                                                        {name: 'door', files: [], dirs: []},
                                                                    ]
                                                                },
                                                            ]
                                                        },
                                                    ]
                                                },
                                            ]
                                        },
                                    ]
                                },
                            ]
                        },
                    ]
                },
            ]
        },
    ]
};

// Startup log text
export const STARTUP_TEXT = (sessionId: string | number, pid: string | number): LogEntry[] => [
    {text: `[BOOT] entity-shell online — session ${sessionId}`, color: 'green'},
    {text: `[INFO] TREE.exe present (pid ${pid})`, color: 'yellow'},
    {text: `[HINT] watch the processes; not every child should die`, color: 'gray'}
];


// == Entity puzzle utils ==

// compute fake sha256 hex from input
export async function computeFakeHash(s: string) {
    try {
        if (typeof window !== 'undefined' && (window.crypto as any)?.subtle) {
            const enc = new TextEncoder();
            const buf: ArrayBuffer = (await window.crypto.subtle.digest('SHA-256', enc.encode(s)));
            return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
        }
    } catch (e) {
    }
    // fallback
    let h = 0;
    for (let i = 0; i < s.length; i++) h = ((h << 5) - h) + s.charCodeAt(i);
    return (h >>> 0).toString(16).padStart(64, '0');
}

// traverse fs tree by path
export function getFsNode(root: FsNode | null, path: string): FsNode | null {
    if (!root) return null;
    const parts = path.split('/').filter(Boolean);
    let cur: FsNode = root;
    for (const p of parts) {
        const next = (cur.dirs || []).find((d: FsNode) => d.name === p);
        if (!next) return null;
        cur = next;
    }
    return cur;
}

// check if a file exists in the filesystem
export function fileExists(root: FsNode | null, path: string): boolean {
    if (!root) return false;

    const parts = path.split('/').filter(Boolean);
    if (parts.length === 0) return false;

    const filename = parts[parts.length - 1];
    const dirPath = parts.slice(0, -1).join('/');

    const dirNode: FsNode | null = dirPath ? getFsNode(root, '/' + dirPath) : root;
    if (!dirNode) return false;

    return (dirNode.files || []).includes(filename);
}
