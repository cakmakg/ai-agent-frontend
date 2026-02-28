import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Settings,
    Building2,
    Globe,
    MessageSquare,
    DollarSign,
    RotateCcw,
    Save,
    CheckCircle,
    Server,
    KeyRound,
} from 'lucide-react';
import {
    useSettingsStore,
    SECTOR_LABELS,
    TONE_LABELS,
} from '../store/use-settings-store';
import type { SectorType, ToneOfVoice } from '../types';

export default function SettingsPage() {
    const { settings, updateSettings, resetDefaults } = useSettingsStore();
    const [saved, setSaved] = useState(false);

    const handleSave = useCallback(() => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    }, []);

    const handleReset = useCallback(() => {
        resetDefaults();
        setSaved(false);
    }, [resetDefaults]);

    return (
        <div className="space-y-8 max-w-3xl">
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-warning/10 border border-warning/30">
                        <Settings className="w-5 h-5 text-warning" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Einstellungen</h2>
                        <p className="text-xs text-gray-500">Multi-Tenant Konfiguration</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-2 text-xs text-gray-500 hover:text-white
                       px-3 py-2 rounded-lg border border-white/10 hover:border-white/20
                       transition-all duration-200"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Zurücksetzen
                    </button>
                    <button
                        onClick={handleSave}
                        className="btn-cyber btn-cyber-primary flex items-center gap-2 text-xs py-2 px-4"
                    >
                        {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                        {saved ? 'Gespeichert!' : 'Speichern'}
                    </button>
                </div>
            </motion.div>

            {/* Success Banner */}
            <AnimatePresence>
                {saved && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-success/10 border border-success/30 rounded-xl px-4 py-3 flex items-center gap-2"
                    >
                        <CheckCircle className="w-4 h-4 text-success" />
                        <span className="text-sm text-success font-medium">Einstellungen erfolgreich gespeichert!</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Sektion 1: Sektör Seçimi */}
            <SettingsSection
                icon={<Building2 className="w-5 h-5 text-primary" />}
                title="Branche / Sektor"
                description="Wählen Sie die Branche Ihres Unternehmens. Die KI-Agenten passen ihre Prompts entsprechend an."
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(Object.entries(SECTOR_LABELS) as [SectorType, string][]).map(([value, label]) => (
                        <button
                            key={value}
                            onClick={() => updateSettings({ sector: value })}
                            className={`p-3 rounded-xl text-left text-sm font-medium transition-all duration-200 border
                ${settings.sector === value
                                    ? 'bg-primary/10 border-primary/40 text-primary shadow-[0_0_12px_rgba(0,240,255,0.15)]'
                                    : 'bg-black/20 border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </SettingsSection>

            {/* Sektion 2: Şirket Bilgileri */}
            <SettingsSection
                icon={<Globe className="w-5 h-5 text-secondary" />}
                title="Unternehmensinformationen"
                description="Grundlegende Informationen über Ihr Unternehmen."
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs text-gray-500 uppercase tracking-wider font-medium">Firmenname</label>
                        <input
                            type="text"
                            value={settings.companyName}
                            onChange={e => updateSettings({ companyName: e.target.value })}
                            className="glass-input text-sm"
                            placeholder="z.B. Antigravity Solutions"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-xs text-gray-500 uppercase tracking-wider font-medium">Stundensatz</label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={settings.hourlyRate}
                                onChange={e => updateSettings({ hourlyRate: Number(e.target.value) })}
                                className="glass-input text-sm flex-1"
                                min={0}
                            />
                            <div className="flex items-center gap-1.5">
                                <DollarSign className="w-4 h-4 text-gray-500" />
                                <select
                                    value={settings.currency}
                                    onChange={e => updateSettings({ currency: e.target.value })}
                                    className="glass-input text-sm py-2 px-3 bg-black/60 appearance-none cursor-pointer"
                                >
                                    <option value="EUR">EUR (€)</option>
                                    <option value="USD">USD ($)</option>
                                    <option value="GBP">GBP (£)</option>
                                    <option value="TRY">TRY (₺)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </SettingsSection>

            {/* Sektion 3: Dil Tonu */}
            <SettingsSection
                icon={<MessageSquare className="w-5 h-5 text-success" />}
                title="Tone of Voice"
                description="Bestimmen Sie den Kommunikationsstil der KI-Agenten in generierten Berichten."
            >
                <div className="flex flex-col gap-3">
                    {(Object.entries(TONE_LABELS) as [ToneOfVoice, string][]).map(([value, label]) => (
                        <button
                            key={value}
                            onClick={() => updateSettings({ toneOfVoice: value })}
                            className={`p-4 rounded-xl text-left transition-all duration-200 border flex items-center gap-3
                ${settings.toneOfVoice === value
                                    ? 'bg-success/10 border-success/40 text-success shadow-[0_0_12px_rgba(0,255,170,0.15)]'
                                    : 'bg-black/20 border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
                                }`}
                        >
                            <div className={`w-3 h-3 rounded-full border-2 flex-shrink-0
                ${settings.toneOfVoice === value
                                    ? 'border-success bg-success'
                                    : 'border-gray-600 bg-transparent'
                                }`}
                            />
                            <span className="text-sm font-medium">{label}</span>
                        </button>
                    ))}
                </div>
            </SettingsSection>

            {/* Sektion 4: API Ayarları */}
            <SettingsSection
                icon={<Server className="w-5 h-5 text-warning" />}
                title="API-Konfiguration"
                description="Backend-Verbindungseinstellungen. Ändern Sie diese nur, wenn Sie wissen, was Sie tun."
            >
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs text-gray-500 uppercase tracking-wider font-medium flex items-center gap-1.5">
                            <Server className="w-3.5 h-3.5" />
                            Backend URL
                        </label>
                        <input
                            type="url"
                            value={settings.apiBaseUrl}
                            onChange={e => updateSettings({ apiBaseUrl: e.target.value })}
                            className="glass-input text-sm font-mono"
                            placeholder="https://your-backend.onrender.com"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-xs text-gray-500 uppercase tracking-wider font-medium flex items-center gap-1.5">
                            <KeyRound className="w-3.5 h-3.5" />
                            API Key
                        </label>
                        <input
                            type="password"
                            value={settings.apiKey}
                            onChange={e => updateSettings({ apiKey: e.target.value })}
                            className="glass-input text-sm font-mono"
                            placeholder="••••••••••••••••"
                        />
                    </div>
                </div>
            </SettingsSection>
        </div>
    );
}

// --- Reusable Section Component ---
function SettingsSection({
    icon,
    title,
    description,
    children,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    children: React.ReactNode;
}) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel overflow-hidden"
        >
            <div className="p-5 border-b border-white/5 bg-black/20">
                <div className="flex items-center gap-3 mb-1">
                    <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                        {icon}
                    </div>
                    <h3 className="text-base font-bold text-white">{title}</h3>
                </div>
                <p className="text-xs text-gray-500 mt-2 ml-11">{description}</p>
            </div>
            <div className="p-5">
                {children}
            </div>
        </motion.section>
    );
}
