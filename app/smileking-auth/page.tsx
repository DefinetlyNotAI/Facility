'use client';
import {useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import Cookies from 'js-cookie';
import {SFX_AUDIO} from "@/lib/data/audio";
import {authText, errorMsg, warningMsg} from "@/lib/data/smileking";
import {cookies, routes} from "@/lib/saveData";

export default function SmilekingAuth() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const submit = async () => {
        setError('');
        if (!password) {
            // Play error sound
            try {
                const errorAudio = new Audio(SFX_AUDIO.ERROR);
                errorAudio.volume = 0.6;
                errorAudio.play().catch(console.warn);
            } catch (error) {
                console.warn('Failed to play error audio:', error);
            }

            setError(errorMsg.emptyPassword);
            return;
        }

        try {
            const res = await fetch(routes.api.security.auth, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({password}),
            });

            if (!res.ok) {
                // Play error sound
                try {
                    const errorAudio = new Audio(SFX_AUDIO.ERROR);
                    errorAudio.volume = 0.6;
                    errorAudio.play().catch(console.warn);
                } catch (error) {
                    console.warn('Failed to play error audio:', error);
                }

                const data = await res.json();
                setError(data.error || errorMsg.authFailed);
                return;
            }

            // Play success sound
            try {
                const successAudio = new Audio(SFX_AUDIO.SUCCESS);
                successAudio.volume = 0.6;
                successAudio.play().catch(console.warn);
            } catch (error) {
                console.warn('Failed to play success audio:', error);
            }

            const data = await res.json();
            // Save hashed password in cookie, secure flags as appropriate
            Cookies.set(cookies.adminPass, data.hashed, {path: '/', sameSite: 'strict', secure: true});

            router.push(routes.smileking);
        } catch (err) {
            // Play error sound
            try {
                const errorAudio = new Audio(SFX_AUDIO.ERROR);
                errorAudio.volume = 0.6;
                errorAudio.play().catch(console.warn);
            } catch (error) {
                console.warn('Failed to play error audio:', error);
            }

            setError(`${errorMsg.authAPIFailed} ${err}`);
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                fontFamily: 'monospace',
                backgroundColor: '#111',
                color: '#eee',
                padding: 20,
            }}
        >
            <h2 style={{marginBottom: 10}}>{authText.title}</h2>
            <p style={{maxWidth: 400, textAlign: 'center', marginBottom: 20}}>{warningMsg}</p>

            <input
                ref={inputRef}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={authText.formPlaceholder}
                style={{
                    padding: '10px 15px',
                    fontSize: '1rem',
                    borderRadius: 4,
                    border: error ? '2px solid #e33' : '2px solid #555',
                    backgroundColor: '#222',
                    color: '#eee',
                    outline: 'none',
                    width: 280,
                    marginBottom: 10,
                    transition: 'border-color 0.3s',
                }}
                onKeyDown={(e) => e.key === 'Enter' && submit()}
            />

            {error && (
                <div style={{color: '#e33', marginBottom: 10, fontWeight: 'bold'}}>{error}</div>
            )}

            <button
                onClick={submit}
                disabled={!password}
                style={{
                    padding: '10px 20px',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    borderRadius: 4,
                    border: 'none',
                    cursor: password ? 'pointer' : 'not-allowed',
                    backgroundColor: password ? '#44aa44' : '#444',
                    color: '#eee',
                    userSelect: 'none',
                    transition: 'background-color 0.3s',
                }}
            >
                {authText.enter}
            </button>
        </div>
    );
}