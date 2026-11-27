import { Head, Link, useForm, usePage } from '@inertiajs/react';
import React from 'react';

import CategoryForm, { type CategoryParentOption } from '@/components/admin/categories/CategoryForm';
import Toast from '@/components/admin/users/Toast';
import { PageHeader } from '@/components/layout/PageHeader';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n';

import adminStyles from '@/components/admin/admin.module.css';

interface PageProps {
    parentCategories: CategoryParentOption[];
    flash?: { success?: string; error?: string };
    [key: string]: unknown;
}

export default function Create() {
    const { t } = useTranslation();
    const { parentCategories = [], flash } = usePage<PageProps>().props;

    const { data, setData, post, processing, errors } = useForm({
        name: { en: '', vi: '' },
        description: { en: '', vi: '' },
        parent_category_id: '',
        is_active: true,
        image: null,
    });

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        post('/admin/categories');
    };

    return (
        <WorkspaceLayout>
            <Head title={t('Create Category')} />

            {flash?.error && <Toast type="error" message={flash.error} onClose={() => {}} />}

            <div className={adminStyles.stack}>
                <PageHeader
                    breadcrumbs={[
                        { label: t('Dashboard'), href: '/admin/dashboard' },
                        { label: t('Categories'), href: '/admin/categories' },
                        { label: t('Create New Category'), current: true },
                    ]}
                    title={t('Create New Category')}
                    actions={
                        <Button asChild variant="secondary" size="sm">
                            <Link href="/admin/categories">{t('Back to List')}</Link>
                        </Button>
                    }
                />

                <CategoryForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    parentCategories={parentCategories}
                    onSubmit={handleSubmit}
                    submitLabel={t('Create Category')}
                />
            </div>
        </WorkspaceLayout>
    );
}
