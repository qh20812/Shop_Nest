import React from 'react';

interface ChatInputProps {
    value: string;
    onChange: (value: string) => void;
    onSend: () => void;
    isDisabled?: boolean;
    placeholder?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ value, onChange, onSend, isDisabled = false, placeholder = 'Nhập tin nhắn...' }) => {
    const trimmedValue = value.trim();
    const isSendDisabled = isDisabled || trimmedValue.length === 0;

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            if (!isSendDisabled) {
                onSend();
            }
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!isDisabled) {
            onChange(event.target.value);
        }
    };

    const handleClick = () => {
        if (!isSendDisabled) {
            onSend();
        }
    };

    return (
        <div className="chat-input">
            <input
                type="text"
                className="chat-input-field"
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                disabled={isDisabled}
                aria-disabled={isDisabled}
            />
            <button
                type="submit"
                className="chat-input-send"
                onClick={handleClick}
                disabled={isSendDisabled}
                aria-disabled={isSendDisabled}
            >
                Gửi
            </button>
        </div>
    );
};

export default ChatInput;
