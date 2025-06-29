"use client";

import React, {useEffect, useRef, useState} from "react";
import {useRouter} from "next/navigation";
import {signCookie} from "@/lib/cookie-utils";
import Cookies from "js-cookie";
import {VNTextRenderer} from "@/components/text";

const POETIC_LINES = [
    "In the beginning, there was only the void...",
    "Time, like water, flows through fingers of eternity.",
    "Each second a grain of sand, falling into the abyss.",
    "The moon watches, silent witness to our fleeting existence.",
    "In its pale light, shadows dance with memories.",
    "What was, what is, what shall be—all converge in this moment.",
    "The vessel of consciousness drifts through temporal seas.",
    "Anchored to nothing, yet bound by everything.",
    "Time dissolves... reality bends... the moon remembers all."
];

const CREEPY_LINES = [
    "The crimson moon bleeds into the void...",
    "Time fractures, spilling darkness across the sky.",
    "In the red light, shadows writhe with malevolent purpose.",
    "The vessel cracks, leaking nightmares into reality.",
    "Each second drips like blood from a wound in time.",
    "The moon's eye opens, and it sees... everything.",
    "In its scarlet gaze, sanity withers and dies.",
    "What lurks behind the veil grows stronger.",
    "The red moon calls... and something answers."
];

export default function Moonlight() {
    const router = useRouter();
    const [allowed, setAllowed] = useState(false);
    const [cutsceneActive, setCutsceneActive] = useState(false);
    const [moonRed, setMoonRed] = useState(false);
    const [currentLineIndex, setCurrentLineIndex] = useState(0);
    const [showMoon, setShowMoon] = useState(false);
    const [stars, setStars] = useState<Array<{x: number, y: number, size: number, opacity: number}>>([]);
    const [lineComplete, setLineComplete] = useState(false);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Check if "themoon" cookie exists
    useEffect(() => {
        const hasRun = (window as any).__moonlight_cookie_check_ran;
        if (hasRun) return;
        (window as any).__moonlight_cookie_check_ran = true;

        const hasMoonCookie = Cookies.get("themoon");

        if (hasMoonCookie) {
            Cookies.remove("themoon");
            setAllowed(true);
        } else {
            router.replace("/404");
        }
    }, [router]);

    // Decide moon color on mount (1/666 chance red)
    useEffect(() => {
        if (Math.random() < 1 / 666) {
            setMoonRed(true);
        }
    }, []);

    // Generate stars
    useEffect(() => {
        const generateStars = () => {
            const newStars = [];
            for (let i = 0; i < 200; i++) {
                newStars.push({
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    size: Math.random() * 2 + 0.5,
                    opacity: Math.random() * 0.8 + 0.2
                });
            }
            setStars(newStars);
        };
        generateStars();
    }, []);

    // Start cutscene if not played
    useEffect(() => {
        if (!allowed) return;

        const played = Cookies.get("moonlight_time_cutscene_played");
        if (!played) {
            startCutscene().catch(console.error);
        } else {
            setShowMoon(true);
        }
    }, [allowed]);

    const startCutscene = async () => {
        setCutsceneActive(true);

        // Initialize audio
        const audio = new Audio(moonRed ? '/audio/moonlight-creepy.mp3' : '/audio/moonlight-soothing.mp3');
        audio.loop = true;
        audio.volume = 0.6;
        audioRef.current = audio;

        try {
            await audio.play();
        } catch (e) {
            console.warn('Audio autoplay blocked:', e);
        }

        // Start with first line
        setCurrentLineIndex(0);
        setLineComplete(false);
    };

    const nextLine = () => {
        const lines = moonRed ? CREEPY_LINES : POETIC_LINES;
        
        if (currentLineIndex < lines.length - 1) {
            setCurrentLineIndex(prev => prev + 1);
            setLineComplete(false);
        } else {
            finishCutscene().catch(console.error);
        }
    };

    const onLineComplete = () => {
        setLineComplete(true);
    };

    const handleClick = () => {
        if (cutsceneActive && lineComplete) {
            nextLine();
        }
    };

    const finishCutscene = async () => {
        await signCookie("moonlight_time_cutscene_played=true");
        setCutsceneActive(false);
        setShowMoon(true);
    };

    const skipCutscene = () => {
        finishCutscene().catch(console.error);
    };

    const onMoonClick = () => {
        if (!moonRed) return;

        const link = document.createElement("a");
        link.href = "/moonlight/riddle.hex";
        link.download = "riddle.hex";
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    // Cleanup
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = '';
            }
        };
    }, []);

    if (!allowed) return null;

    const lines = moonRed ? CREEPY_LINES : POETIC_LINES;

    return (
        <div
            onClick={handleClick}
            style={{
                height: "100vh",
                width: "100vw",
                background: moonRed
                    ? "radial-gradient(ellipse at center, #2d0a0a 0%, #1a0000 50%, #000000 100%)"
                    : "radial-gradient(ellipse at center, #0a1a2d 0%, #001122 50%, #000000 100%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: moonRed ? "#ff9999" : "#cce6ff",
                fontFamily: "'Courier New', Courier, monospace",
                overflow: "hidden",
                position: "relative",
                userSelect: "none",
                cursor: cutsceneActive ? "pointer" : "default",
            }}
        >
            {/* Stars */}
            {stars.map((star, index) => (
                <div
                    key={index}
                    style={{
                        position: "absolute",
                        left: `${star.x}%`,
                        top: `${star.y}%`,
                        width: `${star.size}px`,
                        height: `${star.size}px`,
                        backgroundColor: moonRed ? "#ff6666" : "#ffffff",
                        borderRadius: "50%",
                        opacity: star.opacity,
                        animation: `twinkle ${2 + Math.random() * 3}s infinite`,
                        boxShadow: moonRed
                            ? `0 0 ${star.size * 2}px #ff6666`
                            : `0 0 ${star.size * 2}px #ffffff`,
                    }}
                />
            ))}

            {/* Cutscene Text */}
            {cutsceneActive && (
                <div
                    style={{
                        position: "absolute",
                        top: "20%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "80%",
                        maxWidth: "800px",
                        textAlign: "center",
                        fontSize: "1.8rem",
                        lineHeight: "1.6",
                        textShadow: moonRed
                            ? "0 0 20px #ff0000, 0 0 40px #ff0000"
                            : "0 0 20px #00aaff, 0 0 40px #00aaff",
                        animation: moonRed ? "creepyGlow 2s ease-in-out infinite alternate" : "soothingGlow 3s ease-in-out infinite alternate",
                        zIndex: 10,
                    }}
                >
                    <VNTextRenderer 
                        text={lines[currentLineIndex]} 
                        onDone={onLineComplete}
                    />
                </div>
            )}

            {/* Click to continue indicator */}
            {cutsceneActive && lineComplete && (
                <div
                    style={{
                        position: "absolute",
                        bottom: "15%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        fontSize: "1rem",
                        color: moonRed ? "#ff9999" : "#cce6ff",
                        opacity: 0.7,
                        animation: "pulse 2s ease-in-out infinite",
                        zIndex: 10,
                    }}
                >
                    Click to continue...
                </div>
            )}

            {/* Skip Button */}
            {cutsceneActive && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        skipCutscene();
                    }}
                    style={{
                        position: "absolute",
                        bottom: "20px",
                        right: "20px",
                        background: "rgba(0, 0, 0, 0.7)",
                        border: `2px solid ${moonRed ? "#ff6666" : "#66aaff"}`,
                        color: moonRed ? "#ff9999" : "#cce6ff",
                        padding: "10px 20px",
                        borderRadius: "5px",
                        fontFamily: "inherit",
                        fontSize: "0.9rem",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        zIndex: 10,
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = moonRed ? "rgba(255, 0, 0, 0.2)" : "rgba(0, 100, 255, 0.2)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(0, 0, 0, 0.7)";
                    }}
                >
                    Skip Cutscene
                </button>
            )}

            {/* Moon */}
            {showMoon && (
                <div
                    onClick={onMoonClick}
                    style={{
                        cursor: moonRed ? "pointer" : "default",
                        width: "400px",
                        height: "400px",
                        borderRadius: "50%",
                        background: moonRed
                            ? "radial-gradient(circle at 30% 30%, #ff4444 0%, #cc0000 40%, #660000 80%, #330000 100%)"
                            : "radial-gradient(circle at 30% 30%, #ffffff 0%, #e6f3ff 40%, #cce6ff 80%, #99ccff 100%)",
                        boxShadow: moonRed
                            ? "0 0 100px 20px #ff0000, inset -20px -20px 50px rgba(0, 0, 0, 0.3)"
                            : "0 0 100px 20px #99ccff, inset -20px -20px 50px rgba(0, 0, 0, 0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "120px",
                        textShadow: moonRed
                            ? "0 0 30px #ff0000"
                            : "0 0 30px #ffffff",
                        transition: "all 1s ease",
                        animation: moonRed ? "redMoonPulse 3s ease-in-out infinite" : "moonGlow 4s ease-in-out infinite alternate",
                        position: "relative",
                        userSelect: "none",
                    }}
                    title={moonRed ? "The crimson moon holds secrets... click to unveil them." : "The peaceful moon watches over the night."}
                >
                    {/* Moon craters/texture */}
                    <div
                        style={{
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            borderRadius: "50%",
                            background: moonRed
                                ? "radial-gradient(circle at 60% 40%, rgba(0, 0, 0, 0.3) 5%, transparent 15%), radial-gradient(circle at 20% 70%, rgba(0, 0, 0, 0.2) 3%, transparent 10%), radial-gradient(circle at 80% 20%, rgba(0, 0, 0, 0.25) 4%, transparent 12%)"
                                : "radial-gradient(circle at 60% 40%, rgba(0, 0, 0, 0.1) 5%, transparent 15%), radial-gradient(circle at 20% 70%, rgba(0, 0, 0, 0.08) 3%, transparent 10%), radial-gradient(circle at 80% 20%, rgba(0, 0, 0, 0.12) 4%, transparent 12%)",
                            pointerEvents: "none",
                        }}
                    />
                    🌕
                </div>
            )}

            {/* Atmospheric particles */}
            {showMoon && (
                <div
                    style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        background: moonRed
                            ? "radial-gradient(circle at 50% 50%, rgba(255, 0, 0, 0.05) 0%, transparent 70%)"
                            : "radial-gradient(circle at 50% 50%, rgba(0, 150, 255, 0.03) 0%, transparent 70%)",
                        animation: "atmosphericFlow 8s ease-in-out infinite alternate",
                        pointerEvents: "none",
                    }}
                />
            )}

            <style jsx>{`
                @keyframes twinkle {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.2); }
                }

                @keyframes soothingGlow {
                    0% { text-shadow: 0 0 20px #00aaff, 0 0 40px #00aaff; }
                    100% { text-shadow: 0 0 30px #00aaff, 0 0 60px #00aaff, 0 0 80px #0088cc; }
                }

                @keyframes creepyGlow {
                    0% { text-shadow: 0 0 20px #ff0000, 0 0 40px #ff0000; }
                    100% { text-shadow: 0 0 30px #ff0000, 0 0 60px #ff0000, 0 0 80px #cc0000; }
                }

                @keyframes moonGlow {
                    0% { 
                        box-shadow: 0 0 100px 20px #99ccff, inset -20px -20px 50px rgba(0, 0, 0, 0.1);
                        transform: scale(1);
                    }
                    100% { 
                        box-shadow: 0 0 150px 30px #66aaff, inset -20px -20px 50px rgba(0, 0, 0, 0.1);
                        transform: scale(1.05);
                    }
                }

                @keyframes redMoonPulse {
                    0%, 100% { 
                        box-shadow: 0 0 100px 20px #ff0000, inset -20px -20px 50px rgba(0, 0, 0, 0.3);
                        transform: scale(1);
                    }
                    50% { 
                        box-shadow: 0 0 150px 40px #ff0000, 0 0 200px 60px #cc0000, inset -20px -20px 50px rgba(0, 0, 0, 0.3);
                        transform: scale(1.1);
                    }
                }

                @keyframes atmosphericFlow {
                    0% { transform: rotate(0deg) scale(1); }
                    100% { transform: rotate(360deg) scale(1.1); }
                }

                @keyframes pulse {
                    0%, 100% { opacity: 0.7; }
                    50% { opacity: 1; }
                }
            `}</style>
        </div>
    );
}