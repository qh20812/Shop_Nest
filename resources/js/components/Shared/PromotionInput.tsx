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
      <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
        <i className="fas fa-check-circle text-green-600 text-lg"></i>
        <div className="flex-1">
          <p className="text-sm font-medium text-green-800">
            Mã giảm giá đã áp dụng
          </p>
          <p className="text-xs text-green-600">
            {appliedCode}
          </p>
        </div>
        {onRemove && (
          <button
            onClick={handleRemove}
            disabled={loading}
            className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded transition-colors duration-200 disabled:opacity-50"
          >
            {loading ? 'Đang xóa...' : 'Xóa'}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleApply()}
        placeholder="Nhập mã giảm giá"
        disabled={disabled || loading}
        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 ring-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
      <button
        onClick={handleApply}
        disabled={!code.trim() || disabled || loading}
        className="px-6 py-2.5 btn-primary text-sm font-medium rounded-lg transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {loading ? 'Đang áp dụng...' : 'Áp dụng'}
      </button>
    </div>
  );
};

export default PromotionInput;
