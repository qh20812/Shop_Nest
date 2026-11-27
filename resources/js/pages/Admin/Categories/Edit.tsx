import { Head, Link, useForm, usePage } from '@inertiajs/react';
import React from 'react';

import CategoryForm, { type CategoryParentOption } from '@/components/admin/categories/CategoryForm';
import Toast from '@/components/admin/users/Toast';
import { PageHeader } from '@/components/layout/PageHeader';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/ui/status-badge';
import { useTranslation } from '@/lib/i18n';

import adminStyles from '@/components/admin/admin.module.css';
import styles from './Categories.module.css';

interface Category {
    category_id: number;
    name: { en: string; vi: string };
    description?: { en?: string; vi?: string };
    parent_category_id?: number | null;
    is_active: boolean;
    image_url?: string | null;
    created_at?: string | null;
}

interface PageProps {
    category: Category;
    parentCategories: CategoryParentOption[];
    flash?: { success?: string; error?: string };
    [key: string]: unknown;
}

export default function Edit() {
    const { t, locale } = useTranslation();
    const { category, parentCategories = [], flash } = usePage<PageProps>().props;

    const categoryName = category.name?.[locale as keyof typeof category.name] || category.name?.en || t('Unnamed Category');

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        name: category.name || { en: '', vi: '' },
        description: {
            en: category.description?.en || '',
            vi: category.description?.vi || '',
        },
        parent_category_id: category.parent_category_id?.toString() || '',
        is_active: category.is_active ?? true,
        image: null,
        image_url: category.image_url || '',
    });

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        post(`/admin/categories/${category.category_id}`);
    };

    return (
        <WorkspaceLayout>
            <Head title={`${t('Edit Category')} - ${categoryName}`} />

            {flash?.error && <Toast type="error" message={flash.error} onClose={() => {}} />}

            <div className={adminStyles.stack}>
                <PageHeader
                    breadcrumbs={[
                        { label: t('Dashboard'), href: '/admin/dashboard' },
                        { label: t('Categories'), href: '/admin/categories' },
                        { label: t('Edit'), current: true },
                    ]}
                    title={t('Edit Category')}
                    description={
                        <span className={styles.headerMeta}>
                            <StatusBadge status={category.is_active ? 'active' : 'inactive'} />
                            <span>{categoryName}</span>
                        </span>
                    }
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
                    submitLabel={t('Update Category')}
                    createdAt={category.created_at}
                />
            </div>
        </WorkspaceLayout>
    );
}
