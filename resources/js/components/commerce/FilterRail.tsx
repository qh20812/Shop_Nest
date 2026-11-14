import { SlidersHorizontal, X } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type FilterRailProps = {
    children: React.ReactNode;
    onClear?: () => void;
    activeCount?: number;
    title?: string;
    className?: string;
};

export function FilterRail({ children, onClear, activeCount = 0, title = 'Bộ lọc tuyển chọn', className }: FilterRailProps) {
    return (
        <aside
            aria-label="Bộ lọc sản phẩm"
            className={cn('w-full rounded-card border border-border bg-rice-paper/40 p-4 lg:sticky lg:top-24', className)}
        >
            <div className="mb-3 flex items-center justify-between gap-3 border-b border-border pb-3">
                <div className="flex items-center gap-2">
                    <SlidersHorizontal aria-hidden="true" className="size-4 text-lacquer-red" />
                    <h2 className="text-body-sm font-semibold text-ink">{title}</h2>
                </div>
                {activeCount > 0 && (
                    <span className="rounded-pill bg-raw-linen px-2 py-0.5 font-mono text-label-micro text-ink-muted">{activeCount} đang chọn</span>
                )}
            </div>
            <div className="flex flex-col">{children}</div>
            {onClear && (
                <Button variant="ghost" size="sm" className="mt-4 w-full justify-start px-0" leftIcon={X} onClick={onClear}>
                    Xoá tất cả bộ lọc
                </Button>
            )}
        </aside>
    );
}

export default FilterRail;
