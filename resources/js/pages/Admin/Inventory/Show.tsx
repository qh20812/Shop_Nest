import { Head, Link, usePage } from '@inertiajs/react';
import { Activity, ArrowLeft, History as HistoryIcon, Layers } from 'lucide-react';
import { useMemo } from 'react';

import { PageHeader } from '@/components/layout/PageHeader';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import ActionButtons, { type ActionConfig } from '@/components/ui/action-buttons';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import DataTable from '@/components/ui/data-table';
import { formatDate, formatNumber, formatTime, formatVnd } from '@/lib/format';
import { useTranslation } from '@/lib/i18n';

import adminStyles from '@/components/admin/admin.module.css';
import railStyles from './Inventory.module.css';
import styles from './InventoryDetail.module.css';

const LOW_STOCK_THRESHOLD = 10;

const resolveText = (value: unknown, locale: string, fallback: string): string => {
    if (!value) {
        return fallback;
    }

    if (typeof value === 'string') {
        return value;
    }

    if (typeof value === 'object') {
        const record = value as Record<string, unknown>;
        const direct = record[locale];
        if (typeof direct === 'string') {
            return direct;
        }

        const shortLocale = locale.split('-')[0];
        const shortMatch = record[shortLocale];
        if (typeof shortMatch === 'string') {
            return shortMatch;
        }

        const english = record.en;
        if (typeof english === 'string') {
            return english;
        }

        const first = Object.values(record).find((entry): entry is string => typeof entry === 'string');
        if (first) {
            return first;
        }
    }

    return String(value);
};

const resolvePersonName = (person: Person | undefined, locale: string, fallback: string): string => {
    if (!person) {
        return fallback;
    }

    const fullName = `${person.first_name ?? ''} ${person.last_name ?? ''}`.trim();
    if (fullName) {
        return fullName;
    }

    if (person.name) {
        return resolveText(person.name, locale, fallback);
    }

    if (person.username) {
        return person.username;
    }

    return fallback;
};

const toNumber = (value: number | string | null | undefined): number | null => {
    if (value === null || value === undefined || value === '') {
        return null;
    }

    const numeric = Number(value);

    return Number.isFinite(numeric) ? numeric : null;
};

const getStockStatusValue = (quantity?: number | string | null): 'in_stock' | 'low_stock' | 'out_of_stock' => {
    const stock = Number(quantity ?? 0);

    if (stock <= 0) {
        return 'out_of_stock';
    }

    if (stock <= LOW_STOCK_THRESHOLD) {
        return 'low_stock';
    }

    return 'in_stock';
};

const getStockTone = (status: 'in_stock' | 'low_stock' | 'out_of_stock') => {
    if (status === 'in_stock') {
        return 'success' as const;
    }

    if (status === 'low_stock') {
        return 'warning' as const;
    }

    return 'danger' as const;
};

const getVariantAttributes = (variant: InventoryVariant, locale: string): string[] => {
    const attributeValues = (variant.attributeValues ?? [])
        .map((attribute) => attribute.value ?? resolveText(attribute.name ?? attribute.attribute?.name, locale, ''))
        .filter((text): text is string => Boolean(text));

    if (attributeValues.length > 0) {
        return attributeValues;
    }

    return (variant.option_values ?? []).map((option) => [option.name, option.value].filter(Boolean).join(': ')).filter((text) => Boolean(text));
};

const getVariantLogs = (variant: InventoryVariant): InventoryLog[] => variant.inventoryLogs ?? [];

interface Person {
    first_name?: string;
    last_name?: string;
    name?: string | Record<string, string>;
    username?: string;
}

interface Category {
    category_id: number;
    name?: string | Record<string, string>;
}

interface Brand {
    brand_id: number;
    name?: string | Record<string, string>;
}

interface AttributeValue {
    value?: string;
    name?: string | Record<string, string>;
    attribute?: {
        name?: string | Record<string, string>;
    };
}

interface InventoryLog {
    id?: number;
    quantity_change: number;
    reason: string;
    created_at: string;
    user?: Person;
}

