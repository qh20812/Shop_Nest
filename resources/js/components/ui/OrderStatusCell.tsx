import React from 'react';
import StatusBadge from './StatusBadge';

interface OrderStatusCellProps {
  status: string;
  type: 'order' | 'payment';
}

export default function OrderStatusCell({ status, type }: OrderStatusCellProps) {
  return (
    <div style={{
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '4px 0'
    }}>
      <div 
        style={{
          width: '100%',
          minWidth: '100px',
          maxWidth: '140px',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <div style={{
          display: 'inline-block',
          width: '100%',
          textAlign: 'center'
        }}>
          <StatusBadge status={status} type={type} />
        </div>
      </div>
    </div>
  );
}