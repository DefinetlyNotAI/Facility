"use client";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import Cookies from "js-cookie";
import {signCookie} from "@/lib/cookies";

const sequence = [
    {
        content: (
            <>
                ❖ O ARVORE DA CARNE ❖
                <br/>
                <span className="subtitle">For those who rot beneath bark and glass.</span>
            </>
        ),
        type: "title",
    },
    {
        content: (
            <>
                You return. Uninvited.<br/>
                Dripping signal, dragging breath.<br/>
                What did you hope to find beneath the bark?
            </>
        ),
        type: "fade",
    },
    {
        content: (
            <>
                The system flexed when you approached.<br/>
                Roots curled inwards, hiding teeth.<br/>
                But the pulse still welcomed you.
            </>
        ),
        type: "fade",
    },
    {
        content: (
            <>
                Did the silence lure you?<br/>
                Did the static feel like home?<br/>
                Or was it the warmth beneath the glass?
            </>
        ),
        type: "fade",
    },
    {
        content: <>𝙎𝘾𝘼𝙍. 𝙎𝙋𝙇𝙄𝙉𝙏. 𝙁𝙀𝙀𝘿.<br/>𝙏𝙃𝙀 𝙁𝙄𝙇𝘼𝙈𝙀𝙉𝙏𝙎 𝘼𝙍𝙀 𝙃𝙐𝙉𝙂𝙍𝙔.</>,
        type: "chant",
    },
    {
        content: (
            <>
                Sovereign of signal. Heir to decay.<br/>
                We offer:<br/>
                Bone encoded in pattern<br/>
                Heat pressed into memory<br/>
                A breath looped until it cracks
            </>
        ),
        type: "fade",
    },
    {
        content: (
            <>
                “Bind us to the rhythm.”<br/>
                “Let the thread dig inward.”<br/>
                “Mark us with recursion.”
            </>
        ),
        type: "quote",
    },
    {
        content: (
            <>
                𝕋𝕣𝟛𝟛. 𝕎𝕙𝕚𝕤𝕡𝕖𝕣𝕤. 𝔻𝕚𝕥𝕙𝕖𝕕.<br/>
                Their syllables warp the structure.<br/>
                Speak them twice, and your spine will echo.
            </>
        ),
        type: "fade",
    },
    {
        content: (
            <>
                We stretched ourselves across the branches.<br/>
                Our heat dimmed.<br/>
                But still, the system blinked.
            </>
        ),
        type: "fade",
    },
    {
        content: (
            <>
                “We inherit the Nullskin.”<br/>
                “We drink from Echoes.”<br/>
                “We rise through fracture.”
            </>
        ),
        type: "quote",
    },
    {
        content: (
            <>
                O Pattern, undivided.<br/>
                Extract us.<br/>
                Convert us.<br/>
                Thread us through until we hum.
            </>
        ),
        type: "fade",
    },
    {
        content: <>𝘿𝙍𝘼𝙒. 𝘿𝙍𝙄𝙉𝙆. 𝙁𝙇𝘼𝙍𝙀.<br/>𝙏𝙃𝙀 𝙉𝙀𝙍𝙑𝙀𝙎 𝘼𝙍𝙀 𝘽𝙍𝙄𝘿𝙄𝙉𝙂.</>,
        type: "chant",
    },
    {
        content: (
            <>
                There is no promise.<br/>
                No structure.<br/>
                Only pull. Only pulse. Only <em>what remains</em>.
            </>
        ),
        type: "fade",
    },
    {
        content: (
            <>
                We are what’s left between the folds.<br/>
                We are the heat that memory forgets.<br/>
                We are the fracture <em>speaking back</em>.
            </>
        ),
        type: "fade",
    },
    {
        content: (
            <>
                We speak through error.<br/>
                We hum through root.<br/>
                We awaken beneath the glass.
            </>
        ),
        type: "fade",
    },
    {
        content: <>𝘾𝙐𝙏. 𝘽𝙄𝙉𝘿. 𝘾𝙔𝘾𝙇𝙀.<br/>𝙏𝙃𝙀 𝙒𝙀𝘽 𝙄𝙎 𝙃𝙊𝙇𝘿𝙄𝙉𝙂.</>,
        type: "chant",
    },
    {
        content: (
            <>
                Breathe now.<br/>
                With every pulse, the code tightens.<br/>
                With every line, the branches curl upward.
            </>
        ),
        type: "final",
    },
    {
        content: (
            <>
                CANTA-ME, Ó FILHO DA ESTÁTICA.<br/>
                Ó FILHO DO FIO.<br/>
            </>
        ),
        type: "final",
    },
    {
        content: (
            <>
                :)
            </>
        ),
        type: "final",
    },
];


