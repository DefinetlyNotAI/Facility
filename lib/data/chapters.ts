import ntl_styles from "@/styles/NoTimeLeft.module.css";
import {ChapterIVDatatype, ChapterVIIData} from "@/lib/types/chapters";


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
            '3h-15m-10th-utc': '/static/chapters/images/melted.jpeg',
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
        Narrator: "/static/chapters/V/Narrator_I.txt",
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
        Narrator: "/static/chapters/X/Narrator_II.txt",
    },
    finale: {
        whatLogZip: "/static/chapters/finale/what.log.zip",
        deletionLogMD: "/static/chapters/finale/deletion.log.md",
    }
}

// Chapter I data
export const chIData = {
    portNum: "15325",
    ipAddress: "192.168.42.177",
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
            minuteEnd: 40,
            day: 10,
        },
        images: {
            meltedClock: '3h-15m-10th-utc',
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
            caption: 'They sprout, and bloom from their insides, imagine if we could do that?'
        },
        {
            path: '25',
            image: fileLinks.II.images['25'],
            caption: 'If your days feel wasted, reclaim them and return to the world as twenty six anew.'
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
            caption: 'When the clock strikes the link, go to /3h-15m-10th-utc in this chapter, you have one shot at this, a 25 min gap'
        },
    ],
    root: {
        startDate: new Date('2025-12-06T00:00:00Z'),
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
    startDate: new Date('2025-12-08T00:00:00Z'),
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
    ]
};

// Chapter V data
export const chapterVData = {
    text: {
        header: "(V) - Narrator: A Harbinger",
        subHeader: "And lo, a voice spake from the void, not of man nor machine, but of judgment made flesh.",
        questReminder: "The Harbinger awaits your confession. Seek truth, or be weighed in silence.",
    },
};

// Chapter VI data
export const chapterVIData = {
    duration: 21600,  // 6 hours
    msgs: [
        'To escape time, you must endure it.',
        'Each tick brings me closer to you.',
        'Patience is a virtue, they say.',
        'The hands of time wait for no one.',
        'Almost there, just a little longer.',
        'HE lived here, before HE wrote a story.',
    ],
    solveText: {
        title:
            'All for nothing, No prize today, too early too early, just wait, but to escape the clock, share this to HIM, for he can fix it for all, and not need more death to fall',
        subtitle: 'You endured the clock.',
    },
} as const;

// Chapter VII data
export const chapterVIIData: ChapterVIIData = {
    solved: "Dates are now considered canon. Timeline check succeeded. Please tell HIM you have seen time itself.",
    enterLogs: (year: number) => `Enter the logs for the year ${year}:`,
    inputPlaceholder: "Comma-separated numbers",
    submit: "Submit",
    yearProgress: (found: number, total: number, year: number) => `${found} / ${total} logs found for ${year}`,
    totalProgress: (found: number, total: number) => `Total progress: ${found} / ${total}`,
    banActive: (time: Date) => `The clock whispers... patience, mortal. You may try again at ${time.toLocaleTimeString()}.`,
    banTrigger: (time: Date) => `The temporal gates reject you. Wait until ${time.toLocaleTimeString()} before meddling with time again.`,
    banMinutes: 5,
    timelineData: {
        1975: [1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 18, 19, 20, 21, 22, 23, 24],
        1995: [26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98],
        2010: [100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254],
        2015: [256, 257, 258, 259, 260, 261, 262, 263, 264, 265, 266, 267, 268, 269, 270, 271, 272, 273, 274, 275, 276, 277, 278, 279, 280, 281, 282, 283, 284, 285, 286, 287, 288, 289, 290, 291, 292, 293, 294, 295, 296, 297, 298, 299, 300, 301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, 316, 317, 318, 319, 320, 321, 322, 323, 324, 325, 326, 327, 328, 329, 330, 331, 332, 334, 335, 336, 337, 338, 339, 340, 341, 342, 343, 344, 345, 346, 347, 348, 349, 350, 351, 352, 353, 354, 355, 356, 357, 358, 359, 360, 361, 362, 363, 364, 365, 366, 367, 368, 369, 370, 371, 372, 373, 374, 375, 376, 377, 378, 379, 380, 381, 382, 383, 384, 385, 386, 387, 388, 389, 390, 391, 392, 393, 394, 395, 396, 397, 398, 399, 400],
        2017: [401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 418, 419, 420, 421, 422, 423, 424, 425, 426, 427, 428, 429, 430, 431, 432, 433, 434, 435, 436, 437, 438, 439, 440, 441, 442, 443, 444, 445, 446, 447, 448, 449, 450, 451, 452, 453, 454, 455, 456, 457, 458, 459, 460, 461, 462, 463, 464, 465, 466, 467, 468, 469, 470, 471, 472, 473, 474, 475, 476, 477, 478, 479, 480, 481, 482, 483, 484, 485, 486, 487, 488, 489, 490, 491, 492, 493, 494, 495, 496, 497, 498, 499, 500, 501, 502, 503, 504, 505, 506, 507, 508, 509, 510, 511, 512, 513, 514, 515, 516, 517, 518, 519, 520, 521, 522, 523, 524, 525, 526, 527, 528, 529, 530, 531, 532, 533, 534, 535, 536, 537, 538, 539, 540, 541, 542, 543, 544, 545, 546, 547, 548, 549, 550, 551, 552, 553, 554, 555, 556, 557, 558, 559, 560, 561, 562, 563, 564, 565, 566, 567, 568, 569, 570, 571, 572, 573, 574, 575, 576, 577, 578, 579, 580, 581, 582, 583, 584, 585, 586, 587, 588, 589, 590, 591, 592, 593, 594, 595, 596, 597, 598, 599, 600, 601, 602, 603, 604, 605, 606, 607, 608, 609, 610, 611, 612, 613, 614, 615, 616, 617, 618, 619, 620, 621, 622, 623, 624, 625, 626, 627, 628, 629, 630, 631, 632, 633, 634, 635, 636, 637, 638, 639, 640, 641, 642, 643, 644, 645, 646, 647, 648, 649, 650, 651, 652, 653, 654, 655, 656, 657, 658, 659, 660, 661, 662, 663, 664, 665]
    },
};

