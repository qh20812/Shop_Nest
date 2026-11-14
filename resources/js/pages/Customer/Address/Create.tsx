import { Head, router, usePage } from '@inertiajs/react';
import * as React from 'react';

import { AccountLayout } from '@/components/layout/AccountLayout';
import { Card } from '@/components/ui/card';

import { AddressForm, type AddressFormValue, type Division } from './AddressForm';

interface PageProps extends Record<string, unknown> {
    provinces?: Division[];
    errors?: Record<string, string>;
}

const emptyAddress: AddressFormValue = {
    name: '',
    phone: '',
    address: '',
    province_id: '',
    ward_id: '',
    is_default: false,
};

export default function AddressCreate() {
    const { provinces = [], errors = {} } = usePage<PageProps>().props;
    const [value, setValue] = React.useState<AddressFormValue>(emptyAddress);
    const [processing, setProcessing] = React.useState(false);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setProcessing(true);

        router.post(
            '/user/addresses',
            {
                name: value.name,
                phone: value.phone,
                address: value.address,
                province_id: value.province_id,
                ward_id: value.ward_id,
                country: 'Việt Nam',
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
            breadcrumbs={[{ label: 'Chợ', href: '/' }, { label: 'Địa chỉ', href: '/user/addresses' }, { label: 'Thêm mới' }]}
            eyebrow="Sổ địa chỉ"
            title="Thêm địa chỉ giao hàng"
            description="Địa chỉ rõ ràng giúp đơn hàng tới đúng nơi và đúng hẹn."
        >
            <Head title="Thêm địa chỉ" />

            <Card padding="lg" className="max-w-3xl">
                <AddressForm
                    value={value}
                    onChange={setValue}
                    provinces={provinces}
                    errors={errors}
                    processing={processing}
                    submitLabel="Lưu địa chỉ"
                    onSubmit={handleSubmit}
                    onCancel={() => router.visit('/user/addresses')}
                />
            </Card>
        </AccountLayout>
    );
}
