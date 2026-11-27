import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Filter, History as HistoryIcon, Package } from 'lucide-react';
import { useMemo, useState } from 'react';

import { PageHeader } from '@/components/layout/PageHeader';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import { Button } from '@/components/ui/button';
import DataTable from '@/components/ui/data-table';
import FormField from '@/components/ui/form-field';
import Pagination from '@/components/ui/pagination';
import { Select } from '@/components/ui/select';
import { cx } from '@/lib/cx';
import { formatDate, formatNumber, formatTime } from '@/lib/format';
import { useTranslation } from '@/lib/i18n';

import adminStyles from '@/components/admin/admin.module.css';
import railStyles from './Inventory.module.css';
import styles from './InventoryDetail.module.css';

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

const getVariantAttributes = (variant: VariantSummary | undefined, locale: string): string[] => {
    if (!variant) {
        return [];
    }

    const attributeValues = (variant.attributeValues ?? [])
        .map((attribute) => attribute.value ?? resolveText(attribute.name ?? attribute.attribute?.name, locale, ''))
        .filter((text): text is string => Boolean(text));

    if (attributeValues.length > 0) {
        return attributeValues;
    }

    return (variant.option_values ?? []).map((option) => [option.name, option.value].filter(Boolean).join(': ')).filter((text) => Boolean(text));
};