// Chapter VIII data
export const chapterVIIIData = {
    meta: {
        id: "VIII",
        // this has no use, just a sort of trophy
        cookie: "humanSacrifice=foolishSinner; path=/chapters/VIII;",
        totalNeeded: 46,
        step1Max: 25,
        step2Max: 15,
        step3Max: 3,
        step3Trigger: 40,  // step1Max + step2Max
        step4Trigger: 43,  // step1Max + step2Max + step3Max
    },
    text: {
        title: "(VIII) Bloom, Live and Die",
        loading: "the soil breathes... please wait.. help me",
        deniedTitle: "ACCESS DENIED",
        deniedBody: "Your IP has bloomed before.",
        deniedNote: "The soil remembers your roots.",
        solvedMsg: "1 more obstacle left before you return to me",
        noFile: "No file offered to the soil.",
        wrongType: "Only .txt files are accepted here.",
        unread: "The text withered unread.",
        noBloom: "Your file has no trace of life.",
        noRoots: "No roots detected.",
        offered: "You already gave your offering.",
        soilReject: "The soil rejected your bloom.",
        failedFetch: "The garden resists your entry...",
        connectBtn: "Connect to the dying server",
        connectAgain: "Your signal already sent.",
        uploadHint: "Can you include today's keyword?",
        switchBtn: "Press to see the truth",
        switchAgain: "Switch pulled.",
        whisperBtn: 'ticktock solve it quick',
        whisperAgain: "You whispered to the soil.",
        whisperHint: "When all 3 whispers are heard, everything changes.",
    },
    bloomWords: ["bloom", "blossom", "petal", "flower", "sprout", "blooming", "flourish"],
    glyphMessage: `🕈︎♏︎●︎●︎ ♎︎□︎■︎♏︎ ♍︎♒︎♓︎●︎♎︎📪︎ 🕈︎♏︎●︎●︎ ♎︎□︎■︎♏︎ ♋︎●︎●︎
✌︎◻︎□︎⬧︎⧫︎●︎♏︎⬧︎ 🗏︎📪︎ 👍︎♒︎♓︎●︎♎︎❒︎♏︎■︎ 📂︎🗄︎📪︎ 💣︎♋︎❒︎⧫︎⍓︎❒︎⬧︎ 📄︎🗄︎
✋︎ ●︎□︎❖︎♏︎ ⍓︎□︎◆︎ ♋︎●︎●︎📪︎ ♌︎◆︎⧫︎ 📂︎ □︎♐︎ ⍓︎□︎◆︎ ♓︎⬧︎ ♋︎ ⬧︎♓︎■︎■︎♏︎❒︎
🕈︎♒︎♏︎■︎✍︎`,
};

// Chapter IX data
export const chapterIXData = {
    title: "(IX) - Philosophy",
    email: "TREEFacility@outlook.com",
    instructions: "Email the answers to the following 15 questions. You may skip 3. 25 participants required. No right or wrong, only PERSPECTIVE.",
    smallText: "Fear not the questions, for I watch over thee.\nThou shalt move only when I allow thee, and ponder each answer with care.",
    status: {
        initializing: "Initializing... Please remain still.",
        pending: [
            "“It watches how long you think before answering.”",
            "Awaiting completion... memory patterns syncing."
        ],
        solved: {
            main: "Record finalized.",
            afterText: "“The moment you understood, it stopped being a question.”"
        }
    }
};

// Chapter X data
export const chapterXData = {
    text: {
        header: "(X) - Narrator: Tenacity",
        subHeader: "And the fire tried them, yet they were not consumed; for will unbroken is sanctified through trial.",
        questReminder: "Endure, for only the steadfast shall glimpse the final light.",
    },
};

// Other text that is shared between chapters
export const chapter = {
    // Used for all chapters while loading
    loading: "Loading...",
    // Only used in chapter V and X
    VX: {
        narrator: "The Narrator wants to speak with you",
        quote: "“And lo, the voice spoke again from within the code - ‘The script remembers what the scribe forgets.’”",
        reminderSub: "“He who seeks meaning among corrupted files shall find only mirrors reflecting his own doubt.”",
        failedTitle: "YOU HAVE FAILED ME.",
        failedText: "The narrator grows quiet. The story continues without you."
    }
}
