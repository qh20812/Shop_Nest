import { ArrowLeft, ChevronDown, Sparkles, Store, X } from 'lucide-react';
import * as React from 'react';

import Avatar from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { IconButton } from '@/components/ui/icon-button';
import { cn } from '@/lib/utils';

type ChatHeaderProps = {
    variant?: 'assistant' | 'shop';
    title: string;
    subtitle?: string;
    online?: boolean;
    avatar?: string | null;
    onClose?: () => void;
    onMinimize?: () => void;
    onBack?: () => void;
    actions?: React.ReactNode;
    className?: string;
};

export function ChatHeader({
    variant = 'shop',
    title,
    subtitle,
    online = false,
    avatar,
    onClose,
    onMinimize,
    onBack,
    actions,
    className,
}: ChatHeaderProps) {
    return (
        <header className={cn('flex min-h-header items-center gap-3 border-b border-border bg-warm-porcelain px-4 py-3', className)}>
            {onBack && (
                <IconButton label="Quay lại danh sách" variant="ghost" size="sm" onClick={onBack} className="lg:hidden">
                    <ArrowLeft aria-hidden="true" />
                </IconButton>
            )}

            {variant === 'assistant' ? (
                <span className="flex size-10 shrink-0 items-center justify-center rounded-pill bg-lacquer-wash text-lacquer-deep">
                    <Sparkles aria-hidden="true" className="size-5" />
                </span>
            ) : (
                <Avatar name={title} src={avatar} size="md" />
            )}

            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="truncate text-body-md font-semibold text-ink">{title}</span>
                    {variant === 'assistant' && (
                        <Badge tone="accent" size="sm">
                            AI
                        </Badge>
                    )}
                </div>
                <span className="flex items-center gap-1.5 text-label-micro text-ink-muted">
                    {online ? <span aria-hidden="true" className="size-1.5 rounded-pill bg-jade" /> : <Store aria-hidden="true" className="size-3" />}
                    {subtitle ?? (variant === 'assistant' ? 'Trực tuyến' : online ? 'Đang trực tuyến' : 'Ngoại tuyến')}
                </span>
            </div>

            <div className="flex items-center gap-1">
                {actions}
                {onMinimize && (
                    <IconButton label="Thu nhỏ cửa sổ chat" variant="ghost" size="sm" onClick={onMinimize}>
                        <ChevronDown aria-hidden="true" />
                    </IconButton>
                )}
                {onClose && (
                    <IconButton label="Đóng cửa sổ chat" variant="ghost" size="sm" onClick={onClose}>
                        <X aria-hidden="true" />
                    </IconButton>
                )}
            </div>
        </header>
    );
}

export type { ChatHeaderProps };
export default ChatHeader;
