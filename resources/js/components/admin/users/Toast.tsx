import { CheckCircle2, X, XCircle } from 'lucide-react';
import { useEffect } from 'react';

import styles from './toast.module.css';

interface ToastProps {
    type: 'success' | 'error';
    message: string;
    onClose: () => void;
}

export default function Toast({ type, message, onClose }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 4000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const Icon = type === 'success' ? CheckCircle2 : XCircle;
    const tone = type === 'success' ? 'success' : 'error';

    return (
        <div className={styles.wrap}>
            <div role="status" aria-live="polite" className="sn-toast">
                <span data-tone={tone} className="sn-toast__icon">
                    <Icon aria-hidden="true" />
                </span>
                <div className="sn-toast__body">
                    <span className="sn-toast__description">{message}</span>
                </div>
                <button type="button" aria-label="Đóng thông báo" className="sn-toast__close" onClick={onClose}>
                    <X aria-hidden="true" />
                </button>
            </div>
        </div>
    );
}
