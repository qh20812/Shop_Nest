import React from 'react';
import { Link } from '@inertiajs/react';
import { Download, Eye, RotateCcw, X } from 'lucide-react';
import { OrderStatusTheme, OrderSummary } from './types';

interface OrderCardProps {
  order: OrderSummary;
  ordersEndpoint: string;
  formatPrice: (amount: number) => string;
  formatDateTime: (timestamp: string) => string;
  resolveStatusLabel: (status: string) => string;
  resolveStatusTheme: (status: string) => OrderStatusTheme;
  onCancel: (orderId: number) => void;
  onReorder: (orderId: number) => void;
  onDownloadInvoice: (orderId: number) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  ordersEndpoint,
  formatPrice,
  formatDateTime,
  resolveStatusLabel,
  resolveStatusTheme,
  onCancel,
  onReorder,
  onDownloadInvoice,
}) => {
  const statusTheme = resolveStatusTheme(order.status);
  const statusLabel = resolveStatusLabel(order.status);

  return (
    <article className="order-card" aria-labelledby={`order-${order.order_id}-title`}>
      <header className="order-card-header">
        <div className="order-card-heading">
          <p id={`order-${order.order_id}-title`} className="order-number">
            Mã đơn: {order.order_number}
          </p>
          <p className="order-meta">Đặt lúc: {formatDateTime(order.created_at)}</p>
        </div>
        <div className="order-card-insight">
          <span className={`order-status-badge order-status-badge--${statusTheme}`}>
            {statusLabel}
          </span>
          <span className="order-total">Tổng: {formatPrice(order.total_amount)}</span>
        </div>
      </header>

      <div className="order-shop-groups">
        {order.grouped_items.map((group, index) => {
          const sellerRef = group.seller.shop_id ?? group.seller.id ?? group.seller.user_id ?? null;
          const sellerKey = sellerRef ?? `unknown-${index}`;
          const shopIdForLink = group.seller.shop_id ?? group.seller.id ?? null;
          const shopLink = shopIdForLink ? `/shops/${shopIdForLink}` : '#';
          const sellerInitial = (group.seller.name ?? 'Người bán').trim().charAt(0).toUpperCase();

          return (
            <div key={`${order.order_id}-${sellerKey}`} className="order-shop-group">
              <div className="order-shop-header">
                {group.seller.avatar ? (
                  <img
                    src={group.seller.avatar}
                    alt={group.seller.name}
                    className="order-shop-avatar"
                    loading="lazy"
                  />
                ) : (
                  <div className="order-shop-avatar" aria-hidden="true">
                    {sellerInitial || 'N'}
                  </div>
                )}
                <div className="order-shop-info">
                  <span className="order-shop-name">{group.seller.name}</span>
                  <Link href={shopLink} className="order-shop-link" aria-label={`Xem shop ${group.seller.name}`}>
                    Xem shop
                  </Link>
                </div>
              </div>

              <div className="order-shop-items">
                {group.items.map((item) => (
                  <div key={item.order_item_id} className="order-item" role="listitem">
                    {item.product_snapshot.image_url ? (
                      <img
                        src={item.product_snapshot.image_url}
                        alt={item.product_snapshot.name ?? 'Sản phẩm'}
                        className="order-item-thumbnail"
                        loading="lazy"
                      />
                    ) : (
                      <div className="order-item-thumbnail" aria-hidden="true">
                        N/A
                      </div>
                    )}
                    <div className="order-item-info">
                      <p className="order-item-name">{item.product_snapshot.name ?? 'Sản phẩm'}</p>
                      <p className="order-item-meta">Số lượng: {item.quantity}</p>
                    </div>
                    <div className="order-item-pricing">
                      <span className="order-item-unit">{formatPrice(item.unit_price)}</span>
                      <span className="order-item-total">{formatPrice(item.total_price)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <footer className="order-card-actions" role="group" aria-label={`Thao tác nhanh cho đơn ${order.order_number}`}>
        <Link href={`${ordersEndpoint}/${order.order_id}`} className="order-action order-action--secondary">
          <Eye className="order-action-icon" aria-hidden="true" />
          Xem chi tiết
        </Link>
        <button type="button" className="order-action order-action--danger" onClick={() => onCancel(order.order_id)}>
          <X className="order-action-icon" aria-hidden="true" />
          Hủy đơn
        </button>
        <button type="button" className="order-action" onClick={() => onReorder(order.order_id)}>
          <RotateCcw className="order-action-icon" aria-hidden="true" />
          Đặt lại
        </button>
        <button
          type="button"
          className="order-action order-action--ghost"
          onClick={() => onDownloadInvoice(order.order_id)}
        >
          <Download className="order-action-icon" aria-hidden="true" />
          In hóa đơn
        </button>
      </footer>
    </article>
  );
};

export default OrderCard;
