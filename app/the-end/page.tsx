/*
URL[The End] -> FOR HERE If not cookie[End?] or not cookie[End] then 404, FOR ALL If cookie[End] or cookie[End?] redirect here
  If cookie[End?] ask for KEYWORD[6] which is gotten from VESSEL.exe, once inputted: Replace cookie[End?] with cookie[End]
  If cookie[End], empty black screen, with creepy music, Also console.log has creepy THE END messages
  - The html comments have maniacal and insane comments of non-passed survivors
  - If 25 or END is typed randomly, the flower is cut in the middle and static noise plays
*/

'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const KEYWORD_6 = "your-keyword-6-from-VESSEL-exe"; // Replace with actual secret

export default function TheEnd() {
  const router = useRouter();
  const [hasEndCookie, setHasEndCookie] = useState(false);
  const [hasEndQuestionCookie, setHasEndQuestionCookie] = useState(false);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const flowerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Check cookies on mount
  useEffect(() => {
    const end = Cookies.get('End');
    const endQuestion = Cookies.get('End?');

    if (!end && !endQuestion) {
      router.replace('/404');
      return;
    }

    setHasEndCookie(!!end);
    setHasEndQuestionCookie(!!endQuestion);
  }, [router]);

  // If End cookie present, start creepy experience
  useEffect(() => {
    if (hasEndCookie) {
      // Play creepy music
      audioRef.current?.play();

      // Print creepy console messages repeatedly
      const creepyMessages = [
        'THE END IS ONLY THE BEGINNING...',
        'YOU CAN NEVER ESCAPE.',
        'THE FLOWER BLOOMS... THEN WITHERS.',
        'INSANITY IS YOUR ONLY COMPANION.',
        'NO SURVIVORS LEFT BEHIND.',
        'SOME VOICES NEVER DIE.',
      ];

      let i = 0;
      const interval = setInterval(() => {
        console.log('%c' + creepyMessages[i % creepyMessages.length], 'color: red; font-weight: bold;');
        i++;
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [hasEndCookie]);

  // Handle user typing "25" or "END" anywhere on the page
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      // Track user input sequence
      // For simplicity, track last 3-characters typed to match "25" or "END"
      // We can use a buffer string

      let buffer = (window as any).inputBuffer || '';
      buffer += e.key.toUpperCase();
      if (buffer.length > 3) buffer = buffer.slice(buffer.length - 3);
      (window as any).inputBuffer = buffer;

      if (buffer.includes('25') || buffer.includes('END')) {
        triggerFlowerCutAndStatic();
        // Reset buffer after trigger
        (window as any).inputBuffer = '';
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  function triggerFlowerCutAndStatic() {
    if (!flowerRef.current) return;

    // Add class for flower cut animation
    flowerRef.current.classList.add('cut');

    // Play static noise
    const staticAudio = new Audio('/static-noise.mp3'); // You need to have static-noise.mp3 in public folder or replace with dataURI
    staticAudio.play();
  }

  // Handle keyword 6 submission
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (input.trim() === KEYWORD_6) {
      Cookies.remove('End?');
      Cookies.set('End', 'true');
      setHasEndCookie(true);
      setHasEndQuestionCookie(false);
      setError('');
    } else {
      setError('Incorrect keyword. Try again.');
    }
  }

  if (hasEndCookie) {
    return (
        <>
          {/* Maniacal insane comments in HTML */}
          {/*
          // These survivors never made it:
          // "They whispered secrets no one dared to hear."
          // "Madness took them, one by one."
          // "Do you hear the laughter? No? That’s because you’re next."
          // "They broke before the end. So will you."
        */}

          <div style={{
            backgroundColor: 'black',
            height: '100vh',
            width: '100vw',
            position: 'relative',
            color: 'white',
            overflow: 'hidden',
            userSelect: 'none',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            fontFamily: "'Courier New', Courier, monospace",
            fontSize: '2rem'
          }}>
            <div ref={flowerRef} className="flower">
              {/* Imagine flower SVG or CSS flower here */}
              🌸
            </div>
            <audio ref={audioRef} loop src="/creepy-music.mp3" />
          </div>

          <style jsx>{`
          .flower {
            transition: all 1.5s ease;
          }
          .flower.cut {
            filter: grayscale(100%) brightness(0.5);
            transform: scaleX(0) scaleY(1);
            opacity: 0.2;
          }
        `}</style>
        </>
    );
  }

  if (hasEndQuestionCookie) {
    return (
        <div style={{
          backgroundColor: 'black',
          color: 'white',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontFamily: "'Courier New', Courier, monospace",
          flexDirection: 'column',
        }}>
          <h1>Final Challenge</h1>
          <p>Enter the KEYWORD[6] from VESSEL.exe to proceed:</p>
          <form onSubmit={handleSubmit}>
            <input
                autoFocus
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                style={{
                  fontSize: '1.5rem',
                  padding: '0.5rem',
                  width: '300px',
                  borderRadius: '5px',
                  border: '1px solid white',
                  backgroundColor: 'black',
                  color: 'white',
                }}
            />
            <button type="submit" style={{marginTop: '1rem', padding: '0.5rem 1rem', fontSize: '1rem'}}>Submit</button>
          </form>
          {error && <p style={{color: 'red'}}>{error}</p>}
        </div>
    );
  }

  // Should never reach here (cookie check at top)
  return null;
}
