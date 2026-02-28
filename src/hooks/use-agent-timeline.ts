import { useState, useCallback, useRef, useEffect } from 'react';
import type { AgentStep, AgentStepStatus } from '../types';

// Varsayılan Ajan Adımları ve Gecikme Süreleri (ms)
const DEFAULT_INBOX_STEPS: Omit<AgentStep, 'status'>[] = [
    { id: 'step-1', agentName: 'Agent 6', icon: '📧', message: 'Eingehende Nachricht wird analysiert...', delayMs: 0 },
    { id: 'step-2', agentName: 'Agent 6', icon: '🕵️', message: 'Kundenkategorie wurde bestimmt', delayMs: 3000 },
    { id: 'step-3', agentName: 'Agent 1', icon: '🔍', message: 'Unternehmensdaten werden gescannt...', delayMs: 7000 },
    { id: 'step-4', agentName: 'Agent 2', icon: '📊', message: 'Analysebericht wird erstellt...', delayMs: 14000 },
    { id: 'step-5', agentName: 'Agent 3', icon: '✍️', message: 'Angebot wird verfasst...', delayMs: 22000 },
    { id: 'step-6', agentName: 'Agent 5', icon: '🔴', message: 'Kritiker prüft den Text...', delayMs: 32000 },
    { id: 'step-7', agentName: 'Agent 3', icon: '📝', message: 'Text wird überarbeitet...', delayMs: 42000 },
    { id: 'step-8', agentName: 'Agent 4', icon: '📁', message: 'Datei wird gespeichert...', delayMs: 52000 },
    { id: 'step-9', agentName: 'Agent 5', icon: '📡', message: 'Bericht wird veröffentlicht...', delayMs: 58000 },
];

const DEFAULT_TASK_STEPS: Omit<AgentStep, 'status'>[] = [
    { id: 'step-1', agentName: 'Orchestrator', icon: '🎯', message: 'Auftrag erhalten, Agenten werden koordiniert...', delayMs: 0 },
    { id: 'step-2', agentName: 'Agent 1', icon: '🔍', message: 'Web-Scraping läuft...', delayMs: 5000 },
    { id: 'step-3', agentName: 'Agent 2', icon: '📊', message: 'Daten werden analysiert...', delayMs: 12000 },
    { id: 'step-4', agentName: 'Agent 3', icon: '✍️', message: 'Inhalt wird generiert...', delayMs: 20000 },
    { id: 'step-5', agentName: 'Agent 5', icon: '🔴', message: 'Qualitätsprüfung durch Kritiker...', delayMs: 30000 },
    { id: 'step-6', agentName: 'Agent 3', icon: '📝', message: 'Text wird überarbeitet...', delayMs: 40000 },
    { id: 'step-7', agentName: 'Agent 4', icon: '📁', message: 'Datei wird gespeichert...', delayMs: 48000 },
    { id: 'step-8', agentName: 'Agent 5', icon: '📡', message: 'Bericht wird veröffentlicht...', delayMs: 54000 },
];

type TimelineMode = 'inbox' | 'task';

export function useAgentTimeline(mode: TimelineMode = 'inbox') {
    const baseSteps = mode === 'inbox' ? DEFAULT_INBOX_STEPS : DEFAULT_TASK_STEPS;

    const [steps, setSteps] = useState<AgentStep[]>(
        baseSteps.map(s => ({ ...s, status: 'idle' as AgentStepStatus }))
    );
    const [isRunning, setIsRunning] = useState(false);
    const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

    // Tüm zamanlayıcıları temizle
    const clearTimers = useCallback(() => {
        timersRef.current.forEach(t => clearTimeout(t));
        timersRef.current = [];
    }, []);

    // Zaman çizelgesini sıfırla
    const reset = useCallback(() => {
        clearTimers();
        setIsRunning(false);
        setSteps(baseSteps.map(s => ({ ...s, status: 'idle' as AgentStepStatus })));
    }, [baseSteps, clearTimers]);

    // Zaman çizelgesini başlat
    const startTimeline = useCallback(() => {
        clearTimers();
        setIsRunning(true);
        setSteps(baseSteps.map(s => ({ ...s, status: 'idle' as AgentStepStatus })));

        baseSteps.forEach((step, index) => {
            // Adımı aktif yap
            const activateTimer = setTimeout(() => {
                setSteps(prev =>
                    prev.map((s, i) => {
                        if (i === index) return { ...s, status: 'active' };
                        if (i < index && s.status === 'active') return { ...s, status: 'completed' };
                        return s;
                    })
                );
            }, step.delayMs);

            timersRef.current.push(activateTimer);
        });
    }, [baseSteps, clearTimers]);

    // Tüm adımları tamamladı olarak işaretle
    const completeAll = useCallback(() => {
        clearTimers();
        setIsRunning(false);
        setSteps(prev => prev.map(s => ({ ...s, status: 'completed' as AgentStepStatus })));
    }, [clearTimers]);

    // Belirli bir adımı hata olarak işaretle
    const setStepError = useCallback((stepId: string) => {
        setSteps(prev =>
            prev.map(s => (s.id === stepId ? { ...s, status: 'error' as AgentStepStatus } : s))
        );
    }, []);

    // Bileşen unmount olduğunda zamanlayıcıları temizle
    useEffect(() => {
        return () => clearTimers();
    }, [clearTimers]);

    return {
        steps,
        isRunning,
        startTimeline,
        completeAll,
        reset,
        setStepError,
    };
}
