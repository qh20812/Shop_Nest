import React, { useState, useEffect, useRef } from 'react';
import ChatBubble from './ChatBubble';
import ChatWindow from './ChatWindow';
import '../../css/chatbot.css';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'ai' | 'error';
    status?: 'sending' | 'sent' | 'delivered' | 'read';
    timestamp: string;
    provider?: string;
    role?: string;
}

interface ChatbotProps {
    user?: {
        roles?: Array<{
            name?: {
                en?: string;
            };
        }>;
    };
}

interface ChatState {
    isOpen: boolean;
    messages: Message[];
    soundEnabled: boolean;
}

declare global {
    interface Window {
        webkitAudioContext: typeof AudioContext;
    }
}

export default function Chatbot({ user }: ChatbotProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [input, setInput] = useState('');
    const [soundEnabled, setSoundEnabled] = useState(true);
    
    // Sound effects
    const sentSoundRef = useRef<(() => void) | null>(null);
    const receivedSoundRef = useRef<(() => void) | null>(null);

    // Initialize sound effects
    useEffect(() => {
        // Create audio contexts for notification sounds
        const createNotificationSound = (frequency: number, duration: number, type: OscillatorType = 'sine') => {
            try {
                const AudioContextClass = window.AudioContext || window.webkitAudioContext;
                const audioContext = new AudioContextClass();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
                oscillator.type = type;
                
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + duration);
            } catch (error) {
                console.warn('Web Audio API not supported:', error);
            }
        };

        sentSoundRef.current = () => createNotificationSound(800, 0.1, 'sine');
        receivedSoundRef.current = () => createNotificationSound(600, 0.15, 'sine');
    }, []);
    
    // Load chat state from localStorage
    useEffect(() => {
        const savedState = localStorage.getItem('chatbot-state');
        if (savedState) {
            const { isOpen: savedOpen, messages: savedMessages, soundEnabled: savedSoundEnabled }: ChatState = JSON.parse(savedState);
            setIsOpen(savedOpen || false);
            setMessages(savedMessages || []);
            setSoundEnabled(savedSoundEnabled !== undefined ? savedSoundEnabled : true);
        }
    }, []);

    // Save chat state to localStorage
    useEffect(() => {
        localStorage.setItem('chatbot-state', JSON.stringify({
            isOpen,
            messages,
            soundEnabled
        }));
    }, [isOpen, messages, soundEnabled]);

    // Handle ESC key to close chat
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                closeChat();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const closeChat = () => {
        setIsOpen(false);
    };

    const sendMessage = async (messageText: string | null = null) => {
        const textToSend = messageText || input.trim();
        if (!textToSend || textToSend.length > 500) return;

        const userMessage: Message = {
            id: Date.now(),
            text: textToSend,
            sender: 'user',
            status: 'sent',
            timestamp: new Date().toLocaleTimeString('vi-VN', { 
                hour: '2-digit', 
                minute: '2-digit' 
            })
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        // Play sent sound
        if (sentSoundRef.current && soundEnabled) {
            sentSoundRef.current();
        }

        try {
            const response = await fetch('/chatbot/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    'Accept': 'application/json'
                },
                credentials: 'same-origin',
                body: JSON.stringify({ message: textToSend })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'API call failed');
            }

            const aiMessage: Message = {
                id: Date.now() + 1,
                text: data.data.reply,
                sender: 'ai',
                provider: data.data.provider,
                role: data.data.role,
                timestamp: new Date().toLocaleTimeString('vi-VN', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                })
            };

            setMessages(prev => prev.map(msg => 
                msg.id === userMessage.id ? {...msg, status: 'delivered'} : msg
            ));
            setMessages(prev => [...prev, aiMessage]);

            // Play received sound
            if (receivedSoundRef.current && soundEnabled) {
                receivedSoundRef.current();
            }
        } catch (error) {
            console.error('Chatbot API Error:', error);
            const errorMessage: Message = {
                id: Date.now() + 1,
                text: `Lỗi: ${error instanceof Error ? error.message : 'Không thể kết nối AI'}`,
                sender: 'error',
                timestamp: new Date().toLocaleTimeString('vi-VN', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                })
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="chatbot">
            <ChatBubble 
                onClick={toggleChat} 
                isOpen={isOpen}
            />
            
            {isOpen && (
                <ChatWindow
                    messages={messages}
                    isTyping={isTyping}
                    input={input}
                    user={user}
                    soundEnabled={soundEnabled}
                    onClose={closeChat}
                    onSendMessage={sendMessage}
                    onInputChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    onSoundToggle={() => setSoundEnabled(!soundEnabled)}
                />
            )}
        </div>
    );
}