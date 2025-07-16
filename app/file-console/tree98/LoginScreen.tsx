import React, {useState} from 'react';
import {COLORS, FONTS, MESSAGES, SYSTEM_CONFIG} from "@/app/file-console/tree98/config";
import {signCookie} from "@/lib/cookies";

async function sha256(text: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

async function sha1(text: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hash = await crypto.subtle.digest('SHA-1', data);
    return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

export async function validateCredentials(username: string, password: string): Promise<boolean> {
    const usernameHash = await sha256(username);
    const passwordHash = await sha1(password);

    return usernameHash === SYSTEM_CONFIG.USERNAME_HASH &&
        passwordHash === SYSTEM_CONFIG.PASSWORD_HASH;
}

interface LoginScreenProps {
    onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({onLogin}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const isValid = await validateCredentials(username, password);
            if (isValid) {
                await signCookie(`${SYSTEM_CONFIG.LOGIN_COOKIE}=true`)
                onLogin();
            } else {
                setError(MESSAGES.LOGIN.ERROR);
            }
        } catch (err) {
            setError(MESSAGES.LOGIN.ERROR);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div
            style={{
                width: '100vw',
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: COLORS.LOGIN_BG,
                color: COLORS.TEXT_COLOR,
                margin: 0,
                padding: 0,
                boxSizing: 'border-box',
            }}
        >
            <div
                style={{
                    background: '#e5e7eb',
                    border: '2px outset #9ca3af',
                    padding: '1.5rem',
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
                    fontFamily: FONTS.SYSTEM,
                    width: '400px',
                    color: COLORS.TEXT_COLOR,
                }}
            >
                <div style={{textAlign: 'center', marginBottom: '1.5rem'}}>
                    <div style={{fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.5rem'}}>
                        {MESSAGES.LOGIN.TITLE}
                    </div>
                    <div style={{fontSize: '0.875rem', color: '#4b5563'}}>
                        {MESSAGES.LOGIN.SUBTITLE}
                    </div>
                </div>

                <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                    <div>
                        <label style={{display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem'}}>
                            {MESSAGES.LOGIN.USERNAME_LABEL}
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.5rem',
                                border: '1px solid #9ca3af',
                                background: '#fff',
                                fontSize: '0.875rem',
                                fontFamily: FONTS.SYSTEM,
                                boxSizing: 'border-box',
                            }}
                            disabled={isLoading}
                            required
                        />
                    </div>

                    <div>
                        <label style={{display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem'}}>
                            {MESSAGES.LOGIN.PASSWORD_LABEL}
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.5rem',
                                border: '1px solid #9ca3af',
                                background: '#fff',
                                fontSize: '0.875rem',
                                fontFamily: FONTS.SYSTEM,
                                boxSizing: 'border-box',
                            }}
                            disabled={isLoading}
                            required
                        />
                    </div>

                    <div
                        style={{
                            fontSize: '0.75rem',
                            color: '#4b5563',
                            fontStyle: 'italic',
                            textAlign: 'center',
                        }}
                    >
                        {MESSAGES.LOGIN.HINT}
                    </div>

                    {error && (
                        <div
                            style={{
                                color: '#dc2626',
                                fontSize: '0.875rem',
                                textAlign: 'center',
                            }}
                        >
                            {error}
                        </div>
                    )}

                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '1rem',
                            marginTop: '1.5rem',
                        }}
                    >
                        <button
                            type="submit"
                            disabled={isLoading}
                            style={{
                                padding: '0.5rem 1.5rem',
                                border: '2px outset #9ca3af',
                                background: '#e5e7eb',
                                fontSize: '0.875rem',
                                fontFamily: FONTS.SYSTEM,
                                opacity: isLoading ? 0.5 : 1,
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                transition: 'background 0.2s',
                            }}
                            onMouseOver={e => (e.currentTarget.style.background = '#d1d5db')}
                            onMouseOut={e => (e.currentTarget.style.background = '#e5e7eb')}
                        >
                            {isLoading ? 'Checking...' : MESSAGES.LOGIN.LOGIN_BUTTON}
                        </button>
                        <button
                            type="button"
                            style={{
                                padding: '0.5rem 1.5rem',
                                border: '2px outset #9ca3af',
                                background: '#e5e7eb',
                                fontSize: '0.875rem',
                                fontFamily: FONTS.SYSTEM,
                                cursor: 'pointer',
                                transition: 'background 0.2s',
                            }}
                            onMouseOver={e => (e.currentTarget.style.background = '#d1d5db')}
                            onMouseOut={e => (e.currentTarget.style.background = '#e5e7eb')}
                        >
                            {MESSAGES.LOGIN.CANCEL_BUTTON}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

};

export default LoginScreen;