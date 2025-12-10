import {useRouter} from "next/navigation";
import {useActStateCheck} from "@/hooks/BonusActHooks/useActStateCheck";
import {ActionState} from "@/lib/types/api";
import {cookies, routes} from "@/lib/saveData";
import {useEffect} from "react";
import Cookies from "js-cookie";

export function useChapter2Access() {
    const router = useRouter();

    // Check succeeded state (optional, no redirect)
    useActStateCheck("ii", ActionState.Succeeded, routes.bonus.actID("II"));

    // Redirect if not yet released
    useActStateCheck("ii", ActionState.NotReleased, routes.bonus.notYet);

    // Redirect if bonus locked
    useEffect(() => {
        if (!Cookies.get(cookies.end)) router.replace(routes.bonus.locked);
    }, [router]);
}

export function useChapter4Access() {
    const router = useRouter();

    // Check succeeded state (optional, no redirect)
    useActStateCheck("iv", ActionState.Succeeded, routes.bonus.actID("IV"));

    // Redirect if not yet released
    useActStateCheck("iv", ActionState.NotReleased, routes.bonus.notYet);

    // Redirect if bonus locked
    useEffect(() => {
        if (!Cookies.get(cookies.end)) router.replace(routes.bonus.locked);
    }, [router]);

    return true
}
