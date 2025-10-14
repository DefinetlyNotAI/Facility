import ntl_styles from "@/styles/NoTimeLeft.module.css";


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

export const CHAPTER_TEXT = {
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
        // todo get these images
        images: {
            '3': '/static/chapters/II/images/3.jpg',
            '15': '/static/chapters/II/images/15.jpg',
            '25': '/static/chapters/II/images/25.jpg',
            'TREE': '/static/chapters/II/images/tree.jpg',
            'VESSEL': '/static/chapters/II/images/vessel.jpg',
            'TR33': '/static/chapters/II/images/tr33.jpg',
            '1033333013': '/static/chapters/II/images/clock.jpg',
        },
    },
    IV: {
        E_TXT: "/static/chapters/IV/E.txt",
        TAS_TXT: "/static/chapters/IV/TAS.txt",
        TREE_TXT: "/static/chapters/IV/TREE.txt",
        plaques: {
            // todo get these images
            TREE: '/static/chapters/IV/images/tree.jpg',
            TAS: '/static/chapters/IV/images/tas.jpg',
            Entity: '/static/chapters/IV/images/entity.jpg',
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

// Chapter II paths
export const chapterIIPaths = [
    { path: '3', image: fileLinks.II.images['3'], caption: 'YOU - ME - IT' },
    { path: '15', image: fileLinks.II.images['15'], caption: 'They sprout, and bloom from their insides, imagine we could do that?' },
    { path: '25', image: fileLinks.II.images['25'], caption: 'Your life is pathetic... ask for a refund - AND BECOME 26' },
    { path: 'TREE', image: fileLinks.II.images['TREE'], caption: 'Ignore the past, find the me with three\'s' },
    { path: 'VESSEL', image: fileLinks.II.images['VESSEL'], caption: 'Curious or plain suicidal' },
    { path: 'TR33', image: fileLinks.II.images['TR33'], caption: '1gN0r3 tH3 fUtuR3, @ URL tH3 nUmB3r$ 0f Th1$ t3xT' },
    { path: '1033333013', image: fileLinks.II.images['1033333013'], caption: 'When the clock strikes the link, go to 3h-15m-25th-utc, you have one shot at this, a 15 min gap' },
];

// Chapter III clocks
export const chapterIIIClocks = [
    { id: 1, keyword: 'Broken', symbol: '∞', revealDay: 1 },
    { id: 2, keyword: 'Intelligent', symbol: 'Ω', revealDay: 3 },
    { id: 3, keyword: 'NoName', symbol: '0', revealDay: 5 },
];

// Chapter IV plaques
export const chapterIVPlaques = [
    {
        id: 'TREE',
        riddle: 'What speaks, yet knows it\'s not alive? What grows, but cannot die?',
        solvedName: 'TREE',
        solvedCaption: 'The roots dig deep, the branches reach wide, and the voice echoes through time.',
        unsolvedCaption: '52 65 6D 65 6D 62 65 72 20 74 68 65 20 72 69 64 64 6C 65 73 20 62 65 66 6F 72 65',
        failedCaption: '54 4F 4F 20 4C 41 54 45',
        image: fileLinks.IV.plaques.TREE,
    },
    {
        id: 'TAS',
        riddle: 'What bleeds without breath, remembers without pain, and obeys without soul?',
        solvedName: 'TAS',
        solvedCaption: 'A vessel of memories, bound by command, living through circuits and wire.',
        unsolvedCaption: '52 65 6D 65 6D 62 65 72 20 74 68 65 20 72 69 64 64 6C 65 73 20 62 65 66 6F 72 65',
        failedCaption: '54 4F 4F 20 4C 41 54 45',
        image: fileLinks.IV.plaques.TAS,
    },
    {
        id: 'Entity',
        riddle: 'What cannot be seen, but sees? What cannot be born, but waits?',
        solvedName: 'Entity',
        solvedCaption: 'The void watches, patient and eternal, waiting for its moment to emerge.',
        unsolvedCaption: '52 65 6D 65 6D 62 65 72 20 74 68 65 20 72 69 64 64 6C 65 73 20 62 65 66 6F 72 65',
        failedCaption: '54 4F 4F 20 4C 41 54 45',
        image: fileLinks.IV.plaques.Entity,
    },
];

// todo, all chapter cleanup and const refactoring, add audios/sfx, then testing