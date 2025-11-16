import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { usePage } from '@inertiajs/react';
import { echo } from '@laravel/echo-react';
import { appendCsrfToken, resolveCsrfToken } from '@/lib/csrf';
import ChatList, { ConversationItem } from '@/Components/Chat/ChatList';
import ChatWindow, { ChatMessage } from '@/Components/Chat/ChatWindow';
import CreateConversationModal from '@/Components/Chat/CreateConversationModal';

type Participant = {
    id: number;
    username?: string | null;
    first_name?: string | null;
    last_name?: string | null;
    email?: string | null;
};

type MessagePayload = {
    id: number;
    conversation_id: number;
    sender_id: number;
    content: string;
    created_at?: string | null;
    updated_at?: string | null;
    sender?: Participant | null;
};

type ConversationPayload = {
    id: number;
    user_id?: number | null;
    receiver_id?: number | null;
    created_at?: string | null;
    updated_at?: string | null;
    user?: Participant | null;
    receiver?: Participant | null;
    messages?: MessagePayload[] | null;
    unread_count?: number | null;
    is_pinned?: boolean | null;
    partner_status?: string | null;
    partner_last_activity_at?: string | null;
    partner_id?: number | null;
};

interface NormalizedMessage {
    id: number;
    conversationId: number;
    senderId: number | null;
    content: string;
    createdAt: string;
    updatedAt: string;
    sender?: Participant | null;
}

interface ConversationState {
    id: number;
    userId: number | null;
    receiverId: number | null;
    partnerId: number | null;
    partner: Participant | null;
    displayName: string;
    lastMessagePreview: string;
    lastMessageAt: string | null;
    unreadCount: number;
    isPinned: boolean;
    messages: NormalizedMessage[];
    updatedAt: string | null;
    partnerStatus: string;
    partnerLastActivityAt: string | null;
}

type ChatPageProps = {
    auth?: {
        user?: {
            id: number;
        } | null;
    } | null;
    csrfToken?: string;
};

const getTimeValue = (iso: string | null | undefined): number => {
    if (!iso) {
        return 0;
    }

    const date = new Date(iso);
    return Number.isNaN(date.getTime()) ? 0 : date.getTime();
};

const DEFAULT_CONVERSATION_NAME = 'Cuộc trò chuyện';

const toNumber = (value: unknown): number | null => {
    return typeof value === 'number' && Number.isFinite(value) ? value : null;
};

const formatParticipantName = (participant?: Participant | null): string => {
    if (!participant) {
        return '';
    }

    const fullName = [participant.first_name, participant.last_name]
        .map((segment) => (typeof segment === 'string' ? segment.trim() : ''))
        .filter(Boolean)
        .join(' ')
        .trim();

    const username = typeof participant.username === 'string' ? participant.username.trim() : '';
    const email = typeof participant.email === 'string' ? participant.email.trim() : '';

    if (fullName.length > 0) {
        return fullName;
    }

    if (username.length > 0) {
        return username;
    }

    if (email.length > 0) {
        return email;
    }

    return participant.id ? `Người dùng #${participant.id}` : '';
};

const resolveUserId = (conversation: ConversationPayload): number | null => {
    return toNumber(conversation.user_id) ?? toNumber(conversation.user?.id) ?? null;
};

const resolveReceiverId = (conversation: ConversationPayload): number | null => {
    return (
        toNumber(conversation.receiver_id) ??
        toNumber(conversation.receiver?.id) ??
        null
    );
};

const getConversationPartner = (conversation: ConversationPayload, currentUserId: number | null): Participant | null => {
    const candidateReceiver = conversation.receiver ?? null;
    const candidateUser = conversation.user ?? null;

    const userId = resolveUserId(conversation);
    const receiverId = resolveReceiverId(conversation);

    if (currentUserId !== null) {
        if (userId === currentUserId) {
            return candidateReceiver;
        }

        if (receiverId === currentUserId) {
            return candidateUser;
        }

        if (candidateUser && candidateUser.id !== currentUserId) {
            return candidateUser;
        }

        if (candidateReceiver && candidateReceiver.id !== currentUserId) {
            return candidateReceiver;
        }
    }

    return candidateReceiver ?? candidateUser ?? null;
};

const buildDisplayName = (conversation: ConversationPayload, currentUserId: number | null): string => {
    return formatParticipantName(getConversationPartner(conversation, currentUserId)) || DEFAULT_CONVERSATION_NAME;
};

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
    return typeof value === 'object' && value !== null;
};

