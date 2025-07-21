// noinspection CssUnusedSymbol

"use client";

import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import Cookies from "js-cookie";
import {signCookie} from "@/lib/utils";
import {script} from "@/lib/data/oArvoreDaCarne";
import {ScriptItem} from "@/lib/types/oArvoreDaCarne";
import {cookies, routes} from "@/lib/saveData";


export default function CarnePlay() {
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    useEffect(() => {
        if (Cookies.get(cookies.tree)) {
            router.replace(routes.home);
        }
    }, [router]);

    const handleClick = async () => {
        if (currentIndex < script.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            await signCookie(`${cookies.tree}=BLASPHEMY`);
            router.replace(routes.home);
        }
    };

    const step: ScriptItem = script[currentIndex];
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
