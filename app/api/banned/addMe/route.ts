// Add POST /api/banned/addMe - adds an IP to the banned table
import {createSecureResponse} from '@/lib/utils';
import {dbPool} from '@/lib/db';
import {bonusMsg} from '@/lib/data/api';

export async function POST(req: Request) {
    let client: any;
    try {
        // --- CSRF Validation ---
        const csrfTokenFromCookie = (req as any).cookies?.get("csrf-token")?.value;
        const csrfTokenFromHeader = req.headers.get("x-csrf-token");
        if (!csrfTokenFromCookie || !csrfTokenFromHeader || csrfTokenFromHeader !== csrfTokenFromCookie) {
            return createSecureResponse({error: bonusMsg.invalidCsrf}, 403);
        }

        const body = await req.json().catch(() => null);
        const ip = body?.ip;
        const reason = body?.reason ?? null;

        if (!ip) {
            return createSecureResponse({error: 'Missing ip in body'}, 400);
        }

        client = await dbPool.connect();
        // Insert or update reason if ip already exists. Return the row.
        const insertQ = `INSERT INTO banned (ip, reason)
                         VALUES ($1, $2)
                         ON CONFLICT (ip) DO UPDATE SET reason = COALESCE(EXCLUDED.reason, banned.reason)
                         RETURNING id, ip, reason, created_at;`;
        const r = await client.query(insertQ, [ip, reason]);

        return createSecureResponse({banned: true, entry: r.rows[0]});
    } catch (error) {
        console.error('Error adding banned ip:', error);
        return createSecureResponse({error: 'Failed to add banned ip'}, 500);
    } finally {
        client?.release?.();
    }
}
