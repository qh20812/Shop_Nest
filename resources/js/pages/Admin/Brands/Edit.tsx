import { Head, Link, useForm, usePage } from '@inertiajs/react';
import React from 'react';

import BrandForm from '@/components/admin/brands/BrandForm';
import Toast from '@/components/admin/users/Toast';
import { PageHeader } from '@/components/layout/PageHeader';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/ui/status-badge';
import { useTranslation } from '@/lib/i18n';

import adminStyles from '@/components/admin/admin.module.css';
import styles from './Brands.module.css';

interface Brand {
    brand_id: number;
    name: string;
    description: string | null;
    logo_url: string | null;
    is_active: boolean;
    products_count: number;
    created_at: string;
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
    flash?: { success?: string; error?: string };
    [key: string]: unknown;
}

export default function Edit() {
    const { t } = useTranslation();
    const { brand, flash } = usePage<PageProps>().props;

    const { data, setData, post, processing, errors } = useForm<BrandFormData>({
        _method: 'PUT',
        name: brand.name,
        description: brand.description || '',
        logo: null,
        is_active: brand.is_active,
    });

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        post(`/admin/brands/${brand.brand_id}`, { forceFormData: true });
    };

    return (
        <WorkspaceLayout>
            <Head title={`${t('Edit Brand')} - ${brand.name}`} />

            {flash?.error && <Toast type="error" message={flash.error} onClose={() => {}} />}

            <div className={adminStyles.stack}>
                <PageHeader
                    breadcrumbs={[
                        { label: t('Dashboard'), href: '/admin/dashboard' },
                        { label: t('Brands'), href: '/admin/brands' },
                        { label: t('Edit'), current: true },
                    ]}
                    title={t('Edit Brand')}
                    description={
                        <span className={styles.headerMeta}>
                            <StatusBadge status={brand.is_active ? 'active' : 'inactive'} />
                            <span>{brand.name}</span>
                        </span>
                    }
                    actions={
                        <Button asChild variant="secondary" size="sm">
                            <Link href="/admin/brands">{t('Back to List')}</Link>
                        </Button>
                    }
                />

                <BrandForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={handleSubmit}
                    submitLabel={t('Update Brand')}
                    currentLogoUrl={brand.logo_url}
                    createdAt={brand.created_at}
                    productsCount={brand.products_count}
                />
            </div>
        </WorkspaceLayout>
    );
}
