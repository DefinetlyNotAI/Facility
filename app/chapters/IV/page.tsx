'use client';

import {useEffect, useRef, useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {Card, CardContent, CardHeader} from '@/components/ui/card';
import {chapter, fileLinks} from "@/lib/data/chapters";
import {chapterIVPublic as chapterIVData} from '@/lib/data/chapters.public';
import {AllowedPlaqueStatus} from "@/lib/types/api";

import {useChapterAccess} from "@/hooks/BonusActHooks/useChapterAccess";
import {useFailed} from "@/hooks/BonusActHooks/useFailed";
import {useBackgroundAudio} from "@/hooks/useBackgroundAudio";
import {BACKGROUND_AUDIO} from "@/lib/data/audio";
import {routes} from '@/lib/saveData';

// JSON cookie helpers to store merged plaque progress
function getJsonCookie(name: string): any | null {
    try {
        const match = document.cookie.split(';').map(s => s.trim()).find(c => c.startsWith(name + '='));
        if (!match) return null;
        const value = decodeURIComponent(match.split('=')[1] || '');
        return JSON.parse(value);
    } catch (e) {
        return null;
    }
}

function setJsonCookie(name: string, obj: any, days = 365) {
    try {
        const value = encodeURIComponent(JSON.stringify(obj));
        const d = new Date();
        d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${value}; path=/; expires=${d.toUTCString()}; SameSite=Lax`;
    } catch (e) {
        // ignore cookie errors
    }
}

export default function ChapterIVPage() {
    const {isCurrentlySolved} = useChapterAccess();
    const [plaqueStatuses, setPlaqueStatuses] = useState<any[]>([]);
    const [questStatus] = useState<AllowedPlaqueStatus>('active');
    const audioRef = useRef<HTMLAudioElement>(null);

    useBackgroundAudio(audioRef, BACKGROUND_AUDIO.BONUS.IV);
    const isAllFailed = useFailed("IV");

    const router = useRouter();
    const [inputs, setInputs] = useState<Record<string, string>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loadingIds, setLoadingIds] = useState<Record<string, boolean>>({});

    const fetchPlaqueStatuses = async () => {
        try {
            const res = await fetch(routes.api.chapters.iv.status);
            const json = await res.json();
            setPlaqueStatuses(json.plaqueStatuses || []);
        } catch (e) {
            // ignore
        }
    }

    useEffect(() => {
        fetchPlaqueStatuses().catch(console.error);
    }, []);

    const isLoading = isCurrentlySolved === null;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white font-mono">{chapter.loading}</div>
            </div>
        );
    }

    const fileLinkMap: Record<string, string> = {
        Entity: fileLinks.IV.E_TXT,
        TAS: fileLinks.IV.TAS_TXT,
        TREE: fileLinks.IV.TREE_TXT,
    };

    const handleChange = (id: string, value: string) => {
        setInputs(prev => ({...prev, [id]: value}));
        setErrors(prev => ({...prev, [id]: ''}));
    }

    const handleSubmit = async (id: string) => {
        setErrors(prev => ({...prev, [id]: ''}));
        setLoadingIds(prev => ({...prev, [id]: true}));
        try {
            const provided = (inputs[id] || '').trim();
            // Call server API to validate keyword — server will set signed cookie on success
            const res = await fetch(routes.api.chapters.iv.validateKeyword, {
                method: 'POST',
                body: JSON.stringify({plaqueId: id, provided})
            });
            const data = await res.json();
            if (data?.ok) {
                // merge this plaque into the local JSON cookie so we don't overwrite previous progress
                try {
                    const cookieKey = 'chapterIV-plaque-progress';
                    const current = getJsonCookie(cookieKey) || {};
                    // progress states: 1 = keyword entered, 2 = started puzzle, 3 = completed
                    const prevState = Number(current[id] || 0);
                    current[id] = Math.max(prevState, 1);
                    setJsonCookie(cookieKey, current, 365);
                } catch (e) {
                    // ignore cookie errors
                }

                // refresh plaque statuses
                await fetchPlaqueStatuses();
                router.push(`/chapters/IV/puzzles/${id}`);
            } else {
                setErrors(prev => ({...prev, [id]: data?.message || 'Incorrect keyword.'}));
            }
        } finally {
            setLoadingIds(prev => ({...prev, [id]: false}));
        }
    }

    return (
        <>
            <audio ref={audioRef} src={BACKGROUND_AUDIO.BONUS.IV} loop preload="auto" style={{display: 'none'}}/>
            <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 p-8">
                <div className="max-w-6xl mx-auto">

                    <div className="text-center mb-12">
                        {isCurrentlySolved ? (
                            <div className="space-y-4">
                                <div
                                    className="text-green-500 font-mono text-3xl font-bold">{chapterIVData.text.complete.title}</div>
                                <p className="text-gray-400 font-mono">{chapterIVData.text.complete.message}</p>
                            </div>
                        ) : (
                            <>
                                <h1 className="text-white font-mono text-4xl font-bold mb-4">{chapterIVData.text.header}</h1>
                                <p className="text-gray-400 font-mono text-sm">{chapterIVData.text.subHeader}</p>
                            </>
                        )}
                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {chapterIVData.chapterIVPlaques.map((plaque) => {
                            const status = plaqueStatuses.find(p => p.id === plaque.id);
                            const isPending = !status || status.status === 'pending';
                            const isSolved = status?.status === 'solved' || isCurrentlySolved;
                            const isFailed = isAllFailed || status?.status === 'failed';

                            const downloadLink = fileLinkMap[plaque.id as keyof typeof fileLinkMap];

                            return (
                                <div
                                    key={plaque.id}
                                    className="block"
                                >
                                    <Card
                                        className="bg-gray-900 border-2 border-gray-700 overflow-hidden hover:border-gray-500 transition-colors">
                                        <CardHeader className="relative p-0">
                                            <div className="absolute top-2 right-2 bg-gray-800 px-3 py-1 rounded z-10">
                                            <span
                                                className={`font-mono text-xs ${isFailed ? 'text-red-500' : 'text-gray-400'}`}>
                                                {isFailed ? chapterIVData.text.statuses.failedLabel : plaque.id}
                                            </span>
                                            </div>

                                            <div className="relative w-full aspect-square bg-black">
                                                <Image
                                                    src={plaque.image}
                                                    alt={plaque.id}
                                                    fill
                                                    className={`object-contain bg-black ${isPending ? 'filter blur-sm grayscale' : ''}`}/>

                                                {isFailed && (
                                                    <div
                                                        className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                        <Image
                                                            src={chapterIVData.gifCrossPath}
                                                            alt="Failed Cross"
                                                            fill
                                                            className="object-cover w-full h-full"/>
                                                    </div>
                                                )}
                                            </div>
                                        </CardHeader>

                                        <CardContent className="p-6 space-y-4">
                                            <div className="text-center">
                                                <h3 className={`font-mono text-xl font-bold mb-2 ${isSolved ? 'text-green-500' : isFailed ? 'text-red-500' : 'text-gray-600'}`}>
                                                    {isSolved ? plaque.solvedName : isFailed ? chapterIVData.text.statuses.failedLabel : chapterIVData.text.statuses.pendingLabel}
                                                </h3>

                                                <p className={`font-mono text-sm ${isPending ? 'text-gray-500' : isSolved ? 'text-gray-400' : 'text-red-400'}`}>
                                                    {isSolved ? plaque.solvedCaption : isFailed ? plaque.failedCaption : plaque.unsolvedCaption}
                                                </p>
                                            </div>

                                            {isPending && (
                                                <div className="pt-4 border-t border-gray-800">
                                                    <p className="text-gray-500 font-mono text-xs italic text-center">{plaque.riddle}</p>

                                                    <div className="mt-4 flex flex-col items-center">
                                                        <input
                                                            aria-label={`keyword-input-${plaque.id}`}
                                                            value={inputs[plaque.id] || ''}
                                                            onChange={(e) => handleChange(plaque.id, e.target.value)}
                                                            placeholder="Enter the phrase"
                                                            className="bg-gray-800 text-white font-mono text-sm px-3 py-2 rounded w-3/4 md:w-2/3"
                                                        />

                                                        <div className="mt-3 flex items-center gap-3">
                                                            <button
                                                                onClick={() => handleSubmit(plaque.id)}
                                                                disabled={loadingIds[plaque.id]}
                                                                className="bg-green-600 hover:bg-green-500 text-black font-mono px-3 py-1 rounded text-sm">
                                                                {loadingIds[plaque.id] ? 'Checking...' : 'Submit'}
                                                            </button>
                                                        </div>

                                                        {errors[plaque.id] && (
                                                            <div
                                                                className="mt-2 text-xs text-red-400 font-mono">{errors[plaque.id]}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {!isPending && (
                                                <div
                                                    className="pt-4 border-t border-gray-800 flex items-center justify-between">
                                                    <a href={downloadLink} download
                                                       className="text-xs text-gray-400 font-mono underline">Download
                                                        artifact</a>
                                                    <Link href={`/chapters/IV/puzzles/${plaque.id}`}
                                                          className="text-xs text-gray-300 font-mono underline">Open</Link>
                                                </div>
                                            )}

                                        </CardContent>
                                    </Card>
                                </div>
                            );
                        })}
                    </div>

                    {questStatus === 'active' && !isCurrentlySolved && !isAllFailed && (
                        <div className="mt-12 text-center">
                            <p className="text-gray-600 font-mono text-sm">{chapterIVData.text.questReminder}</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
