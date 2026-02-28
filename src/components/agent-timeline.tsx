import { motion } from 'framer-motion';
import type { AgentStep } from '../types';

interface AgentTimelineProps {
    steps: AgentStep[];
    title?: string;
}

const statusConfig = {
    idle: {
        dotColor: 'bg-gray-600',
        lineColor: 'bg-gray-700',
        textColor: 'text-gray-500',
        borderColor: 'border-gray-700',
    },
    active: {
        dotColor: 'bg-primary',
        lineColor: 'bg-primary/30',
        textColor: 'text-primary',
        borderColor: 'border-primary/30',
    },
    completed: {
        dotColor: 'bg-success',
        lineColor: 'bg-success/30',
        textColor: 'text-success',
        borderColor: 'border-success/30',
    },
    error: {
        dotColor: 'bg-danger',
        lineColor: 'bg-danger/30',
        textColor: 'text-danger',
        borderColor: 'border-danger/30',
    },
};

export default function AgentTimeline({ steps, title = 'Live Agent Activity' }: AgentTimelineProps) {
    const hasActivity = steps.some(s => s.status !== 'idle');

    if (!hasActivity) return null;

    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-panel p-5 mt-4 overflow-hidden"
        >
            <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">{title}</h3>
            </div>

            <div className="space-y-0 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                {steps.map((step, index) => {
                    const config = statusConfig[step.status];
                    const isLast = index === steps.length - 1;

                    return (
                        <div key={step.id} className="flex gap-3 relative">
                            {/* Vertical Line + Dot */}
                            <div className="flex flex-col items-center flex-shrink-0 w-6">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{
                                        scale: step.status === 'idle' ? 0.6 : 1,
                                        boxShadow: step.status === 'active'
                                            ? '0 0 12px rgba(0, 240, 255, 0.6)'
                                            : step.status === 'completed'
                                                ? '0 0 8px rgba(0, 255, 170, 0.4)'
                                                : 'none',
                                    }}
                                    transition={{ duration: 0.3 }}
                                    className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${config.dotColor}
                    ${step.status === 'active' ? 'animate-pulse' : ''}`}
                                />
                                {!isLast && (
                                    <div className={`w-0.5 flex-1 min-h-[20px] ${config.lineColor} transition-colors duration-300`} />
                                )}
                            </div>

                            {/* Step Content */}
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{
                                    opacity: step.status === 'idle' ? 0.3 : 1,
                                    x: 0,
                                }}
                                transition={{ duration: 0.3 }}
                                className={`pb-4 flex-1 border-b ${isLast ? 'border-transparent' : 'border-white/5'}`}
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-base">{step.icon}</span>
                                    <span className={`text-xs font-bold uppercase tracking-wider ${config.textColor}`}>
                                        {step.agentName}
                                    </span>
                                    {step.status === 'completed' && (
                                        <span className="text-success text-xs">✓</span>
                                    )}
                                    {step.status === 'error' && (
                                        <span className="text-danger text-xs font-bold">✗</span>
                                    )}
                                </div>
                                <p className={`text-sm mt-0.5 ${step.status === 'idle' ? 'text-gray-600' : 'text-gray-400'}`}>
                                    {step.message}
                                </p>
                            </motion.div>
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
}
