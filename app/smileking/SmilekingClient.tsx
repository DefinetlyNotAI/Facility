'use client';

import React, {useEffect, useState} from 'react';
import axios from "axios";
import Cookies from "js-cookie";
import {cookiesList} from "@/lib/cookiesList";
import {signCookie} from "@/lib/cookies";

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

    useEffect(() => {
        axios.get('/api/csrf-token').catch(() => {
        });
    }, []);

    useEffect(() => {
        const allCookies = getCookiesMap();
        const cs: Record<string, boolean> = {};
        cookiesList.forEach(name => {
            cs[name] = allCookies.hasOwnProperty(name);
        });
        setCookieState(cs);

        fetch('/api/state')
            .then(res => res.json())
            .then(data => setButtonStates(data));
    }, []);

    const toggleCookie = async (name: string) => {
        const allCookies = getCookiesMap();
        const isSet = allCookies.hasOwnProperty(name);

        const exclusivityGroups: string[][] = [
            ['End', 'End?'],
            ['corrupting', 'Corrupt', 'No_corruption']
        ];

        if (isSet) {
            // Unset locally via document.cookie
            document.cookie = `${encodeURIComponent(name)}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
        } else {
            // Remove exclusive group conflicts
            for (const group of exclusivityGroups) {
                if (group.includes(name)) {
                    for (const other of group) {
                        if (other !== name && allCookies.hasOwnProperty(other)) {
                            document.cookie = `${encodeURIComponent(other)}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
                        }
                    }
                }
            }

            // Call signCookie to have the server set the signed cookie
            const result = await signCookie(`${name}=true`);
            if (!result.success) {
                alert(`Failed to set cookie "${name}": ${result.error}`);
                return;
            }
        }

        // Refresh local cookie state
        const updatedCookies = getCookiesMap();
        setCookieState(prev => {
            const newState = {...prev};
            cookiesList.forEach(cookie => {
                newState[cookie] = updatedCookies.hasOwnProperty(cookie);
            });
            return newState;
        });
    };


    const pressButton = async (browser: string) => {
        const csrfToken = Cookies.get('csrf-token');
        const res = await fetch('/api/press', {
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

    const styles: { [key: string]: React.CSSProperties } = {
        container: {
            padding: '40px',
            fontFamily: 'monospace',
            backgroundColor: '#0f0f0f',
            color: '#f5f5f5',
            minHeight: '100vh',
        },
        header: {
            fontSize: '2rem',
            marginBottom: '0.25em',
        },
        subheader: {
            color: '#999',
            marginBottom: '2em',
        },
        section: {
            marginBottom: '3em',
        },
        sectionTitle: {
            fontSize: '1.5rem',
            marginBottom: '1em',
            borderBottom: '1px solid #444',
            paddingBottom: '0.25em',
        },
        list: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            listStyle: 'none',
            padding: 0,
        },
        button: {
            padding: '10px 16px',
            minWidth: '180px',
            borderRadius: '4px',
            border: '1px solid #888',
            backgroundColor: '#1f1f1f',
            color: '#f0f0f0',
            cursor: 'pointer',
            fontSize: '0.9rem',
            transition: 'background-color 0.2s ease',
        },
        buttonClicked: {
            backgroundColor: '#003300',
            borderColor: '#00aa00',
        },
        buttonNotClicked: {
            backgroundColor: '#330000',
            borderColor: '#aa0000',
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>😐 smileking</h1>
            <p style={styles.subheader}>This is not part of the puzzle.</p>

            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Cookies</h2>
                <ul style={styles.list}>
                    {cookiesList.map(name => (
                        <li key={name}>
                            <button
                                style={styles.button}
                                onClick={() => toggleCookie(name)}
                            >
                                {cookieState[name] ? 'Unset' : 'Set'} [{name}]
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Button States (DB)</h2>
                <ul style={styles.list}>
                    {buttonStates.map(btn => (
                        <li key={btn.browser}>
                            <button
                                style={{
                                    ...styles.button,
                                    ...(btn.clicked ? styles.buttonClicked : styles.buttonNotClicked),
                                }}
                                onClick={() => pressButton(btn.browser)}
                            >
                                {btn.browser}: {btn.clicked ? 'Clicked' : 'Not Clicked'}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
