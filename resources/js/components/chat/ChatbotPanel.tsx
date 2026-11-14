import { ShieldCheck } from 'lucide-react';
import * as React from 'react';

import { ChatComposer } from '@/components/chat/ChatComposer';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { MessageList, type MessageListItem } from '@/components/chat/MessageList';
import { QuickReplies } from '@/components/chat/QuickReplies';
import { Alert } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

type ChatbotPanelProps = {
    messages: MessageListItem[];
    onSend: (message: string) => void;
    onClose: () => void;
    onMinimize?: () => void;
    typing?: boolean;
    loading?: boolean;
    error?: string | null;
    onDismissError?: () => void;
    quickReplies?: Array<string | { id?: string; label: string; value?: string }>;
    className?: string;
};

const defaultQuickReplies = ['Tra cứu đơn hàng', 'Chính sách đổi trả', 'Tư vấn sản phẩm'];

export function ChatbotPanel({
    messages,
    onSend,
    onClose,
    onMinimize,
    typing = false,
    loading = false,
    error,
    onDismissError,
    quickReplies = defaultQuickReplies,
    className,
}: ChatbotPanelProps) {
    const [draft, setDraft] = React.useState('');

    const send = (value: string) => {
        const trimmed = value.trim();

        if (trimmed === '' || typing) {
            return;
        }

        onSend(trimmed);
        setDraft('');
    };

    return (
        <div className={cn('flex h-full min-h-0 flex-col bg-warm-porcelain', className)} style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
            <ChatHeader variant="assistant" title="Trợ lý ShopNest" subtitle="Trực tuyến" online onClose={onClose} onMinimize={onMinimize} />

            <MessageList
                messages={messages}
                loading={loading}
                typing={typing}
                typingLabel="Trợ lý đang soạn tin"
                emptyTitle="Xin chào!"
                emptyDescription="Hỏi mình về đơn hàng, đổi trả hoặc chọn sản phẩm phù hợp."
                className="min-h-0"
            />

            <div className="flex flex-col gap-3 border-t border-border p-3">
                {error && <Alert tone="danger" title="Trợ lý đang bận" description={error} onDismiss={onDismissError} />}

                <QuickReplies items={quickReplies} onSelect={send} disabled={typing} />

                <ChatComposer
                    value={draft}
                    onChange={setDraft}
                    onSend={() => send(draft)}
                    loading={typing}
                    disabled={typing}
                    placeholder="Hỏi trợ lý ShopNest..."
                />

                <p className="flex items-start gap-1.5 text-label-micro text-ink-faint">
                    <ShieldCheck aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
                    Trợ lý có thể sai sót. Kiểm tra thông tin quan trọng trước khi đặt hàng.
                </p>
            </div>
        </div>
    );
}

export type { ChatbotPanelProps };
export default ChatbotPanel;
