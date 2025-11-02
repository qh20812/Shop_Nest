import React from 'react';
import { CustomerAddress } from './types';

export type AddressCardProps = {
  address: CustomerAddress;
  onEdit: (address: CustomerAddress) => void;
  onDelete: (address: CustomerAddress) => void;
  onSetDefault: (address: CustomerAddress) => void;
};

const resolveDivisionName = (address: CustomerAddress) => {
  const provinceName = address.province?.name ?? address.province_name ?? null;
  const districtName = address.district?.name ?? address.district_name ?? null;
  const wardName = address.ward?.name ?? address.ward_name ?? null;
  const fallback = [wardName, districtName, provinceName].filter(Boolean).join(', ');
  return fallback || [address.ward_id, address.district_id, address.province_id].filter(Boolean).join(' - ');
};

const resolveAddressLine = (address: CustomerAddress) =>
  address.address_line ?? address.street_address ?? '';

const AddressCard: React.FC<AddressCardProps> = ({ address, onEdit, onDelete, onSetDefault }) => {
  const isDefault = Boolean(address.is_default);
  const recipientName = address.recipient_name ?? address.full_name ?? 'Chưa cập nhật';
  const phoneNumber = address.phone ?? address.phone_number ?? '';

  return (
    <article className="address-card">
      <header className="address-card-header">
        <div className="address-card-recipient">
          <span className="address-card-name">{recipientName}</span>
          <span className="address-card-phone">{phoneNumber}</span>
        </div>
        {isDefault && <span className="address-badge">Mặc định</span>}
      </header>
      <div className="address-card-body">
        <span>{resolveAddressLine(address)}</span>
        <span>{resolveDivisionName(address)}</span>
      </div>
      <footer className="address-card-footer">
        {address.updated_at && <div className="address-supporting-text">Cập nhật: {new Date(address.updated_at).toLocaleDateString('vi-VN')}</div>}
        <div className="address-card-actions">
          <button type="button" className="address-action-btn" onClick={() => onEdit(address)}>
            <i className="bi bi-pencil" aria-hidden="true" />
            Sửa
          </button>
          {!isDefault && (
            <button type="button" className="address-action-btn" onClick={() => onSetDefault(address)}>
              <i className="bi bi-star" aria-hidden="true" />
              Đặt mặc định
            </button>
          )}
          <button type="button" className="address-action-btn address-action-danger" onClick={() => onDelete(address)}>
            <i className="bi bi-trash" aria-hidden="true" />
            Xóa
          </button>
        </div>
      </footer>
    </article>
  );
};

export default AddressCard;
