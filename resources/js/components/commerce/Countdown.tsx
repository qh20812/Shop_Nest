import { useTranslation } from '@/lib/i18n';
import * as React from 'react';

import { useCountdown } from '@/hooks/useCountdown';
import { cx } from '@/lib/cx';

import styles from './commerce.module.css';

type CountdownProps = {
    endsAt: Date | string | number | null | undefined;
    onEnd?: () => void;
    className?: string;
};

function pad(value: number): string {
    return String(value).padStart(2, '0');
}

function CountdownBox({ children }: { children: React.ReactNode }) {
    return <span className={styles.countdownBox}>{children}</span>;
}

export function Countdown({ endsAt, onEnd, className }: CountdownProps) {
    const { t } = useTranslation();
    const countdown = useCountdown(endsAt, { onEnd });

    return (
        <span className={cx(styles.countdownRoot, className)} aria-label={t('Time remaining')}>
            {countdown.days > 0 && (
                <>
                    <CountdownBox>{pad(countdown.days)}</CountdownBox>
                    <span className={styles.countdownSeparator}>:</span>
                </>
            )}
            <CountdownBox>{pad(countdown.hours)}</CountdownBox>
            <span aria-hidden="true" className={styles.countdownSeparator}>
                :
            </span>
            <CountdownBox>{pad(countdown.minutes)}</CountdownBox>
            <span aria-hidden="true" className={styles.countdownSeparator}>
                :
            </span>
            <CountdownBox>{pad(countdown.seconds)}</CountdownBox>
        </span>
    );
}

export default Countdown;
