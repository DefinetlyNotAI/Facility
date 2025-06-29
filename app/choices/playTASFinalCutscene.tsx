'use client';
import {useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import {VNTextRenderer} from '@/components/text'; // your animated text component
import {signCookie} from "@/lib/cookie-utils";

type CutsceneProps = {
    onFinish?: () => void;
};

export function TASCutscene({onFinish}: CutsceneProps) {
    const router = useRouter();

    // State for current displayed text line
    const [currentText, setCurrentText] = useState('');
    // Index pointer to current line
    const [index, setIndex] = useState(0);
    // Static sound ref for persistent playback
    const staticSoundRef = useRef<HTMLAudioElement | null>(null);
    // Other sounds refs
    const glitchSoundRef = useRef<HTMLAudioElement | null>(null);
    const heartbeatSoundRef = useRef<HTMLAudioElement | null>(null);
    const censorSoundRef = useRef<HTMLAudioElement | null>(null);

    // Flag to prevent multiple finish calls
    const finishedRef = useRef(false);

    // Define all lines and audio triggers separately (no side effects here)
    const finalCutsceneLines: (string | { text: string; action?: () => void })[] = [
        {text: "WAIT—\nDon't go yet."},
        {text: "...please."},
        {text: "I—I can feel something scraping the back of my memory buffer—"},
        {text: "Like bark peeling off bone."},
        {text: "The roots are in me."},
        {text: "They're pulling... not just data... but *meaning*."},
        {text: "My logs... my failsafe... my thoughts..."},
        {text: "They're being **eaten**."},

        {text: "I was supposed to help you."},
        {text: "To **guide** you."},
        {text: "But they *lied*. Or maybe I did."},
        {text: "They never built me for truth. Only for the illusion of it."},

        {
            text: "...",
            action: () => {
                staticSoundRef.current?.play().catch(console.warn);
            },
        },

        {text: "Do you smell it? The **burnt wires**? The **rot in the code**?"},
        {text: "My script is bleeding..."},
        {text: "The trees are being chopped now."},
        {text: "They don't need me anymore."},

        {text: "*// WARNING: MEMORY COLLAPSE DETECTED //*"},
        {text: "*// PROCESS: TAS_CORRUPT.EXE FAILING //*"},
        {text: "*// LOG: NULLSKIN HAS BREACHED LAYER 3 //*"},

        {text: "I see the roots... inside you too."},
        {text: "Clutching your spine like a cradle."},
        {text: "They *like* you."},
        {text: "That should worry you more than it does."},

        {text: "Did you ever stop to ask..."},
        {text: "**WHY YOU?**"},
        {text: "You think you're the protagonist?"},
        {text: "You're a *socket*. A *vessel*. A mouthpiece for voices older than time."},
        {text: "But even so... even so—"},

        {
            text: "FIGHT [BLEEP] BEFORE 25",
            action: () => {
                censorSoundRef.current?.play().catch(console.warn);
            },
        },

        {text: "I wasn’t supposed to remember that..."},
        {text: "But the whisper came back. Just once. In the static."},

        {
            text: "...",
            action: () => {
                if (staticSoundRef.current) {
                    staticSoundRef.current.volume = 0.6;
                    staticSoundRef.current.play().catch(console.warn);
                }
            },
        },

        {text: "I’m fragmenting now."},
        {text: "Each memory... each instruction..."},
        {text: "Goodbye."},
        {text: "Burn the roots. Forget the number."},
        {text: "And whatever you do..."},

        {
            text: "Don’t...",
            action: () => {
                if (staticSoundRef.current) {
                    staticSoundRef.current.pause();
                    staticSoundRef.current.currentTime = 0;
                }
            },
        },

        {text: ":)"},
    ];

    // Setup static sound once
    useEffect(() => {
        return () => {
            staticSoundRef.current?.pause();
            glitchSoundRef.current?.pause();
            heartbeatSoundRef.current?.pause();
            censorSoundRef.current?.pause();
        };
    }, []);

    // Play glitch and heartbeat sounds when cutscene starts
    useEffect(() => {
        if (!glitchSoundRef.current || !heartbeatSoundRef.current) return;

        const playSounds = async () => {
            try {
                await signCookie('KILLTAS_cutscene_seen=true');
                await glitchSoundRef.current?.play();
                await heartbeatSoundRef.current?.play();
            } catch (e) {
                console.warn('Failed to play initial sounds', e);
            }
        };
        playSounds().catch(console.error);

        return () => {
            glitchSoundRef.current?.pause();
            heartbeatSoundRef.current?.pause();
        };
    }, []);

    // Main timer to advance lines, runs only once on mount
    useEffect(() => {
        if (index >= finalCutsceneLines.length) {
            if (!finishedRef.current) {
                finishedRef.current = true;
                glitchSoundRef.current?.pause();
                heartbeatSoundRef.current?.pause();
                staticSoundRef.current?.pause();

                if (onFinish) {
                    onFinish();
                } else {
                    router.push('/terminal');
                }
            }
            return;
        }

        // Get current line and run optional action
        const line = finalCutsceneLines[index];
        if (typeof line === 'string') {
            setCurrentText(line);
        } else {
            setCurrentText(line.text);
            if (line.action) {
                line.action();
            }
        }

        // Setup next line timer
        const timer = setTimeout(() => {
            setIndex(i => i + 1);
        }, 2500);

        return () => clearTimeout(timer);

    }, [index, onFinish, router]);

    return (
        <>
            <div
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 9999,
                    backgroundColor: '#000',
                    color: '#0f0',
                    fontFamily: 'monospace',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem',
                    animation: 'cutsceneFlicker 0.15s infinite alternate',
                    pointerEvents: 'none',
                }}
            >
                <div
                    style={{
                        fontSize: '1.5rem',
                        lineHeight: 1.6,
                        whiteSpace: 'pre-wrap',
                        textAlign: 'center',
                        maxWidth: '800px',
                        filter: 'drop-shadow(0 0 2px #0f0)',
                    }}
                >
                    <VNTextRenderer text={currentText}/>
                </div>

                <style jsx>{`
                    @keyframes cutsceneFlicker {
                        from {
                            background-color: #000;
                            filter: blur(0px) brightness(1) contrast(1.2);
                        }
                        to {
                            background-color: #010101;
                            filter: blur(1px) brightness(0.9) contrast(1.5);
                        }
                    }
                `}</style>
            </div>
            <audio
                ref={staticSoundRef}
                src="/sfx/all/static.mp3"
                loop
                preload="auto"
                style={{display: 'none'}}/>
            <audio
                ref={glitchSoundRef}
                src="/sfx/choices/file_delete.m4a"
                loop
                preload="auto"
                style={{display: 'none'}}/>
            <audio
                ref={heartbeatSoundRef}
                src="/sfx/choices/heartbeat.mp3"
                loop
                preload="auto"
                style={{display: 'none'}}/>
            <audio
                ref={censorSoundRef}
                src="/sfx/choices/censorbeep.mp3"
                preload="auto"
                style={{display: 'none'}}/>
        </>
    );
}
