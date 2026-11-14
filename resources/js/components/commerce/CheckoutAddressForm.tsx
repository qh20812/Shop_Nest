import axios from 'axios';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField } from '@/components/ui/form-field';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';

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
    district_id: string;
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
        district_id: '',
        ward_id: '',
        is_default: false,
    });
    const [provinces, setProvinces] = React.useState<AddressOption[]>([]);
    const [districts, setDistricts] = React.useState<AddressOption[]>([]);
    const [wards, setWards] = React.useState<AddressOption[]>([]);
    const [loadingProvinces, setLoadingProvinces] = React.useState(false);
    const [loadingDistricts, setLoadingDistricts] = React.useState(false);
    const [loadingWards, setLoadingWards] = React.useState(false);
    const [submitting, setSubmitting] = React.useState(false);

    React.useEffect(() => {
        const loadProvinces = async () => {
            setLoadingProvinces(true);
            try {
                const response = await axios.get('/addresses/provinces');
                if (response.data?.success) {
                    setProvinces(response.data.data);
                }
            } catch {
                // Keep the form usable; the user can retry by reopening.
            } finally {
                setLoadingProvinces(false);
            }
        };

        loadProvinces();
    }, []);

    const loadDistricts = async (provinceId: string) => {
        if (!provinceId) {
            setDistricts([]);
            return;
        }

        setLoadingDistricts(true);
        try {
            const response = await axios.get(`/addresses/districts/${provinceId}`);
            if (response.data?.success) {
                setDistricts(response.data.data);
            }
        } catch {
            setDistricts([]);
        } finally {
            setLoadingDistricts(false);
        }
    };

    const loadWards = async (districtId: string) => {
        if (!districtId) {
            setWards([]);
            return;
        }

        setLoadingWards(true);
        try {
            const response = await axios.get(`/addresses/wards/${districtId}`);
            if (response.data?.success) {
                setWards(response.data.data);
            }
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
        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Họ và tên" required>
                    <Input
                        value={formData.name}
                        onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
                        placeholder="Nguyễn Thu Hà"
                        required
                    />
                </FormField>
                <FormField label="Số điện thoại" required>
                    <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(event) => setFormData((current) => ({ ...current, phone: event.target.value }))}
                        placeholder="0912 345 678"
                        required
                    />
                </FormField>
            </div>

            <FormField label="Địa chỉ" required>
                <Input
                    value={formData.address}
                    onChange={(event) => setFormData((current) => ({ ...current, address: event.target.value }))}
                    placeholder="Số nhà, tên đường"
                    required
                />
            </FormField>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <FormField label="Tỉnh/Thành phố" required>
                    <Select
                        value={formData.province_id}
                        onChange={(event) => {
                            const provinceId = event.target.value;
                            setFormData((current) => ({ ...current, province_id: provinceId, district_id: '', ward_id: '' }));
                            setDistricts([]);
                            setWards([]);
                            loadDistricts(provinceId);
                        }}
                        placeholder={loadingProvinces ? 'Đang tải...' : 'Chọn tỉnh/thành phố'}
                        options={provinces.map((province) => ({ value: String(province.id), label: province.name }))}
                        disabled={loadingProvinces}
                        required
                    />
                </FormField>
                <FormField label="Quận/Huyện" required>
                    <Select
                        value={formData.district_id}
                        onChange={(event) => {
                            const districtId = event.target.value;
                            setFormData((current) => ({ ...current, district_id: districtId, ward_id: '' }));
                            setWards([]);
                            loadWards(districtId);
                        }}
                        placeholder={loadingDistricts ? 'Đang tải...' : 'Chọn quận/huyện'}
                        options={districts.map((district) => ({ value: String(district.id), label: district.name }))}
                        disabled={!formData.province_id || loadingDistricts}
                        required
                    />
                </FormField>
                <FormField label="Phường/Xã" required>
                    <Select
                        value={formData.ward_id}
                        onChange={(event) => setFormData((current) => ({ ...current, ward_id: event.target.value }))}
                        placeholder={loadingWards ? 'Đang tải...' : 'Chọn phường/xã'}
                        options={wards.map((ward) => ({ value: String(ward.id), label: ward.name }))}
                        disabled={!formData.district_id || loadingWards}
                        required
                    />
                </FormField>
            </div>

            <Checkbox
                checked={formData.is_default}
                onCheckedChange={(checked) => setFormData((current) => ({ ...current, is_default: checked === true }))}
                label="Đặt làm địa chỉ mặc định"
            />

            <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
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
