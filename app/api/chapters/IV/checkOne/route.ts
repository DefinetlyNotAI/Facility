import { createSecureResponse } from '@/lib/utils';
import { dbPool } from '@/lib/db';

export async function GET() {
    let client;
    try {
        client = await dbPool.connect();

        // Fetch public chapter IV data
        const chapterRes = await client.query(
            `SELECT id, status FROM chapters WHERE roman_numeral = 'IV' LIMIT 1;`
        );

        if (chapterRes.rowCount === 0) {
            return createSecureResponse({ error: 'Chapter IV not found' }, 404);
        }

        const chapter = chapterRes.rows[0];

        return createSecureResponse({
            chapter: {
                id: chapter.id,
                status: chapter.status
            }
        });
    } catch (error) {
        console.error('Failed to fetch public Chapter IV data', error);
        return createSecureResponse(
            { error: 'Failed to fetch public Chapter IV data' },
            500
        );
    } finally {
        if (client) {
            try { client.release(); } catch (e) { console.error('Failed to release DB client', e); }
        }
    }
}
