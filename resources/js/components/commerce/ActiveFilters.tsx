import { X } from 'lucide-react';

import { cx } from '@/lib/cx';

import styles from './commerce.module.css';

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
        <div className={cx(styles.activeFilters, className)}>
            <span className={styles.activeLabel}>Đang lọc</span>
            {filters.map((filter) => (
                <span key={filter.key} className={styles.activeChip}>
                    <span>
                        {filter.label}
                        {filter.value && <span className={styles.activeChipValue}>{filter.value}</span>}
                    </span>
                    <button
                        type="button"
                        aria-label={`Bỏ lọc ${filter.label}`}
                        className={styles.activeChipButton}
                        onClick={() => onRemove(filter.key)}
                    >
                        <X aria-hidden="true" className={styles.activeChipIcon} />
                    </button>
                </span>
            ))}
            <button type="button" className={styles.activeClear} onClick={onClear}>
                Xoá tất cả
            </button>
        </div>
    );
}

export type { ActiveFilter, ActiveFiltersProps };
export default ActiveFilters;
