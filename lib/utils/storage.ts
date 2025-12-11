// Storage Management for Chapter IV Puzzles

const STORAGE_PREFIX = 'chapterIV-';

/**
 * Get saved stage index from localStorage
 */
export function getSavedStageIndex(
    plaqueId: string,
    maxStages: number
): { stageIndex: number; isCompleted: boolean; unlockedStage: number } {
    const storageKey = `${STORAGE_PREFIX}${plaqueId}-progress`;

    try {
        const raw = localStorage.getItem(storageKey);
        if (!raw) return {stageIndex: 0, isCompleted: false, unlockedStage: 0};

        const i = parseInt(raw, 10);
        if (isNaN(i)) return {stageIndex: 0, isCompleted: false, unlockedStage: 0};

        if (i >= maxStages) {
            return {stageIndex: maxStages, isCompleted: true, unlockedStage: maxStages - 1};
        }

        if (i >= 0) {
            return {stageIndex: i, isCompleted: false, unlockedStage: i};
        }

        return {stageIndex: 0, isCompleted: false, unlockedStage: 0};
    } catch (e) {
        console.warn('Failed to load progress:', e);
        return {stageIndex: 0, isCompleted: false, unlockedStage: 0};
    }
}

/**
 * Save stage index to localStorage
 */
export function saveStageIndex(plaqueId: string, stageIndex: number): void {
    const storageKey = `${STORAGE_PREFIX}${plaqueId}-progress`;

    try {
        localStorage.setItem(storageKey, String(stageIndex));
    } catch (e) {
        console.warn('Failed to save progress:', e);
    }
}

import {localStorageKeys} from '@/lib/saveData';

/**
 * Returns an existing session ID from localStorage or creates a new one.
 *
 * @returns A string session ID.
 *
 * Usage: Track a client session across pages without requiring login.
 */
export function getOrCreateSessionId() {
    let storedId = localStorage.getItem(localStorageKeys.sessionId);
    if (!storedId) {
        storedId = `SID-${Math.random().toString(36).slice(2, 9)}`;
        localStorage.setItem(localStorageKeys.sessionId, storedId);
    }
    return storedId;
}

/**
 * Returns a key-value map of all document cookies (client-side).
 *
 * @returns Object mapping cookie names to values.
 */
export function getCookiesMap(): Record<string, string> {
    return document.cookie.split(';').reduce((acc, cookie) => {
        const [rawKey, ...rest] = cookie.trim().split('=');
        const key = decodeURIComponent(rawKey);
        acc[key] = rest.join('=');
        return acc;
    }, {} as Record<string, string>);
}
