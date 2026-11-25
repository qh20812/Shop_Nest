import ProductInfoCell from '@/components/admin/products/ProductInfoCell';
import { ConfirmDialog } from '@/components/feedback/ConfirmDialog';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import ActionButtons, { type ActionConfig } from '@/components/ui/action-buttons';
import { Badge } from '@/components/ui/badge';
import { DataTable, type DataTableColumn } from '@/components/ui/data-table';
import FilterPanel from '@/components/ui/filter-panel';
import Pagination from '@/components/ui/pagination';
import StatusBadge from '@/components/ui/status-badge';
import { formatVnd } from '@/lib/format';
import { useTranslation } from '@/lib/i18n';
import { Head, router, usePage } from '@inertiajs/react';
import { Eye, Package, Pencil, Plus, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import styles from '../seller.module.css';

interface Category {
    category_id: number;
    name: string | Record<string, string>;
}

interface Brand {
    brand_id: number;
    name: string | Record<string, string>;
}

interface ProductVariant {
    price: number;
    stock_quantity?: number;
}

interface Product {
    product_id: number;
    name: string | Record<string, string>;
    category?: { category_id: number; name: string | Record<string, string> } | null;
    brand?: { brand_id: number; name: string | Record<string, string> } | null;
    status: number;
    variants?: ProductVariant[];
    variants_count?: number;
    variants_sum_stock_quantity?: number | string | null;
    images?: Array<{ image_url: string; is_primary: boolean }>;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedProducts {
    data: Product[];
    links: PaginationLink[];
    meta?: {
        total?: number;
    };
}

type ProductInfoCellProduct = Parameters<typeof ProductInfoCell>[0]['product'];

interface SellerProductsPageProps extends Record<string, unknown> {
    products: PaginatedProducts;
    filters: {
        search?: string | null;
        category_id?: string | number | null;
        brand_id?: string | number | null;
        status?: string | number | null;
    };
    categories: Category[];
    brands: Brand[];
}

export default function Index() {
    const { t } = useTranslation();
    const { products, filters, categories, brands } = usePage<SellerProductsPageProps>().props;

    const [search, setSearch] = useState(filters?.search ? String(filters.search) : '');
    const [categoryId, setCategoryId] = useState(filters?.category_id ? String(filters.category_id) : '');
    const [brandId, setBrandId] = useState(filters?.brand_id ? String(filters.brand_id) : '');
    const [status, setStatus] = useState(filters?.status ? String(filters.status) : '');
    const [pendingDelete, setPendingDelete] = useState<Product | null>(null);

    useEffect(() => {
        setSearch(filters?.search ? String(filters.search) : '');
        setCategoryId(filters?.category_id ? String(filters.category_id) : '');
        setBrandId(filters?.brand_id ? String(filters.brand_id) : '');
        setStatus(filters?.status ? String(filters.status) : '');
    }, [filters]);

    const applyFilters = useCallback(() => {
        router.get(
            '/seller/products',
            {
                search: search || undefined,
                category_id: categoryId || undefined,
                brand_id: brandId || undefined,
                status: status || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    }, [brandId, categoryId, search, status]);

    const getStringValue = useCallback((value: string | Record<string, string> | undefined | null): string => {
        if (!value) return '';
        if (typeof value === 'string') return value;
        const locale = document.documentElement.lang || 'en';
        return value[locale] || value['en'] || value['vi'] || Object.values(value)[0] || '';
    }, []);

    const getProductStatus = useCallback((productStatus: number) => {
        switch (productStatus) {
            case 1:
                return 'pending';
            case 2:
                return 'active';
            case 3:
                return 'inactive';
            default:
                return 'pending';
        }
    }, []);

    const getProductPrice = useCallback((product: Product) => {
        if (!product.variants || product.variants.length === 0) {
            return null;
        }

        const prices = product.variants.map((variant) => Number(variant.price)).filter((price) => !Number.isNaN(price));

        if (prices.length === 0) {
            return null;
        }

        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        if (minPrice === maxPrice) {
            return formatVnd(minPrice);
        }

        return `${formatVnd(minPrice)} - ${formatVnd(maxPrice)}`;
    }, []);

    const handleDelete = useCallback(() => {
        if (!pendingDelete) {
            return;
        }

        router.delete(`/seller/products/${pendingDelete.product_id}`, {
            preserveScroll: true,
        });
    }, [pendingDelete]);

    const productData = useMemo(() => products?.data ?? [], [products]);

    const totalProducts = useMemo(() => {
        return products?.meta?.total ?? productData.length;
    }, [productData.length, products?.meta?.total]);

    const adaptProductForCell = useCallback(
        (product: Product): ProductInfoCellProduct => ({
            ...product,
            category: product.category ?? { name: t('No Category') },
            images: product.images ?? [],
        }),
        [t],
    );

    const productColumns = useMemo<DataTableColumn<Product>[]>(
        () => [
            {
                key: 'product_info',
                header: t('Product'),
                cell: (product) => <ProductInfoCell product={adaptProductForCell(product)} />,
            },
            {
                key: 'category_name',
                header: t('Category'),
                cell: (product) => <span className={styles.cellMeta}>{getStringValue(product.category?.name) || t('No Category')}</span>,
            },
            {
                key: 'brand_name',
                header: t('Brand'),
                cell: (product) => <span className={styles.cellMeta}>{getStringValue(product.brand?.name) || t('No Brand')}</span>,
            },
            {
                key: 'price_range',
                header: t('Price'),
                align: 'right',
                cell: (product) => {
                    const price = getProductPrice(product);

                    return price ? <span className={styles.price}>{price}</span> : <span className={styles.cellMeta}>{t('No variants')}</span>;
                },
            },
            {
                key: 'stock_quantity',
                header: t('Stock'),
                align: 'right',
                cell: (product) => {
                    const stock = Number(product.variants_sum_stock_quantity ?? 0);

                    return (
                        <Badge tone={stock > 0 ? 'success' : 'danger'} size="sm">
                            {stock.toLocaleString('vi-VN')} {t('units')}
                        </Badge>
                    );
                },
            },
            {
                key: 'status',
                header: t('Status'),
                cell: (product) => <StatusBadge status={getProductStatus(product.status)} />,
            },
            {
                key: 'actions',
                header: t('Actions'),
                align: 'right',
                cell: (product) => {
                    const actions: ActionConfig[] = [
                        {
                            type: 'link',
                            href: `/seller/products/${product.product_id}`,
                            variant: 'primary',
                            icon: Eye,
                            label: 'View',
                        },
                        {
                            type: 'link',
                            href: `/seller/products/${product.product_id}/edit`,
                            variant: 'primary',
                            icon: Pencil,
                            label: 'Edit',
                        },
                        {
                            type: 'button',
                            onClick: () => setPendingDelete(product),
                            variant: 'danger',
                            icon: Trash2,
                            label: 'Delete',
                        },
                    ];

                    return <ActionButtons actions={actions} />;
                },
            },
        ],
        [adaptProductForCell, getProductPrice, getProductStatus, getStringValue, t],
    );

    return (
        <WorkspaceLayout>
            <Head title={t('Seller Product Management')} />

            <FilterPanel
                title={t('Product Management')}
                breadcrumbs={[
                    { label: t('Dashboard'), href: '/seller/dashboard' },
                    { label: t('Products'), href: '/seller/products', active: true },
                ]}
                reportButtonConfig={{
                    label: t('Create Product'),
                    icon: Plus,
                    onClick: () => router.visit('/seller/products/create'),
                }}
                searchConfig={{
                    value: search,
                    onChange: setSearch,
                    placeholder: t('Search by product name or SKU...'),
                }}
                filterConfigs={[
                    {
                        value: categoryId,
                        onChange: setCategoryId,
                        label: t('-- All Categories --'),
                        options: (categories ?? []).map((category) => ({
                            value: category.category_id,
                            label: getStringValue(category.name),
                        })),
                    },
                    {
                        value: brandId,
                        onChange: setBrandId,
                        label: t('-- All Brands --'),
                        options: (brands ?? []).map((brand) => ({
                            value: brand.brand_id,
                            label: getStringValue(brand.name),
                        })),
                    },
                    {
                        value: status,
                        onChange: setStatus,
                        label: t('-- All Statuses --'),
                        options: [
                            { value: '1', label: t('Pending Approval') },
                            { value: '2', label: t('Active') },
                            { value: '3', label: t('Inactive') },
                        ],
                    },
                ]}
                onApplyFilters={applyFilters}
            />

            <DataTable
                columns={productColumns}
                data={productData}
                headerTitle={`${t('Product List')} (${totalProducts})`}
                headerIcon={Package}
                emptyMessage={t('No products found')}
            />

            <Pagination links={products?.links ?? []} />

            <ConfirmDialog
                open={pendingDelete !== null}
                onOpenChange={(open) => {
                    if (!open) setPendingDelete(null);
                }}
                title={t('Delete product')}
                description={`${t('Are you sure you want to delete this product?')} ${pendingDelete ? getStringValue(pendingDelete.name) : ''}`}
                confirmLabel={t('Delete')}
                cancelLabel={t('Cancel')}
                onConfirm={handleDelete}
            />
        </WorkspaceLayout>
    );
}
