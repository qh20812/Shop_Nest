import type { LucideIcon } from 'lucide-react';

import { PageContainer } from '@/components/layout/PageContainer';
import { cn } from '@/lib/utils';

type TrustItem = {
    icon: LucideIcon;
    title: string;
    description: string;
};

type TrustStripProps = {
    items: TrustItem[];
    className?: string;
};

export function TrustStrip({ items, className }: TrustStripProps) {
    return (
        <section className={cn('py-10 md:py-14', className)}>
            <PageContainer>
                <div className="grid grid-cols-1 gap-6 border-y border-border py-8 md:grid-cols-2 lg:grid-cols-4">
                    {items.map((item) => {
                        const Icon = item.icon;

                        return (
                            <div key={item.title} className="flex items-start gap-3.5">
                                <span className="flex size-10 shrink-0 items-center justify-center rounded-control border border-border bg-warm-porcelain text-lacquer-red">
                                    <Icon aria-hidden="true" className="size-5" />
                                </span>
                                <div>
                                    <h3 className="text-body-md font-semibold text-ink">{item.title}</h3>
                                    <p className="mt-1 text-body-sm text-ink-muted">{item.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </PageContainer>
        </section>
    );
}

export type { TrustItem, TrustStripProps };
export default TrustStrip;
