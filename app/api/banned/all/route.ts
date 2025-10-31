// Implement GET /api/banned/all - returns all rows from banned in a neat structure
import { NextRequest } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import {createSecureResponse, verifyAdmin} from '@/lib/utils';
import { dbPool } from '@/lib/db';

export async function GET(req: NextRequest) {
    const authError = verifyAdmin(req);
    if (authError) return authError;

    // Try DB first (if available), return array of IP strings.
    try {
        if (dbPool) {
            const client = await dbPool.connect();
            try {
                const q = `SELECT ip FROM banned ORDER BY created_at DESC;`;
                const res = await client.query(q);
                const ips = Array.isArray(res.rows) ? res.rows.map((r: any) => String(r.ip).trim()).filter(Boolean) : [];
                return createSecureResponse(ips);
            } finally {
                client.release();
            }
        }
    } catch (dbErr) {
        // If DB read fails, fallback to file storage below
        console.error('DB fetch for banned list failed, falling back to file store:', dbErr);
    }

    // Fallback: read from data/banned.json (array of strings)
    try {
        const dataDir = path.resolve(process.cwd(), 'data');
        const filePath = path.join(dataDir, 'banned.json');

        let current: string[];
        try {
            const raw = await fs.readFile(filePath, 'utf8');
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) current = parsed.map((p: any) => String(p).trim()).filter(Boolean);
            else if (parsed && typeof parsed === 'object' && Array.isArray((parsed as any).ips)) current = (parsed as any).ips.map((p: any) => String(p).trim()).filter(Boolean);
            else current = [];
        } catch {
            current = [];
        }

        return createSecureResponse(current);
    } catch (err) {
        console.error('Error reading banned fallback file:', err);
        return createSecureResponse({ error: 'Server error reading banned list' }, 500);
    }
}
