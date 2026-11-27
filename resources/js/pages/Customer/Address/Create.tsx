import { Head, router, usePage } from '@inertiajs/react';
import * as React from 'react';

import { AccountLayout } from '@/components/layout/AccountLayout';
import { Card } from '@/components/ui/card';
import { useTranslation } from '@/lib/i18n';

import styles from '../customer.module.css';
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
    const { t } = useTranslation();
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
            breadcrumbs={[{ label: t('Market'), href: '/' }, { label: t('Addresses'), href: '/user/addresses' }, { label: t('New address') }]}
            eyebrow={t('Address book')}
            title={t('Add a shipping address')}
            description={t('An accurate address helps your order arrive on time.')}
        >
            <Head title={t('Add address')} />

            <Card padding="lg" className={styles.cardWide}>
                <AddressForm
                    value={value}
                    onChange={setValue}
                    provinces={provinces}
                    errors={errors}
                    processing={processing}
                    submitLabel={t('Save address')}
                    onSubmit={handleSubmit}
                    onCancel={() => router.visit('/user/addresses')}
                />
            </Card>
        </AccountLayout>
    );
}
