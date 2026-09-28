import React from 'react';
import { Modal } from './Modal';
import { AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger' // 'danger' | 'warning' | 'info'
}) => {
  const icons = {
    danger: <AlertTriangle className="w-6 h-6 text-rose-600" />,
    warning: <AlertTriangle className="w-6 h-6 text-amber-600" />,
    info: <Info className="w-6 h-6 text-blue-600" />
  };

  const btnColors = {
    danger: 'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500',
    warning: 'bg-amber-600 hover:bg-amber-700 text-white focus:ring-amber-500',
    info: 'bg-navy-900 hover:bg-navy-800 text-white focus:ring-navy-500'
  };

  const iconBg = {
    danger: 'bg-rose-50 border-rose-100',
    warning: 'bg-amber-50 border-amber-100',
    info: 'bg-blue-50 border-blue-100'
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="flex items-start gap-4 pt-1">
        <div className={`p-3 rounded-full border shrink-0 ${iconBg[type]}`}>
          {icons[type]}
        </div>
        <div>
          <h4 className="text-base font-bold text-slate-900">{title}</h4>
          <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{message}</p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
        >
          {cancelText}
        </button>
        <button
          type="button"
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className={`px-4 py-2 text-sm font-semibold rounded-lg shadow-xs transition-colors focus:ring-2 focus:ring-offset-2 ${btnColors[type]}`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};
