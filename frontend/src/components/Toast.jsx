import { useEffect } from 'react';
import { useToast } from '../context/ToastContext';

const toastStyles = {
  success: 'border-brand-500/20 bg-brand-50 text-brand-700',
  error: 'border-red-200 bg-red-50 text-red-700'
};

const Toast = () => {
  const { toast, clearToast } = useToast();

  useEffect(() => {
    return () => clearToast();
  }, [clearToast]);

  if (!toast) return null;

  return (
    <div className="fixed right-4 top-4 z-50 animate-fadeUp">
      <div className={`min-w-[280px] rounded-2xl border px-4 py-3 shadow-soft ${toastStyles[toast.type] || toastStyles.success}`}>
        <div className="flex items-start justify-between gap-4">
          <p className="text-sm font-medium">{toast.message}</p>
          <button type="button" onClick={clearToast} className="text-xs font-semibold opacity-70 hover:opacity-100">
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;
