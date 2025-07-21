import React, {useEffect, useRef, useState} from 'react';
import {FONTS} from '@/lib/data/tree98';
import {VesselBootDialogProps} from "@/lib/types/tree98";

const INITIAL_ERROR = "This is not the REAL you? I cannot connect yet, YOU don't have HIS permission.. or maybe YOUR own permission... Wait until the time is right.";

export const VesselBootDialog: React.FC<VesselBootDialogProps> = ({item}) => {
    const [showInitialError, setShowInitialError] = useState(true);
    const dialogRef = useRef<HTMLDivElement>(null);

    // Request fullscreen and disable mouse
    useEffect(() => {
        if (!showInitialError && dialogRef.current) {
            if (dialogRef.current.requestFullscreen) {
                dialogRef.current.requestFullscreen().catch(console.error);
            }
            // Disable mouse
            document.body.style.pointerEvents = 'none';
        }
        return () => {
            document.body.style.pointerEvents = '';
        };
    }, [showInitialError]);

    // Dramatic text animation (typewriter)
    const [displayedText, setDisplayedText] = useState('');
    useEffect(() => {
        if (!showInitialError) {
            let i = 0;
            const text = item.content || '';
            const interval = setInterval(() => {
                setDisplayedText(text.slice(0, i));
                i++;
                if (i > text.length) {
                    clearInterval(interval);
                    if (dialogRef.current && document.fullscreenElement) {
                        document.exitFullscreen?.().catch(console.error);
                    }
                }
            }, 18);
            return () => clearInterval(interval);
        }
    }, [showInitialError, item.content]);

    return (
        <div ref={dialogRef}
             className={`fixed inset-0 z-[9999] bg-black text-green-400 flex items-center justify-center`}
             style={{fontFamily: FONTS.MONO, fontSize: '13px'}}>
            {showInitialError ? (
                <div className="bg-gray-900 border-2 border-red-400 p-8 rounded shadow-lg text-center animate-pulse"
                     style={{maxWidth: 400}}>
                    <div className="mb-4 text-red-400 font-bold">System Error</div>
                    <div className="mb-6 text-white text-sm whitespace-pre-line">{INITIAL_ERROR}</div>
                    <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            onClick={() => setShowInitialError(false)}>
                        OK
                    </button>
                </div>
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center">
                    <div className="w-full h-full overflow-auto animate-pulse">
                        <pre className="whitespace-pre-wrap">{displayedText}</pre>
                    </div>
                    <div className="mt-4 text-red-400 animate-pulse text-center">
                        [SYSTEM CORRUPTION INITIATED]
                    </div>
                </div>
            )}
        </div>
    );
};
