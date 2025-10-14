import {NextRequest, NextResponse} from 'next/server';
import crypto from 'crypto';
import {keywords} from "@/lib/data/api";


function hashKeyword(keyword: string): string {
    const salt = process.env.SALT || '';
    // Ensure keyword is lowercased to ignore cap mixing
    return crypto.createHmac('sha256', salt).update(keyword.toLowerCase()).digest('hex');
}

export async function POST(req: NextRequest) {
    const {keyword, number} = await req.json();

    if (
        typeof keyword !== 'string' ||
        typeof number !== 'number' ||
        number < 1 ||
        number > 6
    ) {
        return NextResponse.json({error: keywords.invalidInput}, {status: 400});
    }

    const keywordHash = hashKeyword(keyword);
    const knownHash = keywords.knownHashes[number - 1];
    const match = keywordHash === knownHash;

    return NextResponse.json({
        number,
        match,
    });
}
