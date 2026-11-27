import { formatNumber } from '@/lib/format';
import { useTranslation } from '@/lib/i18n';

import styles from './Orders.module.css';

interface OrderSummaryCardsProps {
    orderSummary: {
        totalCount: number;
        pendingCount: number;
        completedCount: number;
        cancelledCount: number;
    };
}

export default function OrderSummaryCards({ orderSummary }: OrderSummaryCardsProps) {
    const { t } = useTranslation();

    const items = [
        { key: 'total', label: t('Total Orders'), value: orderSummary.totalCount },
        { key: 'pending', label: t('Pending Orders'), value: orderSummary.pendingCount },
        { key: 'completed', label: t('Completed Orders'), value: orderSummary.completedCount },
        { key: 'cancelled', label: t('Cancelled Orders'), value: orderSummary.cancelledCount },
    ];

    return (
        <dl className={styles.register} aria-label={t('Order Summary')}>
            {items.map((item) => (
                <div key={item.key} className={styles.registerItem}>
                    <dt className={styles.registerLabel}>{item.label}</dt>
                    <dd className={styles.registerValue}>{formatNumber(item.value)}</dd>
                </div>
            ))}
        </dl>
    );
}
