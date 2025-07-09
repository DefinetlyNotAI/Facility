export async function signCookie(data: string): Promise<{ success: boolean; error?: string }> {
    try {
        const res = await fetch('/api/sign-cookie', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({data}),
        });

        if (!res.ok) {
            const errorData = await res.json();
            return {success: false, error: errorData.error || 'Failed to sign cookie'};
        }

        return {success: true};
    } catch (e) {
        return {success: false, error: (e as Error).message};
    }
}


export const cookiesList = [
    'accepted', 'Scroll_unlocked', 'Wifi_Unlocked', 'wifi_passed', 'Corrupt',
    'wifi_login', 'Media_Unlocked', 'Button_Unlocked', 'File_Unlocked',
    'corrupting', 'No_corruption', 'BnW_unlocked', 'Choice_Unlocked',
    'terminal_unlocked', 'End?', 'End',
    'moonlight_time_cutscene_played', 'themoon',
    'Interference_cutscene_seen', 'KILLTAS_cutscene_seen', 'TREE', "THP_Play"
];