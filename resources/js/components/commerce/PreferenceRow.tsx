import type { LucideIcon } from 'lucide-react';
import * as React from 'react';

import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

type PreferenceRowProps = {
    title: React.ReactNode;
    description?: React.ReactNode;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    icon?: LucideIcon;
    disabled?: boolean;
    className?: string;
};

export function PreferenceRow({ title, description, checked, onCheckedChange, icon: Icon, disabled, className }: PreferenceRowProps) {
    return (
        <div className={cn('flex items-start justify-between gap-4 border-t border-border py-4 first:border-t-0 first:pt-0', className)}>
            <div className="flex min-w-0 items-start gap-3">
                {Icon && (
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-chip bg-raw-linen text-ink-muted">
                        <Icon aria-hidden="true" className="size-4" />
                    </span>
                )}
                <div className="flex flex-col gap-0.5">
                    <span className="text-body-md font-medium text-ink">{title}</span>
                    {description && <span className="text-body-sm text-ink-muted">{description}</span>}
                </div>
            </div>
            <Switch
                checked={checked}
                onCheckedChange={onCheckedChange}
                disabled={disabled}
                aria-label={typeof title === 'string' ? title : undefined}
            />
        </div>
    );
}

export type { PreferenceRowProps };
export default PreferenceRow;
