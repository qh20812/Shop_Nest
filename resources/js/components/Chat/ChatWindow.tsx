import React, { useCallback, useEffect, useRef, useState } from 'react';
import ChatInput from './ChatInput';

export interface ChatMessage {
    id: number;
    content: string;
    timestamp: string;
    sender: 'me' | 'other';
}

interface ChatWindowProps {
    conversationName?: string;
    messages?: ChatMessage[];
    draft: string;
    onDraftChange: (value: string) => void;
    onSend: () => void;
    onClose: () => void;
    isSending?: boolean;
    isLoading?: boolean;
    error?: string | null;
    placeholder?: string;
    emptyMessage?: string;
    isInputDisabled?: boolean;
    partnerStatus?: string | null;
    partnerLastActivityAt?: string | null;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
    conversationName,
    messages = [],
    draft,
    onDraftChange,
    onSend,
    onClose,
    isSending = false,
    isLoading = false,
    error = null,
    placeholder = 'Nhập tin nhắn...',
    emptyMessage = 'Chưa có tin nhắn.',
    isInputDisabled,
    partnerStatus,
    partnerLastActivityAt,
}) => {
    const displayName = conversationName?.trim() || 'Cuộc trò chuyện';
    const avatarLabel = displayName.charAt(0).toUpperCase();
    const bodyRef = useRef<HTMLDivElement | null>(null);
    const scrollAnchorRef = useRef<HTMLDivElement | null>(null);
    const inputDisabled = (isInputDisabled ?? false) || isSending || isLoading;
    const resolveStatusLabel = useCallback(() => {
        const fallback = partnerStatus && partnerStatus.trim().length > 0 ? partnerStatus.trim() : 'Ngoại tuyến';

        if (!partnerLastActivityAt) {
            return fallback;
        }

        const parsed = new Date(partnerLastActivityAt);

        if (Number.isNaN(parsed.getTime())) {
            return fallback;
        }

        const now = new Date();
        let diff = now.getTime() - parsed.getTime();

        if (diff < 0) {
            diff = 0;
        }

        const diffMinutes = Math.floor(diff / 60000);

        if (diffMinutes < 5) {
            return 'Đang trực tuyến';
        }

        if (diffMinutes < 60) {
            return `Trực tuyến ${diffMinutes} phút trước`;
        }

        const diffHours = Math.floor(diffMinutes / 60);

        if (diffHours < 24) {
            return `Trực tuyến ${diffHours} giờ trước`;
        }

        const diffDays = Math.floor(diffHours / 24);

        if (diffDays <= 1) {
            return 'Trực tuyến 1 ngày trước';
        }

        return `Trực tuyến ${diffDays} ngày trước`;
    }, [partnerLastActivityAt, partnerStatus]);
    const [statusLabel, setStatusLabel] = useState<string>(() => resolveStatusLabel());

    useEffect(() => {
        setStatusLabel(resolveStatusLabel());
        const timer = window.setInterval(() => {
            setStatusLabel(resolveStatusLabel());
        }, 60000);

        return () => window.clearInterval(timer);
    }, [partnerLastActivityAt, partnerStatus, resolveStatusLabel]);

    useEffect(() => {
        if (isLoading) {
            return;
        }

        const container = bodyRef.current;
        if (!container) {
            return;
        }

        const behavior: ScrollBehavior = messages.length > 0 ? 'smooth' : 'auto';
        const frame = requestAnimationFrame(() => {
            container.scrollTo({ top: container.scrollHeight, behavior });
            scrollAnchorRef.current?.scrollIntoView({ behavior, block: 'end' });
        });

        return () => cancelAnimationFrame(frame);
    }, [messages, isLoading]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSend();
    };

    const showEmptyState = !isLoading && !error && messages.length === 0;

    return (
        <section className="chat-window">
            <header className="chat-window-header">
                <div className="chat-window-heading">
                    <div className="chat-window-avatar" aria-hidden>
                        {avatarLabel}
                    </div>
                    <div className="chat-window-meta">
                        <h4 className="chat-window-title">{displayName}</h4>
                        <span className="chat-window-status">{statusLabel}</span>
                    </div>
                </div>
                <button type="button" className="chat-window-close" onClick={onClose} aria-label="Đóng cuộc trò chuyện">
                    ×
                </button>
            </header>

            <div className="chat-window-body" ref={bodyRef}>
                {isLoading && <div className="chat-window-status-banner">Đang tải tin nhắn...</div>}
                {error && !isLoading && <div className="chat-window-status-banner chat-window-status-banner--error">{error}</div>}
                {showEmptyState && <div className="chat-window-placeholder">{emptyMessage}</div>}
                {!isLoading && !error &&
                    messages.map((message) => (
                        <div key={message.id} className={`chat-message chat-message--${message.sender}`}>
                            <div className="chat-message-bubble">
                                <p className="chat-message-text">{message.content}</p>
                                <time className="chat-message-time">{message.timestamp}</time>
                            </div>
                        </div>
                    ))}
                <div ref={scrollAnchorRef} aria-hidden />
            </div>

            <footer className="chat-window-footer">
                <form className="chat-input-form" onSubmit={handleSubmit}>
                    <ChatInput
                        value={draft}
                        onChange={onDraftChange}
                        onSend={onSend}
                        isDisabled={inputDisabled}
                        placeholder={placeholder}
                    />
                </form>
                {isSending && <div className="chat-window-status-banner chat-window-status-banner--inline">Đang gửi...</div>}
            </footer>
        </section>
    );
};

export default ChatWindow;