const getVariantLabel = (variant: VariantSummary | undefined, locale: string, fallback: string): string => {
    if (!variant) {
        return fallback;
    }

    const sku = variant.sku ?? `#${variant.variant_id}`;
    const attributes = getVariantAttributes(variant, locale);

    return attributes.length > 0 ? `${sku} (${attributes.join(', ')})` : sku;
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

interface VariantSummary {
    variant_id: number;
    sku?: string | null;
    attributeValues?: AttributeValue[];
    option_values?: Array<{ name?: string | null; value?: string | null }> | null;
}

interface InventoryLog {
    id?: number;
    variant_id?: number;
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
    from?: number | null;
    to?: number | null;
    total?: number;
}

interface Product {
    product_id: number;
    name?: string | Record<string, string>;
    seller?: Person;
    category?: Category;
    brand?: Brand;
    variants?: VariantSummary[];
}

interface Summary {
    total?: number;
    in?: number;
    out?: number;
    last?: string | null;
}

interface Filters {
    variant?: string | number;
    type?: string;
}

interface PageProps extends Record<string, unknown> {
    product: Product;
    history: PaginatedLogs;
    filters?: Filters;
    summary?: Summary;
    locale: string;
}

export default function History() {
    const { t, locale } = useTranslation();
    const { product, history, filters = {}, summary } = usePage<PageProps>().props;

    const [variant, setVariant] = useState(String(filters.variant ?? ''));
    const [type, setType] = useState(filters.type ?? '');

    const productName = resolveText(product?.name, locale, t('Unnamed Product'));
    const sellerName = resolvePersonName(product?.seller, locale, t('Unknown Seller'));
    const categoryName = resolveText(product?.category?.name, locale, t('No Category'));
    const brandName = resolveText(product?.brand?.name, locale, t('No Brand'));

    const logs = useMemo(() => history?.data ?? [], [history]);
    const hasFilters = Boolean(filters.variant || filters.type);
    const rangeLabel =
        (history?.total ?? 0) > 0
            ? `${formatNumber(history?.from ?? 0)}-${formatNumber(history?.to ?? 0)} / ${formatNumber(history?.total ?? 0)}`
            : formatNumber(0);

    const variantOptions = useMemo(() => product?.variants ?? [], [product]);

    const summaryItems = [
        { key: 'total', label: t('Total Changes'), value: formatNumber(summary?.total ?? 0) },
        { key: 'in', label: t('Stock In Entries'), value: formatNumber(summary?.in ?? 0) },
        { key: 'out', label: t('Stock Out Entries'), value: formatNumber(summary?.out ?? 0) },
        { key: 'last', label: t('Last Update'), value: summary?.last ? formatDate(summary.last) : '-' },
    ];

    const applyFilters = () => {
        router.get(
            `/admin/inventory/${product.product_id}/history`,
            {
                variant: variant || undefined,
                type: type || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const columns = useMemo(
        () => [
            {
                key: 'time',
                header: t('Time'),
                cell: (log: InventoryLog) => (
                    <div className={styles.time}>
                        <span className={styles.timeDate}>{formatDate(log.created_at)}</span>
                        <span className={styles.timeClock}>{formatTime(log.created_at)}</span>
                    </div>
                ),
            },
            {
                key: 'variant',
                header: t('Variant'),
                cell: (log: InventoryLog) => {
                    const attributes = getVariantAttributes(log.variant, locale);

                    return (
                        <div className={styles.variant}>
                            <span className={styles.variantSku}>{log.variant?.sku ?? `#${log.variant?.variant_id ?? '-'}`}</span>
                            <span className={styles.variantAttributes}>{attributes.length > 0 ? attributes.join(', ') : '-'}</span>
                        </div>
                    );
                },
            },
            {
                key: 'change',
                header: t('Change'),
                align: 'right' as const,
                cell: (log: InventoryLog) => (
                    <span
                        className={
                            log.quantity_change > 0
                                ? adminStyles.changePositive
                                : log.quantity_change < 0
                                  ? adminStyles.changeNegative
                                  : adminStyles.changeNeutral
                        }
                    >
                        {formatQuantity(log.quantity_change)}
                    </span>
                ),
            },
            {
                key: 'reason',
                header: t('Reason'),
                cell: (log: InventoryLog) => <span className={styles.reason}>{log.reason}</span>,
            },
            {
                key: 'user',
                header: t('User'),
                cell: (log: InventoryLog) => <span className={styles.user}>{resolvePersonName(log.user, locale, t('System'))}</span>,
            },
        ],
        [locale, t],
    );

    return (
        <WorkspaceLayout>
            <Head title={`${productName} - ${t('Inventory History')}`} />

            <div className={adminStyles.stack}>
                <PageHeader
                    breadcrumbs={[
                        { label: t('Dashboard'), href: '/admin/dashboard' },
                        { label: t('Inventory'), href: '/admin/inventory' },
                        { label: productName, href: `/admin/inventory/${product.product_id}` },
                        { label: t('History'), current: true },
                    ]}
                    title={t('Inventory History')}
                    description={
                        <span className={styles.headerMeta}>
                            <span>{productName}</span>
                            <span>#{product.product_id}</span>
                            <span>{sellerName}</span>
                            <span>
                                {categoryName} / {brandName}
                            </span>
                        </span>
                    }
                    actions={
                        <>
                            <Button asChild variant="primary" size="sm">
                                <Link href={`/admin/inventory/${product.product_id}`}>
                                    <ArrowLeft aria-hidden="true" />
                                    {t('Back to Product')}
                                </Link>
                            </Button>
                            <Button asChild variant="secondary" size="sm">
                                <Link href="/admin/inventory">
                                    <Package aria-hidden="true" />
                                    {t('Inventory Index')}
                                </Link>
                            </Button>
                        </>
                    }
                />

                <form
                    className={cx(styles.filters, 'sn-glass-surface')}
                    aria-label={t('Filters')}
                    onSubmit={(event) => {
                        event.preventDefault();
                        applyFilters();
                    }}
                >
                    <FormField label={t('Variant')} htmlFor="history-variant">
                        <Select id="history-variant" value={variant} onChange={(event) => setVariant(event.target.value)} surface="glass">
                            <option value="">{t('All variants')}</option>
                            {variantOptions.map((option) => (
                                <option key={option.variant_id} value={option.variant_id}>
                                    {getVariantLabel(option, locale, t('Variant'))}
                                </option>
                            ))}
                        </Select>
                    </FormField>

                    <FormField label={t('Movement type')} htmlFor="history-type">
                        <Select id="history-type" value={type} onChange={(event) => setType(event.target.value)} surface="glass">
                            <option value="">{t('All types')}</option>
                            <option value="in">{t('Stock In')}</option>
                            <option value="out">{t('Stock Out')}</option>
                        </Select>
                    </FormField>

                    <div className={styles.filterActions}>
                        <Button type="submit" variant="primary" leftIcon={Filter}>
                            {t('Apply')}
                        </Button>
                    </div>
                </form>

                <dl className={railStyles.summaryRail}>
                    {summaryItems.map((item) => (
                        <div key={item.key} className={railStyles.summary}>
                            <dt className={railStyles.summaryLabel}>{item.label}</dt>
                            <dd className={railStyles.summaryValue}>
                                {item.key === 'last' ? <span className={styles.summaryDate}>{item.value}</span> : item.value}
                            </dd>
                        </div>
                    ))}
                </dl>

                <div className={styles.table}>
                    <DataTable
                        columns={columns}
                        data={logs}
                        headerTitle={t('Inventory History')}
                        headerIcon={HistoryIcon}
                        headerMeta={rangeLabel}
                        emptyMessage={hasFilters ? t('No inventory changes match the filters.') : t('No inventory changes recorded')}
                    />
                </div>

                <Pagination links={history?.links ?? []} filters={{ variant, type }} />
            </div>
        </WorkspaceLayout>
    );
}
