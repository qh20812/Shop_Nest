import React from 'react';
import AddressCard from './AddressCard';
import { CustomerAddress } from './types';

export type AddressCardListProps = {
  addresses: CustomerAddress[];
  onEdit: (address: CustomerAddress) => void;
  onDelete: (address: CustomerAddress) => void;
  onSetDefault: (address: CustomerAddress) => void;
};

const AddressCardList: React.FC<AddressCardListProps> = ({ addresses, onEdit, onDelete, onSetDefault }) => {
  if (addresses.length === 0) {
    return null;
  }

  return (
    <div className="address-mobile-list" aria-live="polite">
      {addresses.map((address) => (
        <AddressCard
          key={address.id}
          address={address}
          onEdit={onEdit}
          onDelete={onDelete}
          onSetDefault={onSetDefault}
        />
      ))}
    </div>
  );
};

export default AddressCardList;
