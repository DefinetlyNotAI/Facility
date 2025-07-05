import {NextRequest, NextResponse} from 'next/server';
import crypto from 'crypto';

// All keywords were set as lowercase when hashed
const knownKeywordHashes: string[] = [
    "6780ebaed4e668c7c00580830401a52bf7717d16b6998d7d3c598f611d7d5f2a",
    "2b390c28565e0b1df45413e4ac55d1286e62e1c4cd80f5ec896b3784e5cd5f74",
    "6a2be74b7b9aa1ce1015a934ec97e1cd9371870b8a8ba1e518abd74a9135fa44",
    "99d115eadab206cb7485d6a34d7154de88f450c221384afac0c159dfbbabf5f5",
    "f4f383ec8075df0c0c4a65c6234aa324aa2dd3d26b8709706a000caaff5323f3",
    "6d505cd17eebeb35154cb4d8b57b4daa9ad7afa8e7b6d5c2ce2db8801f44dd62"
];

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
        return NextResponse.json({error: 'Invalid input'}, {status: 400});
    }

    const keywordHash = hashKeyword(keyword);
    const knownHash = knownKeywordHashes[number - 1];
    const match = keywordHash === knownHash;

    return NextResponse.json({
        number,
        match,
    });
}
