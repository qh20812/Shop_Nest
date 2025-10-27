import React, { useRef, useEffect } from 'react';
import Message from './Message';
import { Icons } from './Icons';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'ai' | 'error';
    status?: 'sending' | 'sent' | 'delivered' | 'read';
    timestamp: string;
    provider?: string;
    role?: string;
}

interface User {
    roles?: Array<{
        name?: {
            en?: string;
        };
    }>;
}

interface ChatWindowProps {
    messages: Message[];
    isTyping: boolean;
    input: string;
    user?: User;
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
    user, 
    soundEnabled,
    onClose, 
    onSendMessage, 
    onInputChange, 
    onKeyPress,
    onSoundToggle
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
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
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
        const userRole = user?.roles?.[0]?.name?.en?.toLowerCase() || 'customer';
        
        const questions: Record<string, string[]> = {
            admin: [
                'Doanh thu tháng này?',
                'Báo cáo tồn kho thấp',
                'Thống kê đơn hàng',
                'Phân tích khách hàng'
            ],
            customer: [
                'Gợi ý sản phẩm cho tôi',
                'Xem đơn hàng gần đây',
                'Tình trạng giỏ hàng',
                'Sản phẩm được yêu thích'
            ],
            seller: [
                'Quản lý sản phẩm',
                'Báo cáo bán hàng',
                'Tình trạng kho hàng',
                'Đánh giá từ khách hàng'
            ],
            shipper: [
                'Đơn hàng cần giao',
                'Tuyến đường tối ưu',
                'Trạng thái giao hàng',
                'Lịch giao hàng hôm nay'
            ]
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
            {/* Backdrop - Semi-transparent overlay */}
            <div 
                className="fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 backdrop-blur-sm"
                onClick={handleBackdropClick}
                aria-hidden="true"
            ></div>

            {/* Chat Window */}
            <div 
                ref={chatWindowRef}
                className="fixed bottom-6 right-6 w-full max-w-md md:w-[450px] h-[600px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col transform transition-all duration-300 animate-slideUp overflow-hidden will-change-transform"
                role="dialog"
                aria-modal="true"
                aria-labelledby="chat-title"
            >
                
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--grey)] bg-gradient-to-r from-[var(--primary)] to-[var(--light-primary)]">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                            <Icons.Robot className="w-6 h-6 text-[var(--primary)]" />
                        </div>
                        <div>
                            <h3 id="chat-title" className="font-semibold text-lg text-white">AI Assistant</h3>
                            <div className="flex items-center text-xs text-white/90">
                                <div className="w-2 h-2 bg-[var(--success)] rounded-full mr-1.5 animate-pulse"></div>
                                Đang hoạt động
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={onSoundToggle}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                            aria-label={soundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}
                        >
                            {soundEnabled ? (
                                <Icons.VolumeOn className="w-5 h-5 text-white" />
                            ) : (
                                <Icons.VolumeOff className="w-5 h-5 text-white" />
                            )}
                        </button>

                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                            aria-label="Đóng chat"
                        >
                            <Icons.Close className="w-6 h-6 text-white" />
                        </button>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 px-6 py-5 overflow-y-auto bg-[var(--light)]">
                    {messages.length === 0 && (
                        <div className="text-center text-[var(--dark-grey)] py-12 px-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-[var(--primary)] to-[var(--light-primary)] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                <Icons.Robot className="w-10 h-10 text-white" />
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-xl font-bold text-[var(--dark)]">Chào mừng đến với AI Assistant! 🤖</h3>
                                <p className="text-base leading-relaxed max-w-sm mx-auto">
                                    Tôi là trợ lý AI thông minh, sẵn sàng giúp bạn với mọi câu hỏi về sản phẩm, đơn hàng, và nhiều hơn nữa.
                                </p>
                                <div className="flex justify-center space-x-4 mt-6">
                                    <div className="flex items-center space-x-2 text-sm text-[var(--primary)] bg-[var(--light-primary)] px-3 py-2 rounded-full">
                                        <Icons.CheckCircle />
                                        <span>Trả lời tức thì</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-sm text-[var(--primary)] bg-[var(--light-primary)] px-3 py-2 rounded-full">
                                        <Icons.Zap />
                                        <span>Thông minh & nhanh chóng</span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-xs mt-6 text-[var(--dark-grey)]">Chọn câu hỏi gợi ý bên dưới hoặc nhập tin nhắn của bạn</p>
                        </div>
                    )}
                    
                    {messages.map((message: Message) => (
                        <Message key={message.id} message={message} />
                    ))}
                    
                    {isTyping && <Message isTyping={true} />}
                    
                    <div ref={messagesEndRef} />
                </div>

                {/* Quick Questions */}
                <div className="px-6 py-4 border-t border-[var(--grey)] bg-white">
                    <p className="text-xs font-medium text-[var(--dark-grey)] mb-3">Câu hỏi gợi ý:</p>
                    <div className="flex flex-wrap gap-2">
                        {getQuickQuestions().map((question: string, index: number) => (
                            <button
                                key={index}
                                onClick={() => handleQuestionClick(question)}
                                className="px-4 py-2 text-sm bg-[var(--light-primary)] text-[var(--primary)] rounded-full hover:bg-[var(--primary)] hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
                            >
                                {question}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Input Area */}
                <div className="px-6 py-5 border-t border-[var(--grey)] bg-white">
                    <div className="flex space-x-3">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={onInputChange}
                            onKeyPress={onKeyPress}
                            placeholder="Nhập tin nhắn..."
                            maxLength={500}
                            className="flex-1 px-4 py-3 border-2 border-[var(--grey)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed text-base"
                        />
                        <button
                            onClick={() => onSendMessage()}
                            disabled={!input.trim()}
                            className="px-5 py-3 bg-[var(--primary)] text-white rounded-xl hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 shadow-lg"
                        >
                            <Icons.Send />
                        </button>
                    </div>
                    
                    {/* Character Count */}
                    <div className="text-xs text-[var(--dark-grey)] mt-2 text-right">
                        {input.length}/500 ký tự
                    </div>
                </div>
            </div>
        </>
    );
}