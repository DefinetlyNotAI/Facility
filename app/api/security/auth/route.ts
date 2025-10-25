import type {NextRequest} from 'next/server';
import {NextResponse} from 'next/server';
import jwt from 'jsonwebtoken';
import {auth} from "@/lib/data/api";
import {cookies} from "@/lib/saveData";


export async function POST(request: NextRequest) {
    const body = await request.json();

    const password = body.password;
    if (!password) {
        return NextResponse.json({error: auth.passReqErr}, {status: 400});
    }

    const envPass = process.env.SMILEKING_PASS || '';
    const jwtSecret = process.env.JWT_SECRET || '';

    if (!jwtSecret) {
        // Server misconfiguration: don't leak secrets to client
        return NextResponse.json({error: auth.serverConfigErr}, {status: 500});
    }

    if (password !== envPass) {
        return NextResponse.json({error: auth.incorrectPass}, {status: 401});
    }

    // Create JWT (no sensitive data in payload). Short expiry.
    const token = jwt.sign(
        {role: 'admin'},
        jwtSecret,
        {expiresIn: '1h'}
    );

    // Create response and set httpOnly cookie so client JS can't read the token
    const res = NextResponse.json({success: true}, {status: 200});
    // Set secure cookie flags; maxAge matches token expiry (3600s)
    res.cookies.set({
        name: cookies.adminPass,
        value: token,
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60,
    });

    return res;
}

export async function GET() {
    // Optionally block GET or return something else
    return NextResponse.json({error: auth.invalidMethod}, {status: 405});
}
