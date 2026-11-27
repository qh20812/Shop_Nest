import { ChevronDown } from 'lucide-react';
import * as React from 'react';

import { cx } from '@/lib/cx';

import styles from './commerce.module.css';

type FilterGroupProps = {
    title: React.ReactNode;
    count?: number;
    defaultOpen?: boolean;
    children: React.ReactNode;
    className?: string;
};

export function FilterGroup({ title, count, defaultOpen = true, children, className }: FilterGroupProps) {
    return (
        <details open={defaultOpen} className={cx(styles.filterGroup, className)}>
            <summary className={styles.filterSummary}>
                <span className={styles.filterTitleGroup}>
                    {title}
                    {typeof count === 'number' && count > 0 && <span className={styles.filterCount}>{count}</span>}
                </span>
                <ChevronDown aria-hidden="true" className={styles.filterChevron} />
            </summary>
            <div className={styles.filterBody}>{children}</div>
        </details>
    );
}

export default FilterGroup;
