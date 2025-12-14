import {NextResponse} from 'next/server';

// Minimal mock API route for local validation of plaque stages
// POST body expected: { plaqueId: string, stageIndex: number, provided?: string }
export async function POST(req: Request) {
    try {
        const body = await req.json();
        if (!body || typeof body.plaqueId !== 'string') {
            return NextResponse.json({ok: false, error: 'Invalid payload'}, {status: 400});
        }
        const provided = (body.provided || '').toString().trim();
        // Dev rule: non-empty provided => success
        if (provided.length > 0) {
            return NextResponse.json({ok: true, debug: {plaqueId: body.plaqueId, stageIndex: body.stageIndex}});
        }
        return NextResponse.json({ok: false, error: 'Empty provided value'});
    } catch (e) {
        return NextResponse.json({ok: false, error: 'Server error', debug: String(e)}, {status: 500});
    }
}
