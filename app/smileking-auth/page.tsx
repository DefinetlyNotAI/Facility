'use client';
import {useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import Cookies from 'js-cookie';

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
            setError('Password cannot be empty');
            return;
        }

        try {
            const res = await fetch('/api/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({password}),
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.error || 'Authentication failed');
                return;
            }

            const data = await res.json();
            // Save hashed password in cookie, secure flags as appropriate
            Cookies.set('admin-pass', data.hashed, {path: '/', sameSite: 'strict', secure: true});

            router.push('/smileking');
        } catch (err) {
            setError(`Auth API error ${err}`);
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
            <h2 style={{marginBottom: 10}}>SmileKing Access</h2>
            <p style={{maxWidth: 400, textAlign: 'center', marginBottom: 20}}>
                This is not part of the puzzle. Only the creator can control the system here.
            </p>

            <input
                ref={inputRef}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
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
                Enter
            </button>
        </div>
    );
}
