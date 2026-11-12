import React from 'react';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
}

export default function PrimaryButton({ className = '', disabled, children, ...props }: PrimaryButtonProps) {
    return (
        <button
            {...props}
            disabled={disabled}
            className={`inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-xs font-semibold tracking-widest text-white uppercase transition duration-150 ease-in-out hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none active:bg-indigo-900 ${
                disabled ? 'opacity-25' : ''
            } ${className}`}
        >
            {children}
        </button>
    );
}
