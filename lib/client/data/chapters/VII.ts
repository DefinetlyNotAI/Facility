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
};
