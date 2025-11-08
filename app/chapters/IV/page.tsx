'use client';

import {useState} from 'react';
import Image from 'next/image';
import {Card, CardContent, CardHeader} from '@/components/ui/card';
import {chapter, chapterIVData, fileLinks} from "@/lib/data/chapters";
import {PlaqueStatus} from "@/lib/types/chapters";
import {AllowedPlaqueStatus} from "@/lib/types/api";

import {useChapterAccess} from "@/hooks/BonusActHooks/useChapterAccess";


// ---------- Component ----------
export default function ChapterIVPage() {
    const {isCurrentlySolved} = useChapterAccess();
    const [plaqueStatuses] = useState<PlaqueStatus[]>(chapterIVData.plaqueStatus);
    const [questStatus] = useState<AllowedPlaqueStatus>('active');

    if (isCurrentlySolved === null) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white font-mono">{chapter.loading}</div>
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

                            // Map plaque ID to its file link
                            const fileLinkMap: Record<string, string> = {
                                Entity: fileLinks.IV.E_TXT,
                                TAS: fileLinks.IV.TAS_TXT,
                                TREE: fileLinks.IV.TREE_TXT,
                            };

                            const downloadLink = fileLinkMap[plaque.id as keyof typeof fileLinkMap];

                            return (
                                <a
                                    key={plaque.id}
                                    href={downloadLink}
                                    download
                                    className="block"
                                >
                                    <Card className="bg-gray-900 border-2 border-gray-700 overflow-hidden hover:border-gray-500 transition-colors">
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
                                                        <Image
                                                            src={chapterIVData.gifCrossPath}
                                                            alt="Failed Cross"
                                                            fill
                                                            className="object-contain"
                                                        />
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
                                </a>
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
