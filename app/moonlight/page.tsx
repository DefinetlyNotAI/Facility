"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const CUTSCENE_COOKIE = "moonlight_time_cutscene_played";
const IMAGE_COUNT = 9;

export default function Moonlight() {
    const router = useRouter();
    const [allowed, setAllowed] = useState(false);
    const [cutscenePlayed, setCutscenePlayed] = useState(false);
    const [moonRed, setMoonRed] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const intervalRef = useRef<number | null>(null);

    // Check if user came from 404 or has cookie
    useEffect(() => {
        const ref = document.referrer;
        if (ref.includes("/404") || Cookies.get("cameFrom404") === "true") {
            setAllowed(true);
            Cookies.set("cameFrom404", "true", { expires: 1 });
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

    // Play cutscene if not played
    useEffect(() => {
        if (allowed) {
            const played = Cookies.get(CUTSCENE_COOKIE);
            if (!played) {
                playCutscene();
            } else {
                setCutscenePlayed(true);
            }
        }
    }, [allowed]);

    function playCutscene() {
        if (!window.speechSynthesis) {
            setCutscenePlayed(true);
            return;
        }

        const text = "Time slips like sand...";

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.85;
        utterance.pitch = 0.3;

        utterance.onstart = () => {
            const estimatedDuration = (text.length / (0.85 * 10)) * 1000;
            const intervalTime = estimatedDuration / IMAGE_COUNT;

            setCurrentImageIndex(0);
            intervalRef.current = window.setInterval(() => {
                setCurrentImageIndex((i) => {
                    if (i + 1 >= IMAGE_COUNT) {
                        if (intervalRef.current !== null) {
                            clearInterval(intervalRef.current);
                            intervalRef.current = null;
                        }
                        return i;
                    }
                    return i + 1;
                });
            }, intervalTime);
        };

        utterance.onend = () => {
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            Cookies.set(CUTSCENE_COOKIE, "true", { expires: 7 });
            setCutscenePlayed(true);
        };

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
    }

    function onMoonClick() {
        if (!moonRed) return; // no action if not red

        const link = document.createElement("a");
        link.href = "/moonlight/riddle.hex";
        link.download = "riddle.hex";
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    if (!allowed) return null;

    return (
        <div
            style={{
                height: "100vh",
                backgroundColor: "#001011",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "lightcyan",
                fontFamily: "'Courier New', Courier, monospace",
                overflow: "hidden",
                padding: 20,
                gap: 30,
                userSelect: "none",
            }}
        >
            {!cutscenePlayed && (
                <div
                    style={{
                        width: 300,
                        height: 300,
                        borderRadius: "12px",
                        backgroundColor: "#112233",
                        boxShadow: "0 0 15px 5px #336699",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <img
                        src={`/TIME/happy${currentImageIndex + 1}.png`}
                        alt={`Cutscene image ${currentImageIndex + 1}`}
                        style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            borderRadius: 12,
                            userSelect: "none",
                            pointerEvents: "none",
                        }}
                        draggable={false}
                    />
                </div>
            )}

            <div
                onClick={onMoonClick}
                style={{
                    cursor: moonRed ? "pointer" : "default",
                    width: 300,
                    height: 300,
                    borderRadius: "50%",
                    background: moonRed
                        ? "radial-gradient(circle, #8B0000 40%, #4B0000 80%)"
                        : "radial-gradient(circle, #CCE6FF 40%, #335577 80%)",
                    boxShadow: moonRed
                        ? "0 0 40px 10px #8B0000"
                        : "0 0 40px 10px #99ccff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 80,
                    color: moonRed ? "#FF9999" : "#E0F7FF",
                    textShadow: "0 0 15px #000000",
                    transition: "background 1s ease",
                    userSelect: "none",
                }}
                title={moonRed ? "Click the red moon to download riddle.hex" : undefined}
                aria-label="Moon"
            >
                🌕
            </div>
        </div>
    );
}
