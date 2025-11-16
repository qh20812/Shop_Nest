import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';

interface ActionItem {
  label: string;
  icon: string;
  onClick: () => void;
  color?: 'primary' | 'success' | 'warning' | 'danger';
  disabled?: boolean;
}

interface ActionDropdownProps {
  actions: ActionItem[];
  trigger?: React.ReactNode;
}

export default function ActionDropdown({ actions, trigger }: ActionDropdownProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [dropUpward, setDropUpward] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const getActionColor = (color?: string) => {
    switch (color) {
      case 'success':
        return 'var(--success)';
      case 'warning':
        return 'var(--warning)';
      case 'danger':
        return 'var(--danger)';
      case 'primary':
      default:
        return 'var(--primary)';
    }
  };

  // Calculate dropdown position
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - triggerRect.bottom;
      const spaceAbove = triggerRect.top;
      
      // If not enough space below (less than 200px) but more space above, drop upward
      setDropUpward(spaceBelow < 200 && spaceAbove > spaceBelow);
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleActionClick = (action: ActionItem) => {
    if (!action.disabled) {
      action.onClick();
      setIsOpen(false);
    }
  };

  return (
    <div 
      ref={dropdownRef}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: '8px',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--dark-grey)',
          fontSize: '18px',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--grey)';
          e.currentTarget.style.color = 'var(--dark)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = 'var(--dark-grey)';
        }}
      >
        {trigger || <i className="bx bx-dots-horizontal-rounded"></i>}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={dropdownRef}
          style={{
            position: 'absolute',
            top: dropUpward ? 'auto' : '100%',
            bottom: dropUpward ? '100%' : 'auto',
            right: '0',
            background: 'var(--light)',
            border: '1px solid var(--grey)',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            minWidth: '160px',
            zIndex: 9999,
            padding: '8px 0',
            animation: dropUpward ? 'slideInUp 0.2s ease-out' : 'slideInDown 0.2s ease-out'
          }}
        >
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleActionClick(action)}
              disabled={action.disabled}
              style={{
                width: '100%',
                padding: '10px 16px',
                border: 'none',
                background: 'transparent',
                color: action.disabled ? 'var(--dark-grey)' : getActionColor(action.color),
                cursor: action.disabled ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                textAlign: 'left',
                transition: 'background 0.2s ease',
                opacity: action.disabled ? 0.5 : 1
              }}
              onMouseEnter={(e) => {
                if (!action.disabled) {
                  e.currentTarget.style.background = 'var(--grey)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <i className={`bx ${action.icon}`} style={{ fontSize: '16px' }}></i>
              {t(action.label)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
