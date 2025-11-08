'use client';

import {useChapterAccess} from "@/hooks/BonusActHooks/useChapterAccess";
import {useFailed} from "@/hooks/BonusActHooks/useFailed";
import {chapter} from "@/lib/data/chapters";
import {ChapterTemplateProps} from "@/lib/types/chapters";

export default function ChapterTemplate({chapterId, chapterData, fileLink}: ChapterTemplateProps) {
    const {isCurrentlySolved} = useChapterAccess();
    const isAllFailed = useFailed(chapterId);

    if (isCurrentlySolved === null) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white font-mono">{chapter.loading}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black p-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-white font-mono text-4xl font-bold mb-4">{chapterData.text.header}</h1>
                    <p className="text-gray-400 font-mono text-sm">{chapterData.text.subHeader}</p>
                </div>

                <div className="flex justify-center mb-8">
                    <a
                        href={fileLink}
                        download
                        aria-label="Narrator download"
                        className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-red-700 via-black to-red-800 text-white font-mono rounded-md border-2 border-red-900 shadow-lg hover:scale-105 transform transition-all duration-200"
                    >
                        <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v14m7-7H5" />
                        </svg>
                        <span>{chapter.narrator}</span>
                    </a>
                </div>

                {!isCurrentlySolved && !isAllFailed && (
                    <div className="mt-12 text-center">
                        <p className="text-gray-600 font-mono text-sm">{chapterData.text.questReminder}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
