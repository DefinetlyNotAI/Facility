/**
 * Converts milliseconds into a human-readable time format.
 *
 * @param milliseconds - Time duration in milliseconds.
 * @returns Formatted string like 'Xd Xh Xm Xs'.
 */
export function formatTime(milliseconds: number) {
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
    const hours = Math.floor((milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

/**
 * Checks a string against a hashed reference (server-side only).
 *
 * @param itemToCheck - Key identifying the hashed item.
 * @param stringToCheck - String to validate against hash.
 * @returns Object with success boolean and optional error message.
 */
export async function checkPass(itemToCheck: string, stringToCheck: string) {
    try {
        const res = await fetch('/api/utils/hashChecker', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ itemToCheck, stringToCheck })
        });
        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            return { success: false, error: errData.error ?? "Server error" };
        }
        return await res.json();
    } catch {
        return { success: false, error: "Network error" };
    }
}
