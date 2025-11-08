import React from 'react';
import Avatar from '@/components/ui/Avatar';
import StatusBadge from '@/components/ui/StatusBadge';

interface ShipperProfileProps {
  name: string;
  avatarUrl: string | null;
  status: string;
}

export default function ShipperProfile({ name, avatarUrl, status }: ShipperProfileProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6 flex items-center gap-4">
      <Avatar src={avatarUrl} alt={name} size={64} />
      <div>
        <h2 className="text-xl font-bold">{name}</h2>
        <StatusBadge status={status} />
      </div>
    </div>
  );
}