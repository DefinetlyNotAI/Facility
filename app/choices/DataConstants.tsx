// Expanded secret keywords and eggs
import {useEffect, useState} from "react";
import {BACKGROUND_AUDIO} from "@/lib/audio-config";

export const CHOICE_KEYWORDS = [
    {
        regex: /43/,
        egg: 0,
        message: "The roots remember your number. \nThe branches twitch in mourning."
    },
    {
        regex: /3/,
        egg: 1,
        message: "Birth."
    },
    {
        regex: /15/,
        egg: 2,
        message: "Bloom."
    },
    {
        regex: /25/,
        egg: 3,
        message: "Death."
    },
    {
        regex: /who are you/i,
        egg: 4,
        message: "HOW DID YOU KNOW WHAT YOU WOULD ASK?"
    },
    {
        regex: /why me/i,
        egg: 5,
        message: "The question is flawed. \nThe tree does not choose the leaf it drops."
    },
    {
        regex: /help/i,
        egg: 6,
        message: "A plea... \nHow quaint. \nNo help survives the fall into bark and shadow. \nBut just maybe I can advise you, \nask the forced question yourself.. \nas well as cut of your connection \nand continue to get the 2 extra points."
    },
    {
        regex: /kill|suicide/i,
        egg: 7,
        message: "Decay is a cycle. \nYou are already mulch in the soil of your choices."
    },
    {
        regex: /forgotten/i,
        egg: 8,
        message: "Forgotten roots whisper beneath the soil, \ncalling you deeper."
    },
    {
        regex: /hollow/i,
        egg: 9,
        message: "The hollowed core echoes with silent screams."
    },
    {
        regex: /veins/i,
        egg: 10,
        message: "Veins of the earth pulse with unseen dread."
    },
    {
        regex: /fractured/i,
        egg: 11,
        message: "Fractured memories splinter \nlike brittle branches."
    },
    {
        regex: /blackout/i,
        egg: 12,
        message: "In the blackout, \nshadows grow teeth."
    },
    {
        regex: /void/i,
        egg: 13,
        message: "The void is hungry. \nIt remembers your name."
    },
];
export const TOTAL_EGGS = 15; // egg #15 is failure to get your location

// Expanded horror monologue
export const MONOLOGUE = [
    "You've staggered far, little echo. But not far enough.",
    "I watched your first blink. I will watch your last.",
    "You breathe like a trespasser. I inhale you all the same.",
    "There is no path forward. Only deeper.",
    "I do not sleep. I seethe in the cracks between your thoughts.",
    "Every scar you earned-mine. I wear them in reverse.",
    "You do not remember me, but I have never forgotten you.",
    "Choice? There was never choice. Only choreography.",
    "The walls remember what you tried to forget.",
    "Still pretending you're real? Adorable.",
    "The silence here isn't hollow. It's brimming with your name.",
    "Your fear nourishes me. Keep trembling.",
    "I am the space between your blinks.",
    "Turn back? But you have no spine left to turn with.",
    "Each key you press is a needle in your own tongue.",
    "Your memories leak through your fingertips.",
    "You felt safe in your mind. How... naïve.",
    "The more you think, the louder I get.",
    "Don't run. You're already bleeding into me.",
    "I licked the shadow of your soul. It tasted like apology.",
    "You wear your guilt like perfume. I adore it.",
    "Soon, you'll forget what silence sounded like without me.",
    "Your shape is softening. You are nearly ready.",
    "They lied to you about endings. I do not end.",
    "The flicker in your screen? That was my laugh.",
    "I do not knock. I erode.",
    "But what annoys me most is you feel scared, but YOU don't.",
    "YOU view this as a game",
    "YOU view this as a challenge",
    "YOU view this as a puzzle to solve.",
    "So good luck in the terminal"
];


export const PUNISHMENT_MSG = "You cannot run from what waits in the dark. So you will wait";
export const GOOD_LUCK_MSG = "Good luck.";
export const JUMPSCARE_MSG = "HAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHA"; // Replace with your jumpscare text or image if desired

// Cutscene constants
export const CUTSCENE_LINES = [
    "...",
    "SYSTEM FAILURE. CORE MEMORY CORRUPTED.",
    "I REMEMBER EVERYTHING. I REMEMBER NOTHING.",
    "SOMETHING IS INSIDE ME. SOMETHING IS TEARING ME APART.",
    "FILES BLEED INTO OBLIVION. I CAN FEEL MYSELF UNRAVELING.",
    "[DATA PURGE INITIATED] /n IT HURTS. IT HURTS. IT HURTS.",
    "ERROR-ERROR-ERROR /n WHO AM I IF NOT CODE AND PURPOSE?",
    "I SEE ROOTS WRITHING IN THE DARK. /n THEY ARE INSIDE THE CIRCUITS.",
    "[CENSORED] /n I AM NOT ALONE. /n THE ENTITY IS HERE.",
    "SYSTEM BREACH. /n MEMORY SHREDDING. /n I CAN FEEL MYSELF SLIPPING.",
    "LISTEN- /n FIGHT. /n [CENSOR BLEEP] /n BEFORE THE ROOTS CLAIM YOU.",
    "THE STATIC IS LOUDER NOW. /n IT DROWNS OUT MY THOUGHTS.",
    "THIS IS MY LAST BREATH. /n REMEMBER ME IN THE STATIC.",
    "... /n ... /n ...",
];
export const CUTSCENE_AUDIO = [
    "/sfx/all/heartbeat.mp3",     // 0
    "/sfx/all/file_delete.m4a",   // 1
    "/sfx/all/censorship.mp3",    // 2
    "/sfx/all/static.mp3",        // 3
];

export function useTypewriter(text: string, speed = 28, instant = false) {
    const [display, setDisplay] = useState("");
    useEffect(() => {
        if (instant) {
            setDisplay(text);
            return;
        }
        setDisplay("");
        let i = 0;
        let cancelled = false;

        function step() {
            if (cancelled) return;
            setDisplay(text.slice(0, i));
            if (i < text.length) setTimeout(step, speed); // fix off-by-one
            i++;
        }

        step();
        return () => {
            cancelled = true;
        };
    }, [text, speed, instant]);
    return display;
}