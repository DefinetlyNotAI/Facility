'use client';

import React, {useEffect, useRef, useState} from 'react';
import Link from 'next/link';
import {chapterIVPublic as chapterIVData} from '@/lib/data/chapters.public';
import {seededTokens} from '@/lib/puzzles';
import {routes} from '@/lib/saveData';
import {useChapter4Access} from "@/hooks/BonusActHooks/useChapterSpecialAccess";
import {useBackgroundAudio} from "@/hooks/useBackgroundAudio";
import {BACKGROUND_AUDIO, playSafeSFX, SFX_AUDIO} from "@/lib/data/audio";

// Riddle component reused from TREE/TAS
const Riddle = ({idx, prompt, expectedChunk, onResult}: {
    idx: number,
    prompt: string,
    expectedChunk: string,
    onResult: (i: number, ok: boolean) => void
}) => {
    const [answer, setAnswer] = useState('');
    const [correct, setCorrect] = useState<boolean | null>(null);

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        const ok = answer.trim().toLowerCase() === expectedChunk;
        setCorrect(ok);
        onResult(idx, ok);
    }

    return (
        <div className="p-4 bg-gray-800 rounded border border-gray-700">
            <div className="text-sm text-gray-400 mb-2">{prompt}</div>
            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder={`Riddle ${idx + 1} answer`}
                    className="bg-gray-900 text-white font-mono text-sm px-3 py-2 rounded flex-1"
                />
                <button type="submit"
                        className="bg-green-600 hover:bg-green-500 text-black font-mono px-3 py-1 rounded text-sm">Submit
                </button>
            </form>
            {correct === true && (
                <div className="mt-2 text-sm text-green-400">Correct!</div>
            )}
            {correct === false && (
                <div className="mt-2 text-sm text-red-400">Try again.</div>
            )}
        </div>
    );
}

