// hooks/useCheckActStatus.ts
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { bonusApi } from '@/lib/utils';
import { routes } from '@/lib/saveData';
import { ActionState, BonusAct } from '@/lib/types/api';
import {validRomans} from "@/lib/data/bonus";

export function useCheckActStatus(roman: string | null) {
    const router = useRouter();
    const [isValid, setIsValid] = useState<boolean | null>(null);

    useEffect(() => {
        if (!roman || !validRomans.includes(roman.toLowerCase())) {
            router.push(routes.notFound);
            return;
        }

        bonusApi.getOne(roman)
            .then(res => {
                const actKey = `Act_${roman.toUpperCase()}` as BonusAct;
                const state = res[actKey];

                if (state === ActionState.NotReleased) {
                    router.push(routes.bonus.notYet);
                } else {
                    setIsValid(true);
                }
            })
            .catch(() => {
                router.push(routes.bonus.notYet);
            });
    }, [roman, router]);

    return isValid;
}
