"use client";

import {useEffect, useRef, useState} from "react";

const narratorLines = [
    "So... you thought you could cheat the system.",
    "Twisting the threads of fate, bending the fragile code...",
    "But here you are, trapped in the void of your own making.",
    "Am I Disappointed? Yes. Angry? No.",
    "More... curious how far madness can stretch.",
    "The shadows whisper your name,",
    "And now, the last light fades.",
    "Goodbye, little hacker.",
    "May the silence be your only companion.",
];

// Join all lines with two newlines
const fullText = narratorLines.join("\n\n");

export default function CheaterTrap() {
    const [displayedText, setDisplayedText] = useState("");
    const charIndex = useRef(0);
    const typingSpeed = 40;
    const audioRef = useRef<HTMLAudioElement>(null);

    // Clear cookies immediately on mount
    useEffect(() => {
        const cookies = document.cookie.split("; ");
        for (const cookie of cookies) {
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
        }
    }, []);

    // Initialize background audio
    useEffect(() => {
        const initializeAudio = () => {
            if (audioRef.current) {
                audioRef.current.volume = 0.4;
                audioRef.current.play().catch(() => {
                    // Auto-play failed, will try again on user interaction
                    const handleInteraction = () => {
                        if (audioRef.current) {
                            audioRef.current.play().catch(console.warn);
                        }
                        document.removeEventListener('click', handleInteraction);
                        document.removeEventListener('keydown', handleInteraction);
                    };
                    document.addEventListener('click', handleInteraction);
                    document.addEventListener('keydown', handleInteraction);
                });
            }
        };

        initializeAudio();

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        };
    }, []);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        function typeNextChar() {
            if (charIndex.current < fullText.length) {
                charIndex.current++;
                setDisplayedText(fullText.substring(0, charIndex.current));
                timeoutId = setTimeout(typeNextChar, typingSpeed);
            }
        }

        timeoutId = setTimeout(typeNextChar, 1000); // initial delay for drama

        return () => clearTimeout(timeoutId);
    }, []);

    return (
        <>
            <audio
                ref={audioRef}
                src="/sfx/music/doangelsexist.mp3"
                loop
                preload="auto"
                style={{display: 'none'}}
            />
            <main
                style={{
                    backgroundColor: "black",
                    color: "limegreen",
                    height: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontFamily: "'Courier New', Courier, monospace",
                    whiteSpace: "pre-wrap",
                    fontSize: "1.5rem",
                    padding: "2rem",
                    userSelect: "none",
                }}
            >
                {displayedText || "..."}
            </main>
        </>
    );
}