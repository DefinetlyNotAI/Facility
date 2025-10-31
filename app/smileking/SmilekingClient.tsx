'use client';

import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import {bonusApi, signCookie, bannedApi, getCookiesMap} from '@/lib/utils';
import {buttonState, text} from '@/lib/data/smileking';
import styles from '@/styles/Smileking.module.css';
import {cookies, routes} from '@/lib/saveData';
import {ActionState, BonusAct, BonusResponse} from '@/lib/types/api';

export default function SmilekingClient() {
    const [cookieState, setCookieState] = useState<Record<string, boolean>>({});
    const [buttonStates, setButtonStates] = useState<any[]>([]);
    const [bonusState, setBonusState] = useState<BonusResponse | null>(null);
    const [bannedList, setBannedList] = useState<string[]>([]);
    const [ipToAdd, setIpToAdd] = useState('');
    const [reasonToAdd, setReasonToAdd] = useState('');
    const [bannedLoading, setBannedLoading] = useState(false);

    // Pre-fetch CSRF token
    useEffect(() => {
        axios.get(routes.api.security.csrfToken).catch(() => {
        });
    }, []);

    // Load cookies, button states, and bonus acts
    useEffect(() => {
        const allCookies = getCookiesMap();
        const cs: Record<string, boolean> = {};
        // Exclude admin cookie from client-visible cookie list (server-only, httpOnly)
        Object.values(cookies).forEach(name => {
            if (name === cookies.adminPass) {
                // Always mark server-only admin cookie as not client-visible
                cs[name] = false;
            } else {
                cs[name] = allCookies.hasOwnProperty(name);
            }
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

        const fetchBanned = async () => {
            setBannedLoading(true);
            try {
                const data = await bannedApi.getAll();
                // defensively handle multiple shapes: direct array, or { ips: [...] }, or {list: [...]}
                let list: string[];
                if (Array.isArray(data)) list = data as any;
                else if (Array.isArray((data as any).ips)) list = (data as any).ips;
                else if (Array.isArray((data as any).list)) list = (data as any).list;
                else if ((data as any).items && Array.isArray((data as any).items)) list = (data as any).items;
                else {
                    // fallback: try to coerce object keys as IPs
                    list = Object.keys(data);
                }
                setBannedList(list);
            } catch (e) {
                console.error('Failed to fetch banned list', e);
                setBannedList([]);
            } finally {
                setBannedLoading(false);
            }
        };

        fetchState().catch(console.error);
        fetchBonus().catch(console.error);
        fetchBanned().catch(console.error);
    }, []);

    const toggleCookie = async (name: string) => {
        // Deny any client attempt to toggle the admin/server-only cookie
        if (name === cookies.adminPass) {
            alert('This cookie is server-only and cannot be toggled from the client.');
            return;
        }

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
                // Keep admin cookie false on client-side (server-only)
                newState[cookie] = cookie === cookies.adminPass ? false : updatedCookies.hasOwnProperty(cookie);
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

    const refreshBanned = async () => {
        try {
            setBannedLoading(true);
            const data = await bannedApi.getAll();
            let list: string[] = [];
            if (Array.isArray(data)) list = data as any;
            else if (Array.isArray((data as any).ips)) list = (data as any).ips;
            else if (Array.isArray((data as any).list)) list = (data as any).list;
            setBannedList(list);
        } catch (e) {
            alert('Failed to refresh banned list');
        } finally {
            setBannedLoading(false);
        }
    };

    const handleCheck = async (ip?: string) => {
        try {
            const target = ip ?? ipToAdd ?? '';
            if (!target) {
                alert('Provide an IP to check');
                return;
            }
            const result = await bannedApi.checkMe(target);
            // show result - shape may vary; display JSON for clarity
            alert(`Check result:\n${JSON.stringify(result, null, 2)}`);
        } catch (e) {
            alert(`Failed to check IP: ${e}`);
        }
    };

    const handleAdd = async () => {
        try {
            if (!ipToAdd) {
                alert('Enter an IP to add');
                return;
            }
            await bannedApi.addMe(ipToAdd, reasonToAdd || null);
            alert('IP added (or request sent). Refreshing list.');
            setIpToAdd('');
            setReasonToAdd('');
            await refreshBanned();
        } catch (e) {
            alert(`Failed to add IP: ${e}`);
        }
    };

    const handleRemove = async (ip: string) => {
        if (!confirm(`Remove banned IP ${ip}?`)) return;
        try {
            // call remove; if server doesn't implement, this will throw
            await bannedApi.remove(ip);
            alert('Removed. Refreshing list.');
            await refreshBanned();
        } catch (e) {
            alert(`Failed to remove IP: ${e}`);
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
                    {Object.values(cookies)
                        .filter(name => name !== cookies.adminPass) // exclude server-only cookie
                        .map(name => (
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
                <h2 className={styles.sectionTitle}>Banned IPs (Admin)</h2>

                <div style={{marginBottom: 8}}>
                    <input
                        type="text"
                        placeholder="IP to add or check"
                        value={ipToAdd}
                        onChange={(e) => setIpToAdd(e.target.value)}
                        className={styles.cookieButton}
                        style={{marginRight: 8}}
                    />
                    <input
                        type="text"
                        placeholder="Reason (optional)"
                        value={reasonToAdd}
                        onChange={(e) => setReasonToAdd(e.target.value)}
                        className={styles.cookieButton}
                        style={{marginRight: 8}}
                    />
                    <button className={styles.button} onClick={handleAdd}>Add IP</button>
                    <button className={styles.button} onClick={() => handleCheck(ipToAdd)} style={{marginLeft: 8}}>Check IP</button>
                    <button className={styles.button} onClick={refreshBanned} style={{marginLeft: 8}}>Refresh</button>
                </div>

                <div>
                    {bannedLoading ? <div>Loading...</div> : (
                        <ul className={styles.gridList}>
                            {bannedList.length === 0 ? <li>No banned IPs found</li> :
                                bannedList.map(ip => (
                                    <li key={ip} style={{display: 'flex', gap: 8, alignItems: 'center'}}>
                                        <span style={{fontFamily: 'monospace'}}>{ip}</span>
                                        <button className={styles.button} onClick={() => handleCheck(ip)}>Check</button>
                                        <button className={styles.button} onClick={() => handleRemove(ip)} style={{background: '#e74c3c'}}>Remove</button>
                                    </li>
                                ))
                            }
                        </ul>
                    )}
                </div>
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
