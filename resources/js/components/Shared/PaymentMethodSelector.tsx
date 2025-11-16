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
  const resolveIcon = (method: PaymentMethod) => {
    const key = method.icon ?? method.id;

    switch (key) {
      case 'stripe':
        return 'fab fa-cc-stripe';
      case 'paypal':
        return 'fab fa-paypal';
      case 'cod':
        return 'fas fa-money-bill-wave';
      case 'vnpay':
        return 'fas fa-qrcode';
      case 'momo':
        return 'fas fa-wallet';
      default:
        return key.includes('fa-') ? key : 'fas fa-credit-card';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
      {methods.map((method) => (
        <div
          key={method.id}
          onClick={() => onSelect(method.id)}
          style={{
            padding: 'var(--spacing-md)',
            background: 'var(--surface)',
            border: selectedId === method.id ? '2px solid var(--primary)' : '2px solid var(--border-color)',
            borderRadius: 'var(--border-radius-md)',
            cursor: 'pointer',
            transition: 'all var(--transition-normal)',
            backgroundColor: selectedId === method.id ? 'var(--light-primary)' : 'var(--surface)'
          }}
          onMouseEnter={(e) => {
            if (selectedId !== method.id) {
              e.currentTarget.style.borderColor = 'var(--primary)';
            }
          }}
          onMouseLeave={(e) => {
            if (selectedId !== method.id) {
              e.currentTarget.style.borderColor = 'var(--border-color)';
            }
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <input
              type="radio"
              checked={selectedId === method.id}
              onChange={() => onSelect(method.id)}
              style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--primary)' }}
            />
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', flex: 1 }}>
              <i className={resolveIcon(method)} style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--primary)' }}></i>
              <div>
                <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                  {method.name}
                </p>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginTop: '2px', margin: 0 }}>
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
