'use client';

import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import {chapterIVPublic as chapterIVData} from '@/lib/data/chapters.public';
import {seededShuffle, seedFromString} from '@/lib/puzzles';
import {routes} from '@/lib/saveData';
import {useChapter4Access} from "@/hooks/BonusActHooks/useChapterSpecialAccess";

const Riddle = ({idx, prompt, expectedChunk}: { idx: number, prompt: string, expectedChunk: string }) => {
    const [answer, setAnswer] = useState('');
    const [correct, setCorrect] = useState<boolean | null>(null);

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (answer.trim().toLowerCase() === expectedChunk) {
            setCorrect(true);
        } else {
            setCorrect(false);
        }
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

export default function TreePuzzlePage() {
    const isCurrentlySolved = useChapter4Access();
    if (!isCurrentlySolved) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white font-mono">Loading...</div>
            </div>
        );
    }
    const puzzle = (chapterIVData as any).puzzles?.TREE;
    if (!puzzle) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white font-mono">Puzzle not found.</div>
            </div>
        );
    }

    const stages = puzzle.stageData || [];
    const storageKey = 'chapterIV-TREE-progress';
    const [stageIndex, setStageIndex] = useState<number>(0);
    const [input, setInput] = useState<string>('');
    const [feedback, setFeedback] = useState<string>('');
    const [completed, setCompleted] = useState<boolean>(false);

    // Stage 2 specific state
    const [nodes, setNodes] = useState<{ id: string, label: string, withered?: boolean }[]>([]);
    const [nodeSeq, setNodeSeq] = useState<string>('');

    useEffect(() => {
        // load progress
        try {
            const raw = localStorage.getItem(storageKey);
            if (raw) {
                const i = parseInt(raw, 10);
                if (!isNaN(i) && i >= 0 && i < stages.length) setStageIndex(i);
                if (!isNaN(i) && i >= stages.length) setCompleted(true);
            }
        } catch (e) {
            // ignore
        }
    }, [stages.length]);

    useEffect(() => {
        try {
            localStorage.setItem(storageKey, String(stageIndex));
        } catch (e) {
        }
    }, [stageIndex]);

    useEffect(() => {
        // initialize nodes for stage 2 when reached — deterministic from stage1 payload
        if (stageIndex === 1 && nodes.length === 0) {
            const base = [
                {id: 'n1', label: '5'},
                {id: 'n2', label: '2'},
                {id: 'n3', label: '8'},
                {id: 'n4', label: '1'},
            ];
            // use stage1 payload as seed; fallback to plaque id
            const seedStr = stages[0]?.payload || 'TREE';
            const shuffled = seededShuffle(base, seedStr).map((n, idx) => ({
                ...n,
                withered: (Math.floor(seedFromString(seedStr + n.id) % 4) === 0) && idx !== 0
            }));
            setNodes(shuffled);
            setNodeSeq('');
            setFeedback('Activate nodes in the correct order. Avoid withered nodes.');
        }
    }, [stageIndex]);

    const handleNodeClick = (node: { id: string, label: string, withered?: boolean }) => {
        if (node.withered) {
            setNodeSeq('');
            setFeedback('You touched a withered node — sequence reset.');
            return;
        }
        setNodeSeq(prev => {
            const next = prev + node.label;
            // when length matches expected, validate with server
            (async () => {
                try {
                    const res = await fetch(routes.api.chapters.iv.validateStage, {
                        method: 'POST',
                        body: JSON.stringify({plaqueId: 'TREE', stageIndex: 1, provided: next})
                    });
                    const json = await res.json();
                    if (json?.ok) {
                        setFeedback('Correct sequence! Advancing...');
                        setTimeout(() => setStageIndex(2), 700);
                        setNodeSeq('');
                    } else if (next.length >= 1) {
                        // incorrect when we've reached the length and server rejects
                        setFeedback('Wrong sequence — reset and try again.');
                        setNodeSeq('');
                    }
                } catch (e) {
                    setFeedback('Server error');
                }
            })();
            return next;
        });
    }

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        setFeedback('');
        const provided = (input || '').trim().toLowerCase();
        const expected = (stages[stageIndex]?.answer || '').toLowerCase();
        if (!expected) {
            setFeedback('No expected answer configured for this stage.');
            return;
        }
        if (provided === expected) {
            if (stageIndex >= stages.length - 1) {
                setCompleted(true);
                setStageIndex(stages.length);
                try {
                    localStorage.setItem(storageKey, String(stages.length));
                } catch (e) {
                }
                setFeedback('Stage complete. Puzzle finished.');
            } else {
                setFeedback('Correct — advancing to next stage.');
                setStageIndex(prev => prev + 1);
                setInput('');
            }
        } else {
            setFeedback('Incorrect answer. Try again.');
        }
    }

    const resetProgress = () => {
        setStageIndex(0);
        setInput('');
        setFeedback('Progress reset.');
        setCompleted(false);
        setNodes([]);
        setNodeSeq('');
        try {
            localStorage.removeItem(storageKey);
        } catch (e) {
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 p-8">
            <div className="max-w-4xl mx-auto text-white font-mono">
                <h1 className="text-3xl font-bold mb-4">TREE Puzzle</h1>

                <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                        <h2 className="text-lg font-semibold mb-2">Stages</h2>
                        <ol className="list-decimal list-inside text-gray-300 space-y-2">
                            {stages.map((s: any, i: number) => (
                                <li key={i}>
                                    <button
                                        className={`text-left w-full ${i === stageIndex ? 'text-white font-bold' : 'text-gray-400'}`}
                                        onClick={() => setStageIndex(i)}
                                    >
                                        {i + 1}. {s.title}
                                    </button>
                                </li>
                            ))}
                        </ol>
                        <div className="mt-4">
                            <button onClick={resetProgress} className="text-xs text-red-400 underline">Reset progress
                            </button>
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        {completed ? (
                            <div className="p-4 bg-gray-800 rounded">
                                <h3 className="text-xl font-bold text-green-400">Puzzle Completed</h3>
                                <p className="text-gray-300 mt-2">You finished all stages for TREE. Return to the
                                    chapter to continue.</p>
                                <div className="mt-4">
                                    <Link href="/chapters/IV" className="underline text-gray-200">Back to Chapter
                                        IV</Link>
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 bg-gray-800 rounded">
                                <h3 className="text-xl font-semibold">{stages[stageIndex]?.title}</h3>
                                <p className="text-gray-300 mt-2 whitespace-pre-line">{stages[stageIndex]?.instruction}</p>

                                {/* Stage 2 interactive UI: Node activation */}
                                {stageIndex === 1 && (
                                    <div className="mt-4">
                                        <div className="text-sm text-gray-400 mb-2">Activate nodes in order.
                                            Sequence: <span className="text-green-300 font-mono">{nodeSeq}</span></div>
                                        <div className="grid grid-cols-2 gap-3">
                                            {nodes.map(n => (
                                                <button key={n.id} onClick={() => handleNodeClick(n)}
                                                        className={`p-4 rounded font-mono ${n.withered ? 'bg-gray-700 text-red-400 line-through' : 'bg-black text-green-300 border border-gray-700'}`}>
                                                    {n.label}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="mt-3 text-xs text-gray-400">Tip: withered nodes will reset your
                                            sequence.
                                        </div>
                                    </div>
                                )}

                                {/* Stage 3: Canopy Riddle Chain */}
                                {stageIndex === 2 && (
                                    <div className="mt-4">
                                        <div className="text-sm text-gray-400 mb-3">Solve the chain of riddles. Each
                                            answer is a chunk; combine in order to form the final word.
                                        </div>
                                        <div className="space-y-3">
                                            {/** three micro-riddles **/}
                                            <Riddle idx={0}
                                                    prompt="I am a small container; I can hold a secret or a tool. What am I?"
                                                    expectedChunk="can"/>
                                            <Riddle idx={1}
                                                    prompt="Opposite of close in operations; also a short form for opportunity. What chunk?"
                                                    expectedChunk="op"/>
                                            <Riddle idx={2}
                                                    prompt="A common question, a homophone for the letter that sounds like 'why' — give me the final chunk."
                                                    expectedChunk="y"/>
                                        </div>
                                    </div>
                                )}

                                {stageIndex !== 1 && stages[stageIndex]?.payload && (
                                    <div className="mt-3 bg-black p-3 rounded border border-gray-700">
                                        <div className="text-xs text-gray-400">Payload</div>
                                        <div
                                            className="text-sm font-mono mt-1 text-green-300 break-all">{stages[stageIndex].payload}</div>
                                    </div>
                                )}

                                {/* default input for stages other than the specialized ones */}
                                {stageIndex !== 1 && (
                                    <form onSubmit={handleSubmit} className="mt-4">
                                        <input
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            placeholder="Enter answer"
                                            className="bg-gray-900 text-white font-mono text-sm px-3 py-2 rounded w-full"
                                        />
                                        <div className="mt-3 flex gap-3">
                                            <button type="submit"
                                                    className="bg-green-600 hover:bg-green-500 text-black font-mono px-3 py-1 rounded text-sm">Submit
                                            </button>
                                            <button type="button" onClick={() => {
                                                navigator.clipboard && navigator.clipboard.writeText(stages[stageIndex]?.payload || '');
                                            }} className="text-xs text-gray-300 underline">Copy payload
                                            </button>
                                        </div>
                                    </form>
                                )}

                                {feedback && (
                                    <div className="mt-3 text-sm text-yellow-300">{feedback}</div>
                                )}
                            </div>
                        )}

                    </div>
                </div>

                <div className="mt-6">
                    <Link href="/chapters/IV" className="text-sm text-gray-300 underline">Back to Chapter IV</Link>
                </div>
            </div>
        </div>
    );
}
