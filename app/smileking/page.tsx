import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
// Import the client component below
import SmilekingClient from './SmilekingClient';

function simpleHash(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }
    return hash.toString(16);
}

export default async function SmilekingPage() {
    const cookieStore = await cookies();
    const adminPassCookie = cookieStore.get('admin-pass')?.value || '';

    const envPass = process.env.SMILEKING_PASS || '';
    const expectedHash = simpleHash(envPass);

    if (adminPassCookie !== expectedHash) {
        redirect('/smileking-auth');
    }

    // If passed, render client component
    return <SmilekingClient/>;
}
