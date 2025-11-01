// Implement GET /api/banned/all - returns count of banned IPs
import fs from 'fs/promises';
import path from 'path';
import { createSecureResponse } from '@/lib/utils';
import { dbPool } from '@/lib/db';

export async function GET() {
    // Try DB first (if available)
    try {
        if (dbPool) {
            const client = await dbPool.connect();
            try {
                const q = `SELECT COUNT(*) AS count FROM banned;`;
                const res = await client.query(q);
                const count = res.rows?.[0]?.count ? Number(res.rows[0].count) : 0;
                return createSecureResponse({ count });
            } finally {
                client.release();
            }
        }
    } catch (dbErr) {
        console.error('DB fetch for banned count failed, falling back to file store:', dbErr);
    }

    // Fallback: read from data/banned.json
    try {
        const dataDir = path.resolve(process.cwd(), 'data');
        const filePath = path.join(dataDir, 'banned.json');

        let count = 0;
        try {
            const raw = await fs.readFile(filePath, 'utf8');
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) count = parsed.length;
            else if (parsed && typeof parsed === 'object' && Array.isArray((parsed as any).ips)) count = (parsed as any).ips.length;
        } catch {
            count = 0;
        }

        return createSecureResponse({ count });
    } catch (err) {
        console.error('Error reading banned fallback file:', err);
        return createSecureResponse({ error: 'Server error reading banned list' }, 500);
    }
}
