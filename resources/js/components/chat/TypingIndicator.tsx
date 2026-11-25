import { cx } from '@/lib/cx';
import { useTranslation } from '@/lib/i18n';

import styles from './chat.module.css';

type TypingIndicatorProps = {
    label?: string;
    className?: string;
};

export function TypingIndicator({ label, className }: TypingIndicatorProps) {
    const { t } = useTranslation();
    return (
        <div className={cx(styles.typing, className)} aria-live="polite">
            <span className={styles.typingBubble} aria-hidden="true">
                <span className={styles.typingDot} />
                <span className={styles.typingDot} />
                <span className={styles.typingDot} />
            </span>
            <span>{label ?? t('Typing')}</span>
        </div>
    );
}

export type { TypingIndicatorProps };
export default TypingIndicator;
