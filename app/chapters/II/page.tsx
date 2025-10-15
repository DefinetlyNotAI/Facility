'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { cookies, routes } from '@/lib/saveData';
import {useIsSucceeded} from "@/hooks/usePreloadActStates";
import {formatTime} from "@/lib/utils";

const chapterIIStartDate = new Date('2025-10-15T00:00:00Z');

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
        const targetDate = new Date(chapterIIStartDate);
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
                <div className="text-white font-mono">Loading...</div>
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
                        <p className="text-lg">There are 8 links.</p>
                        <p>4 are numbers, 2 are foliage, one is you, and one is time.</p>
                        <p className="text-xs text-gray-600 mt-8">
                            Each page must be screenshotted and sent to me complete to see.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="text-center space-y-4">
                <div className="text-green-500 font-mono text-3xl font-bold">
                    QUEST COMPLETE
                </div>
                <p className="text-gray-400 font-mono">
                    You have navigated the paths. The journey continues...
                </p>
            </div>
        </div>
    );
}
