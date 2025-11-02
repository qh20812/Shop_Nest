import React from 'react';

export interface OrdersTabEntry {
  key: string;
  label: string;
  count: number;
}

interface OrdersTabsProps {
  tabs: OrdersTabEntry[];
  activeTab: string;
  onTabClick: (tabKey: string) => void;
}

const OrdersTabs: React.FC<OrdersTabsProps> = ({ tabs, activeTab, onTabClick }) => (
  <nav className="orders-tabs" aria-label="Bộ lọc trạng thái đơn hàng">
    {tabs.map(({ key, label, count }) => (
      <button
        key={key}
        type="button"
        className={`orders-tab${key === activeTab ? ' is-active' : ''}`}
        aria-pressed={key === activeTab}
        onClick={() => onTabClick(key)}
      >
        <span className="orders-tab-label">{label}</span>
        <span className="orders-tab-count">{count}</span>
      </button>
    ))}
  </nav>
);

export default OrdersTabs;
