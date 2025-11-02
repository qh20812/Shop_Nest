import React from 'react';

export type AddressDialogProps = {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  confirmTone?: 'danger' | 'primary';
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

const AddressDialog: React.FC<AddressDialogProps> = ({
  isOpen,
  title,
  description,
  confirmLabel,
  cancelLabel = 'Hủy bỏ',
  confirmTone = 'danger',
  loading = false,
  onConfirm,
  onCancel,
}) => (
  <div className={`address-dialog${isOpen ? ' is-open' : ''}`} role="alertdialog" aria-modal="true" aria-labelledby="address-dialog-title">
    <div className="address-dialog__content">
      <div className="address-dialog__icon">
        <i className="bi bi-exclamation-lg" aria-hidden="true" />
      </div>
      <h2 id="address-dialog-title" className="address-dialog__title">
        {title}
      </h2>
      <p className="address-dialog__description">{description}</p>
      <div className="address-dialog__actions">
        <button type="button" className="address-dialog__btn address-dialog__btn--neutral" onClick={onCancel}>
          {cancelLabel}
        </button>
        <button
          type="button"
          className={`address-dialog__btn address-dialog__btn--${confirmTone === 'danger' ? 'danger' : 'primary'}`}
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? 'Đang xử lý...' : confirmLabel}
        </button>
      </div>
    </div>
  </div>
);

export default AddressDialog;
