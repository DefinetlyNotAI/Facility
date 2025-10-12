import { createSecureResponse } from '@/lib/utils';
import { dbPool } from '@/lib/db';

// API: GET /api/bonus-check-all — returns boolean progress for all bonus acts (Act_I..Act_X).
// Need: none (reads from actions table).
// Return: JSON object like { Act_I: false, Act_II: true, ... } or an error object with appropriate status.

export async function GET() {
    try {
        const client = await dbPool.connect();
        const res = await client.query(`
            SELECT Act_I, Act_II, Act_III, Act_IV, Act_V,
                   Act_VI, Act_VII, Act_VIII, Act_IX, Act_X
            FROM actions
            LIMIT 1;
        `);
        client.release();

        const defaultRow = {
            Act_I: false, Act_II: false, Act_III: false, Act_IV: false, Act_V: false,
            Act_VI: false, Act_VII: false, Act_VIII: false, Act_IX: false, Act_X: false,
        };

        if (res.rowCount === 0) {
            return createSecureResponse(defaultRow);
        }

        // Ensure booleans
        const row = res.rows[0];
        const result = Object.fromEntries(
            Object.keys(defaultRow).map((k) => [k, !!row[k]])
        );

        return createSecureResponse(result);
    } catch (error) {
        console.error('Error fetching bonus progress', error);
        return createSecureResponse({ error: 'Failed to fetch bonus progress' }, 500);
    }
}
