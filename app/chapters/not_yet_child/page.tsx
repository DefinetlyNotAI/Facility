'use client';

import styles from '@/styles/Bonus.module.css';
import {bonusErrorText} from "@/lib/data/bonus";


export default function NotYetChild() {
    return (
        <div className={styles.container}>
            <p className={styles.text}>
                {bonusErrorText.notYetChild}
            </p>
        </div>
    );
}