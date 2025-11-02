import React from 'react';
import { CustomerAddress } from './types';

export type AddressListProps = {
  addresses: CustomerAddress[];
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

const formatUpdatedAt = (input?: string | null) => {
  if (!input) {
    return '';
  }
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return date.toLocaleDateString('vi-VN');
};

const AddressList: React.FC<AddressListProps> = ({ addresses, onEdit, onDelete, onSetDefault }) => {
  if (addresses.length === 0) {
    return (
      <section className="address-empty-state" role="status">
        <h2 className="address-empty-title">Bạn chưa có địa chỉ giao hàng</h2>
        <p className="address-empty-description">Bấm "Thêm địa chỉ mới" để tạo địa chỉ đầu tiên của bạn.</p>
      </section>
    );
  }

  return (
    <div className="address-list">
      {addresses.map((address) => {
        const isDefault = Boolean(address.is_default);
        const recipientName = address.recipient_name ?? address.full_name ?? 'Chưa cập nhật';
        const phoneNumber = address.phone ?? address.phone_number ?? '';

        return (
          <article key={address.id} className="address-row" data-default={isDefault ? 'true' : 'false'}>
            <div className="address-info">
              <div className="address-info-heading">
                <span className="address-info-name">{recipientName}</span>
                <span className="address-info-separator" aria-hidden="true">
                  |
                </span>
                <span className="address-info-phone">{phoneNumber}</span>
              </div>
              <div className="address-info-line">{resolveAddressLine(address)}</div>
              <div className="address-info-region">{resolveDivisionName(address)}</div>
              {isDefault && <span className="address-badge">Mặc định</span>}
            </div>
            <div className="address-actions-right" role="group" aria-label="Tùy chọn địa chỉ">
              <div className="address-action-stack">
                <button type="button" className="address-action-btn" onClick={() => onEdit(address)}>
                  <i className="bi bi-pencil" aria-hidden="true" />
                  Cập nhật
                </button>
                <button
                  type="button"
                  className="address-action-btn address-action-danger"
                  onClick={() => onDelete(address)}
                  disabled={isDefault}
                  aria-disabled={isDefault}
                >
                  <i className="bi bi-trash" aria-hidden="true" />
                  Xóa
                </button>
              </div>
              {!isDefault && (
                <button type="button" className="address-action-btn address-action-secondary" onClick={() => onSetDefault(address)}>
                  <i className="bi bi-star" aria-hidden="true" />
                  Thiết lập mặc định
                </button>
              )}
              {formatUpdatedAt(address.updated_at) && (
                <div className="address-updated-at">Cập nhật: {formatUpdatedAt(address.updated_at)}</div>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default AddressList;
