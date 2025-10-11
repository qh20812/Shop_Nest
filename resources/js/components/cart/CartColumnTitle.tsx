import React from 'react';

interface CartColumnTitleProps {
  isAllSelected: boolean;
  onSelectAll: (checked: boolean) => void;
}

export default function CartColumnTitle({ isAllSelected, onSelectAll }: CartColumnTitleProps) {
  return (
    <div className="cart-column-title">
      <div className="cart-column-header">
        <div className="cart-column-checkbox">
          <input 
            type="checkbox" 
            id="select-all-cart"
            className="cart-checkbox"
            checked={isAllSelected}
            onChange={(e) => onSelectAll(e.target.checked)}
          />
          <label htmlFor="select-all-cart" className="cart-checkbox-label">
            Sản phẩm
          </label>
        </div>
        <div className="cart-column-item">Đơn giá</div>
        <div className="cart-column-item">Số lượng</div>
        <div className="cart-column-item">Thành tiền</div>
        <div className="cart-column-item">Thao tác</div>
      </div>
    </div>
  );
}