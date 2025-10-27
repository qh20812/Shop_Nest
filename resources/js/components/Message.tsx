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

export default function Message({ message, isLoading = false, isTyping = false }: MessageProps) {
    if (isTyping) {
        return (
        <div className={`flex items-start mb-4 animate-fadeIn will-change-transform`}>
            <div className="flex-shrink-0 w-10 h-10 bg-[var(--light-primary)] rounded-full flex items-center justify-center mr-3 shadow-sm">
                    <svg className="w-5 h-5 text-[var(--primary)]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C11.4477 2 11 2.44772 11 3V4H8C6.89543 4 6 4.89543 6 6V7H4C3.44772 7 3 7.44772 3 8C3 8.55228 3.44772 9 4 9H6V19C6 20.1046 6.89543 21 8 21H16C17.1046 21 18 20.1046 18 19V9H20C20.5523 9 21 8.55228 21 8C21 7.44772 20.5523 7 20 7H18V6C18 4.89543 17.1046 4 16 4H13V3C13 2.44772 12.5523 2 12 2Z" />
                    </svg>
                </div>
                <div className="flex-1 bg-white rounded-2xl px-4 py-3 max-w-xs shadow-sm border border-[var(--grey)]">
                    <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-[var(--primary)] rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-[var(--primary)] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-[var(--primary)] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                        <span className="text-sm text-[var(--dark-grey)] font-medium">AI đang trả lời...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex items-start mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-[var(--light-primary)] rounded-full flex items-center justify-center mr-3 shadow-sm">
                    <svg className="w-5 h-5 text-[var(--primary)]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className="flex-1 bg-white rounded-2xl px-4 py-3 max-w-xs shadow-sm border border-[var(--grey)]">
                    <div className="flex space-x-1.5">
                        <div className="w-2.5 h-2.5 bg-[var(--primary)] rounded-full animate-pulse"></div>
                        <div className="w-2.5 h-2.5 bg-[var(--primary)] rounded-full animate-pulse delay-75"></div>
                        <div className="w-2.5 h-2.5 bg-[var(--primary)] rounded-full animate-pulse delay-150"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!message) return null;

    const isUser = message.sender === 'user';
    const isError = message.sender === 'error';
    
    const getStatusIcon = (status: 'sending' | 'sent' | 'delivered' | 'read') => {
        switch (status) {
            case 'sending':
                return <Icons.Loading className="w-3 h-3 text-[var(--dark-grey)] animate-spin" />;
            case 'sent':
                return <Icons.Check className="w-3 h-3 text-[var(--dark-grey)]" />;
            case 'delivered':
                return <Icons.Check className="w-3 h-3 text-[var(--primary)]" />;
            case 'read':
                return <Icons.Check className="w-3 h-3 text-[var(--success)]" />;
            default:
                return null;
        }
    };
    
    return (
        <div className={`flex items-start mb-5 ${isUser ? 'justify-end' : 'justify-start'} animate-fadeIn will-change-transform`}>
            {/* AI Avatar */}
            {!isUser && (
                <div className="flex-shrink-0 w-10 h-10 bg-[var(--light-primary)] rounded-full flex items-center justify-center mr-3 shadow-sm">
                    <Icons.Robot />
                </div>
            )}

            {/* Message Content */}
            <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-sm lg:max-w-md`}>
                <div className={`px-4 py-3 rounded-2xl shadow-md ${
                    isUser 
                        ? 'bg-[var(--primary)] text-white' 
                        : isError 
                            ? 'bg-[var(--light-danger)] text-[var(--danger)] border-2 border-[var(--danger)]'
                            : 'bg-white text-[var(--dark)] border border-[var(--grey)]'
                } break-words`}>
                    <p className="text-base leading-relaxed whitespace-pre-wrap">{message.text}</p>
                    
                    {/* AI Provider Info */}
                    {!isUser && !isError && message.provider && (
                        <div className="mt-2 pt-2 border-t border-[var(--grey)] text-xs opacity-70 font-medium">
                            🤖 {message.provider.toUpperCase()} • {message.role}
                        </div>
                    )}
                </div>
                
                {/* Timestamp */}
                <div className={`flex items-center text-xs text-[var(--dark-grey)] mt-1.5 ${isUser ? 'mr-2' : 'ml-2'}`}>
                    <span>{message.timestamp}</span>
                    {isUser && message.status && (
                        <div className="ml-1.5">
                            {getStatusIcon(message.status)}
                        </div>
                    )}
                </div>
            </div>

            {/* User Avatar */}
            {isUser && (
                <div className="flex-shrink-0 w-10 h-10 bg-[var(--primary)] rounded-full flex items-center justify-center ml-3 shadow-sm">
                    <Icons.User />
                </div>
            )}
        </div>
    );
}