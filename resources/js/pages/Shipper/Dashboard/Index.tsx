/** @jsxImportSource react */
import * as React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app/AppLayout';
import Avatar from '@/components/ui/Avatar';
import StatusBadge from '@/components/ui/StatusBadge';
import DataTable from '@/components/ui/DataTable';
import { Truck, Star, Wallet, Clock } from 'lucide-react';

interface Journey {
  id: number;
  order_id: number;
  leg_type: string;
  tracking_number: string;
  status: string;
  start_hub: string;
  end_hub: string;
  started_at: string | null;
  completed_at: string | null;
  shipper: {
    id: number;
    name: string;
    avatar_url: string | null;
  };
}

interface Rating {
  id: number;
  rating: number;
  comment: string;
  customer_name: string;
  customer_avatar: string | null;
  rated_at: string;
}

export default function ShipperDashboard() {
  const { props } = usePage();
  const stats = props.stats ?? {
    today_orders: 0,
    total_earnings: '0₫',
    average_rating: '5.0',
    status: 'OFFLINE'
  };
  const journeys = props.journeys ?? [];
  const recentRatings = props.recentRatings ?? [];
  const shipper = props.shipper ?? { name: '', avatar_url: null, status: 'inactive' };

  const columns = [
    { 
      header: 'Mã đơn',
      accessorKey: 'order_id',
      cell: ({ row }) => (
        <Link href={`/orders/${row.original.order_id}`} className="text-blue-600 hover:underline">
          #{row.original.order_id}
        </Link>
      )
    },
    { 
      header: 'Tracking', 
      accessorKey: 'tracking_number'
    },
    {
      header: 'Trạng thái',
      cell: ({ row }) => <StatusBadge status={row.original.status} />
    },
    {
      header: 'Điểm lấy/giao',
      cell: ({ row }) => (
        <div className="text-sm">
          <div>Từ: {row.original.start_hub}</div>
          <div>Đến: {row.original.end_hub}</div>
        </div>
      )
    },
    {
      header: 'Thời gian',
      cell: ({ row }) => (
        <div className="text-sm">
          <div>Bắt đầu: {row.original.started_at ?? '-'}</div>
          <div>Hoàn thành: {row.original.completed_at ?? '-'}</div>
        </div>
      )
    },
    {
      header: '',
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button 
            onClick={() => handleStatusUpdate(row.original.id, 'in_transit')}
            className="btn btn-sm btn-primary"
            disabled={row.original.status === 'completed'}
          >
            Bắt đầu
          </button>
          <button
            onClick={() => handleStatusUpdate(row.original.id, 'completed')}
            className="btn btn-sm btn-success"
            disabled={row.original.status === 'completed'}
          >
            Hoàn thành
          </button>
        </div>
      )
    }
  ];

  const handleStatusUpdate = async (journeyId: number, status: string) => {
    try {
      const response = await fetch(`/shipper/journeys/${journeyId}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const statsCards = [
    {
      icon: <Truck className="w-8 h-8 text-blue-500" />,
      label: 'Đơn hàng hôm nay',
      value: stats.today_orders,
      color: 'blue'
    },
    {
      icon: <Wallet className="w-8 h-8 text-green-500" />,
      label: 'Thu nhập tuần',
      value: stats.total_earnings,
      color: 'green'
    },
    {
      icon: <Star className="w-8 h-8 text-yellow-500" />,
      label: 'Đánh giá',
      value: stats.average_rating,
      color: 'yellow'
    },
    {
      icon: <Clock className="w-8 h-8 text-purple-500" />,
      label: 'Trạng thái',
      value: stats.status,
      color: stats.status === 'ONLINE' ? 'green' : 'red'
    }
  ];

  return (
    <AppLayout>
      <Head title="Shipper Dashboard" />
      
      <div className="p-6">
        {/* Shipper Profile Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6 flex items-center gap-4">
          <Avatar src={shipper.avatar_url} alt={shipper.name} size={64} />
          <div>
            <h2 className="text-xl font-bold">{shipper.name}</h2>
            <StatusBadge status={shipper.status} />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {statsCards.map((stat, index) => (
            <div key={index} className={`bg-white rounded-lg shadow p-6 border-l-4 border-${stat.color}-500`}>
              <div className="flex items-center gap-4">
                {stat.icon}
                <div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-gray-600 text-sm">{stat.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Active Journeys */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">Hành trình đang xử lý</h3>
          <DataTable 
            columns={columns}
            data={journeys}
            pagination={false}
          />
        </div>

        {/* Recent Ratings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">Đánh giá gần đây</h3>
          <div className="space-y-4">
            {recentRatings.map((rating: Rating) => (
              <div key={rating.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <Avatar src={rating.customer_avatar} alt={rating.customer_name} size={40} />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{rating.customer_name}</span>
                    <span className="text-sm text-gray-500">{rating.rated_at}</span>
                  </div>
                  <div className="flex items-center gap-1 my-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i}
                        className={`w-4 h-4 ${i < rating.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill={i < rating.rating ? 'currentColor' : 'none'}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm">{rating.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}