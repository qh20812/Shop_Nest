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
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="relative w-full max-w-md bg-white rounded-lg shadow-xl">
        {/* Icon */}
        <div className="flex justify-center pt-6">
          <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center">
            <i className="fas fa-exclamation-triangle text-3xl text-yellow-600"></i>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Xác nhận rời khỏi trang
          </h3>
          <p className="text-sm text-gray-600">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 pt-0">
          <button
            onClick={handleStay}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
          >
            Ở lại
          </button>
          <button
            onClick={handleLeave}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
          >
            Rời khỏi
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutExitConfirmation;
