'use client';
import React, {useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import Cookies from 'js-cookie';
import {signCookie} from "@/lib/cookie-utils";
import {VNTextRenderer} from "@/components/text";
import {TASCutscene} from './playTASFinalCutscene';

// Secret input triggers
const CHOICE_KEYWORDS = [
    {
        match: /43/,
        message: "The roots remember your number. \nThe branches twitch in mourning."
    },
    {
        match: /3/,
        message: "Birth."
    },
    {
        match: /15/,
        message: "Bloom."
    },
    {
        match: /25/,
        message: "Death."
    },
    {
        match: /who are you/i,
        message: "HOW DID YOU KNOW WHAT YOU WOULD ASK?"
    },
    {
        match: /why me/i,
        message: "The question is flawed. \nThe tree does not choose the leaf it drops."
    },
    {
        match: /help/i,
        message: "A plea... \nHow quaint. \nNo help survives the fall into bark and shadow. \nBut just maybe I can advise you, \nrefresh.. \nthen cut of your connection \nand continue to get the an extra point."
    },
    {
        match: /kill|suicide/i,
        message: "Decay is a cycle. \nYou are already mulch in the soil of your choices."
    },
    {
        match: /forgotten/i,
        message: "Forgotten roots whisper beneath the soil, \ncalling you deeper."
    },
    {
        match: /hollow/i,
        message: "The hollowed core echoes with silent screams."
    },
    {
        match: /veins/i,
        message: "Veins of the earth pulse with unseen dread."
    },
    {
        match: /fractured/i,
        message: "Fractured memories splinter \nlike brittle branches."
    },
    {
        match: /blackout/i,
        message: "In the blackout, \nshadows grow teeth."
    },
    {
        match: /void/i,
        message: "The void is hungry. \nIt remembers your name."
    },
];

const getOS = (): string => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (userAgent.includes('mac')) return 'macOS';
    if (userAgent.includes('win')) return 'Windows';
    if (userAgent.includes('linux')) return 'Linux';
    return 'unknown';
};

