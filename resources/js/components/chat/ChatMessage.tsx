import { AlertTriangle, Sparkles } from 'lucide-react';
import * as React from 'react';

import { OrderAnnouncementCard, type OrderAnnouncementModel } from '@/components/commerce/OrderAnnouncementCard';
import { cn } from '@/lib/utils';

type ChatMessageVariant = 'incoming' | 'outgoing' | 'system' | 'error';

type ChatMessageProps = {
    variant?: ChatMessageVariant;
    content: React.ReactNode;
    timestamp?: string;
    status?: 'sending' | 'sent' | 'delivered' | 'failed';
    assistantName?: string;
    avatar?: React.ReactNode;
    order?: OrderAnnouncementModel | null;
    className?: string;
};

const statusLabel: Record<NonNullable<ChatMessageProps['status']>, string> = {
    sending: 'Đang gửi',
    sent: 'Đã gửi',
    delivered: 'Đã nhận',
    failed: 'Gửi lỗi',
};

export function ChatMessage({
    variant = 'incoming',
    content,
    timestamp,
    status,
    assistantName = 'Trợ lý ShopNest',
    avatar,
    order,
    className,
}: ChatMessageProps) {
    const isOutgoing = variant === 'outgoing';
    const isSystem = variant === 'system';
    const isError = variant === 'error';

    if (isSystem) {
        return (
            <div className={cn('flex justify-center py-1', className)}>
                <span className="rounded-pill bg-raw-linen px-3 py-1 text-label-micro text-ink-muted">{content}</span>
            </div>
        );
    }

    return (
        <div className={cn('flex w-full items-end gap-2', isOutgoing ? 'justify-end' : 'justify-start', className)}>
            {!isOutgoing && (
                <span
                    aria-hidden="true"
                    className={cn(
                        'flex size-8 shrink-0 items-center justify-center rounded-pill',
                        isError ? 'bg-brick-soft text-brick' : 'bg-lacquer-wash text-lacquer-deep',
                    )}
                >
                    {avatar ?? (isError ? <AlertTriangle className="size-4" /> : <Sparkles className="size-4" />)}
                </span>
            )}

            <div className={cn('flex max-w-[85%] flex-col gap-1', isOutgoing ? 'items-end' : 'items-start')}>
                {!isOutgoing && <span className="px-1 text-label-micro text-ink-faint">{assistantName}</span>}

                <div
                    className={cn(
                        'rounded-surface px-4 py-3 text-body-sm leading-relaxed break-words whitespace-pre-wrap',
                        isOutgoing && 'rounded-br-chip bg-lacquer-red text-warm-porcelain',
                        !isOutgoing && !isError && 'rounded-bl-chip border border-border bg-rice-paper text-ink',
                        isError && 'rounded-bl-chip border border-brick/20 bg-brick-soft text-brick',
                    )}
                >
                    {content}
                </div>

                {order && <OrderAnnouncementCard order={order} className="w-full" />}

                <span className="flex items-center gap-1.5 px-1 font-mono text-label-micro text-ink-faint">
                    {timestamp && <span>{timestamp}</span>}
                    {status && !isOutgoing && <span>· {statusLabel[status]}</span>}
                    {status && isOutgoing && <span>· {statusLabel[status]}</span>}
                </span>
            </div>
        </div>
    );
}

export type { ChatMessageProps, ChatMessageVariant };
export default ChatMessage;
