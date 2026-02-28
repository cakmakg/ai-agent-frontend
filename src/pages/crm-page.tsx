import { useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    DndContext,
    PointerSensor,
    useSensor,
    useSensors,
    closestCenter,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { Kanban, Plus } from 'lucide-react';
import KanbanColumn from '../components/kanban-column';
import { useCrmStore, CRM_COLUMNS } from '../store/use-crm-store';
import type { LeadColumnId } from '../types';

export default function CrmPage() {
    const { leads, moveLead, addLead, getLeadsByColumn } = useCrmStore();

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
    );

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;

        const leadId = active.id as string;
        const targetColumnId = over.id as LeadColumnId;

        const isValidColumn = CRM_COLUMNS.some(col => col.id === targetColumnId);
        if (isValidColumn) {
            moveLead(leadId, targetColumnId);
        }
    }, [moveLead]);

    const handleAddDemo = useCallback(() => {
        addLead({
            customerMessage: 'Wir suchen einen Partner für KI-gestützte Automatisierung unserer Geschäftsprozesse. Budget: 50.000€',
            category: 'HOT_LEAD',
            analysis: 'Potenzieller Großkunde mit klarem Budget und Bedarf.',
            generatedTask: 'Analysieren Sie das Unternehmen und erstellen Sie ein Beratungsangebot für KI-Automatisierung.',
            finalReport: '# IST/SOLL Konzept\n\n## IST-Zustand\nDas Unternehmen nutzt manuelle Prozesse...\n\n## SOLL-Zustand\nMit KI-gestützter Automatisierung können wir...\n\n## Kostenvoranschlag\n- Phase 1: 15.000€\n- Phase 2: 20.000€\n- Phase 3: 15.000€\n\n**Gesamtinvestition: 50.000€**',
        });
    }, [addLead]);

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-secondary/10 border border-secondary/30 shadow-neon-purple">
                        <Kanban className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">CRM Pipeline</h2>
                        <p className="text-xs text-gray-500">
                            {leads.length} Lead{leads.length !== 1 ? 's' : ''} insgesamt
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleAddDemo}
                    className="btn-cyber btn-cyber-secondary flex items-center gap-2 text-xs py-2 px-4"
                >
                    <Plus className="w-4 h-4" />
                    Demo-Lead
                </button>
            </motion.div>

            {/* Kanban Board */}
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                    {CRM_COLUMNS.map(col => (
                        <KanbanColumn
                            key={col.id}
                            config={col}
                            leads={getLeadsByColumn(col.id)}
                        />
                    ))}
                </div>
            </DndContext>
        </div>
    );
}
