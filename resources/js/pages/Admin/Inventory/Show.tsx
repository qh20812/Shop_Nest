import { Head, Link, usePage } from '@inertiajs/react';
import { AlertTriangle, ArrowLeft, Boxes, History, Layers, Package, PackageX } from 'lucide-react';
import { useMemo } from 'react';

import ActionButtons, { type ActionConfig } from '@/components/ui/action-buttons';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import DataTable from '@/components/ui/data-table';
import Header from '@/components/ui/header';
import Insights from '@/components/ui/insights';
import AppLayout from '@/layouts/app/AppLayout';
import { formatDateTime, formatNumber, formatVnd } from '@/lib/format';
import { useTranslation } from '@/lib/i18n';

import styles from '@/components/admin/admin.module.css';

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

interface InventoryLog {
    id?: number;
    quantity_change: number;
    reason: string;
    created_at: string;
    user?: Person;
}

interface AttributeValue {
    value?: string;
    name?: string | Record<string, string>;
}

interface InventoryVariant {
    variant_id: number;
    sku?: string;
    stock_quantity?: number;
    reserved_quantity?: number;
    price?: number;
    discount_price?: number;
    attribute_values?: AttributeValue[];
    attributeValues?: AttributeValue[];
    inventory_logs?: InventoryLog[];
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

const getStockStatusValue = (stockQuantity?: number): 'in_stock' | 'low_stock' | 'out_of_stock' => {
    const quantity = stockQuantity ?? 0;

    if (quantity <= 0) {
        return 'out_of_stock';
    }

    if (quantity <= LOW_STOCK_THRESHOLD) {
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

const getVariantLogs = (variant: InventoryVariant): InventoryLog[] => variant.inventory_logs ?? variant.inventoryLogs ?? [];

const getVariantAttributes = (variant: InventoryVariant, locale: string): string[] => {
    const source = variant.attribute_values ?? variant.attributeValues;
    if (!Array.isArray(source)) {
        return [];
    }

    return source.map((attribute) => attribute.value ?? resolveText(attribute.name, locale, '')).filter((text): text is string => Boolean(text));
};

export default function Show() {
    const { t } = useTranslation();
    const { product, locale } = usePage<PageProps>().props;

    const variants = useMemo(() => product?.variants ?? [], [product]);
    const stockStatusLabels = useMemo(
        () => ({
            in_stock: t('In Stock'),
            low_stock: t('Low Stock'),
            out_of_stock: t('Out of Stock'),
        }),
        [t],
    );

    const productName = resolveText(product?.name, locale, t('Unnamed Product'));
    const sellerName = resolvePersonName(product?.seller, locale, t('Unknown Seller'));
    const categoryName = resolveText(product?.category?.name, locale, t('No Category'));
    const brandName = resolveText(product?.brand?.name, locale, t('No Brand'));

    const totalStock = useMemo(() => variants.reduce((sum, variant) => sum + (variant.stock_quantity ?? 0), 0), [variants]);
    const lowStockCount = useMemo(() => variants.filter((variant) => getStockStatusValue(variant.stock_quantity) === 'low_stock').length, [variants]);
    const outOfStockCount = useMemo(
        () => variants.filter((variant) => getStockStatusValue(variant.stock_quantity) === 'out_of_stock').length,
        [variants],
    );

    const historyLink = `/admin/inventory/${product.product_id}/history`;

    const columns = useMemo(
        () => [
            {
                key: 'sku',
                header: t('SKU'),
                cell: (variant: InventoryVariant) => <span className={styles.numeric}>{variant.sku ?? `#${variant.variant_id}`}</span>,
            },
            {
                key: 'attributes',
                header: t('Attributes'),
                cell: (variant: InventoryVariant) => {
                    const attributes = getVariantAttributes(variant, locale);
                    return <span className={styles.muted}>{attributes.length > 0 ? attributes.join(', ') : '-'}</span>;
                },
            },
            {
                key: 'reserved',
                header: t('Reserved'),
                align: 'right' as const,
                cell: (variant: InventoryVariant) => <span className={styles.numeric}>{formatNumber(variant.reserved_quantity ?? 0)}</span>,
            },
            {
                key: 'price',
                header: t('Price'),
                align: 'right' as const,
                cell: (variant: InventoryVariant) => (
                    <span className={styles.price}>
                        {variant.price !== undefined && variant.price !== null ? formatVnd(variant.price) : t('N/A')}
                    </span>
                ),
            },
            {
                key: 'quantity',
                header: t('Qty'),
                align: 'right' as const,
                cell: (variant: InventoryVariant) => <span className={styles.numeric}>{formatNumber(variant.stock_quantity ?? 0)}</span>,
            },
            {
                key: 'status',
                header: t('Status'),
                cell: (variant: InventoryVariant) => {
                    const statusValue = getStockStatusValue(variant.stock_quantity);
                    return <Badge tone={getStockTone(statusValue)}>{stockStatusLabels[statusValue]}</Badge>;
                },
            },
            {
                key: 'actions',
                header: t('Actions'),
                cell: (variant: InventoryVariant) => {
                    const actions: ActionConfig[] = [
                        {
                            type: 'link',
                            href: `${historyLink}?variant=${variant.variant_id}`,
                            icon: History,
                            label: t('History'),
                            variant: 'primary',
                        },
                    ];
                    return <ActionButtons actions={actions} />;
                },
            },
        ],
        [historyLink, locale, stockStatusLabels, t],
    );

    const summaryItems = [
        { icon: Package, value: formatNumber(totalStock), label: t('Total Stock') },
        { icon: AlertTriangle, value: formatNumber(lowStockCount), label: t('Low Stock Variants') },
        { icon: PackageX, value: formatNumber(outOfStockCount), label: t('Out of Stock Variants') },
        { icon: Layers, value: formatNumber(variants.length), label: t('Total Variants') },
    ];

    const hasAnyLogs = useMemo(() => variants.some((variant) => getVariantLogs(variant).length > 0), [variants]);

    return (
        <AppLayout>
            <Head title={`${productName} - ${t('Inventory')}`} />

            <Header
                title={t('Inventory Details')}
                breadcrumbs={[
                    { label: t('Dashboard'), href: '/admin/dashboard' },
                    { label: t('Inventory'), href: '/admin/inventory' },
                    { label: productName, href: `/admin/inventory/${product.product_id}`, active: true },
                ]}
            />

            <div className={styles.actions}>
                <Button asChild variant="secondary">
                    <Link href="/admin/inventory">
                        <ArrowLeft aria-hidden="true" />
                        {t('Back to Inventory')}
                    </Link>
                </Button>
                <Button asChild variant="primary">
                    <Link href={historyLink}>
                        <History aria-hidden="true" />
                        {t('View History')}
                    </Link>
                </Button>
            </div>

            <section className={styles.section}>
                <div className={styles.sectionHead}>
                    <h2 className={styles.sectionTitle}>
                        <Boxes aria-hidden="true" className={styles.sectionIcon} />
                        {t('Product Overview')}
                    </h2>
                </div>

                <div className={styles.detailGrid}>
                    <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>{t('Product')}</span>
                        <span className={styles.detailValue}>{productName}</span>
                    </div>
                    <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>{t('Product ID')}</span>
                        <span className={styles.detailValue}>#{product.product_id}</span>
                    </div>
                    <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>{t('Seller')}</span>
                        <span className={styles.detailValue}>{sellerName}</span>
                    </div>
                    <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>{t('Category')}</span>
                        <span className={styles.detailValue}>{categoryName}</span>
                    </div>
                    <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>{t('Brand')}</span>
                        <span className={styles.detailValue}>{brandName}</span>
                    </div>
                    <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>{t('Total Stock')}</span>
                        <span className={styles.detailValue}>{formatNumber(totalStock)}</span>
                    </div>
                </div>
            </section>

            <Insights items={summaryItems} />

            <DataTable
                columns={columns}
                data={variants}
                headerTitle={t('Variant Inventory')}
                headerIcon={Layers}
                emptyMessage={t('No variants found')}
            />

            <section className={styles.section}>
                <div className={styles.sectionHead}>
                    <h2 className={styles.sectionTitle}>
                        <History aria-hidden="true" className={styles.sectionIcon} />
                        {t('Recent Inventory Activity')}
                    </h2>
                </div>
                <p className={styles.note}>{t('Showing the latest 20 changes per variant.')}</p>

                {hasAnyLogs ? (
                    <div className={styles.logGrid}>
                        {variants.map((variant) => {
                            const logs = getVariantLogs(variant);
                            const statusValue = getStockStatusValue(variant.stock_quantity);
                            const attributes = getVariantAttributes(variant, locale);

                            return (
                                <div key={variant.variant_id} className={styles.logCard}>
                                    <div className={styles.logCardHead}>
                                        <span className={styles.cellTitle}>{variant.sku ?? `${t('Variant')} #${variant.variant_id}`}</span>
                                        <Badge tone={getStockTone(statusValue)}>{stockStatusLabels[statusValue]}</Badge>
                                    </div>

                                    {attributes.length > 0 && (
                                        <span className={styles.cellMeta}>
                                            {t('Attributes')}: {attributes.join(', ')}
                                        </span>
                                    )}

                                    <ul className={styles.logList}>
                                        {logs.length > 0 ? (
                                            logs.map((log, index) => {
                                                const changeClass =
                                                    log.quantity_change > 0
                                                        ? styles.changePositive
                                                        : log.quantity_change < 0
                                                          ? styles.changeNegative
                                                          : styles.changeNeutral;
                                                const formattedChange = formatNumber(Math.abs(log.quantity_change));
                                                const signedChange = `${log.quantity_change > 0 ? '+' : log.quantity_change < 0 ? '-' : ''}${formattedChange}`;

                                                return (
                                                    <li key={log.id ?? `${variant.variant_id}-${log.created_at}-${index}`} className={styles.logItem}>
                                                        <div className={styles.logTop}>
                                                            <span className={changeClass}>{signedChange}</span>
                                                            <span className={styles.logReason}>{log.reason}</span>
                                                        </div>
                                                        <div className={styles.logMeta}>
                                                            <span>{resolvePersonName(log.user, locale, t('System'))}</span>
                                                            <span>{formatDateTime(log.created_at)}</span>
                                                        </div>
                                                    </li>
                                                );
                                            })
                                        ) : (
                                            <li className={styles.muted}>{t('No recent movements for this variant.')}</li>
                                        )}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className={styles.emptyBox}>{t('No inventory activity recorded yet.')}</div>
                )}
            </section>
        </AppLayout>
    );
}
