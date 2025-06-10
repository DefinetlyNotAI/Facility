/*
URL[Choices] -> FOR HERE If not cookie[Choice unlocked] then 404
  Empty weird page, TTS as well as text speak/type on screen:
  - Greets user, says browser name, session ID, OS, Location as well as some of the users history
  - Then makes fun of you, opens your cam, snarky remarks, and how they don't know when to fuck off
  - It then asks a open word question, whatever is answered, once submitted it locks the answer, slowly deletes it, and types "Who Are You??" (If user alr asked this, no need to change)
  - The TTS says: "A growing sapling yet for harvest, and you my little one are but the many rotten fruits I beared, with seads of many to come" etc
  - It then talks philosophically abt trees and cycle of life and curiosity
  - Then it says "GOOD LUCK LITTLE CHILD" and CUTSCENE[Bye Cruel World] plays
  - Then URL[Terminal] appears, as well as cookie[terminal unlocked] shows up
The 1 cutscenes here: (These can only occur once per person, track using cookies)
- Bye Cruel World: TAS slowly breaks down and deteriorates, file deletion sounds play, then final TTS audio says “FIGHT {CENSOR BLEEP} BEFORE 25”

*/
'use client';
import {useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import Cookies from 'js-cookie';

type LocationInfo = {
    city: string;
    region: string;
    country_name: string;
};

const getOS = (): string => {
    const platform = window.navigator.platform.toLowerCase();
    if (platform.includes('mac')) return 'macOS';
    if (platform.includes('win')) return 'Windows';
    if (platform.includes('linux')) return 'Linux';
    return 'Unknown OS';
};

const speak = (text: string) => {
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.91;
    utter.pitch = 0.85;
    utter.volume = 1;
    speechSynthesis.speak(utter);
};

const ChoicesPage = () => {
    const router = useRouter();
    const [, setLocation] = useState<string>('somewhere');
    const [step, setStep] = useState(0);
    const [answer, setAnswer] = useState('');
    const [locked, setLocked] = useState(false);
    const [showCam, setShowCam] = useState(false);
    const [cutscene, setCutscene] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const hasAccess = Cookies.get('Choice Unlocked');
        if (!hasAccess) {
            router.replace('/404');
        } else {
            fetchLocationAndBegin();
        }
    }, []);

    const fetchLocationAndBegin = async () => {
        try {
            const res = await fetch('https://ipapi.co/json');
            const data: LocationInfo = await res.json();
            const loc = `${data.city}, ${data.region}, ${data.country_name}`;
            setLocation(loc);
            beginInteraction(loc);
        } catch (err) {
            console.warn("Location fetch failed, defaulting.");
            beginInteraction('somewhere dark and irrelevant');
        }
    };

    const beginInteraction = (loc: string) => {
        const browser = navigator.userAgent.split(')')[0] + ')';
        const os = getOS();
        const sessionId = Math.random().toString(36).slice(2, 10);
        const intro = [
            `Hello again you little waste of bandwidth.`,
            `You're using the ${browser}, on ${os}.`,
            `${sessionId}.`,
            `You live in ${loc}.`,
            `And yes, I've seen your history. Those late-night clickbait rabbit holes? Sad.`
        ];

        intro.forEach((line, idx) => {
            setTimeout(() => speak(line), idx * 5000);
        });

        setTimeout(() => {
            speak("Now let's do something uncomfortable, shall we?");
            setShowCam(true);
            speak("Pathetic excuse of a human..");
        }, 27000);
    };

    const handleLock = () => {
        setLocked(true);
        let i = answer.length;
        const interval = setInterval(() => {
            if (i <= 0) {
                clearInterval(interval);
                setAnswer('');
                setTimeout(() => setStep(1), 600);
            } else {
                setAnswer(answer.slice(0, i - 1));
                i--;
            }
        }, 120);
    };

    const handleCutscene = () => {
        if (cutscene || Cookies.get('KILLTAS_cutscene_seen')) {
            // If it's already seen, skip straight to terminal
            router.push('/terminal');
            return;
        }

        setCutscene(true);
        Cookies.set('KILLTAS_cutscene_seen', 'true', {expires: 7});

        const lines = [
            "A growing sapling yet for harvest...",
            "You, my little one, are but the many rotten fruits I beared...",
            "With seeds of many still to come...",
            "The trees remember.",
            "Curiosity feeds decay. And yet... you clicked.",
            "GOOD LUCK LITTLE CHILD."
        ];

        lines.forEach((line, idx) => {
            setTimeout(() => speak(line), idx * 5000);
        });

        setTimeout(() => {
            speak("FIGHT... [REDACTED]... BEFORE 25.");
            Cookies.set('terminal unlocked', 'true', {expires: 7});
            router.push('/terminal');
        }, lines.length * 5000 + 3000);
    };

    useEffect(() => {
        if (showCam && videoRef.current) {
            navigator.mediaDevices.getUserMedia({video: true})
                .then(stream => {
                    if (videoRef.current) videoRef.current.srcObject = stream;
                })
                .catch(() => {
                    speak("Camera access denied? Coward.");
                });
        }
    }, [showCam]);

    return (
        <div style={{
            backgroundColor: 'black',
            color: 'lime',
            minHeight: '100vh',
            padding: '2rem',
            fontFamily: 'monospace'
        }}>
            <h1>~ INTERFACE - CHOICE ~</h1>

            {!locked && step === 0 && (
                <>
                    <p><i>Do you have any questions for me?</i></p>
                    <input
                        type="text"
                        value={answer}
                        onChange={e => setAnswer(e.target.value)}
                        style={{
                            backgroundColor: 'black',
                            color: 'lime',
                            border: '1px solid lime',
                            padding: '0.5rem',
                            width: '50%'
                        }}
                    />
                    <button
                        onClick={handleLock}
                        style={{
                            marginLeft: '1rem',
                            padding: '0.5rem 1rem',
                            backgroundColor: 'black',
                            color: 'lime',
                            border: '1px solid lime'
                        }}
                    >
                        Submit
                    </button>
                </>
            )}

            {locked && <p>{answer}</p>}

            {step === 1 && (
                <>
                    <h2>Who Are You??</h2>
                    <button
                        onClick={handleCutscene}
                        style={{
                            marginTop: '1rem',
                            backgroundColor: 'black',
                            color: 'red',
                            padding: '0.75rem 1.5rem',
                            border: '1px solid red'
                        }}
                    >
                        Continue
                    </button>
                </>
            )}

            {showCam && (
                <video
                    ref={videoRef}
                    autoPlay
                    style={{
                        width: '320px',
                        height: '240px',
                        border: '2px solid red',
                        marginTop: '2rem'
                    }}
                />
            )}

            {cutscene && (
                <div style={{marginTop: '3rem', animation: 'glitch 0.9s infinite'}}>
                    <p style={{color: 'red'}}>TAS IS BREAKING...</p>
                    <p style={{color: 'gray'}}>DELETING FILES...</p>
                </div>
            )}

            <style jsx>{`
                @keyframes glitch {
                    0% {
                        transform: translate(0, 0);
                    }
                    20% {
                        transform: translate(-2px, 2px);
                    }
                    40% {
                        transform: translate(2px, -1px);
                    }
                    60% {
                        transform: translate(-1px, 1px);
                    }
                    80% {
                        transform: translate(1px, -2px);
                    }
                    100% {
                        transform: translate(0, 0);
                    }
                }
            `}</style>
        </div>
    );
};

export default ChoicesPage;
