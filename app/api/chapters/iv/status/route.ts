import {NextResponse} from 'next/server';
import {verifySignedValue} from '@/lib/utils/chIV.cookies.server';

export async function GET(req: Request) {
    try {
        const raw = req.headers.get('cookie') || '';
        const m = raw.match(new RegExp('chapIV_auth=([^;]+)'));
        if (!m) return NextResponse.json({plaqueStatuses: []});
        const val = decodeURIComponent(m[1]);
        const data = verifySignedValue(val);
        if (!data) return NextResponse.json({plaqueStatuses: []});
        const unlocked: string[] = data.unlocked || [];
        // Map to statuses
        const plaqueStatuses = unlocked.map(id => ({id, status: 'solved'}));
        return NextResponse.json({plaqueStatuses});
    } catch (e) {
        return NextResponse.json({plaqueStatuses: []});
    }
}
