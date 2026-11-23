import { MessageSquarePlus, RefreshCw } from 'lucide-react';

import { ConversationRow } from '@/components/chat/ConversationRow';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { SearchInput } from '@/components/ui/search-input';
import { Skeleton } from '@/components/ui/skeleton';
import { cx } from '@/lib/cx';

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
    return (
        <aside aria-label="Danh sách cuộc trò chuyện" className={cx(styles.conversationList, className)}>
            <div className={styles.conversationListHeader}>
                {onQueryChange ? (
                    <SearchInput
                        value={query}
                        onChange={(event) => onQueryChange(event.target.value)}
                        onClear={() => onQueryChange('')}
                        placeholder="Tìm cuộc trò chuyện..."
                        size="sm"
                        aria-label="Tìm cuộc trò chuyện"
                        className={styles.conversationSearch}
                    />
                ) : (
                    <div className={styles.conversationSearch} />
                )}
                {onRefresh ? (
                    <IconButton label="Tải lại cuộc trò chuyện" variant="secondary" size="sm" onClick={onRefresh} disabled={loading}>
                        <RefreshCw aria-hidden="true" className={loading ? styles.spinning : undefined} />
                    </IconButton>
                ) : null}
                {onCompose ? (
                    <IconButton label="Bắt đầu cuộc trò chuyện mới" variant="primary" size="sm" onClick={onCompose}>
                        <MessageSquarePlus aria-hidden="true" />
                    </IconButton>
                ) : null}
            </div>

            {error ? (
                <Alert
                    tone="danger"
                    title="Không tải được cuộc trò chuyện"
                    description={error}
                    action={
                        onRefresh ? (
                            <Button variant="secondary" size="sm" onClick={onRefresh}>
                                Thử lại
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
                        <span className={styles.conversationEmptyTitle}>Chưa có cuộc trò chuyện</span>
                        <span className={styles.conversationEmptyText}>Bắt đầu chat với shop để được tư vấn.</span>
                        {onCompose ? (
                            <Button variant="secondary" size="sm" onClick={onCompose}>
                                Chat với shop
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
