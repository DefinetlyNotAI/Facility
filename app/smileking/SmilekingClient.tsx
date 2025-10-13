'use client';

import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import {bonusApi, signCookie} from '@/lib/utils';
import {buttonState, text} from '@/lib/data/smileking';
import styles from '@/styles/Smileking.module.css';
import {cookies, routes} from '@/lib/saveData';
import {ActionState, BonusAct, BonusResponse} from '@/lib/types/api';

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

    // Pre-fetch CSRF token
    useEffect(() => {
        axios.get(routes.api.csrfToken).catch(() => {
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
                const res = await fetch(routes.api.state);
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
        const res = await fetch(routes.api.press, {
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
        </div>
    );
}
