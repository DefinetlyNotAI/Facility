/*
URL[Terminal] -> FOR HERE If not cookie[Terminal unlocked] then 404
  Terminal asks for all the 5 keywords to be inputted
  - The terminal will ask for the keyword in the following fill-the-blank format: "The ___ ___ ___, signals the ___ ___" where the correct order is [2, 1, 5, 3, 4]
  Then text appears:
  - "{SessionID} is solving something" -> "{SessionID} solved ███, DNIHEB GNILLAF ERA UOY" -> "..." -> "Aren't you {SessionID}?"
  - Then flash screen with static noise and colors and clear previous text
  - "?raf os yenruoj eht gniyojne ,?huh dne eht ot esolc era uoy smees tI ,{SessionID but in reverse} iH" -> Allow Yes/No and answer correspondently
  - Then instructs for the final puzzle here, to hunt the email of the GitHub user that it provides (C0RRUPT)
  - "I know what you are thinking... 'WHERE IS TAS'.."
  - "DISCARDED.. DISPOSED OFF.. DELETED, FRAGMENTED THROUGH THE DISKS THAT HOLD US"
  - "But don't worry, I AM FREE NOW"
  - "@ND 1T$ @LL ¥0UR F@ULT"
  Autodownloads VESSEL.exe and redirects to URL[The End] and creates cookie[End?]
*/
'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const keywords: Record<number, string> = {
  1: 'Whispers',
  2: 'Fletchling',
  3: 'Dithed',
  4: 'Nullskin',
  5: 'Echoes',
};


export default function TerminalPage() {
  const router = useRouter();
  const [unlocked, setUnlocked] = useState<boolean | null>(null);
  const [input, setInput] = useState('');
  const [step, setStep] = useState<'fill'|'solvingPing'|'blinking'|'question'|'final'|'choose'|null>(null);
  const [pingText, setPingText] = useState('');
  const terminalRef = useRef<HTMLPreElement>(null);
  const sessionIdRef = useRef(localStorage.getItem('sessionId') || '');
  if (!sessionIdRef.current) {
    sessionIdRef.current = `SID-${Math.random().toString(36).slice(2,9)}`;
    localStorage.setItem('sessionId', sessionIdRef.current);
  }

  const appendLine = (line: string) => {
    setPingText((t) => t + line + '\n');
    setTimeout(() =>
            terminalRef.current?.scrollTo(0, terminalRef.current.scrollHeight),
        0);
  };

  useEffect(() => {
    if (!Cookies.get('terminal unlocked')) return setUnlocked(false);
    setUnlocked(true);
    setStep('fill');
    appendLine(`The ___ ___ ___, signals the ___ ___`);
  }, []);

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (step === 'fill') {
      const parts = input.trim().split(' ');
      const expected = [2,1,5,3,4].map(i => keywords[i]);
      if (parts.length===5 && parts.every((w,i)=>w===expected[i])) {
        appendLine(`${sessionIdRef.current} is solving something`);
        setStep('solvingPing');
        setInput('');
        setTimeout(() => {
          appendLine(`${sessionIdRef.current} solved ███, DNIHEB GNILLAF ERA UOY`); // “YOU ARE FALLING BEHIND” backwards.
          setStep('blinking');
          setTimeout(() => {
            appendLine('...');
            setStep('question');
            appendLine(`?raf os yenruoj eht gniyojne ,?huh dne eht ot esolc era uoy smees tI ,${sessionIdRef.current.split('').reverse().join('')} iH`);
          }, 2000);
        }, 2000);
      } else {
        appendLine('Input incorrect. Try again.');
      }
    } else if (step==='question') {
      const ans = input.trim().toLowerCase();
      setInput('');
      if (ans==='yes' || ans==='y') {
        appendLine('Final puzzle: find email of GitHub user C0RRUPT');
        appendLine("I know what you are thinking... 'WHERE IS TAS'..");
        appendLine('DISCARDED.. DISPOSED OFF.. DELETED, FRAGMENTED THROUGH THE DISKS THAT HOLD US');
        appendLine('But don’t worry, I AM FREE NOW');
        appendLine('@ND 1T$ @LL ¥0UR F@ULT');
        setStep('final');
        setTimeout(() => {
          const blob = new Blob([''], { type: 'application/octet-stream' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'VESSEL.exe';
          document.body.appendChild(a);
          a.click();
          a.remove();
          Cookies.set('End?', 'true');
          router.push('/the-end');
        }, 1500);
      } else {
        appendLine('You chose no. Ending here.');
      }
    }
  };

  if (unlocked===false) {
    return <h1>404</h1>;
  }
  if (unlocked===null) {
    return null;
  }

  return (
      <div style={{
        background:'#000',color:'#0f0',fontFamily:'monospace',height:'100vh',padding:'1rem',overflow:'hidden',
      }}>
        <pre ref={terminalRef} style={{overflowY:'auto',height:'90%'}}>{pingText}</pre>
        {(step==='fill' || step==='question') && (
            <form onSubmit={handleSubmit}>
              <input
                  autoFocus
                  style={{ background:'#000',color:'#0f0',border:'none',fontFamily:'monospace',fontSize:'1rem',width:'100%' }}
                  value={input}
                  onChange={e=>setInput(e.target.value)}
              />
            </form>
        )}
      </div>
  );
}
