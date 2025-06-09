/*
URL[Wifi Panel] -> FOR HERE If no cookie[wifi passed] but cookie[Wifi Unlocked] create cookie[wifi login] and redirect to URL[Wifi login], FOR HERE If not cookie[Wifi Unlocked] then 404
  2 buttons -> [Receive] and [Send]
  - Receive outputs a encoded message, which the algorithm would be in the html comments to help decipher, the message is a question that must be answered via the send
  - Send is locked until user inputs KEYWORD[1] as the password, then the button unlocks, if pressed a popup asks for the answer to the question, if answered correctly simulate sending the answer but then simulate a error and ask the user to use ceaser cipher to answer, if correct and all simulate everything loading well, and finally show URL[Media] and create cookie[Media Unlocked]
  If curl/wget is used, the json should return KEYWORD[2]
*/

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import styles from '../../styles/WifiPanel.module.css';

const KEYWORD_1 = 'Whispers';  // From your flow

export async function getServerSideProps(context: any) {
  const userAgent = context.req.headers['user-agent']?.toLowerCase() || '';

  if (userAgent.includes('curl') || userAgent.includes('wget')) {
    context.res.writeHead(302, { Location: '/api/wifi-panel' });
    context.res.end();
  }

  return { props: {} };
}


export default function WifiPanel() {
  const router = useRouter();
  const [mode, setMode] = useState<'loading' | 'locked' | 'receive' | 'send' | 'caesar'>('locked');
  const [question, setQuestion] = useState<string>('');
  const [password, setPassword] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [sendUnlocked, setSendUnlocked] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 404 and redirect logic
  useEffect(() => {
    if (!Cookies.get('Wifi Unlocked')) {
      router.replace('/404');
      return;
    }
    if (!Cookies.get('wifi passed')) {
      Cookies.set('wifi login', 'true');
      router.replace('/wifi-login');
      return;
    }
    setMode('locked');
  }, [router]);

  // Handle curl/wget clients
  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Browser only
  }, []);

  // Generate the encoded question
  const handleReceive = () => {
    // Encoded phrase example: Base64 of "What is 2+2?"
    const q = btoa('What is 2+2?');
    setQuestion(q);
    setMode('receive');
  };

  const handleUnlockSend = () => {
    if (password === KEYWORD_1) {
      setSendUnlocked(true);
      setMode('send');
      setErrorMsg(null);
    } else {
      setErrorMsg('Incorrect password');
    }
  };

  const handleSendAnswer = () => {
    if (userAnswer.trim() === '4') {
      setErrorMsg('Transmission error—apply Caesar cipher shift (+3)');
      setMode('caesar');
    } else {
      setErrorMsg('Wrong answer.');
    }
  };

  const handleCaesarSubmit = () => {
    const decoded = userAnswer
        .split('')
        .map((ch) => {
          if (/[a-z]/i.test(ch)) {
            const code = ch.charCodeAt(0);
            const base = code >= 97 ? 97 : 65;
            return String.fromCharCode(((code - base - 3 + 26) % 26) + base);
          }
          return ch;
        })
        .join('');
    if (decoded === '4') {
      Cookies.set('Media Unlocked', 'true');
      router.push('/Media');
    } else {
      setErrorMsg('Still incorrect after Caesar.');
    }
  };

  return (
      <div className={styles.container}>
        <h1>📶 Wi‑Fi Panel</h1>
        <div className={styles.buttons}>
          <button onClick={handleReceive} disabled={mode !== 'locked'}>
            Receive
          </button>
          <button
              onClick={() => password ? handleUnlockSend() : null}
              disabled={!password}
          >
            Send
          </button>
        </div>

        {mode === 'receive' && (
            <div className={styles.box}>
              <p><em>Encoded question:</em> <code>{question}</code></p>
              <p className={styles.hint} /* <== hint inside HTML comments in real code */>
                {/* Algorithm: Base64 decode this string */}
              </p>
              <input
                  type="text"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
              />
            </div>
        )}

        {mode === 'send' && sendUnlocked && (
            <div className={styles.box}>
              <p>🚀 Password accepted. Submit your answer:</p>
              <input
                  type="text"
                  placeholder="Your answer"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
              />
              <button onClick={handleSendAnswer}>Submit Answer</button>
            </div>
        )}

        {mode === 'caesar' && (
            <div className={styles.box}>
              <p>Caesar cipher step: shift your answer by +3</p>
              <input
                  type="text"
                  placeholder="Caesar-shifted answer"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
              />
              <button onClick={handleCaesarSubmit}>Finalize</button>
            </div>
        )}

        {errorMsg && <p className={styles.error}>{errorMsg}</p>}

        <p className={styles.footer}>Use curl or wget and check JSON response for special output.</p>
      </div>
  );
}
