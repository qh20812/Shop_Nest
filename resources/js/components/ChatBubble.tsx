import React from 'react';
import { Icons } from './Icons';

interface ChatBubbleProps {
    onClick: () => void;
    isOpen: boolean;
}

export default function ChatBubble({ onClick, isOpen }: ChatBubbleProps) {
    return (
        <>
            {/* Bubble */}
            <div 
                className={`fixed bottom-6 right-6 z-50 transform transition-all duration-300 ease-in-out ${
                    isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100 hover:scale-110'
                }`}
            >
                <button
                    onClick={onClick}
                    className="relative group bg-[var(--primary)] text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[var(--light-primary)] will-change-transform"
                    aria-label="Chat với AI Robot"
                    role="button"
                >
                    {/* Robot Icon */}
                    <Icons.Robot className="w-7 h-7" />

                    {/* Notification dot */}
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-[var(--danger)] rounded-full animate-pulse"></div>
                </button>

                {/* Tooltip */}
                <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-[var(--dark)] text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    Chat với AI
                    <div className="absolute top-full right-4 border-4 border-transparent border-t-[var(--dark)]"></div>
                </div>
            </div>
        </>
    );
}