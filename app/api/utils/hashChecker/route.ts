import {NextResponse} from "next/server";
import {createHash} from "crypto";
import {ItemKey} from "@/lib/saveData";
import {chIData, chIIData} from "@/lib/data/chapters";

const secrets: Record<ItemKey, string> = {
    [ItemKey.portNum]: chIData.portNum,
    [ItemKey.ipAddress]: chIData.ipAddress,
    [ItemKey.InternalCode]: chIIData.chapterIIPaths[6].path
};

const itemHashes: Record<ItemKey, string> = Object.fromEntries(
    Object.entries(secrets).map(([k, v]) => [
        k,
        createHash("sha256").update(v).digest("hex")
    ])
) as Record<ItemKey, string>;

export async function POST(req: Request) {
    try {
        const {stringToCheck, itemToCheck} = await req.json();

        if (stringToCheck === undefined || itemToCheck === undefined) {
            return NextResponse.json({success: false, error: "Missing data"}, {status: 400});
        }

        if (!(itemToCheck in itemHashes)) {
            return NextResponse.json({success: false, error: "Invalid item"}, {status: 404});
        }

        const inputHash = createHash("sha256").update(stringToCheck).digest("hex");
        const valid = inputHash === itemHashes[itemToCheck as ItemKey];

        return NextResponse.json({success: valid});
    } catch (err) {
        console.error(err);
        return NextResponse.json({success: false, error: "Internal error"}, {status: 500});
    }
}
