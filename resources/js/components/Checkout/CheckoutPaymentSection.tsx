import React from 'react';
import PaymentMethodSelector from '@/Components/Shared/PaymentMethodSelector';

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

interface CheckoutPaymentSectionProps {
  methods: PaymentMethod[];
  selectedMethod: string;
  onMethodChange: (methodId: string) => void;
  onCheckout: () => void;
  processing: boolean;
  disabled?: boolean;
}

const CheckoutPaymentSection: React.FC<CheckoutPaymentSectionProps> = ({
  methods,
  selectedMethod,
  onMethodChange,
  onCheckout,
  processing,
  disabled = false,
}) => {
  return (
    <div className="checkout-section checkout-payment">
      <div className="checkout-section__header">
        <i className="checkout-section__icon fas fa-credit-card" aria-hidden="true"></i>
        <h3 className="checkout-section__title">
          Phương thức thanh toán
        </h3>
      </div>
      
      <PaymentMethodSelector
        methods={methods}
        selectedId={selectedMethod}
        onSelect={onMethodChange}
      />
      
      <button
        onClick={onCheckout}
  disabled={processing || disabled || !selectedMethod}
        className="checkout-button checkout-button--primary checkout-payment__submit"
      >
        {processing ? (
          <span className="checkout-button__loading">
            <i className="fas fa-spinner fa-spin"></i>
            Đang xử lý...
          </span>
        ) : (
          'Đặt hàng'
        )}
      </button>
    </div>
  );
};

export default CheckoutPaymentSection;
