import { createSecureResponse } from '@/lib/utils';
import { dbPool } from '@/lib/db';
import {allowedActs, bonusMsg, chIVStateMap} from '@/lib/data/api';
import { ActionState, BonusResponse } from '@/lib/types/api';



export async function POST(req: Request) {
    let client;
    try {
        const body = await req.json();
        const act = body?.act;
        if (!act || typeof act !== 'string' || !allowedActs.includes(act)) {
            return createSecureResponse({ error: bonusMsg.invalidAct }, 400);
        }

        client = await dbPool.connect();

        // Read current state
        const selRes = await client.query(`SELECT "${act}" FROM bonus LIMIT 1;`);
        if (selRes.rowCount === 0) {
            return createSecureResponse({ error: bonusMsg.toggleError }, 404);
        }

        const current: ActionState = selRes.rows[0][act] ?? ActionState.NotReleased;
        const next = chIVStateMap[current] ?? ActionState.NotReleased;

        // Update the act to next state
        await client.query(`UPDATE bonus SET "${act}" = $1;`, [next]);

        // Return the full current state map
        const cols = allowedActs.map((a) => `"${a}"`).join(', ');
        const allRes = await client.query(`SELECT ${cols} FROM bonus LIMIT 1;`);
        const row = allRes.rows[0];

        const response: Partial<Record<string, string>> = {};
        for (const a of allowedActs) {
            response[a] = (row[a] ?? ActionState.NotReleased) as string;
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

