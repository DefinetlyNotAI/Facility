'use client';

import {useEffect, useState} from 'react';
import {chapter, chapterIIIData} from "@/lib/data/chapters";
import {formatTime} from "@/lib/utils";
import {ClockState} from "@/lib/types/chapters";
import {useFailed} from "@/hooks/BonusActHooks/useFailed";
import {useChapterAccess} from "@/hooks/BonusActHooks/useChapterAccess";

const renderCorruptedClock = () => {
    const randomRotation = Math.random() * 360;
    const randomScale = 0.7 + Math.random() * 0.6;
    const randomSkew = -20 + Math.random() * 40;

    return (
        <div
            className="relative w-48 h-48 rounded-full flex items-center justify-center overflow-visible"
            style={{
                transform: `rotate(${randomRotation}deg) scale(${randomScale}) skew(${randomSkew}deg)`,
                animation: 'glitch 0.3s infinite, melt 2s ease-in-out infinite alternate',
            }}
        >
            {/* Melting border layers */}
            <div
                className="absolute inset-0 bg-gray-800 rounded-full border-4 border-red-500 opacity-80 blur-sm animate-pulse"
                style={{transform: 'translateY(10px) scaleY(1.2)'}}/>
            <div className="absolute inset-0 bg-gray-800 rounded-full border-4 border-purple-500 opacity-60"
                 style={{transform: 'translateY(-5px) scaleX(1.1)'}}/>
            <div className="absolute inset-0 bg-gray-800 rounded-full border-4 border-blue-500 opacity-40 blur-md"/>

            {/* Glitching gradient overlay */}
            <div
                className="absolute inset-0 bg-gradient-to-br from-red-500 via-purple-500 to-blue-500 opacity-40 rounded-full mix-blend-screen"
                style={{animation: 'glitchColor 0.2s infinite'}}/>

            {/* Corrupted clock hands - multiple overlapping at wrong angles */}
            {[...Array(8)].map((_, i) => (
                <div
                    key={i}
                    className="absolute bg-white opacity-70"
                    style={{
                        width: `${Math.random() * 3}px`,
                        height: `${40 + Math.random() * 40}px`,
                        top: '50%',
                        left: '50%',
                        transformOrigin: 'bottom center',
                        transform: `translate(-50%, -100%) rotate(${i * 45 + Math.random() * 30}deg) scaleY(${0.5 + Math.random()})`,
                        animation: `spin ${0.5 + Math.random() * 2}s linear infinite ${Math.random() > 0.5 ? 'reverse' : ''}`,
                        filter: 'blur(1px)',
                    }}
                />
            ))}

            {/* Glitch artifacts */}
            <div className="absolute w-full h-1 bg-red-500 opacity-80"
                 style={{top: `${Math.random() * 100}%`, animation: 'glitchSlide 0.1s infinite'}}/>
            <div className="absolute w-full h-1 bg-cyan-500 opacity-80"
                 style={{top: `${Math.random() * 100}%`, animation: 'glitchSlide 0.15s infinite reverse'}}/>

            {/* Distorted center */}
            <div className="absolute w-4 h-4 bg-red-500 rounded-full z-10 animate-ping"/>
            <div className="absolute w-2 h-2 bg-white rounded-full z-20"
                 style={{animation: 'glitch 0.2s infinite'}}/>

            {/* Dripping effect */}
            <div className="absolute bottom-0 left-1/2 w-2 h-8 bg-gradient-to-b from-gray-800 to-transparent opacity-60"
                 style={{transform: 'translateX(-50%)', animation: 'drip 1.5s ease-in-out infinite'}}/>
        </div>
    );
};

