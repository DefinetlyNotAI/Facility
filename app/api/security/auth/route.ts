import type {NextRequest} from 'next/server';
import {NextResponse} from 'next/server';
import {createHash} from "crypto";
import {auth} from "@/lib/data/api";


export async function POST(request: NextRequest) {
    const body = await request.json();

    const password = body.password;
    if (!password) {
        return NextResponse.json({error: auth.passReqErr}, {status: 400});
    }

    const envPass = process.env.SMILEKING_PASS || '';
    if (password !== envPass) {
        return NextResponse.json({error: auth.incorrectPass}, {status: 401});
    }

    const hashed = createHash('sha256').update(envPass + process.env.SALT).digest('hex');

    return NextResponse.json({hashed}, {status: 200});
}

export async function GET() {
    // Optionally block GET or return something else
    return NextResponse.json({error: auth.invalidMethod}, {status: 405});
}
