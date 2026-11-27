import { cx } from '@/lib/cx';

import styles from './commerce.module.css';

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
        <div className={cx(styles.categoryPills, className)}>
            {items.map((item) => {
                const active = item.value === value;

                return (
                    <button
                        key={item.value}
                        type="button"
                        onClick={() => onChange(item.value)}
                        aria-pressed={active}
                        className={styles.categoryPill}
                        data-active={active ? 'true' : undefined}
                    >
                        {active && <span aria-hidden="true" className={styles.categoryDot} />}
                        <span>{item.label}</span>
                        {typeof item.count === 'number' && <span className={styles.categoryCount}>{item.count}</span>}
                    </button>
                );
            })}
        </div>
    );
}

export type { CategoryPillItem, CategoryPillsProps };
export default CategoryPills;
