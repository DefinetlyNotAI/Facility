import {NextResponse} from 'next/server';
import {PlaqueId, validateKeyword} from '@/lib/server/chapters.server';
import {makeSignedValue} from '@/lib/server/cookies.server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const plaqueId = String(body.plaqueId || '');
        const provided = String(body.provided || '');
        if (!plaqueId || !provided) return NextResponse.json({ok: false, message: 'Invalid input'}, {status: 400});

        const ok = validateKeyword(plaqueId as PlaqueId, provided);
        if (!ok) return NextResponse.json({ok: false, message: 'Incorrect phrase'}, {status: 200});

        // Create signed cookie payload
        const payload = {unlocked: [plaqueId], t: Date.now()};
        const signed = makeSignedValue(payload);
        const res = NextResponse.json({ok: true});
        // Set HttpOnly cookie
        res.cookies.set({
            name: 'chapIV_auth',
            value: signed,
            httpOnly: true,
            path: '/',
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24
        });
        return res;
    } catch (e) {
        return NextResponse.json({ok: false, message: 'Server error'}, {status: 500});
    }
}
