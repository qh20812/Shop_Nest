import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import NotificationToast, { Toast } from '@/Components/ui/NotificationToast';

interface ToastContextType {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, 'id'>) => void;
    removeToast: (id: string) => void;
    success: (title: string, message?: string, duration?: number) => void;
    error: (title: string, message?: string, duration?: number) => void;
    warning: (title: string, message?: string, duration?: number) => void;
    info: (title: string, message?: string, duration?: number) => void;
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
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newToast: Toast = { ...toast, id };
        
        setToasts((prev) => [...prev, newToast]);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const success = useCallback((title: string, message?: string, duration?: number) => {
        addToast({ type: 'success', title, message, duration });
    }, [addToast]);

    const error = useCallback((title: string, message?: string, duration?: number) => {
        addToast({ type: 'danger', title, message, duration });
    }, [addToast]);

    const warning = useCallback((title: string, message?: string, duration?: number) => {
        addToast({ type: 'warning', title, message, duration });
    }, [addToast]);

    const info = useCallback((title: string, message?: string, duration?: number) => {
        addToast({ type: 'info', title, message, duration });
    }, [addToast]);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, warning, info }}>
            {children}
            
            {/* Toast Container */}
            <div className="toast-container">
                {toasts.map((toast) => (
                    <NotificationToast
                        key={toast.id}
                        toast={toast}
                        onClose={removeToast}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
}