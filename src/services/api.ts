import type { AnalyzeResponse, InboxResponse } from '../types';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://ai-agent-backend-3ixe.onrender.com';
const API_KEY = import.meta.env.VITE_API_KEY || 'a7db7ashd7ashd7ahsd7ashd7ashd7hasd7g2367f4e219er';

// Timeout koruması: 120 saniye (Ajanların uzun işlemleri için)
const REQUEST_TIMEOUT_MS = 120_000;

/**
 * Timeout korumalı fetch wrapper.
 * AbortController ile belirtilen süre içinde yanıt gelmezse istek iptal edilir.
 */
async function fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error: unknown) {
        clearTimeout(timeoutId);
        if (error instanceof DOMException && error.name === 'AbortError') {
            throw new Error('Zeitüberschreitung: Der Server hat nicht innerhalb von 2 Minuten geantwortet. Die Agenten arbeiten möglicherweise noch. Bitte versuchen Sie es erneut.');
        }
        throw error;
    }
}

export const analyzeTask = async (task: string): Promise<AnalyzeResponse> => {
    const response = await fetchWithTimeout(`${API_URL}/api/analyze`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
        },
        body: JSON.stringify({ task }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error((errorData as Record<string, string>).error || `Server-Fehler: ${response.status}`);
    }

    return response.json();
};

export const simulateInbox = async (message: string): Promise<InboxResponse> => {
    const response = await fetchWithTimeout(`${API_URL}/api/inbox`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
        },
        body: JSON.stringify({ message }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error((errorData as Record<string, string>).error || `Server-Fehler: ${response.status}`);
    }

    return response.json();
};
