// POST: Press a button by browser
import { NextApiRequest, NextApiResponse } from 'next';
import { query } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { browser } = req.body;
    if (!browser) return res.status(400).json({ error: 'Missing browser' });

    try {
        // noinspection ES6RedundantAwait
        const result = await query(
            'UPDATE button_states SET clicked = TRUE WHERE browser = $1 AND clicked = FALSE RETURNING *',
            [browser]
        );
        if (result.rowCount === 0) {
            return res.status(409).json({ error: 'Already clicked or invalid browser' });
        }
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
}
