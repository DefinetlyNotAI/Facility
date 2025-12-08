import { NextResponse } from 'next/server';
import { chapterIIIData } from '@/lib/data/chapters';

export async function GET() {
    try {
        const now = new Date();
        const startDate = new Date(chapterIIIData.startDate);

        const clocks = chapterIIIData.clocks.map(clock => {
            // Compute reveal date
            const revealDate = new Date(startDate);
            revealDate.setDate(startDate.getDate() + clock.revealDay);

            const timeRemaining = revealDate.getTime() - now.getTime();

            return {
                id: clock.id,
                symbol: clock.symbol,
                keyword: clock.keyword,
                revealDay: clock.revealDay,
                revealDate: revealDate.toISOString(),
                isRevealed: timeRemaining <= 0,
                timeRemaining: Math.max(0, timeRemaining),
            };
        });

        return NextResponse.json({
            serverTime: now.toISOString(),
            clocks,
        });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to compute clock states' }, { status: 500 });
    }
}
