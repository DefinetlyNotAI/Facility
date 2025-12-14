// Server-only cookie signing utilities for chapter IV gating
import crypto from 'crypto';

const DEFAULT_SECRET = process.env.COOKIE_SECRET || 'please_set_a_real_secret_in_production';

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

// Chapter IV client-side JSON cookie utilities (only used in Entity and WhiteRoom)
export function getJsonCookie(name: string): any | null {
    try {
        const match = document.cookie.split(';').map(s => s.trim()).find(c => c.startsWith(name + '='));
        if (!match) return null;
        return JSON.parse(decodeURIComponent(match.split('=')[1] || ''));
    } catch (e) {
        return null;
    }
}

export function setJsonCookie(name: string, obj: any, days = 365) {
    try {
        const v = encodeURIComponent(JSON.stringify(obj));
        const d = new Date();
        d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${v}; path=/; expires=${d.toUTCString()}; SameSite=Lax`;
    } catch (e) {
    }
}
