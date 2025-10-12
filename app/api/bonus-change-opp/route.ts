import { NextRequest } from 'next/server';
import { createSecureResponse } from '@/lib/utils';
import { dbPool } from '@/lib/db';
import { allowedActs, bonusMsg } from '@/lib/data/api';
import {ActionState} from "@/lib/types/api";

export async function POST(req: NextRequest) {
    try {
        const csrfTokenFromCookie = req.cookies.get('csrf-token')?.value;
        const csrfTokenFromHeader = req.headers.get('x-csrf-token');

        if (!csrfTokenFromCookie || !csrfTokenFromHeader || csrfTokenFromCookie !== csrfTokenFromHeader) {
            return createSecureResponse({ error: bonusMsg.invalidCsrf }, 403);
        }

        const body = await req.json();
        const act = body?.act;

        if (!act || !allowedActs.includes(act)) {
            return createSecureResponse({ error: bonusMsg.invalidAct }, 400);
        }

        const client = await dbPool.connect();

        // Ensure the table has TEXT columns for each action (to store enum values)
        const selectQ = `SELECT ${act} FROM actions LIMIT 1;`;
        const sel = await client.query(selectQ);

        let currentState: ActionState = ActionState.NotReleased;

        if ((sel.rowCount ?? 0) > 0) {
            currentState = (sel.rows[0][act] as ActionState) ?? ActionState.NotReleased;
        } else {
            // Initialize with not_released for all actions
            const cols = allowedActs.join(', ');
            const values = allowedActs.map(() => `'${ActionState.NotReleased}'`).join(', ');
            const insertQ = `INSERT INTO actions (${cols}) VALUES (${values});`;
            await client.query(insertQ);
        }

        // Cycle through the four states
        const nextState = getNextState(currentState);

        const updateQ = `UPDATE actions SET ${act} = $1;`;
        await client.query(updateQ, [nextState]);

        client.release();

        return createSecureResponse({ success: true, [act]: nextState });
    } catch (error) {
        console.error(bonusMsg.toggleError, error);
        return createSecureResponse({ error: bonusMsg.toggleError }, 500);
    }
}

// Helper: determine the next state
function getNextState(current: ActionState): ActionState {
    switch (current) {
        case ActionState.NotReleased:
            return ActionState.Released;
        case ActionState.Released:
            return ActionState.Failed;
        case ActionState.Failed:
            return ActionState.Succeeded;
        case ActionState.Succeeded:
            return ActionState.NotReleased;
        default:
            return ActionState.NotReleased;
    }
}
