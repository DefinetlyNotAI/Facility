import {NextRequest, NextResponse} from 'next/server';

const SECRET = process.env.COOKIE_SECRET || 'Unsecure';
const cookiesList = [
    'accepted', 'Scroll_unlocked', 'Wifi_Unlocked', 'Corrupt',
    'wifi_login', 'Media_Unlocked', 'Button_Unlocked', 'File_Unlocked',
    'corrupting', 'No_corruption', 'BnW_unlocked', 'Choice_Unlocked',
    'terminal_unlocked', 'End?', 'End',
    'moonlight_time_cutscene_played',
    'Interference_cutscene_seen', 'KILLTAS_cutscene_seen',
];

async function sign(data: string): Promise<string> {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
        'raw',
        enc.encode(SECRET),
        {name: 'HMAC', hash: 'SHA-256'},
        false,
        ['sign']
    );

    const signature = await crypto.subtle.sign('HMAC', key, enc.encode(data));
    return Buffer.from(signature).toString('hex');
}

async function verifyRelevantCookies(request: NextRequest): Promise<boolean> {
    const relevant = cookiesList.map(name => request.cookies.get(name)).filter(Boolean);

    for (const cookie of relevant) {
        if (!cookie) continue;
        console.debug(`[verifyRelevantCookies] Verifying cookie: ${cookie.name} = ${cookie.value}`);

        const raw = cookie?.value || '';
        const lastDot = raw.lastIndexOf('.');
        if (lastDot === -1) {
            console.debug(`[verifyRelevantCookies] Cookie ${cookie.name} missing signature, invalid`);
            return false;
        }

        const value = raw.slice(0, lastDot);
        const signature = raw.slice(lastDot + 1);

        const expectedSignature = await sign(`${cookie.name}=${value}`);
        console.debug(`[verifyRelevantCookies] Expected signature: ${expectedSignature} vs Actual signature: ${signature}`);

        if (signature !== expectedSignature) {
            console.debug(`[verifyRelevantCookies] Signature mismatch on cookie ${cookie.name}, invalid`);
            return false;
        }
    }

    console.debug('[verifyRelevantCookies] All relevant cookies verified successfully');
    return true;
}


export async function middleware(request: NextRequest) {
    const {pathname} = request.nextUrl;

    // Skip static + API routes
    if (pathname.startsWith('/_next') || pathname.startsWith('/api')) {
        return NextResponse.next();
    }

    if (pathname !== '/CHEATER') {
        const isValid = await verifyRelevantCookies(request);

        if (!isValid) {
            return NextResponse.redirect(new URL('/CHEATER', request.url));
        }
    }


    const accepted = request.cookies.get('accepted')?.value;
    const end = request.cookies.get('End');
    const corrupting = request.cookies.get('corrupting');

    // Redirection logic (no refresh loops)
    if (pathname !== '/smileking' && pathname !== '/smileking-auth' && pathname !== '/CHEATER') {
        if (!accepted && pathname !== '/') {
            return NextResponse.redirect(new URL('/', request.url));
        } else if (corrupting && pathname !== '/h0m3') {
            return NextResponse.redirect(new URL('/h0m3', request.url));
        } else if (end && pathname !== '/the-end') {
            return NextResponse.redirect(new URL('/the-end', request.url));
        }
    }

    // Security headers (optional)
    const response = NextResponse.next();

    if (process.env.NODE_ENV === 'production') {
        response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
        response.headers.set(
            'Content-Security-Policy',
            "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;"
        );
        response.headers.set('X-Frame-Options', 'DENY');
        response.headers.set('X-Content-Type-Options', 'nosniff');
        response.headers.set('Referrer-Policy', 'no-referrer');
        response.headers.set('Permissions-Policy', 'geolocation=(), microphone=()');
    }

    return response;
}

export const config = {
    matcher: '/:path*',
}
