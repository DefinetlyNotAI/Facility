export interface PlaqueStatus {
    id: string;
    status: 'pending' | 'solved' | 'failed';
}

export interface ClockState {
    id: number;
    keyword: string;
    symbol: string;
    revealDay: number;
    isRevealed: boolean;
    timeRemaining: number;
}

export interface ChapterIVDatatype {
    gifCrossPath: string;
    plaqueStatus: PlaqueStatus[];
    text: {
        header: string;
        subHeader: string;
        questReminder: string;
        complete: {
            title: string;
            message: string;
        };
        statuses: {
            pendingLabel: string;
            solvedLabel: string;
            failedLabel: string;
        };
    };
    chapterIVPlaques: {
        id: string;
        riddle: string;
        solvedName: string;
        solvedCaption: string;
        unsolvedCaption: string;
        failedCaption: string;
        image: string;
    }[];
    // optional puzzles metadata keyed by plaque id
    puzzles?: Record<string, {
        keyword: string;
        stages: string[];
        hints: string[][];
    }>;
}

export type ChapterVIIData = {
    solved: string;
    enterLogs: (year: number) => string;
    inputPlaceholder: string;
    submit: string;
    yearProgress: (found: number, total: number, year: number) => string;
    totalProgress: (found: number, total: number) => string;
    banActive: (time: Date) => string;
    banTrigger: (time: Date) => string;
    banMinutes: number;
    timelineData: Record<number, number[]>;
};

export interface ChapterTemplateProps {
    chapterId: string;
    chapterData: {
        text: {
            header: string;
            subHeader: string;
            questReminder: string;
        };
    };
    fileLink: string;
}
