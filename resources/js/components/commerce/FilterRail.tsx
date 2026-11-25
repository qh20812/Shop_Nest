import { useTranslation } from '@/lib/i18n';
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

export function FilterRail({ children, onClear, activeCount = 0, title, variant = 'default', className }: FilterRailProps) {
    const { t } = useTranslation();
    const resolvedTitle = title ?? t('Curated filters');
    return (
        <aside aria-label={t('Product filters')} className={cx(styles.filterRail, className)} data-variant={variant}>
            <div className={styles.filterHead}>
                <div className={styles.filterHeadTitle}>
                    <SlidersHorizontal aria-hidden="true" className={styles.filterHeadIcon} />
                    <h2>{resolvedTitle}</h2>
                </div>
                {activeCount > 0 && <span className={styles.filterActiveCount}>{t(':count selected', { count: activeCount })}</span>}
            </div>
            <div>{children}</div>
            {onClear && (
                <Button variant="ghost" size="sm" className={styles.filterClear} leftIcon={X} onClick={onClear}>
                    {t('Clear all filters')}
                </Button>
            )}
        </aside>
    );
}

export default FilterRail;
