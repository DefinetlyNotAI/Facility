// Chapter VII data
import {ChapterVIIData} from "@/types";

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
    witnessPhase: {
        title: "WITNESS THE TIMELINE",
        instruction: "Before you may alter the timeline, you must first prove you can WITNESS it - For today's word of the day is WITNESS. Observe the events below. Count how many contain the digit 7. Enter that count to proceed.",
        events: [
            "1947 - The Roswell incident occurs",
            "1963 - President Kennedy assassinated",
            "1977 - The WOW! signal detected",
            "1986 - Chernobyl disaster",
            "1997 - Mars Pathfinder lands",
            "2001 - Twin Towers fall",
            "2007 - iPhone released",
            "2012 - End of Mayan calendar",
            "2017 - Total solar eclipse across USA",
            "2020 - Global pandemic begins",
        ],
        inputPlaceholder: "Enter the count",
        submit: "Verify",
        error: "Incorrect. A true witness observes carefully.",
        hint: "Look at the YEARS. How many contain the digit 7?",
    },
};
