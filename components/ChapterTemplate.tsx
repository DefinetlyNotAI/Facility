'use client';

import {useChapterAccess} from "@/hooks/BonusActHooks/useChapterAccess";
import {useFailed} from "@/hooks/BonusActHooks/useFailed";
import {chapter} from "@/lib/data/chapters";
import {ChapterTemplateProps} from "@/lib/types/chapters";
import {useEffect, useRef} from "react";

export default function ChapterTemplate({chapterId, chapterData, fileLink}: ChapterTemplateProps) {
    const {isCurrentlySolved} = useChapterAccess();
    const isAllFailed = useFailed(chapterId);

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const VioletLeafCount = 350;
        const VioletEmberCount = 200;
        const VioletLeafs: VioletLeaf[] = [];
        const VioletEmbers: VioletEmber[] = [];

        class VioletLeaf {
            x: number;
            height: number;
            amplitude: number;
            frequency: number;
            phase: number;
            swayOffset: number;

            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * width;
                this.height = 100 + Math.random() * 200;
                this.amplitude = 20 + Math.random() * 30;
                this.frequency = 0.02 + Math.random() * 0.04;
                this.phase = Math.random() * Math.PI * 2;
                this.swayOffset = Math.random() * Math.PI * 2;
            }

            draw(ctx: CanvasRenderingContext2D, time: number) {
                const yBase = height;
                ctx.beginPath();
                ctx.moveTo(this.x, yBase);

                const steps = 25;
                for (let i = 0; i <= steps; i++) {
                    const t = i / steps;
                    const y = yBase - t * this.height;
                    const sway = Math.sin(t * Math.PI * 2 + time * this.frequency + this.phase) * this.amplitude;
                    const curve = Math.sin(time * 0.01 + this.swayOffset) * 5;
                    ctx.lineTo(this.x + sway + curve, y);
                }

                const grad = ctx.createLinearGradient(this.x, yBase - this.height, this.x, yBase);
                grad.addColorStop(0, `rgba(138,43,226,0.9)`); // top: bright violet
                grad.addColorStop(0.3, `rgba(75,0,130,0.6)`);
                grad.addColorStop(0.7, `rgba(25,0,50,0.3)`);
                grad.addColorStop(1, `rgba(0,0,0,0)`);

                ctx.fillStyle = grad;
                ctx.fill();
            }
        }

        class VioletEmber {
            x: number;
            y: number;
            size: number;
            speedY: number;
            alpha: number;

            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * width;
                this.y = height + Math.random() * 100;
                this.size = 1 + Math.random() * 3;
                this.speedY = -0.2 - Math.random() * 0.5;
                this.alpha = 0.1 + Math.random() * 0.2;
            }

            draw(ctx: CanvasRenderingContext2D) {
                ctx.fillStyle = `rgba(138,43,226,${this.alpha})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();

                this.y += this.speedY;
                if (this.y < -10) this.reset();
            }
        }

        for (let i = 0; i < VioletLeafCount; i++) VioletLeafs.push(new VioletLeaf());
        for (let i = 0; i < VioletEmberCount; i++) VioletEmbers.push(new VioletEmber());

        let lastTime = performance.now();

        function animate(now: number) {
            const dt = now - lastTime;
            lastTime = now;

            ctx.clearRect(0, 0, width, height);

            // Dark shadowed overlay
            ctx.fillStyle = "rgba(0,0,0,0.25)";
            ctx.fillRect(0, 0, width, height);

            // Draw VioletLeafs
            for (const f of VioletLeafs) f.draw(ctx, now * 0.002);

            // Draw VioletEmbers
            for (const e of VioletEmbers) e.draw(ctx);

            requestAnimationFrame(animate);
        }

        animate(lastTime);

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const VioletCanvas = <canvas ref={canvasRef} className="absolute inset-0 z-0" />;

    if (isCurrentlySolved === null) {
        return (
            <div className="relative min-h-screen overflow-hidden">
                {VioletCanvas}
                <div className="flex items-center justify-center min-h-screen relative z-10">
                    <div className="text-white font-mono animate-pulse text-center">
                        {chapter.loading}
                        <span className="block text-red-800 text-xs mt-2 tracking-widest">
                            and the void watched back
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen overflow-hidden bg-black">
            {VioletCanvas}

            <div className="max-w-5xl mx-auto text-center relative z-10 p-8">
                <h1 className="text-white font-mono text-5xl font-bold mb-3 drop-shadow-[0_0_10px_#b91c1c]">
                    {chapterData.text.header}
                </h1>
                <p className="text-gray-400 font-mono text-sm italic">
                    {chapterData.text.subHeader}
                </p>
                <p className="text-gray-600 font-mono text-xs mt-2 tracking-widest">
                    “And lo, the voice spoke again from within the code -
                    ‘The script remembers what the scribe forgets.’”
                </p>

                <div className="flex justify-center mt-12">
                    <a
                        href={fileLink}
                        download
                        aria-label="Narrator download"
                        className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-red-800 via-black to-red-900 text-white font-mono rounded-md border border-red-900 shadow-lg hover:scale-105 hover:shadow-[0_0_15px_#991b1b] transform transition-all duration-300"
                    >
                        <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v14m7-7H5" />
                        </svg>
                        <span className="uppercase tracking-wide">
                            {chapter.narrator}
                        </span>
                    </a>
                </div>

                {!isCurrentlySolved && !isAllFailed && (
                    <div className="mt-16 text-center">
                        <p className="text-gray-500 font-mono text-sm max-w-lg mx-auto leading-relaxed">
                            {chapterData.text.questReminder}
                        </p>
                        <p className="text-red-800 font-mono text-xs mt-4 italic">
                            “He who seeks meaning among corrupted files
                            shall find only mirrors reflecting his own doubt.”
                        </p>
                    </div>
                )}

                {isAllFailed && (
                    <div className="mt-20 text-center animate-fadeIn">
                        <p className="text-red-700 font-mono text-2xl font-bold">
                            YOU HAVE FAILED ME.
                        </p>
                        <p className="text-gray-600 font-mono text-sm mt-2">
                            The narrator grows quiet. The story continues without you.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
