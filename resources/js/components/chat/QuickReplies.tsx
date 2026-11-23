import { cx } from '@/lib/cx';

import styles from './chat.module.css';

type QuickReply = {
    id?: string;
    label: string;
    value?: string;
};

type QuickRepliesProps = {
    items: Array<QuickReply | string>;
    onSelect: (value: string) => void;
    disabled?: boolean;
    className?: string;
};

export function QuickReplies({ items, onSelect, disabled = false, className }: QuickRepliesProps) {
    if (items.length === 0) {
        return null;
    }

    return (
        <div className={cx(styles.quickReplies, className)} aria-label="Gợi ý câu hỏi">
            {items.map((item) => {
                const label = typeof item === 'string' ? item : item.label;
                const value = typeof item === 'string' ? item : (item.value ?? item.label);

                return (
                    <button
                        key={typeof item === 'string' ? item : (item.id ?? item.label)}
                        type="button"
                        disabled={disabled}
                        onClick={() => onSelect(value)}
                        className={styles.quickReply}
                    >
                        {label}
                    </button>
                );
            })}
        </div>
    );
}

export type { QuickRepliesProps, QuickReply };
export default QuickReplies;
