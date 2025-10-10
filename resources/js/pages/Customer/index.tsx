/** @jsxImportSource react */
import * as React from 'react';
import AppLayout from '@/layouts/app/AppLayout';
import Header from '@/components/ui/Header';
import Insights from '@/components/ui/Insights';
import Avatar from '@/components/ui/Avatar';
import StatusBadge from '@/components/ui/StatusBadge';
import { Link, Head, usePage } from '@inertiajs/react';
import '@/../css/Page.css';
import { JSX } from 'react';

interface InsightsData {
  total_orders?: number;
  pending_orders?: number;
  delivered_orders?: number;
  total_spent?: number | null;
}

interface Order {
  id: number;
  order_number?: string;
  created_at?: string;
  status?: number | string;
  total_amount?: number;
  main_product?: string;
}

interface User {
  id?: number;
  name?: string;
  email?: string;
  avatar_url?: string | null;
  status?: string;
}

interface Props {
  user?: User;
  insights?: InsightsData;
  recentOrders?: Order[];
  wishlistCount?: number;
  reviewsCount?: number;
}

export default function CustomerDashboard(): JSX.Element {
  const {
    user = { id: 0, name: 'Khách hàng', email: '', avatar_url: null, status: 'active' },
    insights = { total_orders: 0, pending_orders: 0, delivered_orders: 0, total_spent: 0 },
    recentOrders = [],
    wishlistCount = 0,
    reviewsCount = 0,
  } = usePage().props as unknown as Props;

  const breadcrumbs = [
    { label: 'Customer', href: '/customer/dashboard' },
    { label: 'Dashboard', active: true }
  ];

  const insightsItems = [
    { icon: 'bx-receipt', value: (insights.total_orders ?? 0).toLocaleString(), label: 'Tổng số đơn hàng' },
    { icon: 'bx-time', value: (insights.pending_orders ?? 0).toLocaleString(), label: 'Đang chờ xử lý' },
    { icon: 'bx-check-circle', value: (insights.delivered_orders ?? 0).toLocaleString(), label: 'Đã giao thành công' },
    { icon: 'bx-wallet', value: (Number(insights.total_spent ?? 0)).toLocaleString(), label: 'Tổng tiền đã chi' },
  ];

  const formatDate = (d?: string) => d ? new Date(d).toLocaleString('vi-VN') : '-';
  const formatCurrency = (n?: number) => n != null ? n.toLocaleString() + '₫' : '-';

  return (
    <AppLayout>
      <Head title="Customer Dashboard" />
      <Header
        title="Customer Dashboard"
        breadcrumbs={breadcrumbs}
      />

      <div className="customer-dashboard page-section">
        <div className="customer-top">
          <div className="customer-profile">
            <Avatar src={user?.avatar_url ?? null} alt={user?.name ?? 'Khách hàng'} size={56} />
            <div className="customer-profile-info">
              <div className="customer-name">{user.name}</div>
              <div className="customer-email">{user.email}</div>
              <div className="customer-status">{user.status}</div>
            </div>
            <div className="customer-actions">
              <Link href="/profile" className="btn small">Chỉnh sửa</Link>
            </div>
          </div>

          <div className="customer-quick-actions">
            <Link href="/orders" className="btn primary">Tất cả đơn hàng</Link>
            <Link href="/wishlist" className="btn">Wishlist</Link>
            <Link href="/reviews/new" className="btn">Viết review</Link>
            <Link href="/profile" className="btn">Cập nhật thông tin</Link>
          </div>
        </div>

        <div className="customer-insights">
          <Insights items={insightsItems} />
        </div>

        <div className="customer-main">
          <div className="customer-left">
            <div className="card">
              <div className="card-header">
                <h3>Đơn hàng gần đây</h3>
              </div>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Mã</th>
                      <th>Ngày đặt</th>
                      <th>Trạng thái</th>
                      <th>Tổng tiền</th>
                      <th>Sản phẩm chính</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(recentOrders) && recentOrders.slice(0,5).length === 0 ? (
                      <tr><td colSpan={6} className="empty">Không có đơn hàng</td></tr>
                    ) : (Array.isArray(recentOrders) ? recentOrders.slice(0,5).map(o => (
                      <tr key={o.id}>
                        <td>{o.order_number ?? `#${o.id}`}</td>
                        <td>{formatDate(o.created_at)}</td>
                        <td><StatusBadge status={String(o.status ?? '')} /></td>
                        <td>{formatCurrency(o.total_amount)}</td>
                        <td>{o.main_product ?? '-'}</td>
                        <td><Link href={`/orders/${o.id}`} className="action-link">Xem</Link></td>
                      </tr>
                    )) : null)}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="customer-right">
            <div className="small-card">
              <div className="small-card-left">❤️</div>
              <div className="small-card-body">
                <div className="small-card-value">{wishlistCount}</div>
                <div className="small-card-title">Sản phẩm yêu thích</div>
              </div>
              <div><Link href="/wishlist" className="action-link">Xem</Link></div>
            </div>

            <div className="small-card">
              <div className="small-card-left">⭐</div>
              <div className="small-card-body">
                <div className="small-card-value">{reviewsCount}</div>
                <div className="small-card-title">Đánh giá đã viết</div>
              </div>
              <div><Link href="/reviews" className="action-link">Xem</Link></div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}