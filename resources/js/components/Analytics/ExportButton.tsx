import React from 'react';
import '@/../css/Page.css';

export type ExportButtonVariant = 'primary' | 'secondary' | 'outline';

export interface ExportButtonProps {
  label: string;
  onClick: () => void;
  icon?: string;
  loading?: boolean;
  disabled?: boolean;
  variant?: ExportButtonVariant;
  className?: string;
}

const variantClassMap: Record<ExportButtonVariant, string> = {
  primary: 'analytics-export-button--primary',
  secondary: 'analytics-export-button--secondary',
  outline: 'analytics-export-button--outline',
};

const ExportButton: React.FC<ExportButtonProps> = ({
  label,
  onClick,
  icon = 'bx bx-download',
  loading = false,
  disabled = false,
  variant = 'primary',
  className = '',
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      type="button"
      className={`analytics-export-button ${variantClassMap[variant]} ${className}`.trim()}
      onClick={onClick}
      disabled={isDisabled}
    >
      <span className="analytics-export-button__content">
        {loading ? <i className="bx bx-loader-circle bx-spin"></i> : <i className={icon}></i>}
        <span>{label}</span>
      </span>
    </button>
  );
};

export default ExportButton;
