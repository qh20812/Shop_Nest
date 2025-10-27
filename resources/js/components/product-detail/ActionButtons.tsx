import React from 'react';

interface ActionButtonsProps {
  onAddToCart: () => void;
  onBuyNow: () => void;
  disabled?: boolean;
  loading?: 'add' | 'buy' | null;
  isInStock: boolean;
}

export default function ActionButtons({ onAddToCart, onBuyNow, disabled = false, loading = null, isInStock }: ActionButtonsProps) {
  const isActionDisabled = disabled || !isInStock;

  return (
    <div className="product-action-buttons">
      <button
        type="button"
        className="product-action-btn add-to-cart"
        onClick={onAddToCart}
        disabled={isActionDisabled || loading === 'add'}
      >
        {loading === 'add' ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
      </button>
      <button
        type="button"
        className="product-action-btn buy-now"
        onClick={onBuyNow}
        disabled={isActionDisabled || loading === 'buy'}
      >
        {loading === 'buy' ? 'Đang xử lý...' : 'Mua ngay'}
      </button>
      {!isInStock && (
        <div className="stock-notice">Sản phẩm tạm hết hàng</div>
      )}
    </div>
  );
}
