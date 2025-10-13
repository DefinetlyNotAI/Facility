'use client';

import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import styles from "@/styles/ChapterBonusRoot.module.css";
import {bonusApi} from "@/lib/utils";
import {validRomans, successQuestNames, failQuestNames} from "@/lib/data/bonus";
import {routes} from "@/lib/saveData";
import {ActionState, BonusResponse} from "@/lib/types/api";

export default function ChapterBonusPage() {
    const router = useRouter();
    const [data, setData] = useState<BonusResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const POLL_MS = 5000;

    const fetchAll = async () => {
        try {
            const res = await bonusApi.getAll();
            setData(res);
        } catch (e) {
            console.error("Failed fetching bonus states:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAll();
        const id = setInterval(fetchAll, POLL_MS);
        return () => clearInterval(id);
    }, []);

    const handleClick = (roman: string, idx: number, state: ActionState) => {
        if (state === ActionState.NotReleased) return;
        if (state === ActionState.Failed) {
            router.push(routes.bonus.noTimeChID(roman));
            return;
        }
        // Released or Succeeded -> go to act page
        router.push(routes.bonus.actID(roman));
    };

    return (
        <main className={styles.root}>
            <div className={styles.vignette}/>
            <section className={styles.container}>
                <h1 className={styles.title}>void • bonus acts</h1>
                <p className={styles.subtitle}>Interact with available bonus acts. Status updates in real time.</p>

                <div className={styles.grid}>
                    {validRomans.map((roman, idx) => {
                        const actKey = `Act_${roman.toUpperCase()}` as keyof BonusResponse;
                        const state = data ? data[actKey] : undefined;

                        let label = "???";
                        let cls = styles.btnGrey;
                        let disabled = true;

                        if (!state) {
                            // loading or no data
                            label = loading ? "..." : "???";
                        } else {
                            switch (state) {
                                case ActionState.NotReleased:
                                    label = "???";
                                    cls = styles.btnGrey;
                                    disabled = true;
                                    break;
                                case ActionState.Released:
                                    label = `Act ${roman.toUpperCase()}`.replace("_", " ");
                                    cls = styles.btnCyan;
                                    disabled = false;
                                    break;
                                case ActionState.Failed:
                                    label = failQuestNames[idx] ?? "Fail";
                                    cls = styles.btnRed;
                                    disabled = false;
                                    break;
                                case ActionState.Succeeded:
                                    label = successQuestNames[idx] ?? `Act ${roman.toUpperCase()}`;
                                    cls = styles.btnGreen;
                                    disabled = false;
                                    break;
                            }
                        }

                        return (
                            <button
                                key={roman}
                                className={`${styles.btn} ${cls}`}
                                onClick={() => handleClick(roman, idx, state as ActionState)}
                                disabled={disabled}
                                aria-disabled={disabled}
                                title={label}
                            >
                                <div className={styles.btnInner}>
                                    <span className={styles.btnLabel}>{label}</span>
                                    <span className={styles.btnRoman}>{roman}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </section>
        </main>
    );
}

