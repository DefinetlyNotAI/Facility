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
                },
                {
                    stage: 2,
                    title: 'Root Graph',
                    instruction: 'Use the node activation order derived from the dossier to form the key.',
                    payload: '852258285',
                },
                {
                    stage: 3,
                    title: 'Canopy Riddle Chain',
                    instruction: 'Solve the chained riddles to reveal the final word.',
                    payload: '',
                }
            ]
        },
        TAS: {
            stages: [
                'Fragmented Logs - reorder and decode log fragments',
                'Circuit Emulation - route signals through constrained panels',
                'Consensus Assembly - answer a long sequence to assemble final keys'
            ],
            hints: [
                [
                    'Stage 1: Timestamps were stripped; sort by logical progression.',
                    'Stage 1: Look for small fixed XOR patterns and base64.'
                ],
                [
                    'Stage 2: Words map to binary patterns used as wiring targets.',
                    'Stage 2: You can reset sub-panels independently.'
                ],
                [
                    'Stage 3: Collect 5 short keys from earlier stages and order them.',
                    'Stage 3: The final phrase uses a separator character from Stage 2.'
                ]
            ],
            stageData: [
                {
                    stage: 1,
                    title: 'Fragmented Logs',
                    instruction: 'Reconstruct and decode the fragments. Data: dG9rZW46ZW50cm9weQ== (base64)',
                    payload: 'dG9rZW46ZW50cm9weQ==',
                },
                {
                    stage: 2,
                    title: 'Circuit Emulation',
                    instruction: '(Stage 2 placeholder) Route the signals to match known patterns.',
                    payload: '',
                },
                {
                    stage: 3,
                    title: 'Consensus Assembly',
                    instruction: '(Stage 3 placeholder) Assemble keys from stages to form the final consensus string.',
                    payload: '',
                }
            ]
        },
        Entity: {
            stages: [
                'Blindwatch Audio - layered audio clips to transcribe',
                'Reflection Maze - visual mirrored maze pathing',
                'Temporal Loop Proof - find anomalies in a long timeline narrative'
            ],
            hints: [
                [
                    'Stage 1: Some clips are reversed or slowed.',
                    'Stage 1: Hidden tones map to character separators.'
                ],
                [
                    'Stage 2: Marked path tiles correspond to tokens used later.',
                    'Stage 2: The maze uses mirrored tiles; treat symmetric tiles as identical.'
                ],
                [
                    'Stage 3: Look for repeated contradictions and timestamp jumps.',
                    'Stage 3: The final answer is assembled from anomaly indices.'
                ]
            ],
            stageData: [
                {
                    stage: 1,
                    title: 'Blindwatch Audio',
                    instruction: 'Transcribe the layered clip. (Simulated) Data: bm90ZSB0byB3YXRjaA== (base64)',
                    payload: 'bm90ZSB0byB3YXRjaA==',
                },
                {
                    stage: 2,
                    title: 'Reflection Maze',
                    instruction: '(Stage 2 placeholder) Traverse the mirrored maze and note token indices.',
                    payload: '',
                },
                {
                    stage: 3,
                    title: 'Temporal Loop Proof',
                    instruction: '(Stage 3 placeholder) Identify timeline anomalies and assemble the proof string.',
                    payload: '',
                }
            ]
        }
    }
};

