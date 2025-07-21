import {createSecureResponse} from '@/lib/utils';
import {wifiPanel} from "@/lib/data/api";

export async function GET(req: Request) {
    const userAgent = req.headers.get('user-agent')?.toLowerCase() || '';

    if (userAgent.includes('curl') || userAgent.includes('wget')) {
        return createSecureResponse({keyword2: "fletchling"});
    } else {
        return createSecureResponse(wifiPanel.useTools, 403);
    }
}
