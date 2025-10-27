import React from 'react';
import ActionButton from './ActionButton';
import { useTranslation } from '@/lib/i18n';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}: ConfirmationModalProps) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={handleBackdropClick}
    >
      <div
        style={{
          background: 'var(--light)',
          borderRadius: '12px',
          padding: '24px',
          maxWidth: '400px',
          width: '90%',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
        }}
      >
        <div style={{ marginBottom: '16px' }}>
          <h3
            style={{
              margin: '0 0 12px 0',
              color: 'var(--dark)',
              fontSize: '18px',
              fontWeight: '600',
            }}
          >
            {title}
          </h3>
          <p
            style={{
              margin: 0,
              color: 'var(--dark-grey)',
              fontSize: '14px',
              lineHeight: '1.5',
            }}
          >
            {message}
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end',
          }}
        >
          <ActionButton variant="secondary" onClick={onClose}>
            {t('Cancel')}
          </ActionButton>
          <ActionButton
            variant="danger"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {t('Confirm')}
          </ActionButton>
        </div>
      </div>
    </div>
  );
}
