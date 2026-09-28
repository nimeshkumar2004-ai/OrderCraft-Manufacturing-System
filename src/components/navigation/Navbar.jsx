import React, { useState, useRef, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  Search,
  Calendar,
  ChevronDown,
  User,
  Settings,
  HelpCircle,
  LogOut,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Navbar = ({ onMenuClick, onLogoutClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { settings, metrics, activities, unreadAlertsCount, setUnreadAlertsCount, globalSearch, setGlobalSearch } = useApp();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Determine current page name & breadcrumb
  const getPageInfo = () => {
    switch (location.pathname) {
      case '/':
        return { title: 'Manufacturing Dashboard', crumb: 'Dashboard' };
      case '/orders':
        return { title: 'Order Management', crumb: 'Orders' };
      case '/production':
        return { title: 'Production Floor & Schedule', crumb: 'Production' };
      case '/inventory':
        return { title: 'Inventory & Stock Control', crumb: 'Inventory' };
      case '/customers':
        return { title: 'Customer Directory', crumb: 'Customers' };
      case '/reports':
        return { title: 'Analytics & Performance Reports', crumb: 'Reports' };
      case '/settings':
        return { title: 'System & Factory Settings', crumb: 'Settings' };
      default:
        return { title: 'OrderCraft ERP', crumb: 'Module' };
    }
  };

  const { title, crumb } = getPageInfo();

  // Current formatted date
  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date());

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (globalSearch && location.pathname !== '/orders') {
      navigate('/orders');
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between transition-all">
      {/* Left: Mobile hamburger & Breadcrumbs */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <nav className="flex items-center gap-1.5 text-xs text-slate-600">
            <Link to="/" className="hover:text-slate-800 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="font-semibold text-orange-600">{crumb}</span>
          </nav>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight tracking-tight">
            {title}
          </h1>
        </div>
      </div>

      {/* Center: Search input */}
      <form
        onSubmit={handleSearchSubmit}
        className="hidden md:flex items-center relative max-w-xs xl:max-w-md w-full mx-4"
      >
        <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
        <input
          type="text"
          value={globalSearch}
          onChange={(e) => setGlobalSearch(e.target.value)}
          placeholder="Search orders, batches, SKUs (e.g. ORD-1041)..."
          className="w-full pl-9 pr-4 py-1.5 text-xs sm:text-sm bg-slate-100 hover:bg-slate-100/80 focus:bg-white text-slate-900 placeholder:text-slate-400 border border-transparent focus:border-orange-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
        />
        {globalSearch && (
          <span className="absolute right-2 text-[10px] text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono">
            Press Enter
          </span>
        )}
      </form>

      {/* Right: Date, Notifications & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Date Display */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100/80 border border-slate-200/60 text-xs text-slate-700 font-medium">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>{todayFormatted}</span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setUnreadAlertsCount(0);
            }}
            className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadAlertsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-white ring-1 ring-orange-500 animate-pulse" />
            )}
          </button>

          {/* Notifications Flyout */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in duration-150">
              <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Manufacturing Alerts
                  </h4>
                  <span className="text-[10px] font-bold bg-orange-100 text-orange-700 px-1.5 py-0.2 rounded-full">
                    {activities.length} Recent
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">Shop Floor Feed</span>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {activities.slice(0, 6).map((act) => (
                  <div key={act.id} className="p-3 hover:bg-slate-50 transition-colors text-xs flex gap-3">
                    <div className="mt-0.5 shrink-0">
                      {act.type === 'inventory' ? (
                        <div className="w-6 h-6 rounded-md bg-amber-100 text-amber-600 flex items-center justify-center">
                          <AlertTriangle className="w-3.5 h-3.5" />
                        </div>
                      ) : act.type === 'production' ? (
                        <div className="w-6 h-6 rounded-md bg-blue-100 text-blue-600 flex items-center justify-center">
                          <Clock className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-600 flex items-center justify-center">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <p className="font-semibold text-slate-800 truncate">{act.title}</p>
                        <span className="text-[10px] text-slate-400 shrink-0">{act.time}</span>
                      </div>
                      <p className="text-slate-500 text-[11px] mt-0.5 line-clamp-2">{act.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-2 border-t border-slate-100 bg-slate-50/50 text-center">
                <Link
                  to="/"
                  onClick={() => setNotificationsOpen(false)}
                  className="text-xs font-semibold text-orange-600 hover:text-orange-700"
                >
                  View Live Shop Floor Activities &rarr;
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-lg hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
          >
            <img
              src={settings?.user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250"}
              alt="Avatar"
              className="w-7 h-7 rounded-full object-cover border border-slate-300"
            />
            <span className="hidden lg:block text-xs font-semibold text-slate-800">
              {settings?.user?.name || "Alex Vance"}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in duration-150">
              <div className="px-4 py-2.5 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{settings?.user?.name || "Alex Vance"}</p>
                <p className="text-[11px] text-slate-500 truncate">{settings?.user?.email || "alex.vance@ordercraft.io"}</p>
                <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-orange-50 text-orange-700 border border-orange-200">
                  {settings?.user?.role || "Operations Director"}
                </span>
              </div>

              <div className="py-1 text-xs text-slate-700">
                <Link
                  to="/settings"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 transition-colors"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Profile Settings</span>
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Factory Preferences</span>
                </Link>
              </div>

              <div className="pt-1 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    onLogoutClick();
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Sign Out (Demo)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
