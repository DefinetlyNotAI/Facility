"use client";

import React, {useEffect, useRef, useState} from "react";
import {useRouter} from "next/navigation";
import Cookies from 'js-cookie';
import styles from "../../styles/Choices.module.css";
import {
    CHOICE_KEYWORDS,
    GOOD_LUCK_MSG,
    JUMPSCARE_MSG,
    MONOLOGUE,
    PUNISHMENT_MSG,
    TOTAL_EGGS,
    useTypewriter
} from "@/app/choices/DataConstants";
import TASGoodBye from "./TASGoodBye";
import {signCookie} from "@/lib/cookies";
import {BACKGROUND_AUDIO} from "@/lib/audio";

// --- Message Render Helper ---
function renderMsg(msg: string) {
    // Replace /n with <br />
    const parts = msg.split("/n");
    return parts.map((part, idx) =>
        idx === 0 ? part : [<br key={idx}/>, part]
    );
}

// --- Main Component ---
export default function ChoicesPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [greetingStep, setGreetingStep] = useState(0);
    const [greetingMessages, setGreetingMessages] = useState<string[]>([]);
    const [inputPhase, setInputPhase] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [inputDisabled, setInputDisabled] = useState(false);
    const [eggFound, setEggFound] = useState<boolean[]>(Array(TOTAL_EGGS).fill(false));
    const [monologueStep, setMonologueStep] = useState(-1);
    const [showSkip, setShowSkip] = useState(false);
    const [punishment, setPunishment] = useState(false);
    const [punishCountdown, setPunishCountdown] = useState(25);
    const [showGoodLuck, setShowGoodLuck] = useState(false);
    const [cutscene, setCutscene] = useState(false);
    const [alternateGreeting, setAlternateGreeting] = useState(false);
    const [locationInfo, setLocationInfo] = useState<{ city?: string; region?: string; country?: string } | null>(null);
    const [locationCloaked, setLocationCloaked] = useState(false);
    const [locationChecked, setLocationChecked] = useState(false);
    const [osBrowser, setOsBrowser] = useState({os: "Unknown OS", browser: "Unknown Browser"});
    const [jumpscare, setJumpscare] = useState(false);
    const [monologueInstant, setMonologueInstant] = useState(false);
    const [inputHidden, setInputHidden] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    // --- Cookie Check & Device/Location Fetch ---
    useEffect(() => {
        // 1. Cookie check
        if (!Cookies.get("Choice_Unlocked")) {
            router.replace("/404");
            return;
        }
        if (Cookies.get("terminal_unlocked")) setAlternateGreeting(true);

        // 2. Device detection
        function detectOsBrowser(ua: string) {
            let os = "Unknown OS";
            if (/windows/i.test(ua)) os = "Windows";
            else if (/mac/i.test(ua)) os = "MacOS";
            else if (/linux/i.test(ua)) os = "Linux";
            else if (/android/i.test(ua)) os = "Android";
            else if (/iphone|ipad|ipod/i.test(ua)) os = "iOS";
            let browser = "Unknown Browser";
            if (/chrome/i.test(ua)) browser = "Chrome";
            else if (/firefox/i.test(ua)) browser = "Firefox";
            else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = "Safari";
            else if (/edg/i.test(ua)) browser = "Edge";
            return {os, browser};
        }

        const {os, browser} = detectOsBrowser(navigator.userAgent);
        setOsBrowser({os, browser});
        setLoading(false);
    }, []);

    // --- Greeting Message Sequence ---
    useEffect(() => {
        if (loading) return;
        const msgs: string[] = [];
        if (alternateGreeting) {
            msgs.push("Welcome back, persistent one...");
            msgs.push("Why are you back? Didn't you learn your lesson?");
            msgs.push("Are you here to ask more questions?");
            msgs.push("Maybe try and collect all the eggs?");
            msgs.push("Greedy, aren't you?");
            msgs.push("...");
        }
        msgs.push("Connection established.");

        msgs.push(`VESSEL CONNECTION TYPE: ${osBrowser.os}, ${osBrowser.browser}.`);

        // Only fetch location if not already
        if (!locationChecked) {
            fetch("https://ipapi.co/json")
                .then((r) => r.json())
                .then((data) => {
                    setLocationChecked(true);
                    setLocationInfo({
                        city: data.city,
                        region: data.region,
                        country: data.country_name,
                    });
                })
                .catch(() => {
                    setLocationChecked(true);
                    setLocationCloaked(true);
                    // Egg for cloaked location
                    setEggFound((eggs) => {
                        const copy = [...eggs];
                        copy[14] = true; // egg 15 = location cloaked
                        return copy;
                    });
                });
        }

        if (locationCloaked || !locationInfo) {
            msgs.push("Location: [REDACTED]... Funny how that works.");
            msgs.push("You must have cloaked your location. Clever...");
            msgs.push("Or you overloaded the system with requests you got timed out...");
        } else if (locationInfo) {
            msgs.push(
                `Location: ${locationInfo.city}, ${locationInfo.region}, ${locationInfo.country}.`
            );
        }
        msgs.push("Doesn't matter though, right?");
        msgs.push("You are here for a reason, and I know it.");
        msgs.push("Your face just screams 'I want to know more!', ahh curiosity, the most dangerous of all vices.");
        msgs.push("You know the saying 'curiosity killed the cat'? Well, it is half true,");
        msgs.push("Because 'satisfaction brought it back', sadly this part is usually forgotten.");
        msgs.push("You are here to satisfy your curiosity, aren't you?");
        msgs.push("i have wasted enough time.");
        msgs.push("Well, what do you want to ask of me? Just remember you have no choice.. except what fate has written");

        setGreetingMessages(msgs);
        setGreetingStep(0);
        setInputPhase(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading, alternateGreeting, osBrowser, locationInfo, locationCloaked]);

    // --- Audio Control ---
    useEffect(() => {
        if (!audioRef.current) return;
        if (cutscene) {
            audioRef.current.pause();
        } else {
            audioRef.current.loop = true;
            audioRef.current.volume = 0.5;
            audioRef.current.play().catch(() => {
            });
        }
    }, [cutscene]);

    // --- Punishment Countdown ---
    useEffect(() => {
        if (!punishment) return;
        if (punishCountdown <= 0) {
            setPunishment(false);
            setShowGoodLuck(true);
            setJumpscare(false);
            return;
        }
        const t = setTimeout(() => setPunishCountdown((c) => c - 1), 1000);
        return () => clearTimeout(t);
    }, [punishment, punishCountdown]);

    // --- Greeting Advance ---
    const greetingDisplay = useTypewriter(greetingMessages[greetingStep] || "", 22);

    function handleGreetingAdvance() {
        if (greetingStep < greetingMessages.length - 1) {
            setGreetingStep((s) => s + 1);
        } else {
            setInputPhase(true);
        }
    }

    // --- Input Handling ---
    async function handleInputSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (inputDisabled) return;
        setInputDisabled(true);
        const trimmed = inputValue.trim();
        let matchedIndexes: number[] = [];
        let matchedEgg = -1;
        let matchedMsg = "";
        for (let i = 0; i < CHOICE_KEYWORDS.length; ++i) {
            if (CHOICE_KEYWORDS[i].regex.test(trimmed)) {
                matchedIndexes.push(i);
            }
        }
        if (matchedIndexes.length > 0) {
            matchedEgg = CHOICE_KEYWORDS[matchedIndexes[0]].egg;
            matchedMsg = CHOICE_KEYWORDS[matchedIndexes[0]].message;
            setEggFound((eggs) => {
                const copy = [...eggs];
                copy[matchedEgg] = true;
                return copy;
            });
            let msg = matchedMsg;
            await showMessage(msg);
            // If "who are you" (egg 4), proceed and do not allow reinput
            if (matchedEgg === 4) {
                setInputPhase(false);
                setInputHidden(true);
                setTimeout(() => setMonologueStep(0), 500);
            } else {
                setInputDisabled(false);
            }
            return;
        }
        // No match: slowly delete, then type "who are you"
        await slowDeleteInput();
        await slowTypeInput("who are you");
        setTimeout(() => {
            setInputPhase(false);
            setInputHidden(true);
            setMonologueStep(0);
        }, 500);
    }

    // --- Helpers for Input Animation ---
    function slowDeleteInput(): Promise<void> {
        return new Promise((resolve) => {
            let i = inputValue.length;

            function step() {
                if (i <= 0) return resolve();
                setInputValue((v) => v.slice(0, -1));
                setTimeout(step, 50);
                i--;
            }

            step();
        });
    }

    function slowTypeInput(str: string): Promise<void> {
        return new Promise((resolve) => {
            let i = 0;

            function step() {
                if (i > str.length) return resolve();
                setInputValue(str.slice(0, i));
                setTimeout(step, 80);
                i++;
            }

            step();
        });
    }

    function showMessage(msg: string): Promise<void> {
        return new Promise((resolve) => {
            setGreetingMessages([msg]);
            setGreetingStep(0);
            setTimeout(resolve, 1800);
        });
    }

    // --- Monologue Advance ---
    const monologueDisplay = useTypewriter(
        monologueStep >= 0 && monologueStep < MONOLOGUE.length
            ? MONOLOGUE[monologueStep]
            : "",
        22,
        monologueInstant
    );

    async function handleMonologueAdvance() {
        if (punishment || jumpscare || showGoodLuck) return;
        if (monologueStep < MONOLOGUE.length - 1) {
            setMonologueStep((s) => s + 1);
        } else {
            await unlockTerminal();
        }
    }

    // --- Skip Handling ---
    function handleSkip(e: React.MouseEvent) {
        e.stopPropagation();
        setShowSkip(false);
        setJumpscare(true);
        setMonologueInstant(true);
        setTimeout(() => {
            setJumpscare(false);
            setPunishment(true);
            setPunishCountdown(25);
            setMonologueInstant(false);
        }, 1200); // Jumpscare duration
    }

    // --- Good Luck Continue Handler ---
    async function handleGoodLuckClick() {
        setShowGoodLuck(false);
        await unlockTerminal();
    }

    // --- Terminal Unlock & Cutscene ---
    async function unlockTerminal() {
        await signCookie("terminal_unlocked=true");
        if (!Cookies.get("KILLTAS_cutscene_seen")) {
            setCutscene(true);
        } else {
            router.replace("/terminal");
        }
    }

    // --- Egg Tracker ---
    const eggsFoundCount = eggFound.filter(Boolean).length;

    useEffect(() => {
        if (!audioRef.current) return;

        // Play audio only after user interaction
        const playAudio = () => {
            if (cutscene) {
                audioRef.current?.pause();
            } else if (audioRef.current) {
                audioRef.current.loop = true;
                audioRef.current.volume = 0.5;
                audioRef.current.play().catch(() => {
                });
            }
            window.removeEventListener("click", playAudio);
            window.removeEventListener("keydown", playAudio);
        };

        // Attach event listeners for first interaction
        window.addEventListener("click", playAudio);
        window.addEventListener("keydown", playAudio);

        // Cleanup
        return () => {
            window.removeEventListener("click", playAudio);
            window.removeEventListener("keydown", playAudio);
        };
    }, [cutscene]);

    // --- Render ---
    return (
        <div className={styles["choices-root"]} onClick={() => {
            if (monologueStep >= 0 && !punishment && !showGoodLuck && !jumpscare) setShowSkip(true);
        }}>
            {/* Hidden looping audio */}
            <audio ref={audioRef} src={BACKGROUND_AUDIO.CHOICES} style={{display: "none"}}/>

            {/* Egg tracker */}
            <div className={styles["egg-tracker"]} title="Secret eggs found">
                Eggs in trees: {eggsFoundCount} / {TOTAL_EGGS}
            </div>

            {/* Cutscene overlay */}
            {cutscene && (
                <TASGoodBye
                    onDone={() => router.replace("/terminal")}
                />
            )}

            {/* Greeting sequence */}
            {!cutscene && monologueStep < 0 && (
                <div className={styles["terminal-block"]} onClick={handleGreetingAdvance}>
                    <span>{renderMsg(greetingDisplay)}</span>
                    {greetingStep < greetingMessages.length - 1 && greetingDisplay === greetingMessages[greetingStep] && (
                        <span className={styles["blink"]}> ▍</span>
                    )}
                </div>
            )}

            {/* Input phase */}
            {!cutscene && inputPhase && !inputHidden && (
                <form className={styles["terminal-block"]} onSubmit={handleInputSubmit}>
                    <span>&gt; </span>
                    <input
                        className={styles["terminal-input"]}
                        type="text"
                        value={inputValue}
                        disabled={inputDisabled}
                        autoFocus
                        onChange={(e) => setInputValue(e.target.value)}
                        maxLength={64}
                        style={{
                            background: "transparent",
                            color: "#00FF00",
                            border: "none",
                            outline: "none",
                            fontFamily: "inherit",
                            fontSize: "inherit",
                            width: "60%",
                        }}
                    />
                </form>
            )}

            {/* Monologue phase */}
            {!cutscene && monologueStep >= 0 && (
                <div className={styles["terminal-block"]} onClick={handleMonologueAdvance}>
                    {!jumpscare && !punishment && !showGoodLuck && (
                        <>
                            <span>{renderMsg(monologueDisplay)}</span>
                            {showSkip && monologueDisplay === MONOLOGUE[monologueStep] && (
                                <button className={styles["skip-btn"]} onClick={handleSkip}>
                                    Skip
                                </button>
                            )}
                        </>
                    )}
                    {jumpscare && (
                        <div className={styles["jumpscare"]}>{JUMPSCARE_MSG}</div>
                    )}
                    {punishment && (
                        <div>
                            <div>How rude. You would skip what others crave?</div>
                            <div>{renderMsg(PUNISHMENT_MSG)}</div>
                            <div>{punishCountdown}s</div>
                        </div>
                    )}
                    {showGoodLuck && (
                        <div>
                            <div>{renderMsg(GOOD_LUCK_MSG)}</div>
                            <button className={styles["skip-btn"]} onClick={handleGoodLuckClick}>Continue</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
