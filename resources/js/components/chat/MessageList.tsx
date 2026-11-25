import { MessagesSquare } from 'lucide-react';
import * as React from 'react';

import { ChatMessage, type ChatMessageVariant } from '@/components/chat/ChatMessage';
import type { ChatProduct } from '@/components/chat/types';
import { TypingIndicator } from '@/components/chat/TypingIndicator';
import type { OrderAnnouncementModel } from '@/components/commerce/OrderAnnouncementCard';
import { Skeleton } from '@/components/ui/skeleton';
import { cx } from '@/lib/cx';
import { useTranslation } from '@/lib/i18n';

import styles from './chat.module.css';

type MessageListItem = {
    id: number | string;
    variant: ChatMessageVariant;
    content: React.ReactNode;
    timestamp?: string;
    status?: 'sending' | 'sent' | 'delivered' | 'failed';
    assistantName?: string;
    order?: OrderAnnouncementModel | null;
    products?: ChatProduct[];
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

export function MessageList({ messages, loading = false, typing = false, typingLabel, emptyTitle, emptyDescription, className }: MessageListProps) {
    const { t } = useTranslation();
    const resolvedEmptyTitle = emptyTitle ?? t('No messages yet');
    const resolvedEmptyDescription = emptyDescription ?? t('Say hello to start the conversation.');
    const endRef = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
        endRef.current?.scrollIntoView({ block: 'end' });
    }, [messages.length, typing]);

    if (loading) {
        return (
            <div className={cx(styles.messageListSkeleton, className)}>
                <Skeleton className={styles.messageListSkeletonIncoming} />
                <Skeleton className={styles.messageListSkeletonOutgoing} />
                <Skeleton className={styles.messageListSkeletonWide} />
            </div>
        );
    }

    if (messages.length === 0 && !typing) {
        return (
            <div className={cx(styles.messagesEmpty, className)}>
                <span className={styles.messagesEmptyIcon}>
                    <MessagesSquare aria-hidden="true" className={styles.headerIconSvg} />
                </span>
                <span className={styles.messagesEmptyTitle}>{resolvedEmptyTitle}</span>
                <span className={styles.messagesEmptyText}>{resolvedEmptyDescription}</span>
            </div>
        );
    }

    return (
        <div className={cx(styles.messageList, className)}>
            <div className={styles.messageListInner} role="log" aria-live="polite">
                {messages.map((message) => (
                    <ChatMessage
                        key={message.id}
                        variant={message.variant}
                        content={message.content}
                        timestamp={message.timestamp}
                        status={message.status}
                        assistantName={message.assistantName}
                        order={message.order}
                        products={message.products}
                    />
                ))}
                {typing ? <TypingIndicator label={typingLabel ?? t('Typing')} /> : null}
                <div ref={endRef} />
            </div>
        </div>
    );
}

export type { MessageListItem, MessageListProps };
export default MessageList;
