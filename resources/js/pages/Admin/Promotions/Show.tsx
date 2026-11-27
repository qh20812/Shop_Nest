import { Head, Link, usePage } from '@inertiajs/react';
import { FolderTree, Pencil, Store, Tag, TicketPercent } from 'lucide-react';

import PromotionStatusBadge from '@/components/admin/promotions/PromotionStatusBadge';
import {
    PROMOTION_TYPE_LABELS,
    promotionScopeLabel,
    promotionSellerName,
    promotionTypeLabel,
    promotionValueLabel,
    type PromotionSeller,
} from '@/components/admin/promotions/promotion-display';
import { PageHeader } from '@/components/layout/PageHeader';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import { Button } from '@/components/ui/button';
import { formatDate, formatNumber, formatTime, formatVnd } from '@/lib/format';
import { useTranslation } from '@/lib/i18n';

import adminStyles from '@/components/admin/admin.module.css';
import styles from './Promotions.module.css';

interface ProductSummary {
    product_id: number;
    name: string;
    sku?: string | null;
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
    min_order_amount?: number | string | null;
    max_discount_amount?: number | string | null;
    start_date: string;
    end_date: string;
    usage_limit: number | null;
    used_count: number;
    allocated_budget?: number | string | null;
    spent_budget?: number | string | null;
    roi_percentage?: number | string | null;
    status: string;
    auto_apply_new_products: boolean;
    created_by_type?: string | null;
    seller?: PromotionSeller | null;
    products: ProductSummary[];
    categories: CategorySummary[];
}

interface PageProps {
    promotion: PromotionDetails;
    [key: string]: unknown;
}

const toNumber = (value?: number | string | null): number | null => {
    if (value === null || value === undefined || value === '') {
        return null;
    }

    const numeric = Number(value);

    return Number.isFinite(numeric) ? numeric : null;
};

const formatBudget = (value?: number | string | null): string => {
    const numeric = toNumber(value);

    return numeric === null ? '-' : formatVnd(numeric);
};

const formatStamp = (value?: string | null): string => {
    if (!value) {
        return '-';
    }

    return `${formatDate(value)} ${formatTime(value)}`.trim();
};

