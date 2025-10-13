import {useActStateCheck, useFailed, useNotReleased, useReleased, useSucceeded} from "@/hooks/useBonusActStatus";
import {useEffect, useMemo, useState} from "react";
import {ActionState} from "@/lib/types/api";
import {usePathname, useRouter} from "next/navigation";
import {validRomans} from "@/lib/data/bonus";
import {routes} from "@/lib/saveData";

export function usePreloadActStates(roman: string) {
    // Run all checks immediately (these  handle redirects internally)
    useFailed(roman.toLowerCase());
    useSucceeded(roman.toLowerCase());
    useReleased(roman.toLowerCase());
    useNotReleased(roman.toLowerCase());

    const [ready, setReady] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setReady(true), 0);
        return () => clearTimeout(t);
    }, []);
    return ready;
}

export function useIsSucceeded() {
    const pathname = usePathname();
    const router = useRouter();

    // Get the last segment from the URL path
    const chapter = useMemo(() => {
        if (!pathname) return null;
        const segments = pathname.split("/").filter(Boolean);
        return segments.length ? segments[segments.length - 1].toLowerCase() : null;
    }, [pathname]);
    if (!chapter) return false;

    // Validate chapter and redirect if invalid
    useEffect(() => {
        if (!chapter || !validRomans.includes(chapter.toLowerCase())) {
            router.push(routes.notFound);
        }
    }, [chapter, router]);

    // Run required state checks
    useNotReleased(chapter.toLowerCase());
    useFailed(chapter.toLowerCase());

    // Return the main act state check (for succeeded)
    return useActStateCheck(chapter.toLowerCase(), ActionState.Succeeded);
}