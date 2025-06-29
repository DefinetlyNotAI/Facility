import {NextRequest} from 'next/server';
import {Pool} from 'pg';
import fs from 'fs';
import path from 'path';
import {createSecureResponse} from '@/lib/utils';


const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
        rejectUnauthorized: true, // Enforce cert validation
        ca: fs.readFileSync(path.join(process.cwd(), 'certs', 'ca.pem')).toString(),
    },
});

export async function POST(req: NextRequest) {
    try {
        const csrfTokenFromCookie = req.cookies.get('csrf-token')?.value;
        const csrfTokenFromHeader = req.headers.get('x-csrf-token');
        const ignoreAlreadyPressed = req.headers.get('ignore-already-pressed') === 'true';

        if (!csrfTokenFromCookie || !csrfTokenFromHeader || csrfTokenFromCookie !== csrfTokenFromHeader) {
            return createSecureResponse({error: 'Invalid CSRF token'}, 403);
        }

        const {browser} = await req.json();

        if (!browser) {
            return createSecureResponse({error: 'Browser not specified'}, 400);
        }

        const client = await pool.connect();

        // Check if already clicked
        const result = await client.query(
            'SELECT clicked FROM button_states WHERE browser = $1;',
            [browser]
        );

        if (result.rowCount === 0) {
            client.release();
            return createSecureResponse({error: 'Browser not found'}, 404);
        }

        const currentState = result.rows[0].clicked;

        if (!ignoreAlreadyPressed && currentState) {
            client.release();
            return createSecureResponse({error: `Already pressed`}, 409);
        }

        // If strict, set to true; if flexible, toggle
        const newClickedState = ignoreAlreadyPressed ? !currentState : true;

        await client.query(
            'UPDATE button_states SET clicked = $1 WHERE browser = $2;',
            [newClickedState, browser]
        );

        client.release();
        return createSecureResponse({success: true, clicked: newClickedState});
    } catch (error) {
        console.error('Error pressing button:', error);
        return createSecureResponse({error: 'Internal server error'}, 500);
    }
}
