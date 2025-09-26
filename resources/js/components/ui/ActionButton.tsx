import React from 'react';

interface ActionButtonProps {
  variant: 'primary' | 'secondary' | 'danger';
  type?: 'button' | 'submit';
  onClick?: () => void;
  icon?: string;
  children: React.ReactNode;
  disabled?: boolean;
}

export default function ActionButton({
  variant,
  type = 'button',
  onClick,
  icon,
  children,
  disabled = false,
}: ActionButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {icon && <i className={`${icon}`}></i>}
      {children}
    </button>
  );
}
