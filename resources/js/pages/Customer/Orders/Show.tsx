import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import CustomerLayout from '@/layouts/app/CustomerLayout';
import { Button } from '@/Components/ui/button';
import { Star, Download, RotateCcw } from 'lucide-react';

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

interface Props {
  order: Order;
  trackingData?: any;
}

export default function Show({ order, trackingData }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    rating: 5,
    comment: '',
  });

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

  return (
    <CustomerLayout>
      <Head title={`Đơn hàng ${order.order_number}`} />

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Order Header */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Đơn hàng #{order.order_number}</h2>
            <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">{order.status}</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Ngày đặt</p>
              <p>{new Date(order.created_at).toLocaleDateString('vi-VN')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tổng tiền</p>
              <p className="font-semibold">{order.total_amount.toLocaleString()} VND</p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Sản phẩm</h3>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center space-x-4">
                <img
                  src={item.product_snapshot.image_url || '/placeholder.jpg'}
                  alt={item.product_snapshot.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h4 className="font-medium">{item.product_snapshot.name}</h4>
                  <p className="text-sm text-gray-600">
                    Số lượng: {item.quantity} × {item.unit_price.toLocaleString()} VND
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{item.total_price.toLocaleString()} VND</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Địa chỉ giao hàng</h3>
          <p>{order.shipping_address?.full_address || 'N/A'}</p>
        </div>

        {/* Review Section */}
        {canReview && !hasReviewed && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Star className="w-5 h-5 mr-2" />
              Đánh giá đơn hàng
            </h3>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Đánh giá</label>
                <select
                  value={data.rating}
                  onChange={(e) => setData('rating', parseInt(e.target.value))}
                  className="w-full p-2 border rounded"
                >
                  {[5, 4, 3, 2, 1].map((star) => (
                    <option key={star} value={star}>
                      {star} sao
                    </option>
                  ))}
                </select>
                {errors.rating && <p className="text-red-500 text-sm">{errors.rating}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Bình luận (tùy chọn)</label>
                <textarea
                  value={data.comment}
                  onChange={(e) => setData('comment', e.target.value)}
                  rows={4}
                  className="w-full p-2 border rounded"
                  placeholder="Hãy chia sẻ trải nghiệm của bạn..."
                />
                {errors.comment && <p className="text-red-500 text-sm">{errors.comment}</p>}
              </div>
              <Button type="submit" disabled={processing}>
                Gửi đánh giá
              </Button>
            </form>
          </div>
        )}

        {/* Existing Reviews */}
        {hasReviewed && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Đánh giá của bạn</h3>
            {order.reviews?.map((review, index) => (
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
        <div className="flex space-x-4">
          <Button variant="outline" onClick={() => window.history.back()}>
            Quay lại
          </Button>
          {order.status === 'delivered' && (
            <Button variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Yêu cầu trả hàng
            </Button>
          )}
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Tải hóa đơn
          </Button>
        </div>
      </div>
    </CustomerLayout>
  );
}