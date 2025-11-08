import React from 'react';
import { Truck, Star, Wallet, Clock } from 'lucide-react';

interface Stats {
  today_orders: number;
  total_earnings: string;
  average_rating: string;
  status: string;
}

interface StatsGridProps {
  stats: Stats;
}

export default function StatsGrid({ stats }: StatsGridProps) {
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
  );
}