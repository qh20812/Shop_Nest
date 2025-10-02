import React from 'react';

interface ActionButtonProps {
  variant: 'primary' | 'secondary' | 'danger';
  type?: 'button' | 'submit';
  onClick?: () => void;
  icon?: string;
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  form?: string;
}

export default function ActionButton({
  variant,
  type = 'button',
  onClick,
  icon,
  children,
  disabled = false,
  loading = false,
  form,
}: ActionButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`btn btn-${variant}`}
      form={form}
    >
      {loading && <i className="bx bx-loader-alt bx-spin" style={{ marginRight: '8px' }}></i>}
      {!loading && icon && <i className={`${icon}`}></i>}
      {children}
    </button>
  );
}
