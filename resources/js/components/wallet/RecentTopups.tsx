import { Badge } from '@/components/ui/badge';
import { formatDate, formatTime, formatVnd } from '@/lib/format';
import { useTranslation } from '@/lib/i18n';

import type { WalletTopup } from './types';
import { topupStatusKeys, topupStatusTones } from './wallet-status';

import styles from './wallet.module.css';

interface RecentTopupsProps {
    topups: WalletTopup[];
}

export function RecentTopups({ topups }: RecentTopupsProps) {
    const { t } = useTranslation();

    return (
        <section className={styles.recent} aria-labelledby="wallet-recent-title">
            <h2 id="wallet-recent-title" className={styles.recentTitle}>
                {t('Recent top-up requests')}
            </h2>

            {topups.length === 0 ? (
                <p className={styles.recentMeta}>{t('No recent requests')}</p>
            ) : (
                <ul className={styles.recentList}>
                    {topups.map((topup) => (
                        <li key={topup.topup_id} className={styles.recentItem}>
                            <div className={styles.recentTop}>
                                <span className={styles.recentCode}>{topup.code}</span>
                                <Badge tone={topupStatusTones[topup.status]}>{t(topupStatusKeys[topup.status])}</Badge>
                            </div>
                            <span className={styles.recentMeta}>{formatVnd(topup.amount_declared)}</span>
                            <span className={styles.recentMeta}>
                                {formatDate(topup.created_at)} {formatTime(topup.created_at)}
                            </span>
                            {topup.reject_reason && <p className={styles.recentReason}>{topup.reject_reason}</p>}
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

export default RecentTopups;