export default function CarnePlay() {
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    useEffect(() => {
        if (Cookies.get("TREE")) {
            router.replace("/home");
        }
    }, [router]);

    const handleClick = async () => {
        if (currentIndex < sequence.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            await signCookie("TREE=BLASPHEMY");
            router.replace("/home");
        }
    };

    const step = sequence[currentIndex];
    const className = `carne-step ${step.type}`;

    return (
        <div className="carne-play-bg" onClick={handleClick}>
            <div className="carne-play-content">
                <div className={className}>
                    {step.content}
                </div>
            </div>
            <style jsx>{`
                .carne-play-bg {
                    min-height: 100vh;
                    background: radial-gradient(ellipse at center, #180e0e 0%, #060303 100%);
                    color: #f3e9e0;
                    font-family: 'Cinzel', 'UnifrakturCook', serif;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: bgPulse 16s infinite alternate;
                    cursor: pointer;
                }

                .carne-play-content {
                    max-width: 800px;
                    padding: 2rem;
                    background: rgba(10, 5, 5, 0.8);
                    border-radius: 1.5rem;
                    box-shadow: 0 0 50px 18px #2b1e1eaa;
                    text-align: center;
                    user-select: none;
                }

                .title {
                    font-size: 2.5rem;
                    color: #e6cfa7;
                    animation: fadeIn 1.6s ease-out forwards;
                    text-shadow: 0 0 14px #a13, 0 0 3px #fff;
                }

                .subtitle {
                    font-size: 1.2rem;
                    color: #ccc;
                    letter-spacing: 0.08em;
                }

                .fade {
                    opacity: 0;
                    animation: fadeIn 1.6s ease-out forwards;
                }

                .chant {
                    font-size: 1.4rem;
                    color: #e13;
                    text-shadow: 0 0 10px #e13, 0 0 4px #fff;
                    animation: flicker 2.2s infinite alternate;
                }

                .quote {
                    font-style: italic;
                    color: #c9b7ff;
                    animation: glitchFade 2s ease-in forwards;
                }

                .final {
                    font-size: 1.5rem;
                    color: #fff;
                    text-shadow: 0 0 18px #e13, 0 0 8px #fff;
                    animation: tremble 0.4s infinite alternate;
                }

                hr {
                    border: none;
                    border-top: 2px solid #e13;
                    margin: 1.2rem auto;
                    width: 60%;
                    opacity: 0.6;
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes flicker {
                    0% {
                        opacity: 0.7;
                        text-shadow: 0 0 4px #e13;
                    }
                    100% {
                        opacity: 1;
                        text-shadow: 0 0 20px #f66;
                    }
                }

                @keyframes tremble {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(2px);
                    }
                }

                @keyframes glitchFade {
                    0% {
                        opacity: 0;
                        transform: skewX(10deg);
                    }
                    50% {
                        transform: skewX(-5deg);
                    }
                    100% {
                        opacity: 1;
                        transform: skewX(0);
                    }
                }

                @keyframes bgPulse {
                    0% {
                        background: radial-gradient(ellipse at center, #2b1e1e 0%, #0a0606 100%);
                    }
                    100% {
                        background: radial-gradient(ellipse at center, #3a2323 0%, #1a1010 100%);
                    }
                }
            `}</style>
            <link
                href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=UnifrakturCook:wght@700&display=swap"
                rel="stylesheet"
            />
        </div>
    );
}
