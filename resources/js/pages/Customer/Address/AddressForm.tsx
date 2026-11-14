import axios from 'axios';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField } from '@/components/ui/form-field';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';

export interface Division {
    id: number;
    name: string;
    code?: string;
}

export interface AddressFormValue {
    name: string;
    phone: string;
    address: string;
    province_id: string;
    ward_id: string;
    is_default: boolean;
}

type AddressFormProps = {
    value: AddressFormValue;
    onChange: (value: AddressFormValue) => void;
    provinces: Division[];
    initialWards?: Division[];
    initialProvinceId?: string;
    errors?: Record<string, string>;
    processing?: boolean;
    submitLabel?: string;
    onSubmit: (event: React.FormEvent) => void;
    onCancel: () => void;
};

export function AddressForm({
    value,
    onChange,
    provinces,
    initialWards = [],
    initialProvinceId,
    errors = {},
    processing = false,
    submitLabel = 'Lưu địa chỉ',
    onSubmit,
    onCancel,
}: AddressFormProps) {
    const [wards, setWards] = React.useState<Division[]>(initialWards);
    const [loadingWards, setLoadingWards] = React.useState(false);

    React.useEffect(() => {
        if (!value.province_id) {
            setWards([]);
            return;
        }

        if (value.province_id === initialProvinceId && initialWards.length > 0) {
            setWards(initialWards);
            return;
        }

        let active = true;
        setLoadingWards(true);

        axios
            .get(`/user/addresses/wards/${value.province_id}`)
            .then((response) => {
                if (active) {
                    setWards(response.data?.data ?? []);
                }
            })
            .catch(() => {
                if (active) {
                    setWards([]);
                }
            })
            .finally(() => {
                if (active) {
                    setLoadingWards(false);
                }
            });

        return () => {
            active = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value.province_id]);

    const update = (partial: Partial<AddressFormValue>) => onChange({ ...value, ...partial });

    const isValid = Boolean(value.name.trim() && value.phone.trim() && value.address.trim() && value.province_id && value.ward_id);

    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Tên người nhận" required error={errors.name}>
                    <Input
                        value={value.name}
                        onChange={(event) => update({ name: event.target.value })}
                        placeholder="Nguyễn Thu Hà"
                        autoComplete="name"
                        invalid={Boolean(errors.name)}
                        required
                    />
                </FormField>

                <FormField label="Số điện thoại" required error={errors.phone}>
                    <Input
                        type="tel"
                        value={value.phone}
                        onChange={(event) => update({ phone: event.target.value })}
                        placeholder="0912 345 678"
                        autoComplete="tel"
                        invalid={Boolean(errors.phone)}
                        required
                    />
                </FormField>
            </div>

            <FormField label="Địa chỉ" required error={errors.address} hint="Số nhà, tên đường, toà nhà, ghi chú giao hàng.">
                <Input
                    value={value.address}
                    onChange={(event) => update({ address: event.target.value })}
                    placeholder="Số 12, đường Nguyễn Huệ"
                    autoComplete="street-address"
                    invalid={Boolean(errors.address)}
                    required
                />
            </FormField>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Tỉnh/Thành phố" required error={errors.province_id}>
                    <Select
                        value={value.province_id}
                        onChange={(event) => update({ province_id: event.target.value, ward_id: '' })}
                        placeholder="Chọn tỉnh/thành phố"
                        options={provinces.map((province) => ({ value: String(province.id), label: province.name }))}
                        invalid={Boolean(errors.province_id)}
                        required
                    />
                </FormField>

                <FormField label="Xã/Phường" required error={errors.ward_id}>
                    <Select
                        value={value.ward_id}
                        onChange={(event) => update({ ward_id: event.target.value })}
                        placeholder={loadingWards ? 'Đang tải...' : 'Chọn xã/phường'}
                        options={wards.map((ward) => ({ value: String(ward.id), label: ward.name }))}
                        disabled={!value.province_id || loadingWards}
                        invalid={Boolean(errors.ward_id)}
                        required
                    />
                </FormField>
            </div>

            <Checkbox
                checked={value.is_default}
                onCheckedChange={(checked) => update({ is_default: checked === true })}
                label="Đặt làm địa chỉ mặc định"
                description="ShopNest sẽ dùng địa chỉ này cho lần thanh toán tiếp theo."
            />

            <div className="flex flex-col-reverse gap-2 border-t border-border pt-5 sm:flex-row sm:justify-end">
                <Button type="button" variant="secondary" onClick={onCancel} disabled={processing}>
                    Huỷ
                </Button>
                <Button type="submit" loading={processing} disabled={!isValid}>
                    {submitLabel}
                </Button>
            </div>
        </form>
    );
}

export default AddressForm;
