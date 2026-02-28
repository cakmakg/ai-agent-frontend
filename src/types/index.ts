// ============================================================
// Antigravity Nexus – TypeScript Tip Tanımlamaları
// ============================================================

// --- Agent Timeline ---
export type AgentStepStatus = 'idle' | 'active' | 'completed' | 'error';

export interface AgentStep {
    id: string;
    agentName: string;
    icon: string;
    message: string;
    status: AgentStepStatus;
    delayMs: number; // Bu adımın aktif olacağı gecikme süresi (ms)
}

// --- Metrik Kartları ---
export interface MetricData {
    title: string;
    value: string | number;
    icon: string;
    trend?: string;
    color: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}

// --- CRM / Lead ---
export type LeadCategory = 'SPAM' | 'SUPPORT' | 'HOT_LEAD' | 'OTHER';
export type LeadColumnId = 'incoming' | 'processing' | 'awaiting_approval' | 'approved';

export interface Lead {
    id: string;
    customerMessage: string;
    category: LeadCategory;
    analysis: string;
    generatedTask?: string;
    finalReport?: string;
    columnId: LeadColumnId;
    createdAt: string;
}

// --- API Responses ---
export interface AnalyzeResponse {
    success: boolean;
    fileSaved?: boolean;
    finalReport?: string;
    error?: string;
}

export interface InboxResponse {
    success: boolean;
    status: 'IGNORED' | 'HOT_LEAD_PROCESSED' | 'ERROR';
    category?: LeadCategory;
    reason?: string;
    leadAnalysis?: string;
    generatedTask?: string;
    fileSaved?: boolean;
    finalReport?: string;
    message?: string;
    error?: string;
}
