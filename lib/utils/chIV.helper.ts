// Shared puzzle utilities: deterministic PRNG and helpers
// Keep pure, deterministic and client-side only.
import {ContainerClassArgs, FragmentsMap, FsNode, vesselConstType} from "@/lib/types/chapterIV.types";

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
const helpCommands = ((): string[] => {
    const wrap = (text: string) => `<${text}>`;
    const commands: [string, string][] = [
        ['ps | tasklist', 'list processes'],
        ['top', 'show top CPU consumers'],
        [`pidof ${wrap('name')}`, 'find PID by process name'],
        [`inspect ${wrap('pid')}`, 'inspect a process (spikes CPU)'],
        [`kill ${wrap('pid')}`, 'terminate a process (careful)'],
        ['ls | tree', 'list directories'],
        [`cd ${wrap('dir')} | cd ..`, 'change directory (watch for tricks)'],
        ['cd /', 'return to root'],
        ['pwd', 'show current path'],
        [`cat ${wrap('file')}`, 'show file contents (try logs/tas.log)'],
        [`sha256sum ${wrap('file')}`, 'compute hash (timing matters)'],
        ['capture heartbeat', 'capture pulse timing'],
        ['capture log', 'capture a whispered token'],
        ['whoami | id', 'who are you currently'],
        ['last', 'show recent logins'],
        [`su | login ${wrap('user')}`, 'attempt to assume an identity'],
        [`echo ${wrap('text')}`, 'print text (affected by echo_toggle/map_echo)'],
        ['echo_toggle', 'toggle output hijack'],
        [`map_echo ${wrap('from')} ${wrap('to')}`, 'set substitution for echoed output'],
        ['clear | cls', 'clear terminal (resets flavor text)']
    ];
    const maxLen = Math.max(...commands.map(c => c[0].length));
    return commands.map(([cmd, desc]) => `  ${cmd.padEnd(maxLen, ' ')}  - ${desc}`);
})();

