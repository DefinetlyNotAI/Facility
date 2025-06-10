import type {NextRequest} from 'next/server';
import {NextResponse} from 'next/server';

function simpleHash(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }
    return hash.toString(16);
}

export async function POST(request: NextRequest) {
    const body = await request.json();

    const password = body.password;
    if (!password) {
        return NextResponse.json({error: 'Password required'}, {status: 400});
    }

    const envPass = process.env.SMILEKING_PASS || '';
    if (password !== envPass) {
        return NextResponse.json({error: 'Incorrect password'}, {status: 401});
    }

    const hashed = simpleHash(password);

    return NextResponse.json({hashed}, {status: 200});
}

export async function GET() {
    // Optionally block GET or return something else
    return NextResponse.json({error: 'Method not allowed'}, {status: 405});
}
