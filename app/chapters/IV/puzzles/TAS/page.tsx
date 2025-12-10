'use client';

import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import { chapterIVPublic as chapterIVData } from '@/lib/data/chapters.public';
import { seededShuffle } from '@/lib/puzzles';
import { routes } from '@/lib/saveData';
import {useChapter4Access} from "@/hooks/BonusActHooks/useChapterSpecialAccess";

export default function TasPuzzlePage() {
  const isCurrentlySolved = useChapter4Access();
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
  // Stage answers validated on server via API

  const [stageIndex, setStageIndex] = useState<number>(0);
  const [input, setInput] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');

  // stage1 switches
  const [switches, setSwitches] = useState<number[]>([0,0,0,0,0]);

  // stage3 parts
  const [parts, setParts] = useState<string[]>([]);
  const [used, setUsed] = useState<boolean[]>([]);
  const [assembly, setAssembly] = useState<string>('');

  useEffect(() => {
    if (stageIndex === 2 && parts.length === 0) {
      // deterministic parts order seeded from stage0 payload
      const seedStr = stages[0]?.payload || 'TAS';
      const base = ['co','ns','en','su','s'];
      const shuffled = seededShuffle(base, seedStr);
      setParts(shuffled);
      setUsed(new Array(shuffled.length).fill(false));
      setAssembly('');
      setFeedback('Assemble the parts in order to form the final key.');
    }
  }, [stageIndex]);

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
        const res = await fetch(routes.api.chapters.iv.validateStage, { method: 'POST', body: JSON.stringify({ plaqueId: 'TAS', stageIndex: 1, provided: bits }) });
        const json = await res.json();
        if (json?.ok) { setFeedback('Correct — advancing to Stage 3'); setTimeout(() => setStageIndex(2), 400); } else setFeedback('Incorrect switch configuration.');
      } catch (e) { setFeedback('Server error'); }
    })();
  }

  const clickPart = (i: number) => {
    if (used[i]) return;
    setUsed(prev => {
      const c = prev.slice(); c[i] = true; return c;
    });
    setAssembly(prev => {
      const next = prev + parts[i];
      if (next.length >= (stages[2]?.answer || '').length) {
        // validate assembly result with server
        (async () => {
          try {
            const res = await fetch(routes.api.chapters.iv.validateStage, { method: 'POST', body: JSON.stringify({ plaqueId: 'TAS', stageIndex: 2, provided: next }) });
            const json = await res.json();
            if (json?.ok) {
              setFeedback('Correct final assembly — puzzle finished.');
              setTimeout(() => setStageIndex(3), 500);
            } else {
              setFeedback('Wrong assembly — reset and try again.');
              setUsed(new Array(parts.length).fill(false));
              setAssembly('');
            }
          } catch (e) { setFeedback('Server error'); }
        })();
      }
      return next;
    });
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setFeedback('');
    const provided = (input || '').trim().toLowerCase();
    // validate with server
    try {
      const res = await fetch(routes.api.chapters.iv.validateStage, { method: 'POST', body: JSON.stringify({ plaqueId: 'TAS', stageIndex, provided }) });
      const json = await res.json();
      if (!json?.ok) { setFeedback('Incorrect answer.'); return; }
      // proceed
      if (stageIndex >= stages.length - 1) {
        setStageIndex(stages.length);
        setFeedback('Puzzle completed.');
      } else {
        setStageIndex(prev => prev + 1);
        setInput('');
        setFeedback('Correct — advanced.');
      }
    } catch (e) { setFeedback('Server error'); }
  }

  const reset = () => {
    setStageIndex(0); setInput(''); setFeedback('Reset.'); setSwitches([0,0,0,0,0]); setParts([]); setUsed([]); setAssembly('');
  }

  return (
    <div className="min-h-screen p-8 bg-gray-900 text-white font-mono">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">TAS Puzzle</h1>
        <p className="text-sm text-gray-400 mb-6">Follow the staged hints to solve the multipart circuit.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="font-semibold">Stages</h3>
            <ol className="mt-2 list-decimal space-y-2">
              {stages.map((s: any, i: number) => (
                <li key={i}>
                  <button onClick={() => setStageIndex(i)} className={i === stageIndex ? 'font-bold' : ''}>{i+1}. {s.title}</button>
                </li>
              ))}
            </ol>
            <div className="mt-4">
              <button onClick={reset} className="text-xs text-red-400 underline">Reset</button>
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
                      <button key={i} onClick={() => toggleSwitch(i)} className={b === 1 ? 'px-3 py-2 bg-green-600 text-black rounded' : 'px-3 py-2 bg-gray-700 text-gray-200 rounded'}>{b}</button>
                    ))}
                    <button onClick={submitSwitches} className="ml-3 px-3 py-2 bg-blue-600 rounded">Submit</button>
                  </div>
                  <div className="mt-2 text-xs text-gray-400">Toggle switches to match the expected bitstring.</div>
                </div>
              )}

              {stageIndex === 2 && (
                <div className="mt-4">
                  <div className="flex gap-2 flex-wrap">
                    {parts.map((p, i) => (
                      <button key={i} disabled={used[i]} onClick={() => clickPart(i)} className={used[i] ? 'px-3 py-2 bg-gray-700 rounded' : 'px-3 py-2 bg-black text-green-300 border rounded'}>{p}</button>
                    ))}
                    <button onClick={() => { setUsed(new Array(parts.length).fill(false)); setAssembly(''); }} className="ml-2 text-xs underline">Reset</button>
                  </div>
                  <div className="mt-2">Current: <span className="font-mono text-green-300">{assembly}</span></div>
                </div>
              )}

              {stageIndex !== 1 && stageIndex !== 2 && (
                <form onSubmit={handleSubmit} className="mt-4">
                  {stages[stageIndex]?.payload && <div className="bg-black p-2 rounded text-xs text-green-300 break-all">{stages[stageIndex].payload}</div>}
                  <div className="mt-2 flex gap-2">
                    <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter answer" className="flex-1 bg-gray-900 px-3 py-2 rounded" />
                    <button type="submit" className="px-3 py-2 bg-green-600 rounded">Submit</button>
                  </div>
                </form>
              )}

              {feedback && <div className="mt-3 text-sm text-yellow-300">{feedback}</div>}
            </div>

          </div>
        </div>

        <div className="mt-6">
          <Link href="/chapters/IV" className="text-sm text-gray-300 underline">Back to Chapter IV</Link>
        </div>
      </div>
    </div>
  );
}
