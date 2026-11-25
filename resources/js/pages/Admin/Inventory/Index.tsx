import { Head, Link, router, usePage } from '@inertiajs/react';
import { AlertTriangle, Boxes, ListChecks, Package, PackageX } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import Toast from '@/components/admin/users/Toast';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import ActionButtons, { type ActionConfig } from '@/components/ui/action-buttons';
import { Badge } from '@/components/ui/badge';
import DataTable from '@/components/ui/data-table';
import FilterPanel from '@/components/ui/filter-panel';
import Insights from '@/components/ui/insights';
import Pagination from '@/components/ui/pagination';
import { formatNumber, formatVnd } from '@/lib/format';
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

    const columns = useMemo(
        () => [
            {
                key: 'product',
                header: t('Product'),
                cell: (variant: InventoryVariant) => {
                    const productName = resolveText(variant.product?.name, locale, t('Unnamed Product'));
                    const productId = variant.product?.product_id;

                    return productId ? (
                        <Link href={`/admin/inventory/${productId}`} className={styles.linkCell}>
                            {productName}
                        </Link>
                    ) : (
                        <span>{productName}</span>
                    );
                },
            },
            {
                key: 'sku',
                header: t('SKU'),
                cell: (variant: InventoryVariant) => <span className={styles.numeric}>{variant.sku ?? '-'}</span>,
            },
            {
                key: 'seller',
                header: t('Seller'),
                cell: (variant: InventoryVariant) => (
                    <span className={styles.muted}>{resolvePersonName(variant.product?.seller, locale, t('Unknown Seller'))}</span>
                ),
            },
            {
                key: 'category',
                header: t('Category'),
                cell: (variant: InventoryVariant) => (
                    <span className={styles.muted}>{resolveText(variant.product?.category?.name, locale, t('No Category'))}</span>
                ),
            },
            {
                key: 'brand',
                header: t('Brand'),
                cell: (variant: InventoryVariant) => (
                    <span className={styles.muted}>{resolveText(variant.product?.brand?.name, locale, t('No Brand'))}</span>
                ),
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
                key: 'discount',
                header: t('Discount'),
                align: 'right' as const,
                cell: (variant: InventoryVariant) => (
                    <span className={styles.numeric}>
                        {variant.discount_price !== undefined && variant.discount_price !== null ? formatVnd(variant.discount_price) : '-'}
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
                    const label = stockStatusLabelMap[statusValue] ?? t('Unknown');

                    return <Badge tone={getStockTone(statusValue)}>{label}</Badge>;
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

    const summaryItems = [
        { icon: Boxes, value: formatNumber(totalVariants), label: t('Total Variants') },
        { icon: ListChecks, value: formatNumber(displayedVariants.length), label: t('Variants on Page') },
        { icon: AlertTriangle, value: formatNumber(statusBreakdown.lowStock), label: t('Low Stock (page)') },
        { icon: PackageX, value: formatNumber(statusBreakdown.outOfStock), label: t('Out of Stock (page)') },
    ];

    const paginationFilters = { search, seller_id: sellerId, category_id: categoryId, brand_id: brandId, stock_status: stockStatus };

    return (
        <WorkspaceLayout>
            <Head title={t('Inventory Management')} />

            {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

            <div className={styles.stack}>
                <FilterPanel
                    title={t('Inventory Management')}
                    breadcrumbs={[
                        { label: t('Dashboard'), href: '/admin/dashboard' },
                        { label: t('Inventory'), href: '/admin/inventory', active: true },
                    ]}
                    onApplyFilters={applyFilters}
                    searchConfig={{
                        value: search,
                        onChange: setSearch,
                        placeholder: t('Search by product name or SKU...'),
                    }}
                    filterConfigs={[
                        {
                            value: sellerId,
                            onChange: setSellerId,
                            label: t('-- All Sellers --'),
                            options: sellers.map((seller) => ({
                                value: String(seller.id),
                                label: resolvePersonName(seller, locale, t('Unknown Seller')),
                            })),
                        },
                        {
                            value: categoryId,
                            onChange: setCategoryId,
                            label: t('-- All Categories --'),
                            options: categories.map((category) => ({
                                value: String(category.category_id),
                                label: resolveText(category.name, locale, t('No Category')),
                            })),
                        },
                        {
                            value: brandId,
                            onChange: setBrandId,
                            label: t('-- All Brands --'),
                            options: brands.map((brand) => ({
                                value: String(brand.brand_id),
                                label: resolveText(brand.name, locale, t('No Brand')),
                            })),
                        },
                        {
                            value: stockStatus,
                            onChange: setStockStatus,
                            label: t('-- All Stock Statuses --'),
                            options: stockStatuses.map((status) => ({ value: status.value, label: status.label })),
                        },
                    ]}
                />

                <Insights items={summaryItems} />

                <DataTable
                    columns={columns}
                    data={displayedVariants}
                    headerTitle={t('Inventory Overview')}
                    headerIcon={Package}
                    emptyMessage={t('No inventory records found')}
                />

                <Pagination links={variants?.links ?? []} filters={paginationFilters} />
            </div>
        </WorkspaceLayout>
    );
}