const isConversationPayload = (value: unknown): value is ConversationPayload => {
    return isPlainObject(value) && typeof value.id === 'number';
};

const isMessagePayload = (value: unknown): value is MessagePayload => {
    return isPlainObject(value) && typeof value.id === 'number' && typeof value.conversation_id === 'number';
};

const unwrapResource = <T,>(resource: unknown, predicate: (candidate: unknown) => candidate is T): T | null => {
    if (!resource) {
        return null;
    }

    if (predicate(resource)) {
        return resource;
    }

    if (isPlainObject(resource) && 'data' in resource) {
        const inner = (resource as { data?: unknown }).data;

        if (predicate(inner)) {
            return inner;
        }
    }

    return null;
};

const sortMessages = (messages: NormalizedMessage[]): NormalizedMessage[] => {
    return [...messages].sort((a, b) => getTimeValue(a.createdAt) - getTimeValue(b.createdAt));
};

const normalizeMessage = (message: MessagePayload): NormalizedMessage => {
    const createdAt = message.created_at ?? new Date().toISOString();

    return {
        id: message.id,
        conversationId: message.conversation_id,
        senderId: message.sender_id ?? message.sender?.id ?? null,
        content: message.content ?? '',
        createdAt,
        updatedAt: message.updated_at ?? createdAt,
        sender: message.sender ?? null,
    };
};

const normalizeConversation = (conversation: ConversationPayload, currentUserId: number | null): ConversationState => {
    const normalizedMessages = sortMessages((conversation.messages ?? []).map(normalizeMessage));
    const lastMessage = normalizedMessages[normalizedMessages.length - 1];
    const lastMessageAt = lastMessage?.createdAt ?? conversation.updated_at ?? conversation.created_at ?? null;
    const userId = resolveUserId(conversation);
    const receiverId = resolveReceiverId(conversation);
    const partner = getConversationPartner(conversation, currentUserId);
    const inferredPartnerId = partner?.id ?? (currentUserId !== null
        ? (userId === currentUserId ? receiverId : userId)
        : receiverId ?? userId);
    const partnerStatus = typeof conversation.partner_status === 'string' && conversation.partner_status.trim().length > 0
        ? conversation.partner_status.trim()
        : 'Ngoại tuyến';
    const partnerLastActivityAt = typeof conversation.partner_last_activity_at === 'string'
        ? conversation.partner_last_activity_at
        : null;

    return {
        id: conversation.id,
        userId,
        receiverId,
        partnerId: inferredPartnerId ?? null,
        partner: partner ?? null,
        displayName: buildDisplayName(conversation, currentUserId),
        lastMessagePreview: lastMessage?.content ?? 'Chưa có tin nhắn.',
        lastMessageAt,
        unreadCount: typeof conversation.unread_count === 'number' ? conversation.unread_count : 0,
        isPinned: Boolean(conversation.is_pinned),
        messages: normalizedMessages,
        updatedAt: conversation.updated_at ?? conversation.created_at ?? null,
        partnerStatus,
        partnerLastActivityAt,
    };
};

const sortConversations = (items: ConversationState[]): ConversationState[] => {
    return [...items].sort((a, b) => {
        if (a.isPinned !== b.isPinned) {
            return a.isPinned ? -1 : 1;
        }

        return getTimeValue(b.lastMessageAt ?? b.updatedAt) - getTimeValue(a.lastMessageAt ?? a.updatedAt);
    });
};

const mergeMessages = (current: NormalizedMessage[], incoming: NormalizedMessage): NormalizedMessage[] => {
    const exists = current.some((message) => message.id === incoming.id);

    if (exists) {
        return sortMessages(current.map((message) => (message.id === incoming.id ? incoming : message)));
    }

    return sortMessages([...current, incoming]);
};

const formatListTimestamp = (iso: string | null): string => {
    if (!iso) {
        return '';
    }

    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) {
        return '';
    }

    const now = new Date();
    const isSameDay = date.toDateString() === now.toDateString();
    if (isSameDay) {
        return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    }

    const isSameYear = date.getFullYear() === now.getFullYear();
    return isSameYear ? date.toLocaleDateString(undefined, { month: '2-digit', day: '2-digit' }) : date.toLocaleDateString();
};

const formatMessageTimestamp = (iso: string | null): string => {
    if (!iso) {
        return '';
    }

    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) {
        return '';
    }

    return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
};

