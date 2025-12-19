// Chapter V data
export const chapterVData = {
    text: {
        header: "(V) - Narrator: A Harbinger",
        subHeader: "And lo, a voice spake from the void, not of man nor machine, but of judgment made flesh.",
        questReminder: "The Harbinger awaits your confession. Seek truth, or be weighed in silence.",
    },
};

// Chapter X data
export const chapterXData = {
    text: {
        header: "(X) - Narrator: Tenacity",
        subHeader: "And the fire tried them, yet they were not consumed; for will unbroken is sanctified through trial.",
        questReminder: "Endure, for only the steadfast shall glimpse the final light.",
    },
};

// Special text for chapters V and X pages (ChapterTemplate component)
export const specialVXText = {
    narrator: "The Narrator wants to speak with you",
    quote: "“And lo, the voice spoke again from within the code - ‘The script remembers what the scribe forgets.’”",
    reminderSub: "“He who seeks meaning among corrupted files shall find only mirrors reflecting his own doubt.”",
    failedTitle: "YOU HAVE FAILED ME.",
    failedText: "The narrator grows quiet. The story continues without you."
}

export const fileLinksVX = {
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
    X: {
        Narrator: "/static/chapters/X/Narrator_II.txt",
    },
}
