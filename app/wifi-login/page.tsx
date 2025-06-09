/*
URL[Wifi Login] -> FOR HERE If not cookie[Wifi Unlocked] then 404, FOR HERE If cookie[wifi passed] redirect to URL[Wifi Panel]
  * IF FIRST TIME -> CUTSCENE[Interference]
  Generic login page, asks for username and password:
  - Pass is written in the JS code and is able to be seen by the people in inspect, the hash should be easy to crack
  - Username is in a html comment that says to go to a youtube vid to remember the username, the vid is just a basic reversed audio saying the username (itgrowshere)
  When logged in create cookie[Wifi passed]
*/

"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CryptoJS from 'crypto-js'; // SHA1 hashing

// Helpers for cookies
const getCookie = (name: string) =>
    document.cookie.split('; ').find(row => row.startsWith(name + '='))?.split('=')[1];

const setCookie = (name: string, value: string, days = 365) => {
  const expires = new Date(Date.now() + days * 86400000).toUTCString();
  document.cookie = `${name}=${value}; path=/; expires=${expires}`;
};

const InterferenceCutscene: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  const [step, setStep] = useState(0);
  const messages = [
    'V3$$3L.. W@TCH.. M3.. GR0W',
    'TH1$ TR33 H@$ JU$T F@LL3N',
    'PR@1$3 B3',
    ':)',
  ];

  useEffect(() => {
    if (step < messages.length) {
      const timer = setTimeout(() => setStep(step + 1), 3500);
      return () => clearTimeout(timer);
    } else {
      // End cutscene
      onFinish();
    }
  }, [step, onFinish]);

  // todo Basic breathing sound & glitch effect would require audio and CSS,
  //  here just simulate black screen and typed text messages

  return (
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'black', color: '#00FF00', fontFamily: 'monospace',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        flexDirection: 'column', userSelect: 'none', zIndex: 9999,
        filter: 'contrast(1.5) brightness(0.7)',
        overflow: 'hidden',
      }}>
        <div style={{ fontSize: '2rem', whiteSpace: 'pre-line', minHeight: '4rem' }}>
          {step > 0 ? messages.slice(0, step).join('\n\n') : ''}
          <TypingCursor active={step < messages.length} />
        </div>
        {/* Optional TAS voice cut-off or glitch effect could go here */}
      </div>
  );
};

const TypingCursor: React.FC<{ active: boolean }> = ({ active }) => {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => setVisible(v => !v), 500);
    return () => clearInterval(interval);
  }, [active]);
  return <span>{visible ? '|' : ' '}</span>;
};

const WifiLoginPage: React.FC = () => {
  const router = useRouter();
  const [showCutscene, setShowCutscene] = useState(false);
  const [cutsceneSeen, setCutsceneSeen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // On mount: check cookies and handle redirects + cutscene
  useEffect(() => {
    const wifiUnlocked = getCookie('Wifi Unlocked');
    if (!wifiUnlocked) {
      router.replace('/404');
      return;
    }
    const wifiPassed = getCookie('wifi passed');
    if (wifiPassed) {
      router.replace('/wifi-panel');
      return;
    }
    const cutsceneDone = getCookie('cutscene_seen');
    if (!cutsceneDone) {
      setShowCutscene(true);
    } else {
      setCutsceneSeen(true);
    }
  }, [router]);

  // Hash password function using CryptoJS SHA1
  const sha1 = (str: string) => CryptoJS.SHA1(str).toString();

  // Handle login submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (username.trim().toLowerCase() !== 'itgrowshere') {
      setError('Invalid username.');
      return;
    }

    // Password hash to match: e2f2a803878e98b0b440b3c071187f0c38ad17f2 ('trees')
    if (sha1(password) !== 'e2f2a803878e98b0b440b3c071187f0c38ad17f2') {
      setError('Invalid password.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setCookie('wifi passed', 'true');
      router.replace('/wifi-panel');
    }, 1000);
  };

  if (showCutscene && !cutsceneSeen) {
    return <InterferenceCutscene onFinish={() => {
      setCookie('cutscene_seen', 'true');
      setShowCutscene(false);
      setCutsceneSeen(true);
    }} />;
  }

  return (
      <>
        {/* If you ever forgot your name: https://youtu.be/zZzx9qt1Q9s */}
        {/* Also the pass hash is e2f2a803878e98b0b440b3c071187f0c38ad17f2 */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          height: '100vh', backgroundColor: '#111', color: '#0f0', fontFamily: 'monospace',
        }}>
          <h1>Wifi Login</h1>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '280px' }}>
            <label>
              Username:
              <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  autoComplete="off"
                  spellCheck={false}
                  required
              />
            </label>
            <label>
              Password:
              <input
                  type="password"
                  value={password}
                  onChange={e => {
                    // Only allow 1-6 lowercase letters for password
                    if (/^[a-z]{0,6}$/.test(e.target.value)) {
                      setPassword(e.target.value);
                    }
                  }}
                  minLength={1}
                  maxLength={6}
                  autoComplete="off"
                  spellCheck={false}
                  required
              />
            </label>
            <button type="submit" style={{ marginTop: '1rem', cursor: 'pointer' }}>
              Login
            </button>
            {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>}
            {loading && <p style={{ color: '#0f0', marginTop: '0.5rem' }}>Logging in...</p>}
          </form>
        </div>
      </>
  );
};

export default WifiLoginPage;
