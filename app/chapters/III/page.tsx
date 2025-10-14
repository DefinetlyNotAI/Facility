'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { Clock } from 'lucide-react';
import {useIsSucceeded} from "@/hooks/usePreloadActStates";
import {routes, cookies} from "@/lib/saveData";
import {chapterIIIClocks} from "@/lib/data/chapters";
import {formatTime} from "@/lib/utils";

interface ClockState {
    id: number;
    keyword: string;
    symbol: string;
    revealDay: number;
    isRevealed: boolean;
    timeRemaining: number;
}

export default function ChapterIIIPage() {
    const router = useRouter();
    const [isCurrentlySolved, setIsCurrentlySolved] = useState<boolean | null>(null);
    const [clockStates, setClockStates] = useState<ClockState[]>([]);
    const [mainClockTime, setMainClockTime] = useState(new Date());

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
        const startDate = new Date();

        const initialStates: ClockState[] = chapterIIIClocks.map((clock) => {
            const revealDate = new Date(startDate);
            revealDate.setDate(revealDate.getDate() + clock.revealDay);

            const now = new Date();
            const timeRemaining = revealDate.getTime() - now.getTime();

            return {
                ...clock,
                isRevealed: timeRemaining <= 0,
                timeRemaining: Math.max(0, timeRemaining),
            };
        });

        setClockStates(initialStates);

        const interval = setInterval(() => {
            setMainClockTime(new Date());

            setClockStates(prev => prev.map(clock => {
                const newTimeRemaining = Math.max(0, clock.timeRemaining - 1000);
                return {
                    ...clock,
                    timeRemaining: newTimeRemaining,
                    isRevealed: newTimeRemaining === 0 || clock.isRevealed,
                };
            }));
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
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-4">
                <div className="max-w-6xl w-full">
                    <div className="text-center mb-12">
                        <h1 className="text-white font-mono text-4xl font-bold mb-4">
                            3: Clocks and Hands
                        </h1>
                        <p className="text-gray-400 font-mono text-sm">
                            Send keywords to Discord bot: /clock_the_hand {'{keyword}'}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        <div className="lg:col-span-2 flex justify-center mb-8">
                            <div className="relative w-64 h-64 bg-gray-800 rounded-full border-4 border-gray-700 shadow-2xl flex items-center justify-center">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Clock className="w-32 h-32 text-gray-600" />
                                </div>
                                <div className="text-white font-mono text-2xl font-bold z-10">
                                    {mainClockTime.toLocaleTimeString('en-US', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit',
                                        hour12: false
                                    })}
                                </div>
                            </div>
                        </div>

                        {clockStates.map((clock, index) => {
                            const shouldShow = index === 0 || clockStates[index - 1].isRevealed;

                            if (!shouldShow) {
                                return (
                                    <div key={clock.id} className="flex justify-center">
                                        <div className="w-48 h-48 bg-gray-900 rounded-full border-2 border-gray-800 opacity-30"></div>
                                    </div>
                                );
                            }

                            return (
                                <div key={clock.id} className="flex flex-col items-center space-y-4">
                                    <div className="relative w-48 h-48 bg-gray-800 rounded-full border-2 border-gray-700 flex items-center justify-center">
                                        {clock.isRevealed ? (
                                            <div className="text-6xl text-red-500 font-bold">
                                                {clock.symbol}
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center">
                                                <Clock className="w-24 h-24 text-gray-600 animate-pulse" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="text-center">
                                        {clock.isRevealed ? (
                                            <p className="text-green-500 font-mono text-xl font-bold">
                                                {clock.keyword}
                                            </p>
                                        ) : (
                                            <p className="text-gray-500 font-mono text-lg">
                                                {formatTime(clock.timeRemaining)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="text-center space-y-4">
                <div className="text-green-500 font-mono text-3xl font-bold">
                    TIME HAS SPOKEN
                </div>
                <p className="text-gray-400 font-mono">
                    The hands have revealed their secrets. Continue forward.
                </p>
            </div>
        </div>
    );
}
