import React from 'react';

interface OrderShowHeaderProps {
  orderNumber: string;
  status: string;
  totalAmount: string;
  createdAt: string;
  statusTheme: string;
}

const OrderShowHeader: React.FC<OrderShowHeaderProps> = ({
  orderNumber,
  status,
  totalAmount,
  statusTheme
}) => (
  <section className="orders-header" aria-live="polite">
    <div className="orders-header-text">
      <h1 id="order-show-title" className="orders-header-title">Chi tiết đơn hàng</h1>
      <p className="orders-header-subtitle">
        Xem thông tin chi tiết và theo dõi trạng thái đơn hàng của bạn.
      </p>
    </div>
    <div className="orders-header-highlight" aria-label="Thông tin đơn hàng">
      <span className="orders-header-label">Đơn hàng #{orderNumber}</span>
      <span className={`order-status-badge order-status-badge--${statusTheme}`}>
        {status}
      </span>
      <span className="orders-header-value">{totalAmount}</span>
    </div>
  </section>
);

export default OrderShowHeader;