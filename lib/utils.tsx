import {NextResponse} from 'next/server';
import React from "react";
import {localStorageKeys, routes} from "@/lib/saveData";
import {BonusAct, BonusResponse, ChangeNextStateResponse, ChapterIVCheckAllResponse} from "@/lib/types/api";
import {errorText} from "@/lib/data/utils";
import {type ClassValue, clsx} from 'clsx';
import {twMerge} from 'tailwind-merge';

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
    const res = await fetch(routes.api.utils.checkKeyword, {
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
    let storedId = localStorage.getItem(localStorageKeys.sessionId);
    if (!storedId) {
        storedId = `SID-${Math.random().toString(36).slice(2, 9)}`;
        localStorage.setItem(localStorageKeys.sessionId, storedId);
    }
    return storedId;
};

// Sign Cookie Function - Used to sign cookies securely
export async function signCookie(data: string): Promise<{ success: boolean; error?: string }> {
    try {
        const res = await fetch(routes.api.utils.signCookie, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({data}),
        });

        if (!res.ok) {
            const errorData = await res.json();
            return {success: false, error: errorData.error || errorText.CookieSignFailed};
        }

        return {success: true};
    } catch (e) {
        return {success: false, error: (e as Error).message};
    }
}

// Get user OS
export function detectOsBrowser(ua: string) {
    let os = "Unknown OS";
    if (/windows/i.test(ua)) os = "Windows";
    else if (/mac/i.test(ua)) os = "MacOS";
    else if (/linux/i.test(ua)) os = "Linux";
    else if (/android/i.test(ua)) os = "Android";
    else if (/iphone|ipad|ipod/i.test(ua)) os = "iOS";
    let browser = "Unknown Browser";
    if (/chrome/i.test(ua)) browser = "Chrome";
    else if (/firefox/i.test(ua)) browser = "Firefox";
    else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = "Safari";
    else if (/edg/i.test(ua)) browser = "Edge";
    return {os, browser};
}

// Bonus API Helpers - Contains functions to interact with the bonus API (get, get all, toggle)
export const bonusApi = {
    // Toggle an act to the next state
    async changeToOpp(act: BonusAct): Promise<BonusResponse> {
        // dynamically import js-cookie only on client
        let csrfToken = "";
        try {
            const Cookies = (await import("js-cookie")).default;
            csrfToken = Cookies.get("csrf-token") ?? "";
        } catch {
            // running in an environment without js-cookie - assume cookie will still be sent via credentials
            csrfToken = "";
        }

        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };
        if (csrfToken) {
            headers["X-CSRF-Token"] = csrfToken;
        }

        const res = await fetch(routes.api.chapters.changeToNextState, {
            method: "POST",
            credentials: "include",
            headers,
            body: JSON.stringify({act}),
        });

        if (!res.ok) {
            let text = "";
            try { text = await res.text(); } catch {}
            throw new Error(`${errorText.HTTPFail("bonus.changeToOpp")} ${res.status}: ${text}`);
        }

        return res.json();
    },

    // Get all acts
    async getAll(): Promise<BonusResponse> {
        const res = await fetch(routes.api.chapters.getAll, { credentials: "include" });
        if (!res.ok) {
            let text = "";
            try { text = await res.text(); } catch {}
            throw new Error(`${errorText.HTTPFail("bonus.getAll")} ${res.status}: ${text}`);
        }
        return res.json();
    },

    // Get a single act
    async getOne(roman: string): Promise<BonusResponse> {
        // Convert Roman numeral to act column
        const act = `Act_${roman.toUpperCase()}` as BonusAct;

        const url = new URL(routes.api.chapters.getOne, window.location.origin);
        url.searchParams.append("act", act);

        const res = await fetch(url.toString(), { credentials: "include" });
        if (!res.ok) {
            let text = "";
            try { text = await res.text(); } catch {}
            throw new Error(`${errorText.HTTPFail("bonus.getOne")} ${res.status}: ${text}`);
        }
        return res.json();
    },
};

// Utility to merge class names (clsx + tailwind-merge)
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Time Formatting Utility - Converts milliseconds to "Xd Xh Xm Xs" format
export const formatTime = (milliseconds: number) => {
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
    const hours = Math.floor((milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};

// Fetch Chapter IV Progress - Client-side function to fetch public chapter IV checkOne data
export async function fetchChapterIVProgress() {
    const res = await fetch(`/api/chapters/IV/progress`, { cache: 'no-store' });
    if (!res.ok) {
        // keep it simple: throw so callers can catch
        throw new Error(`Failed to fetch IV progress: ${res.status}`);
    }
    return res.json();
}

// Fetch Chapter IV Check All - Client-side function to fetch all Chapter IV act states
export async function fetchChapterIVCheckAll(): Promise<ChapterIVCheckAllResponse> {
    // include credentials so cookies (auth/session) are sent
    const res = await fetch('/api/chapters/IV/checkAll', { cache: 'no-store', credentials: 'include' });

    if (!res.ok) {
        throw new Error(`Failed to fetch Chapter IV acts: ${res.status}`);
    }

    return await res.json();
}

// Change Next State - Client-side function to change an act to its next state for chapter IV
export async function changeNextState(act: string): Promise<ChangeNextStateResponse> {
    try {
        // try to obtain CSRF token from js-cookie if available
        let csrfToken: string;
        try {
            const Cookies = (await import("js-cookie")).default;
            csrfToken = Cookies.get("csrf-token") ?? "";
        } catch {
            csrfToken = "";
        }

        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (csrfToken) headers['X-CSRF-Token'] = csrfToken;

        const res = await fetch('/api/chapters/IV/changeNextState', {
            method: 'POST',
            headers,
            credentials: 'include',
            body: JSON.stringify({ act }),
            cache: 'no-store',
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            return { error: errorData?.error || `Failed with status ${res.status}` };
        }

        const data: BonusResponse = await res.json();
        return { data };
    } catch (err) {
        console.error('Error calling changeNextState:', err);
        return { error: 'Network or unexpected error' };
    }
}
