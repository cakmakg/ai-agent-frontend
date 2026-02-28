import { motion } from 'framer-motion';
import type { ComponentType, SVGProps } from 'react';

interface MetricCardProps {
    title: string;
    value: string | number;
    icon: ComponentType<SVGProps<SVGSVGElement> & { className?: string }>;
    trend?: string;
    color: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
    delay?: number;
}

const colorMap = {
    primary: {
        bg: 'bg-primary/5',
        border: 'border-primary/20',
        iconBg: 'bg-primary/10',
        iconBorder: 'border-primary/30',
        text: 'text-primary',
        shadow: 'shadow-[0_0_20px_rgba(0,240,255,0.1)]',
        glow: 'shadow-neon-blue',
    },
    secondary: {
        bg: 'bg-secondary/5',
        border: 'border-secondary/20',
        iconBg: 'bg-secondary/10',
        iconBorder: 'border-secondary/30',
        text: 'text-secondary',
        shadow: 'shadow-[0_0_20px_rgba(191,0,255,0.1)]',
        glow: 'shadow-neon-purple',
    },
    success: {
        bg: 'bg-success/5',
        border: 'border-success/20',
        iconBg: 'bg-success/10',
        iconBorder: 'border-success/30',
        text: 'text-success',
        shadow: 'shadow-[0_0_20px_rgba(0,255,170,0.1)]',
        glow: '',
    },
    warning: {
        bg: 'bg-warning/5',
        border: 'border-warning/20',
        iconBg: 'bg-warning/10',
        iconBorder: 'border-warning/30',
        text: 'text-warning',
        shadow: 'shadow-[0_0_20px_rgba(255,170,0,0.1)]',
        glow: '',
    },
    danger: {
        bg: 'bg-danger/5',
        border: 'border-danger/20',
        iconBg: 'bg-danger/10',
        iconBorder: 'border-danger/30',
        text: 'text-danger',
        shadow: 'shadow-[0_0_20px_rgba(255,51,102,0.1)]',
        glow: '',
    },
};

export default function MetricCard({ title, value, icon: Icon, trend, color, delay = 0 }: MetricCardProps) {
    const c = colorMap[color];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.4 }}
            className={`
        glass-panel p-5 flex items-center gap-4
        ${c.bg} ${c.border} ${c.shadow}
        hover:scale-[1.02] transition-transform duration-300 cursor-default
      `}
        >
            <div className={`p-3 rounded-xl ${c.iconBg} border ${c.iconBorder} ${c.glow}`}>
                <Icon className={`w-6 h-6 ${c.text}`} />
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">{title}</p>
                <div className="flex items-baseline gap-2">
                    <span className={`text-2xl font-bold ${c.text}`}>{value}</span>
                    {trend && (
                        <span className="text-xs text-success font-medium">{trend}</span>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
