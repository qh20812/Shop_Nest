import React, { useState } from 'react';
import { useTranslation } from '../../../lib/i18n';

interface OrderFilterPanelProps {
  fromDate: string;
  toDate: string;
  onApply: (fromDate: string, toDate: string) => void;
  onReset: () => void;
}

export default function OrderFilterPanel({
  fromDate: initialFromDate,
  toDate: initialToDate,
  onApply,
  onReset
}: OrderFilterPanelProps) {
  const { t } = useTranslation();
  const [fromDate, setFromDate] = useState(initialFromDate);
  const [toDate, setToDate] = useState(initialToDate);

  const handleApply = () => {
    onApply(fromDate, toDate);
  };

  const handleReset = () => {
    setFromDate('');
    setToDate('');
    onReset();
  };

  return (
    <div style={{
      background: 'var(--light)',
      padding: '16px 24px',
      borderRadius: '20px',
      marginBottom: '24px',
      display: 'flex',
      gap: '16px',
      alignItems: 'center',
      flexWrap: 'wrap'
    }}>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <label style={{ 
          fontSize: '14px', 
          color: 'var(--dark)', 
          fontWeight: '500',
          minWidth: '60px'
        }}>
          {t('From')}:
        </label>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid var(--grey)',
            borderRadius: '6px',
            fontSize: '14px',
            background: 'var(--light)',
            color: 'var(--dark)'
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <label style={{ 
          fontSize: '14px', 
          color: 'var(--dark)', 
          fontWeight: '500',
          minWidth: '60px'
        }}>
          {t('To')}:
        </label>
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid var(--grey)',
            borderRadius: '6px',
            fontSize: '14px',
            background: 'var(--light)',
            color: 'var(--dark)'
          }}
        />
      </div>

      <button
        onClick={handleApply}
        style={{
          padding: '8px 16px',
          background: 'var(--primary)',
          color: 'var(--light)',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        <i className="bx bx-filter"></i>
        {t('Apply')}
      </button>

      <button
        onClick={handleReset}
        style={{
          padding: '8px 16px',
          background: 'var(--grey)',
          color: 'var(--dark)',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        <i className="bx bx-reset"></i>
        {t('Reset')}
      </button>
    </div>
  );
}