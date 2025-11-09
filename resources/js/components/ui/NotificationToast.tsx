import React from 'react'
import '../../../css/Notification.css'

interface NotificationToastProps {
    type?: 'success' | 'danger' | 'warning' | 'primary';
    message?: string;
    onClose?: () => void;
}

function NotificationToast({ type = 'primary', message = 'Hello, world! This is a toast message.', onClose }: NotificationToastProps) {
    const toastClass = `toast align-items-center border-0 toast-${type}`;

    return (
        <div className={toastClass} role="alert" aria-live="assertive" aria-atomic="true">
            <div className="d-flex">
                <div className="toast-body">
                    {message}
                </div>
                <button type="button" className="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close" onClick={onClose}></button>
            </div>
        </div>
    )
}

export default NotificationToast