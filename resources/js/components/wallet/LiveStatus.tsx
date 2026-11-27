import { RefreshCw } from 'lucide-react';

import { IconButton } from '@/components/ui/icon-button';
import { formatTime } from '@/lib/format';
import { useTranslation } from '@/lib/i18n';

import styles from './wallet.module.css';

interface LiveStatusProps {
    lastUpdatedAt: string | null;
    refreshing: boolean;
    failed: boolean;
    onRefresh: () => void;
}

export function LiveStatus({ lastUpdatedAt, refreshing, failed, onRefresh }: LiveStatusProps) {
    const { t } = useTranslation();

    const label = failed ? t('Could not refresh. Try again.') : lastUpdatedAt ? `${t('Updated at')} ${formatTime(lastUpdatedAt)}` : t('Updating');

    return (
        <div className={styles.live}>
            <span className={styles.liveText} data-state={failed ? 'failed' : undefined}>
                {label}
            </span>
            <IconButton size="sm" label={t('Refresh')} aria-busy={refreshing} disabled={refreshing} onClick={onRefresh}>
                <RefreshCw aria-hidden="true" />
            </IconButton>
        </div>
    );
}

export default LiveStatus;
