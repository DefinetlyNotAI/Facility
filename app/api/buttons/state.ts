// GET: Returns all button states
import { NextApiResponse } from 'next';
import { query } from '@/lib/db';

export default async function handler(res: NextApiResponse) {
    try {
        // noinspection ES6RedundantAwait
        const result = await query('SELECT * FROM button_states');
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch button state' });
    }
}
