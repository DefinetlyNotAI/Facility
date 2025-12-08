import { NextResponse } from 'next/server';
import { chapterIIIData } from '@/lib/data/chapters';

// Returns server-side computed clock states so the client cannot spoof time.
export async function GET() {
  try {
    const now = new Date();

    const clocks = chapterIIIData.clocks.map(clock => {
      const revealDate = new Date(chapterIIIData.startDate);
      revealDate.setDate(revealDate.getDate() + clock.revealDay);

      const timeRemaining = Math.max(0, revealDate.getTime() - now.getTime());

      return {
        id: clock.id,
        symbol: clock.symbol,
        keyword: clock.keyword,
        revealDay: clock.revealDay,
        isRevealed: timeRemaining <= 0,
        timeRemaining,
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

