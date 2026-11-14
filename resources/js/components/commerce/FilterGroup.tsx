import { ChevronDown } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

type FilterGroupProps = {
    title: React.ReactNode;
    count?: number;
    defaultOpen?: boolean;
    children: React.ReactNode;
    className?: string;
};

export function FilterGroup({ title, count, defaultOpen = true, children, className }: FilterGroupProps) {
    return (
        <details open={defaultOpen} className={cn('group border-t border-border py-3 first:border-t-0 first:pt-0', className)}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-body-sm font-semibold text-ink [&::-webkit-details-marker]:hidden">
                <span className="inline-flex items-center gap-2">
                    {title}
                    {typeof count === 'number' && count > 0 && (
                        <span className="rounded-pill bg-raw-linen px-1.5 py-0.5 font-mono text-label-micro text-ink-muted">{count}</span>
                    )}
                </span>
                <ChevronDown aria-hidden="true" className="size-4 text-ink-muted transition-transform group-open:rotate-180" />
            </summary>
            <div className="mt-3">{children}</div>
        </details>
    );
}

export default FilterGroup;
