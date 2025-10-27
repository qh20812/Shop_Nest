import React, { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';

interface CheckoutExitConfirmationProps {
  hasUnsavedChanges: boolean;
  message?: string;
}

const CheckoutExitConfirmation: React.FC<CheckoutExitConfirmationProps> = ({
  hasUnsavedChanges,
  message = 'Bạn có chắc muốn rời khỏi trang thanh toán? Các thay đổi chưa được lưu có thể bị mất.',
}) => {
  const [showModal, setShowModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null);

  useEffect(() => {
    // Handle browser navigation (refresh, close tab, back button)
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    // Handle Inertia navigation
    const handleInertiaNavigate = (event: Event & { detail?: { visit?: { url?: string } } }) => {
      if (hasUnsavedChanges && !showModal) {
        event.preventDefault();
        setShowModal(true);
        setPendingNavigation(() => () => {
          if (event.detail?.visit?.url) {
            router.visit(event.detail.visit.url);
          }
        });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('inertia:before', handleInertiaNavigate);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('inertia:before', handleInertiaNavigate);
    };
  }, [hasUnsavedChanges, message, showModal]);

  const handleStay = () => {
    setShowModal(false);
    setPendingNavigation(null);
  };

  const handleLeave = () => {
    setShowModal(false);
    if (pendingNavigation) {
      pendingNavigation();
    }
  };

  if (!showModal) return null;

  return (
    <div className="checkout-exit__overlay">
      <div className="checkout-exit__dialog" role="dialog" aria-modal="true">
        <div className="checkout-exit__icon">
          <i className="fas fa-exclamation-triangle" aria-hidden="true"></i>
        </div>

        <div className="checkout-exit__content">
          <h3 className="checkout-exit__title">Xác nhận rời khỏi trang</h3>
          <p className="checkout-exit__message">{message}</p>
        </div>

        <div className="checkout-exit__actions">
          <button
            type="button"
            onClick={handleStay}
            className="checkout-button checkout-button--secondary"
          >
            Ở lại
          </button>
          <button
            type="button"
            onClick={handleLeave}
            className="checkout-button checkout-button--danger"
          >
            Rời khỏi
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutExitConfirmation;
