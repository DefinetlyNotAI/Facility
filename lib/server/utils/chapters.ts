// Server-only utilities for chapter IV
import crypto from 'crypto';
import {PlaqueId} from "@/types";
import {PUZZLES} from "@/lib/data/chapters/chapters.server";

const COOKIE_SECRET = process.env.COOKIE_SECRET || 'please_set_a_real_secret_in_production';

function signPayload(payload: string, secret = COOKIE_SECRET) {
    return crypto.createHmac('sha256', secret).update(payload).digest('hex');
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

function normalize(input?: unknown) {
    if (typeof input !== 'string') return '';
    return input.trim().toLowerCase();
}

export function validateKeyword(plaqueId: string, provided: string): boolean {
    if (!plaqueId) return false;
    const id = plaqueId as PlaqueId;
    const p = PUZZLES[id];
    if (!p) return false;
    console.log('Validating keyword for', plaqueId, 'provided:', provided, 'expected:', p.keyword);
    return normalize(p.keyword) === normalize(provided);
}

export function validateStageAnswer(plaqueId: string, stageIndex: number, provided: string): boolean {
    const id = plaqueId as PlaqueId;
    const p = PUZZLES[id];
    if (!p) return false;
    const ans = p.stageAnswers?.[stageIndex];
    if (!ans) return false;
    return normalize(ans) === normalize(provided);
}

export function verifySignedValue(value: string, secret = COOKIE_SECRET) {
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

export function makeSignedValue(obj: any, secret = COOKIE_SECRET) {
    const json = JSON.stringify(obj);
    const sig = signPayload(json, secret);
    return `${Buffer.from(json).toString('base64')}.${sig}`;
}
