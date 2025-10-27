import React from 'react';

interface OrderSummaryProps {
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  currencySymbol?: string;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  subtotal,
  shipping,
  discount,
  total,
  currencySymbol = '₫',
}) => {
  const formatPrice = (price: number) => {
    return `${price.toLocaleString('vi-VN')}${currencySymbol}`;
  };

  return (
    <div className="space-y-3">
      {/* Subtotal */}
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600">Tạm tính:</span>
        <span className="font-medium text-gray-900">
          {formatPrice(subtotal)}
        </span>
      </div>

      {/* Shipping */}
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600">Phí vận chuyển:</span>
        <span className="font-medium text-gray-900">
          {shipping === 0 ? 'Miễn phí' : formatPrice(shipping)}
        </span>
      </div>

      {/* Discount */}
      {discount > 0 && (
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Giảm giá:</span>
          <span className="font-medium text-red-600">
            -{formatPrice(discount)}
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
          {formatPrice(total)}
        </span>
      </div>
    </div>
  );
};

export default OrderSummary;
