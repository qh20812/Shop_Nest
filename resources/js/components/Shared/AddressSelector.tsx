import React from 'react';

interface Address {
  id: number;
  name: string;
  phone: string;
  address: string;
  province: string;
  district: string;
  ward: string;
  is_default: boolean;
}

interface AddressSelectorProps {
  addresses: Address[];
  selectedId: number;
  onSelect: (id: number) => void;
  onAddNew?: () => void;
}

const AddressSelector: React.FC<AddressSelectorProps> = ({
  addresses,
  selectedId,
  onSelect,
  onAddNew,
}) => {
  return (
    <div className="space-y-3">
      {addresses.map((address) => (
        <div
          key={address.id}
          onClick={() => onSelect(address.id)}
          className={`p-4 bg-white border-2 rounded-lg cursor-pointer transition-all duration-300 ${
            selectedId === address.id
              ? 'border-primary bg-primary-light'
              : 'border-gray-200 hover:border-primary'
          }`}
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            <input
              type="radio"
              checked={selectedId === address.id}
              onChange={() => onSelect(address.id)}
              className="w-5 h-5 cursor-pointer accent-primary"
            />
            <span className="text-[15px] font-semibold text-gray-900">
              {address.name}
            </span>
            {address.is_default && (
              <span className="px-2 py-0.5 btn-primary text-[11px] rounded">
                Mặc định
              </span>
            )}
            <span className="ml-auto text-sm text-gray-500">
              {address.phone}
            </span>
          </div>
          
          {/* Address Detail */}
          <p className="text-sm text-gray-600 leading-relaxed ml-8">
            {address.address}, {address.ward}, {address.district},{' '}
            {address.province}
          </p>
        </div>
      ))}

      {/* Add New Address Button */}
      {onAddNew && (
        <button
          onClick={onAddNew}
          className="w-full p-3 bg-white border-2 border-dashed border-primary rounded-lg text-primary text-sm font-medium hover:bg-primary-light transition-colors duration-200"
        >
          <i className="fas fa-plus mr-2"></i>
          Thêm địa chỉ mới
        </button>
      )}
    </div>
  );
};

export default AddressSelector;
