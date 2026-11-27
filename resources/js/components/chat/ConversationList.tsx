import { MessageSquarePlus, RefreshCw } from 'lucide-react';

import { ConversationRow } from '@/components/chat/ConversationRow';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { SearchInput } from '@/components/ui/search-input';
import { Skeleton } from '@/components/ui/skeleton';
import { cx } from '@/lib/cx';
import { useTranslation } from '@/lib/i18n';

import styles from './chat.module.css';

type ConversationItem = {
    id: number;
    name: string;
    preview?: string;
    timestamp?: string;
    unreadCount?: number;
    pinned?: boolean;
    online?: boolean;
};

type ConversationListProps = {
    conversations: ConversationItem[];
    activeId?: number | null;
    onSelect: (id: number) => void;
    query?: string;
    onQueryChange?: (query: string) => void;
    loading?: boolean;
    error?: string | null;
    onRefresh?: () => void;
    onCompose?: () => void;
    className?: string;
};

export function ConversationList({
    conversations,
    activeId,
    onSelect,
    query = '',
    onQueryChange,
    loading = false,
    error,
    onRefresh,
    onCompose,
    className,
}: ConversationListProps) {
    const { t } = useTranslation();
    return (
        <aside aria-label={t('Conversations')} className={cx(styles.conversationList, className)}>
            <div className={styles.conversationListHeader}>
                {onQueryChange ? (
                    <SearchInput
                        value={query}
                        onChange={(event) => onQueryChange(event.target.value)}
                        onClear={() => onQueryChange('')}
                        placeholder={t('Search conversations...')}
                        size="sm"
                        aria-label={t('Search conversations')}
                        className={styles.conversationSearch}
                    />
                ) : (
                    <div className={styles.conversationSearch} />
                )}
                {onRefresh ? (
                    <IconButton label={t('Reload conversations')} variant="secondary" size="sm" onClick={onRefresh} disabled={loading}>
                        <RefreshCw aria-hidden="true" className={loading ? styles.spinning : undefined} />
                    </IconButton>
                ) : null}
                {onCompose ? (
                    <IconButton label={t('Start a new conversation')} variant="primary" size="sm" onClick={onCompose}>
                        <MessageSquarePlus aria-hidden="true" />
                    </IconButton>
                ) : null}
            </div>

            {error ? (
                <Alert
                    tone="danger"
                    title={t('Could not load conversations')}
                    description={error}
                    action={
                        onRefresh ? (
                            <Button variant="secondary" size="sm" onClick={onRefresh}>
                                {t('Try again')}
                            </Button>
                        ) : undefined
                    }
                />
            ) : null}

            <div className={styles.conversationScroll}>
                {loading && conversations.length === 0 ? (
                    Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className={styles.conversationSkeleton}>
                            <Skeleton className={styles.conversationSkeletonAvatar} />
                            <div className={styles.conversationSkeletonBody}>
                                <Skeleton className={styles.conversationSkeletonLine} />
                                <Skeleton className={styles.conversationSkeletonLineShort} />
                            </div>
                        </div>
                    ))
                ) : conversations.length === 0 ? (
                    <div className={styles.conversationEmpty}>
                        <span className={styles.conversationEmptyTitle}>{t('No conversations yet')}</span>
                        <span className={styles.conversationEmptyText}>{t('Start chatting with a shop for advice.')}</span>
                        {onCompose ? (
                            <Button variant="secondary" size="sm" onClick={onCompose}>
                                {t('Chat with the shop')}
                            </Button>
                        ) : null}
                    </div>
                ) : (
                    conversations.map((conversation) => (
                        <ConversationRow
                            key={conversation.id}
                            name={conversation.name}
                            preview={conversation.preview}
                            timestamp={conversation.timestamp}
                            unreadCount={conversation.unreadCount}
                            pinned={conversation.pinned}
                            online={conversation.online}
                            active={conversation.id === activeId}
                            onClick={() => onSelect(conversation.id)}
                        />
                    ))
                )}
            </div>
        </aside>
    );
}

export type { ConversationItem, ConversationListProps };
export default ConversationList;
