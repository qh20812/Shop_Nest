import { CheckCircle2, Clock, Receipt, XCircle } from 'lucide-react';

import { formatNumber } from '@/lib/format';
import { useTranslation } from '@/lib/i18n';

import styles from '../admin.module.css';

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

    const cards = [
        { icon: Receipt, title: t('Total Orders'), value: orderSummary.totalCount },
        { icon: Clock, title: t('Pending Orders'), value: orderSummary.pendingCount },
        { icon: CheckCircle2, title: t('Completed Orders'), value: orderSummary.completedCount },
        { icon: XCircle, title: t('Cancelled Orders'), value: orderSummary.cancelledCount },
    ];

    return (
        <div className={styles.metricGrid}>
            {cards.map((card) => {
                const Icon = card.icon;

                return (
                    <div key={card.title} className={styles.metricCard}>
                        <span className={styles.metricIcon}>
                            <Icon aria-hidden="true" />
                        </span>
                        <div className={styles.metricBody}>
                            <span className={styles.metricValue}>{formatNumber(card.value)}</span>
                            <span className={styles.metricLabel}>{card.title}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
