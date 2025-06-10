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

    // Otherwise, continue normally
    return NextResponse.next()
}

export const config = {
    matcher: '/:path*',
}
