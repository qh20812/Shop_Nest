import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { formatNumber } from '@/lib/format';
import { useTranslation } from '@/lib/i18n';

import type { WalletSummary } from './types';

import styles from './wallet.module.css';

interface WalletBalanceProps {
    wallet: WalletSummary;
}

export function WalletBalance({ wallet }: WalletBalanceProps) {
    const { t } = useTranslation();
    const isActive = wallet.status === 'active';
    const unit = wallet.currency === 'VND' ? '₫' : wallet.currency;

    return (
        <section className={styles.balance} aria-labelledby="wallet-balance-label">
            <div className={styles.balanceHead}>
                <div>
                    <h2 id="wallet-balance-label" className={styles.balanceLabel}>
                        {t('Available balance')}
                    </h2>
                    <p className={styles.balanceValue}>
                        {formatNumber(wallet.balance)}
                        <span className={styles.balanceUnit}>{unit}</span>
                    </p>
                </div>
                <Badge tone={isActive ? 'success' : 'danger'} size="md">
                    {isActive ? t('Active wallet') : t('Wallet is locked')}
                </Badge>
            </div>

            {!isActive && <Alert tone="danger" description={t('Contact support to reopen your wallet.')} />}

            <dl className={styles.facts}>
                <div className={styles.fact}>
                    <dt className={styles.factLabel}>{t('Total received')}</dt>
                    <dd className={styles.factValue}>{`${formatNumber(wallet.total_earned)} ${unit}`}</dd>
                </div>
                <div className={styles.fact}>
                    <dt className={styles.factLabel}>{t('Total spent')}</dt>
                    <dd className={styles.factValue}>{`${formatNumber(wallet.total_spent)} ${unit}`}</dd>
                </div>
            </dl>
        </section>
    );
}

export default WalletBalance;
