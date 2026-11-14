import { Check, Search } from 'lucide-react';
import * as React from 'react';

import { ChatComposer } from '@/components/chat/ChatComposer';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ConversationList } from '@/components/chat/ConversationList';
import { MessageList } from '@/components/chat/MessageList';
import type { ChatConversationModel, ChatMessageModel } from '@/components/chat/types';
import type { OrderAnnouncementModel } from '@/components/commerce/OrderAnnouncementCard';
import { OrderContextRail } from '@/components/commerce/OrderContextRail';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { FormField } from '@/components/ui/form-field';
import { SearchInput } from '@/components/ui/search-input';
import { Skeleton } from '@/components/ui/skeleton';
import Textarea from '@/components/ui/textarea';
import { formatChatTimestamp, formatConversationTimestamp, useChatConversations, type ChatUser } from '@/hooks/useChatConversations';
import { cn } from '@/lib/utils';

type ChatWorkspaceProps = {
    conversations?: ChatConversationModel[];
    activeId?: number | null;
    onSelect?: (id: number) => void;
    order?: OrderAnnouncementModel | null;
    className?: string;
};

export function ChatWorkspace({ order, className }: ChatWorkspaceProps) {
    const {
        currentUserId,
        conversations,
        activeConversation,
        activeId,
        selectConversation,
        clearActive,
        loading,
        refreshing,
        error,
        refresh,
        sendMessage,
        sending,
        sendError,
        clearSendError,
        searchUsers,
        createConversation,
    } = useChatConversations();

    const [query, setQuery] = React.useState('');
    const [draft, setDraft] = React.useState('');
    const [composeOpen, setComposeOpen] = React.useState(false);
    const [composeQuery, setComposeQuery] = React.useState('');
    const [composeResults, setComposeResults] = React.useState<ChatUser[]>([]);
    const [composeSelected, setComposeSelected] = React.useState<ChatUser | null>(null);
    const [composeMessage, setComposeMessage] = React.useState('');
    const [composeSearching, setComposeSearching] = React.useState(false);

    React.useEffect(() => {
        setDraft('');
        clearSendError();
    }, [activeId, clearSendError]);

    React.useEffect(() => {
        if (!composeOpen) {
            return;
        }

        const term = composeQuery.trim();

        if (term === '') {
            setComposeResults([]);
            return;
        }

        let active = true;
        setComposeSearching(true);

        const timer = window.setTimeout(() => {
            searchUsers(term)
                .then((users) => {
                    if (active) {
                        setComposeResults(users);
                    }
                })
                .catch(() => {
                    if (active) {
                        setComposeResults([]);
                    }
                })
                .finally(() => {
                    if (active) {
                        setComposeSearching(false);
                    }
                });
        }, 350);

        return () => {
            active = false;
            window.clearTimeout(timer);
        };
    }, [composeOpen, composeQuery, searchUsers]);

    const filteredConversations = conversations.filter((conversation) => {
        const term = query.trim().toLowerCase();

        if (term === '') {
            return true;
        }

        return conversation.partnerName.toLowerCase().includes(term) || conversation.lastMessagePreview.toLowerCase().includes(term);
    });

    const listItems = filteredConversations.map((conversation) => ({
        id: conversation.id,
        name: conversation.partnerName,
        preview: conversation.lastMessagePreview,
        timestamp: formatConversationTimestamp(conversation.lastMessageAt),
        unreadCount: conversation.unreadCount,
        online: conversation.partnerStatus === 'Đang trực tuyến',
    }));

    const messageItems = (activeConversation?.messages ?? []).map((message: ChatMessageModel) => ({
        id: message.id,
        variant: message.senderId === currentUserId ? ('outgoing' as const) : ('incoming' as const),
        content: message.content,
        timestamp: formatChatTimestamp(message.createdAt),
        assistantName: activeConversation?.partnerName,
    }));

    const handleSend = async () => {
        const sent = await sendMessage(draft);
        if (sent) {
            setDraft('');
        }
    };

    const resetCompose = () => {
        setComposeOpen(false);
        setComposeQuery('');
        setComposeResults([]);
        setComposeSelected(null);
        setComposeMessage('');
    };

    const handleCreateConversation = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!composeSelected || composeMessage.trim() === '') {
            return;
        }

        const id = await createConversation(composeSelected.id, composeMessage);

        if (id) {
            resetCompose();
        }
    };

    return (
        <div className={cn('flex min-h-chat-workspace-height flex-col gap-4', className)}>
            <div className="grid min-h-chat-workspace-height flex-1 grid-rows-[auto_1fr] overflow-hidden rounded-surface border border-border bg-warm-porcelain lg:grid-cols-[20rem_1fr] lg:grid-rows-1 xl:grid-cols-[20rem_1fr_18rem]">
                <ConversationList
                    conversations={listItems}
                    activeId={activeId}
                    onSelect={selectConversation}
                    query={query}
                    onQueryChange={setQuery}
                    loading={loading || refreshing}
                    error={error}
                    onRefresh={refresh}
                    onCompose={() => setComposeOpen(true)}
                    className={cn('max-h-60 border-b lg:max-h-none lg:border-r lg:border-b-0', activeConversation ? 'hidden lg:flex' : 'flex')}
                />

                <section
                    className={cn('flex min-h-0 flex-col', activeConversation ? 'flex' : 'hidden lg:flex')}
                    aria-label="Nội dung cuộc trò chuyện"
                >
                    {activeConversation ? (
                        <>
                            <ChatHeader
                                variant="shop"
                                title={activeConversation.partnerName}
                                subtitle={activeConversation.partnerStatus}
                                online={activeConversation.partnerStatus === 'Đang trực tuyến'}
                                onBack={clearActive}
                            />

                            <MessageList
                                messages={messageItems}
                                loading={loading}
                                typing={sending}
                                typingLabel="Đang gửi tin"
                                emptyTitle="Bắt đầu trò chuyện"
                                emptyDescription={`Gửi tin nhắn đầu tiên tới ${activeConversation.partnerName}.`}
                                className="min-h-0"
                            />

                            {sendError && (
                                <div className="px-3 pt-3">
                                    <Alert tone="danger" title="Không gửi được tin nhắn" description={sendError} onDismiss={clearSendError} />
                                </div>
                            )}

                            <ChatComposer
                                value={draft}
                                onChange={setDraft}
                                onSend={handleSend}
                                loading={sending}
                                disabled={sending}
                                placeholder={`Nhập tin nhắn cho ${activeConversation.partnerName}...`}
                            />
                        </>
                    ) : (
                        <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
                            {loading ? (
                                <>
                                    <Skeleton className="h-8 w-40" />
                                    <Skeleton className="h-4 w-56" />
                                </>
                            ) : (
                                <>
                                    <span className="flex size-14 items-center justify-center rounded-pill bg-lacquer-wash text-lacquer-red">
                                        <Search aria-hidden="true" className="size-6" />
                                    </span>
                                    <span className="text-headline-3 text-ink">Chọn một cuộc trò chuyện</span>
                                    <span className="max-w-sm text-body-sm text-ink-muted">
                                        Chọn shop hoặc người bán ở cột bên trái, hoặc bắt đầu cuộc trò chuyện mới để được tư vấn.
                                    </span>
                                    <Button variant="secondary" size="sm" onClick={() => setComposeOpen(true)}>
                                        Bắt đầu trò chuyện
                                    </Button>
                                </>
                            )}
                        </div>
                    )}
                </section>

                {activeConversation && order && (
                    <OrderContextRail order={order} onAsk={(question) => setDraft(question)} className="hidden xl:flex" />
                )}
            </div>

            <Dialog
                open={composeOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        resetCompose();
                    } else {
                        setComposeOpen(true);
                    }
                }}
                title="Bắt đầu cuộc trò chuyện"
                description="Tìm shop hoặc người bán bạn muốn liên hệ."
                size="lg"
            >
                <form onSubmit={handleCreateConversation} className="mt-4 flex flex-col gap-4">
                    <SearchInput
                        value={composeQuery}
                        onChange={(event) => setComposeQuery(event.target.value)}
                        placeholder="Tìm theo tên hoặc username..."
                        loading={composeSearching}
                        aria-label="Tìm người để chat"
                    />

                    <div className="flex max-h-64 flex-col gap-1 overflow-y-auto">
                        {composeResults.length === 0 ? (
                            <span className="px-2 py-4 text-center text-body-sm text-ink-muted">
                                {composeQuery.trim() === '' ? 'Nhập tên shop hoặc username để tìm.' : 'Không tìm thấy người phù hợp.'}
                            </span>
                        ) : (
                            composeResults.map((user) => {
                                const selected = composeSelected?.id === user.id;
                                const name =
                                    user.name ??
                                    ([user.first_name, user.last_name].filter(Boolean).join(' ') ||
                                        user.username ||
                                        user.email ||
                                        `Người dùng #${user.id}`);

                                return (
                                    <button
                                        key={user.id}
                                        type="button"
                                        onClick={() => setComposeSelected(user)}
                                        className={cn(
                                            'focus-ring flex items-center justify-between gap-3 rounded-control border px-3 py-2.5 text-left transition-colors',
                                            selected ? 'border-lacquer-red bg-lacquer-wash/50' : 'border-border hover:border-ink-muted',
                                        )}
                                    >
                                        <span className="flex flex-col">
                                            <span className="text-body-sm font-medium text-ink">{name}</span>
                                            {user.username && <span className="font-mono text-label-micro text-ink-faint">@{user.username}</span>}
                                        </span>
                                        {selected && <Check aria-hidden="true" className="size-4 text-lacquer-red" />}
                                    </button>
                                );
                            })
                        )}
                    </div>

                    <FormField label="Tin nhắn đầu tiên" required>
                        <Textarea
                            value={composeMessage}
                            onChange={(event) => setComposeMessage(event.target.value)}
                            rows={3}
                            maxLength={500}
                            counter
                            placeholder="Xin chào, tôi muốn hỏi về sản phẩm..."
                        />
                    </FormField>

                    {sendError && <Alert tone="danger" title="Không thể tạo cuộc trò chuyện" description={sendError} />}

                    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                        <Button type="button" variant="secondary" onClick={resetCompose}>
                            Huỷ
                        </Button>
                        <Button type="submit" loading={sending} disabled={!composeSelected || composeMessage.trim() === ''}>
                            Gửi tin nhắn
                        </Button>
                    </div>
                </form>
            </Dialog>
        </div>
    );
}

export type { ChatWorkspaceProps };
export default ChatWorkspace;
