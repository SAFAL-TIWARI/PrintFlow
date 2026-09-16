import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CheckCircle2, Info, AlertTriangle, AlertCircle, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(({
    type = 'info',
    title = '',
    message = '',
    duration = 5000,
    tag = null
  }) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast = { id, type, title, message, duration, tag };

    setToasts((prev) => {
      // Keep at most 4 toasts visible at a time to keep UI uncluttered
      const updated = [...prev, newToast];
      return updated.slice(-4);
    });

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, [removeToast]);

  const toast = {
    success: (title, message = '', options = {}) => addToast({ type: 'success', title, message, ...options }),
    info: (title, message = '', options = {}) => addToast({ type: 'info', title, message, ...options }),
    warning: (title, message = '', options = {}) => addToast({ type: 'warning', title, message, ...options }),
    error: (title, message = '', options = {}) => addToast({ type: 'error', title, message, ...options }),
    custom: (options) => addToast(options),
    dismiss: (id) => removeToast(id)
  };

  return (
    <ToastContext.Provider value={{ toast, showToast: addToast, removeToast }}>
      {children}
      {/* Fixed bottom-right toast notification container */}
      <aside
        aria-live="polite"
        aria-label="Notifications"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-[calc(100vw-2.5rem)] pointer-events-none"
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} item={t} onDismiss={() => removeToast(t.id)} />
        ))}
      </aside>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

function ToastItem({ item, onDismiss }) {
  const { type, title, message, tag, duration = 5000 } = item;

  // Icon & Theme Styling based on semantic type
  const config = {
    success: {
      icon: CheckCircle2,
      iconColor: 'text-emerald-500 dark:text-emerald-400',
      iconBg: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-600 dark:text-emerald-400',
      progressBg: 'bg-emerald-500',
      borderColor: 'border-emerald-500/30'
    },
    info: {
      icon: Info,
      iconColor: 'text-blue-500 dark:text-blue-400',
      iconBg: 'bg-blue-500/10 border-blue-500/25 text-blue-600 dark:text-blue-400',
      progressBg: 'bg-blue-500',
      borderColor: 'border-blue-500/30'
    },
    warning: {
      icon: AlertTriangle,
      iconColor: 'text-amber-500 dark:text-amber-400',
      iconBg: 'bg-amber-500/10 border-amber-500/25 text-amber-600 dark:text-amber-400',
      progressBg: 'bg-amber-500',
      borderColor: 'border-amber-500/30'
    },
    error: {
      icon: AlertCircle,
      iconColor: 'text-rose-500 dark:text-rose-400',
      iconBg: 'bg-rose-500/10 border-rose-500/25 text-rose-600 dark:text-rose-400',
      progressBg: 'bg-rose-500',
      borderColor: 'border-rose-500/30'
    }
  }[type] || {
    icon: Info,
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-500/10 border-blue-500/25 text-blue-600',
    progressBg: 'bg-blue-500',
    borderColor: 'border-blue-500/30'
  };

  const Icon = config.icon;

  return (
    <div
      role="status"
      className={`pointer-events-auto relative overflow-hidden rounded-2xl p-3.5 shadow-2xl transition-all animate-toast-slide-in backdrop-blur-xl border ${config.borderColor} bg-white/95 dark:bg-[#16181b]/95 text-slate-900 dark:text-slate-100 shadow-slate-900/15 dark:shadow-black/60`}
      style={{ animationDuration: '0.3s' }}
    >
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${config.iconBg}`}>
          <Icon className="w-4 h-4" />
        </div>

        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h4 className="text-xs font-bold leading-tight text-slate-900 dark:text-white">
              {title}
            </h4>
            {tag && (
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-md bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                {tag}
              </span>
            )}
          </div>
          {message && (
            <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400 mt-1 font-medium">
              {message}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onDismiss}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors shrink-0"
          aria-label="Dismiss notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 5-second animated countdown progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-slate-100 dark:bg-white/5 overflow-hidden">
        <div
          className={`h-full ${config.progressBg} animate-toast-progress`}
          style={{ animationDuration: `${duration}ms` }}
        />
      </div>
    </div>
  );
}
