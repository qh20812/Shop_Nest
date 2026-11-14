import { Inbox, type LucideIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

type EmptyStateProps = {
    icon?: LucideIcon;
    title: React.ReactNode;
    description?: React.ReactNode;
    actions?: React.ReactNode;
    className?: string;
};

export function EmptyState({ icon: Icon = Inbox, title, description, actions, className }: EmptyStateProps) {
    return (
        <div
            className={cn(
                'flex w-full flex-col items-center justify-center rounded-card border border-border bg-warm-porcelain px-6 py-12 text-center',
                className,
            )}
        >
            <span className="mb-4 flex size-14 items-center justify-center rounded-pill bg-lacquer-wash text-lacquer-red">
                <Icon aria-hidden="true" className="size-7" />
            </span>
            <h3 className="text-headline-3 text-ink">{title}</h3>
            {description && <p className="mt-2 max-w-md text-body-md text-ink-muted">{description}</p>}
            {actions && <div className="mt-6 flex flex-wrap items-center justify-center gap-3">{actions}</div>}
        </div>
    );
}

export default EmptyState;
