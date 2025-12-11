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
            const res = await fetch(routes.api.chapters.iv.validateStage, {
                method: 'POST',
                body: JSON.stringify({plaqueId: 'Entity', stageIndex: 1, provided: selection})
            });
            const json = await res.json();
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
            const res = await fetch(routes.api.chapters.iv.validateStage, {
                method: 'POST',
                body: JSON.stringify({plaqueId: 'Entity', stageIndex: 2, provided: anSelection})
            });
            const json = await res.json();
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
            const res = await fetch(routes.api.chapters.iv.validateStage, {
                method: 'POST',
                body: JSON.stringify({plaqueId: 'Entity', stageIndex: 4, provided: payload})
            });
            const json = await res.json();
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
            const res = await fetch(routes.api.chapters.iv.validateStage, {
                method: 'POST',
                body: JSON.stringify({plaqueId: 'Entity', stageIndex: 5, provided: payload})
            });
            const json = await res.json();
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
            const res = await fetch(routes.api.chapters.iv.validateStage, {
                method: 'POST',
                body: JSON.stringify({plaqueId: 'Entity', stageIndex, provided})
            });
            const json = await res.json();
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

    const reset = () => {
        setStageIndex(0);
        setInput('');
        setAnSelection('');
        setAnomalies([]);
        setPicked([]);
        setFeedback('Reset');
        setRiddleCorrects(new Array(MAX_RIDDLES).fill(false));
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

    // Download helper for payloads (Entity stage 1 uses an audio payload)
    const downloadPayload = async () => {
        const url = stages[stageIndex]?.payload;
        if (!url) {
            setFeedback('No payload to download.');
            return;
        }
        try {
            const resp = await fetch(url);
            if (!resp.ok) throw new Error('Network response not ok');
            const blob = await resp.blob();
            const blobUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            // derive filename from url
            const parts = url.split('/');
            const filename = parts[parts.length - 1] || 'payload.bin';
            a.href = blobUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(blobUrl);
            setFeedback('Payload downloaded');
        } catch (e) {
            try {
                playSafeSFX(audioRef, SFX_AUDIO.ERROR, false);
            } catch (er) {
            }
            setFeedback('Failed to download payload');
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

                                {/* Generic form for payload/final/riddle/other simple input types */}
                                {(['payload', 'final', 'riddle'] as string[]).includes(stages[stageIndex]?.type) && (
                                    <form onSubmit={handleSubmit} className="mt-4">
                                        {stages[stageIndex]?.payload && (
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="bg-black p-2 rounded text-xs text-green-300 break-all">{stages[stageIndex].payload}</div>
                                                {/* If this is the first stage (index 0) allow downloading the payload */}
                                                {stageIndex === 0 && (
                                                    <button type="button" onClick={downloadPayload}
                                                            className="px-2 py-1 bg-indigo-600 rounded text-xs">Download</button>
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
