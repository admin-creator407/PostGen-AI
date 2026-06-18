import React, { useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onClose: (id: string) => void;
}

const configs = {
  success: {
    icon: CheckCircle2,
    iconClass: 'text-emerald-400',
    barClass: 'bg-emerald-500',
    wrapClass: 'border-emerald-500/15',
  },
  error: {
    icon: AlertCircle,
    iconClass: 'text-rose-400',
    barClass: 'bg-rose-500',
    wrapClass: 'border-rose-500/15',
  },
  info: {
    icon: Info,
    iconClass: 'text-brand-light',
    barClass: 'bg-brand',
    wrapClass: 'border-brand/15',
  },
};

const ToastItem: React.FC<{ toast: ToastMessage; onClose: (id: string) => void }> = ({
  toast,
  onClose,
}) => {
  const { icon: Icon, iconClass, barClass, wrapClass } = configs[toast.type];

  useEffect(() => {
    const timer = setTimeout(() => onClose(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border bg-surface-2 shadow-card pointer-events-auto animate-slide-up overflow-hidden relative ${wrapClass}`}
    >
      {/* Left accent bar */}
      <div className={`absolute left-0 inset-y-0 w-[3px] rounded-l-xl ${barClass}`} />

      <Icon className={`w-4.5 h-4.5 shrink-0 mt-0.5 ${iconClass}`} />
      <p className="flex-1 text-sm font-medium text-zinc-200 leading-snug pr-1">{toast.message}</p>
      <button
        onClick={() => onClose(toast.id)}
        className="text-zinc-600 hover:text-zinc-300 transition-colors shrink-0 mt-0.5"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

const Toast: React.FC<ToastProps> = ({ toasts, onClose }) => (
  <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 w-[340px] pointer-events-none">
    {toasts.map((toast) => (
      <ToastItem key={toast.id} toast={toast} onClose={onClose} />
    ))}
  </div>
);

export default Toast;
