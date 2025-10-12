'use client';

import styles from '@/styles/NoTimeLeft.module.css';
import { useSearchParams } from "next/navigation";
import {chapterMessages, chapterStyles} from "@/lib/data/bonus";

export default function NoTimeLeft() {
    const searchParams = useSearchParams();
    const chapterId = searchParams.get('chapter')?.toUpperCase();

    if (!chapterId || !chapterMessages[chapterId]) return null;

    return (
        <div className={styles.container}>
            <p className={chapterStyles[chapterId]}>
                {chapterMessages[chapterId]}
            </p>
        </div>
    );
}
