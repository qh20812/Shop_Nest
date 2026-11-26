import { Filter, RotateCcw } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/lib/i18n';

import styles from '../admin.module.css';

interface OrderFilterPanelProps {
    fromDate: string;
    toDate: string;
    onApply: (fromDate: string, toDate: string) => void;
    onReset: () => void;
}

/**
 * Advanced date filters for the admin order list. Rendered inside the single
 * `FilterPanel` bar so the page does not stack two filter strips.
 */
export default function OrderFilterPanel({ fromDate: initialFromDate, toDate: initialToDate, onApply, onReset }: OrderFilterPanelProps) {
    const { t } = useTranslation();
    const [fromDate, setFromDate] = useState(initialFromDate);
    const [toDate, setToDate] = useState(initialToDate);

    const handleApply = () => {
        onApply(fromDate, toDate);
    };

    const handleReset = () => {
        setFromDate('');
        setToDate('');
        onReset();
    };

    return (
        <div className={styles.filterAdvanced}>
            <div className={styles.filterRow}>
                <div className={styles.filterField}>
                    <span className={styles.filterLabel}>{t('From')}</span>
                    <Input
                        type="date"
                        value={fromDate}
                        onChange={(event) => setFromDate(event.target.value)}
                        aria-label={t('From date')}
                        surface="glass"
                    />
                </div>

                <div className={styles.filterField}>
                    <span className={styles.filterLabel}>{t('To')}</span>
                    <Input type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} aria-label={t('To date')} surface="glass" />
                </div>

                <div className={styles.filterActions}>
                    <Button type="button" variant="secondary" size="md" surface="glass" onClick={handleApply}>
                        <Filter aria-hidden="true" />
                        {t('Apply')}
                    </Button>
                    <Button type="button" variant="ghost" size="md" surface="glass" onClick={handleReset}>
                        <RotateCcw aria-hidden="true" />
                        {t('Reset')}
                    </Button>
                </div>
            </div>
        </div>
    );
}
