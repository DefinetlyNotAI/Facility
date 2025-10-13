import ntl_styles from "@/styles/NoTimeLeft.module.css";

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