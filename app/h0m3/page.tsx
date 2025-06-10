/*
URL[h0m3] -> FOR HERE If not cookie[Corrupt] and not cookie[corrupting] or cookie[No corruption] then redirect to URL[Home], FOR ALL If cookie[corrupting] redirect here
  A blank screen with a hidden button when clicked, create cookie[corrupting] then shows the exact replica of URL[Home] with changes:
  - LATIN AUDIO BACKGROUND SAYING RUN STOP ESCAPE
  - Every minute, static noise plays with flashes of smiley faces as well as trees, and of course text being "YOU SHOULDNT BE HERE {SESSION ID}"
  - Letters replacement of common letters to number/symbol counterparts: "o" -> "0" or "a" -> "@"
  - All text is changed to 1st person in a creepy way
  - The binary that existed is replaced with bin text saying "Last time thou hesitated, it found thine"
  - The hex that was a time is changed to the time 66:66 in HEX
  - If user reaches the bottom of the site, the site just repeats again but making it more blurry
  - After 4-5 scrolls of blurriness, a button says RESET appears, and above it in different languages for each word it says: WHY DO THIS (Japanese, Arabic etc)
  If button is clicked, remove both cookie[Corrupt] and cookie[corrupting] and creates cookie[No corruption] and redirects to URL[Home]
*/

'use client';

import {useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import Cookies from 'js-cookie';
import styles from '../../styles/extra.module.css';

const binaryCorruptText = "Last time thou hesitated, it found thine";
const hexCorruptText = "0x6666";

const sessionIdGenerator = () =>
    `SID-${Math.random().toString(36).substr(2, 9)}`;

const letterReplace = (text: string) =>
    text
        .replace(/o/gi, '0')
        .replace(/a/gi, '@')
        .replace(/i/gi, '1')
        .replace(/e/gi, '3')
        .replace(/s/gi, '$')
        .replace(/\bI\b/gi, 'we') // crude first person replacement example
        .replace(/\bmy\b/gi, 'our')
        .replace(/\bme\b/gi, 'us')
        .replace(/\bmine\b/gi, 'ours')
        .replace(/\bam\b/gi, 'are');

export default function H0m3() {
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);

    const [mode, setMode] = useState<'initial' | 'glitch'>('initial');
    const [scrollCount, setScrollCount] = useState(0);
    const [sessionId] = useState(sessionIdGenerator());

    // Redirect and cookie check logic
    useEffect(() => {
        const corrupt = Cookies.get('Corrupt');
        const corrupting = Cookies.get('corrupting');
        const noCorrupt = Cookies.get('No corruption');

        if ((!corrupt && !corrupting) || noCorrupt) {
            router.replace('/');
            return;
        }
        if (corrupting) {
            setMode('glitch');

            // Static flash and smiley faces every minute
            const staticInterval = setInterval(() => {
                if (!containerRef.current) return;
                containerRef.current.classList.add(styles.flash);
                setTimeout(() => containerRef.current?.classList.remove(styles.flash), 200);

                // Play static noise audio (make sure to add your file)
                const audio = new Audio('/media/static_noise.mp3');
                audio.play().catch(() => {
                });
            }, 60_000);

            return () => clearInterval(staticInterval);
        }
    }, [router]);

    // Scroll counter to track blurring + reset button
    useEffect(() => {
        const onScroll = () => {
            setScrollCount(c => Math.min(c + 1, 10));
        };
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Blank page with hidden button
    if (mode === 'initial') {
        return (
            <div className={styles.blank}>
                <button
                    className={styles.hiddenButton}
                    aria-label="Hidden corrupt button"
                    onClick={() => {
                        Cookies.set('corrupting', 'true');
                        router.replace('/h0m3');
                    }}
                >
                    .
                </button>
            </div>
        );
    }

    // Glitch mode — render corrupted Home
    return (
        <div
            ref={containerRef}
            className={styles.glitchContainer}
            style={{filter: `blur(${Math.min(scrollCount * 2, 20)}px)`}}
        >
            {/* Background Latin audio */}
            <audio autoPlay loop>
                <source src="/media/latin_run_stop_escape.mp3" type="audio/mpeg"/>
                {/* Fallback text */}
                Your browser does not support the audio element.
            </audio>

            <main className={styles.content}>
                <h1>{letterReplace("Welcome t0 Facility 05-B")}</h1>

                <p>
                    {letterReplace(
                        "I am testing subject myself. Standby for results."
                    )}
                </p>

                {/* Binary replaced */}
                <p className={styles.binaryText}>
                    {binaryCorruptText}
                </p>

                {/* Hex replaced */}
                <p className={styles.hexText}>
                    {hexCorruptText}
                </p>

                {/* Session ID and creepy text */}
                <p className={styles.sessionText}>
                    {letterReplace(`Y0U SH0ULDNT BE HERE ${sessionId}`)}
                </p>
            </main>

            {/* Reset button after 4-5 scrolls */}
            {scrollCount >= 5 && (
                <section className={styles.resetSection}>
                    <p className={styles.polyglotText}>
                        WHY DO THIS • なぜこれを • لماذا تفعل هذا • Pourquoi faire cela
                    </p>
                    <button
                        className={styles.resetButton}
                        onClick={() => {
                            Cookies.remove('Corrupt');
                            Cookies.remove('corrupting');
                            Cookies.set('No corruption', 'true');
                            router.replace('/');
                        }}
                    >
                        RESET
                    </button>
                </section>
            )}
        </div>
    );
}
