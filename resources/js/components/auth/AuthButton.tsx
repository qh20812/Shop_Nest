import React from 'react';

interface AuthButtonProps {
  text: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  id?: string;
}

export default function AuthButton({ 
  text, 
  type = 'button', 
  onClick,
  className = '',
  disabled = false,
  ...props 
}: AuthButtonProps) {
  return (
    <button 
      type={type} 
      onClick={onClick} 
      className={className}
      disabled={disabled}
      {...props}
    >
      {text}
    </button>
  );
}
