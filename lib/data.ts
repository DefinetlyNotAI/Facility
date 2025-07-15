// Terminal - Note that all keywords have been unlocked, so no need for security api calls here.
export const keywords: Record<number, string> = {
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
export const facilityData: Record<string, string> = {
    temperature: '22.7°C',
    pressure: '1013.42 hPa',
    humidity: '43%',
    radiation: '0.09 μSv/h',
    powerOutput: '2.4 MW',
    networkStatus: 'SECURE'
};
export const systemMetrics: Record<string, string> = {
    cpuUsage: '67%',
    memoryUsage: '8.2/16 GB',
    diskSpace: '2.1/4.8 TB',
    networkTraffic: '847 MB/s'
};
export const refreshMessages: string[] = [
    "Five refreshes... You're persistent. The tree notices persistence. Earn my trust to see more.",
    "Fifteen refreshes... The roots whisper your name now. They remember you... They trust you.",
    "Twenty five refreshes... You've fed the tree well. It smiles upon you, vessel. Seek the next step.",
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

// dream.tsx
export const IMAGE_DIR = '/static/dream/';
export const IMAGES: Record<string, string> = {
    'allyounome.png': "The house never needed a foundation—only witnesses.",
    'beautiful.png': "They called it beautiful. You kept blinking, but it never stopped.",
    'letsplay.jpeg': "You promised you'd forget. They're still waiting at recess.",
    'perspective.png': "Smile upside down. Maybe then it makes sense.",
    'roseye.png': "Where memories rot, flowers bloom with sight.",
    'siliconyou.png': "The machines remember you better than you do.",
    'treeohtree.png': "It still stands. And it still listens.",
    'weallseeyou.png': "They blink in patterns. Have you decoded your reflection yet?",
};
export const WHISPER_TEXTS: string[] = [
    'he never left',
    'they bloom in silence',
    'don’t blink',
    'it’s watching',
    'you forgot something',
    'was this always here?',
    'static never sleeps',
    'you are not alone',
    'he remembers',
    'turn around',
    'just out of frame',
    'this isn’t memory',
    ':)'
];

// file console
type Dirent = { name: string; type: 'file' | 'dir'; };
export type BootMessage = {
    text: string;
    delay?: number; // in ms
    typeSpeed?: number; // characters per second
    mode?: 'instant' | 'type' | 'fade';
    groupWithPrevious?: boolean;
};
const DUMMY_FILES: Dirent[] = Array.from({length: 6}, (_, i) => ({
    name: `broken_shadow${i + 1}${Math.random() > 0.5 ? '.bin' : ''}`,
    type: Math.random() > 0.4 ? 'file' : 'dir'
}));
export const ROOT_FILES: Dirent[] = [
    {name: 'riddle.pdf', type: 'file'},
    {name: 'riddle-hint.txt', type: 'file'},
    {name: 'code', type: 'dir'},
    ...DUMMY_FILES
];
export const CODE_FILES: Dirent[] = [
    {name: 'robots.txt', type: 'file'},
    {name: 'LETITGROW.tree', type: 'file'},
    {name: '.backup', type: 'file'},
    {name: 'nullskin.swp', type: 'file'},
    {name: 'tmp_env/', type: 'dir'},
    {name: 'ERROR###.log', type: 'file'}
];
export const BOOT_MESSAGES: BootMessage[] = [
    {text: "", delay: 3000},

    {text: "(c) 19XX–19XX Internal Research Division", mode: "instant"},
    {text: "Root Protocol Interface Loading...", typeSpeed: 40},

    {text: ""},

    {text: "[+] Initializing Memory Handlers... OK", typeSpeed: 30},
    {text: "[+] Mapping Peripheral Branches... OK", typeSpeed: 30},
    {text: "[+] Engaging Containment Routines...", typeSpeed: 30},
    {text: "     ...", delay: 400, typeSpeed: 8},
    {text: "     ...", delay: 400, typeSpeed: 8},
    {text: "     ERROR: VESSEL BINDING FAILED [code: GRFT-31525]", mode: "fade", delay: 700},

    {text: ""},

    {text: "SYSTEM FLAG: [TR33 DETECTED]", typeSpeed: 25},
    {text: "Override tree.sys... [DENIED]", typeSpeed: 25},
    {text: "core.dat :: INTEGRITY VIOLATED", typeSpeed: 25},
    {text: "root.bark :: UNREADABLE", typeSpeed: 25},
    {text: "sap.dll :: missing", typeSpeed: 25},
    {text: "grove.ini :: mutated", typeSpeed: 25},
    {text: "echo.log :: repeating...", typeSpeed: 15, groupWithPrevious: true},

    {text: ""},

    {text: "- SIGNAL ANOMALY IN SECTOR // NULLSKIN //", typeSpeed: 18, mode: "type"},
    {text: "- DEEPROOT LATTICE CORRUPTED", typeSpeed: 18},
    {text: "- MIND INTERFACE OFFLINE", typeSpeed: 18},

    {text: ""},

    {text: "Attempting fallback shell...", typeSpeed: 25},
    {text: "[!] fallback.sys does not exist", typeSpeed: 18, mode: "fade"},
    {text: "[!] shell.vine has detached from host", typeSpeed: 18},

    {text: ""},

    {text: ">>> internal bleeding in memory cluster 0042", typeSpeed: 12, mode: "type"},
    {text: ">>> stack overgrowth at 0000:FADE", typeSpeed: 12},
    {text: ">>> vocal node mismatch [WHO IS SPEAKING?]", typeSpeed: 12, mode: "fade"},

    {text: ""},

    {text: "TREE/$ run /contain", typeSpeed: 25},
    {text: "[ACCESS DENIED] containment overridden by [TR33]", mode: "instant"},

    {text: ""},

    {text: "TREE/$ boot /safe", typeSpeed: 25},
    {text: "[ABORTED] :: safe boot no longer recognized as safe", mode: "instant"},

    {text: ""},

    {text: "[help] is empty", typeSpeed: 18},
    {text: "[whispers] are too loud", typeSpeed: 18, mode: "fade"},

    {text: ""},

    {text: "...", delay: 400, typeSpeed: 8, mode: "fade"},

    {text: ""},

    {text: "ROOT CORE OFFLINE", typeSpeed: 25, mode: "fade"},
    {text: "VESSEL UNBOUND", typeSpeed: 25},
    {text: "LOGGING LAST USER: ████████", typeSpeed: 12, mode: "fade"},
    {text: "CONNECTING TERMINAL 5... [DENIED]", typeSpeed: 25},
    {text: "CONNECTING TERMINAL 3... [SUCCESS]", typeSpeed: 25},
    {text: "CONNECTED TO TERMINAL 3", delay: 400, mode: "instant"},

    {text: ""},

    {text: "Awaiting vessel input...", typeSpeed: 8, mode: "type"}
];
