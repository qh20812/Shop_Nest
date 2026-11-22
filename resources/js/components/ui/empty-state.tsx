import { Inbox, type LucideIcon } from 'lucide-react';
import * as React from 'react';

import { cx } from '@/lib/cx';

type EmptyStateProps = {
    icon?: LucideIcon;
    title: React.ReactNode;
    description?: React.ReactNode;
    actions?: React.ReactNode;
    className?: string;
};

export function EmptyState({ icon: Icon = Inbox, title, description, actions, className }: EmptyStateProps) {
    return (
        <div data-slot="empty-state" className={cx('sn-empty', className)}>
            <span className="sn-empty__icon-wrap">
                <Icon aria-hidden="true" className="sn-empty__icon" />
            </span>
            <h3 className="sn-empty__title">{title}</h3>
            {description && <p className="sn-empty__description">{description}</p>}
            {actions && <div className="sn-empty__actions">{actions}</div>}
        </div>
    );
}

export default EmptyState;
