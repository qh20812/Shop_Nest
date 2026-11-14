import type { LucideIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

type SpecRow = {
    label: string;
    value: React.ReactNode;
    icon?: LucideIcon;
};

type SpecTableProps = {
    rows: SpecRow[];
    className?: string;
};

export function SpecTable({ rows, className }: SpecTableProps) {
    return (
        <div className={cn('overflow-hidden rounded-card border border-border bg-warm-porcelain', className)}>
            <dl className="divide-y divide-border">
                {rows.map((row) => {
                    const Icon = row.icon;

                    return (
                        <div key={row.label} className="grid grid-cols-1 gap-1 px-4 py-3 sm:grid-cols-3 sm:gap-4">
                            <dt className="flex items-center gap-2 text-body-sm font-medium text-ink-muted">
                                {Icon && <Icon aria-hidden="true" className="size-4 text-ink-faint" />}
                                {row.label}
                            </dt>
                            <dd className="font-mono text-label-code text-ink sm:col-span-2">{row.value}</dd>
                        </div>
                    );
                })}
            </dl>
        </div>
    );
}

export type { SpecRow, SpecTableProps };
export default SpecTable;
