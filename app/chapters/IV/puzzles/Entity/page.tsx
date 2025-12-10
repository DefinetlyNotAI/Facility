'use client';

import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import { chapterIVPublic as chapterIVData } from '@/lib/data/chapters.public';
import { seededTokens } from '@/lib/puzzles';
import { routes } from '@/lib/saveData';
import {useChapter4Access} from "@/hooks/BonusActHooks/useChapterSpecialAccess";

export default function EntityPuzzlePage() {
  const isCurrentlySolved = useChapter4Access();
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
  // Answers are validated server-side. We'll call the validate-stage API for checks.

  const [stageIndex, setStageIndex] = useState<number>(0);
  const [input, setInput] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');

  // stage2 grid
  const [grid] = useState<string[]>(['m','i','r','r','o','r','x','x','x']);
  const [selection, setSelection] = useState<string>('');

  // stage3 anomalies
  const [anomalies, setAnomalies] = useState<string[]>([]);
  const [picked, setPicked] = useState<boolean[]>([]);
  const [anSelection, setAnSelection] = useState<string>('');

  useEffect(() => {
    if (stageIndex === 2 && anomalies.length === 0) {
      const base = ['a','n','o','m','a','l','y'];
      const seedStr = stages[0]?.payload || 'Entity';
      const tokens = seededTokens(base, seedStr);
      setAnomalies(tokens);
      setPicked(new Array(tokens.length).fill(false));
      setAnSelection('');
      setFeedback('Select anomaly tokens to form the proof string.');
    }
  }, [stageIndex]);

  const clickGrid = (i: number) => { setSelection(prev => prev + grid[i]); setFeedback(''); }
  const submitGrid = async () => {
    // validate stage 2 with server
    try {
      const res = await fetch(routes.api.chapters.iv.validateStage, { method: 'POST', body: JSON.stringify({ plaqueId: 'Entity', stageIndex: 1, provided: selection }) });
      const json = await res.json();
      if (json?.ok) { setFeedback('Correct — advancing'); setTimeout(() => setStageIndex(2), 400); } else setFeedback('Incorrect path');
    } catch (e) { setFeedback('Server error'); }
  }

  const clickAnomaly = (i: number) => {
    if (picked[i]) return;
    setPicked(prev => { const c = prev.slice(); c[i] = true; return c; });
    setAnSelection(prev => prev + anomalies[i].charAt(0));
  }
  const submitAnomalies = async () => {
    try {
      const res = await fetch(routes.api.chapters.iv.validateStage, { method: 'POST', body: JSON.stringify({ plaqueId: 'Entity', stageIndex: 2, provided: anSelection }) });
      const json = await res.json();
      if (json?.ok) { setFeedback('Correct proof — complete'); setTimeout(() => setStageIndex(3), 400); } else setFeedback('Incorrect proof');
    } catch (e) { setFeedback('Server error'); }
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const provided = (input || '').trim().toLowerCase();
    // Validate with server (stage 0 and others)
    try {
      const res = await fetch(routes.api.chapters.iv.validateStage, { method: 'POST', body: JSON.stringify({ plaqueId: 'Entity', stageIndex, provided }) });
      const json = await res.json();
      if (json?.ok) {
        if (stageIndex >= stages.length - 1) {
          setStageIndex(stages.length);
          setFeedback('Puzzle completed');
        } else {
          setStageIndex(prev => prev + 1);
          setInput('');
          setFeedback('Advanced');
        }
      } else setFeedback('Incorrect');
    } catch (e) { setFeedback('Server error'); }
  }

  const reset = () => { setStageIndex(0); setInput(''); setSelection(''); setAnomalies([]); setPicked([]); setAnSelection(''); setFeedback('Reset'); }

  return (
    <div className="min-h-screen p-8 bg-gray-900 text-white font-mono">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Entity Puzzle</h1>
        <p className="text-sm text-gray-400 mb-6">Follow the staged hints to solve the multipart proof.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="font-semibold">Stages</h3>
            <ol className="mt-2 list-decimal space-y-2">
              {stages.map((s:any,i:number)=>(<li key={i}><button onClick={()=>setStageIndex(i)} className={i===stageIndex? 'font-bold':''}>{i+1}. {s.title}</button></li>))}
            </ol>
            <div className="mt-4"><button onClick={reset} className="text-xs text-red-400 underline">Reset</button></div>
          </div>

          <div className="md:col-span-2">
            <div className="p-4 bg-gray-800 rounded">
              <h3 className="font-semibold">{stages[stageIndex]?.title}</h3>
              <p className="text-sm text-gray-300 mt-2">{stages[stageIndex]?.instruction}</p>

              {stageIndex===1 && (
                <div className="mt-4">
                  <div className="grid grid-cols-3 gap-2">
                    {grid.map((g,idx)=>(<button key={idx} onClick={()=>clickGrid(idx)} className="p-3 bg-black rounded text-green-300">{g}</button>))}
                  </div>
                  <div className="mt-3 flex items-center gap-3"><div className="text-sm text-gray-400">Selection: <span className="font-mono text-green-300">{selection}</span></div><button onClick={()=>setSelection('')} className="text-xs underline">Clear</button><button onClick={submitGrid} className="ml-2 px-3 py-1 bg-blue-600 rounded">Submit</button></div>
                </div>
              )}

              {stageIndex===2 && (
                <div className="mt-4">
                  <div className="flex gap-2 flex-wrap">{anomalies.map((a,idx)=>(<button key={idx} disabled={picked[idx]} onClick={()=>clickAnomaly(idx)} className={picked[idx]? 'px-3 py-2 bg-gray-700 rounded':'px-3 py-2 bg-black text-green-300 rounded'}>{a}</button>))}</div>
                  <div className="mt-3 flex items-center gap-3"><div>Current: <span className="font-mono text-green-300">{anSelection}</span></div><button onClick={()=>{setPicked(new Array(anomalies.length).fill(false)); setAnSelection('');}} className="text-xs underline">Clear</button><button onClick={submitAnomalies} className="ml-2 px-3 py-1 bg-blue-600 rounded">Submit</button></div>
                </div>
              )}

              {stageIndex!==1 && stageIndex!==2 && (
                <form onSubmit={handleSubmit} className="mt-4">{stages[stageIndex]?.payload && <div className="bg-black p-2 rounded text-xs text-green-300 break-all">{stages[stageIndex].payload}</div>}<div className="mt-2 flex gap-2"><input value={input} onChange={(e)=>setInput(e.target.value)} placeholder="Enter answer" className="flex-1 bg-gray-900 px-3 py-2 rounded" /><button type="submit" className="px-3 py-2 bg-green-600 rounded">Submit</button></div></form>
              )}

              {feedback && <div className="mt-3 text-sm text-yellow-300">{feedback}</div>}
            </div>
          </div>
        </div>

        <div className="mt-6"><Link href="/chapters/IV" className="text-sm text-gray-300 underline">Back to Chapter IV</Link></div>
      </div>
    </div>
  );
}
