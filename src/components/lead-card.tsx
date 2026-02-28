import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { Flame, ShieldAlert, HelpCircle, Headphones, Clock, FileText, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Lead } from '../types';
import { useCrmStore } from '../store/use-crm-store';

interface LeadCardProps {
    lead: Lead;
}

const categoryConfig = {
    HOT_LEAD: {
        icon: Flame,
        label: 'Hot Lead',
        badgeBg: 'bg-success/20',
        badgeBorder: 'border-success/40',
        badgeText: 'text-success',
        glow: 'shadow-[0_0_12px_rgba(0,255,170,0.15)]',
    },
    SPAM: {
        icon: ShieldAlert,
        label: 'Spam',
        badgeBg: 'bg-danger/20',
        badgeBorder: 'border-danger/40',
        badgeText: 'text-danger',
        glow: '',
    },
    SUPPORT: {
        icon: Headphones,
        label: 'Support',
        badgeBg: 'bg-warning/20',
        badgeBorder: 'border-warning/40',
        badgeText: 'text-warning',
        glow: '',
    },
    OTHER: {
        icon: HelpCircle,
        label: 'Sonstige',
        badgeBg: 'bg-gray-500/20',
        badgeBorder: 'border-gray-500/40',
        badgeText: 'text-gray-400',
        glow: '',
    },
};

export default function LeadCard({ lead }: LeadCardProps) {
    const navigate = useNavigate();
    const { removeLead } = useCrmStore();
    const config = categoryConfig[lead.category];
    const CategoryIcon = config.icon;

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: lead.id, data: { lead } });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const timeAgo = getTimeAgo(lead.createdAt);

    return (
        <motion.div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isDragging ? 0.6 : 1, y: 0 }}
            className={`
        bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-4
        cursor-grab active:cursor-grabbing
        hover:border-white/20 hover:bg-black/50
        transition-colors duration-200
        ${config.glow}
        ${isDragging ? 'z-50 shadow-2xl scale-105' : ''}
      `}
        >
            {/* Header: Category + Time */}
            <div className="flex items-center justify-between mb-3">
                <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold
          ${config.badgeBg} ${config.badgeBorder} ${config.badgeText} border`}>
                    <CategoryIcon className="w-3 h-3" />
                    {config.label}
                </div>
                <div className="flex items-center gap-1 text-gray-600 text-[10px]">
                    <Clock className="w-3 h-3" />
                    {timeAgo}
                </div>
            </div>

            {/* Message Preview */}
            <p className="text-sm text-gray-300 line-clamp-2 mb-3 leading-relaxed">
                {lead.customerMessage}
            </p>

            {/* Analysis */}
            {lead.analysis && (
                <p className="text-xs text-gray-500 italic mb-3 line-clamp-1">
                    „{lead.analysis}"
                </p>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-white/5">
                {lead.finalReport && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/editor/${lead.id}`);
                        }}
                        className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors font-medium"
                    >
                        <FileText className="w-3.5 h-3.5" />
                        Bericht öffnen
                    </button>
                )}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        removeLead(lead.id);
                    }}
                    className="flex items-center gap-1 text-xs text-gray-600 hover:text-danger transition-colors ml-auto"
                    aria-label="Lead entfernen"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                </button>
            </div>
        </motion.div>
    );
}

// Helper
function getTimeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Gerade eben';
    if (mins < 60) return `vor ${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `vor ${hours}h`;
    const days = Math.floor(hours / 24);
    return `vor ${days}T`;
}
