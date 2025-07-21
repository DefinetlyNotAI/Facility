import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import {createHash} from 'crypto';
import SmilekingClient from './SmilekingClient';
import {undefinedVar} from "@/lib/data/smileking";
import {cookies as savedCookies, routes} from "@/lib/saveData";


export default async function SmilekingPage() {
    const cookieStore = await cookies();
    const adminPassCookie = cookieStore.get(savedCookies.adminPass)?.value || '';

    const envPass = process.env.SMILEKING_PASS;
    const salt = process.env.SALT;
    if (!envPass || !salt) {
        throw new Error(undefinedVar);
    }
    const expectedHash = createHash('sha256').update(envPass + salt).digest('hex');
    if (adminPassCookie !== expectedHash) {
        redirect(routes.smilekingAuth);
    }

    // If passed, render client component
    return <SmilekingClient/>;
}
