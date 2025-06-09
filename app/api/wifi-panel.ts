import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const userAgent = req.headers['user-agent']?.toLowerCase() || '';

    if (userAgent.includes('curl') || userAgent.includes('wget')) {
        res.status(200).json({ keyword2: 'Fletchling' });
    } else {
        res.status(403).send('USE WHAT TOOLS WERE IMPOSED ON YOU'); // fallback, only serve JSON to curl/wget
    }
}
