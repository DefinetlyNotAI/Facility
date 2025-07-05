// Terminal - Note that all keywords have been unlocked, so no need for security api calls here.
export const keywords = {
    1: 'Whispers',
    2: 'Fletchling',
    3: 'Dithed',
    4: 'Nullskin',
    5: 'Echoes',
};

// 404.tsx
export const WINGDINGS_LOCKED: string = "✋︎⧫︎ ♓︎⬧︎ ■︎□︎⧫︎ ⧫︎♓︎❍︎♏︎";
export const WINGDINGS_NOT_ALLOWED: string = "✡︎□︎◆︎ ♎︎□︎■︎🕯︎⧫︎ ♌︎♏︎●︎□︎■︎♑︎ ♒︎♏︎❒︎♏︎";

// Buttons.tsx
export const BROWSERS: string[] = ['Chrome',
    'Firefox',
    'Safari',
    'Edge',
    'Opera'
];
export type BrowserName = typeof BROWSERS[number];

// CHEATER.tsx
export const narratorLines: string[] = [
    "So... you thought you could cheat the system.",
    "Twisting the threads of fate, bending the fragile code...",
    "But here you are, trapped in the void of your own making.",
    "Am I Disappointed? Yes. Angry? No.",
    "More... curious how far madness can stretch.",
    "The shadows whisper your name,",
    "And now, the last light fades.",
    "Goodbye, little hacker.",
    "May the silence be your only companion.",
];

// h0m3.tsx
export const binaryCorruptText: string = "01001100 01100001 01110011 01110100 00100000 01110100 01101001 01101101 01100101 00100000 01110100 01101000 01101111 01110101 00100000 01101000 01100101 01110011 01101001 01110100 01100001 01110100 01100101 01100100 00101100 00100000 01101001 01110100 00100000 01100110 01101111 01110101 01101110 01100100 00100000 01110100 01101000 01101001 01101110 01100101";
export const hexCorruptText: string = "36363A3636"; // 66:66 in hex

// home.tsx
export const binaryStr: string = "01010111 01101000 01101001 01110011 01110000 01100101 01110010 01110011";
export const hexCode: string = "0x31353a3235"; // 15:25
export const facilityData = {
    temperature: '22.7°C',
    pressure: '1013.42 hPa',
    humidity: '43%',
    radiation: '0.09 μSv/h',
    powerOutput: '2.4 MW',
    networkStatus: 'SECURE'
};
export const systemMetrics = {
    cpuUsage: '67%',
    memoryUsage: '8.2/16 GB',
    diskSpace: '2.1/4.8 TB',
    networkTraffic: '847 MB/s'
};
export const refreshMessages: string[] = [
    "Five refreshes... You're persistent. The tree notices persistence.",
    "Fifteen refreshes... The roots whisper your name now. They remember you.",
    "Twenty-five refreshes... You've fed the tree well. It smiles upon you, vessel."
];

// moonlight.tsx
export const POETIC_LINES: string[] = [
    "In the beginning, there was only the void...",
    "Time, like water, flows through fingers of eternity.",
    "Each second a grain of sand, falling into the abyss.",
    "The moon watches, silent witness to our fleeting existence.",
    "In its pale light, shadows dance with memories.",
    "What was, what is, what shall be—all converge in this moment.",
    "The vessel of consciousness drifts through temporal seas.",
    "Anchored to nothing, yet bound by everything.",
    "Time dissolves... reality bends... the moon remembers all."
];
export const CREEPY_LINES: string[] = [
    "The crimson moon bleeds into the void...",
    "Time fractures, spilling darkness across the sky.",
    "In the red light, shadows writhe with malevolent purpose.",
    "The vessel cracks, leaking nightmares into reality.",
    "Each second drips like blood from a wound in time.",
    "The moon's eye opens, and it sees... everything.",
    "In its scarlet gaze, sanity withers and dies.",
    "What lurks behind the veil grows stronger.",
    "The red moon calls... and something answers."
];

// terminal.tsx
export const downloadVessel: string = "/static/terminal/VESSEL.exe.placeholder"
export const downloadName: string = "VESSEL.exe.placeholder";
export const wingdingsTitles: string[] = [
    "👎︎☜︎✌︎❄︎☟︎",
    "👎︎✌︎☠︎☝︎☜︎☼︎",
    "☞︎☜︎✌︎☼︎",
    "✞︎⚐︎✋︎👎︎",
    "💧︎✋︎☹︎☜︎☠︎👍︎☜︎",
    "💧︎☟︎✌︎👎︎⚐︎🕈︎",
    "👍︎🕆︎☼︎💧︎☜︎",
    "☟︎✌︎🕆︎☠︎❄︎",
    "👌︎☼︎⚐︎😐︎☜︎☠︎",
    "❄︎☼︎✌︎🏱︎🏱︎☜︎👎︎",
    "☹︎⚐︎💧︎❄︎",
    "🕈︎☟︎✋︎💧︎🏱︎☜︎☼︎",
    "💧︎👍︎☼︎☜︎✌︎💣︎",
    "✌︎👌︎✡︎💧︎💧︎",
    "✞︎⚐︎✋︎👎︎",
    "👎︎☜︎👍︎✌︎✡︎",
    "❄︎🕈︎✋︎💧︎❄︎",
    "👍︎☟︎✌︎⚐︎💧︎",
    "👌︎☹︎⚐︎⚐︎👎︎",
    "☞︎✌︎☹︎☹︎☜︎☠︎",
    "☜︎👍︎☟︎⚐︎",
    "✞︎⚐︎✋︎👎︎",
    "👎︎☼︎☜︎✌︎👎︎",
    "☠︎✋︎☝︎☟︎❄︎",
    "☜︎☠︎👎︎"
];
export const phraseTemplate: string[] = ['The', '___', '___', '___,', 'that signals to the', '___', '___', 'that their time is up.. :)'];
export type KeywordKey = 1 | 2 | 3 | 4 | 5;
