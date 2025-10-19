import ntl_styles from "@/styles/NoTimeLeft.module.css";
import {ChapterIVDatatype} from "@/lib/types/chapters";


// All texts used in bonus chapters for errors or messages
export const bonusErrorText = {
    lockedBehindDoors: "You stumbled across a door, it seems it needs a key you don't have yet, you feel you need to complete your actual journey before attempting this...",
    notYetChild: "Is this by pure luck? Or is it impulse? Either way, not yet, too early, no light yet, the door is being constructed.. irrespective of your key.",
    noTimeLeft: {
        I_II: "It is too late..",
        VI_VIII: "Time is up... clocks have failed... it is saddening... even after my warning",
        VII: "IT IS NOT CANON",
        IX: "Asked of 25... I needed 25... I asked for 15... I needed 15... Skip 3... but no.. NO.. NONE WERE COMPLETED... 5 of life, 5 of death, 5 of time.. No RIGHT, NO WRONG, ONLY TRUTH... You sinners.."
    }
}

export const chapterStyles: Record<string, string> = {
    I: ntl_styles.textWhite,
    II: ntl_styles.textWhite,
    VI: ntl_styles.textWhite,
    VIII: ntl_styles.textWhite,
    VII: ntl_styles.textRed,
    IX: ntl_styles.textBlood,
};

export const chapterMessages: Record<string, string> = {
    I: bonusErrorText.noTimeLeft.I_II,
    II: bonusErrorText.noTimeLeft.I_II,
    VI: bonusErrorText.noTimeLeft.VI_VIII,
    VIII: bonusErrorText.noTimeLeft.VI_VIII,
    VII: bonusErrorText.noTimeLeft.VII,
    IX: bonusErrorText.noTimeLeft.IX,
};

export const validRomans: string[] = ['i', 'ii', 'iii', "iv", 'v', 'vi', 'vii', 'viii', 'ix', 'x'];

export const validRomansNoTimeLeft: string[] = ['i', 'ii', 'vi', 'vii', 'viii', 'ix'];

export const successQuestNames: string[] = [
    "Connecting...",
    "Empty?",
    "3:Clocks and Hands",
    "3:Registration",
    "Narrator: A Harbinger",
    "He who lives in clocks",
    "The timeline",
    "Bloom, Live and Die",
    "Philosophy",
    "Narrator: Tenacity"
];

export const failQuestNames: string[] = [
    "Timeout",
    "Empty...",
    "Broken Me",
    "Broken You",
    "You’re not that special",
    "No time left",
    "Lost history",
    "All dead",
    "Deranged Nonsense",
    ":("
];

export const rootChapterText = {
    pageTitle: "unbirth • bonus chapters",
    pageSubtitle: "Will HE who sees all be satisfied?",
    unknownLabel: "???",
    loadingLabel: "...",
    failDefault: "Fail",
    actLabel: (roman: string): string => `Act ${roman.toUpperCase()}`.replace("_", " "),
};

// All const/data used for the chapters themselves
export const fileLinks = {
    I: {
        donecAnteDolorEXE: "/static/chapters/I/donec_ante_dolor.exe",
    },
    II: {
        timeShallStrikeEXE: "/static/chapters/II/time_shall_strike.exe",
        images: {
            // Human, robot, and blackness
            '3': '/static/chapters/images/3.png',
            // 15 flowers
            '15': '/static/chapters/images/15.png',
            // 25 graves
            '25': '/static/chapters/images/25.png',
            // A Tree
            'TREE': '/static/chapters/images/tree.png',
            // Darkness
            'VESSEL': '/static/chapters/images/vessel.png',
            // Upside-down black tree
            'TR33': '/static/chapters/images/tr33.png',
            // Clock
            '1033333013': '/static/chapters/images/clock.png',
            // Melted Clock
            '3h-15m-25th-utc': '/static/chapters/images/melted.jpeg',
        },
    },
    IV: {
        E_TXT: "/static/chapters/IV/E.txt",
        TAS_TXT: "/static/chapters/IV/TAS.txt",
        TREE_TXT: "/static/chapters/IV/TREE.txt",
        plaques: {
            // A tree - Same image of the tree can be used
            TREE: '/static/chapters/images/tr33.png',
            // Bot PNG
            TAS: '/static/chapters/images/tas.png',
            // Question mark.. the entity?
            Entity: '/static/chapters/images/entity.jpeg',
        },
    },
    V: {
        NarratorTXT: "/static/chapters/V/Narrator_I.txt",
        lost: {
            cambiumKnotholeMP4: "/static/chapters/V/lost/CambiumKnothole.mp4",
            riddlePNG: "/static/chapters/V/lost/riddle.png",
            fryingAliveWAV: "/static/chapters/V/lost/fryingalive.wav",
        },
        tools: {
            provideMeTheOilEXE: "/static/chapters/V/tools/Provide_Me_The_Oil.exe"
        },
    },
    IX: {
        txt15: "/static/chapters/IX/15.txt"
    },
    X: {
        NarratorTXT: "/static/chapters/X/Narrator_II.txt",
    },
    finale: {
        whatLogZip: "/static/chapters/finale/what.log.zip",
        deletionLogMD: "/static/chapters/finale/deletion.log.md",
    }
}


