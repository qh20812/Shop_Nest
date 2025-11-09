import React from 'react';
import { toNumericPrice, type PriceLike } from '@/utils/price';

interface OrderSummaryProps {
  subtotal: PriceLike;
  shipping: PriceLike;
  discount: PriceLike;
  total: PriceLike;
  currencySuffix?: string;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  subtotal,
  shipping,
  discount,
  total,
  currencySuffix = 'đ',
}) => {
  const formatPrice = (price: PriceLike) => {
    const numeric = toNumericPrice(price);
    const formatted = new Intl.NumberFormat('vi-VN').format(numeric);
    return currencySuffix ? `${formatted} ${currencySuffix}` : formatted;
  };

  const shippingValue = toNumericPrice(shipping);
  const discountValue = toNumericPrice(discount);
  const subtotalValue = toNumericPrice(subtotal);
  const totalValue = toNumericPrice(total);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
      {/* Subtotal */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 'var(--font-size-sm)' }}>
        <span style={{ color: 'var(--text-secondary)' }}>Tạm tính:</span>
        <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
          {formatPrice(subtotalValue)}
        </span>
      </div>

      {/* Shipping */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 'var(--font-size-sm)' }}>
        <span style={{ color: 'var(--text-secondary)' }}>Phí vận chuyển:</span>
        <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
          {shippingValue === 0 ? 'Miễn phí' : formatPrice(shippingValue)}
        </span>
      </div>

      {/* Discount */}
      {discountValue > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 'var(--font-size-sm)' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Giảm giá:</span>
          <span style={{ fontWeight: 500, color: 'var(--danger)' }}>
            -{formatPrice(discountValue)}
          </span>
        </div>
      )}

      {/* Divider */}
      <div style={{ borderTop: '1px solid var(--border-color)', margin: 'var(--spacing-sm) 0' }}></div>

      {/* Total */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 'var(--font-size-base)', fontWeight: 600, color: 'var(--text-primary)' }}>
          Tổng cộng:
        </span>
        <span style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, color: 'var(--danger)' }}>
          {formatPrice(totalValue)}
        </span>
      </div>
    </div>
  );
};

export default OrderSummary;
