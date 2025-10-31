import React from 'react';
import { Search } from 'lucide-react';

interface OrdersSearchBarProps {
  value: string;
  onValueChange: (value: string) => void;
  onSubmit: (event?: React.FormEvent<HTMLFormElement>) => void;
  placeholder?: string;
}

const OrdersSearchBar: React.FC<OrdersSearchBarProps> = ({ value, onValueChange, onSubmit, placeholder }) => {
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    onSubmit(event);
  };

  return (
    <form className="orders-filters" aria-label="Tìm kiếm đơn hàng" onSubmit={handleSubmit}>
      <div className="orders-filter-field orders-filter-field--search">
        <Search className="orders-filter-icon" aria-hidden="true" />
        <input
          type="search"
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          placeholder={placeholder ?? 'Search by order ID, shop name or product name'}
          aria-label="Search orders by ID, shop name or product name"
        />
      </div>
      <button type="submit" className="orders-filter-cta orders-search-button" aria-label="Search orders">
        <Search className="orders-filter-cta-icon" aria-hidden="true" />
        Search
      </button>
    </form>
  );
};

export default OrdersSearchBar;
