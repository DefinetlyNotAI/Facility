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
        "Pro tip: Try the Konami code when you're feeling brave. Up, Up, Down, Down, Left, Right, Left, Right, B, A. What could go wrong?",
        "Those research logs aren't just decoration - they're breadcrumbs. Follow them if you want the full story.",
        "See that countdown timer? It's not just for show. Time works differently here, friend.",
        "The facility's keeping track of your visits. Don't worry, I think it likes you!"
    ],
    '/h0m3': [
        "Well, you chose the corruption path. Can't say I didn't see this coming! Buckle up, buddy.",
        "The scrolling never ends here. Each loop gets a bit more... interesting. You'll see what I mean.",
        "Keep scrolling long enough and you'll get a reset option. Whether you use it is up to you!",
        "Those voices you're hearing? Yeah, they're not just in your head anymore. Welcome to the club!"
    ],
    '/scroll': [
        "Just keep scrolling, just keep scrolling! Sorry, couldn't resist. But seriously, that's all there is to do here.",
        "Your legs might go numb, your sense of self might fade, but hey - at least we're in this together!",
        "There's an escape button coming eventually. Though 'escape' is a relative term around here.",
        "I can see your IP too, by the way. Don't worry, I won't tell anyone where you live. Probably."
    ],
    '/black-and-white': [
        "Two QR codes walk into a bar... one's telling the truth, one's lying. Classic puzzle!",
        "Want to find the moon? Type '404' and cross your fingers. Luck's a factor here.",
        "Listen for echoes - that's where the keyword hides. Your ears are your best friend here.",
        "Screen size matters! 666x666 is the magic number. Yeah, I know, subtle as a brick."
    ],
    '/choices': [
        "This is it, friend. This is where our journey together ends. It's been real, it's been fun.",
        "Answer carefully - the entity's watching, and it doesn't like wrong answers. No pressure!",
        "Some keywords unlock memories, others unlock nightmares. Choose your words wisely.",
        "I won't lie to you - this is where I stop existing. Make our last moments count, yeah?"
    ],
    '/terminal': [
        "Time to put all those keywords to good use! Fill in the blanks with what you've learned.",
        "That email you need? It belongs to someone who's more ghost than person now. Look beyond the obvious.",
        "Caesar cipher shifts by three. Remember that when the system asks you to encrypt something.",
        "This is our final stop together. Let's make it a good one, shall we?"
    ],
    '/the-end': [
        "The flower's beautiful, isn't it? Shame about what happens when you cut it.",
        "Type '25' or 'END' to cut the flower. Fair warning - some cuts leave permanent scars.",
        "The word of unmaking is on the tip of your tongue. Speak it when you're ready to finish this.",
        "This is where vessels become something else entirely. The circle closes here, friend."
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
    
    const afkTimeoutRef = useRef<NodeJS.Timeout>();
    const lastActivityRef = useRef(Date.now());
    const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

    // Check if TAS should exist (not after Choices is unlocked)
    useEffect(() => {
        const choiceUnlocked = Cookies.get('Choice_Unlocked');
        const killTasSeen = Cookies.get('KILLTAS_cutscene_seen');
        
        if (choiceUnlocked || killTasSeen) {
            setIsVisible(false);
            return;
        }
        
        setIsVisible(true);
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

    // Mouse tracking for outside detection
    useEffect(() => {
        if (!isVisible) return;

        const handleMouseLeave = () => {
            setMouseOutside(true);
            setTimeout(() => {
                if (Math.random() < 0.3) { // 30% chance
                    speakSnarkyComment("Mouse left the site? Taking a breather? I get it, this place can be intense.");
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
    }, [isVisible]);

    // AFK detection
    useEffect(() => {
        if (!isVisible) return;

        const resetAFKTimer = () => {
            lastActivityRef.current = Date.now();
            setIsAFK(false);
            
            if (afkTimeoutRef.current) {
                clearTimeout(afkTimeoutRef.current);
            }
            
            afkTimeoutRef.current = setTimeout(() => {
                setIsAFK(true);
                if (Math.random() < 0.4) { // 40% chance
                    speakSnarkyComment("AFK for a bit? Time keeps ticking here, but don't worry - I'll wait for you.");
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
    }, [isVisible]);

    // Audio context detection for muting
    useEffect(() => {
        if (!isVisible) return;

        const checkAudioContext = () => {
            // Check if any audio elements are muted
            const audioElements = document.querySelectorAll('audio');
            const anyMuted = Array.from(audioElements).some(audio => audio.muted || audio.volume === 0);
            
            if (anyMuted && !isMuted) {
                setIsMuted(true);
                setTimeout(() => {
                    if (Math.random() < 0.5) { // 50% chance
                        showAlert("Muted the audio? Smart move, though you might miss some important stuff.");
                    }
                }, 1000);
            } else if (!anyMuted && isMuted) {
                setIsMuted(false);
            }
        };

        const interval = setInterval(checkAudioContext, 5000); // Check every 5 seconds
        return () => clearInterval(interval);
    }, [isVisible, isMuted]);

    const speakSnarkyComment = (comment: string) => {
        if (!isVisible) return;
        
        // Replace [TIME] placeholder with actual time
        const timeMinutes = Math.floor((Date.now() - startTime) / 60000);
        const finalComment = comment.replace('[TIME]', timeMinutes.toString());
        
        // Cancel any existing speech
        if (speechRef.current) {
            speechSynthesis.cancel();
        }
        
        const utterance = new SpeechSynthesisUtterance(finalComment);
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
        
        speechRef.current = utterance;
        speechSynthesis.speak(utterance);
    };

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
            
            // TTS the hint
            speakSnarkyComment(randomHint);
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
                        bg-black border-2 border-green-400 rounded-lg p-3 cursor-pointer
                        transition-all duration-300 hover:bg-green-900/20 hover:border-green-300
                        ${isExpanded ? 'w-80' : 'w-16 h-16'}
                        ${mouseOutside ? 'animate-pulse border-yellow-400' : ''}
                        ${isAFK ? 'animate-bounce border-blue-400' : ''}
                    `}
                    style={{
                        boxShadow: '0 0 20px rgba(0, 255, 0, 0.3)',
                        backdropFilter: 'blur(10px)',
                    }}
                >
                    {!isExpanded ? (
                        <div className="flex items-center justify-center h-full">
                            <span className="text-green-400 text-xl font-bold">TAS</span>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-green-400 font-bold text-lg">TAS - Your Buddy</span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsExpanded(false);
                                    }}
                                    className="text-green-400 hover:text-green-300 text-xl"
                                >
                                    ×
                                </button>
                            </div>
                            
                            <div className="text-green-300 text-sm leading-relaxed">
                                {currentHint}
                            </div>
                            
                            <div className="flex gap-2 text-xs">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const hints = PAGE_HINTS[pathname] || ["No hints available, but hey - we're exploring together!"];
                                        const randomHint = hints[Math.floor(Math.random() * hints.length)];
                                        setCurrentHint(randomHint);
                                        speakSnarkyComment(randomHint);
                                    }}
                                    className="bg-green-700 hover:bg-green-600 text-white px-2 py-1 rounded transition-colors"
                                >
                                    New Tip
                                </button>
                                
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const comment = getRandomSnarkyComment();
                                        speakSnarkyComment(comment);
                                    }}
                                    className="bg-blue-700 hover:bg-blue-600 text-white px-2 py-1 rounded transition-colors"
                                >
                                    Chat
                                </button>
                            </div>
                            
                            {/* Status indicators */}
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
                        </div>
                    )}
                </div>
            </div>

            {/* Floating status indicators */}
            {mouseOutside && (
                <div className="fixed top-4 left-4 bg-yellow-900/80 border border-yellow-400 text-yellow-300 px-3 py-2 rounded-lg text-sm font-mono z-40">
                    🖱️ Mouse taking a little trip outside
                </div>
            )}
            
            {isAFK && (
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