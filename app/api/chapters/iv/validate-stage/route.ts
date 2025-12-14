import {NextResponse} from 'next/server';
import {PlaqueId, validateStageAnswer} from '@/lib/data/chapters/chapters.server';
import {makeSignedValue, verifySignedValue} from '@/lib/utils/chIV.cookies.server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const plaqueId = String(body.plaqueId || '');
        const stageIndex = Number(body.stageIndex);
        const provided = String(body.provided || '');
        if (!plaqueId || isNaN(stageIndex) || !provided) return NextResponse.json({
            ok: false,
            message: 'Invalid input'
        }, {status: 400});

        const ok = validateStageAnswer(plaqueId as PlaqueId, stageIndex, provided);
        if (!ok) return NextResponse.json({ok: false, message: 'Incorrect answer'}, {status: 200});

        // Optionally extend unlocked plaques in cookie
        const raw = req.headers.get('cookie') || '';
        // naive read; proper approach uses NextRequest cookies but this is server-only route
        const existing = (() => {
            try {
                const m = raw.match(new RegExp('chapIV_auth=([^;]+)'));
                if (!m) return null;
                const val = decodeURIComponent(m[1]);
                return verifySignedValue(val);
            } catch (e) {
                return null;
            }
        })();

        const prev = existing?.unlocked || [];
        const unlocked = Array.from(new Set([...prev, plaqueId]));
        const payload = {unlocked, t: Date.now()};
        const signed = makeSignedValue(payload);

        const res = NextResponse.json({ok: true});
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
