import { useState, useCallback, useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Kanban,
    Settings,
    Bot,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';

interface NavItem {
    path: string;
    label: string;
    icon: React.ReactNode;
    badge?: string;
    disabled?: boolean;
}

export default function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const location = useLocation();

    const toggleCollapse = useCallback(() => {
        setIsCollapsed(prev => !prev);
    }, []);

    const navItems: NavItem[] = useMemo(() => [
        {
            path: '/',
            label: 'Dashboard',
            icon: <LayoutDashboard className="w-5 h-5" />,
        },
        {
            path: '/crm',
            label: 'CRM Board',
            icon: <Kanban className="w-5 h-5" />,
            badge: 'Faz 2',
            disabled: true,
        },
        {
            path: '/settings',
            label: 'Einstellungen',
            icon: <Settings className="w-5 h-5" />,
            badge: 'Faz 3',
            disabled: true,
        },
    ], []);

    return (
        <motion.aside
            animate={{ width: isCollapsed ? 72 : 240 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed left-0 top-0 h-screen flex flex-col z-50
                 bg-surface/80 backdrop-blur-2xl border-r border-white/5
                 shadow-[4px_0_24px_rgba(0,0,0,0.3)]"
        >
            {/* Logo */}
            <div className="p-4 border-b border-white/5 flex items-center gap-3 min-h-[72px]">
                <div className="p-2 bg-primary/10 rounded-xl border border-primary/30 shadow-neon-blue flex-shrink-0">
                    <Bot className="w-5 h-5 text-primary" />
                </div>
                <AnimatePresence>
                    {!isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden whitespace-nowrap"
                        >
                            <h1 className="text-base font-bold text-white leading-tight">
                                Antigravity <span className="text-primary neon-text-blue">Nexus</span>
                            </h1>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">
                                Command Center
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 flex flex-col gap-1" role="navigation" aria-label="Hauptnavigation">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.disabled ? '#' : item.path}
                            onClick={(e) => item.disabled && e.preventDefault()}
                            className={`
                group relative flex items-center gap-3 px-3 py-3 rounded-xl
                transition-all duration-200 text-sm font-medium
                ${isActive
                                    ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_12px_rgba(0,240,255,0.15)]'
                                    : item.disabled
                                        ? 'text-gray-600 cursor-not-allowed'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                                }
              `}
                            aria-current={isActive ? 'page' : undefined}
                            aria-disabled={item.disabled}
                        >
                            <span className={`flex-shrink-0 transition-colors ${isActive ? 'text-primary' : ''}`}>
                                {item.icon}
                            </span>

                            <AnimatePresence>
                                {!isCollapsed && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -5 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -5 }}
                                        transition={{ duration: 0.15 }}
                                        className="overflow-hidden whitespace-nowrap flex items-center gap-2"
                                    >
                                        {item.label}
                                        {item.badge && (
                                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-gray-500 border border-white/5 font-mono">
                                                {item.badge}
                                            </span>
                                        )}
                                    </motion.span>
                                )}
                            </AnimatePresence>

                            {/* Active indicator bar */}
                            {isActive && (
                                <motion.div
                                    layoutId="sidebar-active"
                                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-primary rounded-r-full shadow-neon-blue"
                                />
                            )}
                        </NavLink>
                    );
                })}
            </nav>

            {/* Collapse Toggle */}
            <div className="p-3 border-t border-white/5">
                <button
                    onClick={toggleCollapse}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl
                     text-gray-500 hover:text-white hover:bg-white/5
                     transition-all duration-200 text-xs font-medium"
                    aria-label={isCollapsed ? 'Menü erweitern' : 'Menü verkleinern'}
                >
                    {isCollapsed ? (
                        <ChevronRight className="w-4 h-4" />
                    ) : (
                        <>
                            <ChevronLeft className="w-4 h-4" />
                            <span>Einklappen</span>
                        </>
                    )}
                </button>
            </div>
        </motion.aside>
    );
}