// ---------- Component ----------
export default function ChapterIIIPage() {
    const {isCurrentlySolved} = useChapterAccess();
    const [clockStates, setClockStates] = useState<ClockState[]>([]);
    const [mainClockTime, setMainClockTime] = useState(new Date());
    const failed = useFailed("III");

    // Initialize clocks
    useEffect(() => {
        const initialStates: ClockState[] = chapterIIIData.clocks.map(clock => {
            const revealDate = new Date(chapterIIIData.startDate);
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
            setMainClockTime(prev => new Date(prev.getTime() + 1000));

            setClockStates(prev =>
                prev.map(clock => {
                    const newTimeRemaining = Math.max(0, clock.timeRemaining - 1000);
                    return {
                        ...clock,
                        timeRemaining: newTimeRemaining,
                        isRevealed: newTimeRemaining === 0 || clock.isRevealed,
                    };
                })
            );
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Render normal clock face
    const renderClockFace = (date: Date) => {
        const hours = date.getHours() % 12;
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();

        const hourDeg = (hours + minutes / 60) * 30;
        const minuteDeg = (minutes + seconds / 60) * 6;
        const secondDeg = seconds * 6;

        return (
            <div
                className="relative w-48 h-48 bg-gray-800 rounded-full border-4 border-gray-700 shadow-2xl flex items-center justify-center">
                <div
                    className="absolute w-1 h-12 bg-white"
                    style={{
                        top: '50%',
                        left: '50%',
                        transformOrigin: 'bottom center',
                        transform: `translate(-50%, -100%) rotate(${hourDeg}deg)`,
                    }}
                />
                <div
                    className="absolute w-0.5 h-16 bg-gray-300"
                    style={{
                        top: '50%',
                        left: '50%',
                        transformOrigin: 'bottom center',
                        transform: `translate(-50%, -100%) rotate(${minuteDeg}deg)`,
                    }}
                />
                <div
                    className="absolute w-0.5 h-20 bg-red-500"
                    style={{
                        top: '50%',
                        left: '50%',
                        transformOrigin: 'bottom center',
                        transform: `translate(-50%, -100%) rotate(${secondDeg}deg)`,
                    }}
                />
                <div className="absolute w-3 h-3 bg-white rounded-full z-10"/>
            </div>
        );
    };

    if (isCurrentlySolved === null) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white font-mono">{chapter.loading}</div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex flex-col items-center justify-center p-8 space-y-8">
            {/* Solved & not failed */}
            {isCurrentlySolved && !failed && (
                <div className="text-center space-y-4 mt-8">
                    <div className="text-green-500 font-mono text-3xl font-bold">
                        {chapterIIIData.text.final.title}
                    </div>
                    <p className="text-gray-400 font-mono">
                        {chapterIIIData.text.final.message}
                    </p>
                </div>
            )}

            {/* Not solved & not failed */}
            {!isCurrentlySolved && !failed && (
                <>
                    <h1 className="text-white font-mono text-4xl font-bold text-center">
                        {chapterIIIData.text.header}
                    </h1>
                    <p className="text-gray-400 font-mono text-sm text-center">
                        {chapterIIIData.text.instructions}
                    </p>
                </>
            )}

            {/* Clocks container */}
            <div className="flex flex-wrap justify-center gap-8 mt-8">
                {/* Main clock */}
                <div className="flex flex-col items-center space-y-4">
                    {failed ? renderCorruptedClock() : renderClockFace(mainClockTime)}
                    {!failed && (
                        <p className="text-white font-mono text-xl">
                            {mainClockTime.toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                                hour12: false,
                            })}
                        </p>
                    )}
                </div>

                {/* Other clocks */}
                {failed ? (
                    <>
                        <h1 className="w-full text-white font-mono text-4xl font-bold text-center mb-4">
                            {chapterIIIData.text.failHeader}
                        </h1>
                        {clockStates.map(clock => (
                            <div key={clock.id} className="flex flex-col items-center space-y-4">
                                {renderCorruptedClock()}
                                <div className="h-6"/>
                            </div>
                        ))}
                    </>
                ) : (
                    clockStates.map((clock, index) => {
                        const shouldShow = isCurrentlySolved || index === 0 || clockStates[index - 1].isRevealed;

                        if (!shouldShow) {
                            return (
                                <div key={clock.id} className="flex flex-col items-center">
                                    <div
                                        className="w-48 h-48 bg-gray-900 rounded-full border-2 border-gray-800 opacity-30"/>
                                </div>
                            );
                        }

                        const isRevealed = isCurrentlySolved ? true : clock.isRevealed;

                        return (
                            <div key={clock.id} className="flex flex-col items-center space-y-4">
                                <div
                                    className="relative w-48 h-48 bg-gray-800 rounded-full border-2 border-gray-700 flex items-center justify-center">
                                    {isRevealed ? (
                                        <div className="text-6xl text-red-500 font-bold">{clock.symbol}</div>
                                    ) : (
                                        renderClockFace(mainClockTime)
                                    )}
                                </div>
                                <div className="text-center">
                                    {isRevealed ? (
                                        <p className="text-green-500 font-mono text-xl font-bold">{clock.keyword}</p>
                                    ) : (
                                        <p className="text-gray-500 font-mono text-lg">{formatTime(clock.timeRemaining)}</p>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
