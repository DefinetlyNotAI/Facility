"use client";

import React, {useEffect, useState} from "react";
import {usePathname, useRouter} from "next/navigation";

const WINGDINGS_LOCKED = "✋︎⧫︎ ♓︎⬧︎ ■︎□︎⧫︎ ⧫︎♓︎❍︎♏︎";
const WINGDINGS_NOT_ALLOWED = "✡︎□︎◆︎ ♎︎□︎■︎🕯︎⧫︎ ♌︎♏︎●︎□︎■︎♑︎ ♒︎♏︎❒︎♏︎";

export default function Glitchy404() {
    const router = useRouter();
    const pathname = usePathname();
    const [showMoonlight, setShowMoonlight] = useState(false);
    const [glitch, setGlitch] = useState(false);
    const [scanlinePosition, setScanlinePosition] = useState(0);

    const locked = pathname === "/404";

    useEffect(() => {
        if (Math.random() < 1 / 666) setShowMoonlight(true);
    }, []);

    useEffect(() => {
        if (showMoonlight) {
            sessionStorage.setItem("legalMoon", "true");
            router.push("/moonlight");
        }
    }, [showMoonlight, router]);

    useEffect(() => {
        const glitchInterval = setInterval(() => setGlitch(g => !g), locked ? 100 : 300);
        const scanlineInterval = setInterval(() => {
            setScanlinePosition(prev => (prev + 1) % 100);
        }, 50);

        return () => {
            clearInterval(glitchInterval);
            clearInterval(scanlineInterval);
        };
    }, [locked]);

    return (
        <div
            className="min-h-screen bg-black flex flex-col items-center justify-center p-8 font-mono select-none relative overflow-hidden">
            {/* Scanline effect */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: `linear-gradient(0deg, transparent ${scanlinePosition}%, rgba(0, 255, 0, 0.1) ${scanlinePosition + 1}%, transparent ${scanlinePosition + 2}%)`
                }}
            />

            {/* Static noise */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="w-full h-full bg-repeat" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    backgroundSize: '256px 256px'
                }}/>
            </div>

            <div className="relative z-10 max-w-4xl w-full">

                {/* Main content card */}
                <div className="card card-danger mb-16 text-center">
                    <div className="mb-8">
                        <h1 className="text-6xl font-bold text-red-400 mb-4 animate-pulse">404</h1>
                        <div className="text-red-300 text-xl mb-6">
                            ACCESS DENIED • SECTOR RESTRICTED
                        </div>
                    </div>

                    <div className="terminal mb-8">
                        <div className="terminal-header">
                            <div className="terminal-dot red"></div>
                            <div className="terminal-dot red"></div>
                            <div className="terminal-dot red"></div>
                            <span className="text-xs text-red-400 ml-2">SECURITY BREACH</span>
                        </div>
                        <div className="terminal-content">
                            <div className="terminal-line text-red-400">
                                <span className="terminal-prompt">ERROR:</span> Unauthorized access attempt detected
                            </div>
                            <div className="terminal-line text-red-400">
                                <span className="terminal-prompt">STATUS:</span> Location tracking initiated
                            </div>
                            <div className="terminal-line text-red-400">
                                <span className="terminal-prompt">ACTION:</span> Security protocols engaged
                            </div>
                        </div>
                    </div>

                    {locked && (
                        <div className="bg-black/50 p-8 rounded-lg border border-red-500/30">
                            <h2 className="text-3xl font-bold text-green-400 mb-6">MOON LIGHT</h2>
                            <div className="text-green-300 text-lg leading-relaxed max-w-2xl mx-auto">
                                <p className="mb-4">The veil blinks not lifts</p>
                                <p className="mb-4">So watch the renewal rhythm</p>
                                <p className="mb-4">As some truths exist between breaths</p>
                                <p className="mb-4">So what was not here, shall be</p>
                                <p className="mb-6">Only if you insist on dejavu</p>
                            </div>
                            <p className="text-gray-500 text-sm italic">
                                A riddle hidden in the void.
                            </p>
                        </div>
                    )}
                </div>

                {/* Wingdings display */}
                <div className="text-center">
                    <div
                        className={`text-green-400 text-5xl md:text-7xl mb-8 transition-all duration-100 ${
                            glitch ? "opacity-40" : "opacity-100"
                        }`}
                        style={{
                            fontFamily: "Wingdings, cursive, monospace",
                            filter: locked ? "contrast(1.1) saturate(0.3)" : "none",
                            textShadow: locked
                                ? "1px 1px 0px #ff0000, -1px -1px 0px #000"
                                : "0 0 12px currentColor"
                        }}
                    >
                        {locked ? WINGDINGS_LOCKED : WINGDINGS_NOT_ALLOWED}
                    </div>

                    <div className="bg-gray-900/50 rounded-lg p-6 border border-green-500/30 max-w-2xl mx-auto">
                        <div className="text-green-400 text-lg font-mono tracking-wide">
                            {locked
                                ? "SYSTEM LOCKED • TEMPORAL DISPLACEMENT DETECTED"
                                : "ACCESS VIOLATION • CONTAINMENT BREACH IMMINENT"}
                        </div>
                    </div>
                </div>

                {/* Debug/hidden */}
                <div className="absolute bottom-4 right-4 text-xs text-gray-800 opacity-10">
                    [MOONLIGHT_PROBABILITY: 1/666]
                </div>
            </div>

            {/* Glitchy overlay */}
            {glitch && locked && (
                <div className="absolute inset-0 pointer-events-none">
                    <div
                        className="w-full h-full bg-gradient-to-r from-red-900/10 via-transparent to-green-900/10 animate-pulse"/>
                </div>
            )}
        </div>
    );
}