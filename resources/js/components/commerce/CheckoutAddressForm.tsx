import axios from 'axios';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField } from '@/components/ui/form-field';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';

import styles from './commerce.module.css';

interface AddressOption {
    id: number;
    name: string;
    code: string;
}

export interface NewAddress {
    name: string;
    phone: string;
    address: string;
    province_id: string;
    ward_id: string;
    is_default: boolean;
}

interface CheckoutAddressFormProps {
    onSubmit: (address: NewAddress) => Promise<void>;
    onCancel: () => void;
}

export default function CheckoutAddressForm({ onSubmit, onCancel }: CheckoutAddressFormProps) {
    const [formData, setFormData] = React.useState<NewAddress>({
        name: '',
        phone: '',
        address: '',
        province_id: '',
        ward_id: '',
        is_default: false,
    });
    const [provinces, setProvinces] = React.useState<AddressOption[]>([]);
    const [wards, setWards] = React.useState<AddressOption[]>([]);
    const [loadingProvinces, setLoadingProvinces] = React.useState(false);
    const [loadingWards, setLoadingWards] = React.useState(false);
    const [submitting, setSubmitting] = React.useState(false);

    React.useEffect(() => {
        const loadProvinces = async () => {
            setLoadingProvinces(true);
            try {
                const response = await axios.get('/user/addresses/provinces');
                setProvinces(response.data?.data ?? []);
            } catch {
                // Keep the form usable; the user can retry by reopening.
            } finally {
                setLoadingProvinces(false);
            }
        };

        loadProvinces();
    }, []);

    const loadWards = async (provinceId: string) => {
        if (!provinceId) {
            setWards([]);
            return;
        }

        setLoadingWards(true);
        try {
            const response = await axios.get(`/user/addresses/wards/${provinceId}`);
            setWards(response.data?.data ?? []);
        } catch {
            setWards([]);
        } finally {
            setLoadingWards(false);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setSubmitting(true);

        try {
            await onSubmit(formData);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.addressForm}>
            <div className={styles.addressFormGrid}>
                <FormField label="Họ và tên" required>
                    <Input
                        value={formData.name}
                        onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
                        placeholder="Nguyễn Thu Hà"
                        autoComplete="name"
                        required
                    />
                </FormField>
                <FormField label="Số điện thoại" required>
                    <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(event) => setFormData((current) => ({ ...current, phone: event.target.value }))}
                        placeholder="0912 345 678"
                        autoComplete="tel"
                        required
                    />
                </FormField>
            </div>

            <FormField label="Địa chỉ" required hint="Số nhà, tên đường, toà nhà, ghi chú giao hàng.">
                <Input
                    value={formData.address}
                    onChange={(event) => setFormData((current) => ({ ...current, address: event.target.value }))}
                    placeholder="Số nhà, tên đường"
                    autoComplete="street-address"
                    required
                />
            </FormField>

            <div className={styles.addressFormGrid}>
                <FormField label="Tỉnh/Thành phố" required>
                    <Select
                        value={formData.province_id}
                        onChange={(event) => {
                            const provinceId = event.target.value;
                            setFormData((current) => ({ ...current, province_id: provinceId, ward_id: '' }));
                            setWards([]);
                            loadWards(provinceId);
                        }}
                        placeholder={loadingProvinces ? 'Đang tải...' : 'Chọn tỉnh/thành phố'}
                        options={provinces.map((province) => ({ value: String(province.id), label: province.name }))}
                        disabled={loadingProvinces}
                        required
                    />
                </FormField>
                <FormField label="Phường/Xã" required>
                    <Select
                        value={formData.ward_id}
                        onChange={(event) => setFormData((current) => ({ ...current, ward_id: event.target.value }))}
                        placeholder={loadingWards ? 'Đang tải...' : 'Chọn phường/xã'}
                        options={wards.map((ward) => ({ value: String(ward.id), label: ward.name }))}
                        disabled={!formData.province_id || loadingWards}
                        required
                    />
                </FormField>
            </div>

            <Checkbox
                checked={formData.is_default}
                onCheckedChange={(checked) => setFormData((current) => ({ ...current, is_default: checked === true }))}
                label="Đặt làm địa chỉ mặc định"
            />

            <div className={styles.addressFormActions}>
                <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
                    Huỷ
                </Button>
                <Button type="submit" loading={submitting}>
                    Lưu địa chỉ
                </Button>
            </div>
        </form>
    );
}
