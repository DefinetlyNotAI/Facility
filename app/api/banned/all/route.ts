// Implement GET /api/banned/all - returns all rows from banned in a neat structure
import {NextRequest} from 'next/server';
import {createSecureResponse, verifyAdmin} from '@/lib/utils';
import {dbPool} from '@/lib/db';
import {genericErrors} from "@/lib/data/api";

export async function GET(req: NextRequest) {
    const authError = verifyAdmin(req);
    if (authError) return authError;

    try {
        if (dbPool) {
            const client = await dbPool.connect();
            try {
                const q = `SELECT ip
                           FROM banned
                           ORDER BY created_at DESC;`;
                const res = await client.query(q);
                const ips = Array.isArray(res.rows) ? res.rows.map((r: any) => String(r.ip).trim()).filter(Boolean) : [];
                return createSecureResponse(ips);
            } finally {
                client.release();
            }
        }
    } catch (dbErr) {
        return createSecureResponse({error: genericErrors.ip.dbError}, 500);
    }
}
