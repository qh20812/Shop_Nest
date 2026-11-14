import { usePage } from '@inertiajs/react';
import { echo } from '@laravel/echo-react';
import axios from 'axios';
import * as React from 'react';

import type { ChatConversationModel, ChatMessageModel, ChatParticipant } from '@/components/chat/types';

type RawParticipant = ChatParticipant | null;

type RawMessage = {
    id: number;
    conversation_id: number;
    sender_id?: number | null;
    content?: string | null;
    created_at?: string | null;
    sender?: RawParticipant;
};

type RawConversation = {
    id: number;
    user_id?: number | null;
    receiver_id?: number | null;
    updated_at?: string | null;
    created_at?: string | null;
    user?: RawParticipant;
    receiver?: RawParticipant;
    messages?: RawMessage[] | null;
    unread_count?: number | null;
    partner_id?: number | null;
    partner_status?: string | null;
    partner_last_activity_at?: string | null;
};

type ChatUser = {
    id: number;
    username?: string | null;
    first_name?: string | null;
    last_name?: string | null;
    email?: string | null;
    name?: string;
};

type ChatPageProps = {
    auth?: {
        user?: {
            id: number;
        } | null;
    } | null;
};

const DEFAULT_CONVERSATION_NAME = 'Cuộc trò chuyện';

function toTime(iso?: string | null): number {
    if (!iso) {
        return 0;
    }

    const time = new Date(iso).getTime();
    return Number.isNaN(time) ? 0 : time;
}

export function formatChatTimestamp(iso?: string | null): string {
    if (!iso) {
        return '';
    }

    const date = new Date(iso);

    if (Number.isNaN(date.getTime())) {
        return '';
    }

    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}

export function formatConversationTimestamp(iso?: string | null): string {
    if (!iso) {
        return '';
    }

    const date = new Date(iso);

    if (Number.isNaN(date.getTime())) {
        return '';
    }

    const now = new Date();

    if (date.toDateString() === now.toDateString()) {
        return formatChatTimestamp(iso);
    }

    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
}

function participantName(participant?: RawParticipant): string {
    if (!participant) {
        return '';
    }

    const fullName = [participant.first_name, participant.last_name].filter(Boolean).join(' ').trim();

    return fullName || participant.username?.trim() || participant.email?.trim() || `Người dùng #${participant.id}`;
}

function resolvePartner(conversation: RawConversation, currentUserId: number | null): RawParticipant {
    const partnerId = conversation.partner_id ?? null;

    if (partnerId) {
        if (conversation.user?.id === partnerId) {
            return conversation.user;
        }

        if (conversation.receiver?.id === partnerId) {
            return conversation.receiver;
        }
    }

    if (currentUserId !== null) {
        if (conversation.user_id === currentUserId && conversation.receiver) {
            return conversation.receiver;
        }

        if (conversation.receiver_id === currentUserId && conversation.user) {
            return conversation.user;
        }

        if (conversation.user && conversation.user.id !== currentUserId) {
            return conversation.user;
        }

        if (conversation.receiver && conversation.receiver.id !== currentUserId) {
            return conversation.receiver;
        }
    }

    return conversation.receiver ?? conversation.user ?? null;
}

function normalizeMessage(message: RawMessage): ChatMessageModel {
    const createdAt = message.created_at ?? new Date().toISOString();

    return {
        id: message.id,
        conversationId: message.conversation_id,
        senderId: message.sender_id ?? message.sender?.id ?? null,
        content: message.content ?? '',
        createdAt,
        sender: message.sender ?? null,
    };
}

function sortMessages(messages: ChatMessageModel[]): ChatMessageModel[] {
    return [...messages].sort((a, b) => toTime(a.createdAt) - toTime(b.createdAt));
}

function normalizeConversation(conversation: RawConversation, currentUserId: number | null): ChatConversationModel {
    const messages = sortMessages((conversation.messages ?? []).map(normalizeMessage));
    const lastMessage = messages[messages.length - 1];
    const partner = resolvePartner(conversation, currentUserId);

    return {
        id: conversation.id,
        partnerId: conversation.partner_id ?? partner?.id ?? null,
        partnerName: participantName(partner) || DEFAULT_CONVERSATION_NAME,
        partnerStatus:
            typeof conversation.partner_status === 'string' && conversation.partner_status.trim() !== ''
                ? conversation.partner_status
                : 'Ngoại tuyến',
        partnerLastActivityAt: conversation.partner_last_activity_at ?? null,
        lastMessagePreview: lastMessage?.content ?? 'Chưa có tin nhắn.',
        lastMessageAt: lastMessage?.createdAt ?? conversation.updated_at ?? conversation.created_at ?? null,
        unreadCount: typeof conversation.unread_count === 'number' ? conversation.unread_count : 0,
        messages,
    };
}

