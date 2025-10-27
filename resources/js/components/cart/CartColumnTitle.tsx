import React from 'react';

interface CartColumnTitleProps {
  isAllSelected: boolean;
  onSelectAll: (checked: boolean) => void;
}

export default function CartColumnTitle({ isAllSelected, onSelectAll }: CartColumnTitleProps) {
  return (
    <div className="bg-[var(--light-2)] rounded-lg p-4 mb-4 shadow-sm">
      <div className="grid grid-cols-[2.5fr_1fr_1.2fr_1fr_1fr] gap-4 items-center">
        <div className="flex items-center gap-3">
          <input 
            type="checkbox" 
            id="select-all-cart"
            className="w-[18px] h-[18px] accent-[var(--primary)] cursor-pointer"
            checked={isAllSelected}
            onChange={(e) => onSelectAll(e.target.checked)}
          />
          <label 
            htmlFor="select-all-cart" 
            className="font-medium text-[var(--dark)] cursor-pointer font-['Poppins',sans-serif]"
          >
            Sản phẩm
          </label>
        </div>
        <div className="font-medium text-[var(--dark)] font-['Poppins',sans-serif] text-center">
          Đơn giá
        </div>
        <div className="font-medium text-[var(--dark)] font-['Poppins',sans-serif] text-center">
          Số lượng
        </div>
        <div className="font-medium text-[var(--dark)] font-['Poppins',sans-serif] text-center">
          Thành tiền
        </div>
        <div className="font-medium text-[var(--dark)] font-['Poppins',sans-serif] text-center">
          Thao tác
        </div>
      </div>
    </div>
  );
}