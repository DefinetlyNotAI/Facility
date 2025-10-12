import {NextRequest} from 'next/server';
import {createSecureResponse} from '@/lib/utils';
import {dbPool} from '@/lib/db';
import {allowedActs} from "@/lib/data/api";


export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const act = url.searchParams.get('act');

        if (!act || !allowedActs.includes(act)) {
            return createSecureResponse({error: 'Invalid or missing act parameter, try /api/bonus-check-all to see all available acts'}, 400);
        }

        const client = await dbPool.connect();
        const q = `SELECT ${act}
                   FROM actions LIMIT 1;`;
        const res = await client.query(q);
        client.release();

        if (res.rowCount === 0) {
            // No row yet, default false
            return createSecureResponse({[act]: false});
        }

        return createSecureResponse({[act]: !!res.rows[0][act]});
    } catch (error) {
        console.error('Error checking act', error);
        return createSecureResponse({error: 'Failed to check act'}, 500);
    }
}
