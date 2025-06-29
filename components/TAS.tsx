'use client';

import React, {useEffect, useRef, useState} from 'react';
import {usePathname} from 'next/navigation';
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
        "When you get that transmission error, don't panic - it's asking for a specific type of encoding.",
        "The numbers are important here. Think about what they might add up to.",
        "Caesar cipher, eh? Sometimes the oldest tricks are the best tricks!"
    ],
    '/wifi-login': [
        "Username and password time! The username might be hiding in plain sight around the facility.",
        "That password hash they're showing you? It's a breadcrumb. Work backwards from there.",
        "Six characters max for the password - think simple, think nature, think... growth.",
        "The username has something to do with where things grow. And the password? Well, what grows?"
    ],
    '/media': [
        "Three items to interact with - audio, and two downloads. You'll need to crack some passwords!",
        "That morse code audio? Listen carefully, or find a way to decode it. It's your first key.",
        "The ZIP files are password protected with the keywords you've been collecting. Use them wisely!",
        "One ZIP leads to another - it's a chain of puzzles. Follow the breadcrumbs.",
        "Each interaction unlocks the next step. It's all connected, trust me."
    ],
    '/file-console': [
        "Welcome to the terminal! Try 'help' to explore available commands.",
        "Some files can be downloaded with 'wget' - you might need them later!",
        "That robots.txt file is particularly interesting. Web crawlers aren't the only ones reading it.",
        "The riddle PDF and hint file might be your path forward. Download them both!",
        "Be careful with 'sudo' - some commands have... consequences.",
        "Two secrets hide in this terminal. One's in the files, one's in the commands."
    ],
    '/buttons': [
        "Five browsers, but you can only press the one matching yours. It's a global system!",
        "Once all browsers are pressed by different people, something special unlocks.",
        "Look for hidden elements that only appear when the task is complete.",
        "Check the CSS when everything's done - there might be a secret hiding in the styles.",
        "This is a collaborative puzzle. You'll need help from others using different browsers."
    ],
    '/black-and-white': [
        "Two QR codes... one's telling the truth, one's lying. A classic puzzle!",
        "Want to find the moon? Type the right sequence here... but luck's a factor.",
        "Listen for echoes - that's where the keyword hides. Your ears are your best friend here.",
        "The screen size matters for the final unlock. Make it... devilishly specific.",
        "666x666 pixels. That's the magic number for the final step."
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

export default function TAS({className = ''}: TASProps) {
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(false);
    const [currentHint, setCurrentHint] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);
    const [mouseOutside, setMouseOutside] = useState(false);
    const [isAFK, setIsAFK] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [startTime] = useState(Date.now());
    const [isCorrupted, setIsCorrupted] = useState(false);
    const [lastSnarkyComment, setLastSnarkyComment] = useState(0);

    const afkTimeoutRef = useRef<NodeJS.Timeout>();
    const lastActivityRef = useRef(Date.now());
    const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
    const speechQueueRef = useRef<string[]>([]);
    const isSpeakingRef = useRef(false);
    const backgroundAudioRef = useRef<HTMLAudioElement[]>([]);
    const originalVolumesRef = useRef<Map<HTMLAudioElement, number>>(new Map());

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

    // Monitor all audio elements for dimming
    useEffect(() => {
        const updateAudioElements = () => {
            const audioElements = document.querySelectorAll('audio');
            backgroundAudioRef.current = Array.from(audioElements);
            
            // Store original volumes
            backgroundAudioRef.current.forEach(audio => {
                if (!originalVolumesRef.current.has(audio)) {
                    originalVolumesRef.current.set(audio, audio.volume);
                }
            });
        };

        updateAudioElements();
        
        // Update audio list when DOM changes
        const observer = new MutationObserver(updateAudioElements);
        observer.observe(document.body, { childList: true, subtree: true });

        return () => observer.disconnect();
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

    // Enhanced speech queue management with ALL audio dimming to 20%
    const processNextSpeech = () => {
        if (speechQueueRef.current.length === 0) {
            isSpeakingRef.current = false;
            // Restore all audio elements to their original volumes
            backgroundAudioRef.current.forEach(audio => {
                const originalVolume = originalVolumesRef.current.get(audio) || 1;
                if (!audio.paused) {
                    audio.volume = originalVolume;
                }
            });
            return;
        }

        const nextText = speechQueueRef.current.shift()!;
        isSpeakingRef.current = true;

        // Dim ALL audio elements to 20% volume
        backgroundAudioRef.current.forEach(audio => {
            if (!audio.paused) {
                const originalVolume = originalVolumesRef.current.get(audio) || audio.volume;
                originalVolumesRef.current.set(audio, originalVolume);
                audio.volume = originalVolume * 0.2;
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

    const queueSpeech = (text: string, priority: 'normal' | 'high' = 'normal') => {
        if (!isVisible || isCorrupted) return;

        // Replace [TIME] placeholder with actual time
        const timeMinutes = Math.floor((Date.now() - startTime) / 60000);
        const finalText = text.replace('[TIME]', timeMinutes.toString());

        if (priority === 'high') {
            // For high priority, skip to the latest message and clear snarky comments
            speechQueueRef.current = speechQueueRef.current.filter(msg => 
                !SNARKY_COMMENTS.some(snarky => msg.includes(snarky.split('.')[0]))
            );
            speechQueueRef.current = [finalText]; // Replace with latest
        } else {
            speechQueueRef.current.push(finalText);
        }

        if (!isSpeakingRef.current) {
            processNextSpeech();
        }
    };

    // Mouse tracking for outside detection (disabled if TAS is dead, reduced frequency)
    useEffect(() => {
        if (!isVisible || isCorrupted) return;

        const handleMouseLeave = () => {
            setMouseOutside(true);
            setTimeout(() => {
                const timeSinceLastSnarky = Date.now() - lastSnarkyComment;
                if (timeSinceLastSnarky > 120000 && Math.random() < 0.2) { // 2 min cooldown, 20% chance
                    queueSpeech("Mouse left the site? Taking a breather? I get it, this place can be intense.");
                    setLastSnarkyComment(Date.now());
                }
            }, 3000);
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
    }, [isVisible, isCorrupted, lastSnarkyComment]);

    // AFK detection (disabled if TAS is dead, reduced frequency)
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
                const timeSinceLastSnarky = Date.now() - lastSnarkyComment;
                if (timeSinceLastSnarky > 120000 && Math.random() < 0.3) { // 2 min cooldown, 30% chance
                    queueSpeech("AFK for a bit? Time keeps ticking here, but don't worry - I'll wait for you.");
                    setLastSnarkyComment(Date.now());
                }
            }, 120000); // 2 minutes instead of 1
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
    }, [isVisible, isCorrupted, lastSnarkyComment]);

    // Audio context detection for muting (disabled if TAS is dead)
    useEffect(() => {
        if (!isVisible || isCorrupted) return;

        const checkAudioContext = () => {
            // Check if any audio elements are muted
            const audioElements = document.querySelectorAll('audio');
            const anyMuted = Array.from(audioElements).some(audio => audio.muted || audio.volume === 0);

            if (anyMuted && !isMuted) {
                setIsMuted(true);
                const timeSinceLastSnarky = Date.now() - lastSnarkyComment;
                if (timeSinceLastSnarky > 120000) { // 2 min cooldown
                    setTimeout(() => {
                        showAlert("Muted the audio? You might miss some important stuff.");
                        setLastSnarkyComment(Date.now());
                    }, 1000);
                }
            } else if (!anyMuted && isMuted) {
                setIsMuted(false);
            }
        };

        const interval = setInterval(checkAudioContext, 5000); // Check every 5 seconds
        return () => clearInterval(interval);
    }, [isVisible, isMuted, isCorrupted, lastSnarkyComment]);

    const showAlert = (message: string) => {
        alert(`TAS: ${message}`);
    };

    const handleTASClick = () => {
        if (!isVisible) return;

        setIsExpanded(!isExpanded);

        if (!isExpanded) {
            // Speak the current hint with high priority
            const hints = PAGE_HINTS[pathname] || ["No specific guidance available for this area, but we'll figure it out!"];
            const randomHint = hints[Math.floor(Math.random() * hints.length)];
            setCurrentHint(randomHint);

            // Queue the hint for TTS with high priority
            queueSpeech(randomHint, 'high');
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
                                <span
                                    className={`font-bold text-lg ${isCorrupted ? 'text-red-400' : 'text-green-400'}`}>
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

                            <div
                                className={`text-sm leading-relaxed ${isCorrupted ? 'text-red-300' : 'text-green-300'}`}>
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
                                            queueSpeech(randomHint, 'high');
                                        }}
                                        className="bg-green-700 hover:bg-green-600 text-white px-2 py-1 rounded transition-colors"
                                    >
                                        New Tip
                                    </button>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const timeSinceLastSnarky = Date.now() - lastSnarkyComment;
                                            if (timeSinceLastSnarky > 120000) { // 2 min cooldown
                                                const comment = getRandomSnarkyComment();
                                                queueSpeech(comment);
                                                setLastSnarkyComment(Date.now());
                                            } else {
                                                const remainingTime = Math.ceil((120000 - timeSinceLastSnarky) / 1000);
                                                queueSpeech(`Hold on, I need ${remainingTime} more seconds to think of something witty!`, 'high');
                                            }
                                        }}
                                        className="bg-blue-700 hover:bg-blue-600 text-white px-2 py-1 rounded transition-colors"
                                    >
                                        Chat
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                @keyframes pulse {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.7;
                    }
                }

                @keyframes bounce {
                    0%, 20%, 53%, 80%, 100% {
                        transform: translateY(0);
                    }
                    40%, 43% {
                        transform: translateY(-10px);
                    }
                    70% {
                        transform: translateY(-5px);
                    }
                    90% {
                        transform: translateY(-2px);
                    }
                }
            `}</style>
        </>
    );
}