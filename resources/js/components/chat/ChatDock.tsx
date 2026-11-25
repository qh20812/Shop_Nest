import { usePage } from '@inertiajs/react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as React from 'react';

import { ChatbotLauncher } from '@/components/chat/ChatbotLauncher';
import { MarkdownText } from '@/components/chat/MarkdownText';
import type { MessageListItem } from '@/components/chat/MessageList';
import type { ChatbotHistoryTurn, ChatProduct } from '@/components/chat/types';
import { DialogDescription, DialogRoot, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { formatChatTimestamp } from '@/hooks/useChatConversations';
import { cx } from '@/lib/cx';
import { useTranslation } from '@/lib/i18n';

import shellStyles from './chat-launcher.module.css';

const ChatbotPanel = React.lazy(() => import('./ChatbotPanel'));

type StoredMessage = {
    id: number;
    variant: 'incoming' | 'outgoing' | 'error';
    content: string;
    createdAt: string;
    products?: ChatProduct[];
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
            .map((item) => {
                const products = sanitizeProducts((item as StoredMessage).products);

                return products ? { ...item, products } : { ...item, products: undefined };
            })
            .slice(-MAX_STORED_MESSAGES);
    } catch {
        return [greeting];
    }
}

function sanitizeProducts(value: unknown): ChatProduct[] | undefined {
    if (!Array.isArray(value)) {
        return undefined;
    }

    const products = value.filter(
        (product): product is ChatProduct =>
            typeof product === 'object' &&
            product !== null &&
            typeof (product as ChatProduct).id === 'number' &&
            typeof (product as ChatProduct).name === 'string' &&
            typeof (product as ChatProduct).price === 'number',
    );

    return products.length > 0 ? products : undefined;
}

function mapHistoryTurns(turns: unknown): StoredMessage[] {
    if (!Array.isArray(turns)) {
        return [];
    }

    const restored: StoredMessage[] = [];

    for (const turn of turns) {
        if (typeof turn !== 'object' || turn === null) {
            continue;
        }

        const record = turn as Partial<ChatbotHistoryTurn>;

        if (typeof record.id !== 'number' || typeof record.user_content !== 'string' || typeof record.assistant_content !== 'string') {
            continue;
        }

        const createdAt = typeof record.created_at === 'string' && record.created_at !== '' ? record.created_at : new Date().toISOString();
        const products = sanitizeProducts(record.products);

        restored.push({
            id: record.id * 2,
            variant: 'outgoing',
            content: record.user_content,
            createdAt,
        });

        restored.push({
            id: record.id * 2 + 1,
            variant: 'incoming',
            content: record.assistant_content,
            createdAt,
            products,
        });
    }

    return restored.slice(-MAX_STORED_MESSAGES);
}

export function ChatDock({ enabled = true, defaultOpen = false, unreadCount = 0 }: ChatDockProps) {
    const { t } = useTranslation();
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
    const [clearing, setClearing] = React.useState(false);
    const historySynced = React.useRef(false);

    React.useEffect(() => {
        try {
            window.localStorage.setItem(storageKey, JSON.stringify(messages.slice(-MAX_STORED_MESSAGES)));
        } catch {
            // Storage can be unavailable in private mode; chat still works for the session.
        }
    }, [messages, storageKey]);

    // Server là nguồn lịch sử chính: đăng nhập máy khác vẫn thấy hội thoại cũ.
    React.useEffect(() => {
        if (!open || !isAuthenticated || historySynced.current) {
            return;
        }

        let cancelled = false;
        const controller = new AbortController();

        void (async () => {
            try {
                const response = await fetch('/chatbot/history?limit=20', {
                    headers: {
                        Accept: 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    credentials: 'same-origin',
                    signal: controller.signal,
                });

                if (!response.ok) {
                    return; // Giữ bản localStorage và thử lại ở lần mở sau.
                }

                const payload = await response.json();

                if (cancelled) {
                    return;
                }

                const restored = mapHistoryTurns(payload?.data?.turns);

                if (restored.length > 0) {
                    setMessages(restored);
                    setResolvedUnread(0);
                }

                historySynced.current = true;
            } catch {
                // Ngoại tuyến hoặc request bị huỷ: giữ lịch sử localStorage.
            }
        })();

        return () => {
            cancelled = true;
            controller.abort();
        };
    }, [open, isAuthenticated]);

    if (!enabled || !isAuthenticated || !isChatDockVisible(pathname)) {
        return null;
    }

    const handleClearHistory = async () => {
        if (clearing) {
            return;
        }

        setClearing(true);

        try {
            const response = await fetch('/chatbot/history', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}),
                },
                credentials: 'same-origin',
            });

            if (!response.ok) {
                throw new Error(t('Could not clear the conversation history.'));
            }

            historySynced.current = true;
            setMessages([greeting]);
            setResolvedUnread(0);
            setError(null);

            try {
                window.localStorage.removeItem(storageKey);
            } catch {
                // localStorage có thể bị chặn; server đã xoá là đủ.
            }
        } catch (clearError) {
            setError(clearError instanceof Error ? clearError.message : t('Could not clear the conversation history.'));
        } finally {
            setClearing(false);
        }
    };

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
                throw new Error(payload?.message ?? t('Could not connect to the assistant.'));
            }

            const reply = payload?.data?.reply ?? payload?.reply;
            const products = sanitizeProducts(payload?.data?.products);

            if (typeof reply !== 'string' || reply.trim() === '') {
                throw new Error(t('The assistant did not reply.'));
            }

            setMessages((current) => [
                ...current,
                {
                    id: Date.now() + 1,
                    variant: 'incoming',
                    content: reply,
                    createdAt: new Date().toISOString(),
                    products,
                },
            ]);
        } catch (requestError) {
            const message = requestError instanceof Error ? requestError.message : t('Could not connect to the assistant.');
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
        // Assistant replies are markdown; user input and errors stay plain text.
        content: message.variant === 'incoming' ? <MarkdownText text={message.content} /> : message.content,
        timestamp: formatChatTimestamp(message.createdAt),
        products: message.products,
    }));

    return (
        <DialogRoot open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <ChatbotLauncher open={open} unreadCount={resolvedUnread} />
            </DialogTrigger>

            <DialogPrimitive.Portal>
                <DialogPrimitive.Content className={cx(shellStyles.dockContent)}>
                    <DialogTitle className="sn-visually-hidden">{t('ShopNest assistant')}</DialogTitle>
                    <DialogDescription className="sn-visually-hidden">
                        {t('Chat window with the ShopNest assistant. Press Escape to close.')}
                    </DialogDescription>

                    <React.Suspense fallback={<div className={shellStyles.dockLoading} aria-busy="true" />}>
                        <ChatbotPanel
                            messages={panelMessages}
                            onSend={handleSend}
                            onClose={() => handleOpenChange(false)}
                            onMinimize={() => handleOpenChange(false)}
                            typing={typing}
                            error={error}
                            onDismissError={() => setError(null)}
                            onClearHistory={handleClearHistory}
                            clearing={clearing}
                        />
                    </React.Suspense>
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogRoot>
    );
}

export default ChatDock;
