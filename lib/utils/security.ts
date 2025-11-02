import {NextRequest} from 'next/server';
import {cookies as savedCookies, routes} from "@/lib/saveData";
import jwt from "jsonwebtoken";
import Cookies from "js-cookie";
import {createSecureResponse} from "@/lib/utils/response";

/**
 * Ensures the presence of a CSRF token cookie on the client side.
 *
 * This function checks whether a CSRF token ("csrf-token") exists in browser cookies.
 * If missing, it calls the `/api/security/csrfToken` endpoint, which sets the token
 * in the response cookies. Afterward, it re-reads the token to confirm presence.
 *
 * **Use cases:**
 * - Any client-side API call requiring an anti-CSRF token in headers.
 * - Called in `useEffect` before protected POST/PUT/DELETE requests.
 *
 * **Returns:**
 * - A `Promise<string>` resolving with the CSRF token value.
 *
 * **Throws:**
 * - An `Error` if fetching the token fails or the token cannot be set.
 */
export async function ensureCsrfToken(): Promise<string> {
    let token = Cookies.get("csrf-token");
    if (!token) {
        // call your CSRF endpoint
        const res = await fetch(routes.api.security.csrfToken);
        if (!res.ok) throw new Error("Failed to fetch CSRF token");
        await res.json(); // token is set as cookie by the server
        token = Cookies.get("csrf-token");
        if (!token) throw new Error("CSRF token not set");
    }
    return token;
}

/**
 * Validates the admin authentication cookie on the server side.
 *
 * Reads the `adminPass` cookie from the incoming Next.js `NextRequest`
 * and verifies its JWT signature using `process.env.JWT_SECRET`.
 * Used exclusively in admin-protected API routes to restrict access.
 *
 * **Use cases:**
 * - Inside `route.ts` handlers (e.g., `/api/banned/all`, `/api/utils/...`)
 *   to ensure that the request is made by an authorized admin.
 *
 * **Returns:**
 * - `null` if the cookie is valid and the request is authorized.
 * - A JSON `Response` object with status 401 (unauthorized),
 *   403 (forbidden), or 500 (server misconfiguration) otherwise.
 *
 * **Throws:**
 * - Never throws; returns an HTTP response directly for API routes.
 */
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
