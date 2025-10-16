'use client';

import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import Cookies from 'js-cookie';
import {cookies, routes} from '@/lib/saveData';
import {useIsSucceeded} from "@/hooks/usePreloadActStates";
import {formatTime} from "@/lib/utils";
import {chIIData, fileLinks} from "@/lib/data/chapters";
import {Button} from "@/components/ui/button";


// ---------- Component ----------
export default function ChapterIIPage() {
    const router = useRouter();
    const [isCurrentlySolved, setIsCurrentlySolved] = useState<boolean | null>(null);
    const [timeRemaining, setTimeRemaining] = useState<number>(0);

    const succeeded = useIsSucceeded();

    useEffect(() => {
        if (!Cookies.get(cookies.end)) {
            router.replace(routes.bonus.locked);
        }
    }, [router]);

    useEffect(() => {
        if (succeeded !== null && succeeded !== undefined) {
            setIsCurrentlySolved(succeeded);
        }
    }, [succeeded]);

    useEffect(() => {
        const targetDate = new Date(chIIData.root.startDate);
        targetDate.setDate(targetDate.getDate() + 7);

        const interval = setInterval(() => {
            const now = Date.now();
            const distance = targetDate.getTime() - now;

            if (distance <= 0) {
                clearInterval(interval);
                setTimeRemaining(0);
            } else {
                setTimeRemaining(distance);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    if (isCurrentlySolved === null) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white font-mono">{chIIData.root.text.loading}</div>
            </div>
        );
    }

    if (!isCurrentlySolved) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4">
                <div className="text-center space-y-8">
                    <div className="text-white font-mono text-6xl font-bold tracking-wider">
                        {formatTime(timeRemaining)}
                    </div>

                    <div className="space-y-4 text-gray-400 font-mono text-sm max-w-2xl">
                        {chIIData.root.text.countdown.descriptionLines.map((line, i) => (
                            <p key={i}>{line}</p>
                        ))}
                        <p className="text-xs text-gray-600 mt-8">{chIIData.root.text.countdown.note}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="text-center space-y-4">
                <div className="text-green-500 font-mono text-3xl font-bold">
                    {chIIData.root.text.complete.title}
                </div>
                <p className="text-gray-400 font-mono">{chIIData.root.text.complete.message}</p>
                <Button
                    onClick={() => {
                        window.location.href = fileLinks.II.timeShallStrikeEXE;
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white font-mono text-lg px-8 py-4"
                >
                    {chIIData.utcPage.successText.downloadButton}
                </Button>
            </div>
        </div>
    );
}
