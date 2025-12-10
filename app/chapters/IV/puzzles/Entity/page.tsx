'use client';

import React, {useEffect, useRef, useState} from 'react';
import Link from 'next/link';
import {chapterIVPublic as chapterIVData} from '@/lib/data/chapters.public';
import {seededTokens} from '@/lib/puzzles';
import {routes} from '@/lib/saveData';
import {useChapter4Access} from "@/hooks/BonusActHooks/useChapterSpecialAccess";
import {useBackgroundAudio} from "@/hooks/useBackgroundAudio";
import {BACKGROUND_AUDIO} from "@/lib/data/audio";

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
            current['Entity'] = Math.max(prev, 3);
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
    const [stage2Started, setStage2Started] = useState<boolean>(false);
    const [stage2BaseTime, setStage2BaseTime] = useState<number>(12);
    const [remainingTime, setRemainingTime] = useState<number>(stage2BaseTime);
    const [, setConsecutiveTimeFails] = useState<number>(0);

    // riddle chain correctness for final stage
    const [riddleCorrects, setRiddleCorrects] = useState<boolean[]>([false, false, false]);

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
        if (!stage2Started) return;
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
    }, [stageIndex, stage2Started, anomalies.length, stage2BaseTime]);

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
                setFeedback('Correct — advancing');
                setTimeout(() => unlockAndGo(2), 400);
            } else setFeedback('Incorrect path');
        } catch (e) {
            setFeedback('Server error');
        }
    }

    const clickAnomaly = (i: number) => {
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
                setFeedback('Correct proof — complete');
                setTimeout(() => {
                    setStageIndex(3);
                    setCompleted(true);
                    try {
                        localStorage.setItem(storageKey, String(stages.length));
                    } catch (e) {
                    }
                    markCompleted();
                }, 400);
            } else setFeedback('Incorrect proof');
        } catch (e) {
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
            } else setFeedback('Incorrect');
        } catch (e) {
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
        setRiddleCorrects([false, false, false]);
    }

    const onRiddleResult = (i: number, ok: boolean) => {
        setRiddleCorrects(prev => {
            const next = [...prev];
            next[i] = ok;
            return next;
        });
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
                            <ol className="mt-2 list-decimal list-inside">
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
                            <div className="mt-4">
                                <button onClick={reset} className="text-xs text-red-400 underline">
                                    Reset
                                </button>
                            </div>
                        </div>


                        <div className="md:col-span-2">
                            <div className="p-4 bg-gray-800 rounded">
                                <h3 className="font-semibold">{stages[stageIndex]?.title}</h3>
                                <p className="text-sm text-gray-300 mt-2">{stages[stageIndex]?.instruction}</p>

                                {stageIndex === 1 && (
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

                                {stageIndex === 2 && (
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

                                {stageIndex !== 1 && stageIndex !== 2 && (
                                    <form onSubmit={handleSubmit} className="mt-4">{stages[stageIndex]?.payload && <div
                                        className="bg-black p-2 rounded text-xs text-green-300 break-all">{stages[stageIndex].payload}</div>}
                                        <div className="mt-2 flex gap-2"><input value={input}
                                                                                onChange={(e) => setInput(e.target.value)}
                                                                                placeholder="Enter answer"
                                                                                className="flex-1 bg-gray-900 px-3 py-2 rounded"/>
                                            <button type="submit" className="px-3 py-2 bg-green-600 rounded">Submit
                                            </button>
                                        </div>
                                    </form>
                                )}

                                {/* Final riddle chain requirement */}
                                {stageIndex === stages.length - 1 && (
                                    <div className="mt-4 space-y-3">
                                        <div className="text-sm text-gray-400">Final: the Eldritch demands proof — solve
                                            the riddle chain.
                                        </div>

                                        <Riddle idx={0}
                                                prompt={'I twist without hands, I turn without eyes. I allow passage yet carry no weight.'}
                                                expectedChunk={'door'} onResult={onRiddleResult}/>
                                        <Riddle idx={1}
                                                prompt={'I am the start of forever and the end of time; I am small as a dot and vast as a sea.'}
                                                expectedChunk={'point'} onResult={onRiddleResult}/>
                                        <Riddle idx={2}
                                                prompt={'I am the soundless echo inside your head when memory forgets to speak.'}
                                                expectedChunk={'silence'} onResult={onRiddleResult}/>

                                        <div className="text-sm text-yellow-400">Riddle
                                            progress: {riddleCorrects.filter(Boolean).length}/3
                                        </div>
                                    </div>
                                )}

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