// Chapter I data
export const chIData = {
    portNum: "7337",
    ipAddress: "192.168.13.37",
    text: {
        connect: "Connect to Server",
        connectHelp: "Connection Help",
        hints: [
            "Find the answers in the first video log",
            "Find the answers in a leaked mail",
            "Then open my doors.. to see more doors"
        ],
        attemptingConn: "Attempting connection...",
        enterCreds: "Enter server credentials to proceed",
        inputs: {
            port: "Port:",
            ip: "IP Address:",
            ipPlaceholder: "Enter IP address",
            portPlaceholder: "Enter port number"
        },
        connectButton: {
            trueState: "Connecting...",
            falseState: "Connect",
        },
        accessHelpTip: "Need access? Email the administrator \"TREEFacility@outlook.com\"",
        completed: {
            title: "CONNECTION ESTABLISHED",
            subtitle: "Access granted. Download the gift to continue your journey.",
            downloadButton: "Download your gift"
        }
    },
    portNumErr: "Port Access Denied - TREE's root has blocked this port",
    ipAddressErr: "IP address connection failed/not accepting handshake protocol. Maybe try a different address?"
}

// Chapter II data
export const chIIData = {
    utcPage: {
        timeWindow: {
            hour: 3,
            minuteStart: 15,
            minuteEnd: 30,
            day: 25,
        },
        images: {
            meltedClock: '3h-15m-25th-utc',
        },
        accessText: {
            title: 'Access Required',
            description: 'A 10-digit number instructed you to come here when the clock strikes me',
            inputPlaceholder: 'Enter password',
            error: 'Incorrect password',
            submit: 'Submit',
        },
        timeWindowText: {
            tooLateEarly: 'TOO LATE OR TOO EARLY',
            message: 'TIME IS NOT REAL HERE',
        },
        successText: {
            emojis: [':)', ':)', ':)'],
            downloadButton: 'Download time itself',
        },
    },
    chapterIIPaths: [
        {path: '3', image: fileLinks.II.images['3'], caption: 'YOU - ME - IT'},
        {
            path: '15',
            image: fileLinks.II.images['15'],
            caption: 'They sprout, and bloom from their insides, imagine we could do that?'
        },
        {
            path: '25',
            image: fileLinks.II.images['25'],
            caption: 'Your life is pathetic... ask for a refund - AND BECOME 26'
        },
        {path: 'TREE', image: fileLinks.II.images['TREE'], caption: 'Ignore the past, find the me with three\'s'},
        {path: 'VESSEL', image: fileLinks.II.images['VESSEL'], caption: 'Curious or plain suicidal'},
        {
            path: 'TR33',
            image: fileLinks.II.images['TR33'],
            caption: '1gN0r3 tH3 fUtuR3, @ URL tH3 nUmB3r$ 0f Th1$ t3xT'
        },
        {
            path: '1033333013',
            image: fileLinks.II.images['1033333013'],
            caption: 'When the clock strikes the link, go to 3h-15m-25th-utc, you have one shot at this, a 15 min gap'
        },
    ],
    root: {
        startDate: new Date('2025-10-15T00:00:00Z'),
        linksCount: 8,
        text: {
            countdown: {
                descriptionLines: [
                    'There are 8 links.',
                    '4 are numbers, 2 are foliage, one is you, and one is time.',
                ],
                note: 'Each page must be screenshotted and sent to me complete to see.',
            },
            complete: {
                title: 'QUEST COMPLETE',
                message: 'You have navigated the paths. The journey continues...',
            },
        },
    }
};

// Chapter III data
export const chapterIIIData = {
    startDate: new Date('2025-10-15T00:00:00Z'),
    text: {
        header: '3: Clocks and Hands',
        failHeader: 'TIME HAS RUN OUT',
        instructions: 'Send keywords to Discord bot: /clock_the_hand {keyword}',
        final: {
            title: 'TIME HAS SPOKEN',
            message: 'The hands have revealed their secrets. Continue forward.',
        },
    },
    clocks: [
        {id: 1, keyword: 'Broken', symbol: '∞', revealDay: 1},
        {id: 2, keyword: 'Intelligent', symbol: 'Ω', revealDay: 3},
        {id: 3, keyword: 'NoName', symbol: '0', revealDay: 5},
    ]
};

// Chapter IV data
export const chapterIVData: ChapterIVDatatype = {
    gifCrossPath: "/static/chapters/images/failCross.gif",
    plaqueStatus: [
        {id: 'TREE', status: 'pending'},
        {id: 'TAS', status: 'pending'},
        {id: 'Entity', status: 'pending'},
    ],
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
            solvedCaption: 'TREE was never just a caretaker; it deliberately seeded the first fractures that would let the Eldritch touch our world.',
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
    ]
};

export const chapter = {
    loading: 'Loading...',
}
// todo, add audios/sfx, then testing
