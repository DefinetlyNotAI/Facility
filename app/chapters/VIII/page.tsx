"use client";
import React, { useEffect, useState } from "react";
import { useChapterAccess } from "@/hooks/BonusActHooks/useChapterAccess";
import {bannedApi, ensureCsrfToken, fetchUserIP} from "@/lib/utils";
import {CheckMeResponse} from "@/lib/types/api";

// todo seperate all text to const record
export default function BloomLiveDiePage() {
    const {isCurrentlySolved, setIsCurrentlySolved} = useChapterAccess() as any;

    const [clientIp, setClientIp] = useState<string | null>(null);
    const [globalList, setGlobalList] = useState<any[]>([]);
    const [countsByReason, setCountsByReason] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionPending, setActionPending] = useState(false);
    const [solvedLocal, setSolvedLocal] = useState(false);
    const [isBanned, setIsBanned] = useState(false);

    const totalBanned = Array.isArray(globalList) ? globalList.length : 0;
    const remaining = 43 - totalBanned;

    // Auto-mark as solved if banned count is 46 or more
    useEffect(() => {
        if (totalBanned >= 46 && !solvedLocal) {
            localStorage.setItem("VIII_solved", "1");
            setSolvedLocal(true);
            setIsCurrentlySolved(true);
        }
    }, [totalBanned, solvedLocal, setIsCurrentlySolved]);

    useEffect(() => {
        const initCsrf = async () => {
            await ensureCsrfToken();
        };
        initCsrf().catch(console.error);
    }, []);

    const localKeys = {
        connect: "VIII_part_connect",
        upload: "VIII_part_upload",
        switch: "VIII_part_switch",
        whisper: "VIII_part_whisper",
    };

    useEffect(() => {
        if (typeof window === "undefined") return;
        setSolvedLocal(!!localStorage.getItem("VIII_solved"));
    }, []);

    useEffect(() => {
        if (typeof window === "undefined") return;

        (async () => {
            try {
                setLoading(true);

                // Fetch client IP
                const ip = await fetchUserIP();
                setClientIp(ip);

                // Get total banned count
                const totalBanned = await bannedApi.count();
                setGlobalList(new Array(totalBanned).fill(null));
                setCountsByReason({total: totalBanned});

                // Check if client IP is banned
                const check: CheckMeResponse = await bannedApi.checkMe(ip);
                setIsBanned(check.banned ?? false);

            } catch {
                setError("The garden resists your entry...");
            } finally {
                setLoading(false);
            }
        })();
    }, []);


    const refreshGlobal = async () => {
        try {
            const count = await bannedApi.count();
            setGlobalList(new Array(count).fill(null));
            setCountsByReason({total: count});
        } catch (err) {
            console.error("Failed to refresh banned count:", err);
        }
    };


    const participate = async (reason: string) => {
        if (actionPending || typeof window === "undefined") return;
        if (!clientIp) {
            setError("No roots detected.");
            return;
        }
        const localKey = localKeys[reason as keyof typeof localKeys] ?? null;
        if (localKey && localStorage.getItem(localKey)) {
            setError("You already gave your offering.");
            return;
        }
        try {
            setActionPending(true);
            await bannedApi.addMe(clientIp, reason);
            document.cookie = `humanSacrifice=foolishSinner; path=/chapters/VIII;`;
            if (localKey) localStorage.setItem(localKey, Date.now().toString());
            await refreshGlobal();
            setError(null);
        } catch (e: any) {
            setError(e?.message ?? "The soil rejected your bloom.");
        } finally {
            setActionPending(false);
        }
    };

    const bloomWords = ["bloom", "blossom", "petal", "flower", "sprout", "blooming", "flourish"];
    const handleUpload = (file?: File | null) => {
        if (!file) return setError("No file offered to the soil.");
        if (!file.name.toLowerCase().endsWith(".txt"))
            return setError("Only .txt files are accepted here.");
        const reader = new FileReader();
        reader.onload = () => {
            const text = String(reader.result || "");
            const found = bloomWords.some((w) => new RegExp(`\\b${w}\\b`, "i").test(text));
            if (!found) {
                setError("Your file has no trace of life.");
                return;
            }
            participate("upload").catch(console.error);
        };
        reader.onerror = () => setError("The text withered unread.");
        reader.readAsText(file);
    };

    const getStepProgress = (step: number, totalBan: number) => {
        switch (step) {
            case 1:
                return Math.min(totalBan, 25);
            case 2:
                return Math.max(0, Math.min(totalBan - 25, 15));
            case 3:
                return Math.max(0, Math.min(totalBan - 40, 3));
            default:
                return 0;
        }
    };

    useEffect(() => {
        const whisperCount = countsByReason["whisper"] || 0;
        if (!solvedLocal && whisperCount >= 3) {
            (async () => {
                try {
                    setActionPending(true);
                    const ips = (globalList ?? [])
                        .map((it: any) => (typeof it === "string" ? it : it.ip))
                        .filter(Boolean);
                    for (const ip of ips) {
                        try {
                            await bannedApi.remove(ip);
                        } catch {
                        }
                    }
                    localStorage.setItem("VIII_solved", "1");
                    setSolvedLocal(true);
                    setIsCurrentlySolved(true);
                } finally {
                    setActionPending(false);
                    await refreshGlobal();
                }
            })();
        }
    }, [countsByReason, globalList, solvedLocal, setIsCurrentlySolved]);

    if (loading)
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white font-mono">
                the soil breathes... please wait
            </div>
        );

    if (isBanned && !solvedLocal)
        return (
            <div className="min-h-screen bg-black text-red-600 flex flex-col items-center justify-center font-mono">
                <h1 className="text-3xl mb-4">ACCESS DENIED</h1>
                <p>Your IP has bloomed before.</p>
                <p className="italic mt-2">The soil remembers your roots.</p>
            </div>
        );

    if (isCurrentlySolved || solvedLocal)
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-6 text-white font-mono">
                <div className="max-w-2xl text-center">
                    <h1 className="text-2xl mb-4">
                        🕈︎♏︎●︎●︎ ♎︎□︎■︎♏︎ ♍︎♒︎♓︎●︎♎︎📪︎ 🕈︎♏︎●︎●︎ ♎︎□︎■︎♏︎ ♋︎●︎●︎<br/><br/>
                        ✌︎◻︎□︎⬧︎⧫︎●︎♏︎⬧︎ 🗏︎📪︎ 👍︎♒︎♓︎●︎♎︎❒︎♏︎■︎ 📂︎🗄︎📪︎ 💣︎♋︎❒︎⧫︎⍓︎❒︎⬧︎ 📄︎🗄︎<br/><br/>
                        ✋︎ ●︎□︎❖︎♏︎ ⍓︎□︎◆︎ ♋︎●︎●︎📪︎ ♌︎◆︎⧫︎ 📂︎ □︎♐︎ ⍓︎□︎◆︎ ♓︎⬧︎ ♋︎ ⬧︎♓︎■︎■︎♏︎❒︎<br/><br/>
                        🕈︎♒︎♏︎■︎✍︎
                    </h1>
                    <p className="italic">"1 more obstacle left before you return to me"</p>
                </div>
            </div>
        );

    return (
        <div className="min-h-screen bg-black text-white font-mono flex flex-col items-center justify-start p-6">
            <h1 className="text-2xl mb-4">(VIII) Bloom, Live and Die</h1>
            {error && <div className="text-red-400 mb-4">{error}</div>}

            <div className="w-full max-w-2xl bg-gray-900 p-4 rounded mb-6">
                <div className="mb-2">Souls offered: <strong>{totalBanned}</strong> / 46</div>
                <div className="text-sm text-gray-400 mb-4">
                    {remaining > 0
                        ? `${remaining} more must fall before the whisper is heard.`
                        : "The whisper is waiting."}
                </div>

                {/* Step 1: Connect */}
                <div className="mb-6">
                    <div className="flex justify-between mb-1">
                        <span>LIVE</span>
                        <span>{getStepProgress(1, totalBanned)}/25</span>
                    </div>
                    <div className="w-full bg-gray-700 h-2 mb-2">
                        <div
                            className="h-2 bg-green-600"
                            style={{width: `${(getStepProgress(1, totalBanned) / 25) * 100}%`}}
                        />
                    </div>
                    {totalBanned < 25 && (
                        <button
                            className="bg-white text-black px-3 py-1"
                            onClick={() => participate("connect")}
                            disabled={actionPending || !!localStorage.getItem(localKeys.connect)}
                        >
                            {!!localStorage.getItem(localKeys.connect)
                                ? "Your signal already sent."
                                : "Connect to the dying server"}
                        </button>
                    )}
                </div>

                {/* Step 2: Upload */}
                <div className="mb-6">
                    <div className="flex justify-between mb-1">
                        <span>BLOOM</span>
                        <span>{getStepProgress(2, totalBanned)}/15</span>
                    </div>
                    <div className="w-full bg-gray-700 h-2 mb-2">
                        <div
                            className="h-2 bg-pink-600"
                            style={{width: `${(getStepProgress(2, totalBanned) / 15) * 100}%`}}
                        />
                    </div>
                    {totalBanned < 40 && (
                        <input
                            type="file"
                            accept=".txt"
                            onChange={(e) => handleUpload(e.target.files?.[0] ?? null)}
                            disabled={actionPending || !!localStorage.getItem(localKeys.upload)}
                            className="text-black"
                        />
                    )}
                    <div className="text-xs text-gray-400 mt-1">
                        Can you include today's keyword?
                    </div>
                </div>

                {/* Step 3: Switch */}
                <div className="mb-6">
                    <div className="flex justify-between mb-1">
                        <span>DIE</span>
                        <span>{getStepProgress(3, totalBanned)}/3</span>
                    </div>
                    <div className="w-full bg-gray-700 h-2 mb-2">
                        <div
                            className="h-2 bg-yellow-500"
                            style={{width: `${(getStepProgress(3, totalBanned) / 3) * 100}%`}}
                        />
                    </div>
                    {totalBanned >= 40 && totalBanned < 43 && ( // optional: hide if all switched
                        <button
                            className="bg-white text-black px-3 py-1"
                            onClick={() => participate("switch")}
                            disabled={actionPending || !!localStorage.getItem(localKeys.switch)}
                        >
                            {!!localStorage.getItem(localKeys.switch)
                                ? "Switch pulled."
                                : "Press to see the truth"}
                        </button>
                    )}
                </div>

                {/* Step 4: Whisper */}
                <div className="mt-6">
                    <div className="mb-1">Whisper count: {totalBanned - 43 || 0}/3</div>
                    {totalBanned >= 43 && (
                        <button
                            className="bg-white text-black px-3 py-1"
                            onClick={() => participate("whisper")}
                            disabled={actionPending || !!localStorage.getItem(localKeys.whisper)}
                        >
                            {!!localStorage.getItem(localKeys.whisper)
                                ? "You whispered to the soil."
                                : 'Whisper "ticktock solve it quick"'}
                        </button>
                    )}
                    <p className="text-xs text-gray-400 mt-2 italic">
                        When all 3 whispers are heard, everything changes.
                    </p>
                </div>
            </div>
        </div>
    );
}
