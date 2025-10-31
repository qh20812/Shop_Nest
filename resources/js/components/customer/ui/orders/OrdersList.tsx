import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { OrderStatusTheme, OrderSummary } from './types';
import OrderCard from './OrderCard';

interface OrdersListProps {
  orders: OrderSummary[];
  ordersEndpoint: string;
  hasMore: boolean;
  onLoadMore: () => void;
  formatPrice: (amount: number) => string;
  formatDateTime: (timestamp: string) => string;
  resolveStatusLabel: (status: string) => string;
  resolveStatusTheme: (status: string) => OrderStatusTheme;
  onCancel: (orderId: number) => void;
  onReorder: (orderId: number) => void;
  onDownloadInvoice: (orderId: number) => void;
}

const OrdersList: React.FC<OrdersListProps> = ({
  orders,
  ordersEndpoint,
  hasMore,
  onLoadMore,
  formatPrice,
  formatDateTime,
  resolveStatusLabel,
  resolveStatusTheme,
  onCancel,
  onReorder,
  onDownloadInvoice,
}) => (
  <InfiniteScroll
    dataLength={orders.length}
    next={onLoadMore}
    hasMore={hasMore}
    loader={
      <div className="orders-loading" role="status" aria-live="polite">
        Đang tải thêm đơn hàng...
      </div>
    }
    endMessage={
      <div className="orders-loading" role="status" aria-live="polite">
        Bạn đã xem tất cả đơn hàng.
      </div>
    }
  >
    {orders.map((order) => (
      <OrderCard
        key={order.order_id}
        order={order}
        ordersEndpoint={ordersEndpoint}
        formatPrice={formatPrice}
        formatDateTime={formatDateTime}
        resolveStatusLabel={resolveStatusLabel}
        resolveStatusTheme={resolveStatusTheme}
        onCancel={onCancel}
        onReorder={onReorder}
        onDownloadInvoice={onDownloadInvoice}
      />
    ))}
  </InfiniteScroll>
);

export default OrdersList;
