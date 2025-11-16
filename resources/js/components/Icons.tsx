import React from 'react';

interface IconProps {
    className?: string;
}

export const Icons = {
    Robot: ({ className = "chatbot-icon" }: IconProps) => (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C11.4477 2 11 2.44772 11 3V4H8C6.89543 4 6 4.89543 6 6V7H4C3.44772 7 3 7.44772 3 8C3 8.55228 3.44772 9 4 9H6V19C6 20.1046 6.89543 21 8 21H16C17.1046 21 18 20.1046 18 19V9H20C20.5523 9 21 8.55228 21 8C21 7.44772 20.5523 7 20 7H18V6C18 4.89543 17.1046 4 16 4H13V3C13 2.44772 12.5523 2 12 2ZM9 11C9 10.4477 9.44772 10 10 10C10.5523 10 11 10.4477 11 11V13C11 13.5523 10.5523 14 10 14C9.44772 14 9 13.5523 9 13V11ZM14 10C13.4477 10 13 10.4477 13 11V13C13 13.5523 13.4477 14 14 14C14.5523 14 15 13.5523 15 13V11C15 10.4477 14.5523 10 14 10ZM9 16C9 15.4477 9.44772 15 10 15H14C14.5523 15 15 15.4477 15 16C15 16.5523 14.5523 17 14 17H10C9.44772 17 9 16.5523 9 16Z" />
        </svg>
    ),

    User: ({ className = "chatbot-icon" }: IconProps) => (
        <svg className={className} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
    ),

    Send: ({ className = "chatbot-icon" }: IconProps) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
    ),

    Close: ({ className = "chatbot-icon chatbot-icon--lg" }: IconProps) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
    ),

    Check: ({ className = "chatbot-icon chatbot-icon--sm" }: IconProps) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
    ),

    Loading: ({ className = "chatbot-icon" }: IconProps) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
    ),

    VolumeOn: ({ className = "chatbot-icon" }: IconProps) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-2.828a9 9 0 010-12.728m-9.9 5.14L9 9H6a1 1 0 00-1 1v4a1 1 0 001 1h3l3.9 3.9a1 1 0 001.414-1.414L12.05 12.05z" />
        </svg>
    ),

    VolumeOff: ({ className = "chatbot-icon" }: IconProps) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
        </svg>
    ),

    CheckCircle: ({ className = "chatbot-icon" }: IconProps) => (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),

    Zap: ({ className = "chatbot-icon" }: IconProps) => (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
    )
};

export default Icons;
