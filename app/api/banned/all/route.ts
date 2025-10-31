// Implement GET /api/banned/all - returns all rows from banned in a neat structure
import {createSecureResponse} from '@/lib/utils';
import {dbPool} from '@/lib/db';

export async function GET() {
    try {
        const client = await dbPool.connect();
        const q = `SELECT id, ip, reason, created_at FROM banned ORDER BY created_at DESC;`;
        const res = await client.query(q);
        client.release();

        // Return rows directly - callers can format as needed
        return createSecureResponse({banned: res.rows});
    } catch (error) {
        console.error('Error fetching banned list:', error);
        return createSecureResponse({error: 'Failed to fetch banned list'}, 500);
    }
}
