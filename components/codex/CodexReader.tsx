import {useEffect, useRef, useState} from 'react';
import {Eye, Play} from 'lucide-react';
import styles from '../../styles/Codex.module.css';
import {CodexReaderProps} from "@/lib/types/codex";




// TODO Fix this popup to be above the text itself, as well as be cleaner and a dict where each can have custom info, of which defaults to normal
const Special_Keywords: string[] = ['Whispers', 'Fletchling', 'Dithed', 'Nullskin', 'Echoes', 'TR33', 'TAS', 'Entity', 'Vessel'];

export default function CodexReader({
                                        chapterText,
                                        onComplete,
                                        autoReveal = false,
                                        revealSpeed = 2000
                                    }: CodexReaderProps) {
    const [lines, setLines] = useState<string[]>([]);
    const [revealedLines, setRevealedLines] = useState<number>(0);
    const [currentLineText, setCurrentLineText] = useState<string>('');
    const [isTyping, setIsTyping] = useState(false);
    const [hoveredKeyword, setHoveredKeyword] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const autoRevealTimerRef = useRef<NodeJS.Timeout | null>(null);
    const typewriterTimerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const textLines = chapterText.split('\n').filter(line => line.trim() !== '');
        setLines(textLines);
        setRevealedLines(0);
        setCurrentLineText('');
        setIsTyping(false);
    }, [chapterText]);

    useEffect(() => {
        if (autoReveal && revealedLines < lines.length) {
            autoRevealTimerRef.current = setTimeout(() => {
                setRevealedLines(prev => {
                    const next = prev + 1;
                    if (next >= lines.length && onComplete) {
                        onComplete();
                    }
                    return next;
                });
            }, revealSpeed);
        }

        return () => {
            if (autoRevealTimerRef.current) {
                clearTimeout(autoRevealTimerRef.current);
            }
        };
    }, [autoReveal, revealedLines, lines.length, revealSpeed, onComplete]);

    useEffect(() => {
        if (containerRef.current) {
            const lastLine = containerRef.current.querySelector(`[data-line="${revealedLines - 1}"]`);
            if (lastLine) {
                lastLine.scrollIntoView({behavior: 'smooth', block: 'center'});
            }
        }
    }, [revealedLines]);

    const startTypewriter = () => {
        if (isTyping) return;

        setIsTyping(true);
        setRevealedLines(0);
        setCurrentLineText('');

        let currentLineIndex = 0;
        let charIndex = 0;

        const typeNextChar = () => {
            if (currentLineIndex >= lines.length) {
                setIsTyping(false);
                if (onComplete) {
                    onComplete();
                }
                return;
            }

            const currentLine = lines[currentLineIndex];

            if (charIndex < currentLine.length) {
                setCurrentLineText(currentLine.substring(0, charIndex + 1));
                charIndex++;
                typewriterTimerRef.current = setTimeout(typeNextChar, 20);
            } else {
                setRevealedLines(currentLineIndex + 1);
                setCurrentLineText('');
                currentLineIndex++;
                charIndex = 0;

                const delay = currentLineIndex < lines.length ? 300 : 0;
                typewriterTimerRef.current = setTimeout(typeNextChar, delay);
            }
        };

        typeNextChar();
    };

    useEffect(() => {
        return () => {
            if (typewriterTimerRef.current) {
                clearTimeout(typewriterTimerRef.current);
            }
        };
    }, []);

    const revealAll = () => {
        if (typewriterTimerRef.current) {
            clearTimeout(typewriterTimerRef.current);
        }
        setIsTyping(false);
        setCurrentLineText('');
        setRevealedLines(lines.length);
        if (onComplete) {
            onComplete();
        }
    };

    const highlightKeywords = (text: string) => {
        let result = text;
        Special_Keywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
            result = result.replace(regex, match => `<span class="${styles.keyword}" data-keyword="${match}">${match}</span>`);
        });
        return result;
    };

    const handleMouseEnter = (keyword: string) => {
        setHoveredKeyword(keyword);
    };

    const handleMouseLeave = () => {
        setHoveredKeyword(null);
    };

    return (
        <div className="relative w-full max-w-4xl mx-auto">
            {!isTyping && revealedLines < lines.length && (
                <div className="flex flex-col sm:flex-row justify-center gap-3 mb-8 px-4">
                    <button
                        onClick={startTypewriter}
                        className="px-6 py-3 bg-black/40 border border-amber-900/40 rounded hover:bg-amber-950/40 transition-all duration-300 flex items-center justify-center gap-2 text-amber-100"
                    >
                        <Play className="w-4 h-4"/>
                        <span>Start Play</span>
                    </button>
                    <button
                        onClick={revealAll}
                        className="px-6 py-3 bg-black/40 border border-amber-900/40 rounded hover:bg-amber-950/40 transition-all duration-300 flex items-center justify-center gap-2 text-amber-100"
                    >
                        <Eye className="w-4 h-4"/>
                        <span>Reveal All</span>
                    </button>
                </div>
            )}

            <div
                ref={containerRef}
                className={`${styles.codexText} ${styles.scrollbarThin} space-y-6 min-h-[60vh] max-h-[70vh] overflow-y-auto px-4 sm:px-8 py-12`}
            >
                {lines.map((line, index) => {
                    const isRevealed = index < revealedLines;
                    const isCurrentlyTyping = index === revealedLines && isTyping;
                    const isTitle = index === 0 || line.startsWith('Chapter');
                    const displayText = isCurrentlyTyping ? currentLineText : line;

                    if (!isRevealed && !isCurrentlyTyping) return null;

                    return (
                        <div
                            key={index}
                            data-line={index}
                            className={`${styles.codexLine} transition-all duration-1000 ${
                                isRevealed || isCurrentlyTyping ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                            } ${isTitle ? 'text-center text-xl sm:text-2xl font-bold mb-8 text-amber-200' : 'text-base sm:text-lg leading-relaxed'}`}
                            dangerouslySetInnerHTML={{__html: highlightKeywords(displayText)}}
                            onMouseOver={(e) => {
                                const target = e.target as HTMLElement;
                                if (target.classList.contains(styles.keyword)) {
                                    handleMouseEnter(target.getAttribute('data-keyword') || '');
                                }
                            }}
                            onMouseOut={(e) => {
                                const target = e.target as HTMLElement;
                                if (target.classList.contains(styles.keyword)) {
                                    handleMouseLeave();
                                }
                            }}
                        />
                    );
                })}
            </div>

            {hoveredKeyword && (
                <div
                    className={`${styles.animateFadeIn} fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-black/90 border border-amber-900/60 rounded-lg px-4 sm:px-6 py-3 text-amber-100 text-xs sm:text-sm backdrop-blur-sm z-40 max-w-[90vw]`}>
                    <span className="text-amber-400 font-semibold">{hoveredKeyword}</span> — A key term in the Codex
                </div>
            )}
        </div>
    );
}
