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
    <div className="flex items-center border border-[var(--grey)] rounded overflow-hidden bg-white">
      <button 
        className="w-8 h-8 border-none bg-[var(--light)] text-[var(--dark)] cursor-pointer flex items-center justify-center transition-all duration-300 text-sm hover:bg-[var(--primary)] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed" 
        onClick={handleDecrease}
        disabled={value <= min}
        type="button"
      >
        <i className="bi bi-dash"></i>
      </button>
      <input 
        type="number" 
        className="w-[50px] h-8 border-none text-center text-sm font-medium bg-white text-[var(--dark)] outline-none font-['Poppins',sans-serif] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        value={value}
        onChange={handleInputChange}
        min={min}
        max={max}
      />
      <button 
        className="w-8 h-8 border-none bg-[var(--light)] text-[var(--dark)] cursor-pointer flex items-center justify-center transition-all duration-300 text-sm hover:bg-[var(--primary)] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed" 
        onClick={handleIncrease}
        disabled={value >= max}
        type="button"
      >
        <i className="bi bi-plus"></i>
      </button>
    </div>
  );
}