interface InventoryVariant {
    variant_id: number;
    sku?: string | null;
    stock_quantity?: number | string | null;
    reserved_quantity?: number | string | null;
    price?: number | string | null;
    discount_price?: number | string | null;
    attributeValues?: AttributeValue[];
    option_values?: Array<{ name?: string | null; value?: string | null }> | null;
    inventoryLogs?: InventoryLog[];
}

interface Product {
    product_id: number;
    name?: string | Record<string, string>;
    seller?: Person;
    category?: Category;
    brand?: Brand;
    variants?: InventoryVariant[];
}

interface PageProps extends Record<string, unknown> {
    product: Product;
    locale: string;
}

export default function Show() {
    const { t, locale } = useTranslation();
    const { product } = usePage<PageProps>().props;

    const variants = useMemo(() => product?.variants ?? [], [product]);
    const productName = resolveText(product?.name, locale, t('Unnamed Product'));
    const sellerName = resolvePersonName(product?.seller, locale, t('Unknown Seller'));
    const categoryName = resolveText(product?.category?.name, locale, t('No Category'));
    const brandName = resolveText(product?.brand?.name, locale, t('No Brand'));

    const totalStock = variants.reduce((sum, variant) => sum + (toNumber(variant.stock_quantity) ?? 0), 0);
    const totalReserved = variants.reduce((sum, variant) => sum + (toNumber(variant.reserved_quantity) ?? 0), 0);
    const lowStockCount = variants.filter((variant) => getStockStatusValue(variant.stock_quantity) === 'low_stock').length;
    const outOfStockCount = variants.filter((variant) => getStockStatusValue(variant.stock_quantity) === 'out_of_stock').length;

    const historyHref = `/admin/inventory/${product.product_id}/history`;

    const summaryItems = [
        { key: 'total', label: t('Total Stock'), value: formatNumber(totalStock) },
        { key: 'reserved', label: t('Reserved'), value: formatNumber(totalReserved) },
        { key: 'low', label: t('Low Stock Variants'), value: formatNumber(lowStockCount) },
        { key: 'out', label: t('Out of Stock Variants'), value: formatNumber(outOfStockCount) },
    ];

    const recentMovements = useMemo(() => {
        return variants
            .flatMap((variant) =>
                getVariantLogs(variant).map((log) => ({
                    log,
                    variant,
                    time: log.created_at ? new Date(log.created_at).getTime() : 0,
                })),
            )
            .sort((first, second) => second.time - first.time)
            .slice(0, 8);
    }, [variants]);

    const columns = useMemo(
        () => [
            {
                key: 'variant',
                header: t('Variant'),
                cell: (variant: InventoryVariant) => {
                    const attributes = getVariantAttributes(variant, locale);

                    return (
                        <div className={styles.variant}>
                            <span className={styles.variantSku}>{variant.sku ?? `#${variant.variant_id}`}</span>
                            <span className={styles.variantAttributes}>{attributes.length > 0 ? attributes.join(', ') : '-'}</span>
                        </div>
                    );
                },
            },
            {
                key: 'price',
                header: t('Price'),
                align: 'right' as const,
                cell: (variant: InventoryVariant) => {
                    const price = toNumber(variant.price);
                    const discount = toNumber(variant.discount_price);
                    const hasDiscount = price !== null && discount !== null && discount < price;

                    return (
                        <div className={styles.priceCell}>
                            <span className={adminStyles.price}>{price !== null ? formatVnd(price) : t('N/A')}</span>
                            {hasDiscount && (
                                <span className={styles.discount}>
                                    {t('Discount')} {formatVnd(discount ?? 0)}
                                </span>
                            )}
                        </div>
                    );
                },
            },
            {
                key: 'reserved',
                header: t('Reserved'),
                align: 'right' as const,
                cell: (variant: InventoryVariant) => (
                    <span className={styles.reserved}>{formatNumber(toNumber(variant.reserved_quantity) ?? 0)}</span>
                ),
            },
            {
                key: 'stock',
                header: t('Stock'),
                align: 'right' as const,
                cell: (variant: InventoryVariant) => {
                    const status = getStockStatusValue(variant.stock_quantity);
                    const statusLabel = status === 'in_stock' ? t('In Stock') : status === 'low_stock' ? t('Low Stock') : t('Out of Stock');

                    return (
                        <div className={styles.stockCell}>
                            <span className={adminStyles.numeric}>{formatNumber(toNumber(variant.stock_quantity) ?? 0)}</span>
                            <Badge tone={getStockTone(status)}>{statusLabel}</Badge>
                        </div>
                    );
                },
            },
            {
                key: 'actions',
                header: t('Actions'),
                cell: (variant: InventoryVariant) => {
                    const actions: ActionConfig[] = [
                        {
                            type: 'link',
                            href: `${historyHref}?variant=${variant.variant_id}`,
                            icon: HistoryIcon,
                            label: t('History'),
                            variant: 'primary',
                        },
                    ];

                    return <ActionButtons actions={actions} />;
                },
            },
        ],
        [historyHref, locale, t],
    );

    return (
        <WorkspaceLayout>
            <Head title={`${productName} - ${t('Inventory Details')}`} />

            <div className={adminStyles.stack}>
                <PageHeader
                    breadcrumbs={[
                        { label: t('Dashboard'), href: '/admin/dashboard' },
                        { label: t('Inventory'), href: '/admin/inventory' },
                        { label: productName, current: true },
                    ]}
                    title={productName}
                    description={
                        <span className={styles.headerMeta}>
                            <span>#{product.product_id}</span>
                            <span>{sellerName}</span>
                            <span>
                                {categoryName} / {brandName}
                            </span>
                        </span>
                    }
                    actions={
                        <>
                            <Button asChild variant="secondary" size="sm">
                                <Link href="/admin/inventory">
                                    <ArrowLeft aria-hidden="true" />
                                    {t('Back to Inventory')}
                                </Link>
                            </Button>
                            <Button asChild variant="primary" size="sm">
                                <Link href={historyHref}>
                                    <HistoryIcon aria-hidden="true" />
                                    {t('View History')}
                                </Link>
                            </Button>
                        </>
                    }
                />

                <dl className={railStyles.summaryRail}>
                    {summaryItems.map((item) => (
                        <div key={item.key} className={railStyles.summary}>
                            <dt className={railStyles.summaryLabel}>{item.label}</dt>
                            <dd className={railStyles.summaryValue}>{item.value}</dd>
                        </div>
                    ))}
                </dl>

                <div className={styles.table}>
                    <DataTable
                        columns={columns}
                        data={variants}
                        headerTitle={t('Variant Inventory')}
                        headerIcon={Layers}
                        headerMeta={formatNumber(variants.length)}
                        emptyMessage={t('No variants found')}
                    />
                </div>

                <section className={styles.timelinePanel}>
                    <div className={styles.sectionHead}>
                        <h2 className={styles.sectionTitle}>
                            <Activity aria-hidden="true" className={styles.sectionIcon} />
                            {t('Recent movements')}
                        </h2>
                    </div>

                    {recentMovements.length > 0 ? (
                        <ul className={styles.movementList}>
                            {recentMovements.map(({ log, variant }) => {
                                const changeClass =
                                    log.quantity_change > 0
                                        ? adminStyles.changePositive
                                        : log.quantity_change < 0
                                          ? adminStyles.changeNegative
                                          : adminStyles.changeNeutral;
                                const signedChange = `${log.quantity_change > 0 ? '+' : log.quantity_change < 0 ? '-' : ''}${formatNumber(Math.abs(log.quantity_change))}`;

                                return (
                                    <li key={log.id ?? `${variant.variant_id}-${log.created_at}`} className={styles.movement}>
                                        <div className={styles.movementTime}>
                                            <span className={styles.movementDate}>{formatDate(log.created_at)}</span>
                                            <span>{formatTime(log.created_at)}</span>
                                        </div>
                                        <div className={styles.movementBody}>
                                            <div className={styles.movementTop}>
                                                <span className={changeClass}>{signedChange}</span>
                                                <span className={styles.movementReason}>{log.reason}</span>
                                            </div>
                                            <div className={styles.movementMeta}>
                                                <span>{variant.sku ?? `#${variant.variant_id}`}</span>
                                                <span>{resolvePersonName(log.user, locale, t('System'))}</span>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <p className={styles.emptyNote}>{t('No inventory activity recorded yet.')}</p>
                    )}
                </section>
            </div>
        </WorkspaceLayout>
    );
}
