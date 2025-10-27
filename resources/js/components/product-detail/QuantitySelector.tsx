import React from 'react';

interface QuantitySelectorProps {
  quantity: number;
  max?: number;
  min?: number;
  disabled?: boolean;
  onChange: (value: number) => void;
}

export default function QuantitySelector({
  quantity,
  max = Number.MAX_SAFE_INTEGER,
  min = 1,
  disabled = false,
  onChange,
}: QuantitySelectorProps) {
  const handleDecrease = () => {
    if (disabled) return;
    const next = Math.max(min, quantity - 1);
    onChange(next);
  };

  const handleIncrease = () => {
    if (disabled) return;
    const next = Math.min(max, quantity + 1);
    onChange(next);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const value = Number(event.target.value);
    if (Number.isNaN(value)) {
      return;
    }
    const next = Math.max(min, Math.min(max, value));
    onChange(next);
  };

  return (
    <div className="product-quantity-row">
      <span className="quantity-label">Số lượng</span>
      <div className="quantity-selector">
        <button
          type="button"
          className="quantity-btn"
          onClick={handleDecrease}
          disabled={disabled || quantity <= min}
        >
          -
        </button>
        <input
          type="number"
          className="quantity-input"
          min={min}
          max={max}
          value={quantity}
          onChange={handleInputChange}
          disabled={disabled}
        />
        <button
          type="button"
          className="quantity-btn"
          onClick={handleIncrease}
          disabled={disabled || quantity >= max}
        >
          +
        </button>
      </div>
    </div>
  );
}
