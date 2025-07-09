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
