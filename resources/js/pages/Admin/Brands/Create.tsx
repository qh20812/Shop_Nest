import { Head, Link, useForm, usePage } from '@inertiajs/react';
import React from 'react';

import BrandForm from '@/components/admin/brands/BrandForm';
import Toast from '@/components/admin/users/Toast';
import { PageHeader } from '@/components/layout/PageHeader';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n';

import adminStyles from '@/components/admin/admin.module.css';

interface BrandFormData {
    name: string;
    description: string;
    logo: File | null;
    is_active: boolean;
}

interface PageProps {
    flash?: { success?: string; error?: string };
    [key: string]: unknown;
}

export default function Create() {
    const { t } = useTranslation();
    const { flash } = usePage<PageProps>().props;

    const { data, setData, post, processing, errors } = useForm<BrandFormData>({
        name: '',
        description: '',
        logo: null,
        is_active: true,
    });

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        post('/admin/brands', { forceFormData: true });
    };

    return (
        <WorkspaceLayout>
            <Head title={t('Create Brand')} />

            {flash?.error && <Toast type="error" message={flash.error} onClose={() => {}} />}

            <div className={adminStyles.stack}>
                <PageHeader
                    breadcrumbs={[
                        { label: t('Dashboard'), href: '/admin/dashboard' },
                        { label: t('Brands'), href: '/admin/brands' },
                        { label: t('Create Brand'), current: true },
                    ]}
                    title={t('Create Brand')}
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
                    submitLabel={t('Create Brand')}
                />
            </div>
        </WorkspaceLayout>
    );
}
