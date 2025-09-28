import React from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AppLayout from '../../../layouts/app/AppLayout';
import Header from '../../../components/admin/Header';
import CategoryForm from '../../../components/admin/categories/CategoryForm';
import Toast from '../../../components/admin/users/Toast';
import { useTranslation } from '../../../lib/i18n';

interface Category {
    category_id: number;
    name: { en: string; vi: string };
    description?: { en?: string; vi?: string };
    parent_category_id?: number | null;
    is_active: boolean;
    image_url?: string;
}

interface PageProps {
    category: Category;
    parentCategories: Category[];
    flash?: { success?: string; error?: string };
    [key: string]: unknown;
}

export default function Edit() {
    const { t } = useTranslation();
    const { category, parentCategories, flash } = usePage<PageProps>().props;

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        name: category.name || { en: '', vi: '' },
        description: {
            en: category.description?.en || '',
            vi: category.description?.vi || ''
        },
        parent_category_id: category.parent_category_id?.toString() || '',
        is_active: category.is_active ?? true,
        image: null,
        image_url: category.image_url || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/categories/${category.category_id}`);
    };

    return (
        <AppLayout>
            <Head title={t('Edit Category')} />
            
            {/* Toast notification */}
            {flash?.error && (
                <Toast
                    type="error"
                    message={flash.error}
                    onClose={() => {}}
                />
            )}

            <Header
                title={t('Edit Category')}
                breadcrumbs={[
                    { label: t('Dashboard'), href: '/admin/dashboard' },
                    { label: t('Categories'), href: '/admin/categories' },
                    { label: t('Edit'), href: `/admin/categories/${category.category_id}/edit`, active: true },
                ]}
            />

            <CategoryForm
                data={data}
                setData={setData}
                errors={errors}
                processing={processing}
                parentCategories={parentCategories}
                onSubmit={handleSubmit}
                submitLabel={t("Update Category")}
            />
        </AppLayout>
    );
}
