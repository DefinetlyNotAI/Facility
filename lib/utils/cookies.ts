// Cookie Management Utilities for Chapter IV

// Parse a JSON cookie by name
export function getJsonCookie(name: string): any | null {
    if (typeof document === 'undefined') return null;

    try {
        const match = document.cookie
            .split(';')
            .map(s => s.trim())
            .find(c => c.startsWith(name + '='));

        if (!match) return null;

        const value = decodeURIComponent(match.split('=')[1] || '');
        return JSON.parse(value);
    } catch (e) {
        console.warn(`Failed to parse cookie ${name}:`, e);
        return null;
    }
}

// Set a JSON cookie
export function setJsonCookie(name: string, obj: any, days = 365): void {
    if (typeof document === 'undefined') return;

    try {
        const value = encodeURIComponent(JSON.stringify(obj));
        const d = new Date();
        d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${value}; path=/; expires=${d.toUTCString()}; SameSite=Lax`;
    } catch (e) {
        console.warn(`Failed to set cookie ${name}:`, e);
    }
}

// Update plaque progress in the merged cookie
export function updatePlaqueProgress(
    cookieKey: string,
    plaqueId: string,
    status: number
): void {
    try {
        const current = getJsonCookie(cookieKey) || {};
        const prev = Number(current[plaqueId] || 0);
        current[plaqueId] = Math.max(prev, status);
        setJsonCookie(cookieKey, current, 365);
    } catch (e) {
        console.warn('Failed to update plaque progress:', e);
    }
}

// Get plaque progress status
export function getPlaqueProgress(
    cookieKey: string,
    plaqueId: string
): number {
    try {
        const data = getJsonCookie(cookieKey) || {};
        return Number(data[plaqueId] || 0);
    } catch (e) {
        return 0;
    }
}

