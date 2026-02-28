import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './components/sidebar';
import { CrmProvider } from './store/use-crm-store';
import { SettingsProvider } from './store/use-settings-store';

function App() {
  const [isSidebarCollapsed] = useState(false);

  return (
    <SettingsProvider>
      <CrmProvider>
        <div className="min-h-screen flex">
          {/* Sidebar Navigation */}
          <Sidebar />

          {/* Main Content Area */}
          <motion.main
            animate={{ marginLeft: isSidebarCollapsed ? 72 : 240 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="flex-1 min-h-screen p-6 md:p-8"
          >
            {/* Header Bar */}
            <motion.header
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between mb-8"
            >
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white">
                  Antigravity <span className="text-primary neon-text-blue">Nexus</span>
                </h1>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mt-1">
                  Autonomous AI Factory – Command Center
                </p>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full border border-white/5 shadow-glass">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-success shadow-neon-blue" />
                  </span>
                  <span className="text-gray-300 font-medium">7 Sub-Agents Active</span>
                </div>
              </div>
            </motion.header>

            {/* Page Content (Rendered by Router) */}
            <Outlet />

            {/* Background Decorations */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
              <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
              <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px]" />
            </div>
          </motion.main>
        </div>
      </CrmProvider>
    </SettingsProvider>
  );
}

export default App;
