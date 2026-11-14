import type { LucideIcon } from 'lucide-react';

import { PageContainer } from '@/components/layout/PageContainer';
import { cn } from '@/lib/utils';

type UtilityItem = {
    icon: LucideIcon;
    label: string;
    description?: string;
};

type UtilityStripProps = {
    items: UtilityItem[];
    className?: string;
};

export function UtilityStrip({ items, className }: UtilityStripProps) {
    return (
        <section className={cn('py-2', className)}>
            <PageContainer>
                <div className="grid w-full grid-cols-1 divide-y divide-border rounded-surface border border-border bg-warm-porcelain px-5 py-2 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
                    {items.map((item) => {
                        const Icon = item.icon;

                        return (
                            <div key={item.label} className="flex items-center gap-3 py-3 lg:px-5 lg:first:pl-0 lg:last:pr-0">
                                <span className="flex size-10 shrink-0 items-center justify-center rounded-control bg-raw-linen text-lacquer-red">
                                    <Icon aria-hidden="true" className="size-5" />
                                </span>
                                <div className="flex flex-col">
                                    <span className="text-body-sm font-semibold text-ink">{item.label}</span>
                                    {item.description && <span className="text-label-micro text-ink-muted">{item.description}</span>}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </PageContainer>
        </section>
    );
}

export type { UtilityItem, UtilityStripProps };
export default UtilityStrip;