const ChatPopup: React.FC = () => {
    const page = usePage<ChatPageProps>();
    const { auth, csrfToken: sharedCsrfToken } = page.props;
    const currentUserId = auth?.user?.id ?? null;
    const csrfToken = sharedCsrfToken ?? resolveCsrfToken();

    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [sendError, setSendError] = useState<string | null>(null);
    const [isSending, setIsSending] = useState(false);
    const [conversations, setConversations] = useState<ConversationState[]>([]);
    const [drafts, setDrafts] = useState<Record<number, string>>({});
    const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const fetchInFlightRef = useRef(false);
    const hasFetchedRef = useRef(false);

    const activeConversation = useMemo(() => conversations.find((conversation) => conversation.id === activeConversationId) ?? null, [conversations, activeConversationId]);
    const activeDraft = activeConversation ? drafts[activeConversation.id] ?? '' : '';
    const isInitialLoading = isLoading && !hasFetchedRef.current;

    const conversationItems: ConversationItem[] = useMemo(
        () =>
            conversations.map((conversation) => ({
                id: conversation.id,
                name: conversation.displayName,
                lastMessage: conversation.lastMessagePreview,
                timestamp: formatListTimestamp(conversation.lastMessageAt ?? conversation.updatedAt),
                unreadCount: conversation.unreadCount,
                pinned: conversation.isPinned,
            })),
        [conversations],
    );

    const chatMessages: ChatMessage[] = useMemo(() => {
        if (!activeConversation) {
            return [];
        }

        return activeConversation.messages.map((message) => ({
            id: message.id,
            content: message.content,
            timestamp: formatMessageTimestamp(message.createdAt),
            sender: currentUserId !== null && message.senderId === currentUserId ? 'me' : 'other',
        }));
    }, [activeConversation, currentUserId]);

    const markConversationAsRead = useCallback((conversationId: number) => {
        setConversations((previous) => {
            let hasChanges = false;

            const updated = previous.map((conversation) => {
                if (conversation.id !== conversationId || conversation.unreadCount === 0) {
                    return conversation;
                }

                hasChanges = true;
                return { ...conversation, unreadCount: 0 };
            });

            return hasChanges ? updated : previous;
        });
    }, []);

    const handleSelectConversation = useCallback(
        (conversationId: number) => {
            setActiveConversationId(conversationId);
            setDrafts((previous) => ({ ...previous, [conversationId]: previous[conversationId] ?? '' }));
            setSendError(null);
            markConversationAsRead(conversationId);
        },
        [markConversationAsRead],
    );

    const handleComposeOpen = useCallback(() => {
        setIsCreateModalOpen(true);
    }, []);

    const handleComposeClose = useCallback(() => {
        setIsCreateModalOpen(false);
    }, []);

    const handleConversationCreated = useCallback(
        (rawPayload: unknown) => {
            if (!isPlainObject(rawPayload)) {
                return;
            }

            const conversationPayload = unwrapResource(rawPayload.conversation, isConversationPayload);

            if (!conversationPayload) {
                return;
            }

            const messagePayload = unwrapResource(rawPayload.message, isMessagePayload);
            const normalizedConversation = normalizeConversation(conversationPayload, currentUserId);
            const normalizedMessage = messagePayload ? normalizeMessage(messagePayload) : null;

            setConversations((previous) => {
                const existing = previous.find((conversation) => conversation.id === normalizedConversation.id);

                if (!existing) {
                    const messages = normalizedMessage
                        ? mergeMessages(normalizedConversation.messages, normalizedMessage)
                        : normalizedConversation.messages;

                    const newConversation: ConversationState = {
                        ...normalizedConversation,
                        messages,
                        lastMessagePreview: normalizedMessage ? normalizedMessage.content : normalizedConversation.lastMessagePreview,
                        lastMessageAt: normalizedMessage ? normalizedMessage.createdAt : normalizedConversation.lastMessageAt,
                        unreadCount: 0,
                        updatedAt: normalizedMessage ? normalizedMessage.createdAt : normalizedConversation.updatedAt,
                    };

                    return sortConversations([newConversation, ...previous]);
                }

                const updated = previous.map((conversation) => {
                    if (conversation.id !== normalizedConversation.id) {
                        return conversation;
                    }

                    const messages = normalizedMessage
                        ? mergeMessages(conversation.messages, normalizedMessage)
                        : conversation.messages;

                    return {
                        ...conversation,
                        displayName: normalizedConversation.displayName,
                        partner: normalizedConversation.partner,
                        partnerId: normalizedConversation.partnerId,
                        userId: normalizedConversation.userId,
                        receiverId: normalizedConversation.receiverId,
                        partnerStatus: normalizedConversation.partnerStatus,
                        partnerLastActivityAt: normalizedConversation.partnerLastActivityAt,
                        messages,
                        lastMessagePreview: normalizedMessage ? normalizedMessage.content : conversation.lastMessagePreview,
                        lastMessageAt: normalizedMessage ? normalizedMessage.createdAt : conversation.lastMessageAt,
                        unreadCount: 0,
                        updatedAt: normalizedMessage ? normalizedMessage.createdAt : conversation.updatedAt,
                    };
                });

                return sortConversations(updated);
            });

            setActiveConversationId(normalizedConversation.id);
            setDrafts((previous) => ({ ...previous, [normalizedConversation.id]: '' }));
            setIsOpen(true);
        },
        [currentUserId],
    );

    const fetchConversations = useCallback(
        async (force = false) => {
            if (fetchInFlightRef.current) {
                return;
            }

            if (!force && hasFetchedRef.current && conversations.length > 0) {
                return;
            }

            fetchInFlightRef.current = true;
            setIsLoading(true);
            setLoadError(null);

            try {
                const response = await axios.get('/chat/conversations');
                const payload = response.data;
                const data = Array.isArray(payload?.data) ? (payload.data as ConversationPayload[]) : Array.isArray(payload) ? (payload as ConversationPayload[]) : [];

                const normalized = sortConversations(data.map((item) => normalizeConversation(item, currentUserId)));
                setConversations(normalized);

                setActiveConversationId((current) => {
                    if (current && normalized.some((conversation) => conversation.id === current)) {
                        return current;
                    }

                    return normalized[0]?.id ?? null;
                });

                hasFetchedRef.current = true;
            } catch (error: unknown) {
                const message = axios.isAxiosError(error)
                    ? error.response?.data?.message ?? error.message ?? 'Không thể tải danh sách cuộc trò chuyện.'
                    : 'Không thể tải danh sách cuộc trò chuyện.';

                setLoadError(message);
                setConversations([]);
                setActiveConversationId(null);
            } finally {
                setIsLoading(false);
                fetchInFlightRef.current = false;
            }
        },
        [conversations.length, currentUserId],
    );

    const handleDraftChange = useCallback(
        (value: string) => {
            if (!activeConversation) {
                return;
            }

            setDrafts((previous) => ({ ...previous, [activeConversation.id]: value }));

            if (sendError) {
                setSendError(null);
            }
        },
        [activeConversation, sendError],
    );

    const handleSendMessage = useCallback(async () => {
        if (!activeConversation) {
            return;
        }

        const conversationId = activeConversation.id;
        const content = (drafts[conversationId] ?? '').trim();

        if (content.length === 0) {
            return;
        }

        setIsSending(true);
        setSendError(null);

        try {
            const response = await axios.post(
                '/chat/messages',
                appendCsrfToken({
                    conversation_id: conversationId,
                    content,
                }, csrfToken),
            );

            const payload = response.data?.data ?? response.data;
            const savedMessage = normalizeMessage(payload as MessagePayload);

            setConversations((previous) => {
                const updated = previous.map((conversation) => {
                    if (conversation.id !== conversationId) {
                        return conversation;
                    }

                    const mergedMessages = mergeMessages(conversation.messages, savedMessage);

                    return {
                        ...conversation,
                        messages: mergedMessages,
                        lastMessagePreview: savedMessage.content,
                        lastMessageAt: savedMessage.createdAt,
                        unreadCount: 0,
                        updatedAt: savedMessage.createdAt,
                    };
                });

                return sortConversations(updated);
            });

            setDrafts((previous) => ({ ...previous, [conversationId]: '' }));
        } catch (error: unknown) {
            const message = axios.isAxiosError(error)
                ? error.response?.data?.message ?? error.message ?? 'Không thể gửi tin nhắn.'
                : 'Không thể gửi tin nhắn.';

            setSendError(message);
        } finally {
            setIsSending(false);
        }
    }, [activeConversation, csrfToken, drafts]);

    const handleIncomingMessage = useCallback(
        (payload: MessagePayload) => {
            const incoming = normalizeMessage(payload);

            setConversations((previous) => {
                if (previous.length === 0) {
                    return previous;
                }

                let matched = false;

                const updated = previous.map((conversation) => {
                    if (conversation.id !== incoming.conversationId) {
                        return conversation;
                    }

                    matched = true;
                    const isOwnMessage = currentUserId !== null && incoming.senderId === currentUserId;
                    const shouldIncreaseUnread = !isOwnMessage && (!isOpen || activeConversationId !== conversation.id);
                    const mergedMessages = mergeMessages(conversation.messages, incoming);
                    const partnerCandidate = conversation.partner ?? ((incoming.sender && incoming.sender.id !== currentUserId) ? incoming.sender : null);
                    const displayName = conversation.displayName === DEFAULT_CONVERSATION_NAME && partnerCandidate
                        ? formatParticipantName(partnerCandidate)
                        : conversation.displayName;
                    const partnerId = conversation.partnerId ?? (partnerCandidate ? partnerCandidate.id : null);
                    const partnerStatus = !isOwnMessage ? 'Đang trực tuyến' : conversation.partnerStatus;
                    const partnerLastActivityAt = !isOwnMessage ? incoming.createdAt : conversation.partnerLastActivityAt;

                    return {
                        ...conversation,
                        messages: mergedMessages,
                        lastMessagePreview: incoming.content,
                        lastMessageAt: incoming.createdAt,
                        updatedAt: incoming.createdAt,
                        unreadCount: shouldIncreaseUnread ? conversation.unreadCount + 1 : 0,
                        partner: partnerCandidate ?? conversation.partner,
                        partnerId,
                        displayName,
                        partnerStatus,
                        partnerLastActivityAt,
                    };
                });

                if (!matched) {
                    void fetchConversations(true);
                    return previous;
                }

                return sortConversations(updated);
            });
        },
        [activeConversationId, currentUserId, fetchConversations, isOpen],
    );

    useEffect(() => {
        if (!isOpen) {
            setIsCreateModalOpen(false);
            return;
        }

        if (!hasFetchedRef.current) {
            void fetchConversations();
        }
    }, [fetchConversations, isOpen]);

    useEffect(() => {
        if (!isOpen || conversations.length === 0) {
            return;
        }

        const echoClient = echo();
        const subscriptions = conversations.map((conversation) => {
            const channelName = `chat.${conversation.id}`;
            const channel = echoClient.private(channelName).listen('.message.created', handleIncomingMessage);

            return { channelName, channel };
        });

        return () => {
            subscriptions.forEach(({ channelName, channel }) => {
                channel.stopListening('.message.created');
                echoClient.leave(channelName);
            });
        };
    }, [conversations, handleIncomingMessage, isOpen]);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen || !activeConversationId) {
            return;
        }

        markConversationAsRead(activeConversationId);
    }, [activeConversationId, isOpen, markConversationAsRead]);

    const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            setIsOpen(false);
        }
    };

    const placeholder = activeConversation ? `Nhập tin nhắn cho ${activeConversation.displayName}...` : 'Chọn một cuộc trò chuyện để bắt đầu.';
    const emptyMessage = activeConversation ? 'Chưa có tin nhắn.' : 'Hãy chọn một cuộc trò chuyện trong danh sách.';
    const isInputDisabled = isSending || !activeConversation || isInitialLoading;

    return (
        <div className="chat-floating-wrapper">
            <button type="button" className="chat-floating-button" onClick={() => setIsOpen(true)}>
                <span className="chat-floating-icon" aria-hidden>
                    💬
                </span>
                <span className="chat-floating-label">Trò chuyện</span>
            </button>

            {isOpen && (
                <div className="chat-overlay" onClick={handleOverlayClick}>
                    <div className="chat-popup" role="dialog" aria-modal="true">
                        <div className="chat-popup-grid">
                            <ChatList
                                conversations={conversationItems}
                                activeConversationId={activeConversationId}
                                onSelect={handleSelectConversation}
                                isLoading={isLoading}
                                error={loadError}
                                onRefresh={() => fetchConversations(true)}
                                onCompose={handleComposeOpen}
                            />
                            <ChatWindow
                                conversationName={activeConversation ? activeConversation.displayName : 'Chưa có cuộc trò chuyện'}
                                messages={chatMessages}
                                draft={activeDraft}
                                onDraftChange={handleDraftChange}
                                onSend={handleSendMessage}
                                onClose={() => setIsOpen(false)}
                                isSending={isSending}
                                isLoading={isInitialLoading}
                                error={sendError}
                                placeholder={placeholder}
                                emptyMessage={emptyMessage}
                                isInputDisabled={isInputDisabled}
                                partnerStatus={activeConversation?.partnerStatus}
                                partnerLastActivityAt={activeConversation?.partnerLastActivityAt}
                            />
                        </div>
                    </div>
                </div>
            )}

            <CreateConversationModal
                isOpen={isCreateModalOpen}
                onClose={handleComposeClose}
                onConversationCreated={handleConversationCreated}
                currentUserId={currentUserId}
                csrfToken={csrfToken}
            />
        </div>
    );
};

export default ChatPopup;
