import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';
import type { AppSettings, SectorType, ToneOfVoice } from '../types';

// --- Varsayılan Ayarlar ---
const DEFAULT_SETTINGS: AppSettings = {
    sector: 'it_consulting',
    companyName: 'Antigravity Solutions',
    hourlyRate: 150,
    currency: 'EUR',
    toneOfVoice: 'formal',
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://ai-agent-backend-3ixe.onrender.com',
    apiKey: import.meta.env.VITE_API_KEY || '',
};

// --- Store Interface ---
interface SettingsStore {
    settings: AppSettings;
    updateSettings: (partial: Partial<AppSettings>) => void;
    resetDefaults: () => void;
    getSectorLabel: (sector: SectorType) => string;
    getToneLabel: (tone: ToneOfVoice) => string;
}

const SettingsContext = createContext<SettingsStore | null>(null);

// --- LocalStorage ---
const STORAGE_KEY = 'antigravity-settings';

function loadSettings(): AppSettings {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
        }
        return DEFAULT_SETTINGS;
    } catch {
        return DEFAULT_SETTINGS;
    }
}

function saveSettings(settings: AppSettings): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

// --- Sector Labels ---
const SECTOR_LABELS: Record<SectorType, string> = {
    it_consulting: 'IT & KI-Beratung',
    real_estate: 'Immobilien (Real Estate)',
    healthcare: 'Gesundheitswesen',
    finance: 'Finanzwesen',
    custom: 'Benutzerdefiniert',
};

// --- Tone Labels ---
const TONE_LABELS: Record<ToneOfVoice, string> = {
    formal: 'Formell (Geschäftlich)',
    friendly: 'Freundlich (Locker)',
    technical: 'Technisch (Fachsprache)',
};

// --- Provider ---
export function SettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<AppSettings>(loadSettings);

    const updateSettings = useCallback((partial: Partial<AppSettings>) => {
        setSettings(prev => {
            const updated = { ...prev, ...partial };
            saveSettings(updated);
            return updated;
        });
    }, []);

    const resetDefaults = useCallback(() => {
        setSettings(DEFAULT_SETTINGS);
        saveSettings(DEFAULT_SETTINGS);
    }, []);

    const getSectorLabel = useCallback((sector: SectorType) => SECTOR_LABELS[sector], []);
    const getToneLabel = useCallback((tone: ToneOfVoice) => TONE_LABELS[tone], []);

    const store = useMemo<SettingsStore>(() => ({
        settings,
        updateSettings,
        resetDefaults,
        getSectorLabel,
        getToneLabel,
    }), [settings, updateSettings, resetDefaults, getSectorLabel, getToneLabel]);

    return <SettingsContext.Provider value={store}>{children}</SettingsContext.Provider>;
}

// --- Hook ---
export function useSettingsStore(): SettingsStore {
    const ctx = useContext(SettingsContext);
    if (!ctx) throw new Error('useSettingsStore must be used within SettingsProvider');
    return ctx;
}

// --- Exports ---
export { SECTOR_LABELS, TONE_LABELS, DEFAULT_SETTINGS };
