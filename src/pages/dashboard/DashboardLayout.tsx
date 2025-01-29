import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useIsMobile } from '../../hooks/useIsMobile';
import { RestaurantSettings } from '../../types';
import { StaffMember } from '../../types/staff';
import { DashboardHeader } from './components/DashboardHeader';
import { DashboardSidebar } from './components/DashboardSidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
  isStaff: boolean;
  staffData: StaffMember | null;
  settings: RestaurantSettings | null;
}

export function DashboardLayout({
  children,
  onLogout,
  settings,
  isStaff,
  staffData,
}: DashboardLayoutProps) {
  const location = useLocation();
  const currentPage = location.pathname.split('/dashboard/')[1] || '';
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col bg-gray-50 dark:bg-gray-900 overflow-hidden h-screen text-gray-500 dark:text-gray-400 bg-[var(--bg-color)]">
      {/* Only show header on desktop */}
      {!isMobile && (
        <DashboardHeader
          onLogout={onLogout}
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      )}

      <div className="flex-1 flex">
        {/* Sidebar - Hidden on mobile by default */}
        {!isMobile && (
          <DashboardSidebar
            currentPage={currentPage}
            onClose={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {isMobile && isSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40"
                onClick={() => setIsSidebarOpen(false)}
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 w-64 z-50"
              >
                <DashboardSidebar
                  currentPage={currentPage}
                  onClose={() => setIsSidebarOpen(false)}
                  isStaff={isStaff}
                  staffData={staffData}
                  settings={settings}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 h-[calc(100vh-64px)] overflow-y-scroll">
          <div className="overflow-y-scroll p-4 md:p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="container mx-auto max-w-7xl"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
