import React from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AppLayout from '../../../layouts/app/AppLayout';
import BrandForm from '../../../components/admin/brands/BrandForm';
import Header from '../../../components/admin/Header';
import { useTranslation } from '../../../lib/i18n';
import '@/../css/Page.css';

interface Brand {
    brand_id: number;
    name: string;
    description: string;
    logo_url: string | null;
    is_active: boolean;
}

interface BrandFormData {
    _method: string;
    name: string;
    description: string;
    logo: File | null;
    is_active: boolean;
}

interface PageProps {
    brand: Brand;
    [key: string]: unknown;
}

export default function Edit() {
    const { t } = useTranslation();
    const { brand } = usePage<PageProps>().props;
    
    const { data, setData, post, processing, errors } = useForm<BrandFormData>({
        _method: 'PUT',
        name: brand.name,
        description: brand.description || '',
        logo: null,
        is_active: brand.is_active,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/brands/${brand.brand_id}`, {
            forceFormData: true,
        });
    };

    return (
        <AppLayout>
            <Head title={t("Edit Brand")} />
            
            <Header
                title={t("Edit Brand")}
                breadcrumbs={[
                    { label: t("Dashboard"), href: "/admin/dashboard" },
                    { label: t("Brands"), href: "/admin/brands" },
                    { label: t("Edit Brand"), href: `/admin/brands/${brand.brand_id}/edit`, active: true }
                ]}
            />

            <BrandForm
                data={data}
                setData={setData}
                errors={errors}
                processing={processing}
                onSubmit={handleSubmit}
                submitLabel="Update Brand"
            />
        </AppLayout>
    );
}
