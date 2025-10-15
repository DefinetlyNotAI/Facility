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
        loading: string;
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
}