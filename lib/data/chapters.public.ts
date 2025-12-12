// Public (client-safe) chapter data - contains only non-secret metadata for Chapter IV
export const fileLinksPublic = {
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

export const chapterIVPublic = {
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
            image: fileLinksPublic.IV.plaques.TREE,
        },
        {
            id: 'TAS',
            riddle: 'What bleeds without breath, remembers without pain, and obeys without soul?',
            solvedName: 'TAS',
            solvedCaption: 'You? Or all of you? Not one but all, collective of 5 keys, bound by the 6th to end.',
            unsolvedCaption: '52 65 6D 65 6D 62 65 72 20 74 68 65 20 72 69 64 64 6C 65 73 20 62 65 66 6F 72 65',
            failedCaption: '54 4F 4F 20 4C 41 54 45',
            image: fileLinksPublic.IV.plaques.TAS,
        },
        {
            id: 'Entity',
            riddle: 'What cannot be seen, but sees? What cannot be born, but waits?',
            solvedName: 'Entity',
            solvedCaption: 'A relation to the VESSEL, a future perhaps, where time is but a loop, and existence a question.',
            unsolvedCaption: '52 65 6D 65 6D 62 65 72 20 74 68 65 20 72 69 64 64 6C 65 73 20 62 65 66 6F 72 65',
            failedCaption: '54 4F 4F 20 4C 41 54 45',
            image: fileLinksPublic.IV.plaques.Entity,
        },
    ],
    // Public puzzle metadata (no keywords or answers)
    puzzles: {
        TREE: {
            stages: [
                'Seed Decode - a long nested-encoding dossier to decode',
                'Root Graph - interactively activate roots in the right order',
                'Canopy Riddle Chain - a sequence of chained riddles and micro-puzzles'
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
                    instruction: 'An extended riddle spire — many riddles to climb.',
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
