import {NextResponse} from 'next/server';
import crypto from 'crypto';

const SECRET = process.env.COOKIE_SECRET || 'Unsecure';

// Sign function for integrity
function sign(data: string) {
    return crypto.createHmac('sha256', SECRET).update(data).digest('hex');
}

export async function POST(request: Request) {
    const {data} = await request.json();

    if (!data || typeof data !== 'string' || !data.includes('=')) {
        return NextResponse.json({error: 'Invalid data format. Expected key=value'}, {status: 400});
    }

    const [key, ...rest] = data.split('=');
    const value = rest.join('=');

    if (!key || !value) {
        return NextResponse.json({error: 'Missing key or value'}, {status: 400});
    }

    const signature = sign(`${key}=${value}`);
    const cookieValue = `${value}.${signature}`;

    const response = NextResponse.json({success: true});

    response.headers.append(
        'Set-Cookie',
        `${key}=${cookieValue}; Path=/; Secure; SameSite=Strict; Max-Age=315360000` // ~10 years
    );

    return response;
}
