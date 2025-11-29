import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

let idCounter = 1;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback(({ title = '', message = '', type = 'info', duration = 3000 }) => {
    const id = idCounter++;
    setToasts((t) => [...t, { id, title, message, type }]);
    if (duration > 0) {
      setTimeout(() => {
        setToasts((t) => t.filter((x) => x.id !== id));
      }, duration);
    }
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      <div className="fixed left-1/2 -translate-x-1/2 bottom-20 z-50 flex flex-col items-center gap-2 w-full max-w-lg px-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`w-full rounded-xl p-3 shadow-lg bg-[hsl(var(--card))] border border-[hsl(var(--border))] flex items-start gap-3`}
          >
            <div className="flex-1">
              {toast.title && <div className="font-semibold text-white">{toast.title}</div>}
              {toast.message && <div className="text-sm text-gray-300 mt-1">{toast.message}</div>}
            </div>
            <button onClick={() => removeToast(toast.id)} className="text-gray-400 hover:text-gray-200">
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export default ToastContext;
