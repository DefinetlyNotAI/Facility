export interface ResearchLog {
    id: string;
    title: string;
    researcher: string;
    date: string;
    classification: string;
    corrupted: boolean;
    content: string;
}

export interface InitialCookies {
    corrupt: boolean;
    end: boolean;
    endQuestion: boolean;
    noCorruption: boolean;
    fileUnlocked: boolean;
    bnwUnlocked: boolean;
}
