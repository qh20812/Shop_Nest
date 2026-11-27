import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

import PromotionForm, { type PromotionFormData } from '@/components/admin/promotions/PromotionForm';
import PromotionStatusBadge from '@/components/admin/promotions/PromotionStatusBadge';
import type { PromotionSeller } from '@/components/admin/promotions/promotion-display';
import Toast from '@/components/admin/users/Toast';
import { PageHeader } from '@/components/layout/PageHeader';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n';

import adminStyles from '@/components/admin/admin.module.css';
import styles from './Promotions.module.css';

interface ProductOption {
    product_id: number;
    name: string;
    sku: string;
}

interface CategoryOption {
    category_id: number;
    name: string;
}

interface PromotionPayload {
    promotion_id: number;
    name: string;
    description: string | null;
    type: string;
    value: number | string;
    min_order_amount: number | string | null;
    max_discount_amount: number | string | null;
    start_date: string;
    end_date: string;
    usage_limit: number | null;
    used_count?: number | null;
    allocated_budget?: number | string | null;
    spent_budget?: number | string | null;
    roi_percentage?: number | string | null;
    created_by_type?: string | null;
    seller?: PromotionSeller | null;
    products: ProductOption[];
    categories: CategoryOption[];
    auto_apply_new_products: boolean;
    is_active: boolean;
    status: string;
}

interface PageProps {
    promotion: PromotionPayload;
    products: ProductOption[];
    categories: CategoryOption[];
    promotionTypes: Record<string, string>;
    flash?: { success?: string; error?: string };
    [key: string]: unknown;
}

const formatDateInput = (value: string) => {
    if (!value) {
        return '';
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return value;
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return '';
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

export default function Edit() {
    const { t } = useTranslation();
    const { promotion, products = [], categories = [], promotionTypes = {}, flash } = usePage<PageProps>().props;

    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    useEffect(() => {
        if (flash?.success) {
            setToast({ type: 'success', message: flash.success });
        } else if (flash?.error) {
            setToast({ type: 'error', message: flash.error });
        }
    }, [flash?.success, flash?.error]);

    const selectedProductIds = useMemo(() => promotion.products.map((product) => product.product_id), [promotion.products]);
    const selectedCategoryIds = useMemo(() => promotion.categories.map((category) => category.category_id), [promotion.categories]);

    const form = useForm<PromotionFormData>({
        name: promotion.name ?? '',
        description: promotion.description ?? '',
        type: promotion.type,
        value: String(promotion.value ?? ''),
        minimum_order_value: promotion.min_order_amount !== null ? String(promotion.min_order_amount) : '',
        max_discount_amount: promotion.max_discount_amount !== null ? String(promotion.max_discount_amount) : '',
        starts_at: formatDateInput(promotion.start_date),
        expires_at: formatDateInput(promotion.end_date),
        usage_limit_per_user: promotion.usage_limit !== null ? String(promotion.usage_limit) : '',
        product_ids: selectedProductIds,
        category_ids: selectedCategoryIds,
        auto_apply_new_products: promotion.auto_apply_new_products,
        is_active: promotion.is_active,
    });

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        form.put(`/admin/promotions/${promotion.promotion_id}`);
    };

    return (
        <WorkspaceLayout>
            <Head title={`${t('Edit Promotion')} - ${promotion.name}`} />

            {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

            <div className={adminStyles.stack}>
                <PageHeader
                    breadcrumbs={[
                        { label: t('Dashboard'), href: '/admin/dashboard' },
                        { label: t('Promotions'), href: '/admin/promotions' },
                        { label: promotion.name, href: `/admin/promotions/${promotion.promotion_id}` },
                        { label: t('Edit'), current: true },
                    ]}
                    title={t('Edit Promotion')}
                    description={
                        <span className={styles.headerMeta}>
                            <PromotionStatusBadge status={promotion.status} />
                            <span>{promotion.name}</span>
                        </span>
                    }
                    actions={
                        <>
                            <Button asChild variant="secondary" size="sm">
                                <Link href="/admin/promotions">{t('Back to List')}</Link>
                            </Button>
                            <Button asChild variant="secondary" size="sm">
                                <Link href={`/admin/promotions/${promotion.promotion_id}`}>{t('View')}</Link>
                            </Button>
                        </>
                    }
                />

                <PromotionForm
                    form={form}
                    mode="edit"
                    products={products}
                    categories={categories}
                    promotionTypes={promotionTypes}
                    promotion={promotion}
                    onSubmit={handleSubmit}
                    onCancel={() => router.get(`/admin/promotions/${promotion.promotion_id}`)}
                />
            </div>
        </WorkspaceLayout>
    );
}
