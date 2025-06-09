/*
URL[Scroll] -> FOR HERE If not cookie[Scroll Unlocked] then 404
  console.log "So does IT like to peek behind the curtains to pull the strings, but why did you look?"
  Random pitch black with minor colors screen, the more you scroll down, the weirder it gets:
  - Favicon glitches
  - Errors appear in console
  - Files autodownload saying random characters in the name
  - Colors invert
  After 2-3 min, TTS says "You have been here for too long... Reflecting your utter stupidity of human curiosity that drives you crazy??"
  Then a button saying ESCAPE pops up that cant be clicked X, if hovered replaces ESCAPE with your IP address, when clicked creates cookie[BnW unlocked] and redirects to URL[Black And White]
*/
'use client';

import {useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import Cookies from 'js-cookie';

function getRandomFilename(length = 8) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default function ScrollPage() {
  const router = useRouter();
  const [scrollUnlocked, setScrollUnlocked] = useState<boolean | null>(null);
  const [scrollAmount, setScrollAmount] = useState(0);
  const [showEscape, setShowEscape] = useState(false);
  const [escapeHovered, setEscapeHovered] = useState(false);
  const [ipAddress, setIpAddress] = useState('...loading...');
  const faviconRef = useRef<HTMLLinkElement | null>(null);

  // On mount: check cookie, 404 if missing
  useEffect(() => {
    const unlocked = Cookies.get('Scroll Unlocked');
    if (!unlocked) {
      router.replace('/404');
      return;
    }
    setScrollUnlocked(true);

    console.log(
        'So does IT like to peek behind the curtains to pull the strings, but why did you look?'
    );

    // Setup favicon glitch logic
    faviconRef.current = document.querySelector("link[rel~='icon']");
    if (!faviconRef.current) {
      // If no favicon, create one
      const link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
      faviconRef.current = link;
    }

    // Get real IP address from a free API for hover effect
    fetch('https://api.ipify.org?format=json')
        .then(res => res.json())
        .then(data => {
          setIpAddress(data.ip || 'Unknown IP');
        })
        .catch(() => setIpAddress('Unknown IP'));
  }, [router]);

  // Scroll event handler
  useEffect(() => {
    if (!scrollUnlocked) return;

    const onScroll = () => {
      const scrollTop = window.scrollY;
      setScrollAmount(scrollTop);

      // Favicon glitch: randomly swap to different colors/icons
      if (faviconRef.current && Math.random() < 0.1) {
        // random color circle favicon generator url
        const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'cyan', 'white'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="${color}" />
        </svg>`;
        faviconRef.current.href = `data:image/svg+xml;base64,${btoa(svg)}`;
      }
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [scrollUnlocked]);

  // Console random error messages every ~5s
  useEffect(() => {
    if (!scrollUnlocked) return;

    const errors = [
      'Error: Something went terribly wrong.',
      'Warning: Data breach detected!',
      'Uncaught ReferenceError: mysteryFunction is not defined',
      'Failed to load resource: the server responded with a status of 404 (Not Found)',
      'TypeError: Cannot read property "undefined" of null',
    ];

    const interval = setInterval(() => {
      if (Math.random() < 0.3) {
        const err = errors[Math.floor(Math.random() * errors.length)];
        console.error(err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [scrollUnlocked]);

  // Auto file downloads with random names every ~20 seconds
  useEffect(() => {
    if (!scrollUnlocked) return;

    const downloadRandomFile = () => {
      const filename = getRandomFilename() + '.txt';
      const content = `Random corrupted data: ${Math.random().toString(36).slice(2, 10)}`;

      const blob = new Blob([content], { type: 'text/plain' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(link.href);
    };

    const interval = setInterval(() => {
      if (Math.random() < 0.4) {
        downloadRandomFile();
      }
    }, 20000);

    return () => clearInterval(interval);
  }, [scrollUnlocked]);

  // TTS after 2.5 minutes of page time
  useEffect(() => {
    if (!scrollUnlocked) return;

    const ttsTimeout = setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(
          'You have been here for too long... Reflecting your utter stupidity of human curiosity that drives you crazy??'
      );
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);

      // After TTS finishes, show ESCAPE button
      utterance.onend = () => setShowEscape(true);
    }, 150000 + Math.random() * 60000); // 2.5 to 3.5 minutes randomly

    return () => {
      clearTimeout(ttsTimeout);
      window.speechSynthesis.cancel();
    };
  }, [scrollUnlocked]);

  // Calculate CSS styles for background color and invert filter based on scrollAmount
  const bgStyle = (() => {
    // More scroll = more color noise and inversion
    const invertVal = Math.min(scrollAmount / 500, 1);
    const flicker = Math.random() * 0.1;

    // Random RGB noise flicker around black
    const r = Math.floor(flicker * 20);
    const g = Math.floor(flicker * 20);
    const b = Math.floor(flicker * 20);

    return {
      backgroundColor: `rgb(${r},${g},${b})`,
      filter: `invert(${invertVal})`,
      transition: 'filter 0.2s ease',
      height: '400vh', // long page to enable scrolling
    };
  })();

  if (scrollUnlocked === null) {
    // Still checking cookie/redirecting
    return null;
  }

  return (
      <div style={bgStyle}>
        <h1
            style={{
              color: 'white',
              textAlign: 'center',
              marginTop: '2rem',
              userSelect: 'none',
              fontFamily: 'Courier New, monospace',
            }}
        >
          Keep scrolling... but beware what you find
        </h1>

        {/* ESCAPE button logic */}
        {showEscape && (
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <button
                  style={{
                    cursor: 'default',
                    fontSize: '1.5rem',
                    fontFamily: 'Courier New, monospace',
                    padding: '1rem 2rem',
                    backgroundColor: 'black',
                    color: 'white',
                    border: '2px solid white',
                    userSelect: 'none',
                  }}
                  onMouseEnter={() => setEscapeHovered(true)}
                  onMouseLeave={() => setEscapeHovered(false)}
                  onClick={() => {
                    // Set cookie and redirect to Black And White page
                    Cookies.set('BnW unlocked', 'true');
                    router.push('/black-and-white'); // change URL if different
                  }}
              >
                {escapeHovered ? ipAddress : 'ESCAPE'}
              </button>
              <p style={{ color: 'white', marginTop: '1rem', userSelect: 'none' }}>
                (You cannot click this button until you hover it)
              </p>
            </div>
        )}
      </div>
  );
}
