/*
URL[Buttons] -> FOR HERE If not cookie[Buttons Unlocked] then 404
  5 Global Buttons, Each button corresponds to a specific browser name (e.g., Chrome, Firefox, Safari, etc.), A button is only clickable if the user's browser matches its assigned browser
  Once clicked, That button becomes globally locked (i.e., permanently activated for all users, cannot be unclicked)
  IF all 5 buttons are pressed, create cookie[File Unlocked] then globally the page just becomes WINGDING message that says to go and check the CSS for .secret
  The CSS in .secret says to remove invis html tags, which when removed reveals URL[File Console]
*/

'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

const BROWSERS = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera'];

function getBrowserName(): string | null {
  const ua = navigator.userAgent;
  if (/Chrome/.test(ua) && !/Edge/.test(ua) && !/OPR/.test(ua)) return 'Chrome';
  if (/Firefox/.test(ua)) return 'Firefox';
  if (/Safari/.test(ua) && !/Chrome/.test(ua)) return 'Safari';
  if (/Edge/.test(ua)) return 'Edge';
  if (/OPR/.test(ua)) return 'Opera';
  return null;
}

export default function ButtonsPage() {
  const [states, setStates] = useState<Record<string, boolean>>({});
  const [browser, setBrowser] = useState<string | null>(null);
  const [allPressed, setAllPressed] = useState(false);

  useEffect(() => {
    const detected = getBrowserName();
    setBrowser(detected);
    axios.get('/api/buttons/state').then(res => {
      const stateMap: Record<string, boolean> = {};
      for (const { browser, clicked } of res.data) {
        stateMap[browser] = clicked;
      }
      setStates(stateMap);
      if (Object.values(stateMap).every(Boolean)) {
        Cookies.set('File Unlocked', 'true');
        setAllPressed(true);
      }
    });
  }, []);

  const pressButton = async () => {
    if (!browser || states[browser]) return;
    try {
      await axios.post('/api/buttons/press', { browser });
      const updated = { ...states, [browser]: true };
      setStates(updated);
      if (Object.values(updated).every(Boolean)) {
        Cookies.set('File Unlocked', 'true');
        setAllPressed(true);
      }
    } catch (err) {
      alert('Already pressed or error.');
    }
  };

  if (!Cookies.get('Buttons Unlocked')) return <h1>404</h1>;

  return (
      <div style={{ fontFamily: allPressed ? 'Wingdings, monospace' : 'sans-serif', padding: '2rem' }}>
        <h1>Global Browser Buttons</h1>
        {BROWSERS.map(b => (
            <button
                key={b}
                onClick={pressButton}
                disabled={b !== browser || states[b]}
                style={{
                  margin: '0.5rem',
                  background: states[b] ? '#888' : '#0cf',
                  cursor: b === browser && !states[b] ? 'pointer' : 'not-allowed'
                }}
            >
              {b}
            </button>
        ))}
        {allPressed && (
            <div className="secret-message">
              👍︎♒︎♏︎♍︎🙵 ⧫︎♒︎♏︎ 👍︎💧︎💧︎ ⬧︎♏︎♍︎❒︎♏︎⧫︎
            </div>
        )}

        <style jsx>{`
        .secret-message {
          font-size: 1.5rem;
          margin-top: 2rem;
        }
        .secret::after {
          content: 'Remove invisible HTML to find the next link';
          visibility: hidden;
        }
      `}</style>
      </div>
  );
}
