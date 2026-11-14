export type ChatParticipant = {
    id: number;
    username?: string | null;
    first_name?: string | null;
    last_name?: string | null;
    email?: string | null;
};

export type ChatMessageModel = {
    id: number;
    conversationId: number;
    senderId: number | null;
    content: string;
    createdAt: string;
    sender?: ChatParticipant | null;
};

export type ChatConversationModel = {
    id: number;
    partnerId: number | null;
    partnerName: string;
    partnerStatus: string;
    partnerLastActivityAt: string | null;
    lastMessagePreview: string;
    lastMessageAt: string | null;
    unreadCount: number;
    messages: ChatMessageModel[];
};
