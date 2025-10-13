import { NextRequest } from "next/server";
import { createSecureResponse } from "@/lib/utils";
import { dbPool } from "@/lib/db";
import { allowedActs, bonusMsg } from "@/lib/data/api";
import { ActionState } from "@/lib/types/api";

export async function POST(req: NextRequest) {
    let client;
    try {
        // --- CSRF Validation ---
        const csrfTokenFromCookie = req.cookies.get("csrf-token")?.value;
        const csrfTokenFromHeader = req.headers.get("x-csrf-token");

        if (!csrfTokenFromCookie) {
            return createSecureResponse({ error: bonusMsg.invalidCsrf }, 403);
        }
        if (csrfTokenFromHeader && csrfTokenFromHeader !== csrfTokenFromCookie) {
            return createSecureResponse({ error: bonusMsg.invalidCsrf }, 403);
        }

        // --- Parse Body ---
        const body = await req.json().catch(() => {
            throw new Error("Invalid JSON body");
        });

        const act = body?.act;
        if (!act || !allowedActs.includes(act)) {
            return createSecureResponse({ error: bonusMsg.invalidAct }, 400);
        }

        // --- Map act to lowercase column name ---
        const col = act.toLowerCase();

        // --- Connect to Database ---
        client = await dbPool.connect();

        // --- Ensure Row Exists ---
        let sel = await client.query(`SELECT ${col} FROM actions LIMIT 1;`);
        if (sel.rowCount === 0) {
            const cols = allowedActs.map(a => a.toLowerCase()).join(", ");
            const values = allowedActs.map(() => `'${ActionState.NotReleased}'`).join(", ");
            await client.query(`INSERT INTO actions (${cols}) VALUES (${values});`);
            sel = await client.query(`SELECT ${col} FROM actions LIMIT 1;`);
        }

        const currentState: ActionState = (sel.rows[0][col] as ActionState) ?? ActionState.NotReleased;
        const nextState = getNextState(currentState);

        // --- Update ---
        await client.query(`UPDATE actions SET ${col} = $1;`, [nextState]);

        // --- Verify Update ---
        // const verify = await client.query(`SELECT ${col} FROM actions LIMIT 1;`);

        return createSecureResponse({ [act]: nextState });
    } catch (error) {
        return createSecureResponse({ error: bonusMsg.toggleError }, 500);
    } finally {
        client?.release();
    }
}

function getNextState(current: ActionState): ActionState {
    switch (current) {
        case ActionState.NotReleased: return ActionState.Released;
        case ActionState.Released: return ActionState.Failed;
        case ActionState.Failed: return ActionState.Succeeded;
        case ActionState.Succeeded: return ActionState.NotReleased;
        default: return ActionState.NotReleased;
    }
}
