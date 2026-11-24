import { Head, router, usePage } from '@inertiajs/react';
import { Check, Eye, EyeOff, Package, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import ProductInfoCell from '@/components/admin/products/ProductInfoCell';
import Toast from '@/components/admin/users/Toast';
import ActionButtons, { type ActionConfig } from '@/components/ui/action-buttons';
import ConfirmationModal from '@/components/ui/confirmation-modal';
import DataTable from '@/components/ui/data-table';
import FilterPanel from '@/components/ui/filter-panel';
import Pagination from '@/components/ui/pagination';
import StatusBadge from '@/components/ui/status-badge';
import AppLayout from '@/layouts/app/AppLayout';
import { formatVnd } from '@/lib/format';
import { useTranslation } from '@/lib/i18n';

import styles from '@/components/admin/admin.module.css';

interface Category {
    category_id: number;
    name: string;
}

interface Brand {
    brand_id: number;
    name: string;
}

interface Product {
    product_id: number;
    name: string;
    category: { name: string };
    brand: { name: string };
    seller: { username: string; first_name: string; last_name: string };
    status: number;
    images?: Array<{ image_url: string; is_primary: boolean }>;
    variants?: Array<{ price: number }>;
    variants_count: number;
    variants_sum_stock_quantity: number;
}

interface PageProps {
    products: {
        data: Product[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    categories: Category[];
    brands: Brand[];
    filters: { search?: string; category_id?: string; brand_id?: string; status?: string };
    totalProducts: number;
    flash?: { success?: string; error?: string };
    [key: string]: unknown;
}

type StatusAction = 'approve' | 'reject' | 'deactivate' | 'activate';

export default function Index() {
    const { t } = useTranslation();
    const {
        products = { data: [], links: [] },
        categories = [],
        brands = [],
        filters = {},
        totalProducts = 0,
        flash = {},
    } = usePage<PageProps>().props;

    const [search, setSearch] = useState(filters.search || '');
    const [categoryId, setCategoryId] = useState(filters.category_id || '');
    const [brandId, setBrandId] = useState(filters.brand_id || '');
    const [status, setStatus] = useState(filters.status || '');
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        productId: number | null;
        action: StatusAction | null;
        title: string;
        message: string;
    }>({
        isOpen: false,
        productId: null,
        action: null,
        title: '',
        message: '',
    });

    useEffect(() => {
        if (flash?.success) {
            setToast({ type: 'success', message: flash.success });
        } else if (flash?.error) {
            setToast({ type: 'error', message: flash.error });
        }
    }, [flash]);

    const applyFilters = () => {
        router.get('/admin/products', { search, category_id: categoryId, brand_id: brandId, status }, { preserveState: true });
    };

    const getProductName = (product: Product) => product.name || t('Unnamed Product');

    const getProductStatus = (productStatus: number) => {
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
    };

    const getProductPrice = (product: Product) => {
        if (!product.variants || product.variants.length === 0) {
            return t('No variants');
        }

        const prices = product.variants.map((variant) => variant.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        if (minPrice === maxPrice) {
            return formatVnd(minPrice);
        }

        return `${formatVnd(minPrice)} - ${formatVnd(maxPrice)}`;
    };

    const getSellerName = (seller: Product['seller']) => `${seller.first_name} ${seller.last_name}`.trim() || seller.username;

    const handleStatusAction = (product: Product, action: StatusAction) => {
        const productName = getProductName(product);
        const messages: Record<StatusAction, { title: string; message: string }> = {
            approve: {
                title: t('Confirm Approve Product'),
                message: `${t('Are you sure you want to approve product')} "${productName}"? ${t('This will make it active and visible to customers.')}`,
            },
            reject: {
                title: t('Confirm Reject Product'),
                message: `${t('Are you sure you want to reject product')} "${productName}"? ${t('This will mark it as inactive.')}`,
            },
            deactivate: {
                title: t('Confirm Deactivate Product'),
                message: `${t('Are you sure you want to deactivate product')} "${productName}"? ${t('This will hide it from customers.')}`,
            },
            activate: {
                title: t('Confirm Activate Product'),
                message: `${t('Are you sure you want to activate product')} "${productName}"? ${t('This will make it visible to customers again.')}`,
            },
        };

        setConfirmModal({ isOpen: true, productId: product.product_id, action, ...messages[action] });
    };

    const handleConfirmAction = () => {
        if (!confirmModal.productId || !confirmModal.action) return;

        const statusMap: Record<StatusAction, number> = { approve: 2, reject: 3, deactivate: 3, activate: 2 };

        router.patch(`/admin/products/${confirmModal.productId}/status`, {
            status: statusMap[confirmModal.action],
        });
    };

    const productColumns = [
        {
            key: 'product',
            header: t('Product'),
            cell: (product: Product) => <ProductInfoCell product={product} />,
        },
        {
            key: 'category',
            header: t('Category'),
            cell: (product: Product) => <span className={styles.muted}>{product.category?.name || t('No Category')}</span>,
        },
        {
            key: 'seller',
            header: t('Seller'),
            cell: (product: Product) => <span className={styles.muted}>{getSellerName(product.seller)}</span>,
        },
        {
            key: 'brand',
            header: t('Brand'),
            cell: (product: Product) => <span className={styles.muted}>{product.brand?.name}</span>,
        },
        {
            key: 'price',
            header: t('Price'),
            cell: (product: Product) => <span className={styles.priceAccent}>{getProductPrice(product)}</span>,
        },
        {
            key: 'stock',
            header: t('Stock'),
            cell: (product: Product) => (
                <span className={`${styles.stockBadge} ${product.variants_sum_stock_quantity > 0 ? styles.stockIn : styles.stockOut}`.trim()}>
                    {product.variants_sum_stock_quantity || 0} {t('units')}
                </span>
            ),
        },
        {
            key: 'status',
            header: t('Status'),
            cell: (product: Product) => <StatusBadge status={getProductStatus(product.status)} />,
        },
        {
            key: 'actions',
            header: t('Actions'),
            cell: (product: Product) => {
                const actions: ActionConfig[] = [];

                if (product.status === 1) {
                    actions.push(
                        {
                            type: 'button',
                            onClick: () => handleStatusAction(product, 'approve'),
                            variant: 'primary',
                            icon: Check,
                            label: t('Approve'),
                        },
                        {
                            type: 'button',
                            onClick: () => handleStatusAction(product, 'reject'),
                            variant: 'danger',
                            icon: X,
                            label: t('Reject'),
                        },
                    );
                } else if (product.status === 2) {
                    actions.push(
                        {
                            type: 'link',
                            href: `/admin/products/${product.product_id}`,
                            variant: 'primary',
                            icon: Eye,
                            label: t('View'),
                        },
                        {
                            type: 'button',
                            onClick: () => handleStatusAction(product, 'deactivate'),
                            variant: 'danger',
                            icon: EyeOff,
                            label: t('Deactivate'),
                        },
                    );
                } else if (product.status === 3) {
                    actions.push(
                        {
                            type: 'link',
                            href: `/admin/products/${product.product_id}`,
                            variant: 'primary',
                            icon: Eye,
                            label: t('View'),
                        },
                        {
                            type: 'button',
                            onClick: () => handleStatusAction(product, 'activate'),
                            variant: 'primary',
                            icon: Check,
                            label: t('Activate'),
                        },
                    );
                }

                return <ActionButtons actions={actions} />;
            },
        },
    ];

    return (
        <AppLayout>
            <Head title={t('Product Management')} />

            {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

            <FilterPanel
                title={t('Product Management')}
                breadcrumbs={[
                    { label: t('Dashboard'), href: '/admin/dashboard' },
                    { label: t('Products'), href: '/admin/products', active: true },
                ]}
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
                        options: categories.map((category) => ({ value: category.category_id, label: category.name })),
                    },
                    {
                        value: brandId,
                        onChange: setBrandId,
                        label: t('-- All Brands --'),
                        options: brands.map((brand) => ({ value: brand.brand_id, label: brand.name })),
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
                data={products.data}
                headerTitle={`${t('Product List')} (${totalProducts})`}
                headerIcon={Package}
                emptyMessage={t('No products found')}
            />

            <Pagination links={products.links} />

            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false, productId: null, action: null, title: '', message: '' })}
                onConfirm={handleConfirmAction}
                title={confirmModal.title}
                message={confirmModal.message}
            />
        </AppLayout>
    );
}
