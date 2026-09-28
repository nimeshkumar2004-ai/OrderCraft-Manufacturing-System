import React, { useState } from 'react';
import {
  Building2,
  User,
  Bell,
  Palette,
  RotateCcw,
  LogOut,
  Save,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Database,
  Sliders,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ConfirmDialog } from '../components/common/ConfirmDialog';

export const Settings = () => {
  const { settings, updateSettings, resetDemoData, orders, production, inventory, customers, addToast } = useApp();

  const [activeTab, setActiveTab] = useState('company'); // 'company' | 'user' | 'notifications' | 'data'

  // Company Form State
  const [companyForm, setCompanyForm] = useState(settings?.company || {});
  // User Form State
  const [userForm, setUserForm] = useState(settings?.user || {});
  // Notification Preferences State
  const [notifForm, setNotifForm] = useState(settings?.notifications || {});
  // Appearance
  const [appearanceForm, setAppearanceForm] = useState(settings?.appearance || {});

  // Confirm Reset Modal
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleSaveCompany = (e) => {
    e.preventDefault();
    updateSettings('company', companyForm);
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    updateSettings('user', userForm);
  };

  const handleToggleNotif = (key) => {
    const updated = { ...notifForm, [key]: !notifForm[key] };
    setNotifForm(updated);
    updateSettings('notifications', updated);
  };

  const handleToggleAppearance = (key) => {
    const updated = { ...appearanceForm, [key]: !appearanceForm[key] };
    setAppearanceForm(updated);
    updateSettings('appearance', updated);
  };

  const handleConfirmReset = () => {
    resetDemoData();
    setCompanyForm(settings?.company || {});
    setUserForm(settings?.user || {});
  };

  const handleConfirmLogout = () => {
    addToast({
      type: 'info',
      title: 'Demo Session Logged Out',
      message: 'You have simulated signing out. Local browser state is retained.'
    });
  };

  const tabs = [
    { id: 'company', label: 'Company Profile', icon: Building2 },
    { id: 'user', label: 'User Account', icon: User },
    { id: 'notifications', label: 'Alerts & Notifications', icon: Bell },
    { id: 'data', label: 'Demo Data Management', icon: Database }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          System &amp; Factory Settings
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Configure plant profile, user credentials, notification triggers, and demo data state.
        </p>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: COMPANY PROFILE */}
      {activeTab === 'company' && (
        <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs max-w-4xl">
          <div className="mb-5 pb-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Manufacturing Entity Details
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Primary business identity shown across purchase orders, invoices, and plant schedules.
              </p>
            </div>
            <span className="text-xs font-mono font-semibold text-slate-400 bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
              Tax ID: {companyForm.taxId}
            </span>
          </div>

          <form onSubmit={handleSaveCompany} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Operating Brand Name
                </label>
                <input
                  type="text"
                  value={companyForm.name || ''}
                  onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Legal Registration Title
                </label>
                <input
                  type="text"
                  value={companyForm.legalName || ''}
                  onChange={(e) => setCompanyForm({ ...companyForm, legalName: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Plant &amp; Headquarters Address
                </label>
                <input
                  type="text"
                  value={companyForm.plantAddress || ''}
                  onChange={(e) => setCompanyForm({ ...companyForm, plantAddress: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Operations Support Email
                </label>
                <input
                  type="email"
                  value={companyForm.supportEmail || ''}
                  onChange={(e) => setCompanyForm({ ...companyForm, supportEmail: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Facility Telephone
                </label>
                <input
                  type="text"
                  value={companyForm.phone || ''}
                  onChange={(e) => setCompanyForm({ ...companyForm, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Accounting Currency
                </label>
                <input
                  type="text"
                  value={companyForm.currency || 'USD ($)'}
                  onChange={(e) => setCompanyForm({ ...companyForm, currency: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Timezone Standard
                </label>
                <input
                  type="text"
                  value={companyForm.timezone || 'America/New_York (EST)'}
                  onChange={(e) => setCompanyForm({ ...companyForm, timezone: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
            </div>

            <div className="flex items-center justify-end pt-4 border-t border-slate-100">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Company Profile</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB CONTENT: USER ACCOUNT */}
      {activeTab === 'user' && (
        <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs max-w-4xl">
          <div className="mb-5 pb-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Operator &amp; Administrator Account
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Personalized profile information for the active manufacturing director session.
            </p>
          </div>

          <form onSubmit={handleSaveUser} className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/70">
              <img
                src={userForm.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250"}
                alt="Profile Avatar"
                className="w-16 h-16 rounded-full object-cover border-2 border-orange-500 shrink-0 shadow-sm"
              />
              <div className="flex-1 min-w-0 text-center sm:text-left">
                <h4 className="font-bold text-slate-900 text-sm">{userForm.name}</h4>
                <p className="text-xs text-slate-500">{userForm.role}</p>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">{userForm.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={userForm.name || ''}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Assigned ERP Role
                </label>
                <input
                  type="text"
                  value={userForm.role || ''}
                  onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  User Email Address
                </label>
                <input
                  type="email"
                  value={userForm.email || ''}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={userForm.department || ''}
                  onChange={(e) => setUserForm({ ...userForm, department: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Avatar Image URL
                </label>
                <input
                  type="text"
                  value={userForm.avatar || ''}
                  onChange={(e) => setUserForm({ ...userForm, avatar: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsLogoutModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Simulate Logout</span>
              </button>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB CONTENT: NOTIFICATIONS & APPEARANCE */}
      {activeTab === 'notifications' && (
        <div className="space-y-6 max-w-4xl">
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-1">
              Manufacturing Notification Triggers
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Configure which critical operational events generate alerts in the navbar and dashboard.
            </p>

            <div className="space-y-3 divide-y divide-slate-100">
              {[
                {
                  key: 'lowStockAlerts',
                  title: 'Raw Material Low Stock Warnings',
                  desc: 'Notify immediately when available inventory drops below the safety threshold.'
                },
                {
                  key: 'productionBottlenecks',
                  title: 'Production Bottlenecks & Station Idle Times',
                  desc: 'Alert supervisors if a batch remains on scheduled state past target kickoff.'
                },
                {
                  key: 'orderStatusUpdates',
                  title: 'Order Status Transitions',
                  desc: 'Post alert events when orders transition to In Production or Completed.'
                },
                {
                  key: 'qualityHoldNotices',
                  title: 'Quality Check Clearance & Holds',
                  desc: 'Broadcast CMM tolerance inspection results and quality signoffs.'
                }
              ].map((item) => (
                <div key={item.key} className="pt-3 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold text-slate-900">{item.title}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleNotif(item.key)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 shrink-0 ${
                      notifForm[item.key] ? 'bg-orange-500' : 'bg-slate-200'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                        notifForm[item.key] ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-1">
              Display &amp; Table Preferences
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Adjust visual density and responsive layout options.
            </p>

            <div className="space-y-3 divide-y divide-slate-100">
              <div className="pt-3 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold text-slate-900">Show KPI Metric Trends</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Display percentage variations and comparison badges on summary cards.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleAppearance('showMetricsTrends')}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 shrink-0 ${
                    appearanceForm.showMetricsTrends ? 'bg-orange-500' : 'bg-slate-200'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                      appearanceForm.showMetricsTrends ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: DEMO DATA MANAGEMENT */}
      {activeTab === 'data' && (
        <div className="space-y-6 max-w-4xl">
          {/* Status summary of saved demo items */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <Database className="w-4 h-4 text-orange-500" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Active LocalStorage Database State
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              This application operates entirely in your browser using persistent local storage. All created orders, batch runs, and SKU restocks remain intact between page refreshes.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <span className="text-[11px] font-semibold text-slate-500 uppercase block">Orders</span>
                <span className="text-xl font-bold font-mono text-slate-900">{orders.length}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <span className="text-[11px] font-semibold text-slate-500 uppercase block">Batches</span>
                <span className="text-xl font-bold font-mono text-slate-900">{production.length}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <span className="text-[11px] font-semibold text-slate-500 uppercase block">SKUs</span>
                <span className="text-xl font-bold font-mono text-slate-900">{inventory.length}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <span className="text-[11px] font-semibold text-slate-500 uppercase block">Clients</span>
                <span className="text-xl font-bold font-mono text-slate-900">{customers.length}</span>
              </div>
            </div>
          </div>

          {/* Reset Demo Data Card */}
          <div className="bg-rose-50/40 rounded-xl border border-rose-200/80 p-6 shadow-xs">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-rose-100 text-rose-600 rounded-xl shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>

              <div className="flex-1">
                <h4 className="text-sm font-bold text-slate-900">
                  Reset to Initial Demo Data
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Resetting demo data clears your custom modifications and restores the rich initial baseline dataset (10 sample manufacturing orders, 8 production runs, 12 inventory materials, and 6 commercial client accounts).
                </p>

                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => setIsResetModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restore Baseline Demo Data</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM RESET MODAL */}
      <ConfirmDialog
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleConfirmReset}
        title="Reset Demo Data to Default"
        message="This will overwrite all existing local changes and restore the pristine manufacturing demo dataset. Are you sure you wish to continue?"
        confirmText="Yes, Reset Data"
        type="warning"
      />

      {/* CONFIRM LOGOUT MODAL */}
      <ConfirmDialog
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        title="Sign Out (Demo)"
        message="Simulate ending your current user session. Your changes will still be retained in localStorage."
        confirmText="Sign Out"
        type="info"
      />
    </div>
  );
};
