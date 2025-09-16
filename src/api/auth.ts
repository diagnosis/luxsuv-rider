export async function verifyEmail(token: string): Promise<{ message: string }> {
    const res = await fetch(`http://localhost:8080/v1/auth/verify-email?token=${encodeURIComponent(token)}`, {
        method: 'POST',
    });
    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || `Verify failed (${res.status})`);
    }
    return res.json();
}