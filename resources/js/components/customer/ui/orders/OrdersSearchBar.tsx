import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';

interface OrdersSearchBarProps {
  value: string;
  onValueChange: (value: string) => void;
  onSubmit: (event?: React.FormEvent<HTMLFormElement>) => void;
  placeholder?: string;
  isLoading?: boolean;
  minLength?: number;
}

const OrdersSearchBar: React.FC<OrdersSearchBarProps> = ({ 
  value, 
  onValueChange, 
  onSubmit, 
  placeholder,
  isLoading = false,
  minLength = 2
}) => {
  const [localValue, setLocalValue] = useState(value);

  // Debounce search value
  useEffect(() => {
    const timer = setTimeout(() => {
      onValueChange(localValue);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [localValue, onValueChange]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (localValue.trim().length >= minLength) {
      onSubmit(event);
    }
  };

  // const handleClear = () => {
  //   setLocalValue('');
  // };

  const isValidSearch = localValue.trim().length >= minLength;

  return (
    <form className="orders-filters" aria-label="Search orders" onSubmit={handleSubmit}>
      <div className="orders-filter-field orders-filter-field--search">
        <Search className="orders-filter-icon" aria-hidden="true" />
        <input
          type="search"
          value={localValue}
          onChange={(event) => setLocalValue(event.target.value)}
          placeholder={placeholder ?? 'Search by order ID, shop name or product name'}
          aria-label="Search orders by ID, shop name or product name"
          disabled={isLoading}
          minLength={minLength}
        />
        {/* {localValue && (
          <button
            type="button"
            className="orders-filter-clear"
            onClick={handleClear}
            aria-label="Clear search"
            disabled={isLoading}
          >
            <X size={16} aria-hidden="true" />
          </button>
        )} */}
      </div>
      <button 
        type="submit" 
        className="orders-filter-cta orders-search-button" 
        aria-label="Search orders"
        disabled={isLoading || !isValidSearch}
      >
        <Search className="orders-filter-cta-icon" aria-hidden="true" />
        {isLoading ? 'Searching...' : 'Search'}
      </button>
    </form>
  );
};

export default OrdersSearchBar;
