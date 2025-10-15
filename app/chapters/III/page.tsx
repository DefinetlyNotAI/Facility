'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import Cookies from 'js-cookie';
import {useIsSucceeded} from "@/hooks/usePreloadActStates";
import {cookies, routes} from "@/lib/saveData";
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

const ChIIIDateStart = new Date('2025-10-15T00:00:00Z');

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
        // Set the constant start date here
        const initialStates: ClockState[] = chapterIIIClocks.map((clock) => {
            const revealDate = new Date(ChIIIDateStart);
            revealDate.setDate(revealDate.getDate() + clock.revealDay);

            // Compute time remaining relative to ChIIIDateStart
            const now = new Date(); // real current time for live countdown
            const timeRemaining = revealDate.getTime() - now.getTime();

            return {
                ...clock,
                isRevealed: timeRemaining <= 0,
                timeRemaining: Math.max(0, timeRemaining),
            };
        });

        setClockStates(initialStates);

        const interval = setInterval(() => {
            setMainClockTime(prev => {
                return new Date(prev.getTime() + 1000);
            });

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


    const renderClockFace = (date: Date) => {
        const hours = date.getHours() % 12;
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();

        const hourDeg = (hours + minutes / 60) * 30;
        const minuteDeg = (minutes + seconds / 60) * 6;
        const secondDeg = seconds * 6;

        return (
            <div className="relative w-48 h-48 bg-gray-800 rounded-full border-4 border-gray-700 shadow-2xl flex items-center justify-center">
                {/* hour hand */}
                <div
                    className="absolute w-1 h-12 bg-white"
                    style={{
                        top: '50%',
                        left: '50%',
                        transformOrigin: 'bottom center',
                        transform: `translate(-50%, -100%) rotate(${hourDeg}deg)`
                    }}
                />
                {/* minute hand */}
                <div
                    className="absolute w-0.5 h-16 bg-gray-300"
                    style={{
                        top: '50%',
                        left: '50%',
                        transformOrigin: 'bottom center',
                        transform: `translate(-50%, -100%) rotate(${minuteDeg}deg)`
                    }}
                />
                {/* second hand */}
                <div
                    className="absolute w-0.5 h-20 bg-red-500"
                    style={{
                        top: '50%',
                        left: '50%',
                        transformOrigin: 'bottom center',
                        transform: `translate(-50%, -100%) rotate(${secondDeg}deg)`
                    }}
                />
                {/* center dot */}
                <div className="absolute w-3 h-3 bg-white rounded-full z-10" />
            </div>
        );
    };


    if (isCurrentlySolved === null) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white font-mono">Loading...</div>
            </div>
        );
    }

    if (!isCurrentlySolved) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex flex-col items-center justify-center p-8 space-y-8">
                <h1 className="text-white font-mono text-4xl font-bold text-center">
                    3: Clocks and Hands
                </h1>
                <p className="text-gray-400 font-mono text-sm text-center">
                    Send keywords to Discord bot: /clock_the_hand {'{keyword}'}
                </p>

                <div className="flex flex-wrap justify-center gap-8 mt-8">
                    {/* Main live clock */}
                    <div className="flex flex-col items-center space-y-4">
                        {renderClockFace(mainClockTime)}
                        <p className="text-white font-mono text-xl">
                            {mainClockTime.toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                                hour12: false,
                            })}
                        </p>
                    </div>

                    {/* Other clocks */}
                    {clockStates.map((clock, index) => {
                        const shouldShow = index === 0 || clockStates[index - 1].isRevealed;
                        if (!shouldShow) {
                            return (
                                <div key={clock.id} className="flex flex-col items-center">
                                    <div className="w-48 h-48 bg-gray-900 rounded-full border-2 border-gray-800 opacity-30" />
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
                                        renderClockFace(mainClockTime)
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
