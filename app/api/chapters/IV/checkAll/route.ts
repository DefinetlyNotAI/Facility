import { createSecureResponse } from '@/lib/utils';
import { dbPool } from '@/lib/db';
import { allowedActs, bonusMsg } from '@/lib/data/api';
import { ActionState, BonusResponse } from '@/lib/types/api';

export async function GET() {
    let client;
    try {
        client = await dbPool.connect();

        // Build column list quoting identifiers like "Act_I"
        const cols = allowedActs.map((a) => `"${a}"`).join(', ');

        // Read the first (and assumed single) row of act states
        let res;
        try {
            res = await client.query(`SELECT ${cols} FROM bonus LIMIT 1;`);
        } catch (err: any) {
            // If the bonus table doesn't exist, return a sensible default instead of 500
            if (err && (err.code === '42P01' || (typeof err.message === 'string' && err.message.includes('relation "bonus" does not exist')))) {
                console.warn('Bonus table missing, returning default NotReleased map');
                const fallback: Partial<Record<string, string>> = {};
                for (const act of allowedActs) {
                    fallback[act] = ActionState.NotReleased;
                }
                return createSecureResponse(fallback as BonusResponse);
            }
            throw err;
        }

        if (res.rowCount === 0) {
            return createSecureResponse({ error: bonusMsg.fetchError }, 404);
        }

        const row = res.rows[0];

        // Map DB row to BonusResponse
        const response: Partial<Record<string, string>> = {};
        for (const act of allowedActs) {
            // If column missing, default to not_released
            response[act] = (row[act] ?? ActionState.NotReleased) as string;
        }

        return createSecureResponse(response as BonusResponse);
    } catch (error) {
        console.error('Failed to fetch bonus acts', error);
        return createSecureResponse({ error: bonusMsg.fetchError }, 500);
    } finally {
        if (client) {
            try { client.release(); } catch (e) { console.error('Failed to release DB client', e); }
        }
    }
}
