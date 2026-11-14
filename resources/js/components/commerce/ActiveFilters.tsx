import { X } from 'lucide-react';

import { cn } from '@/lib/utils';

type ActiveFilter = {
    key: string;
    label: string;
    value?: string;
};

type ActiveFiltersProps = {
    filters: ActiveFilter[];
    onRemove: (key: string) => void;
    onClear: () => void;
    className?: string;
};

export function ActiveFilters({ filters, onRemove, onClear, className }: ActiveFiltersProps) {
    if (filters.length === 0) {
        return null;
    }

    return (
        <div className={cn('flex flex-wrap items-center gap-2', className)}>
            <span className="text-label-micro font-semibold tracking-[0.12em] text-ink-faint uppercase">Đang lọc</span>
            {filters.map((filter) => (
                <span
                    key={filter.key}
                    className="inline-flex items-center gap-1 rounded-chip border border-border bg-warm-porcelain px-2.5 py-1 text-body-sm text-ink"
                >
                    <span>
                        {filter.label}
                        {filter.value && <span className="ml-1 font-semibold text-lacquer-red">{filter.value}</span>}
                    </span>
                    <button
                        type="button"
                        aria-label={`Bỏ lọc ${filter.label}`}
                        className="focus-ring rounded-chip p-0.5 text-ink-muted transition-colors hover:text-lacquer-red"
                        onClick={() => onRemove(filter.key)}
                    >
                        <X aria-hidden="true" className="size-3.5" />
                    </button>
                </span>
            ))}
            <button type="button" className="text-body-sm text-ink-muted underline-offset-4 hover:text-lacquer-red hover:underline" onClick={onClear}>
                Xoá tất cả
            </button>
        </div>
    );
}

export type { ActiveFilter, ActiveFiltersProps };
export default ActiveFilters;
