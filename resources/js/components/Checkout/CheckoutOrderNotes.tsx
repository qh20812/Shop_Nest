import React from 'react';

interface CheckoutOrderNotesProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const CheckoutOrderNotes: React.FC<CheckoutOrderNotesProps> = ({
  value,
  onChange,
  placeholder = 'Thêm ghi chú cho đơn hàng (ví dụ: hướng dẫn giao hàng)',
}) => {
  return (
    <div className="checkout-section checkout-notes">
      <div className="checkout-section__header">
        <i className="checkout-section__icon fas fa-sticky-note" aria-hidden="true"></i>
        <h3 className="checkout-section__title">
          Ghi chú đơn hàng
        </h3>
      </div>
      
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="checkout-textarea checkout-notes__textarea"
      />
    </div>
  );
};

export default CheckoutOrderNotes;
