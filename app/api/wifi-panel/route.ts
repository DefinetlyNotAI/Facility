import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const userAgent = req.headers.get('user-agent')?.toLowerCase() || '';

    if (userAgent.includes('curl') || userAgent.includes('wget')) {
        return NextResponse.json({ keyword2: 'Fletchling' });
    } else {
        return new Response('USE WHAT TOOLS WERE IMPOSED ON YOU', { status: 403 });
    }
}
