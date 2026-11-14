import { Send, Smile } from 'lucide-react';
import * as React from 'react';

import { IconButton } from '@/components/ui/icon-button';
import Textarea from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

type ChatComposerProps = {
    value: string;
    onChange: (value: string) => void;
    onSend: () => void;
    disabled?: boolean;
    loading?: boolean;
    placeholder?: string;
    maxLength?: number;
    onEmoji?: () => void;
    className?: string;
};

export function ChatComposer({
    value,
    onChange,
    onSend,
    disabled = false,
    loading = false,
    placeholder = 'Nhập tin nhắn...',
    maxLength = 500,
    onEmoji,
    className,
}: ChatComposerProps) {
    const canSend = value.trim().length > 0 && !disabled && !loading;

    const submit = () => {
        if (!canSend) {
            return;
        }

        onSend();
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
            event.preventDefault();
            submit();
        }
    };

    return (
        <form
            className={cn('flex items-end gap-2 border-t border-border bg-warm-porcelain p-3', className)}
            onSubmit={(event) => {
                event.preventDefault();
                submit();
            }}
        >
            {onEmoji && (
                <IconButton label="Chèn biểu tượng" variant="ghost" size="sm" onClick={onEmoji} disabled={disabled}>
                    <Smile aria-hidden="true" />
                </IconButton>
            )}

            <div className="min-w-0 flex-1">
                <Textarea
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    rows={1}
                    maxLength={maxLength}
                    autoGrow
                    maxRows={4}
                    disabled={disabled}
                    className="min-h-control-md resize-none py-2.5 text-body-sm"
                    aria-label="Nội dung tin nhắn"
                />
            </div>

            <IconButton label="Gửi tin nhắn" variant="primary" size="md" type="submit" disabled={!canSend}>
                <Send aria-hidden="true" />
            </IconButton>
        </form>
    );
}

export type { ChatComposerProps };
export default ChatComposer;
