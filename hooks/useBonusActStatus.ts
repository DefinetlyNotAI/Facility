import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {bonusApi} from "@/lib/utils";
import {routes} from "@/lib/saveData";
import {ActionState, BonusAct} from "@/lib/types/api";
import {validRomans} from "@/lib/data/chapters";

export function useActStateCheck(
    roman: string | null,
    targetState: ActionState,
    redirectIfMatch?: string | null
) {
    const router = useRouter();
    const [matches, setMatches] = useState<boolean | null>(null);

    useEffect(() => {
        if (!roman || !validRomans.includes(roman.toLowerCase())) {
            router.push(routes.notFound);
            return;
        }

        bonusApi
            .getOne(roman)
            .then((res) => {
                const actKey = `Act_${roman.toUpperCase()}` as BonusAct;
                const state = res[actKey];

                if (state === targetState) {
                    // Now redirect when the match happens
                    if (redirectIfMatch) router.push(redirectIfMatch);
                    setMatches(true);
                } else {
                    setMatches(false);
                }
            })
            .catch(() => {
                router.push(routes.notFound);
            });
    }, [roman, targetState, redirectIfMatch, router]);

    return matches;
}

// Hooks for each ActionState
export function useNotReleased(roman: string) {
    return useActStateCheck(roman, ActionState.NotReleased, routes.bonus.notYet);
}

export function useReleased(roman: string) {
    const actKey = `Act_${roman?.toUpperCase()}` as BonusAct;
    return useActStateCheck(roman, ActionState.Released, routes.bonus.actID(actKey));
}

export function useFailed(roman: string) {
    return useActStateCheck(roman, ActionState.Failed, routes.bonus.noTimeChID(roman));
}

export function useSucceeded(roman: string) {
    const actKey = `Act_${roman?.toUpperCase()}` as BonusAct;
    return useActStateCheck(roman, ActionState.Succeeded, routes.bonus.actID(actKey));
}
