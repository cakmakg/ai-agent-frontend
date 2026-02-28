import { motion } from 'framer-motion';
import { Clock, Users, ShieldAlert } from 'lucide-react';
import MetricCard from '../components/metric-card';
import ManualTaskPanel from '../components/ManualTaskPanel';
import InboxSimulatorPanel from '../components/InboxSimulatorPanel';

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            {/* Metric Cards Row */}
            <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
                aria-label="Dashboard-Metriken"
            >
                <MetricCard
                    title="Eingesparte Stunden"
                    value="124h"
                    icon={Clock}
                    trend="+12% diese Woche"
                    color="primary"
                    delay={0}
                />
                <MetricCard
                    title="Verarbeitete Leads"
                    value={45}
                    icon={Users}
                    trend="+8 heute"
                    color="success"
                    delay={0.1}
                />
                <MetricCard
                    title="Abgelehnte SPAM"
                    value={12}
                    icon={ShieldAlert}
                    color="danger"
                    delay={0.2}
                />
            </motion.section>

            {/* Main Panels */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8" aria-label="Steuerungspanels">
                <ManualTaskPanel />
                <InboxSimulatorPanel />
            </section>
        </div>
    );
}
