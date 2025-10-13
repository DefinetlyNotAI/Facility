import { NextRequest } from 'next/server';
import { createSecureResponse } from '@/lib/utils';
import { dbPool } from '@/lib/db';
import { allowedActs, bonusMsg } from "@/lib/data/api";
import { ActionState } from "@/lib/types/api";

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const act = url.searchParams.get('act');

        if (!act || !allowedActs.includes(act)) {
            return createSecureResponse({ error: bonusMsg.missingParam }, 400);
        }

        const client = await dbPool.connect();

        // Map to lowercase column
        const col = act.toLowerCase();
        const q = `SELECT ${col} FROM actions LIMIT 1;`;
        const res = await client.query(q);
        client.release();

        // Default to NotReleased if no row exists
        const state: ActionState =
            res.rowCount === 0
                ? ActionState.NotReleased
                : (res.rows[0][col] as ActionState) ?? ActionState.NotReleased;

        return createSecureResponse({ [act]: state });
    } catch (error) {
        console.error(bonusMsg.checkError, error);
        return createSecureResponse({ error: bonusMsg.checkError }, 500);
    }
}
