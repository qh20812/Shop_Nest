import React from 'react';

type TabKey = 'description' | 'specifications' | 'reviews';

interface ProductTabsProps {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
  reviewCount: number;
  children: React.ReactNode;
}

export default function ProductTabs({ activeTab, onChange, reviewCount, children }: ProductTabsProps) {
  const tabs: { key: TabKey; label: string; badge?: string }[] = [
    { key: 'description', label: 'Mô tả sản phẩm' },
    { key: 'specifications', label: 'Thông tin chi tiết' },
    { key: 'reviews', label: 'Đánh giá', badge: reviewCount > 0 ? `${reviewCount}` : undefined },
  ];

  return (
    <div className="product-tabs">
      <div className="product-tab-headers">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`product-tab-header ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => onChange(tab.key)}
          >
            <span>{tab.label}</span>
            {tab.badge && <span className="product-tab-badge">{tab.badge}</span>}
          </button>
        ))}
      </div>
      <div className="product-tab-content">{children}</div>
    </div>
  );
}
