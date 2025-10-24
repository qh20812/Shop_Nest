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
    <div className="bg-gray-50 rounded-lg p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <i className="fas fa-sticky-note text-primary"></i>
        <h3 className="text-lg font-semibold text-gray-900">
          Ghi chú đơn hàng
        </h3>
      </div>
      
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 ring-primary focus:border-transparent"
      />
    </div>
  );
};

export default CheckoutOrderNotes;
