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
import { cx } from '@/lib/cx';

import styles from './chat.module.css';

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
        <div className={cx(styles.workspace, className)}>
            <div className={styles.workspaceGrid} data-rail={activeConversation && order ? 'true' : undefined}>
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
                    className={cx(activeConversation ? styles.listHidden : undefined)}
                />

                <section
                    className={cx(styles.workspaceThread, activeConversation ? undefined : styles.threadHidden)}
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
                            />

                            {sendError ? (
                                <div className={styles.workspaceAlert}>
                                    <Alert tone="danger" title="Không gửi được tin nhắn" description={sendError} onDismiss={clearSendError} />
                                </div>
                            ) : null}

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
                        <div className={styles.workspaceEmpty}>
                            {loading ? (
                                <>
                                    <Skeleton className={styles.workspaceEmptySkeletonTitle} />
                                    <Skeleton className={styles.workspaceEmptySkeletonText} />
                                </>
                            ) : (
                                <>
                                    <span className={styles.workspaceEmptyIcon}>
                                        <Search aria-hidden="true" className={styles.headerIconSvg} />
                                    </span>
                                    <span className={styles.workspaceEmptyTitle}>Chọn một cuộc trò chuyện</span>
                                    <span className={styles.workspaceEmptyText}>
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

                {activeConversation && order ? (
                    <OrderContextRail order={order} onAsk={(question) => setDraft(question)} className={styles.railHidden} />
                ) : null}
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
                <form onSubmit={handleCreateConversation} className={styles.composeForm}>
                    <SearchInput
                        value={composeQuery}
                        onChange={(event) => setComposeQuery(event.target.value)}
                        placeholder="Tìm theo tên hoặc username..."
                        loading={composeSearching}
                        aria-label="Tìm người để chat"
                    />

                    <div className={styles.composeResults}>
                        {composeResults.length === 0 ? (
                            <span className={styles.composeEmpty}>
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
                                        className={styles.composeResult}
                                        data-selected={selected ? 'true' : undefined}
                                    >
                                        <span className={styles.composeResultBody}>
                                            <span className={styles.composeResultName}>{name}</span>
                                            {user.username ? <span className={styles.composeResultHandle}>@{user.username}</span> : null}
                                        </span>
                                        {selected ? <Check aria-hidden="true" className={styles.composeCheck} /> : null}
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

                    {sendError ? <Alert tone="danger" title="Không thể tạo cuộc trò chuyện" description={sendError} /> : null}

                    <div className={styles.composeActions}>
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
