import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';


const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
        rejectUnauthorized: true,  // Enforce cert validation
        ca: fs.readFileSync(path.join(process.cwd(), 'certs', 'ca.pem')).toString(),
    },
});

export async function POST(req: NextRequest) {
    try {
        const { browser } = await req.json();

        if (!browser) {
            return NextResponse.json({ error: 'Browser not specified' }, { status: 400 });
        }

        const client = await pool.connect();

        // Check if already clicked
        const result = await client.query(
            'SELECT clicked FROM button_states WHERE browser = $1;',
            [browser]
        );

        if (result.rowCount === 0) {
            client.release();
            return NextResponse.json({ error: 'Browser not found' }, { status: 404 });
        }

        if (result.rows[0].clicked) {
            client.release();
            return NextResponse.json({ error: 'Already pressed' }, { status: 409 });
        }

        // Update the clicked status
        await client.query(
            'UPDATE button_states SET clicked = TRUE WHERE browser = $1;',
            [browser]
        );

        client.release();
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error pressing button:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
