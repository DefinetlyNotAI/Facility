'use client';

import {useEffect, useRef, useState} from 'react';
import {TerminalVN} from '@/components/V&X/terminalVN';
import {BACKGROUND_AUDIO, usePlayBackgroundAudio} from "@/audio";

export default function AStoryPage() {
    const [script, setScript] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [variables, setVariables] = useState<Record<string, any>>({});
    const audioRef = useRef<HTMLAudioElement>(null);

    usePlayBackgroundAudio(audioRef, BACKGROUND_AUDIO.BONUS.V);

    useEffect(() => {
        // Load the VN script
        fetch('/static/chapters/V/aStory.vns')
            .then(res => res.text())
            .then(text => {
                setScript(text);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to load story:', err);
                setScript(`@node start
> System: Error loading story. Please refresh the page.
@jump end

@node end
> System: [Error]
`);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        // Update tab title based on variables
        if (variables.tabTitle) {
            document.title = variables.tabTitle;
        }
    }, [variables]);

    if (loading) {
        return (
            <div style={{
                width: '100vw',
                height: '100vh',
                background: '#0a0a0a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#00ff00',
                fontFamily: 'monospace',
                fontSize: '18px'
            }}>
                <div>
                    <div style={{textAlign: 'center', marginBottom: '20px'}}>
                        Loading The Narrator's Tale...
                    </div>
                    <div style={{textAlign: 'center', animation: 'pulse 2s ease-in-out infinite'}}>
                        ▊
                    </div>
                </div>
                <style jsx>{`
                    @keyframes pulse {
                        0%, 100% {
                            opacity: 1;
                        }
                        50% {
                            opacity: 0.3;
                        }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <>
            <audio ref={audioRef} src={BACKGROUND_AUDIO.BONUS.V} loop preload="auto" style={{display: 'none'}}/>
            <div style={{
                width: '100vw',
                height: '100vh',
                background: '#0a0a0a',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
            }}>
                <div style={{
                    flex: 1,
                    padding: '20px',
                    maxWidth: '1000px',
                    margin: '0 auto',
                    width: '100%'
                }}>
                    <TerminalVN
                        script={script}
                        onComplete={() => {
                            console.log('Story complete');
                        }}
                        onVariableChange={(vars) => {
                            setVariables(vars);
                        }}
                        initialVariables={{
                            playerAwareness: 0,
                            secretsFound: 0,
                            tabTitle: 'To Those Who End Well'
                        }}
                        typingSpeed={25}/>
                </div>

                {/* Debug panel (optional - can be hidden in production) */}
                {process.env.NODE_ENV === 'development' && Object.keys(variables).length > 0 && (
                    <div style={{
                        position: 'fixed',
                        bottom: 0,
                        right: 0,
                        background: 'rgba(0, 0, 0, 0.9)',
                        border: '1px solid #333',
                        padding: '10px',
                        fontSize: '12px',
                        color: '#00ff00',
                        fontFamily: 'monospace',
                        maxWidth: '300px',
                        maxHeight: '200px',
                        overflow: 'auto'
                    }}>
                        <div style={{fontWeight: 'bold', marginBottom: '5px'}}>Debug Variables:</div>
                        <pre style={{margin: 0}}>{JSON.stringify(variables, null, 2)}</pre>
                    </div>
                )}
            </div>
        </>
    );
}

