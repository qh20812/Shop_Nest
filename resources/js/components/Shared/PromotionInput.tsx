import React, { useState } from 'react';

interface PromotionInputProps {
  onApply: (code: string) => Promise<void>;
  onRemove?: () => Promise<void>;
  appliedCode?: string;
  disabled?: boolean;
}

const PromotionInput: React.FC<PromotionInputProps> = ({
  onApply,
  onRemove,
  appliedCode,
  disabled = false,
}) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    if (!code.trim()) return;
    
    setLoading(true);
    try {
      await onApply(code);
      setCode('');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!onRemove) return;
    
    setLoading(true);
    try {
      await onRemove();
    } finally {
      setLoading(false);
    }
  };

  if (appliedCode) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', padding: 'var(--spacing-sm)', background: 'var(--light-success)', border: '1px solid var(--success)', borderRadius: 'var(--border-radius-md)' }}>
        <i className="fas fa-check-circle" style={{ color: 'var(--success-dark)', fontSize: 'var(--font-size-lg)' }}></i>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500, color: 'var(--success-dark)', margin: 0 }}>
            Mã giảm giá đã áp dụng
          </p>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--success-dark)', margin: 0, marginTop: '2px' }}>
            {appliedCode}
          </p>
        </div>
        {onRemove && (
          <button
            onClick={handleRemove}
            disabled={loading}
            className="checkout-button"
            style={{ padding: 'var(--spacing-xs) var(--spacing-sm)', fontSize: 'var(--font-size-sm)', color: 'var(--danger)', background: 'transparent', border: 'none', minHeight: 'auto', opacity: loading ? 0.5 : 1 }}
          >
            {loading ? 'Đang xóa...' : 'Xóa'}
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleApply()}
        placeholder="Nhập mã giảm giá"
        disabled={disabled || loading}
        className="checkout-input"
        style={{ flex: 1, padding: 'var(--spacing-sm) var(--spacing-md)', fontSize: 'var(--font-size-sm)' }}
      />
      <button
        onClick={handleApply}
        disabled={!code.trim() || disabled || loading}
        className="checkout-button checkout-button--primary"
        style={{ padding: '0 var(--spacing-lg)', fontSize: 'var(--font-size-sm)' }}
      >
        {loading ? 'Đang áp dụng...' : 'Áp dụng'}
      </button>
    </div>
  );
};

export default PromotionInput;
