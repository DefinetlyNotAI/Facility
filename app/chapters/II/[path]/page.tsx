'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { chapterIIPaths } from '@/lib/data/chapters';
import Image from 'next/image';

export default function ChapterIIPathPage() {
    const router = useRouter();
    const params = useParams();
    const path = params.path as string;

    useEffect(() => {
        if (!path) return;

        const normalizedPath = path.toUpperCase();
        const validPath = chapterIIPaths.find(
            (p: { path: string; }) => p.path.toUpperCase() === normalizedPath
        );

        if (!validPath && normalizedPath !== path) {
            router.replace(`/chapters/II/${normalizedPath}`);
        } else if (!validPath) {
            router.replace('/chapters/II');
        }
    }, [path, router]);

    const pathData = chapterIIPaths.find(p => p.path.toUpperCase() === path?.toUpperCase());

    if (!pathData) {
        return null;
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="max-w-2xl w-full space-y-8">
                <div className="relative w-full aspect-square bg-gray-900 border border-gray-800">
                    <Image
                        src={pathData.image}
                        alt={pathData.path}
                        fill
                        className="object-contain"
                    />
                </div>

                <div className="text-center">
                    <p className="text-gray-400 font-mono text-lg italic">
                        {pathData.caption}
                    </p>
                </div>
            </div>
        </div>
    );
}
