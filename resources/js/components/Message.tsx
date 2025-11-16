import React from 'react';
import { Icons } from './Icons';

interface MessageData {
    id: number;
    text: string;
    sender: 'user' | 'ai' | 'error';
    status?: 'sending' | 'sent' | 'delivered' | 'read';
    timestamp: string;
    provider?: string;
    role?: string;
}

interface MessageProps {
    message?: MessageData;
    isLoading?: boolean;
    isTyping?: boolean;
}

const getStatusIcon = (status: MessageData['status']) => {
    switch (status) {
        case 'sending':
            return (
                <span className="chat-message__status chat-message__status--sending">
                    <Icons.Loading className="chat-message__status-icon" />
                </span>
            );
        case 'sent':
            return (
                <span className="chat-message__status chat-message__status--sent">
                    <Icons.Check className="chat-message__status-icon" />
                </span>
            );
        case 'delivered':
            return (
                <span className="chat-message__status chat-message__status--delivered">
                    <Icons.Check className="chat-message__status-icon" />
                </span>
            );
        case 'read':
            return (
                <span className="chat-message__status chat-message__status--read">
                    <Icons.Check className="chat-message__status-icon" />
                </span>
            );
        default:
            return null;
    }
};

export default function Message({ message, isLoading = false, isTyping = false }: MessageProps) {
    if (isTyping) {
        return (
            <div className="chat-message chat-message--ai chat-message--typing">
                <div className="chat-message__avatar chat-message__avatar--ai">
                    <Icons.Robot />
                </div>
                <div className="chat-message__content">
                    <div className="chat-message__bubble chat-message__bubble--ai">
                        <div className="chat-message__typing-dots" aria-hidden="true">
                            <span className="chat-message__typing-dot"></span>
                            <span className="chat-message__typing-dot"></span>
                            <span className="chat-message__typing-dot"></span>
                        </div>
                        <span className="chat-message__typing-label">AI đang trả lời...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="chat-message chat-message--ai chat-message--loading">
                <div className="chat-message__avatar chat-message__avatar--ai">
                    <Icons.Robot />
                </div>
                <div className="chat-message__content">
                    <div className="chat-message__bubble chat-message__bubble--ai">
                        <span className="chat-message__loading-bar"></span>
                        <span className="chat-message__loading-bar"></span>
                        <span className="chat-message__loading-bar"></span>
                    </div>
                </div>
            </div>
        );
    }

    if (!message) return null;

    const isUser = message.sender === 'user';
    const isError = message.sender === 'error';

    const containerClassName = [
        'chat-message',
        isUser ? 'chat-message--user' : 'chat-message--ai',
        isError ? 'chat-message--error' : ''
    ].filter(Boolean).join(' ');

    const avatarClassName = [
        'chat-message__avatar',
        isUser ? 'chat-message__avatar--user' : 'chat-message__avatar--ai'
    ].join(' ');

    const bubbleClassName = [
        'chat-message__bubble',
        isUser ? 'chat-message__bubble--user' : isError ? 'chat-message__bubble--error' : 'chat-message__bubble--ai'
    ].join(' ');

    return (
        <div className={containerClassName}>
            {!isUser && (
                <div className={avatarClassName}>
                    <Icons.Robot />
                </div>
            )}

            <div className="chat-message__content">
                <div className={bubbleClassName}>
                    {message.text}
                    {!isUser && !isError && message.provider && (
                        <div className="chat-message__provider">
                            <span role="img" aria-hidden="true">🤖</span>
                            <span>{message.provider?.toUpperCase()}</span>
                            {message.role && <span>• {message.role}</span>}
                        </div>
                    )}
                </div>

                <div className="chat-message__meta">
                    <span>{message.timestamp}</span>
                    {isUser && message.status && getStatusIcon(message.status)}
                </div>
            </div>

            {isUser && (
                <div className={avatarClassName}>
                    <Icons.User />
                </div>
            )}
        </div>
    );
}
