'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Cookies from 'js-cookie';

interface TASProps {
    className?: string;
}

// Page-specific hints for TAS (friendly sarcastic tone)
const PAGE_HINTS: Record<string, string[]> = {
    '/': [
        "Hey there! Welcome to our little facility. Fair warning - once you click accept, we're both in this together.",
        "Those content warnings? Yeah, they're not kidding around. But hey, I'll be here to help you through it!",
        "Audio permissions are pretty important here. Trust me, you'll want to hear what's coming."
    ],
    '/home': [
        "Welcome to your new home away from home! Don't mind the ominous research logs - they're just... atmospheric.",
        "If you ever stumble here from another room, know that you have to do something here to continue, for there are many doors here!",
        "Those research logs aren't just decoration - they're breadcrumbs. But who can promise they are not fabricated... Maybe wait to get actual archived ones?",
        "See that countdown timer? It's not just for show. Time works differently here, friend.",
        "The facility's keeping track of your visits. Don't worry, I think it likes you!"
    ],
    '/wifi-panel': [
        "Two buttons, but you'll need a keyword to unlock the second one. The first one gives you a clue!",
        "That encoded message? It's not as complex as it looks. Sometimes the simplest tools work best.",
        "When you get that transmission error, don't panic - it's asking for a specific type of encoding shift.",
        "The numbers are important here. Add them up, then shift your answer accordingly."
    ],
    '/wifi-login': [
        "Username and password time! The username might be hiding in plain sight around the facility.",
        "That password hash they're showing you? It's a breadcrumb. Work backwards from there.",
        "Six characters max for the password - think simple, think nature, think... growth.",
        "The interference isn't random - it's trying to tell you something important."
    ],
    '/media': [
        "Three items to interact with - audio, and two downloads. You'll need to crack some passwords!",
        "That morse code audio? Listen carefully, or find a way to decode it. It's your first key.",
        "The ZIP files are password protected with the keywords you've been collecting. Use them wisely!",
        "One ZIP leads to another - it's a chain of puzzles. Follow the breadcrumbs."
    ],
    '/file-console': [
        "Welcome to the terminal! Try basic commands like 'ls', 'cd', and 'cat' to explore.",
        "Some files can be downloaded with 'wget' - you might need them later!",
        "That robots.txt file is particularly interesting. Web crawlers aren't the only ones reading it.",
        "Be careful with 'sudo' - the system doesn't like unauthorized access attempts.",
        "The riddle PDF and hint file might be crucial for later puzzles."
    ],
    '/buttons': [
        "Five browsers, but you can only press the one matching yours. It's a global system!",
        "Once all browsers are pressed by different people, something special unlocks.",
        "Check the CSS when all buttons are pressed - there might be hidden instructions.",
        "The Wingdings text isn't just decoration - it's a clue for what to do next.",
        "Look for hidden elements that only appear when the task is complete."
    ],
    '/black-and-white': [
        "Two QR codes... one's telling the truth, one's lying. A classic puzzle!",
        "Want to find the moon? Find the code and type it here... cross your fingers. Luck's a factor here.",
        "Listen for echoes - that's where the keyword hides. Your ears are your best friend here.",
        "The screen size matters for the final unlock. Make it... devilishly specific."
    ],
    '/h0m3': [
        "...",
    ],
    '/scroll': [
        "..."
    ]
};

const SNARKY_COMMENTS = [
    "Oh hey, you're back! Miss me already?",
    "Still clicking around? Hey, exploration's good for the soul!",
    "Mouse left the site? Taking a breather? I get it, this place can be intense.",
    "Muted the audio? Smart move, though you might miss some important stuff.",
    "AFK for a bit? Time keeps ticking here, but don't worry - I'll wait for you.",
    "Another refresh? The facility's keeping count, but who's judging?",
    "Trying to peek behind the curtain? I respect the curiosity!",
    "Feeling lost? That's totally normal here. We'll figure it out together.",
    "Still hanging in there? Most people would've bailed by now. You're tougher than you look!",
    "We've been at this for [TIME] minutes now. Time flies when you're having fun, right?"
];

