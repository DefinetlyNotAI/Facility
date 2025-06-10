import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    if (pathname.startsWith('/_next') || pathname.startsWith('/api')) {
        return NextResponse.next()
    }

    const accepted = request.cookies.get('accepted')?.value
    const end = request.cookies.get('End')
    const corrupting = request.cookies.get('corrupting')

    // Redirect priority order:
    // 1. Else if accepted cookie is not true, redirect to / (unless already there)
    if (accepted !== 'true') {
        if (pathname !== '/') {
            return NextResponse.redirect(new URL('/', request.url))
        }
        else {
            return NextResponse.next()
        }
    }


    // 2. Else if corrupting cookie exists, redirect to /h0m3 (unless already there)
    else if (corrupting) {
        if (pathname !== '/h0m3') {
            return NextResponse.redirect(new URL('/h0m3', request.url))
        }
        else {
            return NextResponse.next()
        }
    }

    // 3. If End cookie exists, redirect to /the-end (unless already there)
    else if (end) {
        if (pathname !== '/the-end') {
            return NextResponse.redirect(new URL('/the-end', request.url))
        }
        else {
            return NextResponse.next()
        }
    }

    // Otherwise, continue normally with security
    const response = NextResponse.next();
    if (process.env.NODE_ENV === 'production') {
        response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
        response.headers.set(
            'Content-Security-Policy',
            "default-src 'self'; " +
            "script-src 'self'; " +
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
            "font-src 'self' https://fonts.gstatic.com;"
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
