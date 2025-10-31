import { NextRequest } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import {createSecureResponse, isValidIP, verifyAdmin} from '@/lib/utils';
import { dbPool } from '@/lib/db';


export async function POST(req: NextRequest) {
    const authError = verifyAdmin(req);
    if (authError) return authError;

    // Parse body
    let body: any;
    try {
        body = await req.json();
    } catch {
        return createSecureResponse({ error: 'Invalid JSON body' }, 400);
    }

    const ip = body?.ip;
    if (!isValidIP(ip)) {
        return createSecureResponse({ error: 'Invalid IP provided' }, 400);
    }

    const normalized = String(ip).trim();

    // 1) Try DB deletion first (preferred store)
    let dbClient: any = null;
    try {
        if (dbPool) {
            dbClient = await dbPool.connect();
            try {
                const delRes = await dbClient.query(
                    `DELETE FROM banned WHERE ip = $1 RETURNING id;`,
                    [normalized]
                );

                const dbRemovedCount = delRes?.rowCount ?? (Array.isArray(delRes?.rows) ? delRes.rows.length : 0);
                if (dbRemovedCount > 0) {
                    return createSecureResponse({ success: true, removed: true, removedCount: dbRemovedCount });
                }
                // if not removed in DB, fall through to file fallback
            } finally {
                dbClient.release();
                dbClient = null;
            }
        }
    } catch (dbErr) {
        console.error('DB delete failed, falling back to file-store:', dbErr);
        try { dbClient?.release?.(); } catch {}
    }

    // 2) Fallback: file-based storage (simple). Path: <repo-root>/data/banned.json
    const dataDir = path.resolve(process.cwd(), 'data');
    const filePath = path.join(dataDir, 'banned.json');

    try {
        // ensure data directory exists
        await fs.mkdir(dataDir, { recursive: true });

        let raw = '';
        let parsed: any;
        try {
            raw = await fs.readFile(filePath, 'utf8');
            parsed = JSON.parse(raw);
        } catch {
            // file may not exist or invalid -> keep parsed as null
            parsed = null;
        }

        // Detect shape and remove matching entries
        let removedCount: number;
        let out: any;

        if (Array.isArray(parsed)) {
            const arr = parsed as any[];
            const allStrings = arr.every(p => typeof p === 'string');
            const allObjectsWithIp = arr.every(p => p && typeof p === 'object' && ('ip' in p));

            if (allStrings) {
                const before = arr.length;
                out = arr.filter(s => String(s).trim() !== normalized);
                removedCount = before - out.length;
            } else if (allObjectsWithIp) {
                const before = arr.length;
                out = arr.filter(obj => String(obj.ip ?? '').trim() !== normalized);
                removedCount = before - out.length;
            } else {
                const before = arr.length;
                out = arr.filter(entry => {
                    const candidate = entry && typeof entry === 'object' ? String(entry.ip ?? '') : String(entry ?? '');
                    return String(candidate).trim() !== normalized;
                });
                removedCount = before - out.length;
            }
        } else if (parsed && typeof parsed === 'object' && Array.isArray((parsed as any).ips)) {
            const ipsArr = (parsed as any).ips as any[];
            const before = ipsArr.length;
            const newIps = ipsArr.filter((p: any) => String(p).trim() !== normalized);
            removedCount = before - newIps.length;
            out = { ...parsed, ips: newIps };
        } else {
            // Nothing meaningful in file -> treat as empty list (no removal)
            out = [];
            removedCount = 0;
        }

        // Prepare content to write back, preserving original shape where possible.
        let toWrite: string;
        if (Array.isArray(parsed)) {
            toWrite = JSON.stringify(Array.isArray(out) ? out : [], null, 2);
        } else if (parsed && typeof parsed === 'object' && Array.isArray((parsed as any).ips)) {
            toWrite = JSON.stringify(out ?? { ips: [] }, null, 2);
        } else {
            const arr = Array.isArray(out) ? out.map((x: any) => (typeof x === 'string' ? x : String(x))) : [];
            toWrite = JSON.stringify(arr, null, 2);
        }

        await fs.writeFile(filePath, toWrite, 'utf8');

        return createSecureResponse({ success: true, removed: removedCount > 0, removedCount });
    } catch (err) {
        console.error('Error in banned remove route (file fallback):', err);
        return createSecureResponse({ error: 'Server error during removal' }, 500);
    }
}
