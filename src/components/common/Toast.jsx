import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useApp();

  if (!toasts || toasts.length === 0) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-500 shrink-0" />
  };

  const borderColors = {
    success: 'border-l-emerald-500',
    warning: 'border-l-amber-500',
    error: 'border-l-rose-500',
    info: 'border-l-blue-500'
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto bg-white rounded-xl shadow-lg border border-slate-200/80 border-l-4 ${
            borderColors[toast.type] || borderColors.info
          } p-3.5 flex items-start gap-3 transition-all transform animate-in slide-in-from-right duration-200`}
        >
          {icons[toast.type] || icons.info}
          <div className="flex-1 min-w-0">
            {toast.title && (
              <h5 className="text-xs font-bold text-slate-900 leading-tight">
                {toast.title}
              </h5>
            )}
            <p className="text-xs text-slate-600 mt-0.5 leading-snug">{toast.message}</p>
          </div>
          <button
            type="button"
            onClick={() => removeToast(toast.id)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
            aria-label="Dismiss toast"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
