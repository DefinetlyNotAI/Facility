// lib/db.ts
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL, // Store safely in .env
    ssl: {
        rejectUnauthorized: false,
    },
});

export const query = (text: string, params?: any[]) => pool.query(text, params);
