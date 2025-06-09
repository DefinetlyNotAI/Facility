"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const WINGDINGS_LOCKED = "✋︎⧫︎ ♓︎⬧︎ ■︎□︎⧫︎ ⧫︎♓︎❍︎♏︎";       // "It is not time"
const WINGDINGS_NOT_ALLOWED = "✋︎❍︎♓︎ ■︎⬧︎♏︎ ■︎⧫︎■︎♏︎ ■︎❍︎❍︎♏︎"; // "You don't belong here"

export default function Glitchy404() {
  const router = useRouter();
  const [showMoonlight, setShowMoonlight] = useState(false);

  // fixme Hardcode locked here since page prop is invalid
  const locked = true;

  useEffect(() => {
    if (Math.random() < 1 / 666) setShowMoonlight(true);
  }, []);

  useEffect(() => {
    if (showMoonlight) {
      router.push("/moonlight");
    }
  }, [showMoonlight, router]);

  const [glitch, setGlitch] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => setGlitch((g) => !g), 120);
    return () => clearInterval(interval);
  }, []);

  return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-8 font-mono select-none gap-16">
        <div className="bg-black text-green-400 p-8 rounded max-w-xl text-center">
          <h1 className="text-5xl font-bold mb-6">MOON LIGHT</h1>
          <p className="italic text-xl max-w-lg mx-auto">
            The veil blinks not lifts<br />
            So watch the renewal rhythm<br />
            As some truths exist between breaths<br />
            So what was not here, shall be<br />
            Only if you insist on dejavu
          </p>
          <p className="mt-12 text-sm text-gray-500">A riddle hidden in the void.</p>
        </div>

        <div>
          <div
              className={`text-green-400 text-4xl md:text-6xl text-center whitespace-pre-wrap ${
                  glitch ? "opacity-50" : "opacity-100"
              } transition-opacity duration-100`}
              style={{ userSelect: "none", fontFamily: "Wingdings, cursive, monospace" }}
          >
            {locked ? WINGDINGS_LOCKED : WINGDINGS_NOT_ALLOWED}
          </div>
          <div className="mt-8 text-green-500 text-sm md:text-base max-w-md text-center tracking-wide">
            {locked
                ? "The page is locked. It is not time."
                : "You don't belong here — You are stuck inside the walls."}
          </div>
        </div>
      </div>
  );
}
