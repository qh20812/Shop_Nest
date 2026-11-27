import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import PromotionForm, { type PromotionFormData } from '@/components/admin/promotions/PromotionForm';
import Toast from '@/components/admin/users/Toast';
import { PageHeader } from '@/components/layout/PageHeader';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n';

import adminStyles from '@/components/admin/admin.module.css';

interface Product {
    product_id: number;
    name: string;
    sku: string;
    price: number;
}

interface Category {
    category_id: number;
    name: string;
}

interface PageProps {
    products: Product[];
    categories: Category[];
    promotionTypes: Record<string, string>;
    flash?: { success?: string; error?: string };
    [key: string]: unknown;
}

export default function Create() {
    const { t } = useTranslation();
    const { products = [], categories = [], promotionTypes = {}, flash } = usePage<PageProps>().props;
    const [toast, setToast] = useState<{ type: 'error'; message: string } | null>(null);

    useEffect(() => {
        if (flash?.error) {
            setToast({ type: 'error', message: flash.error });
        }
    }, [flash?.error]);

    const firstType = Object.keys(promotionTypes)[0] ?? 'percentage';

    const form = useForm<PromotionFormData>({
        name: '',
        description: '',
        type: firstType,
        value: '',
        minimum_order_value: '',
        max_discount_amount: '',
        starts_at: '',
        expires_at: '',
        usage_limit_per_user: '',
        product_ids: [],
        category_ids: [],
        auto_apply_new_products: false,
        is_active: true,
    });

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        form.post('/admin/promotions');
    };

    return (
        <WorkspaceLayout>
            <Head title={t('Create Promotion')} />

            {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

            <div className={adminStyles.stack}>
                <PageHeader
                    breadcrumbs={[
                        { label: t('Dashboard'), href: '/admin/dashboard' },
                        { label: t('Promotions'), href: '/admin/promotions' },
                        { label: t('Create Promotion'), current: true },
                    ]}
                    title={t('Create Promotion')}
                    actions={
                        <Button asChild variant="secondary" size="sm">
                            <Link href="/admin/promotions">{t('Back to List')}</Link>
                        </Button>
                    }
                />

                <PromotionForm
                    form={form}
                    mode="create"
                    products={products}
                    categories={categories}
                    promotionTypes={promotionTypes}
                    onSubmit={handleSubmit}
                    onCancel={() => router.get('/admin/promotions')}
                />
            </div>
        </WorkspaceLayout>
    );
}
