import { Head, router, usePage } from '@inertiajs/react';
import * as React from 'react';

import { AccountLayout } from '@/components/layout/AccountLayout';
import { Card } from '@/components/ui/card';

import { AddressForm, type AddressFormValue, type Division } from './AddressForm';

interface AddressModel {
    id: number;
    name: string;
    phone: string;
    address: string;
    province_id: number | string;
    ward_id: number | string;
    country?: string;
    is_default: boolean;
}

interface PageProps extends Record<string, unknown> {
    address: AddressModel;
    provinces?: Division[];
    wards?: Division[];
    errors?: Record<string, string>;
}

export default function AddressEdit() {
    const { address, provinces = [], wards = [], errors = {} } = usePage<PageProps>().props;
    const [value, setValue] = React.useState<AddressFormValue>({
        name: address.name ?? '',
        phone: address.phone ?? '',
        address: address.address ?? '',
        province_id: address.province_id ? String(address.province_id) : '',
        ward_id: address.ward_id ? String(address.ward_id) : '',
        is_default: address.is_default ?? false,
    });
    const [processing, setProcessing] = React.useState(false);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setProcessing(true);

        router.put(
            `/user/addresses/${address.id}`,
            {
                name: value.name,
                phone: value.phone,
                address: value.address,
                province_id: value.province_id,
                ward_id: value.ward_id,
                country: address.country ?? 'Việt Nam',
                is_default: value.is_default,
            },
            {
                preserveScroll: true,
                onFinish: () => setProcessing(false),
            },
        );
    };

    return (
        <AccountLayout
            active="addresses"
            breadcrumbs={[{ label: 'Chợ', href: '/' }, { label: 'Địa chỉ', href: '/user/addresses' }, { label: 'Chỉnh sửa' }]}
            eyebrow="Sổ địa chỉ"
            title="Sửa địa chỉ giao hàng"
            description="Cập nhật thông tin người nhận hoặc địa chỉ để đơn hàng tới đúng nơi."
        >
            <Head title="Sửa địa chỉ" />

            <Card padding="lg" className="max-w-3xl">
                <AddressForm
                    value={value}
                    onChange={setValue}
                    provinces={provinces}
                    initialWards={wards}
                    initialProvinceId={address.province_id ? String(address.province_id) : undefined}
                    errors={errors}
                    processing={processing}
                    submitLabel="Lưu thay đổi"
                    onSubmit={handleSubmit}
                    onCancel={() => router.visit('/user/addresses')}
                />
            </Card>
        </AccountLayout>
    );
}
