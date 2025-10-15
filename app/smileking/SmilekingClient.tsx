'use client';

import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import {bonusApi, signCookie, fetchChapterIVCheckAll, changeNextState} from '@/lib/utils';
import {buttonState, text} from '@/lib/data/smileking';
import styles from '@/styles/Smileking.module.css';
import {cookies, routes} from '@/lib/saveData';
import {ActionState, BonusAct, BonusResponse, ChapterIVCheckAllResponse} from '@/lib/types/api';

function getCookiesMap(): Record<string, string> {
    return document.cookie.split(';').reduce((acc, cookie) => {
        const [rawKey, ...rest] = cookie.trim().split('=');
        const key = decodeURIComponent(rawKey);
        acc[key] = rest.join('=');
        return acc;
    }, {} as Record<string, string>);
}

export default function SmilekingClient() {
    const [cookieState, setCookieState] = useState<Record<string, boolean>>({});
    const [buttonStates, setButtonStates] = useState<any[]>([]);
    const [bonusState, setBonusState] = useState<BonusResponse | null>(null);

    // Chapter IV puzzle states
    const [chapterIV, setChapterIV] = useState<Record<string, ActionState> | null>(null);
    const [ivLoading, setIvLoading] = useState(false);

    // Normalize various possible API shapes into the component's expected map
    const normalizeChapterIV = (data: ChapterIVCheckAllResponse | BonusResponse | Record<string, ActionState> | any): Record<string, ActionState> | null => {
        if (!data) return null;
        // Common shape: { acts: { Act_I: "Released", ... } }
        if (typeof data === 'object' && data.acts && typeof data.acts === 'object') {
            return data.acts as Record<string, ActionState>;
        }
        // Bonus-like shape: { Act_I: "Released", ... }
        if (typeof data === 'object' && !('acts' in data) && !('data' in data)) {
            // assume it's already the map
            return data as Record<string, ActionState>;
        }
        // Some endpoints may wrap under data
        if (typeof data === 'object' && data.data && typeof data.data === 'object') {
            return data.data as Record<string, ActionState>;
        }
        return null;
    };

    // Pre-fetch CSRF token
    useEffect(() => {
        axios.get(routes.api.security.csrfToken).catch(() => {
        });
    }, []);

    // Load cookies, button states, and bonus acts
    useEffect(() => {
        const allCookies = getCookiesMap();
        const cs: Record<string, boolean> = {};
        Object.values(cookies).forEach(name => {
            cs[name] = allCookies.hasOwnProperty(name);
        });
        setCookieState(cs);

        const fetchState = async () => {
            try {
                const res = await fetch(routes.api.browser.getBrowserState);
                const data = await res.json();
                setButtonStates(Array.isArray(data) ? data : []);
            } catch {
                setButtonStates([]);
            }
        };

        const fetchBonus = async () => {
            try {
                const data = await bonusApi.getAll();
                setBonusState(data);
            } catch (e) {
                console.error('Failed to fetch bonus acts', e);
                setBonusState(null);
            }
        };

        fetchState().catch(console.error);
        fetchBonus().catch(console.error);
    }, []);

    // Fetch Chapter IV acts on mount
    useEffect(() => {
        const loadIV = async () => {
            setIvLoading(true);
            try {
                const data = await fetchChapterIVCheckAll();
                // normalize API response into Record<string, ActionState>
                const parsed = normalizeChapterIV(data);
                setChapterIV(parsed);
            } catch (e) {
                console.error('Failed to fetch Chapter IV acts', e);
                setChapterIV(null);
            } finally {
                setIvLoading(false);
            }
        };

        loadIV().catch(console.error);
    }, []);

    const toggleCookie = async (name: string) => {
        const allCookies = getCookiesMap();
        const isSet = allCookies.hasOwnProperty(name);

        const exclusivityGroups: string[][] = [
            [cookies.end, cookies.endQuestion],
            [cookies.corrupt, cookies.corrupting, cookies.noCorruption]
        ];

        if (isSet) {
            document.cookie = `${encodeURIComponent(name)}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
        } else {
            for (const group of exclusivityGroups) {
                if (group.includes(name)) {
                    for (const other of group) {
                        if (other !== name && allCookies.hasOwnProperty(other)) {
                            document.cookie = `${encodeURIComponent(other)}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
                        }
                    }
                }
            }

            const result = await signCookie(`${name}=true`);
            if (!result.success) {
                alert(`Failed to set cookie "${name}": ${result.error}`);
                return;
            }
        }

        const updatedCookies = getCookiesMap();
        setCookieState(prev => {
            const newState = {...prev};
            Object.values(cookies).forEach(cookie => {
                newState[cookie] = updatedCookies.hasOwnProperty(cookie);
            });
            return newState;
        });
    };

    const pressButton = async (browser: string) => {
        const csrfToken = Cookies.get('csrf-token');
        const res = await fetch(routes.api.browser.flipBrowserState, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken ?? '',
                'ignore-already-pressed': 'true',
            },
            body: JSON.stringify({browser}),
        });

        const result = await res.json();
        if (result.success) {
            setButtonStates(prev =>
                prev.map(b =>
                    b.browser === browser ? {...b, clicked: result.clicked} : b
                )
            );
        } else {
            alert(result.error || 'Failed to press');
        }
    };

    const toggleBonusAct = async (act: BonusAct) => {
        try {
            const data = await bonusApi.changeToOpp(act);
            setBonusState(prev => ({...prev, ...data}));
        } catch (e) {
            alert(`Failed to toggle act ${act}: ${e}`);
        }
    };

    const refreshChapterIV = async () => {
        setIvLoading(true);
        try {
            const data = await fetchChapterIVCheckAll();
            setChapterIV(normalizeChapterIV(data));
        } catch (e) {
            alert('Failed to refresh Chapter IV acts');
            console.error(e);
        } finally {
            setIvLoading(false);
        }
    };

    const handleChangeNext = async (act: string) => {
        try {
            const res = await changeNextState(act);
            if (res.error) {
                alert(`Failed to change state for ${act}: ${res.error}`);
                return;
            }
            // expect res.data to be a map-like response; merge into chapterIV
            if (res.data) {
                const parsed = normalizeChapterIV(res.data);
                if (parsed) {
                    setChapterIV(prev => ({...(prev ?? {}), ...parsed}));
                } else {
                    // fallback: refresh full list
                    await refreshChapterIV();
                }
            } else {
                // fallback: refresh full list
                await refreshChapterIV();
            }
        } catch (e) {
            alert(`Failed to change state for ${act}`);
            console.error(e);
        }
    };

    const getActColor = (state: ActionState) => {
        switch (state) {
            case ActionState.NotReleased:
                return '#999'; // gray
            case ActionState.Released:
                return '#3498db'; // blue
            case ActionState.Failed:
                return '#e74c3c'; // red
            case ActionState.Succeeded:
                return '#2ecc71'; // green
            default:
                return '#ccc';
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.header}>{text.title}</h1>
            <p className={styles.subheader}>{text.subtitle}</p>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>{text.sectionCookieHeader}</h2>
                <ul className={styles.gridList}>
                    {Object.values(cookies).map(name => (
                        <li key={name}>
                            <button
                                className={styles.cookieButton}
                                onClick={() => toggleCookie(name)}
                            >
                                {cookieState[name] ? buttonState.cookies.unset : buttonState.cookies.set} [{name}]
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>{text.sectionButtonHeader}</h2>
                <ul className={styles.gridList}>
                    {buttonStates.map(btn => (
                        <li key={btn.browser}>
                            <button
                                className={`${styles.button} ${btn.clicked ? styles.buttonClicked : styles.buttonNotClicked}`}
                                onClick={() => pressButton(btn.browser)}
                            >
                                {btn.browser}: {btn.clicked ? buttonState.buttons.unset : buttonState.buttons.set}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>


            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Bonus Acts</h2>
                <ul className={styles.gridList}>
                    {bonusState &&
                        Object.entries(bonusState).map(([act, state]) => (
                            <li key={act}>
                                <button
                                    className={styles.button}
                                    style={{backgroundColor: getActColor(state as ActionState)}}
                                    onClick={() => toggleBonusAct(act as BonusAct)}
                                >
                                    {act}: {state}
                                </button>
                            </li>
                        ))}
                </ul>
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Chapter IV - Puzzle States</h2>
                <div style={{marginBottom: 8}}>
                    <button className={styles.button} onClick={refreshChapterIV} disabled={ivLoading}>
                        {ivLoading ? 'Refreshing...' : 'Refresh Chapter IV'}
                    </button>
                </div>
                <ul className={styles.gridList}>
                    {chapterIV ? (
                        Object.entries(chapterIV).map(([act, state]) => (
                            <li key={act}>
                                <button
                                    className={styles.button}
                                    style={{backgroundColor: getActColor(state as ActionState)}}
                                    onClick={() => handleChangeNext(act)}
                                >
                                    {act}: {state}
                                </button>
                            </li>
                        ))
                    ) : (
                        <li>
                            <em>No Chapter IV data loaded</em>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
}
