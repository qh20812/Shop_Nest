import React from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '../../../layouts/app/AppLayout';
import Header from '@/Components/ui/Header';
import StatusBadge from '@/Components/ui/StatusBadge';
import ActionButton from '@/Components/ui/ActionButton';
import { useTranslation } from '@/lib/i18n';
import '@/../css/Page.css';

interface ProductSummary {
    product_id: number;
    name: string;
    sku: string;
}

interface CategorySummary {
    category_id: number;
    name: string;
}

interface PromotionDetails {
    promotion_id: number;
    name: string;
    description: string | null;
    type: string;
    value: number | string;
    start_date: string;
    end_date: string;
    usage_limit: number | null;
    used_count: number;
    allocated_budget: number | string | null;
    spent_budget: number | string | null;
    roi_percentage: number | string | null;
    status: string;
    auto_apply_new_products: boolean;
    products: ProductSummary[];
    categories: CategorySummary[];
}

interface PageProps {
    promotion: PromotionDetails;
    [key: string]: unknown;
}

const typeLabelMap: Record<string, string> = {
    percentage: 'Percentage Discount',
    fixed_amount: 'Fixed Amount Discount',
    free_shipping: 'Free Shipping',
    buy_x_get_y: 'Buy X Get Y',
};

const formatDateTime = (value: string) => {
    if (!value) {
        return '—';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleString();
};

const formatCurrency = (value?: number | string | null) => {
    if (value === null || value === undefined || value === '') {
        return '—';
    }

    const numeric = typeof value === 'string' ? parseFloat(value) : Number(value);
    if (Number.isNaN(numeric)) {
        return '—';
    }

    return `${numeric.toLocaleString()} VND`;
};

export default function Show() {
    const { t } = useTranslation();
    const { promotion } = usePage<PageProps>().props;

    const usageText = promotion.usage_limit !== null
        ? `${promotion.used_count} / ${promotion.usage_limit}`
        : `${promotion.used_count}`;

    return (
        <AppLayout>
            <Head title={`${t('Promotion Details')} - ${promotion.name}`} />

            <Header
                title={t('Promotion Details')}
                breadcrumbs={[
                    { label: t('Dashboard'), href: '/admin/dashboard' },
                    { label: t('Promotions'), href: '/admin/promotions' },
                    { label: promotion.name, href: '#', active: true },
                ]}
            />

            <div className="promotion-form">
                <div className="form-section">
                    <h2 className="form-section-title">{t('Overview')}</h2>
                    <div className="detail-grid">
                        <div>
                            <div className="detail-label">{t('Promotion Name')}</div>
                            <div className="detail-value">{promotion.name}</div>
                        </div>
                        <div>
                            <div className="detail-label">{t('Status')}</div>
                            <StatusBadge status={promotion.status} />
                        </div>
                        <div>
                            <div className="detail-label">{t('Type')}</div>
                            <div className="detail-value">{t(typeLabelMap[promotion.type] ?? promotion.type)}</div>
                        </div>
                        <div>
                            <div className="detail-label">{t('Discount Value')}</div>
                            <div className="detail-value">
                                {promotion.type === 'percentage'
                                    ? `${Number(promotion.value).toLocaleString()}%`
                                    : formatCurrency(promotion.value)}
                            </div>
                        </div>
                        <div>
                            <div className="detail-label">{t('Start Date')}</div>
                            <div className="detail-value">{formatDateTime(promotion.start_date)}</div>
                        </div>
                        <div>
                            <div className="detail-label">{t('End Date')}</div>
                            <div className="detail-value">{formatDateTime(promotion.end_date)}</div>
                        </div>
                        <div>
                            <div className="detail-label">{t('Usage')}</div>
                            <div className="detail-value">{usageText}</div>
                        </div>
                        <div>
                            <div className="detail-label">{t('Auto Apply New Products')}</div>
                            <div className="detail-value">{promotion.auto_apply_new_products ? t('Yes') : t('No')}</div>
                        </div>
                    </div>

                    {promotion.description && (
                        <div className="form-group">
                            <div className="detail-label">{t('Description')}</div>
                            <div className="promotion-meta">{promotion.description}</div>
                        </div>
                    )}
                </div>

                <div className="form-section">
                    <h2 className="form-section-title">{t('Financials')}</h2>
                    <div className="detail-grid">
                        <div>
                            <div className="detail-label">{t('Allocated Budget')}</div>
                            <div className="detail-value">{formatCurrency(promotion.allocated_budget)}</div>
                        </div>
                        <div>
                            <div className="detail-label">{t('Spent Budget')}</div>
                            <div className="detail-value">{formatCurrency(promotion.spent_budget)}</div>
                        </div>
                        <div>
                            <div className="detail-label">{t('ROI')}</div>
                            <div className="detail-value">
                                {promotion.roi_percentage !== null && promotion.roi_percentage !== undefined
                                    ? `${Number(promotion.roi_percentage).toFixed(2)}%`
                                    : '—'}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h2 className="form-section-title">{t('Associated Products')}</h2>
                    {promotion.products.length > 0 ? (
                        <div className="tag-list">
                            {promotion.products.map((product) => (
                                <Link key={product.product_id} href={`/admin/products/${product.product_id}`} className="tag-pill">
                                    {product.name}
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="promotion-meta">{t('No products selected')}</div>
                    )}
                </div>

                <div className="form-section">
                    <h2 className="form-section-title">{t('Associated Categories')}</h2>
                    {promotion.categories.length > 0 ? (
                        <div className="tag-list">
                            {promotion.categories.map((category) => (
                                <span key={category.category_id} className="tag-pill">
                                    {category.name}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <div className="promotion-meta">{t('No categories selected')}</div>
                    )}
                </div>

                <div className="form-actions">
                    <ActionButton variant="secondary" onClick={() => router.get('/admin/promotions')}>
                        {t('Back to List')}
                    </ActionButton>
                    <ActionButton variant="primary" onClick={() => router.get(`/admin/promotions/${promotion.promotion_id}/edit`)}>
                        {t('Edit Promotion')}
                    </ActionButton>
                </div>
            </div>
        </AppLayout>
    );
}
