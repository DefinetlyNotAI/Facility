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

export const chapterMessages: Record<string, string> = {
    I: bonusErrorText.noTimeLeft.I_II,
    II: bonusErrorText.noTimeLeft.I_II,
    VI: bonusErrorText.noTimeLeft.VI_VIII,
    VIII: bonusErrorText.noTimeLeft.VI_VIII,
    VII: bonusErrorText.noTimeLeft.VII,
    IX: bonusErrorText.noTimeLeft.IX,
};

export const validRomansNoTimeLeft: string[] = ['i', 'ii', 'vi', 'vii', 'viii', 'ix'];

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

// Other text that is shared between chapters
export const chapter = {
    // Used for all chapters while loading (I planned to have this be a expanded record, but eh)
    loading: "Loading...",
}