export default function Show() {
    const { t } = useTranslation();
    const { promotion } = usePage<PageProps>().props;

    const roi = toNumber(promotion.roi_percentage);
    const typeLabel = promotionTypeLabel(promotion.type, PROMOTION_TYPE_LABELS, t);
    const scopeLabel = promotionScopeLabel(promotion, t);
    const sellerName = promotionSellerName(promotion.seller);

    const usageLabel =
        promotion.usage_limit !== null
            ? `${formatNumber(promotion.used_count)} / ${formatNumber(promotion.usage_limit)}`
            : formatNumber(promotion.used_count);

    const summaryItems = [
        { key: 'value', label: t('Discount Value'), value: promotionValueLabel(promotion.type, promotion.value) },
        { key: 'usage', label: t('Usage'), value: usageLabel },
        { key: 'allocated', label: t('Allocated Budget'), value: formatBudget(promotion.allocated_budget) },
        { key: 'spent', label: t('Spent Budget'), value: formatBudget(promotion.spent_budget) },
    ];

    const infoItems = [
        { key: 'start', label: t('Start Date'), value: formatStamp(promotion.start_date) },
        { key: 'end', label: t('End Date'), value: formatStamp(promotion.end_date) },
        { key: 'minimum', label: t('Minimum Order Value'), value: formatBudget(promotion.min_order_amount) },
        { key: 'maximum', label: t('Maximum Discount Amount'), value: formatBudget(promotion.max_discount_amount) },
        { key: 'roi', label: t('ROI'), value: roi === null ? '-' : `${roi.toFixed(2)}%` },
        { key: 'auto', label: t('Auto Apply New Products'), value: promotion.auto_apply_new_products ? t('Yes') : t('No') },
    ];

    return (
        <WorkspaceLayout>
            <Head title={`${t('Promotion Details')} - ${promotion.name}`} />

            <div className={adminStyles.stack}>
                <PageHeader
                    breadcrumbs={[
                        { label: t('Dashboard'), href: '/admin/dashboard' },
                        { label: t('Promotions'), href: '/admin/promotions' },
                        { label: promotion.name, current: true },
                    ]}
                    title={promotion.name}
                    description={
                        <span className={styles.headerMeta}>
                            <PromotionStatusBadge status={promotion.status} />
                            <span>{scopeLabel}</span>
                            <span>{typeLabel}</span>
                        </span>
                    }
                    actions={
                        <>
                            <Button asChild variant="secondary" size="sm">
                                <Link href="/admin/promotions">{t('Back to List')}</Link>
                            </Button>
                            <Button asChild variant="primary" size="sm">
                                <Link href={`/admin/promotions/${promotion.promotion_id}/edit`}>
                                    <Pencil aria-hidden="true" />
                                    {t('Edit Promotion')}
                                </Link>
                            </Button>
                        </>
                    }
                />

                <dl className={styles.summaryRail}>
                    {summaryItems.map((item) => (
                        <div key={item.key} className={styles.summary}>
                            <dt className={styles.summaryLabel}>{item.label}</dt>
                            <dd className={styles.summaryValue}>{item.value}</dd>
                        </div>
                    ))}
                </dl>

                <div className={styles.layout}>
                    <div className={styles.main}>
                        <section className={styles.panel}>
                            <div className={styles.panelHead}>
                                <h2 className={styles.panelTitle}>
                                    <TicketPercent aria-hidden="true" className={styles.panelIcon} />
                                    {t('Overview')}
                                </h2>
                            </div>
                            <div className={styles.panelBody}>
                                <div className={styles.infoGrid}>
                                    {infoItems.map((item) => (
                                        <div key={item.key} className={styles.infoItem}>
                                            <span className={styles.infoLabel}>{item.label}</span>
                                            <span className={styles.infoValue}>{item.value}</span>
                                        </div>
                                    ))}
                                </div>

                                {promotion.description && <p className={styles.prose}>{promotion.description}</p>}
                            </div>
                        </section>

                        <section className={styles.panel}>
                            <div className={styles.panelHead}>
                                <h2 className={styles.panelTitle}>
                                    <Tag aria-hidden="true" className={styles.panelIcon} />
                                    {t('Associated Products')}
                                </h2>
                                <span className={styles.infoLabel}>{formatNumber(promotion.products.length)}</span>
                            </div>
                            <div className={styles.panelBody}>
                                {promotion.products.length > 0 ? (
                                    <ul className={styles.tagList}>
                                        {promotion.products.map((product) => (
                                            <li key={product.product_id}>
                                                <Link
                                                    href={`/admin/products/${product.product_id}`}
                                                    className={`${styles.tag} ${styles.tagLink}`.trim()}
                                                >
                                                    {product.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className={styles.emptyNote}>{t('No products selected')}</p>
                                )}
                            </div>
                        </section>
                    </div>

                    <aside className={styles.aside}>
                        <section className={styles.panel}>
                            <div className={styles.panelHead}>
                                <h2 className={styles.panelTitle}>
                                    <Store aria-hidden="true" className={styles.panelIcon} />
                                    {t('Scope')}
                                </h2>
                            </div>
                            <div className={styles.panelBody}>
                                <div className={styles.infoGrid}>
                                    <div className={styles.infoItem}>
                                        <span className={styles.infoLabel}>{t('Scope')}</span>
                                        <span className={styles.infoValue}>{scopeLabel}</span>
                                    </div>
                                    {promotion.created_by_type === 'seller' && promotion.seller && (
                                        <>
                                            <div className={styles.infoItem}>
                                                <span className={styles.infoLabel}>{t('Seller')}</span>
                                                <span className={styles.infoValue}>{sellerName || promotion.seller.username || '-'}</span>
                                            </div>
                                            {promotion.seller.username && (
                                                <div className={styles.infoItem}>
                                                    <span className={styles.infoLabel}>{t('Username')}</span>
                                                    <span className={styles.infoValue}>@{promotion.seller.username}</span>
                                                </div>
                                            )}
                                            {promotion.seller.email && (
                                                <div className={styles.infoItem}>
                                                    <span className={styles.infoLabel}>Email</span>
                                                    <span className={styles.infoValue}>{promotion.seller.email}</span>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </section>

                        <section className={styles.panel}>
                            <div className={styles.panelHead}>
                                <h2 className={styles.panelTitle}>
                                    <FolderTree aria-hidden="true" className={styles.panelIcon} />
                                    {t('Associated Categories')}
                                </h2>
                                <span className={styles.infoLabel}>{formatNumber(promotion.categories.length)}</span>
                            </div>
                            <div className={styles.panelBody}>
                                {promotion.categories.length > 0 ? (
                                    <ul className={styles.tagList}>
                                        {promotion.categories.map((category) => (
                                            <li key={category.category_id} className={styles.tag}>
                                                {category.name}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className={styles.emptyNote}>{t('No categories selected')}</p>
                                )}
                            </div>
                        </section>
                    </aside>
                </div>
            </div>
        </WorkspaceLayout>
    );
}
