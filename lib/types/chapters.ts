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

export interface ChapterProgress {
    id: string;
    chapter_id: string;
    user_id: string;
    completed: boolean;
    completed_at: string | null;
    data: Record<string, any>;
    created_at: string;
    updated_at: string;
}

export interface PlaqueStatus {
    id: string;
    status: 'pending' | 'solved' | 'failed';
}