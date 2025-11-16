import React from 'react';
import { Icons } from './Icons';

interface ChatBubbleProps {
    onClick: () => void;
    isOpen: boolean;
}

export default function ChatBubble({ onClick, isOpen }: ChatBubbleProps) {
    const containerClassName = [
        'chatbot__bubble-container',
        isOpen ? 'chatbot__bubble-container--hidden' : ''
    ].filter(Boolean).join(' ');

    return (
        <div className={containerClassName}>
            <button
                type="button"
                onClick={onClick}
                className="chatbot__bubble-button"
                aria-label="Chat với AI Robot"
            >
                <Icons.Robot className="chatbot__bubble-icon" />
                <span className="chatbot__bubble-indicator" aria-hidden="true"></span>
                <span className="chatbot__bubble-tooltip" role="tooltip">Chat với AI</span>
            </button>
        </div>
    );
}
