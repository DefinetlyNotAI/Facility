import { createSecureResponse } from '@/lib/utils';
import { dbPool } from '@/lib/db';
import { allowedActs, bonusMsg, chIVStateMap } from '@/lib/data/api';
import { ActionState, BonusResponse } from '@/lib/types/api';

export async function POST(req: Request) {
    let client;
    let missingTable = false;

    try {
        const body = await req.json();
        const act = body?.act;
        if (!act || typeof act !== 'string' || !allowedActs.includes(act)) {
            return createSecureResponse({ error: bonusMsg.invalidAct }, 400);
        }

        client = await dbPool.connect();

        // Try to fetch current state
        let selRes;
        try {
            selRes = await client.query(`SELECT "${act}" FROM bonus LIMIT 1;`);
        } catch (err: any) {
            if (err.code === '42P01' || (typeof err.message === 'string' && err.message.includes('relation "bonus" does not exist'))) {
                console.warn('Bonus table missing; using defaults.');
                missingTable = true;
            } else {
                throw err;
            }
        }

        // Determine current and next state
        const current: ActionState = missingTable
            ? ActionState.NotReleased
            : ((selRes?.rows[0]?.[act] as ActionState) ?? ActionState.NotReleased);

        const next: ActionState = chIVStateMap[current] ?? ActionState.NotReleased;

        // Update the act state if table exists
        if (!missingTable) {
            try {
                await client.query(`UPDATE bonus SET "${act}" = $1;`, [next]);
            } catch (err: any) {
                console.error('Failed to update bonus table (ignored):', err);
            }
        }

        // Build full response
        const response: Partial<Record<string, string>> = {};
        if (missingTable) {
            for (const a of allowedActs) response[a] = ActionState.NotReleased;
        } else {
            const allRes = await client.query(`SELECT ${allowedActs.map(a => `"${a}"`).join(', ')} FROM bonus LIMIT 1;`);
            const row = allRes.rows[0];
            for (const a of allowedActs) {
                response[a] = (row[a] ?? ActionState.NotReleased) as string;
            }
        }

        return createSecureResponse(response as BonusResponse);
    } catch (error) {
        console.error('Failed to change act state', error);
        return createSecureResponse({ error: bonusMsg.toggleError }, 500);
    } finally {
        if (client) {
            try { client.release(); } catch (e) { console.error('Failed to release DB client', e); }
        }
    }
}
