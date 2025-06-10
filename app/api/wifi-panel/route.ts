import {createSecureResponse} from '@/lib/utils';

export async function GET(req: Request) {
    const userAgent = req.headers.get('user-agent')?.toLowerCase() || '';

    if (userAgent.includes('curl') || userAgent.includes('wget')) {
        return createSecureResponse({keyword2: 'Fletchling'});
    } else {
        return new Response('USE WHAT TOOLS WERE IMPOSED ON YOU', {
            status: 403,
            headers: {
                'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
                'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'; base-uri 'none';",
                'X-Frame-Options': 'DENY',
                'X-Content-Type-Options': 'nosniff',
                'Referrer-Policy': 'no-referrer',
                'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
                'Content-Type': 'text/plain; charset=utf-8',
            },
        });
    }
}
