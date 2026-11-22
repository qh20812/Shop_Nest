import { SlidersHorizontal, X } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { cx } from '@/lib/cx';

import styles from './commerce.module.css';

type FilterRailProps = {
    children: React.ReactNode;
    onClear?: () => void;
    activeCount?: number;
    title?: string;
    variant?: 'default' | 'sheet';
    className?: string;
};

export function FilterRail({ children, onClear, activeCount = 0, title = 'Bộ lọc tuyển chọn', variant = 'default', className }: FilterRailProps) {
    return (
        <aside aria-label="Bộ lọc sản phẩm" className={cx(styles.filterRail, className)} data-variant={variant}>
            <div className={styles.filterHead}>
                <div className={styles.filterHeadTitle}>
                    <SlidersHorizontal aria-hidden="true" className={styles.filterHeadIcon} />
                    <h2>{title}</h2>
                </div>
                {activeCount > 0 && <span className={styles.filterActiveCount}>{activeCount} đang chọn</span>}
            </div>
            <div>{children}</div>
            {onClear && (
                <Button variant="ghost" size="sm" className={styles.filterClear} leftIcon={X} onClick={onClear}>
                    Xoá tất cả bộ lọc
                </Button>
            )}
        </aside>
    );
}

export default FilterRail;
