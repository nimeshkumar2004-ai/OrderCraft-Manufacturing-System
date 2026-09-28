import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  Cpu,
  Boxes,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Factory,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Sidebar = ({ isOpen, onClose, onLogoutClick }) => {
  const { metrics, settings } = useApp();

  const navItems = [
    {
      name: 'Dashboard',
      path: '/',
      icon: LayoutDashboard,
      badge: null
    },
    {
      name: 'Orders',
      path: '/orders',
      icon: ShoppingCart,
      badge: metrics.pendingOrders > 0 ? `${metrics.pendingOrders}` : null,
      badgeColor: 'bg-orange-500 text-white'
    },
    {
      name: 'Production',
      path: '/production',
      icon: Cpu,
      badge: metrics.activeProduction > 0 ? `${metrics.activeProduction}` : null,
      badgeColor: 'bg-blue-600 text-white'
    },
    {
      name: 'Inventory',
      path: '/inventory',
      icon: Boxes,
      badge: metrics.lowStockCount > 0 ? `${metrics.lowStockCount}` : null,
      badgeColor: 'bg-amber-500 text-slate-900 font-bold'
    },
    {
      name: 'Customers',
      path: '/customers',
      icon: Users,
      badge: null
    },
    {
      name: 'Reports',
      path: '/reports',
      icon: BarChart3,
      badge: null
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: Settings,
      badge: null
    }
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <Factory className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold tracking-tight text-white font-sans">
                  Order<span className="text-orange-500">Craft</span>
                </span>
                <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  MFG
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Manufacturing ERP</p>
            </div>
          </div>
        </div>

        {/* Live Factory Status Strip */}
        <div className="px-5 py-3 border-b border-slate-800/60 bg-slate-950/20 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-slate-400 text-[11px] font-medium">Floor Lines: Active</span>
          </div>
          <span className="text-[11px] font-mono text-orange-400/90 font-medium">Shift 1</span>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Operations Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-orange-500 text-white shadow-sm font-semibold shadow-orange-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive ? 'text-white' : 'text-slate-400 group-hover:text-orange-400'
                        }`}
                      />
                      <span>{item.name}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold shadow-2xs ${
                          isActive ? 'bg-white text-orange-600' : item.badgeColor
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Critical Alerts Mini Banner */}
        {metrics.lowStockCount > 0 && (
          <div className="mx-3 mb-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
            <div className="flex items-center gap-2 text-amber-400 font-semibold mb-1">
              <AlertTriangle className="w-4 h-4" />
              <span>Inventory Alert</span>
            </div>
            <p className="text-[11px] text-slate-300">
              {metrics.lowStockCount} raw material item{metrics.lowStockCount > 1 ? 's' : ''} below minimum safety threshold.
            </p>
          </div>
        )}

        {/* User Profile Card at Bottom */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60">
          <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-850/50 hover:bg-slate-800 transition-colors">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={settings?.user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250"}
                alt={settings?.user?.name || "User"}
                className="w-9 h-9 rounded-full object-cover border-2 border-orange-500/40 shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">{settings?.user?.name || "Alex Vance"}</p>
                <p className="text-[11px] text-slate-400 truncate">{settings?.user?.role || "Operations Lead"}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onLogoutClick}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
              title="Logout"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
