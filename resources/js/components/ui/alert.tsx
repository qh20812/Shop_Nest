import { AlertTriangle, CheckCircle2, Info, X, XCircle, type LucideIcon } from 'lucide-react';
import * as React from 'react';

import { cx } from '@/lib/cx';

type AlertTone = 'info' | 'success' | 'warning' | 'danger';

type AlertProps = {
    tone?: AlertTone;
    title?: React.ReactNode;
    description?: React.ReactNode;
    children?: React.ReactNode;
    icon?: LucideIcon;
    onDismiss?: () => void;
    action?: React.ReactNode;
    className?: string;
};

const toneIcons = {
    info: Info,
    success: CheckCircle2,
    warning: AlertTriangle,
    danger: XCircle,
};

export function Alert({ tone = 'info', title, description, children, icon, onDismiss, action, className }: AlertProps) {
    const Icon = icon ?? toneIcons[tone];

    return (
        <div role="alert" data-slot="alert" data-tone={tone} className={cx('sn-alert', className)}>
            <Icon aria-hidden="true" className="sn-alert__icon" />
            <div className="sn-alert__body">
                {title && <span className="sn-alert__title">{title}</span>}
                {description && <span className="sn-alert__description">{description}</span>}
                {children}
                {action && <div className="sn-alert__action">{action}</div>}
            </div>
            {onDismiss && (
                <button type="button" aria-label="Đóng thông báo" className="sn-alert__close" onClick={onDismiss}>
                    <X aria-hidden="true" />
                </button>
            )}
        </div>
    );
}

export type { AlertProps, AlertTone };
export default Alert;
