import { cn } from '@/lib/utils';

type CategoryPillItem = {
    value: string | number;
    label: string;
    count?: number;
};

type CategoryPillsProps = {
    items: CategoryPillItem[];
    value?: string | number | null;
    onChange: (value: string | number) => void;
    className?: string;
};

export function CategoryPills({ items, value, onChange, className }: CategoryPillsProps) {
    return (
        <div className={cn('scrollbar-hide flex items-center gap-2 overflow-x-auto', className)}>
            {items.map((item) => {
                const active = item.value === value;

                return (
                    <button
                        key={item.value}
                        type="button"
                        onClick={() => onChange(item.value)}
                        aria-pressed={active}
                        className={cn(
                            'focus-ring inline-flex shrink-0 items-center gap-1.5 rounded-pill border px-3 py-1.5 text-body-sm font-medium transition-colors',
                            active
                                ? 'border-lacquer-red bg-lacquer-wash text-lacquer-red'
                                : 'border-border bg-warm-porcelain text-ink hover:border-ink-muted',
                        )}
                    >
                        {active && <span aria-hidden="true" className="size-1.5 rounded-pill bg-lacquer-red" />}
                        <span>{item.label}</span>
                        {typeof item.count === 'number' && (
                            <span className={cn('font-mono text-label-micro', active ? 'text-lacquer-red' : 'text-ink-faint')}>{item.count}</span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}

export type { CategoryPillItem, CategoryPillsProps };
export default CategoryPills;
