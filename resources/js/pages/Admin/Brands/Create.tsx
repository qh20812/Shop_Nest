import '@/../css/Page.css';
import { Head, useForm } from '@inertiajs/react';
import React from 'react';
import BrandForm from '../../../components/admin/brands/BrandForm';
import Header from '../../../components/ui/header';
import AppLayout from '../../../layouts/app/AppLayout';
import { useTranslation } from '../../../lib/i18n';

interface BrandFormData {
    name: string;
    description: string;
    logo: File | null;
    is_active: boolean;
}

export default function Create() {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors } = useForm<BrandFormData>({
        name: '',
        description: '',
        logo: null,
        is_active: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/brands', {
            forceFormData: true,
        });
    };

    return (
        <AppLayout>
            <Head title={t('Create Brand')} />

            <Header
                title={t('Create Brand')}
                breadcrumbs={[
                    { label: t('Dashboard'), href: '/admin/dashboard' },
                    { label: t('Brands'), href: '/admin/brands' },
                    { label: t('Create Brand'), href: '/admin/brands/create', active: true },
                ]}
            />

            <BrandForm data={data} setData={setData} errors={errors} processing={processing} onSubmit={handleSubmit} submitLabel="Create Brand" />
        </AppLayout>
    );
}
