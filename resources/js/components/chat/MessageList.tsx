import { MessagesSquare } from 'lucide-react';
import * as React from 'react';

import { ChatMessage, type ChatMessageVariant } from '@/components/chat/ChatMessage';
import { TypingIndicator } from '@/components/chat/TypingIndicator';
import type { OrderAnnouncementModel } from '@/components/commerce/OrderAnnouncementCard';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type MessageListItem = {
    id: number | string;
    variant: ChatMessageVariant;
    content: React.ReactNode;
    timestamp?: string;
    status?: 'sending' | 'sent' | 'delivered' | 'failed';
    assistantName?: string;
    order?: OrderAnnouncementModel | null;
};

type MessageListProps = {
    messages: MessageListItem[];
    loading?: boolean;
    typing?: boolean;
    typingLabel?: string;
    emptyTitle?: string;
    emptyDescription?: string;
    className?: string;
};

export function MessageList({
    messages,
    loading = false,
    typing = false,
    typingLabel = 'Đang soạn tin',
    emptyTitle = 'Chưa có tin nhắn',
    emptyDescription = 'Gửi lời chào để bắt đầu cuộc trò chuyện.',
    className,
}: MessageListProps) {
    const endRef = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
        endRef.current?.scrollIntoView({ block: 'end' });
    }, [messages.length, typing]);

    if (loading) {
        return (
            <div className={cn('flex flex-1 flex-col gap-4 overflow-hidden p-4', className)}>
                <Skeleton className="h-14 w-2/3 rounded-surface" />
                <Skeleton className="ml-auto h-12 w-1/2 rounded-surface" />
                <Skeleton className="h-16 w-3/4 rounded-surface" />
            </div>
        );
    }

    if (messages.length === 0 && !typing) {
        return (
            <div className={cn('flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center', className)}>
                <span className="flex size-12 items-center justify-center rounded-pill bg-lacquer-wash text-lacquer-red">
                    <MessagesSquare aria-hidden="true" className="size-6" />
                </span>
                <span className="text-body-md font-semibold text-ink">{emptyTitle}</span>
                <span className="max-w-xs text-body-sm text-ink-muted">{emptyDescription}</span>
            </div>
        );
    }

    return (
        <div className={cn('flex-1 overflow-y-auto', className)}>
            <div className="flex flex-col gap-4 p-4" role="log" aria-live="polite" aria-relevant="additions text">
                {messages.map((message) => (
                    <ChatMessage
                        key={message.id}
                        variant={message.variant}
                        content={message.content}
                        timestamp={message.timestamp}
                        status={message.status}
                        assistantName={message.assistantName}
                        order={message.order}
                    />
                ))}
                {typing && <TypingIndicator label={typingLabel} />}
                <div ref={endRef} />
            </div>
        </div>
    );
}

export type { MessageListItem, MessageListProps };
export default MessageList;
