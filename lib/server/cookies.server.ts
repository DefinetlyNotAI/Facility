// Server-only cookie signing utilities for chapter IV gating
import crypto from 'crypto';

const DEFAULT_SECRET = process.env.CHAPTER_IV_COOKIE_SECRET || '';
if (!DEFAULT_SECRET) {
    // Note: In production you MUST set CHAPTER_IV_COOKIE_SECRET env var.
    // We don't throw here to avoid breaking local dev, but signing will be weaker.
}

const ALGO = 'sha256';

export function signPayload(payload: string, secret = DEFAULT_SECRET) {
    return crypto.createHmac(ALGO, secret).update(payload).digest('hex');
}

export function makeSignedValue(obj: any, secret = DEFAULT_SECRET) {
    const json = JSON.stringify(obj);
    const sig = signPayload(json, secret);
    return `${Buffer.from(json).toString('base64')}.${sig}`;
}

export function verifySignedValue(value: string, secret = DEFAULT_SECRET) {
    if (!value) return null;
    const [b64, sig] = value.split('.');
    if (!b64 || !sig) return null;
    try {
        const json = Buffer.from(b64, 'base64').toString('utf8');
        const expected = signPayload(json, secret);
        if (!timingSafeEqual(expected, sig)) return null;
        return JSON.parse(json);
    } catch (e) {
        return null;
    }
}

function timingSafeEqual(a: string, b: string) {
    try {
        const ab = Buffer.from(a, 'hex');
        const bb = Buffer.from(b, 'hex');
        if (ab.length !== bb.length) return false;
        return crypto.timingSafeEqual(ab, bb);
    } catch (e) {
        return false;
    }
}

