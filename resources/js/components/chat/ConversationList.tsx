import { MessageSquarePlus, RefreshCw } from 'lucide-react';

import { ConversationRow } from '@/components/chat/ConversationRow';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { SearchInput } from '@/components/ui/search-input';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

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
        <aside aria-label="Danh sách cuộc trò chuyện" className={cn('flex min-h-0 flex-col gap-3 border-border p-3', className)}>
            <div className="flex items-center gap-2">
                {onQueryChange ? (
                    <SearchInput
                        value={query}
                        onChange={(event) => onQueryChange(event.target.value)}
                        onClear={() => onQueryChange('')}
                        placeholder="Tìm cuộc trò chuyện..."
                        size="sm"
                        aria-label="Tìm cuộc trò chuyện"
                        className="min-w-0 flex-1"
                    />
                ) : (
                    <div className="min-w-0 flex-1" />
                )}
                {onRefresh && (
                    <IconButton label="Tải lại cuộc trò chuyện" variant="secondary" size="sm" onClick={onRefresh} disabled={loading}>
                        <RefreshCw aria-hidden="true" className={loading ? 'animate-spin' : undefined} />
                    </IconButton>
                )}
                {onCompose && (
                    <IconButton label="Bắt đầu cuộc trò chuyện mới" variant="primary" size="sm" onClick={onCompose}>
                        <MessageSquarePlus aria-hidden="true" />
                    </IconButton>
                )}
            </div>

            {error && (
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
            )}

            <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto">
                {loading && conversations.length === 0 ? (
                    Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="flex items-center gap-3 px-3 py-3">
                            <Skeleton className="size-10 rounded-pill" />
                            <div className="flex flex-1 flex-col gap-2">
                                <Skeleton className="h-3 w-1/2" />
                                <Skeleton className="h-3 w-3/4" />
                            </div>
                        </div>
                    ))
                ) : conversations.length === 0 ? (
                    <div className="flex flex-1 flex-col items-center justify-center gap-2 px-4 py-8 text-center">
                        <span className="text-body-sm font-medium text-ink">Chưa có cuộc trò chuyện</span>
                        <span className="text-label-micro text-ink-muted">Bắt đầu chat với shop để được tư vấn.</span>
                        {onCompose && (
                            <Button variant="secondary" size="sm" onClick={onCompose} className="mt-2">
                                Chat với shop
                            </Button>
                        )}
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
