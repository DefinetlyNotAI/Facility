// Returns true if Failed, with conditional redirect
import {validRomansNoTimeLeft} from "@/lib/data/chapters";
import {routes} from "@/lib/saveData";
import {useActStateCheck} from "@/hooks/BonusActHooks/useActStateCheck";
import {ActionState} from "@/lib/types/api";

export function useFailed(roman: string) {
    const normalized = roman.toLowerCase();

    const redirect = validRomansNoTimeLeft.includes(normalized)
        ? routes.bonus.noTimeChID(normalized)
        : undefined;

    const matches = useActStateCheck(roman, ActionState.Failed, redirect);

    return validRomansNoTimeLeft.includes(normalized) ? matches : true;
}