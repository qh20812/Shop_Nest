import { AlertTriangle, CheckCircle2, Info, X, XCircle, type LucideIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

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

const toneClasses: Record<AlertTone, string> = {
    info: 'border-lacquer-wash bg-lacquer-wash/50 text-lacquer-deep',
    success: 'border-jade/20 bg-jade-soft text-jade',
    warning: 'border-turmeric/20 bg-turmeric-soft text-turmeric',
    danger: 'border-brick/20 bg-brick-soft text-brick',
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
        <div role="alert" className={cn('flex items-start gap-3 rounded-control border p-4', toneClasses[tone], className)}>
            <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                {title && <span className="text-body-sm font-semibold">{title}</span>}
                {description && <span className="text-body-sm text-ink-muted">{description}</span>}
                {children}
                {action && <div className="mt-2">{action}</div>}
            </div>
            {onDismiss && (
                <button
                    type="button"
                    aria-label="Đóng thông báo"
                    className="flex size-control-sm shrink-0 items-center justify-center rounded-chip transition-colors hover:bg-warm-porcelain/60 focus-ring"
                    onClick={onDismiss}
                >
                    <X aria-hidden="true" className="size-4" />
                </button>
            )}
        </div>
    );
}

export type { AlertProps, AlertTone };
export default Alert;
