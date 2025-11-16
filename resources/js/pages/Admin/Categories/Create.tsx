import React from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AppLayout from '../../../layouts/app/AppLayout';
import Header from '../../../components/ui/Header';
import CategoryForm from '../../../Components/admin/categories/CategoryForm';
import Toast from '../../../Components/admin/users/Toast';
import { useTranslation } from '../../../lib/i18n';

interface Category {
    category_id: number;
    name: { en: string; vi: string };
    description?: { en?: string; vi?: string };
    parent_category_id?: number | null;
    is_active: boolean;
}

interface PageProps {
    parentCategories: Category[];
    flash?: { success?: string; error?: string };
    [key: string]: unknown;
}

export default function Create() {
    const { t } = useTranslation();
    const { parentCategories, flash } = usePage<PageProps>().props;

    const { data, setData, post, processing, errors } = useForm({
        name: { en: '', vi: '' },
        description: { en: '', vi: '' },
        parent_category_id: '',
        is_active: true,
        image: null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/categories');
    };

    return (
        <AppLayout>
            <Head title={t('Create Category')} />
            
            {/* Toast notification */}
            {flash?.error && (
                <Toast
                    type="error"
                    message={flash.error}
                    onClose={() => {}}
                />
            )}

            <Header
                title={t('Create New Category')}
                breadcrumbs={[
                    { label: t('Dashboard'), href: '/admin/dashboard' },
                    { label: t('Categories'), href: '/admin/categories' },
                    { label: t('Create'), href: '/admin/categories/create', active: true },
                ]}
            />

            <CategoryForm
                data={data}
                setData={setData}
                errors={errors}
                processing={processing}
                parentCategories={parentCategories}
                onSubmit={handleSubmit}
                submitLabel={t("Create Category")}
            />
        </AppLayout>
    );
}
