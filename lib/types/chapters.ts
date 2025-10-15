export type ChapterStatus = 'pending' | 'active' | 'succeeded' | 'failed' | 'archived';

export interface Chapter {
    id: string;
    roman_numeral: string;
    quest_name: string;
    status: ChapterStatus;
    unlock_date: string;
    deadline: string;
    created_at: string;
    updated_at: string;
}

export interface PlaqueStatus {
    id: string;
    status: 'pending' | 'solved' | 'failed';
}

export interface ChapterIVProgress {
    chapter: {
        status: 'active' | 'succeeded' | 'failed';
    };
    progress?: {
        chapterIVData?: {
            plaques?: PlaqueStatus[];
        };
        plaques?: PlaqueStatus[];
    };
}

export interface ClockState {
    id: number;
    keyword: string;
    symbol: string;
    revealDay: number;
    isRevealed: boolean;
    timeRemaining: number;
}