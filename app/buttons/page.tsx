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
import { useRouter } from 'next/navigation';

const BROWSERS = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera'] as const;
type BrowserName = typeof BROWSERS[number];

// Detect browser reliably (basic)
function getBrowserName(): BrowserName | null {
  const ua = navigator.userAgent;
  if (/Chrome/.test(ua) && !/Edge/.test(ua) && !/OPR/.test(ua)) return 'Chrome';
  if (/Firefox/.test(ua)) return 'Firefox';
  if (/Safari/.test(ua) && !/Chrome/.test(ua)) return 'Safari';
  if (/Edge/.test(ua)) return 'Edge';
  if (/OPR/.test(ua)) return 'Opera';
  return null;
}

export default function ButtonsPage() {
  const router = useRouter();

  // States: which buttons globally pressed
  const [buttonStates, setButtonStates] = useState<Record<BrowserName, boolean>>({
    Chrome: false,
    Firefox: false,
    Safari: false,
    Edge: false,
    Opera: false,
  });

  // Detected browser of current user
  const [userBrowser, setUserBrowser] = useState<BrowserName | null>(null);

  // Flag if all buttons globally pressed
  const allPressed = Object.values(buttonStates).every(Boolean);

  // Check cookie and redirect if not unlocked
  useEffect(() => {
    const unlocked = Cookies.get('Button Unlocked');
    if (!unlocked) {
      router.replace('/404');
    }
  }, [router]);

  // Detect browser and fetch global button states from API on mount
  useEffect(() => {
    const detected = getBrowserName();
    setUserBrowser(detected);

    axios.get('/api/state')
        .then(res => {
          // Build new state map, ensure all browsers present, fallback to false
          const newStates: Record<BrowserName, boolean> = {
            Chrome: false,
            Firefox: false,
            Safari: false,
            Edge: false,
            Opera: false,
          };
          for (const entry of res.data) {
            if (BROWSERS.includes(entry.browser)) {
              newStates[entry.browser as BrowserName] = entry.clicked;
            }
          }
          setButtonStates(newStates);

          if (Object.values(newStates).every(Boolean)) {
            Cookies.set('File Unlocked', 'true');
          }
        })
        .catch(() => {
          // Optional: handle error, maybe notify user or log silently
        });
  }, []);

  // Handle a specific button press
  async function pressButton(browser: BrowserName) {
    if (!userBrowser || userBrowser !== browser) return; // disallow if not matching user browser
    if (buttonStates[browser]) return; // already pressed

    try {
      await axios.post('/api/press', { browser });
      const updatedStates = { ...buttonStates, [browser]: true };
      setButtonStates(updatedStates);

      if (Object.values(updatedStates).every(Boolean)) {
        Cookies.set('File Unlocked', 'true');
      }
    } catch {
      alert('This button has already been pressed or there was an error.');
    }
  }

  // Early return if cookie missing handled above via redirect

  return (
      <div style={{ fontFamily: allPressed ? 'Wingdings, monospace' : 'sans-serif', padding: '2rem' }}>
        <h1>Global Browser Buttons</h1>
        <p>
          Click the button matching your browser to activate it globally.
        </p>
        <div>
          {BROWSERS.map(b => {
            const isDisabled = b !== userBrowser || buttonStates[b];
            return (
                <button
                    key={b}
                    onClick={() => pressButton(b)}
                    disabled={isDisabled}
                    title={
                      isDisabled
                          ? b !== userBrowser
                              ? `This button is for ${b} browser only`
                              : 'Button already pressed'
                          : `Press to activate ${b} button`
                    }
                    style={{
                      margin: '0.5rem',
                      padding: '0.7rem 1.2rem',
                      fontWeight: buttonStates[b] ? 'bold' : 'normal',
                      backgroundColor: buttonStates[b] ? '#888' : '#0cf',
                      cursor: isDisabled ? 'not-allowed' : 'pointer',
                      borderRadius: 4,
                      border: 'none',
                      color: 'white',
                      userSelect: 'none',
                      transition: 'background-color 0.3s',
                    }}
                >
                  {b}
                </button>
            );
          })}
        </div>

        {allPressed && (
            <div className="secret-message" aria-live="polite" role="alert">
              👍︎♒︎♏︎♍︎🙵 ⧫︎♒︎♏︎ 👍︎💧︎💧︎ ⬧︎♏︎♍︎❒︎♏︎⧫︎
            </div>
        )}

        <style jsx>{`
          .secret-message {
            font-size: 1.5rem;
            margin-top: 2rem;
            user-select: none;
          }

          /* Hint message visible by default, to tell user to check CSS */
          .secret::after {
            content: 'Remove invisible HTML tags to find the next link';
            display: block;
            margin-top: 1rem;
            font-style: italic;
            color: #666;
          }
        `}</style>
      </div>
  );
}
