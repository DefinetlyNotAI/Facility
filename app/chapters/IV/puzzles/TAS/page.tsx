'use client';

import React, {useEffect, useRef, useState} from 'react';
import Link from 'next/link';
import {chapterIVPublic as chapterIVData} from '@/lib/data/chapters.public';
import {seededShuffle} from '@/lib/puzzles';
import {routes} from '@/lib/saveData';
import {useChapter4Access} from "@/hooks/BonusActHooks/useChapterSpecialAccess";
import {useBackgroundAudio} from "@/hooks/useBackgroundAudio";
import {BACKGROUND_AUDIO} from "@/lib/data/audio";

// Riddle component (adapted from TREE puzzle for a riddle-chain mini-game)
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

export default function TasPuzzlePage() {
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
    const puzzle = (chapterIVData as any).puzzles?.TAS;
    if (!puzzle) return <div className="min-h-screen flex items-center justify-center">Puzzle not found.</div>;

    const stages = puzzle.stageData || [];
    const storageKey = 'chapterIV-TAS-progress';
    const cookieKey = 'chapterIV-plaque-progress';

    // JSON cookie helpers (same as other files)
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
            const prev = Number(current['TAS'] || 0);
            current['TAS'] = Math.max(prev, 3);
            setJsonCookie(cookieKey, current, 365);
        } catch (e) {
        }
    }

    useEffect(() => {
        // when user opens TAS puzzle, mark as started (2) if lower
        try {
            const current = getJsonCookie(cookieKey) || {};
            const prev = Number(current['TAS'] || 0);
            if (prev < 2) {
                current['TAS'] = 2;
                setJsonCookie(cookieKey, current, 365);
            }
        } catch (e) {
        }
    }, []);

    const [completed, setCompleted] = useState<boolean>(false);

    // Stage answers validated on server via API

    const [stageIndex, setStageIndex] = useState<number>(0);
    const [input, setInput] = useState<string>('');
    const [feedback, setFeedback] = useState<string>('');

    // stage1 switches
    const [switches, setSwitches] = useState<number[]>([0, 0, 0, 0, 0]);

    // stage3 parts
    const [parts, setParts] = useState<string[]>([]);
    const [used, setUsed] = useState<boolean[]>([]);
    const [assembly, setAssembly] = useState<string>('');

    // Riddle chain correctness for final stage
    const [riddleCorrects, setRiddleCorrects] = useState<boolean[]>([false, false, false]);

    useEffect(() => {
        if (stageIndex === 2 && parts.length === 0) {
            // deterministic parts order seeded from stage0 payload
            const seedStr = stages[0]?.payload || 'TAS';
            const base = ['co', 'ns', 'en', 'su', 's'];
            const shuffled = seededShuffle(base, seedStr);
            setParts(shuffled);
            setUsed(new Array(shuffled.length).fill(false));
            setAssembly('');
            setFeedback('Assemble the parts in order to form the final key.');
        }
    }, [stageIndex]);

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

    // Persist progress
    useEffect(() => {
        try {
            localStorage.setItem(storageKey, String(stageIndex));
        } catch (e) {
        }
    }, [stageIndex]);

    // NEW: unlocked stage tracking (TREE-style)
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

    const toggleSwitch = (i: number) => {
        setSwitches(prev => {
            const c = prev.slice();
            c[i] = c[i] === 0 ? 1 : 0;
            return c;
        });
    }

    const submitSwitches = () => {
        const bits = switches.join('');
        (async () => {
            try {
                const res = await fetch(routes.api.chapters.iv.validateStage, {
                    method: 'POST',
                    body: JSON.stringify({plaqueId: 'TAS', stageIndex: 1, provided: bits})
                });
                const json = await res.json();
                if (json?.ok) {
                    setFeedback('Correct — advancing to Stage 3');
                    // unlock/persist like TREE
                    setTimeout(() => unlockAndGo(2), 400);
                } else setFeedback('Incorrect switch configuration.');
            } catch (e) {
                setFeedback('Server error');
            }
        })();
    }

    const clickPart = (i: number) => {
        if (used[i]) return;
        setUsed(prev => {
            const c = prev.slice();
            c[i] = true;
            return c;
        });
        setAssembly(prev => {
            const next = prev + parts[i];
            if (next.length >= (stages[2]?.answer || '').length) {
                // validate assembly result with server
                (async () => {
                    try {
                        const res = await fetch(routes.api.chapters.iv.validateStage, {
                            method: 'POST',
                            body: JSON.stringify({plaqueId: 'TAS', stageIndex: 2, provided: next})
                        });
                        const json = await res.json();
                        if (json?.ok) {
                            setFeedback('Correct final assembly — puzzle finished.');
                            setTimeout(() => {
                                // unlock next stage (final riddle stage) and mark as completed state
                                unlockAndGo(3);
                                setCompleted(true);
                                try {
                                    localStorage.setItem(storageKey, String(stages.length));
                                } catch (e) {
                                }
                                markCompleted();
                            }, 500);
                        } else {
                            setFeedback('Wrong assembly — reset and try again.');
                            setUsed(new Array(parts.length).fill(false));
                            setAssembly('');
                        }
                    } catch (e) {
                        setFeedback('Server error');
                    }
                })();
            }
            return next;
        });
    }

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        setFeedback('');
        const provided = (input || '').trim().toLowerCase();
        // If on final configured stage, require riddles to be solved client-side before allowing finalization
        if (stageIndex === stages.length - 1) {
            if (!riddleCorrects.every(Boolean)) {
                setFeedback('Solve the riddle chain before finalizing the plaque.');
                return;
            }
        }
        // validate with server
        try {
            const res = await fetch(routes.api.chapters.iv.validateStage, {
                method: 'POST',
                body: JSON.stringify({plaqueId: 'TAS', stageIndex, provided})
            });
            const json = await res.json();
            if (!json?.ok) {
                setFeedback('Incorrect answer.');
                return;
            }
            // proceed
            if (stageIndex >= stages.length - 1) {
                setStageIndex(stages.length);
                setCompleted(true);
                try {
                    localStorage.setItem(storageKey, String(stages.length));
                } catch (e) {
                }
                setFeedback('Puzzle completed.');
                markCompleted();
            } else {
                // unlock next stage
                const nextIndex = stageIndex + 1;
                setFeedback('Correct — advanced.');
                unlockAndGo(nextIndex);
                setInput('');
            }
        } catch (e) {
            setFeedback('Server error');
        }
    }

    const reset = () => {
        setStageIndex(0);
        setInput('');
        setFeedback('Reset.');
        setSwitches([0, 0, 0, 0, 0]);
        setParts([]);
        setUsed([]);
        setAssembly('');
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
                    <h1 className="text-2xl font-bold mb-4">TAS Puzzle</h1>
                    <p className="text-sm text-gray-400 mb-6">Follow the staged hints to solve the multipart
                        circuit. This version has extra chained mechanics and a riddle finale.</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <h3 className="font-semibold">Stages</h3>
                            <ol className="mt-2 list-decimal list-inside">
                                {stages.map((s: any, i: number) => (
                                    <li key={i} className="mt-2">
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
                                        <div className="flex gap-2">
                                            {switches.map((b, i) => (
                                                <button key={i} onClick={() => toggleSwitch(i)}
                                                        className={b === 1 ? 'px-3 py-2 bg-green-600 text-black rounded' : 'px-3 py-2 bg-gray-700 text-gray-200 rounded'}>{b}</button>
                                            ))}
                                            <button onClick={submitSwitches}
                                                    className="ml-3 px-3 py-2 bg-blue-600 rounded">Submit
                                            </button>
                                        </div>
                                        <div className="mt-2 text-xs text-gray-400">Toggle switches to match the
                                            expected
                                            bitstring.
                                        </div>
                                    </div>
                                )}

                                {stageIndex === 2 && (
                                    <div className="mt-4">
                                        <div className="flex gap-2 flex-wrap">
                                            {parts.map((p, i) => (
                                                <button key={i} disabled={used[i]} onClick={() => clickPart(i)}
                                                        className={used[i] ? 'px-3 py-2 bg-gray-700 rounded' : 'px-3 py-2 bg-black text-green-300 border rounded'}>{p}</button>
                                            ))}
                                            <button onClick={() => {
                                                setUsed(new Array(parts.length).fill(false));
                                                setAssembly('');
                                            }} className="ml-2 text-xs underline">Reset
                                            </button>
                                        </div>
                                        <div className="mt-2">Current: <span
                                            className="font-mono text-green-300">{assembly}</span></div>
                                    </div>
                                )}

                                {stageIndex !== 1 && stageIndex !== 2 && (
                                    <form onSubmit={handleSubmit} className="mt-4">
                                        {stages[stageIndex]?.payload && <div
                                            className="bg-black p-2 rounded text-xs text-green-300 break-all">{stages[stageIndex].payload}</div>}
                                        <div className="mt-2 flex gap-2">
                                            <input value={input} onChange={(e) => setInput(e.target.value)}
                                                   placeholder="Enter answer"
                                                   className="flex-1 bg-gray-900 px-3 py-2 rounded"/>
                                            <button type="submit" className="px-3 py-2 bg-green-600 rounded">Submit
                                            </button>
                                        </div>
                                    </form>
                                )}

                                {/* Riddle chain shown on final configured stage as an added local requirement */}
                                {stageIndex === stages.length - 1 && (
                                    <div className="mt-4 space-y-3">
                                        <div className="text-sm text-gray-400">Final: solve the riddle chain to prove
                                            understanding of the circuit.
                                        </div>

                                        <Riddle idx={0}
                                                prompt={'I am taken from a mine and shut up in a wooden case, from which I am never released, and yet I am used by almost every artisan.'}
                                                expectedChunk={'lead'} onResult={onRiddleResult}/>
                                        <Riddle idx={1}
                                                prompt={'I turn once, what is out will not get in. I turn again, what is in will not get out.'}
                                                expectedChunk={'key'} onResult={onRiddleResult}/>
                                        <Riddle idx={2}
                                                prompt={'I have keys but no locks. I have space but no rooms. You can enter, but you can’t go outside.'}
                                                expectedChunk={'keyboard'} onResult={onRiddleResult}/>

                                        <div className="text-sm text-yellow-400">Riddle
                                            progress: {riddleCorrects.filter(Boolean).length}/3
                                        </div>
                                    </div>
                                )}

                                {feedback && <div className="mt-3 text-sm text-yellow-300">{feedback}</div>}
                            </div>

                        </div>
                    </div>

                    <div className="mt-6">
                        <Link href="/chapters/IV" className="text-sm text-gray-300 underline">Back to Chapter IV</Link>
                    </div>
                    <div className="mt-3 text-sm text-green-400">{completed ? 'Completed and saved.' : ''}</div>
                </div>
            </div>
        </>
    );
}
