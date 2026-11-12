const API_URL = import.meta.env.VITE_API_URL;

export const loginApi = async (username, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) {
        const msg = Array.isArray(data.message) ? data.message.join(', ') : data.message;
        throw new Error(msg);
    }
};