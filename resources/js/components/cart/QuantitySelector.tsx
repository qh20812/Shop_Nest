import React from 'react';

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export default function QuantitySelector({ 
  value, 
  onChange, 
  min = 1, 
  max = 999 
}: QuantitySelectorProps) {
  const handleDecrease = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrease = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };

  return (
    <div className="quantity-selector">
      <button 
        className="quantity-btn quantity-decrease" 
        onClick={handleDecrease}
        disabled={value <= min}
        type="button"
      >
        <i className="bi bi-dash"></i>
      </button>
      <input 
        type="number" 
        className="quantity-input"
        value={value}
        onChange={handleInputChange}
        min={min}
        max={max}
      />
      <button 
        className="quantity-btn quantity-increase" 
        onClick={handleIncrease}
        disabled={value >= max}
        type="button"
      >
        <i className="bi bi-plus"></i>
      </button>
    </div>
  );
}