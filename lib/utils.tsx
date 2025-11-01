import {NextRequest, NextResponse} from 'next/server';
import React from "react";
import {cookies as savedCookies, ItemKey, localStorageKeys, routes} from "@/lib/saveData";
import {AddMeResponse, BonusAct, BonusResponse, CheckMeResponse} from "@/lib/types/api";
import {errorText} from "@/lib/data/utils";
import {type ClassValue, clsx} from 'clsx';
import {twMerge} from 'tailwind-merge';
import jwt from "jsonwebtoken";

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

// Get user OS / browser from user-agent string
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
    // Admin only
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
            try {
                text = await res.text();
            } catch {
            }
            throw new Error(`${errorText.HTTPFail("bonus.changeToOpp")} ${res.status}: ${text}`);
        }

        return res.json();
    },

    // Get all acts
    async getAll(): Promise<BonusResponse> {
        const res = await fetch(routes.api.chapters.getAll, {credentials: "include"});
        if (!res.ok) {
            let text = "";
            try {
                text = await res.text();
            } catch {
            }
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

        const res = await fetch(url.toString(), {credentials: "include"});
        if (!res.ok) {
            let text = "";
            try {
                text = await res.text();
            } catch {
            }
            throw new Error(`${errorText.HTTPFail("bonus.getOne")} ${res.status}: ${text}`);
        }
        return res.json();
    },
};

// Lightweight IP validator (simple IPv4 and IPv6 heuristic)
export function isValidIP(ip: unknown): ip is string {
    if (typeof ip !== 'string') return false;
    const ipv4 = /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;
    const maybeIpv6 = ip.includes(':'); // simple IPv6 presence test
    return ipv4.test(ip) || maybeIpv6;
}

// Helper to safely get CSRF token from cookies (client-side)
// Used locally for bannedApi functions
async function getCsrfToken(): Promise<string> {
    try {
        const Cookies = (await import("js-cookie")).default;
        return Cookies.get("csrf-token") ?? "";
    } catch {
        return "";
    }
}

// API helpers dedicated to /api/banned endpoints
export const bannedApi = {
    // GET /api/banned/all
    // Requires admin authentication
    async getAll(): Promise<string[]> {
        const res = await fetch(routes.api.banned.all, {credentials: "include"});
        if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            throw new Error(body.error || `Failed to fetch banned list (${res.status})`);
        }

        // Normalize various shapes into a string[] to make client handling consistent
        const json = await res.json().catch(() => ([]));
        if (Array.isArray(json)) return json as string[];
        if (json && typeof json === 'object') {
            if (Array.isArray((json as any).ips)) return (json as any).ips;
            if (Array.isArray((json as any).list)) return (json as any).list;
            if (Array.isArray((json as any).items)) return (json as any).items;
            // fallback: treat object keys as IPs when appropriate
            return Object.keys(json).filter(() => true);
        }
        return [];
    },

    // POST /api/banned/checkMe - ip optional (will attempt to fetch client IP)
    async checkMe(ip?: string): Promise<CheckMeResponse> {
        const targetIp = ip ?? await fetchUserIP();
        if (!isValidIP(targetIp)) throw new Error("Invalid IP provided to checkMe");

        const res = await fetch(routes.api.banned.checkMe, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ip: targetIp}),
            credentials: "include",
        });
        if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            throw new Error(body.error || `Failed to check ip (${res.status})`);
        }
        return res.json();
    },

    // POST /api/banned/addMe - requires valid ip and CSRF token (cookie)
    async addMe(ip: string, reason?: string | null): Promise<AddMeResponse> {
        if (!isValidIP(ip)) throw new Error("Invalid IP provided to addMe");

        const csrfToken = await getCsrfToken();
        const headers: Record<string, string> = {"Content-Type": "application/json"};
        if (csrfToken) headers["X-CSRF-Token"] = csrfToken;

        const res = await fetch(routes.api.banned.addMe, {
            method: "POST",
            credentials: "include",
            headers,
            body: JSON.stringify({ip, reason}),
        });

        if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            throw new Error(body.error || `Failed to add banned ip (${res.status})`);
        }
        return res.json();
    },

    // POST /api/banned/remove - requires valid ip and CSRF token (cookie)
    // Requires admin authentication
    async remove(ip: string): Promise<{ success: boolean; removed?: boolean; error?: string }> {
        if (!isValidIP(ip)) throw new Error("Invalid IP provided to remove");

        const csrfToken = await getCsrfToken();
        const headers: Record<string, string> = {"Content-Type": "application/json"};
        if (csrfToken) headers["X-CSRF-Token"] = csrfToken;

        const res = await fetch(routes.api.banned.remove, {
            method: "POST",
            credentials: "include",
            headers,
            body: JSON.stringify({ip}),
        });

        if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            throw new Error(body.error || `Failed to remove banned ip (${res.status})`);
        }
        return res.json();
    },

    // GET /api/banned/count
    // Returns the total number of banned IPs without any details
    async count(): Promise<number> {
        const res = await fetch(routes.api.banned.count, { credentials: "include" });
        if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            throw new Error(body.error || `Failed to fetch banned count (${res.status})`);
        }

        const json = await res.json().catch(() => ({}));
        if (json && typeof json.count === "number") return json.count;

        // fallback if shape is unexpected
        if (Array.isArray(json)) return json.length;
        return 0;
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

// Helper to verify a string against a hashed reference (server-side only hash storage).
export async function checkPass(
    itemToCheck: ItemKey,
    stringToCheck: string
): Promise<{ success: boolean; error?: string; }> {
    try {
        const res = await fetch(routes.api.utils.hashChecker, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({itemToCheck, stringToCheck})
        });

        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            return {success: false, error: errData.error ?? "Server error"};
        }

        return await res.json();
    } catch (err) {
        console.error("checkPass error:", err);
        return {success: false, error: "Network error"};
    }
}

// Verify Admin Cookie - Used in admin-protected API routes (Server-side only)
export function verifyAdmin(req: NextRequest): Response | null {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        return createSecureResponse({error: "Server misconfiguration"}, 500);
    }

    const adminToken = req.cookies.get(savedCookies.adminPass)?.value ?? "";
    if (!adminToken) {
        return createSecureResponse({error: "Unauthorized"}, 401);
    }

    try {
        jwt.verify(adminToken, jwtSecret);
        return null; // Valid
    } catch {
        return createSecureResponse({error: "Forbidden - invalid admin token"}, 403);
    }
}

// Get Cookies Map - Client-side utility to get all cookies as a key-value map
export function getCookiesMap(): Record<string, string> {
    // Builds a map from document.cookie, but we will treat the admin cookie as server-only.
    return document.cookie.split(';').reduce((acc, cookie) => {
        const [rawKey, ...rest] = cookie.trim().split('=');
        const key = decodeURIComponent(rawKey);
        acc[key] = rest.join('=');
        return acc;
    }, {} as Record<string, string>);
}
