import React, { useMemo, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import CustomerLayout from '@/layouts/app/CustomerLayout';
import AddressList from '@/Components/customer/ui/addresses/AddressList';
import AddressCardList from '@/Components/customer/ui/addresses/AddressCardList';
import AddressModal from '@/Components/customer/ui/addresses/AddressModal';
import AddressDialog from '@/Components/customer/ui/addresses/AddressDialog';
import { AddressFormData, CustomerAddress } from '@/Components/customer/ui/addresses/types';

type PageProps = {
  addresses: CustomerAddress[];
};

const INITIAL_FORM: AddressFormData = {
  country_id: '',
  recipient_name: '',
  phone: '',
  address_line: '',
  province_id: '',
  district_id: '',
  ward_id: '',
  postal_code: '',
  is_default: false,
};

const resolveAddressLine = (address: CustomerAddress) => address.address_line ?? address.street_address ?? '';

const normalizeAddress = (address: CustomerAddress): CustomerAddress => ({
  ...address,
  country_id: address.country_id ?? null,
  recipient_name: address.recipient_name ?? address.full_name ?? '',
  phone: address.phone ?? address.phone_number ?? '',
  address_line: resolveAddressLine(address),
});

const AddressPage: React.FC = () => {
  const { props } = usePage<PageProps>();
  const addresses = useMemo(() => (props.addresses ?? []).map(normalizeAddress), [props.addresses]);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('Thêm địa chỉ mới');
  const [editingAddress, setEditingAddress] = useState<CustomerAddress | null>(null);
  const [formData, setFormData] = useState<AddressFormData>(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof AddressFormData | 'general', string>>>({});
  const [formLoading, setFormLoading] = useState(false);

  const [dialogState, setDialogState] = useState<{ open: boolean; type: 'delete' | 'default'; address: CustomerAddress | null }>(
    { open: false, type: 'delete', address: null }
  );
  const [dialogLoading, setDialogLoading] = useState(false);

  const resetForm = () => {
    setFormData({ ...INITIAL_FORM });
    setFormErrors({});
    setEditingAddress(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setModalTitle('Thêm địa chỉ mới');
    setModalOpen(true);
  };

  const handleOpenEdit = (address: CustomerAddress) => {
    setEditingAddress(address);
    setModalTitle('Cập nhật địa chỉ');
    setFormErrors({});
    setFormData({
      country_id: address.country_id ?? '',
      recipient_name: address.recipient_name ?? address.full_name ?? '',
      phone: address.phone ?? address.phone_number ?? '',
      address_line: resolveAddressLine(address),
      province_id: address.province_id ?? '',
      district_id: address.district_id ?? '',
      ward_id: address.ward_id ?? '',
      postal_code: address.postal_code ?? '',
      is_default: Boolean(address.is_default),
    });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setFormLoading(false);
    resetForm();
  };

  const handleFieldChange = <K extends keyof AddressFormData>(field: K, value: AddressFormData[K]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setFormErrors((prev) => {
      if (!(field in prev)) {
        return prev;
      }
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const normalizeErrors = (incoming: Record<string, string | string[]>) => {
    const next: Partial<Record<keyof AddressFormData | 'general', string>> = {};
    const fieldMap: Record<string, keyof AddressFormData | 'general'> = {
      country_id: 'country_id',
      recipient_name: 'recipient_name',
      full_name: 'recipient_name',
      phone: 'phone',
      phone_number: 'phone',
      address_line: 'address_line',
      street_address: 'address_line',
      province_id: 'province_id',
      district_id: 'district_id',
      ward_id: 'ward_id',
      postal_code: 'postal_code',
      is_default: 'is_default',
    };
    Object.entries(incoming).forEach(([key, value]) => {
      const message = Array.isArray(value) ? value[0] : value;
      const mappedKey = fieldMap[key] ?? 'general';
      if (mappedKey === 'general') {
        next.general = message;
        return;
      }
      next[mappedKey] = message;
    });
    setFormErrors(next);
  };

  const buildPayload = () => {
    const toNumber = (input: number | ''): number | null => (input === '' ? null : Number(input));
    return {
      country_id: toNumber(formData.country_id),
      full_name: formData.recipient_name,
      phone_number: formData.phone,
      street_address: formData.address_line,
      province_id: toNumber(formData.province_id),
      district_id: toNumber(formData.district_id),
      ward_id: toNumber(formData.ward_id),
      postal_code: formData.postal_code || null,
      is_default: formData.is_default,
    };
  };

  const handleSubmit = () => {
    setFormLoading(true);
    setFormErrors({});

    console.log('Submitting address form data:', formData);
    const payload = buildPayload();
    console.log('Submitting address payload:', payload);

    const options = {
      preserveScroll: true,
      onError: (errorBag: Record<string, string | string[]>) => {
        setFormLoading(false);
        normalizeErrors(errorBag);
      },
      onSuccess: () => {
        setFormLoading(false);
        handleCloseModal();
      },
      onFinish: () => {
        setFormLoading(false);
      },
    } as const;

    if (editingAddress) {
      router.put(route('user.addresses.update', editingAddress.id), payload, options);
    } else {
      router.post(route('user.addresses.store'), payload, options);
    }
  };

  const handleDeleteRequest = (address: CustomerAddress) => {
    setDialogState({ open: true, type: 'delete', address });
    setDialogLoading(false);
  };

  const handleSetDefaultRequest = (address: CustomerAddress) => {
    setDialogState({ open: true, type: 'default', address });
    setDialogLoading(false);
  };

  const closeDialog = () => {
    setDialogState({ open: false, type: 'delete', address: null });
    setDialogLoading(false);
  };

  const handleDialogConfirm = () => {
    if (!dialogState.address) {
      return;
    }

    setDialogLoading(true);

    if (dialogState.type === 'delete') {
      router.delete(route('user.addresses.destroy', dialogState.address.id), {
        preserveScroll: true,
        onError: (errorBag: Record<string, string | string[]>) => {
          normalizeErrors(errorBag);
          setDialogLoading(false);
        },
        onSuccess: () => {
          closeDialog();
        },
        onFinish: () => {
          setDialogLoading(false);
        },
      });
      return;
    }

    router.patch(route('user.addresses.set-default', dialogState.address.id), {}, {
      preserveScroll: true,
      onError: (errorBag: Record<string, string | string[]>) => {
        normalizeErrors(errorBag);
        setDialogLoading(false);
      },
      onSuccess: () => {
        closeDialog();
      },
      onFinish: () => {
        setDialogLoading(false);
      },
    });
  };

  return (
    <CustomerLayout>
      <section className="orders-page address-page" aria-labelledby="address-heading">
        <header className="address-header">
          <div className="address-header-info">
            <h1 id="address-heading" className="address-header-title">
              Địa chỉ giao hàng
            </h1>
            <p className="address-header-subtitle">
              Quản lý các địa chỉ nhận hàng để quá trình mua sắm diễn ra nhanh chóng và chính xác.
            </p>
          </div>
          <div className="address-header-actions">
            <button type="button" className="address-add-btn" aria-haspopup="dialog" onClick={handleOpenCreate}>
              <i className="bi bi-plus-circle" aria-hidden="true" />
              Thêm địa chỉ mới
            </button>
          </div>
        </header>

        <section className="address-section" aria-labelledby="address-stored-heading">
          <div className="address-section-heading">
            <h2 id="address-stored-heading" className="address-section-title">
              Danh sách địa chỉ
            </h2>
            <span className="address-section-hint">Tối đa 5 địa chỉ cho mỗi tài khoản.</span>
          </div>

          <div className="address-table-wrapper" role="region" aria-live="polite">
            <AddressList
              addresses={addresses}
              onEdit={handleOpenEdit}
              onDelete={handleDeleteRequest}
              onSetDefault={handleSetDefaultRequest}
            />
          </div>

          <AddressCardList
            addresses={addresses}
            onEdit={handleOpenEdit}
            onDelete={handleDeleteRequest}
            onSetDefault={handleSetDefaultRequest}
          />
        </section>

        <AddressModal
          isOpen={modalOpen}
          title={modalTitle}
          formData={formData}
          errors={formErrors}
          loading={formLoading}
          onChange={handleFieldChange}
          onSubmit={handleSubmit}
          onClose={handleCloseModal}
        />

        <AddressDialog
          isOpen={dialogState.open}
          title={dialogState.type === 'delete' ? 'Xóa địa chỉ giao hàng?' : 'Thiết lập địa chỉ mặc định?'}
          description={
            dialogState.type === 'delete'
              ? 'Địa chỉ mặc định sẽ được chuyển sang địa chỉ còn lại gần nhất nếu có. Bạn có chắc chắn muốn tiếp tục?'
              : 'Địa chỉ này sẽ được dùng mặc định cho các đơn hàng kế tiếp.'
          }
          confirmLabel={dialogState.type === 'delete' ? 'Xác nhận xóa' : 'Thiết lập'}
          confirmTone={dialogState.type === 'delete' ? 'danger' : 'primary'}
          loading={dialogLoading}
          onConfirm={handleDialogConfirm}
          onCancel={closeDialog}
        />
      </section>
    </CustomerLayout>
  );
};

export default AddressPage;
