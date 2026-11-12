import React from 'react';

interface QuantitySelectorProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
}

export default function QuantitySelector({ value, onChange, min = 1, max = 999 }: QuantitySelectorProps) {
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
        <div className="flex items-center overflow-hidden rounded border border-[var(--grey)] bg-white">
            <button
                className="flex h-8 w-8 cursor-pointer items-center justify-center border-none bg-[var(--light)] text-sm text-[var(--dark)] transition-all duration-300 hover:bg-[var(--primary)] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                onClick={handleDecrease}
                disabled={value <= min}
                type="button"
            >
                <i className="bi bi-dash"></i>
            </button>
            <input
                type="number"
                className="h-8 w-[50px] [appearance:textfield] border-none bg-white text-center font-['Poppins',sans-serif] text-sm font-medium text-[var(--dark)] outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                value={value}
                onChange={handleInputChange}
                min={min}
                max={max}
            />
            <button
                className="flex h-8 w-8 cursor-pointer items-center justify-center border-none bg-[var(--light)] text-sm text-[var(--dark)] transition-all duration-300 hover:bg-[var(--primary)] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                onClick={handleIncrease}
                disabled={value >= max}
                type="button"
            >
                <i className="bi bi-plus"></i>
            </button>
        </div>
    );
}
