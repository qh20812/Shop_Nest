import React from 'react';
import { useTranslation } from '../../../lib/i18n';

interface OrderSummaryCardsProps {
  orderSummary: {
    totalCount: number;
    pendingCount: number;
    completedCount: number;
    cancelledCount: number;
  };
}

export default function OrderSummaryCards({ orderSummary }: OrderSummaryCardsProps) {
  const { t } = useTranslation();

  const cards = [
    {
      icon: 'bx-receipt',
      title: t('Total Orders'),
      value: orderSummary.totalCount,
      color: 'var(--light-primary)',
      iconColor: 'var(--primary)'
    },
    {
      icon: 'bx-time',
      title: t('Pending Orders'),
      value: orderSummary.pendingCount,
      color: 'var(--light-warning)',
      iconColor: 'var(--warning)'
    },
    {
      icon: 'bx-check-circle',
      title: t('Completed Orders'),
      value: orderSummary.completedCount,
      color: 'var(--light-success)',
      iconColor: 'var(--success)'
    },
    {
      icon: 'bx-x-circle',
      title: t('Cancelled Orders'),
      value: orderSummary.cancelledCount,
      color: 'var(--light-danger)',
      iconColor: 'var(--danger)'
    }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
      marginBottom: '24px'
    }}>
      {cards.map((card, index) => (
        <div
          key={index}
          style={{
            background: 'var(--light)',
            padding: '20px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}
        >
          <div style={{
            width: '50px',
            height: '50px',
            background: card.color,
            color: card.iconColor,
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <i className={`bx ${card.icon}`}></i>
          </div>
          <div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: 'var(--dark)',
              margin: '0 0 4px 0'
            }}>
              {card.value.toLocaleString()}
            </h3>
            <p style={{
              fontSize: '14px',
              color: 'var(--dark-grey)',
              margin: '0'
            }}>
              {card.title}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
