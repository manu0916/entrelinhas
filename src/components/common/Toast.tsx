import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

let toastListener: ((toasts: ToastMessage[]) => void) | null = null;
let toastQueue: ToastMessage[] = [];

export const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
  const id = Math.random().toString(36).substring(2, 9);
  const newToast: ToastMessage = { id, type, message };
  toastQueue = [...toastQueue, newToast];
  if (toastListener) {
    toastListener(toastQueue);
  }
  setTimeout(() => {
    toastQueue = toastQueue.filter(t => t.id !== id);
    if (toastListener) {
      toastListener(toastQueue);
    }
  }, 4000);
};

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    toastListener = setToasts;
    return () => {
      toastListener = null;
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-lg shadow-modal border text-sm animate-fade-in ${
            toast.type === 'success'
              ? 'bg-[#E8F1EF] text-pine border-pine/20'
              : toast.type === 'error'
              ? 'bg-[#FAECE7] text-terracotta border-terracotta/20'
              : 'bg-paper text-ink border-border-subtle'
          }`}
        >
          <div className="flex items-center gap-2">
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 shrink-0" />}
            <span className="font-medium">{toast.message}</span>
          </div>
          <button
            onClick={() => {
              toastQueue = toastQueue.filter(t => t.id !== toast.id);
              setToasts(toastQueue);
            }}
            className="p-0.5 hover:opacity-75"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
