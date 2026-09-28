import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/navigation/Sidebar';
import { Navbar } from '../components/navigation/Navbar';
import { ToastContainer } from '../components/common/Toast';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { useApp } from '../context/AppContext';

export const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const { addToast } = useApp();

  const handleLogoutConfirm = () => {
    addToast({
      type: 'info',
      title: 'Demo Session Logged Out',
      message: 'You have simulated signing out. In this frontend demo, your local records remain safely saved in localStorage.'
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Fixed Left Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogoutClick={() => setLogoutModalOpen(true)}
      />

      {/* Main Content Area (offset by 64 tailwind units on lg screens) */}
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
        {/* Top Navbar */}
        <Navbar
          onMenuClick={() => setSidebarOpen(true)}
          onLogoutClick={() => setLogoutModalOpen(true)}
        />

        {/* Content Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto transition-all">
          <Outlet />
        </main>

        {/* Page Footer */}
        <footer className="py-4 px-6 border-t border-slate-200/80 bg-white/50 text-center text-xs text-slate-400">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>
              OrderCraft &copy; {new Date().getFullYear()} – Manufacturing Order &amp; Operations Management System
            </p>
            <div className="flex items-center gap-4 text-[11px] text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> System Online (Demo Mode)
              </span>
              <span>•</span>
              <span>All Client Data Saved in Browser</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Global Toast Container */}
      <ToastContainer />

      {/* Logout Dialog */}
      <ConfirmDialog
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
        title="Sign Out of OrderCraft"
        message="Are you sure you want to end your current demo session? Any orders and inventory changes you've made will be preserved in your browser."
        confirmText="Yes, Sign Out"
        type="info"
      />
    </div>
  );
};
