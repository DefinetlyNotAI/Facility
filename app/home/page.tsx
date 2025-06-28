import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import HomeClient from './HomeClient';

export default async function HomePage() {
    const cookieStore = await cookies();
    
    // Check cookies server-side
    const corrupt = cookieStore.get('Corrupt')?.value;
    const end = cookieStore.get('End')?.value;
    const endQuestion = cookieStore.get('End?')?.value;
    
    // Handle redirects server-side
    if (corrupt) {
        redirect('/h0m3');
    }
    
    if (end || endQuestion) {
        redirect('/the-end');
    }
    
    // Pass initial cookie state to client component
    const initialCookies = {
        corrupt: !!corrupt,
        end: !!end,
        endQuestion: !!endQuestion,
        noCorruption: !!cookieStore.get('No_corruption')?.value,
        fileUnlocked: !!cookieStore.get('File_Unlocked')?.value,
    };
    
    return <HomeClient initialCookies={initialCookies} />;
}