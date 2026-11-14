import { Pin } from 'lucide-react';

import Avatar from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

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
    return (
        <button
            type="button"
            onClick={onClick}
            aria-current={active ? 'true' : undefined}
            className={cn(
                'focus-ring flex w-full items-start gap-3 rounded-control px-3 py-3 text-left transition-colors',
                active ? 'bg-lacquer-wash/60' : 'hover:bg-rice-paper/70',
                className,
            )}
        >
            <span className="relative shrink-0">
                <Avatar name={name} size="md" />
                {online && (
                    <span
                        aria-label="Đang trực tuyến"
                        className="absolute -right-0.5 -bottom-0.5 size-3 rounded-pill border-2 border-warm-porcelain bg-jade"
                    />
                )}
            </span>

            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="flex items-center gap-2">
                    <span className={cn('min-w-0 flex-1 truncate text-body-sm', active ? 'font-semibold text-ink' : 'font-medium text-ink')}>
                        {name}
                    </span>
                    {timestamp && <span className="shrink-0 font-mono text-label-micro text-ink-faint">{timestamp}</span>}
                </span>

                <span className="flex items-center gap-2">
                    {pinned && <Pin aria-label="Đã ghim" className="size-3 shrink-0 text-lacquer-red" />}
                    <span className={cn('min-w-0 flex-1 truncate text-label-micro', unreadCount > 0 ? 'font-medium text-ink' : 'text-ink-muted')}>
                        {preview || 'Chưa có tin nhắn.'}
                    </span>
                    {unreadCount > 0 && (
                        <span className="flex min-w-5 shrink-0 items-center justify-center rounded-pill bg-lacquer-red px-1.5 font-mono text-label-micro text-warm-porcelain">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </span>
            </span>
        </button>
    );
}

export type { ConversationRowProps };
export default ConversationRow;