function sortConversations(conversations: ChatConversationModel[]): ChatConversationModel[] {
    return [...conversations].sort((a, b) => toTime(b.lastMessageAt) - toTime(a.lastMessageAt));
}

function mergeMessage(messages: ChatMessageModel[], incoming: ChatMessageModel): ChatMessageModel[] {
    const hasMessage = messages.some((message) => message.id === incoming.id);

    if (hasMessage) {
        return sortMessages(messages.map((message) => (message.id === incoming.id ? incoming : message)));
    }

    return sortMessages([...messages, incoming]);
}

export function useChatConversations() {
    const page = usePage<ChatPageProps>();
    const currentUserId = page.props.auth?.user?.id ?? null;

    const [conversations, setConversations] = React.useState<ChatConversationModel[]>([]);
    const [activeId, setActiveId] = React.useState<number | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [refreshing, setRefreshing] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [sending, setSending] = React.useState(false);
    const [sendError, setSendError] = React.useState<string | null>(null);

    const activeIdRef = React.useRef<number | null>(null);
    const inFlightRef = React.useRef(false);

    React.useEffect(() => {
        activeIdRef.current = activeId;
    }, [activeId]);

    const selectConversation = React.useCallback((id: number) => {
        setActiveId(id);
        setSendError(null);
        setConversations((current) => current.map((conversation) => (conversation.id === id ? { ...conversation, unreadCount: 0 } : conversation)));
    }, []);

    const clearActive = React.useCallback(() => {
        setActiveId(null);
        setSendError(null);
    }, []);

    const fetchConversations = React.useCallback(
        async (force = false) => {
            if (inFlightRef.current) {
                return;
            }

            inFlightRef.current = true;

            if (force) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError(null);

            try {
                const response = await axios.get('/chat/conversations');
                const payload = response.data;
                const raw = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
                const normalized = sortConversations(raw.map((item: RawConversation) => normalizeConversation(item, currentUserId)));

                setConversations(normalized);
                setActiveId((current) => {
                    if (current && normalized.some((conversation) => conversation.id === current)) {
                        return current;
                    }

                    return null;
                });
            } catch (requestError) {
                setError(
                    axios.isAxiosError(requestError)
                        ? (requestError.response?.data?.message ?? 'Không thể tải danh sách cuộc trò chuyện.')
                        : 'Không thể tải danh sách cuộc trò chuyện.',
                );
            } finally {
                inFlightRef.current = false;
                setLoading(false);
                setRefreshing(false);
            }
        },
        [currentUserId],
    );

    React.useEffect(() => {
        void fetchConversations();
    }, [fetchConversations]);

    const sendMessage = React.useCallback(
        async (content: string, conversationId?: number | null) => {
            const targetId = conversationId ?? activeIdRef.current;
            const trimmed = content.trim();

            if (!targetId || trimmed === '' || sending) {
                return false;
            }

            setSending(true);
            setSendError(null);

            try {
                const response = await axios.post('/chat/messages', {
                    conversation_id: targetId,
                    content: trimmed,
                });

                const raw = response.data?.data ?? response.data;
                const saved = normalizeMessage(raw);

                setConversations((current) =>
                    sortConversations(
                        current.map((conversation) =>
                            conversation.id === targetId
                                ? {
                                      ...conversation,
                                      messages: mergeMessage(conversation.messages, saved),
                                      lastMessagePreview: saved.content,
                                      lastMessageAt: saved.createdAt,
                                      unreadCount: 0,
                                  }
                                : conversation,
                        ),
                    ),
                );

                return true;
            } catch (requestError) {
                setSendError(
                    axios.isAxiosError(requestError)
                        ? (requestError.response?.data?.message ?? 'Không thể gửi tin nhắn.')
                        : 'Không thể gửi tin nhắn.',
                );
                return false;
            } finally {
                setSending(false);
            }
        },
        [sending],
    );

    const searchUsers = React.useCallback(async (term: string): Promise<ChatUser[]> => {
        const query = term.trim();

        if (query === '') {
            return [];
        }

        const response = await axios.get('/chat/users/search', { params: { q: query } });
        return Array.isArray(response.data?.data) ? response.data.data : [];
    }, []);

    const createConversation = React.useCallback(
        async (receiverId: number, content: string) => {
            setSending(true);
            setSendError(null);

            try {
                const response = await axios.post('/chat/conversations', {
                    receiver_id: receiverId,
                    content: content.trim(),
                });

                const conversationPayload = response.data?.conversation?.data ?? response.data?.conversation;
                const messagePayload = response.data?.message?.data ?? response.data?.message;

                if (!conversationPayload) {
                    await fetchConversations(true);
                    return null;
                }

                const normalized = normalizeConversation(conversationPayload as RawConversation, currentUserId);
                const savedMessage = messagePayload ? normalizeMessage(messagePayload as RawMessage) : null;
                const nextConversation: ChatConversationModel = savedMessage
                    ? {
                          ...normalized,
                          messages: mergeMessage(normalized.messages, savedMessage),
                          lastMessagePreview: savedMessage.content,
                          lastMessageAt: savedMessage.createdAt,
                          unreadCount: 0,
                      }
                    : normalized;

                setConversations((current) => sortConversations([nextConversation, ...current.filter((item) => item.id !== nextConversation.id)]));
                setActiveId(nextConversation.id);

                return nextConversation.id;
            } catch (requestError) {
                setSendError(
                    axios.isAxiosError(requestError)
                        ? (requestError.response?.data?.message ?? 'Không thể tạo cuộc trò chuyện.')
                        : 'Không thể tạo cuộc trò chuyện.',
                );
                return null;
            } finally {
                setSending(false);
            }
        },
        [currentUserId, fetchConversations],
    );

    const handleIncoming = React.useCallback(
        (payload: RawMessage) => {
            const incoming = normalizeMessage(payload);
            const isOwn = currentUserId !== null && incoming.senderId === currentUserId;
            const isActive = activeIdRef.current === incoming.conversationId;

            setConversations((current) => {
                let matched = false;

                const updated = current.map((conversation) => {
                    if (conversation.id !== incoming.conversationId) {
                        return conversation;
                    }

                    matched = true;

                    return {
                        ...conversation,
                        messages: mergeMessage(conversation.messages, incoming),
                        lastMessagePreview: incoming.content,
                        lastMessageAt: incoming.createdAt,
                        unreadCount: isOwn || isActive ? 0 : conversation.unreadCount + 1,
                    };
                });

                if (!matched) {
                    void fetchConversations(true);
                    return current;
                }

                return sortConversations(updated);
            });
        },
        [currentUserId, fetchConversations],
    );

    const conversationIds = conversations.map((conversation) => conversation.id).join(',');

    React.useEffect(() => {
        if (conversationIds === '') {
            return;
        }

        let client: ReturnType<typeof echo>;

        try {
            client = echo();
        } catch {
            return;
        }

        const subscriptions = conversationIds
            .split(',')
            .map((id) => {
                const conversationId = Number(id);

                if (!Number.isFinite(conversationId)) {
                    return null;
                }

                const channelName = `chat.${conversationId}`;

                try {
                    const channel = client.private(channelName).listen('.message.created', handleIncoming);
                    return { channelName, channel } as { channelName: string; channel: { stopListening: (event: string) => void } };
                } catch {
                    return null;
                }
            })
            .filter(
                (subscription): subscription is { channelName: string; channel: { stopListening: (event: string) => void } } => subscription !== null,
            );

        return () => {
            subscriptions.forEach(({ channelName, channel }) => {
                try {
                    channel.stopListening('.message.created');
                    client.leave(channelName);
                } catch {
                    // Reverb may be offline; cleanup failures are non-fatal.
                }
            });
        };
    }, [conversationIds, handleIncoming]);

    const activeConversation = React.useMemo(
        () => conversations.find((conversation) => conversation.id === activeId) ?? null,
        [conversations, activeId],
    );

    return {
        currentUserId,
        conversations,
        activeConversation,
        activeId,
        selectConversation,
        clearActive,
        loading,
        refreshing,
        error,
        refresh: () => fetchConversations(true),
        sendMessage,
        sending,
        sendError,
        clearSendError: () => setSendError(null),
        searchUsers,
        createConversation,
    };
}

export type { ChatUser };
