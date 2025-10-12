'use client';

import styles from '@/styles/Bonus.module.css';
import {bonusErrorText} from "@/lib/data/bonus";

export default function LockedBehindDoors() {
    return (
        <div className={styles.container}>
            <p className={styles.text}>
                {bonusErrorText.lockedBehindDoors}
            </p>
        </div>
    );
}
