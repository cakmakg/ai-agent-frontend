import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';
import type { Lead, LeadColumnId } from '../types';

// --- CRM Store Interface ---
interface CrmStore {
    leads: Lead[];
    addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'columnId'> & { columnId?: LeadColumnId }) => void;
    moveLead: (leadId: string, toColumn: LeadColumnId) => void;
    removeLead: (leadId: string) => void;
    getLeadsByColumn: (columnId: LeadColumnId) => Lead[];
    getLeadById: (leadId: string) => Lead | undefined;
    updateLeadReport: (leadId: string, finalReport: string) => void;
}

// --- Context ---
const CrmContext = createContext<CrmStore | null>(null);

// --- Unique ID Generator ---
let idCounter = 0;
function generateId(): string {
    idCounter += 1;
    return `lead-${Date.now()}-${idCounter}`;
}

// --- LocalStorage Helpers ---
const STORAGE_KEY = 'antigravity-crm-leads';

function loadLeads(): Lead[] {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

function saveLeads(leads: Lead[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
}

// --- Provider ---
export function CrmProvider({ children }: { children: ReactNode }) {
    const [leads, setLeads] = useState<Lead[]>(loadLeads);

    const addLead = useCallback((partial: Omit<Lead, 'id' | 'createdAt' | 'columnId'> & { columnId?: LeadColumnId }) => {
        setLeads(prev => {
            const newLead: Lead = {
                ...partial,
                id: generateId(),
                columnId: partial.columnId ?? 'incoming',
                createdAt: new Date().toISOString(),
            };
            const updated = [...prev, newLead];
            saveLeads(updated);
            return updated;
        });
    }, []);

    const moveLead = useCallback((leadId: string, toColumn: LeadColumnId) => {
        setLeads(prev => {
            const updated = prev.map(l => l.id === leadId ? { ...l, columnId: toColumn } : l);
            saveLeads(updated);
            return updated;
        });
    }, []);

    const removeLead = useCallback((leadId: string) => {
        setLeads(prev => {
            const updated = prev.filter(l => l.id !== leadId);
            saveLeads(updated);
            return updated;
        });
    }, []);

    const getLeadsByColumn = useCallback((columnId: LeadColumnId) => {
        return leads.filter(l => l.columnId === columnId);
    }, [leads]);

    const getLeadById = useCallback((leadId: string) => {
        return leads.find(l => l.id === leadId);
    }, [leads]);

    const updateLeadReport = useCallback((leadId: string, finalReport: string) => {
        setLeads(prev => {
            const updated = prev.map(l => l.id === leadId ? { ...l, finalReport } : l);
            saveLeads(updated);
            return updated;
        });
    }, []);

    const store = useMemo<CrmStore>(() => ({
        leads,
        addLead,
        moveLead,
        removeLead,
        getLeadsByColumn,
        getLeadById,
        updateLeadReport,
    }), [leads, addLead, moveLead, removeLead, getLeadsByColumn, getLeadById, updateLeadReport]);

    return <CrmContext.Provider value={store}>{children}</CrmContext.Provider>;
}

// --- Hook ---
export function useCrmStore(): CrmStore {
    const ctx = useContext(CrmContext);
    if (!ctx) throw new Error('useCrmStore must be used within CrmProvider');
    return ctx;
}

// --- Column Config ---
export interface ColumnConfig {
    id: LeadColumnId;
    title: string;
    color: 'primary' | 'secondary' | 'success' | 'warning';
    emptyMessage: string;
}

export const CRM_COLUMNS: ColumnConfig[] = [
    { id: 'incoming', title: 'Eingehend', color: 'primary', emptyMessage: 'Keine eingehenden Leads' },
    { id: 'processing', title: 'In Bearbeitung', color: 'secondary', emptyMessage: 'Kein Lead wird verarbeitet' },
    { id: 'awaiting_approval', title: 'Warten auf Genehmigung', color: 'warning', emptyMessage: 'Keine Leads zur Genehmigung' },
    { id: 'approved', title: 'Genehmigt', color: 'success', emptyMessage: 'Noch keine genehmigten Leads' },
];
