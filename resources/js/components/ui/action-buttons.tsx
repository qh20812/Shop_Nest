import { Link } from '@inertiajs/react';
import React from 'react';
import { useTranslation } from '@/lib/i18n';

// Defines a single action button
interface ActionConfig {
  type: 'link' | 'button';
  label: string;
  href?: string; // Required if type is 'link'
  onClick?: () => void; // Required if type is 'button'
  icon: string; // e.g., 'bx bx-edit'
  variant: 'primary' | 'danger';
  disabled?: boolean;
}

// The component's props
interface ActionButtonsProps {
  actions: ActionConfig[];
}

export default function ActionButtons({ actions }: ActionButtonsProps) {
  const { t } = useTranslation();

  // Helper function to get variant styles - replicates exact styles from UserTable.tsx
  const getVariantStyles = (variant: 'primary' | 'danger', disabled?: boolean) => {
    const baseStyles = {
      padding: "4px 12px",
      borderRadius: "16px",
      fontSize: "12px",
      fontWeight: "500",
      display: "flex",
      alignItems: "center",
      gap: "4px",
      textDecoration: "none",
      border: "none",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.6 : 1,
    };

    if (variant === 'primary') {
      return {
        ...baseStyles,
        background: "var(--light-primary)",
        color: "var(--primary)",
      };
    } else if (variant === 'danger') {
      return {
        ...baseStyles,
        background: disabled ? "var(--grey)" : "var(--light-danger)",
        color: disabled ? "var(--dark-grey)" : "var(--danger)",
      };
    }

    return baseStyles;
  };

  return (
    <div style={{ display: "flex", gap: "8px"}}>
      {actions.map((action, index) => {
        const styles = getVariantStyles(action.variant, action.disabled);

        if (action.type === 'link') {
          return (
            <Link
              key={index}
              href={action.href!}
              style={styles}
            >
              <i className={action.icon} style={{ verticalAlign: 'middle' }}></i>
              {t(action.label)}
            </Link>
          );
        } else if (action.type === 'button') {
          return (
            <button
              key={index}
              onClick={action.onClick}
              disabled={action.disabled}
              style={styles}
            >
              <i className={action.icon} style={{ verticalAlign: 'middle' }}></i>
              {t(action.label)}
            </button>
          );
        }

        return null;
      })}
    </div>
  );
}

export type { ActionConfig };
