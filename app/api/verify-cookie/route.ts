import {NextResponse} from 'next/server';
import crypto from 'crypto';
import {cookiesList} from "@/lib/cookie-utils";

const SECRET = process.env.COOKIE_SECRET || 'Unsecure';


function sign(data: string) {
    return crypto.createHmac('sha256', SECRET).update(data).digest('hex');
}

export async function GET(request: Request) {
    const cookieHeader = request.headers.get('cookie');
    if (!cookieHeader) {
        // No cookies at all — valid since nothing to verify
        return NextResponse.json({valid: true});
    }

    const cookies = Object.fromEntries(
        cookieHeader.split('; ').map(cookie => {
            const [name, ...rest] = cookie.split('=');
            return [name.trim(), rest.join('=').trim()];
        })
    );

    // Filter cookies to only those in the whitelist and present
    const relevantCookies = Object.entries(cookies)
        .filter(([name]) => cookiesList.includes(name));

    // Verify all relevant cookies
    for (const [key, rawValue] of relevantCookies) {
        const lastDot = rawValue.lastIndexOf('.');
        if (lastDot === -1) {
            return NextResponse.json({valid: false});
        }

        const value = rawValue.substring(0, lastDot);
        const signature = rawValue.substring(lastDot + 1);

        const expectedSignature = sign(`${key}=${value}`);

        if (signature !== expectedSignature) {
            return NextResponse.json({valid: false});
        }
    }

    // If no relevant cookies or all valid
    return NextResponse.json({valid: true});
}
