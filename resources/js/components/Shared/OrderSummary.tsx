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
    <div className="space-y-3">
      {/* Subtotal */}
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600">Tạm tính:</span>
        <span className="font-medium text-gray-900">
          {formatPrice(subtotalValue)}
        </span>
      </div>

      {/* Shipping */}
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600">Phí vận chuyển:</span>
        <span className="font-medium text-gray-900">
          {shippingValue === 0 ? 'Miễn phí' : formatPrice(shippingValue)}
        </span>
      </div>

      {/* Discount */}
      {discountValue > 0 && (
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Giảm giá:</span>
          <span className="font-medium text-red-600">
            -{formatPrice(discountValue)}
          </span>
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-gray-200 my-3"></div>

      {/* Total */}
      <div className="flex justify-between items-center">
        <span className="text-base font-semibold text-gray-900">
          Tổng cộng:
        </span>
        <span className="text-xl font-bold text-red-600">
          {formatPrice(totalValue)}
        </span>
      </div>
    </div>
  );
};

export default OrderSummary;
