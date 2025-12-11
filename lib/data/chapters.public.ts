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
                'Fragmented Logs', 'Circuit Emulation', 'Consensus Assembly', 'Signal Spike', 'XOR Grid', 'Forensics Riddle', 'Consensus Merge', 'Entropy Drift', 'Mirror Panel', 'Parity Locks', 'Relay Taps', 'Clockwork Puzzle', 'Merge Final', 'Echo Hollow', 'Signal Grave', 'Token Scrape', 'Threshold Locks', 'Pulse Relay', 'Entropy Echo', 'Mirror Vault', 'Parity Mirror', 'Relay Depths', 'Clock Cleave', 'Final Proof'
            ],
            stageData: [
                {
                    stage: 1,
                    title: 'Fragmented Logs',
                    instruction: 'Reconstruct and decode the fragments.',
                    payload: 'dG9rZW46ZW50cm9weQ==',
                    type: 'payload'
                },
                {
                    stage: 2,
                    title: 'Circuit Emulation',
                    instruction: 'Toggle the circuit panel to match the known wiring pattern (submit as bitstring).',
                    payload: '',
                    type: 'switches'
                },
                {
                    stage: 3,
                    title: 'Consensus Assembly',
                    instruction: 'Use parts collected from earlier fragments to assemble a key word.',
                    payload: '',
                    type: 'assembly'
                },
                {
                    stage: 4,
                    title: 'Signal Spike',
                    instruction: 'Activate nodes quickly while avoiding withered roots. Timer active.',
                    payload: '52815',
                    type: 'timed'
                },
                {
                    stage: 5,
                    title: 'XOR Grid',
                    instruction: 'Select tiles whose row parity matches the target pattern.',
                    payload: '',
                    type: 'grid'
                },
                {
                    stage: 6,
                    title: 'Forensics Riddle',
                    instruction: 'Solve the short riddle to reveal the connector key.',
                    payload: '',
                    type: 'riddle'
                },
                {
                    stage: 7,
                    title: 'Consensus Merge',
                    instruction: 'Merge the keys from stages into an ordered phrase; use the circuit separator.',
                    payload: '',
                    type: 'merge'
                },
                {
                    stage: 8,
                    title: 'Entropy Drift',
                    instruction: 'Observe the entropy drift log and extract the token sequence.',
                    payload: '',
                    type: 'payload'
                },
                {
                    stage: 9,
                    title: 'Mirror Panel',
                    instruction: 'Use mirror reflections to deduce hidden digits.',
                    payload: '',
                    type: 'payload'
                },
                {
                    stage: 10,
                    title: 'Parity Locks',
                    instruction: 'Open parity locks by selecting correct combinations.',
                    payload: '',
                    type: 'grid'
                },
                {
                    stage: 11,
                    title: 'Relay Taps',
                    instruction: 'Tap relays in sequence to record micro-keys.',
                    payload: '',
                    type: 'timed'
                },
                {
                    stage: 12,
                    title: 'Clockwork Puzzle',
                    instruction: 'Align clock hands to reveal the long sequence.',
                    payload: '',
                    type: 'payload'
                },
                {
                    stage: 13,
                    title: 'Merge Final',
                    instruction: 'Merge remaining fragments into the final merge payload.',
                    payload: '',
                    type: 'merge'
                },
                {
                    stage: 14,
                    title: 'Echo Hollow',
                    instruction: 'Listen to the hollow echoes and decode the repeated fragment.',
                    payload: 'ZWNoby1ob2xsb3c=',
                    type: 'payload'
                },
                {
                    stage: 15,
                    title: 'Signal Grave',
                    instruction: 'Recover a buried transmission by reconstructing signal offsets.',
                    payload: '',
                    type: 'payload'
                },
                {
                    stage: 16,
                    title: 'Token Scrape',
                    instruction: 'Carefully scrape tokens from the casing without breaking them.',
                    payload: '',
                    type: 'payload'
                },
                {
                    stage: 17,
                    title: 'Threshold Locks',
                    instruction: 'Hold threshold parity to open hidden locks.',
                    payload: '',
                    type: 'grid'
                },
                {
                    stage: 18,
                    title: 'Pulse Relay',
                    instruction: 'Route pulses through relays to extract micro-signatures.',
                    payload: '',
                    type: 'timed'
                },
                {
                    stage: 19,
                    title: 'Entropy Echo',
                    instruction: 'Track entropy changes across minutes to derive a token sequence.',
                    payload: '',
                    type: 'payload'
                },
                {
                    stage: 20,
                    title: 'Mirror Vault',
                    instruction: 'Arrange reflections to reveal a hidden phrase.',
                    payload: '',
                    type: 'payload'
                },
                {
                    stage: 21,
                    title: 'Parity Mirror',
                    instruction: 'Mirror parity patterns across a timed offset.',
                    payload: '',
                    type: 'grid'
                },
                {
                    stage: 22,
                    title: 'Relay Depths',
                    instruction: 'Trace nested relays to find deep keys.',
                    payload: '',
                    type: 'payload'
                },
                {
                    stage: 23,
                    title: 'Clock Cleave',
                    instruction: 'Modify clock faces to bleed digits into a stream.',
                    payload: '',
                    type: 'payload'
                },
                {
                    stage: 24,
                    title: 'Final Proof',
                    instruction: 'A long riddle-chain seals the TAS plaque. Screenshot on completion.',
                    payload: '',
                    type: 'riddle-chain'
                }
            ]
        },
        // Expanded Entity puzzle to 24 stages with psych-horror flavor
        Entity: {
            stages: [
                'Blindwatch Audio', 'Reflection Maze', 'Temporal Markers', 'Anomaly Harvest', 'Token Weave', 'Timeline Proof', 'Eldritch Foray', 'Eldritch Drift', 'Mirror Index', 'Weave Final', 'Chronicle Merge', 'Oracle Page', 'Riddle Spire', 'Whisper Log', 'Drift Echo', 'Anomaly Wells', 'Index Fold', 'Weave Depth', 'Chronicle Vault', 'Oracle Gate', 'Spire Descent', 'Echo Vault', 'Depth Merge', 'Final Seal'
            ],
            stageData: [
                {
                    stage: 1,
                    title: 'Blindwatch Audio',
                    instruction: 'Transcribe the layered clip.',
                    payload: '/static/chapters/IV/payload.mp3',
                    type: 'payload'
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
                    title: 'Temporal Markers',
                    instruction: 'Identify the index of timestamp jumps; submit as a short index string.',
                    payload: '',
                    type: 'payload'
                },
                {
                    stage: 4,
                    title: 'Anomaly Harvest',
                    instruction: 'Collect anomaly tokens before they mutate. Timer active.',
                    payload: '',
                    type: 'timed'
                },
                {
                    stage: 5,
                    title: 'Token Weave',
                    instruction: 'Weave tokens into index positions to form the proof string.',
                    payload: '',
                    type: 'weave'
                },
                {
                    stage: 6,
                    title: 'Timeline Proof',
                    instruction: 'Validate the assembled indices against the timeline anomalies.',
                    payload: '',
                    type: 'validate'
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
