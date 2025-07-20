import {NextResponse} from 'next/server';
import React from "react";

// Message Render Helper - Used for /choices
export function renderMsg(msg: string) {
    // Replace /n with <br />
    const parts = msg.split("/n");
    return parts.map((part, idx) =>
        idx === 0 ? part : [<br key={idx}/>, part]
    );
}

// Secure Response Helper - Used for API responses
export function createSecureResponse(body: any, status = 200) {
    return NextResponse.json(body, {
        status,
        headers: {
            'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
            'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'; base-uri 'none';",
            'X-Frame-Options': 'DENY',
            'X-Content-Type-Options': 'nosniff',
            'Referrer-Policy': 'no-referrer',
            'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
        },
    });
}

// Keyword Check - Used for many endpoints to securely check if a keyword is valid without exposing the keyword itself
export const checkKeyword = async (keyword: string, number: number): Promise<boolean> => {
    const res = await fetch('/api/keyword', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({keyword, number}),
    });
    const data = await res.json();
    return !!data.match;
};

// IP fetch Function
export async function fetchUserIP(): Promise<string> {
    try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        return data.ip;
    } catch {
        return 'UNKNOWN';
    }
}

// SID of user - Local Storage Helper
export const getOrCreateSessionId = () => {
    let storedId = localStorage.getItem('sessionId');
    if (!storedId) {
        storedId = `SID-${Math.random().toString(36).slice(2, 9)}`;
        localStorage.setItem('sessionId', storedId);
    }
    return storedId;
};
