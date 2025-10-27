import React, { useEffect } from 'react';

type ModalWidth = 'small' | 'medium' | 'large';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: ModalWidth;
}

const widthClassMap: Record<ModalWidth, string> = {
  small: 'checkout-modal__dialog--small',
  medium: 'checkout-modal__dialog--medium',
  large: 'checkout-modal__dialog--large',
};

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'large',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="checkout-modal__overlay"
      onClick={onClose}
    >
      <div
        className={`checkout-modal__dialog ${widthClassMap[maxWidth]}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-modal-title"
      >
        <div className="checkout-modal__header">
          <h3 className="checkout-modal__title" id="checkout-modal-title">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="checkout-modal__close"
            aria-label="Đóng hộp thoại"
          >
            <i className="fas fa-times" aria-hidden="true"></i>
          </button>
        </div>

        <div className="checkout-modal__body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
