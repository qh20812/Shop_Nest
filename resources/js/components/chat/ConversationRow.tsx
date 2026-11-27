import { Pin } from 'lucide-react';

import Avatar from '@/components/ui/avatar';
import { cx } from '@/lib/cx';
import { useTranslation } from '@/lib/i18n';

import styles from './chat.module.css';

type ConversationRowProps = {
    name: string;
    preview?: string;
    timestamp?: string;
    unreadCount?: number;
    pinned?: boolean;
    active?: boolean;
    online?: boolean;
    onClick?: () => void;
    className?: string;
};

export function ConversationRow({
    name,
    preview,
    timestamp,
    unreadCount = 0,
    pinned = false,
    active = false,
    online = false,
    onClick,
    className,
}: ConversationRowProps) {
    const { t } = useTranslation();
    return (
        <button
            type="button"
            onClick={onClick}
            aria-current={active ? 'true' : undefined}
            className={cx(styles.conversationRow, className)}
            data-active={active ? 'true' : undefined}
            data-unread={unreadCount > 0 ? 'true' : undefined}
        >
            <span className={styles.conversationAvatar}>
                <Avatar name={name} size="md" />
                {online ? <span aria-label={t('Online')} className={styles.conversationOnline} /> : null}
            </span>

            <span className={styles.conversationBody}>
                <span className={styles.conversationHead}>
                    <span className={styles.conversationName}>{name}</span>
                    {timestamp ? <span className={styles.conversationTime}>{timestamp}</span> : null}
                </span>

                <span className={styles.conversationPreviewRow}>
                    {pinned ? <Pin aria-label={t('Pinned')} className={styles.conversationPin} /> : null}
                    <span className={styles.conversationPreview}>{preview || t('No messages yet.')}</span>
                    {unreadCount > 0 ? <span className={styles.conversationUnread}>{unreadCount > 9 ? '9+' : unreadCount}</span> : null}
                </span>
            </span>
        </button>
    );
}

export type { ConversationRowProps };
export default ConversationRow;
