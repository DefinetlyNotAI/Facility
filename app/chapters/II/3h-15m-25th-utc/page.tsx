'use client';

import React, { useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import Cookies from 'js-cookie';
import {cookies, routes} from '@/lib/saveData';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import Image from 'next/image';
import {signCookie} from "@/lib/utils";
import {fileLinks} from "@/lib/data/chapters";

export default function ChapterIITimedPage() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [isPasswordVerified, setIsPasswordVerified] = useState(false);
    const [isInTimeWindow, setIsInTimeWindow] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!Cookies.get(cookies.end)) {
            router.replace(routes.bonus.locked);
        }
    }, [router]);

    useEffect(() => {
        const savedPassword = Cookies.get(cookies.chII_passDone);
        if (savedPassword?.includes('true')) {
            setIsPasswordVerified(true);
        }
    }, []);

    useEffect(() => {
        const checkTimeWindow = () => {
            const now = new Date();
            const utcHours = now.getUTCHours();
            const utcMinutes = now.getUTCMinutes();
            const utcDay = now.getUTCDate();

            const isCorrectHour = utcHours === 3;
            const isCorrectMinuteRange = utcMinutes >= 15 && utcMinutes < 30;
            const isCorrectDay = utcDay === 25;

            setIsInTimeWindow(isCorrectHour && isCorrectMinuteRange && isCorrectDay);
        };

        checkTimeWindow();
        const interval = setInterval(checkTimeWindow, 1000);

        return () => clearInterval(interval);
    }, []);

    async function hashPassword(password: string) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    const handlePasswordSubmit = async () => {
        const hashed = await hashPassword(password);
        if (hashed === '72e0d0826d26f416e92314ecba12efa97a58af358e97f99d7112297b910dec84') {
            signCookie(`${cookies.chII_passDone}=true`).catch(console.error);
            setIsPasswordVerified(true);
            setError('');
        } else {
            setError('Incorrect password');
        }
    };

    if (!isPasswordVerified) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4">
                <div className="max-w-md w-full space-y-6 bg-gray-900 border border-gray-800 p-8">
                    <div className="text-center space-y-4">
                        <h1 className="text-white font-mono text-2xl">Access Required</h1>
                        <p className="text-gray-400 font-mono text-sm">
                            A 10-digit number instructed you to come here when the clock strikes me
                        </p>
                    </div>

                    <div className="space-y-4">
                        <Input
                            type="text"
                            value={password}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                            className="font-mono bg-black border-gray-700 text-white"
                            placeholder="Enter password"
                            maxLength={10}
                        />

                        {error && (
                            <p className="text-red-500 font-mono text-sm text-center">{error}</p>
                        )}

                        <Button disabled={!password} onClick={handlePasswordSubmit}>Submit</Button>

                    </div>
                </div>
            </div>
        );
    }

    if (!isInTimeWindow) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4">
                <div className="max-w-2xl w-full space-y-8">
                    <div className="relative w-full aspect-square bg-gray-900 border border-red-900">
                        <Image
                            src={fileLinks.II.images['3h-15m-25th-utc']}
                            alt="Melted Clock"
                            fill
                            className="object-contain opacity-50"
                        />
                    </div>

                    <div className="text-center">
                        <p className="text-red-500 font-mono text-2xl font-bold glitch">
                            TOO LATE OR TOO EARLY
                        </p>
                        <p className="text-red-400 font-mono text-lg mt-4">
                            TIME IS NOT REAL HERE
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="text-center space-y-8">
                <div className="text-green-500 font-mono text-6xl space-x-4">
                    <span>:)</span>
                    <span>:)</span>
                    <span>:)</span>
                </div>

                <Button
                    onClick={() => {
                        window.location.href = fileLinks.II.timeShallStrikeEXE;
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white font-mono text-lg px-8 py-4"
                >
                    Download time itself
                </Button>
            </div>
        </div>
    );
}
