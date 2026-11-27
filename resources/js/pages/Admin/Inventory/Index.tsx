import { Head, Link, router, usePage } from '@inertiajs/react';
import { ListChecks, Package, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import Toast from '@/components/admin/users/Toast';
import { PageHeader } from '@/components/layout/PageHeader';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import ActionButtons, { type ActionConfig } from '@/components/ui/action-buttons';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import DataTable from '@/components/ui/data-table';
import FormField from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import Pagination from '@/components/ui/pagination';
import { Select } from '@/components/ui/select';
import { cx } from '@/lib/cx';
import { formatNumber, formatVnd } from '@/lib/format';
import { useTranslation } from '@/lib/i18n';

import adminStyles from '@/components/admin/admin.module.css';
import styles from './Inventory.module.css';

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

interface Seller extends Person {
    id: number;
}

interface Category {
    category_id: number;
    name?: string | Record<string, string>;
}

interface Brand {
    brand_id: number;
    name?: string | Record<string, string>;
}

interface StockStatusOption {
    value: string;
    label: string;
}

interface ProductSummary {
    product_id: number;
    name?: string | Record<string, string>;
    seller?: Seller;
    category?: Category;
    brand?: Brand;
}

interface InventoryVariant {
    variant_id: number;
    sku?: string;
    stock_quantity?: number;
    price?: number;
    discount_price?: number;
    reserved_quantity?: number;
    product?: ProductSummary;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Paginated<T> {
    data: T[];
    links: PaginationLink[];
    meta?: {
        total?: number;
        per_page?: number;
        current_page?: number;
        from?: number;
        to?: number;
    };
}

interface FilterState {
    search?: string;
    seller_id?: string;
    category_id?: string;
    brand_id?: string;
    stock_status?: string;
}

interface FlashMessages {
    success?: string;
    error?: string;
}

interface InventoryIndexPageProps {
    variants: Paginated<InventoryVariant>;
    filters: FilterState;
    sellers: Seller[];
    categories: Category[];
    brands: Brand[];
    stockStatuses: StockStatusOption[];
    flash?: FlashMessages;
    locale: string;
    [key: string]: unknown;
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

export default function Index() {
    const { t } = useTranslation();
    const {
        variants,
        filters = {},
        sellers = [],
        categories = [],
        brands = [],
        stockStatuses = [],
        flash = {},
        locale,
    } = usePage<InventoryIndexPageProps>().props;

    const [search, setSearch] = useState(filters.search ?? '');
    const [sellerId, setSellerId] = useState(filters.seller_id ?? '');
    const [categoryId, setCategoryId] = useState(filters.category_id ?? '');
    const [brandId, setBrandId] = useState(filters.brand_id ?? '');
    const [stockStatus, setStockStatus] = useState(filters.stock_status ?? '');
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    useEffect(() => {
        if (flash?.success) {
            setToast({ type: 'success', message: flash.success });
        } else if (flash?.error) {
            setToast({ type: 'error', message: flash.error });
        }
    }, [flash]);

    const stockStatusLabelMap = useMemo(() => {
        const map: Record<string, string> = {};
        stockStatuses.forEach((status) => {
            map[status.value] = status.label;
        });
        return map;
    }, [stockStatuses]);

    const displayedVariants = useMemo(() => variants?.data ?? [], [variants]);
    const totalVariants = variants?.meta?.total ?? displayedVariants.length;

    const statusBreakdown = useMemo(() => {
        let inStock = 0;
        let lowStock = 0;
        let outOfStock = 0;

        displayedVariants.forEach((variant) => {
            const status = getStockStatusValue(variant.stock_quantity);

            if (status === 'in_stock') {
                inStock += 1;
            } else if (status === 'low_stock') {
                lowStock += 1;
            } else {
                outOfStock += 1;
            }
        });

        return { inStock, lowStock, outOfStock };
    }, [displayedVariants]);

    const applyFilters = () => {
        router.get(
            '/admin/inventory',
            {
                search: search || undefined,
                seller_id: sellerId || undefined,
                category_id: categoryId || undefined,
                brand_id: brandId || undefined,
                stock_status: stockStatus || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const rangeLabel =
        totalVariants > 0
            ? `${formatNumber(variants?.meta?.from ?? 0)}-${formatNumber(variants?.meta?.to ?? 0)} / ${formatNumber(totalVariants)}`
            : formatNumber(0);

    const summaryItems = [
        { key: 'total', label: t('Total Variants'), value: formatNumber(totalVariants) },
        { key: 'page', label: t('Variants on Page'), value: formatNumber(displayedVariants.length) },
        { key: 'low', label: t('Low Stock (page)'), value: formatNumber(statusBreakdown.lowStock) },
        { key: 'out', label: t('Out of Stock (page)'), value: formatNumber(statusBreakdown.outOfStock) },
    ];

    const columns = useMemo(
        () => [
            {
                key: 'product',
                header: t('Product'),
                cell: (variant: InventoryVariant) => {
                    const productName = resolveText(variant.product?.name, locale, t('Unnamed Product'));
                    const productId = variant.product?.product_id;
                    const categoryName = resolveText(variant.product?.category?.name, locale, t('No Category'));
                    const brandName = resolveText(variant.product?.brand?.name, locale, t('No Brand'));

                    return (
                        <div className={styles.product}>
                            {productId ? (
                                <Link
                                    href={`/admin/inventory/${productId}`}
                                    className={cx(adminStyles.linkCell, styles.productName)}
                                    title={productName}
                                >
                                    {productName}
                                </Link>
                            ) : (
                                <span className={styles.productName} title={productName}>
                                    {productName}
                                </span>
                            )}
                            <span className={styles.sku}>{variant.sku ?? '-'}</span>
                            <span className={styles.taxonomy} title={`${categoryName} / ${brandName}`}>
                                <span className={styles.taxonomyText}>{categoryName}</span>
                                <span aria-hidden="true" className={styles.taxonomySeparator}>
                                    /
                                </span>
                                <span className={styles.taxonomyText}>{brandName}</span>
                            </span>
                        </div>
                    );
                },
            },
            {
                key: 'seller',
                header: t('Seller'),
                cell: (variant: InventoryVariant) => {
                    const sellerName = resolvePersonName(variant.product?.seller, locale, t('Unknown Seller'));

                    return (
                        <span className={styles.seller} title={sellerName}>
                            {sellerName}
                        </span>
                    );
                },
            },
            {
                key: 'price',
                header: t('Price'),
                align: 'right' as const,
                cell: (variant: InventoryVariant) => (
                    <div className={styles.priceCell}>
                        <span className={adminStyles.price}>
                            {variant.price !== undefined && variant.price !== null ? formatVnd(variant.price) : t('N/A')}
                        </span>
                        {variant.discount_price !== undefined && variant.discount_price !== null && (
                            <span className={styles.discount}>
                                {t('Discount')} {formatVnd(variant.discount_price)}
                            </span>
                        )}
                    </div>
                ),
            },
            {
                key: 'stock',
                header: t('Stock'),
                align: 'right' as const,
                cell: (variant: InventoryVariant) => {
                    const statusValue = getStockStatusValue(variant.stock_quantity);
                    const label = stockStatusLabelMap[statusValue] ?? t('Unknown');

                    return (
                        <div className={styles.stockCell}>
                            <span className={adminStyles.numeric}>{formatNumber(variant.stock_quantity ?? 0)}</span>
                            <Badge tone={getStockTone(statusValue)}>{label}</Badge>
                        </div>
                    );
                },
            },
            {
                key: 'actions',
                header: t('Actions'),
                cell: (variant: InventoryVariant) => {
                    const productId = variant.product?.product_id;
                    if (!productId) return null;

                    const actions: ActionConfig[] = [
                        { type: 'link', href: `/admin/inventory/${productId}`, icon: Package, label: t('View'), variant: 'primary' },
                        { type: 'link', href: `/admin/inventory/${productId}/history`, icon: ListChecks, label: t('History'), variant: 'primary' },
                    ];

                    return <ActionButtons actions={actions} />;
                },
            },
        ],
        [locale, stockStatusLabelMap, t],
    );

    const paginationFilters = { search, seller_id: sellerId, category_id: categoryId, brand_id: brandId, stock_status: stockStatus };

    return (
        <WorkspaceLayout>
            <Head title={t('Inventory Management')} />

            {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

            <div className={adminStyles.stack}>
                <PageHeader
                    breadcrumbs={[
                        { label: t('Dashboard'), href: '/admin/dashboard' },
                        { label: t('Inventory'), current: true },
                    ]}
                    title={t('Inventory Management')}
                />

                <form
                    className={cx(styles.filters, 'sn-glass-surface')}
                    aria-label={t('Filters')}
                    onSubmit={(event) => {
                        event.preventDefault();
                        applyFilters();
                    }}
                >
                    <FormField label={t('Search')} htmlFor="inventory-search">
                        <Input
                            id="inventory-search"
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder={t('Search by product name or SKU...')}
                            leadingIcon={Search}
                            surface="glass"
                        />
                    </FormField>

                    <FormField label={t('Seller')} htmlFor="inventory-seller">
                        <Select id="inventory-seller" value={sellerId} onChange={(event) => setSellerId(event.target.value)} surface="glass">
                            <option value="">{t('-- All Sellers --')}</option>
                            {sellers.map((seller) => (
                                <option key={seller.id} value={seller.id}>
                                    {resolvePersonName(seller, locale, t('Unknown Seller'))}
                                </option>
                            ))}
                        </Select>
                    </FormField>

                    <FormField label={t('Category')} htmlFor="inventory-category">
                        <Select id="inventory-category" value={categoryId} onChange={(event) => setCategoryId(event.target.value)} surface="glass">
                            <option value="">{t('-- All Categories --')}</option>
                            {categories.map((category) => (
                                <option key={category.category_id} value={category.category_id}>
                                    {resolveText(category.name, locale, t('No Category'))}
                                </option>
                            ))}
                        </Select>
                    </FormField>

                    <FormField label={t('Brand')} htmlFor="inventory-brand">
                        <Select id="inventory-brand" value={brandId} onChange={(event) => setBrandId(event.target.value)} surface="glass">
                            <option value="">{t('-- All Brands --')}</option>
                            {brands.map((brand) => (
                                <option key={brand.brand_id} value={brand.brand_id}>
                                    {resolveText(brand.name, locale, t('No Brand'))}
                                </option>
                            ))}
                        </Select>
                    </FormField>

                    <FormField label={t('Stock Status')} htmlFor="inventory-stock">
                        <Select id="inventory-stock" value={stockStatus} onChange={(event) => setStockStatus(event.target.value)} surface="glass">
                            <option value="">{t('-- All Stock Statuses --')}</option>
                            {stockStatuses.map((status) => (
                                <option key={status.value} value={status.value}>
                                    {status.label}
                                </option>
                            ))}
                        </Select>
                    </FormField>

                    <div className={styles.filterActions}>
                        <Button type="submit" variant="primary" leftIcon={Search}>
                            {t('Apply')}
                        </Button>
                    </div>
                </form>

                <dl className={styles.summaryRail}>
                    {summaryItems.map((item) => (
                        <div key={item.key} className={styles.summary}>
                            <dt className={styles.summaryLabel}>{item.label}</dt>
                            <dd className={styles.summaryValue}>{item.value}</dd>
                        </div>
                    ))}
                </dl>

                <div className={styles.table}>
                    <DataTable
                        columns={columns}
                        data={displayedVariants}
                        headerTitle={t('Inventory Overview')}
                        headerIcon={Package}
                        headerMeta={rangeLabel}
                        emptyMessage={t('No inventory records found')}
                    />
                </div>

                <Pagination links={variants?.links ?? []} filters={paginationFilters} />
            </div>
        </WorkspaceLayout>
    );
}
