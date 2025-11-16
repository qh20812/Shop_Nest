import React, { useEffect, useState, useCallback } from 'react';
import '@/../css/NotificationToast.css';

export interface Toast {
    id: string;
    type: 'success' | 'danger' | 'warning' | 'info';
    title: string;
    message?: string;
    duration?: number;
}

interface NotificationToastProps {
    toast: Toast;
    onClose: (id: string) => void;
}

const iconMap = {
    success: 'bi-check',
    danger: 'bi-x',
    warning: 'bi-exclamation-triangle',
    info: 'bi-info-circle',
};

function NotificationToast({ toast, onClose }: NotificationToastProps) {
    const [isExiting, setIsExiting] = useState(false);

    const handleClose = useCallback(() => {
        setIsExiting(true);
        setTimeout(() => {
            onClose(toast.id);
        }, 300); // Match animation duration
    }, [toast.id, onClose]);

    useEffect(() => {
        const duration = toast.duration ?? 5000;
        
        const timer = setTimeout(() => {
            handleClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [toast.duration, handleClose]);

    return (
        <div className={`notification-toast ${isExiting ? 'toast-exit' : ''}`}>
            <div className={`toast-icon-wrapper toast-icon-wrapper--${toast.type}`}>
                <i className={`bi ${iconMap[toast.type]} toast-icon`}></i>
            </div>
            <div className="toast-content">
                <p className="toast-title">{toast.title}</p>
                {toast.message && (
                    <p className="toast-message">{toast.message}</p>
                )}
            </div>
            <button 
                className="toast-close"
                onClick={handleClose}
                aria-label="Đóng"
            >
                <i className="bi bi-x toast-close-icon"></i>
            </button>
        </div>
    );
}

export default NotificationToast;