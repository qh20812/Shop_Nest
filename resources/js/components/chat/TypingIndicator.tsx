import { cx } from '@/lib/cx';

import styles from './chat.module.css';

type TypingIndicatorProps = {
    label?: string;
    className?: string;
};

export function TypingIndicator({ label = 'Đang soạn tin', className }: TypingIndicatorProps) {
    return (
        <div className={cx(styles.typing, className)} aria-live="polite">
            <span className={styles.typingBubble} aria-hidden="true">
                <span className={styles.typingDot} />
                <span className={styles.typingDot} />
                <span className={styles.typingDot} />
            </span>
            <span>{label}</span>
        </div>
    );
}

export type { TypingIndicatorProps };
export default TypingIndicator;
