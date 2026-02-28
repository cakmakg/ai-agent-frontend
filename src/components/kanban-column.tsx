import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { motion } from 'framer-motion';
import LeadCard from './lead-card';
import type { Lead } from '../types';
import type { ColumnConfig } from '../store/use-crm-store';

interface KanbanColumnProps {
    config: ColumnConfig;
    leads: Lead[];
}

const colorMap = {
    primary: {
        headerBorder: 'border-primary/30',
        headerBg: 'bg-primary/5',
        dotColor: 'bg-primary',
        countBg: 'bg-primary/20',
        countText: 'text-primary',
        dropBorder: 'border-primary/20',
    },
    secondary: {
        headerBorder: 'border-secondary/30',
        headerBg: 'bg-secondary/5',
        dotColor: 'bg-secondary',
        countBg: 'bg-secondary/20',
        countText: 'text-secondary',
        dropBorder: 'border-secondary/20',
    },
    success: {
        headerBorder: 'border-success/30',
        headerBg: 'bg-success/5',
        dotColor: 'bg-success',
        countBg: 'bg-success/20',
        countText: 'text-success',
        dropBorder: 'border-success/20',
    },
    warning: {
        headerBorder: 'border-warning/30',
        headerBg: 'bg-warning/5',
        dotColor: 'bg-warning',
        countBg: 'bg-warning/20',
        countText: 'text-warning',
        dropBorder: 'border-warning/20',
    },
};

export default function KanbanColumn({ config, leads }: KanbanColumnProps) {
    const colors = colorMap[config.color];
    const { setNodeRef, isOver } = useDroppable({ id: config.id });

    return (
        <div className="flex flex-col min-w-[280px] max-w-[320px] flex-1">
            {/* Column Header */}
            <div className={`px-4 py-3 rounded-t-xl border ${colors.headerBorder} ${colors.headerBg}
        flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${colors.dotColor}`} />
                    <h3 className="text-sm font-bold text-white tracking-wide">{config.title}</h3>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${colors.countBg} ${colors.countText}`}>
                    {leads.length}
                </span>
            </div>

            {/* Droppable Area */}
            <div
                ref={setNodeRef}
                className={`flex-1 p-3 space-y-3 rounded-b-xl border border-t-0
          min-h-[200px] transition-all duration-200
          ${isOver
                        ? `${colors.dropBorder} bg-white/5 shadow-inner`
                        : 'border-white/5 bg-black/20'
                    }`}
            >
                <SortableContext items={leads.map(l => l.id)} strategy={verticalListSortingStrategy}>
                    {leads.length > 0 ? (
                        leads.map(lead => <LeadCard key={lead.id} lead={lead} />)
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center justify-center h-full min-h-[120px]"
                        >
                            <p className="text-xs text-gray-600 italic text-center">{config.emptyMessage}</p>
                        </motion.div>
                    )}
                </SortableContext>
            </div>
        </div>
    );
}
