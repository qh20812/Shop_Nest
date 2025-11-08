import React from 'react';
import { Link } from '@inertiajs/react';
import DataTable from '@/components/ui/DataTable';
import StatusBadge from '@/components/ui/StatusBadge';

interface Journey {
  id: number;
  order_id: number;
  tracking_number: string;
  status: string;
  start_hub: string;
  end_hub: string;
  started_at: string | null;
  completed_at: string | null;
}

interface JourneysTableProps {
  journeys: Journey[];
  onStatusUpdate: (journeyId: number, status: string) => void;
}

export default function JourneysTable({ journeys, onStatusUpdate }: JourneysTableProps) {
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
            onClick={() => onStatusUpdate(row.original.id, 'in_transit')}
            className="btn btn-sm btn-primary"
            disabled={row.original.status === 'completed'}
          >
            Bắt đầu
          </button>
          <button
            onClick={() => onStatusUpdate(row.original.id, 'completed')}
            className="btn btn-sm btn-success"
            disabled={row.original.status === 'completed'}
          >
            Hoàn thành
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-xl font-bold mb-4">Hành trình đang xử lý</h3>
      <DataTable 
        columns={columns}
        data={journeys}
        pagination={false}
      />
    </div>
  );
}