import React from 'react';

export const StatusBadge = ({ status, type = 'status' }) => {
  if (!status) return null;

  const s = status.toLowerCase();

  // Status mapping
  let bgClass = 'bg-slate-100 text-slate-700 border-slate-200';
  let dotClass = 'bg-slate-400';

  if (s === 'completed' || s === 'delivered' || s === 'in stock') {
    bgClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    dotClass = 'bg-emerald-500';
  } else if (s === 'in production' || s === 'in progress') {
    bgClass = 'bg-blue-50 text-blue-700 border-blue-200';
    dotClass = 'bg-blue-500 animate-pulse';
  } else if (s === 'pending' || s === 'scheduled' || s === 'low stock' || s === 'medium') {
    bgClass = 'bg-amber-50 text-amber-700 border-amber-200';
    dotClass = 'bg-amber-500';
  } else if (s === 'confirmed' || s === 'quality check' || s === 'high') {
    bgClass = 'bg-orange-50 text-orange-700 border-orange-200';
    dotClass = 'bg-orange-500';
  } else if (s === 'cancelled' || s === 'out of stock' || s === 'urgent' || s === 'on hold') {
    bgClass = 'bg-rose-50 text-rose-700 border-rose-200';
    dotClass = 'bg-rose-500';
  } else if (s === 'active') {
    bgClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    dotClass = 'bg-emerald-500';
  } else if (s === 'low') {
    bgClass = 'bg-slate-100 text-slate-600 border-slate-200';
    dotClass = 'bg-slate-400';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border shadow-xs ${bgClass}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotClass}`} />
      <span>{status}</span>
    </span>
  );
};
