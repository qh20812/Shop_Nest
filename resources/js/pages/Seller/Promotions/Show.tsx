import { Head, Link, usePage } from '@inertiajs/react';
import { Pencil, Tag } from 'lucide-react';

import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Header from '@/components/ui/header';
import StatusBadge from '@/components/ui/status-badge';
import { formatDateTime, formatVnd } from '@/lib/format';
import { useTranslation } from '@/lib/i18n';

import styles from '../seller.module.css';

interface ProductSummary {
    product_id: number;
    name: string | Record<string, string> | null;
    sku?: string | null;
}

interface PromotionDetails {
    promotion_id: number;
    name: string;
    description: string | null;
    type: number | string;
    value: number | string;
    min_order_amount: number | string | null;
    max_discount_amount: number | string | null;
    start_date: string;
    end_date: string;
    usage_limit: number | null;
    used_count: number;
    allocated_budget: number | string | null;
    spent_budget: number | string | null;
    roi_percentage: number | string | null;
    is_active: boolean;
    products: ProductSummary[];
}

interface PageProps {
    promotion: PromotionDetails;
    roi?: number | string;
    status?: string;
    [key: string]: unknown;
}

const TYPE_LABELS: Record<string, string> = {
    '1': 'Percentage Discount',
    '2': 'Fixed Amount Discount',
    '3': 'Free Shipping',
    '4': 'Buy X Get Y',
    percentage: 'Percentage Discount',
    fixed_amount: 'Fixed Amount Discount',
    free_shipping: 'Free Shipping',
    buy_x_get_y: 'Buy X Get Y',
};

const productName = (product: ProductSummary): string => {
    if (!product.name) return `#${product.product_id}`;
    if (typeof product.name === 'string') return product.name;

    return product.name.vi || product.name.en || Object.values(product.name)[0] || `#${product.product_id}`;
};

export default function Show() {
    const { t } = useTranslation();
    const { promotion, roi, status } = usePage<PageProps>().props;

    const typeKey = String(promotion.type);
    const statusKey = status ?? (promotion.is_active ? 'active' : 'paused');
    const budget = Number(promotion.allocated_budget ?? 0);
    const spent = Number(promotion.spent_budget ?? 0);
    const roiValue = roi !== undefined ? Number(roi) : Number(promotion.roi_percentage ?? 0);

    return (
        <WorkspaceLayout>
            <Head title={`${promotion.name} - ${t('Promotion Details')}`} />

            <Header
                title={t('Promotion Details')}
                breadcrumbs={[
                    { label: t('Seller Dashboard'), href: '/seller/dashboard' },
                    { label: t('Promotions'), href: '/seller/promotions' },
                    { label: promotion.name, href: `/seller/promotions/${promotion.promotion_id}`, active: true },
                ]}
            />

            <div className={styles.stack}>
                <Card variant="flat" padding="md">
                    <div className={styles.formSection}>
                        <div className={styles.sectionHead}>
                            <h2 className={styles.sectionTitle}>
                                <Tag className={styles.sectionIcon} aria-hidden="true" />
                                {promotion.name}
                            </h2>
                            <StatusBadge status={statusKey === 'draft' ? 'pending' : statusKey} />
                        </div>

                        {promotion.description && <p className={styles.muted}>{promotion.description}</p>}

                        <div className={styles.detailList}>
                            <div className={styles.detailLine}>
                                <span>{t('Discount Type')}</span>
                                <span className={styles.detailValue}>{t(TYPE_LABELS[typeKey] ?? 'Percentage Discount')}</span>
                            </div>
                            <div className={styles.detailLine}>
                                <span>{t('Discount Value')}</span>
                                <span className={styles.detailValue}>
                                    {typeKey === '1' || typeKey === 'percentage'
                                        ? `${Number(promotion.value).toLocaleString('vi-VN')}%`
                                        : formatVnd(Number(promotion.value))}
                                </span>
                            </div>
                            <div className={styles.detailLine}>
                                <span>{t('Start Date')}</span>
                                <span className={styles.detailValue}>{formatDateTime(promotion.start_date)}</span>
                            </div>
                            <div className={styles.detailLine}>
                                <span>{t('End Date')}</span>
                                <span className={styles.detailValue}>{formatDateTime(promotion.end_date)}</span>
                            </div>
                            <div className={styles.detailLine}>
                                <span>{t('Usage')}</span>
                                <span className={styles.detailValue}>
                                    {promotion.used_count}
                                    {promotion.usage_limit !== null ? ` / ${promotion.usage_limit}` : ''}
                                </span>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card variant="flat" padding="md">
                    <div className={styles.formSection}>
                        <h2 className={styles.sectionTitle}>{t('Budget & Performance')}</h2>

                        <div className={styles.metricGrid}>
                            <div className={styles.metricCard}>
                                <span className={styles.metricLabel}>{t('Allocated Budget')}</span>
                                <span className={styles.metricValue}>{formatVnd(budget)}</span>
                            </div>
                            <div className={styles.metricCard}>
                                <span className={styles.metricLabel}>{t('Spent Budget')}</span>
                                <span className={styles.metricValue}>{formatVnd(spent)}</span>
                            </div>
                            <div className={styles.metricCard}>
                                <span className={styles.metricLabel}>{t('ROI')}</span>
                                <span className={`${styles.metricValue} ${roiValue >= 0 ? styles.roiPositive : styles.roiNegative}`.trim()}>
                                    {roiValue.toFixed(2)}%
                                </span>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card variant="flat" padding="md">
                    <div className={styles.formSection}>
                        <h2 className={styles.sectionTitle}>{t('Products')}</h2>

                        {promotion.products?.length ? (
                            <div className={styles.detailList}>
                                {promotion.products.map((product) => (
                                    <div key={product.product_id} className={styles.detailLine}>
                                        <span>{productName(product)}</span>
                                        <span className={styles.detailValue}>{product.sku ?? ''}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className={styles.muted}>{t('No products selected')}</p>
                        )}
                    </div>
                </Card>

                <div className={styles.formFooter}>
                    <Link href="/seller/promotions">{t('Back to Promotions')}</Link>
                    <Link href={`/seller/promotions/${promotion.promotion_id}/edit`}>
                        <Button variant="primary" type="button">
                            <Pencil size={16} aria-hidden="true" />
                            {t('Edit Promotion')}
                        </Button>
                    </Link>
                </div>
            </div>
        </WorkspaceLayout>
    );
}
