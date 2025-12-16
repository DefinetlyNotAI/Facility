import {vesselConstType} from "@/types";

// == File links ==
export const fileLinks = {
    IV: {
        E_TXT: "/static/chapters/IV/E.txt",
        TAS_TXT: "/static/chapters/IV/TAS.txt",
        TREE_TXT: "/static/chapters/IV/TREE.txt",
        plaques: {
            TREE: '/static/chapters/images/tr33.png',
            TAS: '/static/chapters/images/tas.png',
            Entity: '/static/chapters/images/entity.jpeg',
        },
    }
};

// == Chapter IV data ==
export const chapterIV = {
    gifCrossPath: "/static/chapters/images/failCross.gif",
    text: {
        header: '3: Registration',
        subHeader: 'Solve the riddles before time runs out',
        questReminder: "Remember the riddles before it's too late...",
        complete: {
            title: 'REGISTRATIONS COMPLETE',
            message: 'The three have been documented. Their stories are now part of the archive.',
        },
        statuses: {
            pendingLabel: '???',
            solvedLabel: 'SOLVED',
            failedLabel: 'YOU CAUSED THIS',
        },
    },
    chapterIVPlaques: [
        {
            id: 'TREE',
            riddle: 'What speaks, yet knows it\'s not alive? What grows, but cannot die?',
            solvedName: 'TREE',
            solvedCaption: 'TREE was never just a caretaker; it seeded the first fractures that would let the Eldritch touch our world.',
            unsolvedCaption: '52 65 6D 65 6D 62 65 72 20 74 68 65 20 72 69 64 64 6C 65 73 20 62 65 66 6F 72 65',
            failedCaption: '54 4F 4F 20 4C 41 54 45',
            image: fileLinks.IV.plaques.TREE,
        },
        {
            id: 'TAS',
            riddle: 'What bleeds without breath, remembers without pain, and obeys without soul?',
            solvedName: 'TAS',
            solvedCaption: 'You? Or all of you? Not one but all, collective of 5 keys, bound by the 6th to end.',
            unsolvedCaption: '52 65 6D 65 6D 62 65 72 20 74 68 65 20 72 69 64 64 6C 65 73 20 62 65 66 6F 72 65',
            failedCaption: '54 4F 4F 20 4C 41 54 45',
            image: fileLinks.IV.plaques.TAS,
        },
        {
            id: 'Entity',
            riddle: 'What cannot be seen, but sees? What cannot be born, but waits?',
            solvedName: 'Entity',
            solvedCaption: 'A relation to the VESSEL, a future perhaps, where time is but a loop, and existence a question.',
            unsolvedCaption: '52 65 6D 65 6D 62 65 72 20 74 68 65 20 72 69 64 64 6C 65 73 20 62 65 66 6F 72 65',
            failedCaption: '54 4F 4F 20 4C 41 54 45',
            image: fileLinks.IV.plaques.Entity,
        },
    ],
    // Public puzzle metadata (no keywords or answers)
    puzzles: {
        TREE: {
            stages: [
                'Seed Decode - a long nested-encoding dossier to decode',
                'Root Graph - interactively activate roots in the right order',
                'Canopy Riddle Chain - a sequence of chained riddles and micro-chIV'
            ],
            stageData: [
                {
                    stage: 1,
                    title: 'Seed Decode',
                    instruction: 'Decode the dossier:',
                    payload: 'MzggMzUgMzIgMzIgMzUgMzggMzIgMzggMzU=',
                    type: 'payload',
                },
                {
                    stage: 2,
                    title: 'Root Graph',
                    instruction: 'Use the node activation order derived from the dossier to form the key.',
                    payload: '852258285',
                    type: 'sequence',
                },
                {
                    stage: 3,
                    title: 'Canopy Riddle Chain',
                    instruction: 'Solve the chained riddles to reveal the final word.',
                    payload: '',
                    type: 'riddle-chain',
                }
            ]
        },
        // Expanded TAS puzzle to 24 stages with horror-leaning hints and varied mechanics
        TAS: {
            stages: [
                'Fragmented Logs', 'Circuit Pattern', 'Word Assembly', 'Sequence Lock', 'Final Proof'
            ],
            stageData: [
                {
                    stage: 1,
                    title: 'Fragmented Logs',
                    instruction: 'Decode the base64 payload.',
                    payload: 'dG9rZW46ZW50cm9weQ==',
                    type: 'payload',
                },
                {
                    stage: 2,
                    title: 'Circuit Pattern',
                    instruction: 'Length of the word in bin. Toggle switches to match.',
                    payload: '00111',
                    type: 'switches',
                },
                {
                    stage: 3,
                    title: 'Word Assembly',
                    instruction: 'Assemble the word of the day.',
                    payload: 'consensus',
                    type: 'assembly',
                },
                {
                    stage: 4,
                    title: 'Decaying Keypad',
                    instruction: '5 number password. The sequence is based of word of the day: length of this password, vowels in the word, unique-letters in the word, first-letter position in the alphabet, syllables count.',
                    payload: '53633',
                    type: 'numpad',
                },
                {
                    stage: 5,
                    title: 'The Question',
                    instruction: 'What is the word of the day?',
                    payload: '',
                    type: 'wordofday',
                }
            ]
        },
        // Expanded Entity puzzle to 24 stages with psych-horror flavor
        Entity: {
            stages: [
                'Blindwatch Audio', 'Reflection Maze', 'Memory Decay', 'Shadow Typing', 'Breathing Walls',
                'Fragmented Self', 'Time Distortion', 'Whispering Names', 'The Unwatched Door', 'Token Weave',
                'Chronicle Merge', 'Oracle Page', 'Riddle Spire', 'Whisper Log', 'Drift Echo', 'Anomaly Wells',
                'Index Fold', 'Weave Depth', 'Chronicle Vault', 'Oracle Gate', 'Spire Descent', 'Echo Vault',
                'Depth Merge', 'Final Seal'
            ],
            stageData: [
                {
                    stage: 1,
                    title: 'Blindwatch Audio',
                    instruction: 'Transcribe the layered clip. The audio contains a hidden message.',
                    payload: 'bm90ZSB0byB3YXJjaA==',
                    type: 'payload',
                    hint: 'This appears to be base64 encoded. Decode it to reveal the message, then extract the key word.'
                },
                {
                    stage: 2,
                    title: 'Reflection Maze',
                    instruction: 'Traverse the mirrored maze and note token indices (click path).',
                    payload: '',
                    type: 'path'
                },
                {
                    stage: 3,
                    title: 'Memory Decay',
                    instruction: 'Watch the sequence carefully. Each viewing corrupts your memory further. Memorize before it decays completely.',
                    payload: '',
                    type: 'memory-decay'
                },
                {
                    stage: 4,
                    title: 'Shadow Typing',
                    instruction: 'Type the phrase without looking. The screen hides your input. Trust your muscle memory, not your eyes.',
                    payload: '',
                    type: 'shadow-typing'
                },
                {
                    stage: 5,
                    title: 'Breathing Walls',
                    instruction: 'The walls breathe with malevolent life. Match their rhythm or be crushed. Time is running out.',
                    payload: '',
                    type: 'breathing-walls'
                },
                {
                    stage: 6,
                    title: 'Fragmented Self',
                    instruction: 'Your reflection shatters into fragments. Choose the pieces that are truly you before integrity fails.',
                    payload: '',
                    type: 'fragmented-self'
                },
                {
                    stage: 7,
                    title: 'Time Distortion',
                    instruction: 'Reality loops and fractures. Select only the real temporal markers. False moments increase the drift.',
                    payload: '',
                    type: 'time-distortion'
                },
                {
                    stage: 8,
                    title: 'Whispering Names',
                    instruction: 'Many names whisper in the darkness. The volume shifts. Find the true name among the corruption.',
                    payload: '',
                    type: 'whispering-names'
                },
                {
                    stage: 9,
                    title: 'The Unwatched Door',
                    instruction: 'There is a door. It only opens when you are not watching. Let it open fully. Do not look.',
                    payload: '',
                    type: 'unwatched-door'
                },
                {
                    stage: 10,
                    title: 'Token Weave',
                    instruction: 'Weave tokens into index positions to form the proof string.',
                    payload: '',
                    type: 'weave'
                },
                {
                    stage: 7,
                    title: 'Eldritch Foray',
                    instruction: 'A long riddle-chain reveals fragments of the name.',
                    payload: '',
                    type: 'riddle-chain'
                },
                {
                    stage: 8,
                    title: 'Eldritch Drift',
                    instruction: 'Watch drift logs and capture changing prefixes.',
                    payload: '',
                    type: 'payload'
                },
                {
                    stage: 9,
                    title: 'Mirror Index',
                    instruction: 'Use mirror tokens to swap and deduce indices.',
                    payload: '',
                    type: 'payload'
                },
                {
                    stage: 10,
                    title: 'Weave Final',
                    instruction: 'Final weave to consolidate tokens for the proof.',
                    payload: '',
                    type: 'weave'
                },
                {
                    stage: 11,
                    title: 'Chronicle Merge',
                    instruction: 'Merge chronicle fragments by timestamp.',
                    payload: '',
                    type: 'merge'
                },
                {
                    stage: 12,
                    title: 'Oracle Page',
                    instruction: 'Use oracle hints to assemble phrase fragments.',
                    payload: '',
                    type: 'payload'
                },
                {
                    stage: 13,
                    title: 'Riddle Spire',
                    instruction: 'An extended riddle spire - many riddles to climb.',
                    payload: '',
                    type: 'riddle-chain'
                },
                {
                    stage: 14,
                    title: 'Whisper Log',
                    instruction: 'Capture whispers embedded in the log fragments.',
                    payload: '',
                    type: 'payload'
                },
                {
                    stage: 15,
                    title: 'Drift Echo',
                    instruction: 'Collect echoes that shift letters over repetition.',
                    payload: '',
                    type: 'payload'
                },
                {
                    stage: 16,
                    title: 'Anomaly Wells',
                    instruction: 'Harvest anomalies before they sink past recovery.',
                    payload: '',
                    type: 'timed'
                },
                {
                    stage: 17,
                    title: 'Index Fold',
                    instruction: 'Fold indices to compress the proof string.',
                    payload: '',
                    type: 'payload'
                },
                {
                    stage: 18,
                    title: 'Weave Depth',
                    instruction: 'Weave tokens across nested layers to form long key.',
                    payload: '',
                    type: 'weave'
                },
                {
                    stage: 19,
                    title: 'Chronicle Vault',
                    instruction: 'Open vaults to collect corrupt fragments.',
                    payload: '',
                    type: 'payload'
                },
                {
                    stage: 20,
                    title: 'Oracle Gate',
                    instruction: 'Select oracle pages to unlock phrase fragments.',
                    payload: '',
                    type: 'payload'
                },
                {
                    stage: 21,
                    title: 'Spire Descent',
                    instruction: 'Descend the riddle spire and answer deeper riddles.',
                    payload: '',
                    type: 'riddle-chain'
                },
                {
                    stage: 22,
                    title: 'Echo Vault',
                    instruction: 'Assemble echoes into a melody that reveals a token.',
                    payload: '',
                    type: 'payload'
                },
                {
                    stage: 23,
                    title: 'Depth Merge',
                    instruction: 'Merge deep tokens into a final consolidation.',
                    payload: '',
                    type: 'merge'
                },
                {
                    stage: 24,
                    title: 'Final Seal',
                    instruction: 'Submit the exact final phrase as the seal. Screenshot for proof.',
                    payload: '',
                    type: 'final'
                }
            ]
        }
    }
};

// == Entity puzzle data for chapter IV ==
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
