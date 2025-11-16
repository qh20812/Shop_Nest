import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import CustomerLayout from '@/layouts/app/CustomerLayout';
import { Button } from '@/Components/ui/button';
import OrderShowHeader from '@/Components/customer/ui/orders/OrderShowHeader';
import { Star, Download, RotateCcw, ArrowLeft } from 'lucide-react';

interface Order {
  order_id: number;
  order_number: string;
  status: string;
  total_amount: number;
  created_at: string;
  shipping_address: {
    full_address: string;
  };
  items: Array<{
    product_snapshot: {
      name: string;
      image_url: string;
    };
    quantity: number;
    unit_price: number;
    total_price: number;
  }>;
  reviews?: Array<{
    rating: number;
    comment: string;
    customer: {
      name: string;
    };
  }>;
}

const orderStatusThemeMap: Record<string, string> = {
  pending_confirmation: 'pending',
  pending_assignment: 'processing',
  processing: 'processing',
  assigned_to_shipper: 'processing',
  delivering: 'processing',
  shipped: 'processing',
  delivered: 'completed',
  completed: 'completed',
  cancelled: 'cancelled',
  returned: 'cancelled',
  returned_refunded: 'cancelled',
};

const resolveStatusTheme = (status: string): string =>
  orderStatusThemeMap[status] ?? 'processing';

const orderStatusLabelMap: Record<string, string> = {
  pending_confirmation: 'Chờ xác nhận',
  pending_assignment: 'Chờ phân tài xế',
  processing: 'Đang xử lý',
  assigned_to_shipper: 'Đã giao cho tài xế',
  delivering: 'Đang giao',
  shipped: 'Đang giao',
  delivered: 'Đã giao',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
  returned: 'Đã trả',
  returned_refunded: 'Đã hoàn tiền',
};

const resolveStatusLabel = (status: string) =>
  orderStatusLabelMap[status] ?? status.replace(/_/g, ' ');

export default function Show({ order }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    rating: 5,
    comment: '',
  });

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(`/user/orders/${order.order_id}/review`, {
      onSuccess: () => {
        // Refresh page or update state
        window.location.reload();
      },
    });
  };

  const canReview = ['delivered', 'completed'].includes(order.status);
  const hasReviewed = order.reviews && order.reviews.length > 0;
  const statusTheme = resolveStatusTheme(order.status);
  const statusLabel = resolveStatusLabel(order.status);

  return (
    <CustomerLayout>
      <Head title={`Đơn hàng ${order.order_number}`} />

      <div className="orders-page" aria-labelledby="order-show-title">
        <OrderShowHeader
          orderNumber={order.order_number}
          status={statusLabel}
          totalAmount={formatPrice(order.total_amount)}
          createdAt={order.created_at}
          statusTheme={statusTheme}
        />

        {/* Order Details Card */}
        <div className="order-card">
          <div className="order-card-header">
            <div className="order-card-heading">
              <p className="order-number">Thông tin đơn hàng</p>
              <p className="order-meta">Đặt lúc: {new Date(order.created_at).toLocaleDateString('vi-VN')}</p>
            </div>
            <div className="order-card-insight">
              <span className={`order-status-badge order-status-badge--${statusTheme}`}>
                {statusLabel}
              </span>
              <span className="order-total">{formatPrice(order.total_amount)}</span>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="order-card">
          <h3 className="profile-section-title">Sản phẩm</h3>
          <div className="order-shop-items">
            {order.items.map((item: Order['items'][0], index: number) => (
              <div key={index} className="order-item">
                <img
                  src={item.product_snapshot.image_url || '/placeholder.jpg'}
                  alt={item.product_snapshot.name}
                  className="order-item-thumbnail"
                />
                <div className="order-item-info">
                  <p className="order-item-name">{item.product_snapshot.name}</p>
                  <p className="order-item-meta">Số lượng: {item.quantity} × {formatPrice(item.unit_price)}</p>
                </div>
                <div className="order-item-pricing">
                  <span className="order-item-total">{formatPrice(item.total_price)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Address */}
        <div className="order-card">
          <h3 className="profile-section-title">Địa chỉ giao hàng</h3>
          <p>{order.shipping_address?.full_address || 'N/A'}</p>
        </div>

        {/* Review Section */}
        {canReview && !hasReviewed && (
          <div className="order-card">
            <h3 className="profile-section-title flex items-center">
              <Star className="w-5 h-5 mr-2" />
              Đánh giá đơn hàng
            </h3>
            <form onSubmit={handleReviewSubmit} className="profile-form">
              <div className="profile-field">
                <label className="profile-field-label">Đánh giá</label>
                <div className="profile-field-body">
                  <select
                    value={data.rating}
                    onChange={(e) => setData('rating', parseInt(e.target.value))}
                    className="profile-field-input"
                  >
                    {[5, 4, 3, 2, 1].map((star) => (
                      <option key={star} value={star}>
                        {star} sao
                      </option>
                    ))}
                  </select>
                </div>
                {errors.rating && <p className="profile-field-error">{errors.rating}</p>}
              </div>
              <div className="profile-field">
                <label className="profile-field-label">Bình luận (tùy chọn)</label>
                <div className="profile-field-body">
                  <textarea
                    value={data.comment}
                    onChange={(e) => setData('comment', e.target.value)}
                    rows={4}
                    className="profile-field-input"
                    placeholder="Hãy chia sẻ trải nghiệm của bạn..."
                  />
                </div>
                {errors.comment && <p className="profile-field-error">{errors.comment}</p>}
              </div>
              <div className="profile-form-actions">
                <Button type="submit" disabled={processing} className="profile-action-btn profile-action-btn--primary">
                  Gửi đánh giá
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Existing Reviews */}
        {hasReviewed && (
          <div className="order-card">
            <h3 className="profile-section-title">Đánh giá của bạn</h3>
            {order.reviews?.map((review: NonNullable<Order['reviews']>[0], index: number) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">({review.rating}/5)</span>
                </div>
                {review.comment && <p className="text-gray-700">{review.comment}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="order-card-actions">
          <button
            type="button"
            className="order-action"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="order-action-icon" />
            Quay lại
          </button>
          {order.status === 'delivered' && (
            <button type="button" className="order-action">
              <RotateCcw className="order-action-icon" />
              Yêu cầu trả hàng
            </button>
          )}
          <button type="button" className="order-action">
            <Download className="order-action-icon" />
            Tải hóa đơn
          </button>
        </div>
      </div>
    </CustomerLayout>
  );
}