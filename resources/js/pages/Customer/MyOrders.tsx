/** @jsxImportSource react */
import * as React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import Header from '@/components/ui/Header';
import DataTable from '@/components/ui/DataTable';
import StatusBadge from '@/components/ui/StatusBadge';
import Pagination from '@/components/ui/Pagination';
import '@/../css/Page.css';


type Order = {
  id: number;
  order_number?: string;
  created_at?: string;
  status?: string;
  total_amount?: number;
  main_product?: string | null;
};

export default function OrdersPage(): JSX.Element {
  const page = usePage();
  const props = page.props as any;
  const orders = props.orders || { data: [], links: [], total: 0 };

  const statusTabs = [
    { key: undefined, label: 'Tất cả' },
    { key: 'pending_confirmation', label: 'Chờ xác nhận' },
    { key: 'delivering', label: 'Vận chuyển' },
    { key: 'awaiting_delivery', label: 'Chờ giao hàng' },
    { key: 'delivered', label: 'Hoàn thành' },
    { key: 'cancelled', label: 'Đã hủy' },
    { key: 'returned', label: 'Trả hàng/Hoàn tiền' },
  ];

  const currentStatus = (page.props as any).filters?.status ?? null;

  const columns = [
    { header: 'Mã đơn', accessorKey: 'order_number' as keyof Order },
    { header: 'Ngày đặt', cell: (row: Order) => (row.created_at ? new Date(row.created_at).toLocaleString('vi-VN') : '-') },
    { header: 'Trạng thái', cell: (row: Order) => <StatusBadge status={row.status ?? 'unknown'} /> },
    { header: 'Tổng tiền', cell: (row: Order) => (row.total_amount != null ? Number(row.total_amount).toLocaleString() + '₫' : '-') },
    { header: 'Sản phẩm chính', accessorKey: 'main_product' as keyof Order },
    { header: '', cell: (row: Order) => <Link href={`/orders/${row.id}`} className="action-link">Xem</Link> },
  ];

    

  return (
    <>
      <Head title="Đơn hàng của tôi" />
      <Header
        title="Đơn hàng của tôi"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Đơn hàng', active: true }]}
      />

      <div className="page-section">
        <div className="tabs-row" style={{ marginBottom: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {statusTabs.map((tab) => (
            <Link
              key={String(tab.key ?? 'all')}
              href={route('user.orders', { status: tab.key })}
              className={`btn ${String(currentStatus) === String(tab.key) ? 'primary' : 'outline'}`}
              preserveState
            >
              {tab.label}
            </Link>
          ))}
        </div>

        <DataTable<Order>
          columns={columns}
          data={Array.isArray(orders.data) ? orders.data : []}
          headerTitle="Đơn hàng gần đây"
          headerIcon="bx-receipt"
          emptyMessage="Không có đơn hàng"
        />

        <div style={{ marginTop: 12 }}>
          <Pagination links={(orders.links ?? [])} />
        </div>
      </div>
    </>
  );
}