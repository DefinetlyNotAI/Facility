'use client';

import {useEffect, useRef, useState} from "react";
import {useRouter} from 'next/navigation';
import Cookies from "js-cookie";
import {signCookie} from "@/lib/cookies";
import {BACKGROUND_AUDIO, SFX_AUDIO, useBackgroundAudio} from "@/lib/audio";

export default function RootPage() {
    const router = useRouter();
    const [accepted, setAccepted] = useState<boolean | null>(null);
    const [showConsoleWarning, setShowConsoleWarning] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [countdown, setCountdown] = useState(25);
    const audioRef = useRef<HTMLAudioElement>(null);

    useBackgroundAudio(audioRef, BACKGROUND_AUDIO.ROOT_PAGE);

    useEffect(() => {
        // Simulate system boot
        setTimeout(() => {
            setIsLoading(false);
            const cookieAccepted = Cookies.get("accepted");
            if (cookieAccepted) {
                router.replace("/home");
            } else {
                setAccepted(false);
            }
        }, 2000);
    }, [router]);

    async function handleAccept() {
        // Play success sound
        try {
            const successAudio = new Audio(SFX_AUDIO.ALERT);
            successAudio.volume = 0.6;
            successAudio.play().catch(console.warn);
        } catch (error) {
            console.warn('Failed to play success audio:', error);
        }

        await signCookie("accepted=true");
        setAccepted(true);
        setShowConsoleWarning(true);
        setCountdown(25); // reset countdown

        const interval = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    router.replace("/home");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="text-green-400 text-4xl font-mono mb-8 animate-pulse">
                        FACILITY OS v3.15.25
                    </div>
                    <div className="text-green-400 font-mono text-lg mb-4">
                        Initializing secure connection...
                    </div>
                    <div className="loading-bar w-64 mx-auto"></div>
                </div>
            </div>
        );
    }

    if (accepted === null) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    if (!accepted) {
        return (
            <>
                <audio
                    ref={audioRef}
                    src={BACKGROUND_AUDIO.ROOT_PAGE}
                    loop
                    preload="auto"
                    style={{display: 'none'}}
                />
                <main
                    className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
                    <div className="card max-w-2xl w-full">
                        <div className="card-header">
                            <h1 className="card-title text-red-400 text-center">
                                ⚠️ RESTRICTED ACCESS TERMINAL ⚠️
                            </h1>
                            <p className="card-subtitle text-center">
                                FACILITY 05-B • CLEARANCE LEVEL 5 REQUIRED
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="terminal">
                                <div className="terminal-header">
                                    <div className="terminal-dot red"></div>
                                    <div className="terminal-dot yellow"></div>
                                    <div className="terminal-dot green"></div>
                                    <span className="text-xs text-gray-400 ml-2">PERMISSIONS REQUIRED</span>
                                </div>
                                <div className="terminal-content">
                                    <div className="terminal-line">
                                        <span className="terminal-prompt">SYSTEM:</span> This terminal requires elevated
                                        permissions
                                    </div>
                                    <div className="terminal-line">
                                        <span className="terminal-prompt">SYSTEM:</span> Audio access, notifications,
                                        camera
                                        access, and
                                        media permissions needed as well as allowance to download files.
                                    </div>
                                    <div className="terminal-line">
                                        <span className="terminal-prompt">SYSTEM:</span> Psychological evaluation
                                        protocols
                                        active
                                    </div>
                                    <div className="terminal-line">
                                        <span className="terminal-prompt">MORALITY:</span> All audio tracks used are not
                                        my own, nor owned by me. Most audio's are royalty-free, and "Never Ending Night"
                                        is from the game Deltarune by Toby Fox, who is still taking TOO LONG.
                                    </div>
                                </div>
                            </div>

                            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                                <h2 className="text-red-400 font-bold mb-3 flex items-center gap-2">
                                    <span>⚠️</span> CONTENT WARNINGS
                                </h2>
                                <ul className="space-y-2 text-sm text-red-300">
                                    <li>• Visual and audio disturbances</li>
                                    <li>• Possible flashing lights and rapid imagery</li>
                                    <li>• Content may be psychologically distressing</li>
                                    <li>• Immersive psychological horror experience with audio cues</li>
                                </ul>
                            </div>

                            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                                <h3 className="text-yellow-400 font-bold mb-2">FACILITY PROTOCOLS</h3>
                                <p className="text-sm text-yellow-300">
                                    By proceeding, you acknowledge understanding of all safety protocols and
                                    consent to psychological evaluation procedures. This experience is designed
                                    for mature audiences only. Quit now if you will play with no audio.
                                </p>
                            </div>

                            <div className="text-center">
                                <button
                                    onClick={handleAccept}
                                    className="btn btn-danger text-lg px-8 py-4"
                                >
                                    ACCEPT TERMS & ENTER FACILITY
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </>
        );
    }

    if (showConsoleWarning) {
        return (
            <>
                <audio
                    ref={audioRef}
                    src={BACKGROUND_AUDIO.ROOT_PAGE}
                    loop
                    preload="auto"
                    style={{display: 'none'}}
                />
                <main className="min-h-screen bg-black flex items-center justify-center p-4">
                    <div className="card max-w-2xl w-full card-danger">
                        <div className="text-center">
                            <div className="text-6xl mb-6 animate-pulse">⚠️</div>
                            <h1 className="text-3xl font-bold text-red-400 mb-6">
                                CRITICAL WARNING
                            </h1>
                            <div className="terminal mb-6">
                                <div className="terminal-content">
                                    <div className="terminal-line text-red-400">
                                        <span className="terminal-prompt">WARNING:</span> Developer console access
                                        STRICTLY
                                        PROHIBITED - Unauthorized console usage may destroy the experience
                                    </div>
                                    <div className="terminal-line text-red-400">
                                        <span className="terminal-prompt">WARNING:</span> DO NOT MANUALLY MODIFY COOKIES
                                        TO
                                        SKIP CERTAIN ASPECTS OF THE FACILITY - NOR SHOULD DELETE SOME COOKIES
                                    </div>
                                    <div className="terminal-line text-yellow-400">
                                        <span className="terminal-prompt">NOTICE:</span> Console usage only permitted
                                        when
                                        explicitly instructed by the system.
                                    </div>
                                    <div className="terminal-line text-yellow-400">
                                        <span className="terminal-prompt">NOTICE:</span> THIS IS NOT FOR EPILEPTIC
                                        PEOPLE
                                    </div>
                                    <div className="terminal-line text-yellow-400">
                                        <span className="terminal-prompt">NOTICE:</span> The Facility heavily relies on
                                        cookies for SAVE data. Please do not use incognito or delete the cookies or your
                                        progress may be reset.
                                    </div>
                                    <div className="terminal-line text-green-700">
                                        <span className="terminal-prompt">TIP:</span> TAS is your friend. Use it if you
                                        are
                                        stuck, I don't recommend using TAS however.
                                    </div>
                                    <div className="terminal-line text-green-700">
                                        <span className="terminal-prompt">TIP:</span> Use headphones, it is part of the
                                        experience!.
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-300 mb-4">
                                Redirecting to secure terminal in <span
                                className="text-green-400 font-mono">{countdown}</span> seconds...
                            </p>
                            <div className="loading-bar w-full"></div>
                            <div className="mt-6 text-center space-y-2">
                                <a
                                    href="https://discord.gg/rVBFQCTV4F"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 underline font-mono block"
                                >
                                    Join the Facility Discord - You can't do this without the others..
                                </a>
                                <a
                                    href="https://the-facility-questlog.vercel.app"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-green-400 underline font-mono block"
                                >
                                    VESSEL Quest Log - Hope you don't miss any.. PRAISE BE!
                                </a>
                            </div>
                        </div>
                    </div>
                </main>
            </>
        );
    }

    return null;
}