import { NextRequest } from 'next/server';
import { createSecureResponse } from '@/lib/utils';
import { dbPool } from '@/lib/db';
import { allowedActs } from "@/lib/data/api";

// API: POST /api/bonus-change-opp — toggles (opposite) the requested bonus act (Act_I..Act_X).
// Need: JSON body { act: "Act_I" } and matching CSRF token in cookie 'csrf-token' and header 'x-csrf-token'.
// Return: JSON object like { success: true, Act_I: true } showing the new value, or an error object with status.


export async function POST(req: NextRequest) {
    try {
        const csrfTokenFromCookie = req.cookies.get('csrf-token')?.value;
        const csrfTokenFromHeader = req.headers.get('x-csrf-token');

        if (!csrfTokenFromCookie || !csrfTokenFromHeader || csrfTokenFromCookie !== csrfTokenFromHeader) {
            return createSecureResponse({ error: 'Invalid CSRF token' }, 403);
        }

        const body = await req.json();
        const act = body?.act;

        if (!act || !allowedActs.includes(act)) {
            return createSecureResponse({ error: 'Invalid or missing act' }, 400);
        }

        const client = await dbPool.connect();

        // Read current value
        const selectQ = `SELECT ${act} FROM actions LIMIT 1;`;
        const sel = await client.query(selectQ);

        let current: boolean;
        if ((sel.rowCount ?? 0) > 0) {
            current = !!sel.rows[0][act];
            // Toggle
            const updateQ = `UPDATE actions SET ${act} = $1;`;
            await client.query(updateQ, [!current]);
        } else {
            // No row yet: insert a row with the toggled value (and defaults false for others)
            // Build insert columns and values dynamically setting the desired act to true
            const cols = allowedActs.join(', ');
            const values = allowedActs.map((c) => (c === act ? 'TRUE' : 'FALSE')).join(', ');
            const insertQ = `INSERT INTO actions (${cols}) VALUES (${values});`;
            await client.query(insertQ);
            current = false; // previous
        }

        client.release();

        return createSecureResponse({ success: true, [act]: !current });
    } catch (error) {
        console.error('Error toggling act', error);
        return createSecureResponse({ error: 'Failed to toggle act' }, 500);
    }
}
