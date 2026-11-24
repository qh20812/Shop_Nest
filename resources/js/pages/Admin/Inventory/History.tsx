import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Clock, History as HistoryIcon, Package, TrendingDown, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import DataTable from '@/components/ui/data-table';
import Header from '@/components/ui/header';
import Insights from '@/components/ui/insights';
import Pagination from '@/components/ui/pagination';
import AppLayout from '@/layouts/app/AppLayout';
import { formatDateTime, formatNumber } from '@/lib/format';
import { useTranslation } from '@/lib/i18n';

import styles from '@/components/admin/admin.module.css';

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

interface VariantSummary {
    variant_id: number;
    sku?: string;
    product?: {
        product_id: number;
        name?: string | Record<string, string>;
    };
}

interface InventoryLog {
    id?: number;
    quantity_change: number;
    reason: string;
    created_at: string;
    user?: Person;
    variant?: VariantSummary;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedLogs {
    data: InventoryLog[];
    links: PaginationLink[];
    meta?: {
        total?: number;
    };
}

interface Product {
    product_id: number;
    name?: string | Record<string, string>;
    seller?: Person;
    category?: Category;
    brand?: Brand;
}

interface PageProps extends Record<string, unknown> {
    product: Product;
    history: PaginatedLogs;
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

const formatQuantity = (value: number): string => {
    const absolute = formatNumber(Math.abs(value));
    if (value > 0) {
        return `+${absolute}`;
    }
    if (value < 0) {
        return `-${absolute}`;
    }
    return absolute;
};

export default function History() {
    const { t } = useTranslation();
    const { product, history, locale } = usePage<PageProps>().props;

    const productName = resolveText(product?.name, locale, t('Unnamed Product'));
    const sellerName = resolvePersonName(product?.seller, locale, t('Unknown Seller'));
    const categoryName = resolveText(product?.category?.name, locale, t('No Category'));
    const brandName = resolveText(product?.brand?.name, locale, t('No Brand'));

    const logs = useMemo(() => history?.data ?? [], [history]);
    const totalChanges = history?.meta?.total ?? logs.length;
    const stockInCount = useMemo(() => logs.filter((log) => log.quantity_change > 0).length, [logs]);
    const stockOutCount = useMemo(() => logs.filter((log) => log.quantity_change < 0).length, [logs]);
    const lastUpdate = logs.length > 0 ? formatDateTime(logs[0].created_at) : t('N/A');

    const columns = useMemo(
        () => [
            {
                key: 'timestamp',
                header: t('Timestamp'),
                cell: (log: InventoryLog) => <span className={styles.numeric}>{formatDateTime(log.created_at)}</span>,
            },
            {
                key: 'product',
                header: t('Product'),
                cell: (log: InventoryLog) => resolveText(log.variant?.product?.name, locale, t('Unknown Product')),
            },
            {
                key: 'sku',
                header: t('SKU'),
                cell: (log: InventoryLog) => <span className={styles.numeric}>{log.variant?.sku ?? `#${log.variant?.variant_id ?? '-'}`}</span>,
            },
            {
                key: 'variant',
                header: t('Variant ID'),
                cell: (log: InventoryLog) => <span className={styles.numeric}>#{log.variant?.variant_id ?? '-'}</span>,
            },
            {
                key: 'change',
                header: t('Change'),
                align: 'right' as const,
                cell: (log: InventoryLog) => (
                    <span
                        className={
                            log.quantity_change > 0 ? styles.changePositive : log.quantity_change < 0 ? styles.changeNegative : styles.changeNeutral
                        }
                    >
                        {formatQuantity(log.quantity_change)}
                    </span>
                ),
            },
            {
                key: 'reason',
                header: t('Reason'),
                cell: (log: InventoryLog) => <span className={styles.muted}>{log.reason}</span>,
            },
            {
                key: 'user',
                header: t('User'),
                cell: (log: InventoryLog) => <span className={styles.muted}>{resolvePersonName(log.user, locale, t('System'))}</span>,
            },
        ],
        [locale, t],
    );

    const summaryItems = [
        { icon: HistoryIcon, value: formatNumber(totalChanges), label: t('Total Changes') },
        { icon: TrendingUp, value: formatNumber(stockInCount), label: t('Stock In Entries') },
        { icon: TrendingDown, value: formatNumber(stockOutCount), label: t('Stock Out Entries') },
        { icon: Clock, value: lastUpdate, label: t('Last Update') },
    ];

    return (
        <AppLayout>
            <Head title={`${productName} - ${t('Inventory History')}`} />

            <Header
                title={t('Inventory History')}
                breadcrumbs={[
                    { label: t('Dashboard'), href: '/admin/dashboard' },
                    { label: t('Inventory'), href: '/admin/inventory' },
                    { label: productName, href: `/admin/inventory/${product.product_id}` },
                    { label: t('History'), href: `/admin/inventory/${product.product_id}/history`, active: true },
                ]}
            />

            <div className={styles.actions}>
                <Button asChild variant="secondary">
                    <Link href={`/admin/inventory/${product.product_id}`}>
                        <ArrowLeft aria-hidden="true" />
                        {t('Back to Product')}
                    </Link>
                </Button>
                <Button asChild variant="primary">
                    <Link href="/admin/inventory">
                        <Package aria-hidden="true" />
                        {t('Inventory Index')}
                    </Link>
                </Button>
            </div>

            <section className={styles.section}>
                <div className={styles.sectionHead}>
                    <h2 className={styles.sectionTitle}>
                        <Package aria-hidden="true" className={styles.sectionIcon} />
                        {t('Product Overview')}
                    </h2>
                    <Badge tone="neutral">#{product.product_id}</Badge>
                </div>

                <div className={styles.detailGrid}>
                    <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>{t('Product')}</span>
                        <span className={styles.detailValue}>{productName}</span>
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
                </div>
            </section>

            <Insights items={summaryItems} />

            <DataTable
                columns={columns}
                data={logs}
                headerTitle={t('Inventory History')}
                headerIcon={HistoryIcon}
                emptyMessage={t('No inventory changes recorded')}
            />

            <Pagination links={history?.links ?? []} />
        </AppLayout>
    );
}
