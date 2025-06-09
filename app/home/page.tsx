'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import styles from '../../styles/WifiPanel.module.css';

const binaryStr = "01010111 01101000 01101001 01110011 01110000 01100101 01110010 01110011";
const hexCode = "0x31353a3235"; // 15:25

// Decode binary string to base64 (client-only)
const decodeBase64 = (bin: string) => {
  const byteStr = bin
      .split(' ')
      .map(b => String.fromCharCode(parseInt(b, 2)))
      .join('');
  return btoa(byteStr);
};

const Home = () => {
  const router = useRouter();

  // Init with stable defaults to avoid SSR/client mismatch
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [countdown, setCountdown] = useState(null as number | null);
  const [voiceTriggered, setVoiceTriggered] = useState(false);
  const [decoded, setDecoded] = useState('');

  const modalRef = useRef<HTMLDivElement>(null);

  // Run only on client - redirections & modal logic
  useEffect(() => {
    if (Cookies.get('Corrupt')) {
      router.replace('/h0m3');
      return;
    }

    if (Cookies.get('No Corrupt')) {
      setModalMessage('You’re safe... Proceed to the Scroll.');
      setShowModal(true);
      Cookies.set('Scroll unlocked', 'true');
    }

    // Start countdown on client only, random 5-10 sec
    setCountdown(Math.floor(Math.random() * 6) + 5);
  }, [router]);

  // Countdown logic, fires speech synthesis once countdown ends
  useEffect(() => {
    if (countdown === null || countdown <= 0 || voiceTriggered) return;

    const timer = setInterval(() => {
      setCountdown(c => {
        if (c === null) return null;
        if (c <= 1) {
          if (!voiceTriggered) {
            const utterance = new SpeechSynthesisUtterance("No matter, Time doesn't exist here");
            speechSynthesis.speak(utterance);
            setVoiceTriggered(true);
          }
          clearInterval(timer);
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, voiceTriggered]);

  // Decode binary on hover (client-only)
  const handleHover = () => {
    try {
      // decodeBase64 returns base64, decode it back to string here
      const base64 = decodeBase64(binaryStr);
      const decodedStr = atob(base64);
      setDecoded(decodedStr);
    } catch {
      setDecoded('Error decoding');
    }
  };

  // Check system time and unlock Wifi Panel
  useEffect(() => {
    const checkTime = () => {
      const current = new Date();
      const timeNow = `${String(current.getHours()).padStart(2, '0')}:${String(current.getMinutes()).padStart(2, '0')}`;
      if (timeNow === '15:25') {
        Cookies.set('Wifi Unlocked', 'true');
        setModalMessage('Wifi Panel unlocked. Use curl/wget there.');
        setShowModal(true);
        setTimeout(() => router.push('/WifiPanel'), 3000);
      }
    };

    checkTime();
    const interval = setInterval(checkTime, 60000); // check every minute just in case

    return () => clearInterval(interval);
  }, [router]);

  // KONAMI code detection to set corruption cookie & reload
  useEffect(() => {
    const sequence = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    let index = 0;
    const handler = (e: KeyboardEvent) => {
      if (e.key === sequence[index]) {
        index++;
        if (index === sequence.length) {
          if (Cookies.get('Files unlocked')) {
            Cookies.set('Corrupt', 'true');
            setModalMessage('You messed up. Corruption spreading...');
            setShowModal(true);
            setTimeout(() => window.location.reload(), 3000);
          }
          index = 0; // reset after complete
        }
      } else {
        index = 0;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
      <div className={styles.container}>
        <h1>Welcome to Facility 05-B</h1>
        <p className={styles.labText}>
          Subject testing initialized. Standby for results.
          <span onMouseEnter={handleHover} className={styles.hoverText}> [data ███]</span>
        </p>

        {decoded && (
            <div className={styles.reveal}>
              Binary reveals: <strong>{decoded}</strong>
            </div>
        )}

        <div className={styles.hexTime}>
          Random HEX: <code>{hexCode}</code>
        </div>

        <div className={styles.countdown}>
          Countdown: {countdown === null ? 'Loading...' : countdown}
        </div>

        {showModal && (
            <div className={styles.modal} ref={modalRef}>
              <div className={styles.modalContent}>
                <p>{modalMessage}</p>
                <button onClick={() => setShowModal(false)}>OK</button>
              </div>
            </div>
        )}
      </div>
  );
};

export default Home;
