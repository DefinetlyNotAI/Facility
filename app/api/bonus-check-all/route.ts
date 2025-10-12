import { createSecureResponse } from '@/lib/utils';
import { dbPool } from '@/lib/db';
import { bonusMsg, allowedActs } from "@/lib/data/api";
import { ActionState } from "@/lib/types/api";

export async function GET() {
    try {
        const client = await dbPool.connect();
        const res = await client.query(`
            SELECT ${allowedActs.join(', ')}
            FROM actions
                     LIMIT 1;
        `);
        client.release();

        // Default row with all acts set to NotReleased
        const defaultRow: Record<string, ActionState> = allowedActs.reduce((acc, act) => {
            acc[act] = ActionState.NotReleased;
            return acc;
        }, {} as Record<string, ActionState>);

        if (res.rowCount === 0) {
            return createSecureResponse(defaultRow);
        }

        // Map each act to its current ActionState (fallback to NotReleased)
        const row = res.rows[0];
        const result: Record<string, ActionState> = allowedActs.reduce((acc, act) => {
            acc[act] = (row[act] as ActionState) ?? ActionState.NotReleased;
            return acc;
        }, {} as Record<string, ActionState>);

        return createSecureResponse(result);
    } catch (error) {
        console.error(bonusMsg.fetchError, error);
        return createSecureResponse({ error: bonusMsg.fetchError }, 500);
    }
}
