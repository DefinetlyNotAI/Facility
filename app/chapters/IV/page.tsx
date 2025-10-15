'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { X } from 'lucide-react';
import { useIsSucceeded } from "@/hooks/usePreloadActStates";
import { cookies, routes } from "@/lib/saveData";
import { chapterIVData } from "@/lib/data/chapters";
import { PlaqueStatus } from "@/lib/types/chapters";
import {AllowedPlaqueStatus} from "@/lib/types/api";


// ---------- Component ----------
export default function ChapterIVPage() {
    const router = useRouter();
    const [isCurrentlySolved, setIsCurrentlySolved] = useState<boolean | null>(null);
    const [plaqueStatuses] = useState<PlaqueStatus[]>(chapterIVData.plaqueStatus);
    const [questStatus] = useState<AllowedPlaqueStatus>('active');

    const succeeded = useIsSucceeded();

    useEffect(() => {
        if (!Cookies.get(cookies.end)) {
            router.replace(routes.bonus.locked);
        }
    }, [router]);

    useEffect(() => {
        if (succeeded !== null && succeeded !== undefined) {
            setIsCurrentlySolved(succeeded);
        }
    }, [succeeded]);


    if (isCurrentlySolved === null) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white font-mono">{chapterIVData.text.loading}</div>
            </div>
        );
    }

    if (!isCurrentlySolved) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-white font-mono text-4xl font-bold mb-4">{chapterIVData.text.header}</h1>
                        <p className="text-gray-400 font-mono text-sm">{chapterIVData.text.subHeader}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {chapterIVData.chapterIVPlaques.map((plaque) => {
                            const status = plaqueStatuses.find(p => p.id === plaque.id);
                            const isPending = !status || status.status === 'pending';
                            const isSolved = status?.status === 'solved';
                            const isFailed = status?.status === 'failed';

                            return (
                                <Card
                                    key={plaque.id}
                                    className="bg-gray-900 border-2 border-gray-700 overflow-hidden"
                                >
                                    <CardHeader className="relative p-0">
                                        <div className="absolute top-2 right-2 bg-gray-800 px-3 py-1 rounded z-10">
                                            <span className={`font-mono text-xs ${isFailed ? 'text-red-500' : 'text-gray-400'}`}>
                                                {isFailed ? chapterIVData.text.statuses.failedLabel : plaque.id}
                                            </span>
                                        </div>

                                        <div className="relative w-full aspect-square bg-black">
                                            <Image
                                                src={plaque.image}
                                                alt={plaque.id}
                                                fill
                                                className={`object-contain bg-black ${isPending ? 'filter blur-sm grayscale' : ''}`}
                                            />

                                            {isFailed && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                                    <X className="w-32 h-32 text-red-600" strokeWidth={4} />
                                                </div>
                                            )}
                                        </div>
                                    </CardHeader>

                                    <CardContent className="p-6 space-y-4">
                                        <div className="text-center">
                                            <h3
                                                className={`font-mono text-xl font-bold mb-2 ${
                                                    isSolved ? 'text-green-500' : isFailed ? 'text-red-500' : 'text-gray-600'
                                                }`}
                                            >
                                                {isSolved ? plaque.solvedName : isFailed ? chapterIVData.text.statuses.failedLabel : chapterIVData.text.statuses.pendingLabel}
                                            </h3>

                                            <p
                                                className={`font-mono text-sm ${
                                                    isPending ? 'text-gray-500' : isSolved ? 'text-gray-400' : 'text-red-400'
                                                }`}
                                            >
                                                {isSolved ? plaque.solvedCaption : isFailed ? plaque.failedCaption : plaque.unsolvedCaption}
                                            </p>
                                        </div>

                                        {isPending && (
                                            <div className="pt-4 border-t border-gray-800">
                                                <p className="text-gray-500 font-mono text-xs italic text-center">{plaque.riddle}</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {questStatus === 'active' && (
                        <div className="mt-12 text-center">
                            <p className="text-gray-600 font-mono text-sm">{chapterIVData.text.questReminder}</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="text-center space-y-4">
                <div className="text-green-500 font-mono text-3xl font-bold">{chapterIVData.text.complete.title}</div>
                <p className="text-gray-400 font-mono">{chapterIVData.text.complete.message}</p>
            </div>
        </div>
    );
}
