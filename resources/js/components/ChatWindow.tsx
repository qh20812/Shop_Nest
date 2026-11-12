import React, { useEffect, useRef } from 'react';
import { Icons } from './Icons';
import Message from './Message';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'ai' | 'error';
    status?: 'sending' | 'sent' | 'delivered' | 'read';
    timestamp: string;
    provider?: string;
    role?: string;
}

type SupportedRole = 'admin' | 'seller' | 'shipper' | 'customer';

interface ChatWindowProps {
    messages: Message[];
    isTyping: boolean;
    input: string;
    userRole: SupportedRole;
    soundEnabled: boolean;
    onClose: () => void;
    onSendMessage: (message?: string | null) => void;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onSoundToggle: () => void;
}

export default function ChatWindow({
    messages,
    isTyping,
    input,
    userRole,
    soundEnabled,
    onClose,
    onSendMessage,
    onInputChange,
    onKeyPress,
    onSoundToggle,
}: ChatWindowProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatWindowRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    // Focus trapping
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Tab') {
                const focusableElements = chatWindowRef.current?.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
                );
                if (!focusableElements || focusableElements.length === 0) return;

                const firstElement = focusableElements[0] as HTMLElement;
                const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            }
        };

        if (chatWindowRef.current) {
            document.addEventListener('keydown', handleKeyDown);
            // Focus input when chat opens
            setTimeout(() => inputRef.current?.focus(), 100);
        }

        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Get role-based quick questions
    const getQuickQuestions = (): string[] => {
        const questions: Record<SupportedRole, string[]> = {
            admin: ['Doanh thu tháng này?', 'Báo cáo tồn kho thấp', 'Thống kê đơn hàng', 'Phân tích khách hàng'],
            customer: ['Gợi ý sản phẩm cho tôi', 'Xem đơn hàng gần đây', 'Tình trạng giỏ hàng', 'Sản phẩm được yêu thích'],
            seller: ['Quản lý sản phẩm', 'Báo cáo bán hàng', 'Tình trạng kho hàng', 'Đánh giá từ khách hàng'],
            shipper: ['Đơn hàng cần giao', 'Tuyến đường tối ưu', 'Trạng thái giao hàng', 'Lịch giao hàng hôm nay'],
        };

        return questions[userRole] || questions.customer;
    };

    const handleQuestionClick = (question: string) => {
        onSendMessage(question);
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <>
            <div className="chatbot__overlay" onClick={handleBackdropClick} aria-hidden="true"></div>

            <div ref={chatWindowRef} className="chatbot__window" role="dialog" aria-modal="true" aria-labelledby="chat-title">
                <div className="chatbot__header">
                    <div className="chatbot__header-info">
                        <div className="chatbot__header-avatar">
                            <Icons.Robot className="chatbot__header-avatar-icon" />
                        </div>
                        <div>
                            <h3 id="chat-title" className="chatbot__header-title">
                                AI Assistant
                            </h3>
                            <div className="chatbot__header-status">
                                <span className="chatbot__status-indicator" aria-hidden="true"></span>
                                <span>Đang hoạt động</span>
                            </div>
                        </div>
                    </div>

                    <div className="chatbot__header-actions">
                        <button
                            type="button"
                            onClick={onSoundToggle}
                            className="chatbot__icon-button"
                            aria-label={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
                        >
                            {soundEnabled ? <Icons.VolumeOn /> : <Icons.VolumeOff />}
                        </button>

                        <button type="button" onClick={onClose} className="chatbot__icon-button" aria-label="Đóng chat">
                            <Icons.Close />
                        </button>
                    </div>
                </div>

                <div className="chatbot__messages">
                    {messages.length === 0 && (
                        <div className="chatbot__empty-state">
                            <div className="chatbot__empty-illustration">
                                <Icons.Robot className="chatbot-icon chatbot-icon--lg" />
                            </div>
                            <h3 className="chatbot__empty-title">Chào mừng đến với AI Assistant! 🤖</h3>
                            <p className="chatbot__empty-subtext">
                                Tôi là trợ lý AI thông minh, sẵn sàng giúp bạn với mọi câu hỏi về sản phẩm, đơn hàng, và nhiều hơn nữa.
                            </p>
                            <div className="chatbot__empty-hints">
                                <span className="chatbot__empty-hint">
                                    <Icons.CheckCircle className="chatbot-icon chatbot-icon--sm" />
                                    <span>Trả lời tức thì</span>
                                </span>
                                <span className="chatbot__empty-hint">
                                    <Icons.Zap className="chatbot-icon chatbot-icon--sm" />
                                    <span>Thông minh & nhanh chóng</span>
                                </span>
                            </div>
                            <p className="chatbot__empty-footnote">Chọn câu hỏi gợi ý bên dưới hoặc nhập tin nhắn của bạn</p>
                        </div>
                    )}

                    {messages.map((message: Message) => (
                        <Message key={message.id} message={message} />
                    ))}

                    {isTyping && <Message isTyping={true} />}

                    <div ref={messagesEndRef} />
                </div>

                <div className="chatbot__quick-questions">
                    <p className="chatbot__section-title">Câu hỏi gợi ý:</p>
                    <div className="chatbot__quick-questions-list">
                        {getQuickQuestions().map((question: string, index: number) => (
                            <button
                                type="button"
                                key={index}
                                onClick={() => handleQuestionClick(question)}
                                className="chatbot__quick-question"
                                disabled={isTyping}
                            >
                                {question}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="chatbot__input-area">
                    <div className="chatbot__input-row">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={onInputChange}
                            onKeyPress={onKeyPress}
                            placeholder="Nhập tin nhắn..."
                            maxLength={500}
                            className="chatbot__input"
                        />
                        <button
                            type="button"
                            onClick={() => onSendMessage()}
                            className="chatbot__send-button"
                            disabled={isTyping || !input.trim()}
                            aria-label="Gửi tin nhắn"
                        >
                            <Icons.Send />
                        </button>
                    </div>
                    <div className="chatbot__char-count">{input.length}/500 ký tự</div>
                </div>
            </div>
        </>
    );
}
