import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import NotificationToast from '@/Components/ui/NotificationToast';

interface ToastNotification {
  id: string;
  type: 'success' | 'danger' | 'warning' | 'primary';
  message: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (type: ToastNotification['type'], message: string, duration?: number) => void;
  hideToast: (id: string) => void;
  clearAll: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const hideToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showToast = useCallback((type: ToastNotification['type'], message: string, duration = 5000) => {
    const id = Date.now().toString();
    const toast: ToastNotification = { id, type, message, duration };

    setToasts(prev => [...prev, toast]);

    // Auto hide after duration
    if (duration > 0) {
      setTimeout(() => {
        setToasts(currentToasts => currentToasts.filter(t => t.id !== id));
      }, duration);
    }
  }, []);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast, clearAll }}>
      {children}

      {/* Toast Container */}
      <div
        className="toast-container position-fixed top-0 end-0 p-3"
        style={{ zIndex: 9999 }}
      >
        {toasts.map(toast => (
          <NotificationToast
            key={toast.id}
            type={toast.type}
            message={toast.message}
            onClose={() => hideToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}