import { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const config = {
  success: {
    icon: <CheckCircle2 size={18} className="text-emerald-500" />,
  },
  warning: {
    icon: <AlertTriangle size={18} className="text-amber-500" />,
  },
  info: {
    icon: <Info size={18} className="text-burgundy" />,
  },
};

export default function Toast() {
  const { toasts, removeToast } = useApp();

  useEffect(() => {
    if (!toasts.length) return;
    const timers = toasts.map((t) => setTimeout(() => removeToast(t.id), 4000));
    return () => timers.forEach(clearTimeout);
  }, [toasts, removeToast]);

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[90] flex flex-col items-center gap-2 px-4 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center gap-3 bg-ink text-ivory pl-3 pr-4 py-3 rounded-md shadow-xl animate-slide-in-down ${
            t.leaving ? 'animate-toast-out' : ''
          }`}
        >
          {config[t.type]?.icon}
          <span className="text-sm font-medium">{t.message}</span>
          <button
            onClick={() => removeToast(t.id)}
            className="text-ivory/50 hover:text-ivory transition-colors"
            aria-label="إغلاق"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}