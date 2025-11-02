import React from 'react';

interface OrdersHeaderProps {
  totalSpentLabel: string;
}

const OrdersHeader: React.FC<OrdersHeaderProps> = ({ totalSpentLabel }) => (
  <section className="orders-header" aria-live="polite">
    <div className="orders-header-text">
      <h1 id="orders-page-title" className="orders-header-title">Đơn hàng của tôi</h1>
      <p className="orders-header-subtitle">
        Theo dõi, kiểm tra và quản lý tất cả đơn hàng của bạn một cách dễ dàng.
      </p>
    </div>
    <div className="orders-header-highlight" aria-label="Tổng chi tiêu">
      <span className="orders-header-label">Tổng đã chi</span>
      <span className="orders-header-value">{totalSpentLabel}</span>
    </div>
  </section>
);

export default OrdersHeader;
