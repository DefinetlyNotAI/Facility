import React, {useEffect, useState} from "react";
import {signCookie} from "@/lib/cookies";
import styles from "../../styles/Choices.module.css";
import {CUTSCENE_AUDIO, CUTSCENE_LINES, useTypewriter} from "@/app/choices/DataConstants";

function renderMsg(msg: string) {
    const parts = msg.split("/n");
    return parts.map((part, idx) =>
        idx === 0 ? part : [<br key={idx}/>, part]
    );
}

interface TASGoodByeProps {
    onDone: () => void;
}

const TASGoodBye: React.FC<TASGoodByeProps> = ({onDone}) => {
    const [step, setStep] = useState(0);
    const [done, setDone] = useState(false);
    const display = useTypewriter(CUTSCENE_LINES[step] || "", 26);

    useEffect(() => {
        (async () => {
            await signCookie("KILLTAS_cutscene_seen=true");
        })();
    }, []);

    useEffect(() => {
        let cancelled = false;
        let audio: HTMLAudioElement | null = null;
        let timeout: NodeJS.Timeout;

        function playNext() {
            if (cancelled) return;
            if (step >= CUTSCENE_LINES.length) {
                setDone(true);
                setTimeout(() => {
                    onDone();
                }, 2200);
                return;
            }
            // Play audio for certain steps
            if (audio) {
                audio.pause();
                audio = null;
            }
            if (step === 1) {
                audio = new Audio(CUTSCENE_AUDIO[0]); // heartbeat
                audio.volume = 1.0; // Louder heartbeat
                audio.play().catch(console.error);
            }
            if (step === 4 || step === 5 || step === 9) {
                audio = new Audio(CUTSCENE_AUDIO[1]); // file delete
                audio.volume = 0.95;
                audio.play().catch(console.error);
            }
            if (step === 8 || step === 10) {
                audio = new Audio(CUTSCENE_AUDIO[2]); // censorship bleep
                audio.volume = 1.0;
                audio.play().catch(console.error);
            }
            if (step === 11 || step === 12) {
                audio = new Audio(CUTSCENE_AUDIO[3]); // static
                audio.volume = 1.0;
                audio.play().catch(console.error);
            }
            timeout = setTimeout(() => {
                setStep((s) => s + 1);
            }, step === CUTSCENE_LINES.length - 1 ? 3200 : 1800);
        }

        playNext();

        return () => {
            cancelled = true;
            if (audio) audio.pause();
            clearTimeout(timeout);
        };
        // eslint-disable-next-line
    }, [step, onDone]);

    return (
        <div className={styles["cutscene-overlay"]}>
            <div className={styles["cutscene-typewriter"]}>
                <span>
                    {renderMsg(display)}
                </span>
                {done && (
                    <div className={styles["cutscene-finale"]}>
                        <b>REMEMBER ME IN THE STATIC.</b>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TASGoodBye;
