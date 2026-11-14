import { usePage } from '@inertiajs/react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as React from 'react';

import { ChatbotLauncher } from '@/components/chat/ChatbotLauncher';
import { ChatbotPanel } from '@/components/chat/ChatbotPanel';
import type { MessageListItem } from '@/components/chat/MessageList';
import { DialogDescription, DialogRoot, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { formatChatTimestamp } from '@/hooks/useChatConversations';
import { cn } from '@/lib/utils';

type StoredMessage = {
    id: number;
    variant: 'incoming' | 'outgoing' | 'error';
    content: string;
    createdAt: string;
};

type ChatDockProps = {
    enabled?: boolean;
    defaultOpen?: boolean;
    unreadCount?: number;
};

type ChatDockPageProps = {
    csrfToken?: string;
    auth?: { user?: { id: number } | null } | null;
};

const STORAGE_KEY = 'shopnest.chatbot.messages.v2';
const MAX_STORED_MESSAGES = 40;

const hiddenPrefixes = [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
    '/checkout',
    '/payments',
    '/chat',
    '/customer/chat',
    '/admin',
    '/seller',
    '/shipper',
];

export function isChatDockVisible(pathname: string): boolean {
    return !hiddenPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

const greeting: StoredMessage = {
    id: 1,
    variant: 'incoming',
    content: 'Chào bạn, mình là trợ lý ShopNest. Bạn cần tra cứu đơn hàng, chính sách đổi trả hay tư vấn sản phẩm?',
    createdAt: new Date().toISOString(),
};

function loadStoredMessages(storageKey: string): StoredMessage[] {
    if (typeof window === 'undefined') {
        return [greeting];
    }

    try {
        const raw = window.localStorage.getItem(storageKey);

        if (!raw) {
            return [greeting];
        }

        const parsed = JSON.parse(raw);

        if (!Array.isArray(parsed) || parsed.length === 0) {
            return [greeting];
        }

        return parsed
            .filter(
                (item): item is StoredMessage =>
                    typeof item === 'object' &&
                    item !== null &&
                    typeof item.id === 'number' &&
                    typeof item.content === 'string' &&
                    typeof item.createdAt === 'string' &&
                    ['incoming', 'outgoing', 'error'].includes(item.variant),
            )
            .slice(-MAX_STORED_MESSAGES);
    } catch {
        return [greeting];
    }
}

export function ChatDock({ enabled = true, defaultOpen = false, unreadCount = 0 }: ChatDockProps) {
    const page = usePage<ChatDockPageProps>();
    const pathname = page.url.split('?')[0];
    const csrfToken = page.props.csrfToken;
    const isAuthenticated = Boolean(page.props.auth?.user);
    const storageKey = `${STORAGE_KEY}.${page.props.auth?.user?.id ?? 'guest'}`;

    const [open, setOpen] = React.useState(defaultOpen && isAuthenticated);
    const [messages, setMessages] = React.useState<StoredMessage[]>(() => loadStoredMessages(storageKey));
    const [typing, setTyping] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [resolvedUnread, setResolvedUnread] = React.useState(unreadCount);

    React.useEffect(() => {
        try {
            window.localStorage.setItem(storageKey, JSON.stringify(messages.slice(-MAX_STORED_MESSAGES)));
        } catch {
            // Storage can be unavailable in private mode; chat still works for the session.
        }
    }, [messages, storageKey]);

    if (!enabled || !isAuthenticated || !isChatDockVisible(pathname)) {
        return null;
    }

    const handleOpenChange = (next: boolean) => {
        setOpen(next);

        if (next) {
            setResolvedUnread(0);
            setError(null);
        }
    };

    const handleSend = async (content: string) => {
        const trimmed = content.trim();

        if (trimmed === '' || typing) {
            return;
        }

        const userMessage: StoredMessage = {
            id: Date.now(),
            variant: 'outgoing',
            content: trimmed,
            createdAt: new Date().toISOString(),
        };

        setMessages((current) => [...current, userMessage]);
        setTyping(true);
        setError(null);

        try {
            const response = await fetch('/chatbot/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}),
                },
                credentials: 'same-origin',
                body: JSON.stringify({ message: trimmed }),
            });

            const payload = await response.json();

            if (!response.ok) {
                throw new Error(payload?.message ?? 'Không thể kết nối trợ lý.');
            }

            const reply = payload?.data?.reply ?? payload?.reply;

            if (typeof reply !== 'string' || reply.trim() === '') {
                throw new Error('Trợ lý chưa có câu trả lời.');
            }

            setMessages((current) => [
                ...current,
                {
                    id: Date.now() + 1,
                    variant: 'incoming',
                    content: reply,
                    createdAt: new Date().toISOString(),
                },
            ]);
        } catch (requestError) {
            const message = requestError instanceof Error ? requestError.message : 'Không thể kết nối trợ lý.';
            setError(message);
            setMessages((current) => [
                ...current,
                {
                    id: Date.now() + 1,
                    variant: 'error',
                    content: message,
                    createdAt: new Date().toISOString(),
                },
            ]);
        } finally {
            setTyping(false);
        }
    };

    const panelMessages: MessageListItem[] = messages.map((message) => ({
        id: message.id,
        variant: message.variant,
        content: message.content,
        timestamp: formatChatTimestamp(message.createdAt),
    }));

    return (
        <DialogRoot open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <ChatbotLauncher open={open} unreadCount={resolvedUnread} />
            </DialogTrigger>

            <DialogPrimitive.Portal>
                <DialogPrimitive.Content
                    className={cn(
                        'z-chat fixed inset-x-0 top-auto bottom-0 h-chat-sheet-height w-full max-w-none translate-x-0 translate-y-0 overflow-hidden rounded-t-sheet border border-border bg-warm-porcelain p-0 shadow-float focus:outline-none',
                        'md:inset-auto md:right-6 md:bottom-6 md:h-[var(--spacing-chat-panel-height)] md:w-chat-panel md:rounded-surface',
                    )}
                >
                    <DialogTitle className="sr-only">Trợ lý ShopNest</DialogTitle>
                    <DialogDescription className="sr-only">Cửa sổ trò chuyện với trợ lý ảo ShopNest. Nhấn Escape để đóng.</DialogDescription>

                    <ChatbotPanel
                        messages={panelMessages}
                        onSend={handleSend}
                        onClose={() => handleOpenChange(false)}
                        onMinimize={() => handleOpenChange(false)}
                        typing={typing}
                        error={error}
                        onDismissError={() => setError(null)}
                    />
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogRoot>
    );
}

export default ChatDock;
