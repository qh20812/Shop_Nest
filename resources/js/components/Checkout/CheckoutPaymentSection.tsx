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
    <div className="bg-gray-50 rounded-lg p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <i className="fas fa-credit-card text-primary"></i>
        <h3 className="text-lg font-semibold text-gray-900">
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
        disabled={processing || disabled}
        className="w-full mt-5 px-6 py-4 btn-primary text-base font-semibold rounded-lg transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
      >
        {processing ? (
          <span className="flex items-center justify-center gap-2">
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
