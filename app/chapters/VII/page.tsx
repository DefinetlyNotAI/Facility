"use client";
import {useEffect, useRef, useState} from "react";
import {useChapterAccess} from "@/hooks";
import {localStorageKeys, routes} from "@/lib/saveData";
import {chapterVIIData} from "@/lib/client/data/chapters/VII";
import {BACKGROUND_AUDIO, usePlayBackgroundAudio} from "@/audio";
import {chapter} from "@/lib/client/data/chapters";

export default function TimelinePage() {
    const {isCurrentlySolved, setIsCurrentlySolved} = useChapterAccess() as any;
    const [currentYearIndex, setCurrentYearIndex] = useState(0);
    const [inputValue, setInputValue] = useState("");
    const [yearProgress, setYearProgress] = useState<Record<number, number[]>>({});
    const [error, setError] = useState<string | null>(null);
    const [banMessage, setBanMessage] = useState<string | null>(null);
    const [years, setYears] = useState<number[]>([]);
    const [yearTotals, setYearTotals] = useState<Record<number, number>>({});
    const [loading, setLoading] = useState(true);
    const audioRef = useRef<HTMLAudioElement>(null);

    usePlayBackgroundAudio(audioRef, BACKGROUND_AUDIO.BONUS.VII);

    // Fetch years and totals from API
    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const response = await fetch(routes.api.chapters.VII);
                const data = await response.json();
                setYears(data.years);
                setYearTotals(data.yearTotals);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch chapter metadata:', error);
                setLoading(false);
            }
        };
        fetchMetadata().catch(console.error);
    }, []);

    // Load progress and check completion immediately on mount
    useEffect(() => {
        if (years.length === 0) return;

        const storedProgress: Record<number, number[]> = {};
        years.forEach(year => {
            storedProgress[year] = JSON.parse(localStorage.getItem(localStorageKeys.logCreationDateStore(year)) || "[]");
        });
        setYearProgress(storedProgress);

        const allDone = years.every(year => storedProgress[year].length >= yearTotals[year]);
        if (allDone) setIsCurrentlySolved(true);

        const banUntil = localStorage.getItem(localStorageKeys.chapterVIIUnbanDate);
        if (banUntil && parseInt(banUntil) > Date.now()) {
            setBanMessage(chapterVIIData.banActive(new Date(parseInt(banUntil))));
        }
    }, [years, yearTotals]);

    // Update year index based on progress
    useEffect(() => {
        if (!yearProgress || isCurrentlySolved || years.length === 0) return;

        let newIndex = currentYearIndex;
        while (
            newIndex < years.length &&
            yearProgress[years[newIndex]]?.length >= yearTotals[years[newIndex]]
            ) {
            newIndex++;
        }

        if (newIndex !== currentYearIndex) {
            if (newIndex >= years.length) setIsCurrentlySolved(true);
            else setCurrentYearIndex(newIndex);
        }
    }, [yearProgress, currentYearIndex, isCurrentlySolved, years, yearTotals]);

    const handleSubmit = async () => {
        if (isCurrentlySolved) return;

        const banUntil = localStorage.getItem(localStorageKeys.chapterVIIUnbanDate);
        if (banUntil && parseInt(banUntil) > Date.now()) return;

        const year = years[currentYearIndex];

        const parsed = inputValue
            .split(",")
            .map(s => parseInt(s.trim()))
            .filter(n => !isNaN(n));

        try {
            // Call API to validate the numbers
            const response = await fetch(routes.api.chapters.VII, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    year,
                    numbers: parsed,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Failed to validate');
                return;
            }

            const alreadyFound = yearProgress[year] || [];
            const newCorrect = data.correctNumbers.filter((num: number) => !alreadyFound.includes(num));

            if (newCorrect.length === 0) {
                const banTime = Date.now() + chapterVIIData.banMinutes * 60 * 1000;
                localStorage.setItem(localStorageKeys.chapterVIIUnbanDate, banTime.toString());
                setBanMessage(chapterVIIData.banTrigger(new Date(banTime)));
                setError(null);
                return;
            }

            const updated = [...alreadyFound, ...newCorrect];
            const newProgress = {...yearProgress, [year]: updated};
            setYearProgress(newProgress);
            localStorage.setItem(localStorageKeys.logCreationDateStore(year), JSON.stringify(updated));
            setInputValue("");
            setError(null);

            if (updated.length >= data.totalForYear) {
                if (currentYearIndex + 1 < years.length) setCurrentYearIndex(currentYearIndex + 1);
                else setIsCurrentlySolved(true);
            }
        } catch (error) {
            console.error('Failed to validate numbers:', error);
            setError('Failed to validate. Please try again.');
        }
    };

    if (isCurrentlySolved === null || loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white font-mono">{chapter.loading}</div>
            </div>
        );
    }

    if (isCurrentlySolved) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white font-mono text-center">{chapterVIIData.solved}</div>
            </div>
        );
    }

    const year = years[currentYearIndex];
    const currentYearTotal = yearTotals[year];
    const currentYearFound = yearProgress[year]?.length || 0;
    const totalFound = Object.values(yearProgress).reduce((sum, arr) => sum + arr.length, 0);
    const totalAll = Object.values(yearTotals).reduce((sum, total) => sum + total, 0);

    return (
        <>
            <audio ref={audioRef} src={BACKGROUND_AUDIO.BONUS.VII} loop preload="auto" style={{display: 'none'}}/>
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-white font-mono">
                {banMessage ? (
                    <div className="text-yellow-400 mb-4 text-center">{banMessage}</div>
                ) : (
                    <>
                        <div className="mb-2 text-center">{chapterVIIData.enterLogs(year)}</div>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                            className="p-2 text-black w-full max-w-lg mb-2"
                            placeholder={chapterVIIData.inputPlaceholder}/>
                        <button onClick={handleSubmit} className="bg-white text-black px-4 py-2 mb-4">
                            {chapterVIIData.submit}
                        </button>

                        {error && <div className="text-red-500 mb-4">{error}</div>}

                        <div className="w-full max-w-lg h-4 bg-gray-700 mb-1">
                            <div
                                className="h-4 bg-green-500 transition-all"
                                style={{width: `${(currentYearFound / currentYearTotal) * 100}%`}}/>
                        </div>
                        <div
                            className="mb-4">{chapterVIIData.yearProgress(currentYearFound, currentYearTotal, year)}</div>

                        <div className="w-full max-w-lg h-4 bg-gray-700">
                            <div
                                className="h-4 bg-blue-500 transition-all"
                                style={{width: `${(totalFound / totalAll) * 100}%`}}/>
                        </div>
                        <div className="mt-2 text-sm">{chapterVIIData.totalProgress(totalFound, totalAll)}</div>
                    </>
                )}
            </div>
        </>
    );
}
