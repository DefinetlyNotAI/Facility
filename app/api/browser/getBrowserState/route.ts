import {createSecureResponse} from '@/lib/utils';
import {genericErrors} from "@/lib/data/api";
import {dbPool} from "@/lib/db";


export async function GET() {
    try {
        const client = await dbPool.connect();
        const res = await client.query('SELECT browser, clicked FROM button_states;');
        client.release();
        return createSecureResponse(res.rows);
    } catch (error) {
        return createSecureResponse({error: genericErrors.failedToFetch}, 500);
    }
}
