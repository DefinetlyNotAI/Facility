import {routes} from "@/lib/saveData";

// Layout.tsx
export const TITLES: Record<string, string> = {
    [routes.root]: "Hope you have fun",
    [routes.moonlight]: "A night so cold HE forgot to smile",
    [routes.smileking]: ":)",
    [routes.choices]: "So many choices.. None for you.",
    [routes.h0m3]: "HELP ME FIND HOME",
    [routes.theEnd]: "Thank you.. See you soon, may HE be with you, Praise Be",
    [routes.cheater]: "HYPOCRITE",
    [routes.smilekingAuth]: "Authorized Access Only - Smile King Terminal",
    [routes.notFound]: "The doors don't open just because you found them.",
};
export const FAVICON = "/favicon.ico";

// Page.tsx
export const text = {
    loading: {
        title: "FACILITY OS v3.15.25",
        subtitle: "Initializing secure connection..."
    },
    restrictedAccess: {
        header: "⚠️ RESTRICTED ACCESS TERMINAL ⚠️",
        subheader: "FACILITY 05-B • CLEARANCE LEVEL 5 REQUIRED",
        systemLines: [
            "This terminal requires elevated permissions",
            "Audio access, notifications, camera access, and media permissions needed as well as allowance to download files.",
            "Psychological evaluation protocols active"
        ],
        morality: `All audio tracks used are not my own, nor owned by me. Most audio's are royalty-free and inspired by a nice game.`
    },
    warnings: {
        title: "⚠️ CONTENT WARNINGS ⚠️",
        items: [
            "• Visual and audio disturbances",
            "• Possible flashing lights and rapid imagery",
            "• Content may be psychologically distressing",
            "• Immersive psychological horror experience with audio cues"
        ]
    },
    protocols: {
        title: "FACILITY PROTOCOLS",
        text: "By proceeding, you acknowledge understanding of all safety protocols and consent to psychological evaluation procedures. This experience is designed for mature audiences only. Quit now if you will play with no audio."
    },
    acceptBtn: "ACCEPT TERMS & ENTER FACILITY",
    consoleWarning: {
        header: "CRITICAL WARNING",
        lines: [
            {
                text: "Developer console access STRICTLY PROHIBITED - Unauthorized console usage may destroy the experience",
                class: "text-red-400"
            },
            {
                text: "DO NOT MANUALLY MODIFY COOKIES TO SKIP CERTAIN ASPECTS OF THE FACILITY - NOR SHOULD DELETE SOME COOKIES",
                class: "text-red-400"
            },
            {text: "Console usage only permitted when explicitly instructed by the system.", class: "text-yellow-400"},
            {text: "THIS IS NOT FOR EPILEPTIC PEOPLE OR PEOPLE THAT ARE WEAK OF HEART", class: "text-yellow-400"},
            {
                text: "The Facility heavily relies on cookies for SAVE data. Please do not use incognito or delete the cookies or your progress may be reset.",
                class: "text-yellow-400"
            },
            {
                text: "TAS is your friend. Use it if you are stuck, I don't recommend using TAS however.",
                class: "text-green-700"
            },
            {text: "Use headphones, it is part of the experience!.", class: "text-green-700"}
        ],
        redirect: "Redirecting to secure terminal in",
        links: {
            discord: {
                href: "https://discord.gg/rVBFQCTV4F",
                label: "Join the Facility Discord - You can't do this without the others.."
            },
            questLog: {
                href: "https://the-facility-questlog.vercel.app",
                label: "VESSEL Quest Log - Hope you don't miss any.. PRAISE BE!"
            }
        }
    }
}