export const entityConst: vesselConstType = {
    horrorMessageSets: {
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
    },

    randomProcessNames: [
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
    ],

    tasPredictionCommands: ['ls', 'ps', 'whoami'],

    heartbeatWindow: {
        min: 44,
        max: 57,
        interval: 80,
        maxPhase: 100
    },

    horrorTiming: {
        baseInterval: 45000,
        minInterval: 15000,
        reductionPerFragment: 5000
    },

    processTiming: {
        spawnInterval: 6000,
        spawnProbability: 0.18,
        cpuSpikeDuration: 2500
    },

    cdGaslightProbability: 0.28,

    treeConstants: {
        newPid: 666,
        newName: 'TR33.exe',
        cpuUsage: 13,
        metamorphosisDelay: 1500
    },

    fileBuild: {
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
                    {name: 'echo', files: [], dirs: []}
                ]
            },
            {
                name: 'silence',
                files: [],
                dirs: [
                    {name: 'void', files: [], dirs: []}
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
                                                                            {name: 'door', files: [], dirs: []}
                                                                        ]
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },

    startupText: ({sessionId, pid}) => [
        {text: `[BOOT] entity-shell online - session ${sessionId}`, color: 'green'},
        {text: `[INFO] TREE.exe present (pid ${pid})`, color: 'yellow'},
        {text: `[HINT] watch the processes; not every child should die`, color: 'gray'}
    ],

    messages: {
        // Process messages
        newProcessSpawn: '[PROC] a new child process appears',

        // Fragment collection
        allFragmentsCollected: 'ALL FRAGMENTS COLLECTED',
        vesselSyncComplete: 'VESSEL SYNCHRONIZATION COMPLETE',
        initializingTransfer: 'INITIALIZING TRANSFER...',
        fragmentSaved: (i: number, v: string) => `[FRAG] fragment ${i} saved: ${v}`,

        // Horror/Corruption messages
        memoryCorruption: '█▓▒░ MEMORY CORRUPTION DETECTED ░▒▓█',
        glitchText: 'Y̷̢̨͉̻̱̰̓̀͌̊̉̔͜Ơ̶̢̱̰̥̟͙̽̽͗́̚͠U̴̢͉̺̭̙̇̓̐̔͗͘ ̷̛̛̰̥̦͍̲̜̈́̈̑͊̚A̵̢̛̫̮̲̤̋̓̈́̈́͘͜R̷̢̛̰̙̫̙͙̋̀̐̆̾E̷̜̙̜̲͔̱̎̓͗͘͠͝ ̸̧̛̰̙̫̥̰̑̓̀̑̕Ń̵̨̻̙̮̜͙̀̈̊̿̚Ơ̷̢̻̱̰̜̙̑̀̈́͘͝T̸̨̛̰̙̫̰̋̈̑̚͜͝ ̸̧̛̰͓̙̜̹̔̓̈́͘͠A̵̧̛̰̙̫̹̍̐̈́͘͜L̸̢̛̰̙̮̜̦̀̓͐͘͝O̵̢̧̰̙̦̜̾̈̑̾͝͠N̴̨̛̰͓̜̞̈̓̾̕͠Ḛ̷̢̛̙̫͓̊̑̊͘̚',
        terminalLocked: '[SEC] terminal locked - no input accepted',

        // System messages
        monitoringProcess: '[SYS] Monitoring process activity...',
        listingProcesses: '[SYS] Listing active processes...',
        terminatingProcess: '[SYS] Terminating process...',
        readingDirectory: '[FS] Reading directory structure...',
        loadingCommandRef: '[SYS] Loading command reference...',
        outputFilterModified: '[SYS] Output filter modified',
        charSubstitutionConfigured: '[SYS] Character substitution configured',
        computingChecksum: '[SYS] Computing checksum... (timing is critical)',
        monitoringCardiac: '[SYS] Monitoring cardiac rhythm...',
        extractingTokens: '[SYS] Extracting log tokens...',
        queryingIdentity: '[SYS] Querying identity registers...',
        readingLoginHistory: '[SYS] Reading login history...',
        identityTransition: '[AUTH] Identity transition in progress...',
        loadingMemoryTraces: '[TAS] Loading archived memory traces...',
        accessingSystemLogs: '[SYS] Accessing system logs...',
        readingHeartbeatLogs: '[SYS] Reading heartbeat logs...',
        sortingByCpu: '[SYS] Sorting by CPU usage...',

        // Warning messages
        treeAnomalousBehavior: '[WARN] TREE.exe exhibits anomalous behavior when observed',
        criticalProcessTermination: '[WARN] Critical process termination detected',
        spatialLogicError: '[WARN] Spatial logic error detected',

        // Alert messages
        terminalHardLocked: '[ALERT] TERMINAL HARD-LOCKED',
        treeMetamorphosis: '[ALERT] TREE.exe metamorphosis detected...',

        // Puzzle success messages
        onlyTreeRemains: '[PUZZLE] only TREE.exe remains - containment intact',
        foundTruthPath: '[PUZZLE] you found the path that spells the truth',
        foundTreeliedPath: '[PUZZLE] you found a path that reads TREELIED',

        // TAS messages
        tasPredictionFailed: '[TAS] prediction failed - TAS reacting...',
        tasActionMatched: '[TAS] your action matched prediction',
        tasBeginLog: '[TAS] // begin log',
        tasEndLog: '[TAS] end log',
        tasRememberPlaque: '[TAS] I remember when you opened the plaque.',
        tasRememberDialogs: '[TAS] I remember dialogs across pages...',
        tasPredictedNext: (cmds: string[]) => `[TAS] predicted next: ${cmds.join(', ')}`,
        tasWhyWouldYou: '[TAS] ... why would you do that? your best friend??',
        tasAuthBypass: '[TAS] Authorization bypass detected...',

        // Process-related
        processRenamed: (name: string, pid: number) => `[SYS] Process renamed: ${name} [PID ${pid}]`,
        killAttemptContainmentFailure: (name: string) => `[SEC] attempt to kill ${name} - containment failure`,

        // Command errors
        inspectMissingPid: 'inspect: missing pid',
        inspectPidNotFound: (pid: number) => `inspect: pid ${pid} not found`,
        inspectSpike: (name: string, pid: number) => `inspect: process ${name} @${pid} - CPU spike observed`,
        killMissingPid: 'kill: missing pid',
        killPidNotFound: (pid: number) => `kill: pid ${pid} not found`,
        killedProcess: (pid: number, name: string) => `killed ${pid} (${name})`,
        catMissingFile: 'cat: missing file argument',
        catNoSuchFile: (file: string) => `cat: ${file}: No such file`,
        catBinaryFile: 'cat: vessel.bin: binary file (use sha256sum instead)',
        catEmptyFile: (file: string) => `cat: ${file}: (empty file)`,
        catPermissionDenied: 'cat: /etc/shadow: Permission denied',
        lsPathError: 'ls: path error',
        lsContentsOf: (path: string) => `Contents of ${path}:`,
        lsEmpty: '  (empty)',
        cdRoot: 'cd: /',
        cdAtRoot: 'cd: at root',
        cdDisoriented: (path: string) => `cd: you feel disoriented -> ${path}`,
        cdPathInvalid: 'cd: current path invalid',
        cdNoSuchDirectory: (dir: string) => `cd: ${dir}: No such directory`,
        cdChangedTo: (path: string) => `cd: ${path}`,
        sha256MissingFile: 'sha256sum: missing file argument',
        sha256NoSuchFile: (file: string) => `sha256sum: ${file}: No such file`,
        sha256NoHashAvailable: (file: string) => `sha256sum: ${file}: (no hash available for this file)`,
        sha256Hash: (hash: string, file: string) => `${hash}  ${file}`,
        vesselIntegrityOk: 'Vessel integrity: OK',
        vesselIntegrityMismatch: 'Vessel integrity: MISMATCH',
        captureUnknownTarget: 'capture: unknown target (try heartbeat or log)',
        whoamiResult: (identity: string) => `you are: ${identity}`,
        lastLogin: 'VESSEL tty0 2075-03-19 02:11',
        lastEllipsis: '...',
        suAssumeVessel: 'You assume the VESSEL identity. The logs quiet for a moment.',
        suUserChangeFailed: 'user change failed: unknown identity',
        secretUnlock: 'A secret unlock whispers open',
        commandNotFound: (cmd: string) => `${cmd}: command not found`,
        pulseCaptured: 'pulse captured',
        pulseMisaligned: 'pulse misaligned',
        capturedToken: (token: string) => `captured token: ${token}`,
        echoHijackStatus: (enabled: boolean) => `echo: hijack ${enabled ? 'enabled' : 'disabled'}`,
        mapEchoRequiresTwoArgs: 'map_echo: requires two args (from to)',
        mapEchoSet: (from: string, to: string) => `echo map set: ${from} -> ${to}`,
        pidofMissingName: 'pidof: missing process name',
        pidofNoMatch: (name: string) => `pidof: no process found matching "${name}"`,
        terminalCleared: '[Terminal cleared]',

        // File contents
        readmeTitle: '=== ENTITY SHELL README ===',
        readmeContent: [
            'This system is part of Project VESSEL.',
            'Not all commands work as expected.',
            'Type "help" for command list.',
            'Watch the processes carefully.'
        ],
        passwdEntries: [
            'root:x:0:0:root:/root:/bin/bash',
            'operator:x:1000:1000::/home/operator:/bin/bash',
            'VESSEL:x:9999:9999:entity:/nowhere:/bin/entity-shell'
        ],
        hostsEntries: [
            '127.0.0.1 localhost',
            '0.0.0.0 VESSEL.local',
            '192.168.1.33 TR33.internal'
        ],
        systemLogEntries: [
            '[LOG] 2024-03-15: Project VESSEL initialization',
            '[LOG] 2024-03-16: First successful consciousness transfer',
            '[LOG] 2024-03-17: Anomaly detected in substrate layer',
            '[LOG] 2024-03-18: TR33.exe containment protocol active'
        ],
        heartbeatLogEntries: [
            '[HB] 00:42:13 - pulse detected - 72 BPM',
            '[HB] 00:42:14 - synchronization attempt',
            '[HB] 00:42:15 - vessel resonance achieved'
        ],

        // Help text
        helpHeader: 'help: available commands (brief):',
        helpCommands: helpCommands,

        // UI text
        headerTitle: 'entity-shell // access: uncanny',
        sessionPrefix: 'session ',
        sidebarProcesses: 'processes',
        sidebarFragments: 'fragments',
        fragmentPlaceholder: '---',
        tips: 'tips: discover commands; the system will not hold your hand.',
        inputPlaceholder: 'type a command',
        runButton: 'RUN',
        liveStreamInfo: (count: number) => `live stream • ${count} lines`,
        backLink: 'back to chapter IV',

        // Special paths
        secretDoorPath: '/random2/tree/raven/echo/echo/lion/iris/edge/door'
    }
};

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

// UI render
export const getContainerClasses = ({
                                        styles, glitchActive, fragmentsCollected
                                    }: ContainerClassArgs): string => {
    const classes: string[] = [styles.container];

    if (glitchActive) classes.push(styles.glitchActive);
    if (fragmentsCollected >= 3) classes.push(styles.corruption3);
    if (fragmentsCollected >= 5) classes.push(styles.corruption5);
    if (fragmentsCollected >= 7) classes.push(styles.corruption7);

    return classes.join(' ');
};

// Serializer and Deserializer function for useLocalStorageState hook
export const serializeFragments = (value: FragmentsMap) => JSON.stringify({fragments: value});
export const deserializeFragments = (raw: string): FragmentsMap => {
    try {
        const data = JSON.parse(raw);
        return data.fragments || {};
    } catch {
        return {};
    }
};