export default function EntityPuzzlePage() {
    const isCurrentlySolved = useChapter4Access();
    const audioRef = useRef<HTMLAudioElement>(null);

    useBackgroundAudio(audioRef, BACKGROUND_AUDIO.BONUS.IV);
    if (!isCurrentlySolved) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white font-mono">Loading...</div>
            </div>
        );
    }
    const puzzle = (chapterIVData as any).puzzles?.Entity;
    if (!puzzle) return <div className="min-h-screen flex items-center justify-center">Puzzle not found.</div>;

    const stages = puzzle.stageData || [];
    const storageKey = 'chapterIV-Entity-progress';
    const cookieKey = 'chapterIV-plaque-progress';

    // JSON cookie helpers (same shape as page.tsx)
    function getJsonCookie(name: string): any | null {
        try {
            const match = document.cookie.split(';').map(s => s.trim()).find(c => c.startsWith(name + '='));
            if (!match) return null;
            const value = decodeURIComponent(match.split('=')[1] || '');
            return JSON.parse(value);
        } catch (e) {
            return null;
        }
    }

    function setJsonCookie(name: string, obj: any, days = 365) {
        try {
            const value = encodeURIComponent(JSON.stringify(obj));
            const d = new Date();
            d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
            document.cookie = `${name}=${value}; path=/; expires=${d.toUTCString()}; SameSite=Lax`;
        } catch (e) {
            // ignore cookie errors
        }
    }

    const markCompleted = () => {
        try {
            const current = getJsonCookie(cookieKey) || {};
            const prev = Number(current['Entity'] || 0);
            // 0 = not started, 1 = started, 2 = completed
            current['Entity'] = Math.max(prev, 2);
            setJsonCookie(cookieKey, current, 365);
        } catch (e) {
        }
    }

    useEffect(() => {
        // merge cookie state: when user opens puzzle, set to at least 2 (started)
        try {
            const current = getJsonCookie(cookieKey) || {};
            const prev = Number(current['Entity'] || 0);
            if (prev < 2) {
                current['Entity'] = 2;
                setJsonCookie(cookieKey, current, 365);
            }
        } catch (e) {
        }
    }, []);

    // Load saved progress
    useEffect(() => {
        try {
            const raw = localStorage.getItem(storageKey);
            if (raw) {
                const i = parseInt(raw, 10);
                if (!isNaN(i)) {
                    if (i >= stages.length) {
                        setCompleted(true);
                        setStageIndex(stages.length);
                    } else if (i >= 0) {
                        setStageIndex(i);
                    }
                }
            }
        } catch (e) {
        }
    }, [stages.length]);

    const [completed, setCompleted] = useState<boolean>(false);
    const [stageIndex, setStageIndex] = useState<number>(0);
    const [input, setInput] = useState<string>('');
    const [feedback, setFeedback] = useState<string>('');

    // riddle chain correctness (support up to 12 riddles for longer chains)
    const MAX_RIDDLES = 12;
    const [riddleCorrects, setRiddleCorrects] = useState<boolean[]>(new Array(MAX_RIDDLES).fill(false));

    // Persist progress to localStorage (still useful for per-device quick load)
    useEffect(() => {
        try {
            localStorage.setItem(storageKey, String(stageIndex));
        } catch (e) {
        }
    }, [stageIndex]);

    // stage2 grid
    const [grid] = useState<string[]>(['m', 'i', 'r', 'r', 'o', 'r', 'x', 'x', 'x']);
    const [selection, setSelection] = useState<string>('');

    // stage3 anomalies
    const [anomalies, setAnomalies] = useState<string[]>([]);
    const [picked, setPicked] = useState<boolean[]>([]);
    const [anSelection, setAnSelection] = useState<string>('');

    // general per-stage results for later weave/validate
    const [stageResults, setStageResults] = useState<Record<number, string>>({});
    const setStageResult = (idx: number, val: string) => setStageResults(prev => ({...prev, [idx]: val}));

    // PUZZLE 1: Memory Decay - Stage 3
    const [memorySequence, setMemorySequence] = useState<string[]>([]);
    const [memoryInput, setMemoryInput] = useState<string>('');
    const [sequenceShown, setSequenceShown] = useState<boolean>(false);
    const [decayLevel, setDecayLevel] = useState<number>(0);
    const [memoryFlashCount, setMemoryFlashCount] = useState<number>(0);

    // PUZZLE 2: Shadow Typing - Stage 4
    const [shadowText, setShadowText] = useState<string>('');
    const [shadowInput, setShadowInput] = useState<string>('');
    const [shadowGlitches, setShadowGlitches] = useState<number[]>([]);
    const [isTypingBlind, setIsTypingBlind] = useState<boolean>(false);

    // PUZZLE 3: Breathing Walls - Stage 5
    const [wallPattern, setWallPattern] = useState<boolean[]>([]);
    const [breathPhase, setBreathPhase] = useState<number>(0);
    const [wallPressure, setWallPressure] = useState<number>(0);
    const [lastBreathTime, setLastBreathTime] = useState<number>(Date.now());

    // PUZZLE 4: Fragmented Self - Stage 6
    const [mirrorFragments, setMirrorFragments] = useState<{ id: string, text: string, corrupted: boolean }[]>([]);
    const [fragmentSelection, setFragmentSelection] = useState<string[]>([]);
    const [reflectionIntegrity, setReflectionIntegrity] = useState<number>(100);

    // PUZZLE 5: Time Distortion - Stage 7
    const [timeMarkers, setTimeMarkers] = useState<{ time: number, real: boolean }[]>([]);
    const [selectedMarkers, setSelectedMarkers] = useState<number[]>([]);
    const [temporalDrift, setTemporalDrift] = useState<number>(0);

    // PUZZLE 6: Whispering Names - Stage 8
    const [whisperNames, setWhisperNames] = useState<string[]>([]);
    const [whisperVolume, setWhisperVolume] = useState<number>(0.5);
    const [nameConfidence, setNameConfidence] = useState<number>(0);

    // PUZZLE 7: The Unwatched Door - Stage 9
    const [doorState, setDoorState] = useState<'closed' | 'cracked' | 'opening' | 'open'>('closed');
    const [watchingDoor, setWatchingDoor] = useState<boolean>(false);
    const [doorOpenProgress, setDoorOpenProgress] = useState<number>(0);
    const [somethingBehindDoor, setSomethingBehindDoor] = useState<boolean>(false);

    // unlocked stage tracking (TREE-style)
    const [unlockedStage, setUnlockedStage] = useState<number>(0);
    const unlockAndGo = (index: number) => {
        setUnlockedStage(prev => Math.max(prev, index));
        setStageIndex(index);
        try {
            localStorage.setItem(storageKey, String(index));
        } catch (e) {
        }
    }

    useEffect(() => {
        if (stageIndex > unlockedStage) setStageIndex(unlockedStage);
    }, [stageIndex, unlockedStage]);

    useEffect(() => {
        // if loading a saved index, also ensure unlockedStage is at least that index
        try {
            const raw = localStorage.getItem(storageKey);
            if (raw) {
                const i = parseInt(raw, 10);
                if (!isNaN(i)) {
                    setUnlockedStage(Math.max(0, i));
                }
            }
        } catch (e) {
        }
    }, []);

    // stage2 timer & penalties inspired by TREE
    const [anomaliesStarted, setAnomaliesStarted] = useState<boolean>(false);
    const [stage2BaseTime, setStage2BaseTime] = useState<number>(12);
    const [remainingTime, setRemainingTime] = useState<number>(stage2BaseTime);
    const [, setConsecutiveTimeFails] = useState<number>(0);

    useEffect(() => {
        if (stageIndex === 2 && anomalies.length === 0) {
            const base = ['a', 'n', 'o', 'm', 'a', 'l', 'y'];
            const seedStr = stages[0]?.payload || 'Entity';
            const tokens = seededTokens(base, seedStr);
            setAnomalies(tokens);
            setPicked(new Array(tokens.length).fill(false));
            setAnSelection('');
            setFeedback('Select anomaly tokens to form the proof string.');
            setRemainingTime(stage2BaseTime);
        }
    }, [stageIndex]);

    // PUZZLE 1: Memory Decay initialization
    useEffect(() => {
        if (stageIndex === 3 && memorySequence.length === 0) {
            const symbols = ['◆', '◇', '◈', '◉', '○', '●', '△', '▽'];
            const length = 6 + decayLevel;
            const sequence = Array.from({length}, () => symbols[Math.floor(Math.random() * symbols.length)]);
            setMemorySequence(sequence);
            setSequenceShown(false);
            setMemoryInput('');
            setFeedback('Watch the sequence carefully. It will decay with each viewing...');
        }
    }, [stageIndex, decayLevel]);

    // PUZZLE 2: Shadow Typing initialization
    useEffect(() => {
        if (stageIndex === 4 && shadowText === '') {
            const texts = [
                'I_am_watching_you_type',
                'your_fingers_know_the_truth',
                'dont_look_at_the_screen',
                'trust_your_muscle_memory'
            ];
            const selected = texts[Math.floor(Math.random() * texts.length)];
            setShadowText(selected);
            setShadowInput('');
            setShadowGlitches([]);
            setFeedback('Type the phrase. But the screen will hide what you type...');
        }
    }, [stageIndex]);

    // PUZZLE 3: Breathing Walls initialization
    useEffect(() => {
        if (stageIndex === 5 && wallPattern.length === 0) {
            const pattern = Array.from({length: 9}, (_, i) => i % 2 === 0);
            setWallPattern(pattern);
            setBreathPhase(0);
            setWallPressure(0);
            setLastBreathTime(Date.now());
            setFeedback('The walls breathe. Match their rhythm or be crushed...');
        }
    }, [stageIndex]);

    // PUZZLE 4: Fragmented Self initialization
    useEffect(() => {
        if (stageIndex === 6 && mirrorFragments.length === 0) {
            const fragments = [
                {id: 'f1', text: 'WHO', corrupted: false},
                {id: 'f2', text: 'ARE', corrupted: false},
                {id: 'f3', text: 'YOU', corrupted: true},
                {id: 'f4', text: 'REALLY', corrupted: false},
                {id: 'f5', text: 'NOT', corrupted: true},
                {id: 'f6', text: 'HUMAN', corrupted: false}
            ];
            setMirrorFragments(fragments);
            setFragmentSelection([]);
            setReflectionIntegrity(100);
            setFeedback('Your reflection fragments. Choose the pieces that are truly you...');
        }
    }, [stageIndex]);

    // PUZZLE 5: Time Distortion initialization
    useEffect(() => {
        if (stageIndex === 7 && timeMarkers.length === 0) {
            const markers = Array.from({length: 12}, (_, i) => ({
                time: Date.now() + (i * 1000) + Math.random() * 500,
                real: Math.random() > 0.4
            }));
            setTimeMarkers(markers);
            setSelectedMarkers([]);
            setTemporalDrift(0);
            setFeedback('Time loops and fractures. Select only the real moments...');
        }
    }, [stageIndex]);

    // PUZZLE 6: Whispering Names initialization
    useEffect(() => {
        if (stageIndex === 8 && whisperNames.length === 0) {
            const names = ['Entity', 'Shadow', 'Watcher', 'Witness', 'Nobody', 'Something', 'It', 'Them'];
            const shuffled = names.sort(() => Math.random() - 0.5);
            setWhisperNames(shuffled);
            setNameConfidence(0);
            setFeedback('Many names whisper in the dark. Which ones are real?');
        }
    }, [stageIndex]);

    // PUZZLE 7: Unwatched Door initialization
    useEffect(() => {
        if (stageIndex === 9 && doorState === 'closed') {
            setDoorState('closed');
            setWatchingDoor(false);
            setDoorOpenProgress(0);
            setSomethingBehindDoor(true);
            setFeedback('There is a door. It only opens when you are not looking...');
        }
    }, [stageIndex]);

    useEffect(() => {
        try {
            localStorage.setItem(storageKey, String(stageIndex));
        } catch (e) {
        }
    }, [stageIndex]);

    // Timer effect for stage 2
    useEffect(() => {
        if (stageIndex !== 2) return;
        if (!anomaliesStarted) return;
        let cancelled = false;
        const tick = () => {
            setRemainingTime(prev => {
                if (cancelled) return prev;
                if (prev <= 1) {
                    setAnSelection('');
                    setPicked(new Array(anomalies.length).fill(false));
                    setFeedback('Time expired - selection reset.');
                    setConsecutiveTimeFails(prevFails => {
                        const next = prevFails + 1;
                        if (next >= 3) {
                            setStage2BaseTime(bt => bt + 4);
                            setFeedback('Three consecutive time failures - timer increased by 4 seconds.');
                            return 0;
                        }
                        return next;
                    });
                    return stage2BaseTime;
                }
                return prev - 1;
            });
        }

        const id = setInterval(tick, 1000);
        return () => {
            cancelled = true;
            clearInterval(id);
        };
    }, [stageIndex, anomaliesStarted, anomalies.length, stage2BaseTime]);

    // PUZZLE 1: Memory Decay - sequence flashing and degradation
    useEffect(() => {
        if (stageIndex !== 3 || !sequenceShown) return;
        const flashInterval = setInterval(() => {
            setMemoryFlashCount(prev => {
                const next = prev + 1;
                if (next >= 3) {
                    setSequenceShown(false);
                    setDecayLevel(d => d + 1);
                    return 0;
                }
                return next;
            });
        }, 2000);
        return () => clearInterval(flashInterval);
    }, [stageIndex, sequenceShown]);

    // PUZZLE 3: Breathing Walls - continuous breathing cycle
    useEffect(() => {
        if (stageIndex !== 5) return;
        const breathInterval = setInterval(() => {
            setBreathPhase(prev => (prev + 1) % 4);
            const now = Date.now();
            const timeSinceLastBreath = now - lastBreathTime;

            // If player doesn't interact, walls close in
            if (timeSinceLastBreath > 8000) {
                setWallPressure(prev => Math.min(100, prev + 5));
            } else {
                setWallPressure(prev => Math.max(0, prev - 2));
            }

            if (wallPressure >= 100) {
                setFeedback('The walls have crushed you. Restarting...');
                setWallPattern(Array.from({length: 9}, (_, i) => i % 2 === 0));
                setWallPressure(0);
                setLastBreathTime(Date.now());
            }
        }, 1000);
        return () => clearInterval(breathInterval);
    }, [stageIndex, lastBreathTime, wallPressure]);

    // PUZZLE 4: Fragmented Self - integrity decay over time
    useEffect(() => {
        if (stageIndex !== 6) return;
        const decayInterval = setInterval(() => {
            setReflectionIntegrity(prev => {
                const next = Math.max(0, prev - 2);
                if (next <= 0) {
                    setFeedback('Your reflection has shattered completely. Restarting...');
                    setMirrorFragments(mf => mf.map(f => ({...f, corrupted: Math.random() > 0.5})));
                    setFragmentSelection([]);
                    return 100;
                }
                return next;
            });
        }, 1500);
        return () => clearInterval(decayInterval);
    }, [stageIndex]);

    // PUZZLE 5: Time Distortion - temporal drift increases with bad selections
    useEffect(() => {
        if (stageIndex !== 7) return;
        const driftInterval = setInterval(() => {
            setTemporalDrift(prev => Math.min(100, prev + 0.5));
        }, 100);
        return () => clearInterval(driftInterval);
    }, [stageIndex]);

    // PUZZLE 6: Whispering Names - volume oscillation
    useEffect(() => {
        if (stageIndex !== 8) return;
        const whisperInterval = setInterval(() => {
            setWhisperVolume(Math.random() * 0.3 + 0.5);
            // Names occasionally change
            if (Math.random() < 0.1) {
                setWhisperNames(prev => {
                    const newNames = [...prev];
                    const idx = Math.floor(Math.random() * newNames.length);
                    const corrupted = ['Nobody', 'Nothing', 'Never', 'Nowhere', 'No One'];
                    newNames[idx] = corrupted[Math.floor(Math.random() * corrupted.length)];
                    return newNames;
                });
            }
        }, 2000);
        return () => clearInterval(whisperInterval);
    }, [stageIndex]);

    // PUZZLE 7: Unwatched Door - opens when not being watched
    useEffect(() => {
        if (stageIndex !== 9) return;
        const doorInterval = setInterval(() => {
            if (!watchingDoor) {
                setDoorOpenProgress(prev => {
                    const next = Math.min(100, prev + 2);
                    if (next >= 25 && doorState === 'closed') setDoorState('cracked');
                    if (next >= 50 && doorState === 'cracked') setDoorState('opening');
                    if (next >= 100 && doorState === 'opening') {
                        setDoorState('open');
                        setFeedback('The door is open. Something passed through...');
                    }
                    return next;
                });
            } else {
                // Door closes when watched
                setDoorOpenProgress(prev => Math.max(0, prev - 5));
                if (doorState !== 'closed' && doorOpenProgress < 10) {
                    setDoorState('closed');
                }
            }
        }, 100);
        return () => clearInterval(doorInterval);
    }, [stageIndex, watchingDoor, doorState, doorOpenProgress]);

    // mutate anomalies occasionally to increase challenge
    const mutateAnomalies = () => {
        setAnomalies(prev => {
            const chars = 'abcdefghijklmnopqrstuvwxyz'.split('');
            let changed = false;
            const next = prev.map(a => a);
            for (let i = 0; i < next.length; i++) {
                if (Math.random() < 0.2) {
                    const choice = chars[Math.floor(Math.random() * chars.length)];
                    next[i] = next[i].slice(1) + choice; // shift and append random
                    changed = true;
                }
            }
            return changed ? next : prev;
        });
    }

    const clickGrid = (i: number) => {
        setSelection(prev => prev + grid[i]);
        setFeedback('');
    }
    const submitGrid = async () => {
        // validate stage 2 with server
        try {
            const json = await apiValidate('Entity', 1, selection);
            if (json?.ok) {
                // success sound
                try {
                    playSafeSFX(audioRef, SFX_AUDIO.SUCCESS, false);
                } catch (e) {
                }
                setFeedback('Correct — advancing');
                setStageResult(1, selection);
                setTimeout(() => unlockAndGo(2), 400);
            } else {
                // error sound
                try {
                    playSafeSFX(audioRef, SFX_AUDIO.ERROR, false);
                } catch (e) {
                }
                setFeedback('Incorrect path');
            }
        } catch (e) {
            try {
                playSafeSFX(audioRef, SFX_AUDIO.ERROR, false);
            } catch (er) {
            }
            setFeedback('Server error');
        }
    }

    const clickAnomaly = (i: number) => {
        if (!anomaliesStarted) setAnomaliesStarted(true);
        if (picked[i]) return;
        setPicked(prev => {
            const c = prev.slice();
            c[i] = true;
            return c;
        });
        setAnSelection(prev => prev + anomalies[i].charAt(0));
        // mutate occasionally to keep player on their toes
        if (Math.random() < 0.35) mutateAnomalies();
    }
    const submitAnomalies = async () => {
        try {
            const json = await apiValidate('Entity', 2, anSelection);
            if (json?.ok) {
                try {
                    playSafeSFX(audioRef, SFX_AUDIO.SUCCESS, false);
                } catch (e) {
                }
                setFeedback('Correct proof — complete');
                setStageResult(2, anSelection);
                setTimeout(() => {
                    setStageIndex(3);
                    setCompleted(true);
                    try {
                        localStorage.setItem(storageKey, String(stages.length));
                    } catch (e) {
                    }
                    markCompleted();
                }, 400);
            } else {
                try {
                    playSafeSFX(audioRef, SFX_AUDIO.ERROR, false);
                } catch (e) {
                }
                setFeedback('Incorrect proof');
            }
        } catch (e) {
            try {
                playSafeSFX(audioRef, SFX_AUDIO.ERROR, false);
            } catch (er) {
            }
            setFeedback('Server error');
        }
    }

    // WEAVE stage: place tokens into numbered slots (simple click-to-place)
    const [weaveSlots, setWeaveSlots] = useState<string[]>([]);
    useEffect(() => {
        if (stageIndex === 4 && weaveSlots.length === 0) {
            const slots = new Array(5).fill('');
            setWeaveSlots(slots);
            setFeedback('Arrange tokens into the weave slots. Click a token then click an empty slot.');
        }
    }, [stageIndex]);

    const [selectedTokenIndex, setSelectedTokenIndex] = useState<number | null>(null);
    const clickWeaveToken = (i: number) => {
        setSelectedTokenIndex(i);
    }
    const placeWeaveSlot = (slot: number) => {
        if (selectedTokenIndex === null) return;
        const token = anomalies[selectedTokenIndex] || '';
        setWeaveSlots(prev => {
            const c = prev.slice();
            c[slot] = token;
            return c;
        });
        setSelectedTokenIndex(null);
    }
    const submitWeave = async () => {
        const payload = weaveSlots.join('');
        try {
            const json = await apiValidate('Entity', 4, payload);
            if (json?.ok) {
                try {
                    playSafeSFX(audioRef, SFX_AUDIO.SUCCESS, false);
                } catch (e) {
                }
                setFeedback('Weave accepted.');
                setStageResult(4, payload);
                setTimeout(() => unlockAndGo(5), 400);
            } else {
                try {
                    playSafeSFX(audioRef, SFX_AUDIO.ERROR, false);
                } catch (e) {
                }
                setFeedback('Weave incorrect');
            }
        } catch (e) {
            try {
                playSafeSFX(audioRef, SFX_AUDIO.ERROR, false);
            } catch (er) {
            }
            setFeedback('Server error');
        }
    }

    // VALIDATE stage: submit assembled indices (uses stageResults from prior stages)
    const handleValidateSubmit = async () => {
        const payload = stageResults[4] || '';
        try {
            const json = await apiValidate('Entity', 5, payload);
            if (json?.ok) {
                try {
                    playSafeSFX(audioRef, SFX_AUDIO.SUCCESS, false);
                } catch (e) {
                }
                setFeedback('Timeline proof validated.');
                setStageResult(5, payload);
                setTimeout(() => unlockAndGo(6), 400);
            } else {
                try {
                    playSafeSFX(audioRef, SFX_AUDIO.ERROR, false);
                } catch (e) {
                }
                setFeedback('Validation failed');
            }
        } catch (e) {
            try {
                playSafeSFX(audioRef, SFX_AUDIO.ERROR, false);
            } catch (er) {
            }
            setFeedback('Server error');
        }
    }

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        const provided = (input || '').trim().toLowerCase();
        // Validate with server (stage 0 and others)
        try {
            const json = await apiValidate('Entity', stageIndex, provided);
            if (json?.ok) {
                try {
                    playSafeSFX(audioRef, SFX_AUDIO.SUCCESS, false);
                } catch (e) {
                }
                if (stageIndex >= stages.length - 1) {
                    // require riddle chain to be solved on final
                    if (!riddleCorrects.every(Boolean)) {
                        setFeedback('Solve the riddle chain before finalizing the plaque.');
                        return;
                    }
                    setStageIndex(stages.length);
                    setCompleted(true);
                    try {
                        localStorage.setItem(storageKey, String(stages.length));
                    } catch (e) {
                    }
                    setFeedback('Puzzle completed');
                    markCompleted();
                } else {
                    const next = stageIndex + 1;
                    unlockAndGo(next);
                    setInput('');
                    setFeedback('Advanced');
                }
            } else {
                try {
                    playSafeSFX(audioRef, SFX_AUDIO.ERROR, false);
                } catch (e) {
                }
                setFeedback('Incorrect');
            }
        } catch (e) {
            try {
                playSafeSFX(audioRef, SFX_AUDIO.ERROR, false);
            } catch (er) {
            }
            setFeedback('Server error');
        }
    }

    // PUZZLE 1: Memory Decay handlers
    const showMemorySequence = () => {
        setSequenceShown(true);
        setMemoryFlashCount(0);
        setFeedback('Memorizing... sequence will hide soon.');
    };

    const submitMemorySequence = async () => {
        const correct = memoryInput === memorySequence.join('');
        if (correct) {
            try {
                playSafeSFX(audioRef, SFX_AUDIO.SUCCESS, false);
            } catch (e) {
            }
            setFeedback('Memory intact. Advancing...');
            setTimeout(() => unlockAndGo(4), 500);
        } else {
            try {
                playSafeSFX(audioRef, SFX_AUDIO.ERROR, false);
            } catch (e) {
            }
            setFeedback('Memory corrupted. The sequence has changed...');
            setMemorySequence([]);
            setDecayLevel(prev => prev + 1);
        }
    };

    // PUZZLE 2: Shadow Typing handlers
    const handleShadowTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setShadowInput(value);

        // Random glitches
        if (Math.random() < 0.15) {
            setShadowGlitches(prev => [...prev, value.length]);
        }

        // Occasionally hide input
        if (Math.random() < 0.1) {
            setIsTypingBlind(true);
            setTimeout(() => setIsTypingBlind(false), 1000);
        }
    };

    const submitShadowTyping = async () => {
        const correct = shadowInput.toLowerCase() === shadowText.toLowerCase();
        if (correct) {
            try {
                playSafeSFX(audioRef, SFX_AUDIO.SUCCESS, false);
            } catch (e) {
            }
            setFeedback('You trusted yourself. Advancing...');
            setTimeout(() => unlockAndGo(5), 500);
        } else {
            try {
                playSafeSFX(audioRef, SFX_AUDIO.ERROR, false);
            } catch (e) {
            }
            setFeedback(`Incorrect. Expected: ${shadowText}`);
            setShadowInput('');
            setShadowGlitches([]);
        }
    };

    // PUZZLE 3: Breathing Walls handlers
    const clickWallPanel = (index: number) => {
        const newPattern = [...wallPattern];
        newPattern[index] = !newPattern[index];
        setWallPattern(newPattern);
        setLastBreathTime(Date.now());

        // Check if correct pattern (alternating)
        const isCorrect = newPattern.every((val, i) => val === (i % 2 === 0));
        if (isCorrect) {
            try {
                playSafeSFX(audioRef, SFX_AUDIO.SUCCESS, false);
            } catch (e) {
            }
            setFeedback('You matched the breath. The walls recede...');
            setTimeout(() => unlockAndGo(6), 500);
        }
    };

    // PUZZLE 4: Fragmented Self handlers
    const selectFragment = (fragment: { id: string, text: string, corrupted: boolean }) => {
        if (fragment.corrupted) {
            setReflectionIntegrity(prev => Math.max(0, prev - 15));
            setFeedback('That fragment is corrupted. You lose yourself further...');
            try {
                playSafeSFX(audioRef, SFX_AUDIO.ERROR, false);
            } catch (e) {
            }
        } else {
            setFragmentSelection(prev => [...prev, fragment.text]);
            setFeedback(`Fragment collected: ${fragment.text}`);

            // Check if correct fragments collected
            const correctFragments = ['WHO', 'ARE', 'REALLY', 'HUMAN'];
            const hasAll = correctFragments.every(f => [...fragmentSelection, fragment.text].includes(f));
            if (hasAll && fragmentSelection.length >= 3) {
                try {
                    playSafeSFX(audioRef, SFX_AUDIO.SUCCESS, false);
                } catch (e) {
                }
                setFeedback('You remember yourself. Advancing...');
                setTimeout(() => unlockAndGo(7), 500);
            }
        }
    };

    // PUZZLE 5: Time Distortion handlers
    const selectTimeMarker = (index: number) => {
        const marker = timeMarkers[index];

        if (!marker.real) {
            setTemporalDrift(prev => Math.min(100, prev + 10));
            setFeedback('That moment was false. Time distorts further...');
            try {
                playSafeSFX(audioRef, SFX_AUDIO.ERROR, false);
            } catch (e) {
            }
        } else {
            setSelectedMarkers(prev => [...prev, index]);
            setFeedback(`Real moment captured. ${selectedMarkers.length + 1}/5`);

            if (selectedMarkers.length >= 4) {
                try {
                    playSafeSFX(audioRef, SFX_AUDIO.SUCCESS, false);
                } catch (e) {
                }
                setFeedback('Timeline stabilized. Advancing...');
                setTimeout(() => unlockAndGo(8), 500);
            }
        }
    };

    // PUZZLE 6: Whispering Names handlers
    const selectWhisperName = (name: string) => {
        const trueName = 'Entity';
        if (name === trueName) {
            setNameConfidence(prev => Math.min(100, prev + 25));
            setFeedback('That name resonates with truth...');

            if (nameConfidence >= 75) {
                try {
                    playSafeSFX(audioRef, SFX_AUDIO.SUCCESS, false);
                } catch (e) {
                }
                setFeedback('You know its true name. Advancing...');
                setTimeout(() => unlockAndGo(9), 500);
            }
        } else {
            setNameConfidence(prev => Math.max(0, prev - 10));
            setFeedback('That name is false. The whispers grow louder...');
            try {
                playSafeSFX(audioRef, SFX_AUDIO.ERROR, false);
            } catch (e) {
            }
        }
    };

    // PUZZLE 7: Unwatched Door handlers
    const toggleWatchDoor = () => {
        setWatchingDoor(prev => !prev);
    };

    const checkDoorState = () => {
        if (doorState === 'open' && somethingBehindDoor) {
            try {
                playSafeSFX(audioRef, SFX_AUDIO.SUCCESS, false);
            } catch (e) {
            }
            setFeedback('The entity has passed. You may continue...');
            setTimeout(() => unlockAndGo(10), 500);
        } else if (doorState === 'open') {
            setFeedback('The door is open, but nothing has passed yet...');
        } else {
            setFeedback('The door remains closed. Stop watching...');
        }
    };

    const reset = () => {
        setStageIndex(0);
        setInput('');
        setAnSelection('');
        setAnomalies([]);
        setPicked([]);
        setFeedback('Reset');
        setRiddleCorrects(new Array(MAX_RIDDLES).fill(false));

        // Reset puzzle states
        setMemorySequence([]);
        setMemoryInput('');
        setSequenceShown(false);
        setDecayLevel(0);
        setShadowText('');
        setShadowInput('');
        setWallPattern([]);
        setMirrorFragments([]);
        setTimeMarkers([]);
        setWhisperNames([]);
        setDoorState('closed');
    }

    const onRiddleResult = (i: number, ok: boolean) => {
        setRiddleCorrects(prev => {
            const next = [...prev];
            next[i] = ok;
            return next;
        });
    }

    // Reusable riddle-chain renderer: chooses a riddle set based on stageIndex
    const riddleSets: Record<string, { p: string, a: string }[]> = {
        default: [
            {p: 'I watch without eyes and count without hands.', a: 'time'},
            {p: 'I can be cracked, told, made, and played; what am I?', a: 'joke'},
            {p: 'I twist and bind yet never touch; letters gather where I sleep.', a: 'book'},
            {p: 'I have a face but no head, two hands but no arms.', a: 'clock'},
            {p: 'I can fall without hurting, I can run without legs.', a: 'water'},
            {p: 'Taken from a mine and shut in a wooden case.', a: 'lead'},
            {p: 'I am not alive but I grow; I don\'t have lungs but I need air.', a: 'fire'},
            {p: 'I speak without a mouth and hear without ears.', a: 'echo'},
            {p: 'I have keys but no locks.', a: 'piano'},
            {p: 'The more you take, the more you leave behind.', a: 'footsteps'},
            {p: 'I am always hungry and will die if not fed, what am I?', a: 'fire'},
            {p: 'I turn once, what is out will not get in. What am I?', a: 'key'}
        ]
    };

    const getRiddleSetForStage = (idx: number) => {
        // pick longer sets for riddle-heavy stages (e.g., 6,13,21)
        const heavy = [6, 13, 21];
        if (heavy.includes(idx)) {
            return riddleSets.default.slice(0, 12);
        }
        // final stage (24) also returns a long set
        if (idx === stages.length - 1) return riddleSets.default.slice(0, 12);
        return riddleSets.default.slice(0, 6);
    };

    const renderRiddleChainForStage = (idx: number) => {
        const set = getRiddleSetForStage(idx);
        return (
            <div className="mt-4 space-y-3">
                <div className="text-sm text-gray-400">Riddle chain — solve all to proceed.</div>
                {set.map((r, i) => (
                    <Riddle key={i} idx={i} prompt={r.p} expectedChunk={r.a} onResult={(ii, ok) => {
                        setRiddleCorrects(prev => {
                            const next = prev.slice();
                            next[i] = ok;
                            return next;
                        });
                        onRiddleResult(ii, ok);
                    }}/>
                ))}
                <div
                    className="text-sm text-yellow-400">Progress: {riddleCorrects.filter(Boolean).length}/{set.length}</div>
                <div className="mt-2">
                    <button onClick={() => {
                        const setLen = set.length;
                        if (riddleCorrects.filter(Boolean).length < setLen) {
                            setFeedback('Solve all riddles before submitting.');
                            return;
                        }
                        setFeedback('Riddle chain solved locally.');
                    }} className="px-3 py-1 bg-emerald-600 rounded text-black">Lock Riddles
                    </button>
                </div>
            </div>
        );
    }

    // helper to validate stage with API (uses the app router route added)
    async function apiValidate(plaqueId: string, stage: number, provided: string) {
        try {
            const res = await fetch(routes.api.chapters.iv.validateStage, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({plaqueId, stageIndex: stage, provided})
            });
            return await res.json();
        } catch (e) {
            return {ok: false, error: 'network'};
        }
    }

    return (
        <>
            <audio ref={audioRef} src={BACKGROUND_AUDIO.BONUS.IV} loop preload="auto" style={{display: 'none'}}/>
            <div className="min-h-screen p-8 bg-gray-900 text-white font-mono">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-2xl font-bold mb-4">Entity Puzzle</h1>
                    <p className="text-sm text-gray-400 mb-6">Follow the staged hints to solve the multipart proof. Now
                        expanded with timed anomalies and a riddle finale.</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <h3 className="font-semibold">Stages</h3>
                            <div className="mt-2 max-h-80 overflow-auto pr-2">
                                <ol className="list-decimal list-inside">
                                    {stages.map((s: any, i: number) => (
                                        <li key={i}>
                                            <button
                                                onClick={() => {
                                                    if (i <= unlockedStage) setStageIndex(i);
                                                }}
                                                className={`inline ${i === stageIndex ? 'font-bold' : ''}`}
                                            >
                                                {i > unlockedStage ? `🔒 ${s.title}` : s.title}
                                            </button>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                            <div className="mt-4">
                                <button onClick={reset} className="text-xs text-red-400 underline">Reset</button>
                            </div>
                        </div>


                        <div className="md:col-span-2">
                            <div className="p-4 bg-gray-800 rounded">
                                <h3 className="font-semibold">{stages[stageIndex]?.title}</h3>
                                <p className="text-sm text-gray-300 mt-2">{stages[stageIndex]?.instruction}</p>

                                {/* PUZZLE 1: Memory Decay - Stage 3 */}
                                {stageIndex === 3 && (
                                    <div className="mt-4 space-y-4">
                                        <div className="text-sm text-red-400">
                                            Decay Level: {decayLevel} | Each viewing corrupts the sequence further
                                        </div>
                                        {!sequenceShown ? (
                                            <button
                                                onClick={showMemorySequence}
                                                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded"
                                            >
                                                View Sequence
                                            </button>
                                        ) : (
                                            <div className="p-6 bg-black rounded border border-purple-500 text-center">
                                                <div className="text-3xl tracking-widest space-x-2">
                                                    {memorySequence.map((sym, i) => (
                                                        <span
                                                            key={i}
                                                            className={`inline-block transition-opacity duration-300 ${
                                                                memoryFlashCount > 1 ? 'opacity-30' : 'opacity-100'
                                                            }`}
                                                            style={{
                                                                filter: `blur(${memoryFlashCount * 2}px)`,
                                                                transform: `rotate(${Math.random() * 10 - 5}deg)`
                                                            }}
                                                        >
                                                            {sym}
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="mt-2 text-xs text-gray-500">
                                                    Memorize quickly... {3 - memoryFlashCount} views remaining
                                                </div>
                                            </div>
                                        )}
                                        <div className="space-y-2">
                                            <input
                                                type="text"
                                                value={memoryInput}
                                                onChange={(e) => setMemoryInput(e.target.value)}
                                                placeholder="Enter the sequence..."
                                                className="w-full px-4 py-2 bg-gray-900 rounded border border-gray-700"
                                            />
                                            <button
                                                onClick={submitMemorySequence}
                                                className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded"
                                            >
                                                Submit Memory
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* PUZZLE 2: Shadow Typing - Stage 4 */}
                                {stageIndex === 4 && (
                                    <div className="mt-4 space-y-4">
                                        <div className="p-4 bg-black rounded border border-red-900">
                                            <div className="text-sm text-gray-500 mb-2">Target phrase:</div>
                                            <div className="text-lg font-mono text-red-600 blur-sm select-none">
                                                {shadowText}
                                            </div>
                                        </div>
                                        <div className="text-xs text-yellow-400">
                                            Type without looking at what you type. Trust your fingers.
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={shadowInput}
                                                onChange={handleShadowTyping}
                                                className="w-full px-4 py-3 bg-gray-900 rounded border border-gray-700 font-mono"
                                                style={{
                                                    color: isTypingBlind ? 'transparent' : 'white',
                                                    textShadow: isTypingBlind ? '0 0 8px rgba(255,255,255,0.5)' : 'none'
                                                }}
                                                placeholder="Type here..."
                                            />
                                            {shadowGlitches.map((pos, i) => (
                                                <span
                                                    key={i}
                                                    className="absolute text-red-500 text-xs"
                                                    style={{
                                                        left: `${pos * 8}px`,
                                                        top: '-10px',
                                                        animation: 'pulse 0.5s'
                                                    }}
                                                >
                                                    ⚠
                                                </span>
                                            ))}
                                        </div>
                                        <button
                                            onClick={submitShadowTyping}
                                            className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded"
                                        >
                                            Submit
                                        </button>
                                    </div>
                                )}

                                {/* PUZZLE 3: Breathing Walls - Stage 5 */}
                                {stageIndex === 5 && (
                                    <div className="mt-4 space-y-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-red-400">Pressure: {wallPressure}%</span>
                                            <span
                                                className="text-blue-400">Breath Phase: {['Inhale', 'Hold', 'Exhale', 'Rest'][breathPhase]}</span>
                                        </div>
                                        <div
                                            className="grid grid-cols-3 gap-2 p-4 rounded transition-all duration-1000"
                                            style={{
                                                backgroundColor: `rgba(139, 0, 0, ${wallPressure / 200})`,
                                                transform: `scale(${1 - wallPressure / 200})`
                                            }}
                                        >
                                            {wallPattern.map((active, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => clickWallPanel(idx)}
                                                    className={`h-20 rounded transition-all duration-500 ${
                                                        active
                                                            ? 'bg-green-800 border-2 border-green-400'
                                                            : 'bg-gray-800 border-2 border-gray-600'
                                                    }`}
                                                    style={{
                                                        transform: `scale(${breathPhase === 0 ? 1.05 : breathPhase === 2 ? 0.95 : 1})`
                                                    }}
                                                >
                                                    {active ? '▓' : '░'}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="text-xs text-gray-400 text-center">
                                            Click panels to match the breathing pattern. Alternating pattern required.
                                        </div>
                                    </div>
                                )}

                                {/* PUZZLE 4: Fragmented Self - Stage 6 */}
                                {stageIndex === 6 && (
                                    <div className="mt-4 space-y-4">
                                        <div className="flex justify-between text-sm">
                                            <span
                                                className="text-cyan-400">Reflection Integrity: {reflectionIntegrity.toFixed(0)}%</span>
                                            <span
                                                className="text-purple-400">Collected: {fragmentSelection.length}/4</span>
                                        </div>
                                        <div
                                            className="grid grid-cols-2 gap-3"
                                            style={{
                                                filter: `blur(${(100 - reflectionIntegrity) / 20}px)`,
                                                opacity: reflectionIntegrity / 100
                                            }}
                                        >
                                            {mirrorFragments.map((frag) => (
                                                <button
                                                    key={frag.id}
                                                    onClick={() => selectFragment(frag)}
                                                    disabled={fragmentSelection.includes(frag.text)}
                                                    className={`p-4 rounded border-2 transition-all ${
                                                        frag.corrupted
                                                            ? 'bg-red-900 border-red-500 text-red-200'
                                                            : 'bg-blue-900 border-blue-500 text-blue-200'
                                                    } ${
                                                        fragmentSelection.includes(frag.text)
                                                            ? 'opacity-30'
                                                            : 'hover:scale-105'
                                                    }`}
                                                    style={{
                                                        transform: `rotate(${Math.random() * 6 - 3}deg)`,
                                                        textShadow: frag.corrupted ? '0 0 10px red' : 'none'
                                                    }}
                                                >
                                                    {frag.text}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            Select the uncorrupted fragments of your identity. Avoid the lies.
                                        </div>
                                    </div>
                                )}

                                {/* PUZZLE 5: Time Distortion - Stage 7 */}
                                {stageIndex === 7 && (
                                    <div className="mt-4 space-y-4">
                                        <div className="flex justify-between text-sm">
                                            <span
                                                className="text-yellow-400">Temporal Drift: {temporalDrift.toFixed(1)}%</span>
                                            <span
                                                className="text-green-400">Real Moments: {selectedMarkers.length}/5</span>
                                        </div>
                                        <div
                                            className="space-y-2"
                                            style={{
                                                filter: `hue-rotate(${temporalDrift * 3}deg)`
                                            }}
                                        >
                                            {timeMarkers.map((marker, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => selectTimeMarker(idx)}
                                                    disabled={selectedMarkers.includes(idx)}
                                                    className={`w-full p-3 rounded border transition-all ${
                                                        selectedMarkers.includes(idx)
                                                            ? 'bg-green-900 border-green-500 opacity-50'
                                                            : marker.real
                                                                ? 'bg-gray-800 border-gray-600 hover:border-green-400'
                                                                : 'bg-gray-800 border-gray-600 hover:border-red-400'
                                                    }`}
                                                    style={{
                                                        animation: !marker.real ? 'pulse 2s infinite' : 'none',
                                                        opacity: selectedMarkers.includes(idx) ? 0.3 : 1
                                                    }}
                                                >
                                                    <span className="font-mono text-xs">
                                                        {new Date(marker.time).toLocaleTimeString()}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            Select only the real temporal markers. False moments increase drift.
                                        </div>
                                    </div>
                                )}

                                {/* PUZZLE 6: Whispering Names - Stage 8 */}
                                {stageIndex === 8 && (
                                    <div className="mt-4 space-y-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-purple-400">Name Confidence: {nameConfidence}%</span>
                                            <span
                                                className="text-gray-400"
                                                style={{opacity: whisperVolume}}
                                            >
                                                Volume: {(whisperVolume * 100).toFixed(0)}%
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            {whisperNames.map((name, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => selectWhisperName(name)}
                                                    className="p-4 bg-black rounded border border-purple-900 hover:border-purple-500 transition-all"
                                                    style={{
                                                        opacity: whisperVolume,
                                                        fontSize: `${0.8 + whisperVolume * 0.4}rem`,
                                                        textShadow: name === 'Entity' ? '0 0 10px purple' : '0 0 5px red',
                                                        animation: 'pulse 3s infinite'
                                                    }}
                                                >
                                                    {name}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            Listen to the whispers. Find the true name among the lies.
                                        </div>
                                    </div>
                                )}

                                {/* PUZZLE 7: Unwatched Door - Stage 9 */}
                                {stageIndex === 9 && (
                                    <div className="mt-4 space-y-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-red-400">Door State: {doorState}</span>
                                            <span
                                                className="text-yellow-400">Progress: {doorOpenProgress.toFixed(0)}%</span>
                                        </div>
                                        <div
                                            className="relative h-64 bg-black rounded border-2 border-gray-700 overflow-hidden"
                                            style={{
                                                borderColor: doorState === 'open' ? 'red' : 'gray'
                                            }}
                                        >
                                            {/* Door visualization */}
                                            <div
                                                className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-700 transition-all duration-500"
                                                style={{
                                                    clipPath: `polygon(0 0, ${100 - doorOpenProgress}% 0, ${100 - doorOpenProgress}% 100%, 0 100%)`
                                                }}
                                            >
                                                <div
                                                    className="absolute top-1/2 right-4 w-3 h-3 bg-yellow-600 rounded-full"/>
                                            </div>
                                            {/* What's behind */}
                                            <div
                                                className="absolute inset-0 bg-black flex items-center justify-center"
                                                style={{
                                                    opacity: doorOpenProgress / 100
                                                }}
                                            >
                                                {doorState === 'open' && (
                                                    <div className="text-6xl animate-pulse" style={{
                                                        textShadow: '0 0 20px red',
                                                        animation: 'pulse 1s infinite'
                                                    }}>
                                                        👁️
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={toggleWatchDoor}
                                                className={`flex-1 px-4 py-2 rounded ${
                                                    watchingDoor
                                                        ? 'bg-blue-600 hover:bg-blue-500'
                                                        : 'bg-gray-600 hover:bg-gray-500'
                                                }`}
                                            >
                                                {watchingDoor ? '👁️ Watching Door' : '🚫 Not Watching'}
                                            </button>
                                            <button
                                                onClick={checkDoorState}
                                                className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded"
                                            >
                                                Check State
                                            </button>
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            The door only opens when you look away. Let it open fully...
                                        </div>
                                    </div>
                                )}

                                {stages[stageIndex]?.type === 'path' && (
                                    <div className="mt-4">
                                        <div className="grid grid-cols-3 gap-2">
                                            {grid.map((g, idx) => (<button key={idx} onClick={() => clickGrid(idx)}
                                                                           className="p-3 bg-black rounded text-green-300">{g}</button>))}
                                        </div>
                                        <div className="mt-3 flex items-center gap-3">
                                            <div className="text-sm text-gray-400">Selection: <span
                                                className="font-mono text-green-300">{selection}</span></div>
                                            <button onClick={() => setSelection('')} className="text-xs underline">Clear
                                            </button>
                                            <button onClick={submitGrid}
                                                    className="ml-2 px-3 py-1 bg-blue-600 rounded">Submit
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {stages[stageIndex]?.type === 'timed' && (
                                    <div className="mt-4">
                                        <div className="flex gap-2 flex-wrap">{anomalies.map((a, idx) => (
                                            <button key={idx} disabled={picked[idx]} onClick={() => clickAnomaly(idx)}
                                                    className={picked[idx] ? 'px-3 py-2 bg-gray-700 rounded' : 'px-3 py-2 bg-black text-green-300 rounded'}>{a}</button>))}</div>
                                        <div className="mt-3 flex items-center gap-3">
                                            <div>Current: <span
                                                className="font-mono text-green-300">{anSelection}</span>
                                            </div>
                                            <button onClick={() => {
                                                setPicked(new Array(anomalies.length).fill(false));
                                                setAnSelection('');
                                            }} className="text-xs underline">Clear
                                            </button>
                                            <button onClick={submitAnomalies}
                                                    className="ml-2 px-3 py-1 bg-blue-600 rounded">Submit
                                            </button>
                                        </div>
                                        <div className="text-sm text-gray-400 mt-2">Time remaining: <span
                                            className="font-mono">{remainingTime}s</span></div>
                                    </div>
                                )}

                                {stages[stageIndex]?.type === 'weave' && (
                                    <div className="mt-4">
                                        <div className="text-sm text-gray-400 mb-2">Tokens (click to select):</div>
                                        <div className="flex gap-2 flex-wrap mb-2">{anomalies.map((t, idx) => (
                                            <button key={idx} onClick={() => clickWeaveToken(idx)}
                                                    className={`px-3 py-1 rounded ${selectedTokenIndex === idx ? 'bg-emerald-600' : 'bg-gray-700'}`}>{t}</button>
                                        ))}</div>
                                        <div className="text-sm text-gray-400 mb-2">Slots (click an empty slot to
                                            place):
                                        </div>
                                        <div className="flex gap-2 mb-2">{weaveSlots.map((s, idx) => (
                                            <button key={idx} onClick={() => placeWeaveSlot(idx)}
                                                    className={`px-4 py-2 rounded ${s ? 'bg-green-800' : 'bg-gray-800'}`}>{s || `[${idx + 1}]`}</button>
                                        ))}</div>
                                        <div className="flex gap-2">
                                            <button onClick={submitWeave}
                                                    className="px-3 py-2 bg-blue-600 rounded">Submit Weave
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {stages[stageIndex]?.type === 'validate' && (
                                    <div className="mt-4">
                                        <div className="text-sm text-gray-400 mb-2">Validate the assembled timeline
                                            indices.
                                        </div>
                                        <div className="mb-2">Assembled: <span
                                            className="font-mono">{stageResults[4] || '(none)'}</span></div>
                                        <div className="flex gap-2">
                                            <button onClick={handleValidateSubmit}
                                                    className="px-3 py-2 bg-blue-600 rounded">Submit Proof
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {(['payload', 'final', 'riddle'] as string[]).includes(stages[stageIndex]?.type) && (
                                    <form onSubmit={handleSubmit} className="mt-4">
                                        {stages[stageIndex]?.payload && (
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="bg-black p-2 rounded text-xs text-green-300 break-all">{stages[stageIndex].payload}</div>
                                                </div>
                                                {stageIndex === 0 && (
                                                    <div className="text-xs text-gray-400 italic">
                                                        💡 Hint: This appears to be base64 encoded. Decode it (you can
                                                        use atob() in browser console or an online decoder) to reveal
                                                        the message, then extract the key word.
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        <div className="mt-2 flex gap-2"><input value={input}
                                                                                onChange={(e) => setInput(e.target.value)}
                                                                                placeholder="Enter answer"
                                                                                className="flex-1 bg-gray-900 px-3 py-2 rounded"/>
                                            <button type="submit" className="px-3 py-2 bg-green-600 rounded">Submit
                                            </button>
                                        </div>
                                    </form>
                                )}

                                {stages[stageIndex]?.type === 'riddle-chain' && renderRiddleChainForStage(stageIndex)}

                                {feedback && <div className="mt-3 text-sm text-yellow-300">{feedback}</div>}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6"><Link href="/chapters/IV" className="text-sm text-gray-300 underline">Back to
                        Chapter IV</Link></div>
                    <div className="mt-3 text-sm text-green-400">{completed ? 'Completed and saved.' : ''}</div>
                </div>
            </div>
        </>
    );
}
