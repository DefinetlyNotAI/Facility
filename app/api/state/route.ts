import { NextResponse } from 'next/server';
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

export async function GET() {
    try {
        const client = await pool.connect();
        const res = await client.query('SELECT browser, clicked FROM button_states;');
        client.release();
        return NextResponse.json(res.rows);
    } catch (error) {
        console.error('Error fetching button states:', error);
        return NextResponse.json({ error: 'Failed to fetch states' }, { status: 500 });
    }
}
