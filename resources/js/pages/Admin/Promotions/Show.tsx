import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Tag } from 'lucide-react';

import { Button } from '@/components/ui/button';
import Header from '@/components/ui/header';
import StatusBadge from '@/components/ui/status-badge';
import AppLayout from '@/layouts/app/AppLayout';
import { formatDateTime, formatVnd } from '@/lib/format';
import { useTranslation } from '@/lib/i18n';

import styles from '@/components/admin/admin.module.css';

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

const toNumber = (value?: number | string | null): number | null => {
    if (value === null || value === undefined || value === '') {
        return null;
    }

    const numeric = typeof value === 'string' ? Number.parseFloat(value) : Number(value);
    return Number.isNaN(numeric) ? null : numeric;
};

const formatBudget = (value?: number | string | null): string => {
    const numeric = toNumber(value);
    return numeric === null ? '-' : formatVnd(numeric);
};

export default function Show() {
    const { t } = useTranslation();
    const { promotion } = usePage<PageProps>().props;

    const usageText = promotion.usage_limit !== null ? `${promotion.used_count} / ${promotion.usage_limit}` : `${promotion.used_count}`;
    const roi = toNumber(promotion.roi_percentage);

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

            <div className={styles.stack}>
                <section className={styles.section}>
                    <div className={styles.sectionHead}>
                        <h2 className={styles.sectionTitle}>
                            <Tag aria-hidden="true" className={styles.sectionIcon} />
                            {t('Overview')}
                        </h2>
                        <StatusBadge status={promotion.status} />
                    </div>

                    <div className={styles.detailGrid}>
                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>{t('Promotion Name')}</span>
                            <span className={styles.detailValue}>{promotion.name}</span>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>{t('Type')}</span>
                            <span className={styles.detailValue}>{t(typeLabelMap[promotion.type] ?? promotion.type)}</span>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>{t('Discount Value')}</span>
                            <span className={styles.detailValue}>
                                {promotion.type === 'percentage'
                                    ? `${Number(promotion.value).toLocaleString('vi-VN')}%`
                                    : formatBudget(promotion.value)}
                            </span>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>{t('Start Date')}</span>
                            <span className={styles.detailValue}>{formatDateTime(promotion.start_date)}</span>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>{t('End Date')}</span>
                            <span className={styles.detailValue}>{formatDateTime(promotion.end_date)}</span>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>{t('Usage')}</span>
                            <span className={styles.detailValue}>{usageText}</span>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>{t('Auto Apply New Products')}</span>
                            <span className={styles.detailValue}>{promotion.auto_apply_new_products ? t('Yes') : t('No')}</span>
                        </div>
                    </div>

                    {promotion.description && (
                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>{t('Description')}</span>
                            <p className={styles.detailProse}>{promotion.description}</p>
                        </div>
                    )}
                </section>

                <section className={styles.section}>
                    <div className={styles.sectionHead}>
                        <h2 className={styles.sectionTitle}>{t('Financials')}</h2>
                    </div>
                    <div className={styles.detailGrid}>
                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>{t('Allocated Budget')}</span>
                            <span className={styles.detailValue}>{formatBudget(promotion.allocated_budget)}</span>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>{t('Spent Budget')}</span>
                            <span className={styles.detailValue}>{formatBudget(promotion.spent_budget)}</span>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>{t('ROI')}</span>
                            <span className={styles.detailValue}>{roi !== null ? `${roi.toFixed(2)}%` : '-'}</span>
                        </div>
                    </div>
                </section>

                <section className={styles.section}>
                    <div className={styles.sectionHead}>
                        <h2 className={styles.sectionTitle}>{t('Associated Products')}</h2>
                    </div>
                    {promotion.products.length > 0 ? (
                        <ul className={styles.tagList}>
                            {promotion.products.map((product) => (
                                <li key={product.product_id}>
                                    <Link href={`/admin/products/${product.product_id}`} className={styles.tag}>
                                        {product.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className={styles.note}>{t('No products selected')}</p>
                    )}
                </section>

                <section className={styles.section}>
                    <div className={styles.sectionHead}>
                        <h2 className={styles.sectionTitle}>{t('Associated Categories')}</h2>
                    </div>
                    {promotion.categories.length > 0 ? (
                        <ul className={styles.tagList}>
                            {promotion.categories.map((category) => (
                                <li key={category.category_id} className={styles.tag}>
                                    {category.name}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className={styles.note}>{t('No categories selected')}</p>
                    )}
                </section>

                <div className={styles.formFooter}>
                    <Button type="button" variant="secondary" onClick={() => router.get('/admin/promotions')}>
                        {t('Back to List')}
                    </Button>
                    <Button type="button" variant="primary" onClick={() => router.get(`/admin/promotions/${promotion.promotion_id}/edit`)}>
                        <Pencil aria-hidden="true" />
                        {t('Edit Promotion')}
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}