export default function TAS({ className = '' }: TASProps) {
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(false);
    const [currentHint, setCurrentHint] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);
    const [mouseOutside, setMouseOutside] = useState(false);
    const [isAFK, setIsAFK] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [startTime] = useState(Date.now());
    const [isCorrupted, setIsCorrupted] = useState(false);

    const afkTimeoutRef = useRef<NodeJS.Timeout>();
    const lastActivityRef = useRef(Date.now());
    const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
    const speechQueueRef = useRef<string[]>([]);
    const isSpeakingRef = useRef(false);
    const backgroundAudioRef = useRef<HTMLAudioElement[]>([]);

    // Check if TAS should exist and if he should be corrupted
    useEffect(() => {
        const choiceUnlocked = Cookies.get('Choice_Unlocked');
        const killTasSeen = Cookies.get('KILLTAS_cutscene_seen');

        if (choiceUnlocked || killTasSeen) {
            setIsVisible(false);
            return;
        }

        // Check if we're in corrupted areas
        const isInCorruptedArea = pathname === '/scroll' || pathname === '/h0m3';
        setIsCorrupted(isInCorruptedArea);
        setIsVisible(true);
    }, [pathname]);

    // Monitor background audio for dimming
    useEffect(() => {
        const audioElements = document.querySelectorAll('audio');
        backgroundAudioRef.current = Array.from(audioElements);
    }, [pathname]);

    // Initialize page-specific hints
    useEffect(() => {
        if (!isVisible) return;

        const hints = PAGE_HINTS[pathname] || [
            "Hmm, I don't have specific tips for this area. We're in uncharted territory together!",
            "The facility's systems are a bit unpredictable here. Let's see what happens.",
            "New area, new mysteries! I'm as curious as you are about what we'll find here."
        ];

        setCurrentHint(hints[0]);
    }, [pathname, isVisible]);

    // Speech queue management with background audio dimming
    const processNextSpeech = () => {
        if (speechQueueRef.current.length === 0) {
            isSpeakingRef.current = false;
            // Restore background audio volume
            backgroundAudioRef.current.forEach(audio => {
                if (!audio.paused) {
                    audio.volume = Math.min(audio.volume / 0.3, 1); // Restore from 30%
                }
            });
            return;
        }

        const nextText = speechQueueRef.current.shift()!;
        isSpeakingRef.current = true;

        // Dim background audio to 30%
        backgroundAudioRef.current.forEach(audio => {
            if (!audio.paused) {
                audio.volume = audio.volume * 0.3;
            }
        });

        // Cancel any existing speech
        speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(nextText);
        utterance.rate = 0.9;
        utterance.pitch = 0.8;
        utterance.volume = 0.8;

        // Try to find a friendly voice
        const voices = speechSynthesis.getVoices();
        const friendlyVoice = voices.find(voice =>
            voice.name.includes('Google') ||
            voice.name.includes('Alex') ||
            voice.name.includes('Daniel') ||
            voice.lang.includes('en')
        ) || voices[0];

        if (friendlyVoice) {
            utterance.voice = friendlyVoice;
        }

        utterance.onend = () => {
            setTimeout(processNextSpeech, 500); // Small delay between speeches
        };

        speechRef.current = utterance;
        speechSynthesis.speak(utterance);
    };

    const queueSpeech = (text: string) => {
        if (!isVisible) return;

        // Replace [TIME] placeholder with actual time
        const timeMinutes = Math.floor((Date.now() - startTime) / 60000);
        const finalText = text.replace('[TIME]', timeMinutes.toString());

        speechQueueRef.current.push(finalText);

        if (!isSpeakingRef.current) {
            processNextSpeech();
        }
    };

    // Mouse tracking for outside detection (disabled if TAS is dead)
    useEffect(() => {
        if (!isVisible || isCorrupted) return;

        const handleMouseLeave = () => {
            setMouseOutside(true);
            setTimeout(() => {
                if (Math.random() < 0.3) { // 30% chance
                    queueSpeech("Mouse left the site? Taking a breather? I get it, this place can be intense.");
                }
            }, 2000);
        };

        const handleMouseEnter = () => {
            setMouseOutside(false);
        };

        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('mouseenter', handleMouseEnter);

        return () => {
            document.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('mouseenter', handleMouseEnter);
        };
    }, [isVisible, isCorrupted]);

    // AFK detection (disabled if TAS is dead)
    useEffect(() => {
        if (!isVisible || isCorrupted) return;

        const resetAFKTimer = () => {
            lastActivityRef.current = Date.now();
            setIsAFK(false);

            if (afkTimeoutRef.current) {
                clearTimeout(afkTimeoutRef.current);
            }

            afkTimeoutRef.current = setTimeout(() => {
                setIsAFK(true);
                if (Math.random() < 0.7) { // 70% chance
                    queueSpeech("AFK for a bit? Time keeps ticking here, but don't worry - I'll wait for you.");
                }
            }, 60000); // 1 minute
        };

        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
        events.forEach(event => {
            document.addEventListener(event, resetAFKTimer, true);
        });

        resetAFKTimer(); // Initialize timer

        return () => {
            events.forEach(event => {
                document.removeEventListener(event, resetAFKTimer, true);
            });
            if (afkTimeoutRef.current) {
                clearTimeout(afkTimeoutRef.current);
            }
        };
    }, [isVisible, isCorrupted]);

    // Audio context detection for muting (disabled if TAS is dead)
    useEffect(() => {
        if (!isVisible || isCorrupted) return;

        const checkAudioContext = () => {
            // Check if any audio elements are muted
            const audioElements = document.querySelectorAll('audio');
            const anyMuted = Array.from(audioElements).some(audio => audio.muted || audio.volume === 0);

            if (anyMuted && !isMuted) {
                setIsMuted(true);
                setTimeout(() => {
                    showAlert("Muted the audio? You might miss some important stuff.");
                }, 1000);
            } else if (!anyMuted && isMuted) {
                setIsMuted(false);
            }
        };

        const interval = setInterval(checkAudioContext, 3000); // Check every 3 seconds
        return () => clearInterval(interval);
    }, [isVisible, isMuted, isCorrupted]);

    const showAlert = (message: string) => {
        alert(`TAS: ${message}`);
    };

    const handleTASClick = () => {
        if (!isVisible) return;

        setIsExpanded(!isExpanded);

        if (!isExpanded) {
            // Speak the current hint
            const hints = PAGE_HINTS[pathname] || ["No specific guidance available for this area, but we'll figure it out!"];
            const randomHint = hints[Math.floor(Math.random() * hints.length)];
            setCurrentHint(randomHint);

            // Queue the hint for TTS
            queueSpeech(randomHint);
        }
    };

    const getRandomSnarkyComment = () => {
        const comments = [...SNARKY_COMMENTS];
        return comments[Math.floor(Math.random() * comments.length)];
    };

    if (!isVisible) return null;

    return (
        <>
            {/* TAS Button */}
            <div
                className={`fixed bottom-4 left-4 z-50 ${className}`}
                style={{
                    fontFamily: "'Courier New', monospace",
                }}
            >
                <div
                    onClick={handleTASClick}
                    className={`
                        bg-black border-2 rounded-lg p-3 cursor-pointer
                        transition-all duration-300 hover:bg-green-900/20
                        ${isExpanded ? 'w-80' : 'w-16 h-16'}
                        ${isCorrupted ? 
                            'border-red-500 animate-pulse bg-red-900/20 hover:bg-red-800/30' : 
                            `border-green-400 hover:border-green-300 
                             ${mouseOutside ? 'animate-pulse border-yellow-400' : ''}
                             ${isAFK ? 'animate-bounce border-blue-400' : ''}`
                        }
                    `}
                    style={{
                        boxShadow: isCorrupted ? 
                            '0 0 20px rgba(255, 0, 0, 0.5)' : 
                            '0 0 20px rgba(0, 255, 0, 0.3)',
                        backdropFilter: 'blur(10px)',
                        filter: isCorrupted ? 'contrast(1.5) brightness(0.7) hue-rotate(180deg)' : 'none'
                    }}
                >
                    {!isExpanded ? (
                        <div className="flex items-center justify-center h-full">
                            <span className={`text-xl font-bold ${isCorrupted ? 'text-red-400' : 'text-green-400'}`}>
                                {isCorrupted ? '█AS' : 'TAS'}
                            </span>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className={`font-bold text-lg ${isCorrupted ? 'text-red-400' : 'text-green-400'}`}>
                                    {isCorrupted ? '█AS - ER█OR' : 'TAS - Your Buddy'}
                                </span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsExpanded(false);
                                    }}
                                    className={`hover:text-green-300 text-xl ${isCorrupted ? 'text-red-400' : 'text-green-400'}`}
                                >
                                    ×
                                </button>
                            </div>

                            <div className={`text-sm leading-relaxed ${isCorrupted ? 'text-red-300' : 'text-green-300'}`}>
                                {isCorrupted ? '█████ ████ ███ ████████' : currentHint}
                            </div>

                            {!isCorrupted && (
                                <div className="flex gap-2 text-xs">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const hints = PAGE_HINTS[pathname] || ["No hints available, but hey - we're exploring together!"];
                                            const randomHint = hints[Math.floor(Math.random() * hints.length)];
                                            setCurrentHint(randomHint);
                                            queueSpeech(randomHint);
                                        }}
                                        className="bg-green-700 hover:bg-green-600 text-white px-2 py-1 rounded transition-colors"
                                    >
                                        New Tip
                                    </button>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const comment = getRandomSnarkyComment();
                                            queueSpeech(comment);
                                        }}
                                        className="bg-blue-700 hover:bg-blue-600 text-white px-2 py-1 rounded transition-colors"
                                    >
                                        Chat
                                    </button>
                                </div>
                            )}

                            {/* Status indicators (only show if not corrupted) */}
                            {!isCorrupted && (
                                <div className="flex gap-2 text-xs">
                                    {mouseOutside && (
                                        <span className="text-yellow-400">🖱️ Mouse wandering</span>
                                    )}
                                    {isAFK && (
                                        <span className="text-blue-400">😴 Taking a break</span>
                                    )}
                                    {isMuted && (
                                        <span className="text-orange-400">🔇 Audio muted</span>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Floating status indicators (only show if not corrupted) */}
            {!isCorrupted && mouseOutside && (
                <div className="fixed top-4 left-4 bg-yellow-900/80 border border-yellow-400 text-yellow-300 px-3 py-2 rounded-lg text-sm font-mono z-40">
                    🖱️ Mouse taking a little trip outside
                </div>
            )}

            {!isCorrupted && isAFK && (
                <div className="fixed top-4 right-4 bg-blue-900/80 border border-blue-400 text-blue-300 px-3 py-2 rounded-lg text-sm font-mono z-40">
                    😴 Taking a breather? I'll be here when you get back
                </div>
            )}

            <style jsx>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }
                
                @keyframes bounce {
                    0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
                    40%, 43% { transform: translateY(-10px); }
                    70% { transform: translateY(-5px); }
                    90% { transform: translateY(-2px); }
                }
            `}</style>
        </>
    );
}