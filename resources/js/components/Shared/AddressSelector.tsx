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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
      {addresses.map((address) => (
        <div
          key={address.id}
          onClick={() => onSelect(address.id)}
          style={{
            padding: 'var(--spacing-md)',
            background: 'var(--surface)',
            border: selectedId === address.id ? '2px solid var(--primary)' : '2px solid var(--border-color)',
            borderRadius: 'var(--border-radius-md)',
            cursor: 'pointer',
            transition: 'all var(--transition-normal)',
            backgroundColor: selectedId === address.id ? 'var(--light-primary)' : 'var(--surface)'
          }}
          onMouseEnter={(e) => {
            if (selectedId !== address.id) {
              e.currentTarget.style.borderColor = 'var(--primary)';
            }
          }}
          onMouseLeave={(e) => {
            if (selectedId !== address.id) {
              e.currentTarget.style.borderColor = 'var(--border-color)';
            }
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-xs)' }}>
            <input
              type="radio"
              checked={selectedId === address.id}
              onChange={() => onSelect(address.id)}
              style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--primary)' }}
            />
            <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
              {address.name}
            </span>
            {address.is_default && (
              <span className="checkout-button checkout-button--primary" style={{ padding: '2px 8px', fontSize: '11px', minHeight: 'auto' }}>
                Mặc định
              </span>
            )}
            <span style={{ marginLeft: 'auto', fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
              {address.phone}
            </span>
          </div>
          
          {/* Address Detail */}
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', lineHeight: 'var(--line-height-normal)', marginLeft: '28px', margin: 0 }}>
            {address.address}, {address.ward}, {address.district},{' '}
            {address.province}
          </p>
        </div>
      ))}

      {/* Add New Address Button */}
      {onAddNew && (
        <button
          onClick={onAddNew}
          className="checkout-button checkout-button--secondary"
          style={{ width: '100%', padding: 'var(--spacing-sm)', border: '2px dashed var(--primary)', color: 'var(--primary)', fontSize: 'var(--font-size-sm)' }}
        >
          <i className="fas fa-plus" style={{ marginRight: 'var(--spacing-xs)' }}></i>
          Thêm địa chỉ mới
        </button>
      )}
    </div>
  );
};

export default AddressSelector;