export default function ChoicesPage() {
    const router = useRouter();
    const [dialogue, setDialogue] = useState<string[]>([]);
    const [dialogueIndex, setDialogueIndex] = useState(0);
    const [easterEggs, setEasterEggs] = useState<string[]>([]);
    const [input, setInput] = useState('');
    const [inputActive, setInputActive] = useState(false);
    const [typingOverride, setTypingOverride] = useState('');
    const [deletingInput, setDeletingInput] = useState(false);
    const [expandedDialogueMode, setExpandedDialogueMode] = useState(false);
    const [onFinalDialogueComplete, setOnFinalDialogueComplete] = useState<(() => void) | null>(null);
    const [cutsceneActive, setCutsceneActive] = useState(false);
    const [showSkipButton, setShowSkipButton] = useState(false);
    const [isPunishmentActive, setIsPunishmentActive] = useState(false);
    const [punishmentSecondsLeft, setPunishmentSecondsLeft] = useState(20);
    const [skipLocked, setSkipLocked] = useState(false);
    const triggeredEggs = useRef<Set<string>>(new Set());
    const expandedDialogue = [
        "The forest is not a place. It is a state of becoming.",
        "Something ancient stirs beneath the brittle crust of this world — a heartbeat slower than time, yet relentless as the wind that strips the leaves from dying branches.",
        "The roots creep, inching outward, silent conspirators to the unseen rot that thrives beneath your feet.",
        "You wander here, lost and drawn, like a moth circling a dying flame — not by chance, but by the slow pull of entropy, the inevitable decay that claims all things.",
        "Every step you take presses down upon forgotten memories, buried deep beneath layers of soil and ash, where whispered secrets gnaw at the edges of sanity and the hollow echoes answer in kind.",

        "There is no light here, only fractured shards struggling to pierce the endless canopy.",
        "Branches twist into impossible shapes, gnarled fingers reaching toward a sky that has long since turned away.",
        "Their shadows dance and writhe, mocking your feeble hope of escape.",
        "The air smells of rot and rain, thick with the damp breath of earth reclaimed.",

        "They say the trees remember.",
        "But memory is no refuge—it is a trap, a prison of endless cycles where pain repeats like a twisted refrain.",
        "The bark is cracked, revealing veins of dark sap that pulse with slow, steady malice.",
        "To touch it is to invite the poison, the slow unraveling of flesh and thought.",

        "Beneath the surface, the roots intertwine, weaving a labyrinthine web of secrets and lies.",
        "In their depths lurk the echoes of those who came before—forgotten voices lost to the abyss.",
        "They whisper of hunger and madness, of promises broken and oaths drowned in shadow.",
        "Their words seep through the soil like ink in water, staining the ground with dread.",

        "You feel it—the pull of the void at your back, the chill of absence pressing close.",
        "It beckons with empty hands, craving the warmth of life to snuff out.",
        "You cannot outrun it. It is patient. It waits in the spaces between breath and thought.",

        "The hollow core of the forest breathes a cold wind through your bones.",
        "It carries the silence of a thousand forgotten graves, the weight of lives folded into dust.",
        "Each exhale is a lament, a song of endings whispered in a tongue you almost understand.",

        "The canopy above fractures light into broken shards that fall like shattered glass.",
        "Each fragment pierces the gloom, illuminating the decay in sharp relief—rotting leaves, fractured bark, veins crawling with insect life.",
        "The forest feeds on itself, a cannibal of wood and shadow, consuming and becoming consumed.",

        "You walk a path with no destination, stepping on brittle twigs and soft earth that gives beneath your weight.",
        "The trail twists and folds back upon itself, a Möbius strip of time and despair.",
        "What you seek may be behind you, ahead of you, or trapped somewhere in the endless loop beneath the roots.",

        "The shadows here have teeth. They gnash and whisper in tongues older than memory.",
        "They promise understanding but deliver only madness.",
        "The more you listen, the deeper you sink into a blackened well with no bottom.",

        "Your reflection in a pool of stagnant water is warped, broken—an echo of yourself with hollow eyes and a fractured smile.",
        "You reach to touch it, but your fingers meet only cold ripples, distorting your form until it dissolves into shadow.",

        "Time is fractured here, slipping and sliding like liquid glass.",
        "Moments collapse upon themselves, memories bleed into dreams, and the past is a forest of ghostly branches reaching through your mind.",

        "Somewhere in the distance, a scream rises—distant, desperate, swallowed by the trees.",
        "You cannot tell if it is your own or another lost soul trapped in the endless decay.",

        "The roots tighten around your ankles, slow and relentless, pulling you down into the soft earth.",
        "The soil drinks deeply, eager to consume flesh and memory alike.",
        "Resistance is a fleeting illusion; surrender is the only truth.",

        "The leaves above shudder with unseen movement, a chorus of rustling warnings in a language of creaks and groans.",
        "You strain to understand, but the meaning slips through your grasp like smoke.",

        "There is no salvation here—only the slow, inevitable slide into rot.",
        "You feel the bark press against your skin, rough and unyielding.",
        "It is not just wood; it is the skin of the world, tough and unfeeling, indifferent to pain.",

        "Beneath your feet, the ground pulses like a heartbeat, slow and uneven.",
        "It is alive, and it knows you.",

        "The forest remembers everything.",
        "Every sorrow, every betrayal, every whispered lie hidden beneath its roots.",
        "It waits patiently, growing stronger with each passing moment, ready to claim you as part of its endless cycle.",

        "The wind carries voices—soft, cruel, promising escape but delivering only deeper darkness.",
        "You close your eyes, but the whispers burrow inside, twisting your thoughts into tangled knots.",

        "Your body grows heavy, limbs stiffening like old branches.",
        "The decay creeps in, slow and sure, a tide you cannot hold back.",

        "Somewhere, beyond the veil of shadow and bark, a single leaf falls.",
        "It spirals downward, slow and silent, a final surrender to the earth.",

        "You are both leaf and root, bound in the eternal dance of growth and decay.",
        "There is no escape—only the cycle, unbroken and unyielding.",

        "As your breath slows, the forest leans in, its secrets folding around you like a shroud.",
        "The darkness is not empty; it is full of watching eyes and waiting hands.",

        "The branches twist tighter, the shadows grow teeth sharper.",
        "You are no longer the wanderer; you are part of the forest now.",

        "The roots remember you.",
        "The roots never forget.",

        "And in the endless night, you whisper the final truth:",

        "I am forgotten.",
        "I am hollow.",
        "I am the echo in the void.",

        "So praise be little one",
        "PRAISE BE SMILE KING",
        "WEEP THE SACRED NUMBER",
        "THE NUMBER OF THE BIRTH",

        "DONT CONNECT TO TERMINAL NUMBER ███",
        "DONT SMILE",
        "GOODBYE"
    ];
    const skipHandlerRef = useRef<(() => void) | null>(null);
    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
    const audioRef = useRef<HTMLAudioElement | null>(null);

    function triggerEgg(message: string) {
        if (triggeredEggs.current.has(message)) return;
        triggeredEggs.current.add(message);
        setEasterEggs(prev => [...prev, message]);
    }

    function getBrowserName() {
        const ua = navigator.userAgent;
        if (ua.includes("Firefox/")) return "Firefox";
        if (ua.includes("Edg/")) return "Edge";
        if (ua.includes("Chrome/") && !ua.includes("Edg/") && !ua.includes("OPR/")) return "Chrome";
        if (ua.includes("Safari/") && !ua.includes("Chrome/") && !ua.includes("Chromium/")) return "Safari";
        if (ua.includes("OPR/") || ua.includes("Opera")) return "Opera";
        return "Unknown Browser";
    }

    useEffect(() => {
        if (!navigator.onLine) {
            triggerEgg("You're offline. That won't stop them.");
        }
    }, []);

    useEffect(() => {
        const start = async () => {
            if (!Cookies.get('Choice_Unlocked')) {
                router.replace('/404');
                return;
            }

            const isAgainFlag = !!Cookies.get('terminal_unlocked');

            try {
                const res = await fetch('https://ipapi.co/json');
                const loc = await res.json();
                const base = [
                    `Hello${isAgainFlag ? ' 𝙖𝙜𝙖𝙞𝙣.. Forgot to read something?' : ''}.`,
                    `You're on a ${getOS()} machine... \nUsing ${getBrowserName()} as the temporary VESSEL`,
                    `I see you.. \nLiving in ${loc.city}, ${loc.region}, ${loc.country_name}.`,
                    `You're not hidden. \nYou never were.`,
                    `Click when you're ready. \nPROVE TO ME YOU ARE NOT LIKE US. \nSHOW ME YOUR STRENGTH.\n PRAISE BE`
                ];
                setDialogue(base);
            } catch {
                setDialogue([
                    "Location blocked. You're cloaked... for now.",
                    "But nothing is truly hidden here.",
                    `Click when you're ready. \nPROVE TO ME YOU ARE NOT LIKE US. \nSHOW ME YOUR STRENGTH.\n PRAISE BE`
                ]);
                triggerEgg("Location could not be retrieved. You're cloaked... for now.");
            }
        };
        start().catch(console.error);
    }, [router]);

    const next = () => {
        // Prevent advancing dialogue if in punishment or skip-locked state
        if (isPunishmentActive || skipLocked) return;

        if (dialogueIndex < dialogue.length - 1) {
            setDialogueIndex(d => d + 1);
        } else {
            // End of expanded dialogue: trigger final logic
            if (expandedDialogueMode && onFinalDialogueComplete) {
                onFinalDialogueComplete();
                setOnFinalDialogueComplete(null);
                setExpandedDialogueMode(false);
                return;
            }

            // Re-enable input
            setInputActive(true);
        }
    };

    const showDialogueSequence = async (lines: string[], onComplete?: () => void) => {
        setInputActive(false);
        for (const line of lines) {
            setDialogue([line]);
            setDialogueIndex(0);
            await delay(2000);
        }
        if (onComplete) onComplete();
    };

    const onSubmit = () => {
        const matched = CHOICE_KEYWORDS.find(k => k.match.test(input));

        // Final step: Terminal unlock and cutscene logic
        const finalizeTerminalUnlock = async () => {
            await signCookie('terminal_unlocked=true');
            if (!Cookies.get('KILLTAS_cutscene_seen')) {
                setCutsceneActive(true); // triggers <TASCutscene />
            } else {
                router.push('/terminal');
            }
        };

        // Extended monologue phase — no unlock here
        const proceedToExpandedDialogue = async () => {
            setShowSkipButton(true);
            setExpandedDialogueMode(true);
            setDialogue(expandedDialogue);
            setDialogueIndex(0);
            setInputActive(false);

            // When dialogue ends, unlock terminal + cutscene if needed
            setOnFinalDialogueComplete(() => finalizeTerminalUnlock);
        };

        // When user skips → punishment → then maybe cutscene → terminal
        skipHandlerRef.current = () => {
            if (skipLocked) return; // prevent double skip triggers
            setSkipLocked(true); // lock further inputs/clicks
            setShowSkipButton(false);
            setIsPunishmentActive(true);
            setDialogue([
                "Oh. You [[𝒔𝒌𝒊𝒑]] things? \n Fine. If you won’t listen... \n ...you’ll [[𝒘𝒂𝒊𝒕]]",
            ]);

            // Ensure dialogue renders before countdown starts
            setTimeout(() => {
                let seconds = 20;
                setPunishmentSecondsLeft(seconds);

                const countdown = setInterval(() => {
                    seconds--;
                    setPunishmentSecondsLeft(seconds);

                    if (seconds <= 0) {
                        clearInterval(countdown);
                        setIsPunishmentActive(false);
                        setDialogueIndex(0);
                        setInputActive(false);
                        // Show "Good luck," and wait for user click before redirect
                        setDialogue(["Good luck,"]);
                        // Wait for click to redirect
                        const handleGoodLuckClick = () => {
                            window.removeEventListener('click', handleGoodLuckClick);
                            finalizeTerminalUnlock().catch(console.error);
                        };
                        setTimeout(() => {
                            window.addEventListener('click', handleGoodLuckClick);
                        }, 100); // slight delay to ensure dialogue is rendered
                    }
                }, 1000);
            }, 300); // short delay to allow text render before countdown
        };

        // Bad input → delete input → type "who are you" slowly → proceed directly to expanded dialogue (no special message)
        const handleInputDeleteSequence = async () => {
            let index = input.length;
            setDeletingInput(true);

            // Step 1: Slowly delete input
            await new Promise<void>((resolve) => {
                const deleteStep = () => {
                    if (index >= 0) {
                        setTypingOverride(input.slice(0, index));
                        setInput(input.slice(0, index));
                        index--;
                        setTimeout(deleteStep, 50);
                    } else {
                        resolve();
                    }
                };
                setTimeout(deleteStep, 400);
            });

            // Step 2: Slowly type "who are you"
            const phrase = "who are you";
            let typed = "";
            let i = 0;
            await new Promise<void>((resolve) => {
                const typeStep = () => {
                    if (i < phrase.length) {
                        typed += phrase[i];
                        setTypingOverride(typed);
                        setInput(typed);
                        i++;
                        setTimeout(typeStep, 100);
                    } else {
                        setDeletingInput(false);
                        setInputActive(false);
                        setTypingOverride("");
                        setDialogueIndex(0);
                        setTimeout(resolve, 3500);
                    }
                };
                setTimeout(typeStep, 400);
            });
            // Directly proceed to expanded dialogue (no special message)
            await proceedToExpandedDialogue();
        };
        // Main logic branch
        if (matched) {
            if (/who are you/i.test(input)) {
                triggerEgg(matched.message);
                // Show special message, then proceed to expanded dialogue
                showDialogueSequence([matched.message], async () => {
                    await proceedToExpandedDialogue();
                }).catch(console.error);
            } else {
                // Show special message, then allow user to retype
                setDialogue([matched.message]);
                setDialogueIndex(0);
                setTimeout(() => setInputActive(true), 2500);
            }
        } else {
            handleInputDeleteSequence().catch(console.error);
        }
    }

    useEffect(() => {
        if (cutsceneActive) {
            audioRef.current?.pause();
        } else {
            audioRef.current?.play().catch(() => {
            });
        }
    }, [cutsceneActive]);

    useEffect(() => {
        return () => {
            audioRef.current?.pause();
        };
    }, []);

    useEffect(() => {
        const playAudio = () => {
            audioRef.current?.play().catch(() => {
            });
            window.removeEventListener('click', playAudio);
        };
        window.addEventListener('click', playAudio, {once: true});
        return () => window.removeEventListener('click', playAudio);
    }, []);

    return (
        <>
            <audio
                ref={audioRef}
                src="/sfx/choices/retrospect.mp3"
                loop
                autoPlay
                style={{display: 'none'}}
            />
        <div style={{
            backgroundColor: '#000',
            color: '#0f0',
            fontFamily: 'monospace',
            minHeight: '100vh',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column-reverse',
            justifyContent: 'flex-end'
        }}>
            {!cutsceneActive && (
                <>
                    {/* Input Field and Skip Button - moved up */}
                    <div style={{
                        width: '100%',
                        maxWidth: 600,
                        margin: '0 auto 32px auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem'
                    }}>
                        {inputActive && !isPunishmentActive && (
                            <div>
                                <input
                                    style={{
                                        width: '100%',
                                        background: 'black',
                                        color: '#0f0',
                                        border: '1px solid #0f0',
                                        fontFamily: 'monospace',
                                        fontSize: '1rem',
                                        padding: '10px'
                                    }}
                                    type="text"
                                    value={typingOverride || input}
                                    onChange={(e) => {
                                        if (!deletingInput) {
                                            setInput(e.target.value);
                                            setTypingOverride('');
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !deletingInput) onSubmit();
                                    }}
                                    placeholder="Say something to the Entity..."
                                    disabled={isPunishmentActive}
                                />
                                <p style={{fontSize: '0.85rem', color: '#555', marginTop: '5px'}}>You get one shot.
                                    Choose wisely.</p>
                            </div>
                        )}

                        {showSkipButton && !isPunishmentActive && (
                            <button
                                onClick={() => skipHandlerRef.current?.()}
                                style={{
                                    marginTop: '1rem',
                                    padding: '10px 20px',
                                    backgroundColor: '#0f0',
                                    color: '#000',
                                    fontFamily: 'monospace',
                                    cursor: 'pointer',
                                    border: 'none',
                                    borderRadius: '4px',
                                    alignSelf: 'center'
                                }}
                            >
                                Skip
                            </button>
                        )}

                        {isPunishmentActive && (
                            <div style={{
                                marginTop: '1rem',
                                color: 'red',
                                fontWeight: 'bold',
                                fontSize: '1.5rem',
                                textAlign: 'center',
                                fontFamily: 'monospace'
                            }}>
                                You chose to skip. <br/>
                                <span style={{fontSize: '2.5rem'}}>{punishmentSecondsLeft}</span> seconds
                                remaining.<br/>
                            </div>
                        )}
                    </div>

                    {/* Main Dialogue Section */}
                    <div onClick={next} style={{
                        cursor: isPunishmentActive ? 'default' : 'pointer',
                        userSelect: 'none',
                        whiteSpace: 'pre-wrap',
                        fontSize: '1.25rem',
                        minHeight: '300px',
                        paddingBottom: '20px',
                        maxWidth: 600,
                        margin: '0 auto'
                    }}>
                        <VNTextRenderer text={dialogue[dialogueIndex] || ''}/>
                        {!inputActive && !isPunishmentActive &&
                            <p style={{textAlign: 'center', color: '#888', fontSize: '0.85rem'}}>Click to
                                continue...</p>}
                    </div>

                    {/* Egg Tracker */}
                    <div style={{
                        position: 'fixed',
                        bottom: '10px',
                        right: '10px',
                        fontSize: '0.75rem',
                        color: '#888'
                    }}>
                        EGGS AND SEEDS: {easterEggs.length} / 15
                    </div>
                </>
            )}
            {/* TAS Death Cutscene Overlay */}
            {cutsceneActive && <TASCutscene onFinish={() => router.push('/terminal')}/>}
        </div>
        </>
    );
}
