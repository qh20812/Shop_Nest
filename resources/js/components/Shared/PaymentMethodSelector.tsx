import React from 'react';

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

interface PaymentMethodSelectorProps {
  methods: PaymentMethod[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  methods,
  selectedId,
  onSelect,
}) => {
  const getIcon = (methodId: string) => {
    switch (methodId) {
      case 'stripe':
        return 'fab fa-cc-stripe';
      case 'paypal':
        return 'fab fa-paypal';
      case 'cod':
        return 'fas fa-money-bill-wave';
      default:
        return 'fas fa-credit-card';
    }
  };

  return (
    <div className="space-y-3">
      {methods.map((method) => (
        <div
          key={method.id}
          onClick={() => onSelect(method.id)}
          className={`p-4 bg-white border-2 rounded-lg cursor-pointer transition-all duration-300 ${
            selectedId === method.id
              ? 'border-primary bg-primary-light'
              : 'border-gray-200 hover:border-primary'
          }`}
        >
          <div className="flex items-center gap-3">
            <input
              type="radio"
              checked={selectedId === method.id}
              onChange={() => onSelect(method.id)}
              className="w-5 h-5 cursor-pointer accent-primary"
            />
            
            <div className="flex items-center gap-3 flex-1">
              <i className={`${getIcon(method.id)} text-2xl text-primary`}></i>
              <div>
                <p className="text-[15px] font-semibold text-gray-900">
                  {method.name}
                </p>
                <p className="text-sm text-gray-500 mt-0.5">
                  {method.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaymentMethodSelector;
