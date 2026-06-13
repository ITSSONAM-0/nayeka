import React, { useState, useEffect } from 'react';

let toastCallback = null;

export const toast = {
  success: (message) => {
    if (toastCallback) toastCallback({ type: 'success', message });
  },
  error: (message) => {
    if (toastCallback) toastCallback({ type: 'error', message });
  },
  info: (message) => {
    if (toastCallback) toastCallback({ type: 'info', message });
  }
};

export const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    toastCallback = ({ type, message }) => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, type, message }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    };
    return () => {
      toastCallback = null;
    };
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`p-4 rounded-xl shadow-lg border text-white font-medium flex items-center justify-between gap-3 animate-slide-in pointer-events-auto border-white/10 ${
            t.type === 'success'
              ? 'bg-emerald-600 shadow-emerald-900/10'
              : t.type === 'error'
              ? 'bg-rose-600 shadow-rose-900/10'
              : 'bg-amber-600 shadow-amber-900/10'
          }`}
        >
          <div className="flex items-center gap-3">
            {t.type === 'success' && (
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            )}
            {t.type === 'error' && (
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            {t.type === 'info' && (
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <span className="text-sm">{t.message}</span>
          </div>
          <button
            onClick={() => removeToast(t.id)}
            className="text-white/70 hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};
