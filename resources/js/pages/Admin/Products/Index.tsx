import { Head, router, usePage } from '@inertiajs/react';
import { Check, Eye, EyeOff, Package, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import ProductInfoCell from '@/components/admin/products/ProductInfoCell';
import Toast from '@/components/admin/users/Toast';
import { PageHeader } from '@/components/layout/PageHeader';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import ActionButtons, { type ActionConfig } from '@/components/ui/action-buttons';
import { Button } from '@/components/ui/button';
import ConfirmationModal from '@/components/ui/confirmation-modal';
import DataTable from '@/components/ui/data-table';
import FormField from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import Pagination from '@/components/ui/pagination';
import { Select } from '@/components/ui/select';
import StatusBadge from '@/components/ui/status-badge';
import { cx } from '@/lib/cx';
import { formatNumber, formatVnd } from '@/lib/format';
import { useTranslation } from '@/lib/i18n';

import adminStyles from '@/components/admin/admin.module.css';
import styles from './Products.module.css';

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
    status: string;
    images?: Array<{ image_url: string; is_primary: boolean }>;
    variants?: Array<{ price: number }>;
    variants_count: number;
    variants_sum_stock_quantity: number;
}

interface PageProps {
    products: {
        data: Product[];
        links: { url: string | null; label: string; active: boolean }[];
        total?: number;
        from?: number | null;
        to?: number | null;
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

    const getProductStatus = (productStatus: string) => {
        switch (productStatus) {
            case 'draft':
            case 'pending_approval':
                return 'pending';
            case 'published':
                return 'active';
            case 'hidden':
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

        const statusMap: Record<StatusAction, string> = {
            approve: 'published',
            reject: 'hidden',
            deactivate: 'hidden',
            activate: 'published',
        };

        router.patch(`/admin/products/${confirmModal.productId}/status`, {
            status: statusMap[confirmModal.action],
        });
    };

    const filteredTotal = products.total ?? totalProducts;
    const rangeLabel =
        filteredTotal > 0
            ? `${formatNumber(products.from ?? 0)}-${formatNumber(products.to ?? 0)} / ${formatNumber(filteredTotal)}`
            : formatNumber(0);

    const productColumns = [
        {
            key: 'product',
            header: t('Product'),
            cell: (product: Product) => <ProductInfoCell product={product} />,
        },
        {
            key: 'seller',
            header: t('Seller'),
            cell: (product: Product) => (
                <div className={styles.seller}>
                    <span className={styles.sellerName}>{getSellerName(product.seller)}</span>
                    <span className={styles.brand}>{product.brand?.name || t('No Brand')}</span>
                </div>
            ),
        },
        {
            key: 'price',
            header: t('Price'),
            cell: (product: Product) => (
                <div className={styles.priceCell}>
                    <span className={adminStyles.price}>{getProductPrice(product)}</span>
                    <span
                        className={`${adminStyles.stockBadge} ${product.variants_sum_stock_quantity > 0 ? adminStyles.stockIn : adminStyles.stockOut}`.trim()}
                    >
                        {product.variants_sum_stock_quantity || 0} {t('units')}
                    </span>
                </div>
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

                if (product.status === 'draft' || product.status === 'pending_approval') {
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
                } else if (product.status === 'published') {
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
                } else if (product.status === 'hidden') {
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
        <WorkspaceLayout>
            <Head title={t('Product Management')} />

            {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

            <div className={adminStyles.stack}>
                <PageHeader
                    breadcrumbs={[
                        { label: t('Dashboard'), href: '/admin/dashboard' },
                        { label: t('Products'), current: true },
                    ]}
                    title={t('Product Management')}
                    count={formatNumber(totalProducts)}
                />

                <form
                    className={cx(styles.filters, 'sn-glass-surface')}
                    aria-label={t('Filters')}
                    onSubmit={(event) => {
                        event.preventDefault();
                        applyFilters();
                    }}
                >
                    <FormField label={t('Search')} htmlFor="product-search">
                        <Input
                            id="product-search"
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder={t('Search by product name or SKU...')}
                            leadingIcon={Search}
                            surface="glass"
                        />
                    </FormField>

                    <FormField label={t('Category')} htmlFor="product-category">
                        <Select id="product-category" value={categoryId} onChange={(event) => setCategoryId(event.target.value)} surface="glass">
                            <option value="">{t('-- All Categories --')}</option>
                            {categories.map((category) => (
                                <option key={category.category_id} value={category.category_id}>
                                    {category.name}
                                </option>
                            ))}
                        </Select>
                    </FormField>

                    <FormField label={t('Brand')} htmlFor="product-brand">
                        <Select id="product-brand" value={brandId} onChange={(event) => setBrandId(event.target.value)} surface="glass">
                            <option value="">{t('-- All Brands --')}</option>
                            {brands.map((brand) => (
                                <option key={brand.brand_id} value={brand.brand_id}>
                                    {brand.name}
                                </option>
                            ))}
                        </Select>
                    </FormField>

                    <FormField label={t('Status')} htmlFor="product-status">
                        <Select id="product-status" value={status} onChange={(event) => setStatus(event.target.value)} surface="glass">
                            <option value="">{t('-- All Statuses --')}</option>
                            <option value="draft">{t('Draft')}</option>
                            <option value="pending_approval">{t('Pending Approval')}</option>
                            <option value="published">{t('Published')}</option>
                            <option value="hidden">{t('Hidden')}</option>
                        </Select>
                    </FormField>

                    <div className={styles.filterActions}>
                        <Button type="submit" variant="primary" leftIcon={Search}>
                            {t('Apply')}
                        </Button>
                    </div>
                </form>

                <div className={styles.table}>
                    <DataTable
                        columns={productColumns}
                        data={products.data}
                        headerTitle={t('Product List')}
                        headerIcon={Package}
                        headerMeta={rangeLabel}
                        emptyMessage={t('No products found')}
                    />
                </div>

                <Pagination links={products.links} />
            </div>

            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false, productId: null, action: null, title: '', message: '' })}
                onConfirm={handleConfirmAction}
                title={confirmModal.title}
                message={confirmModal.message}
            />
        </WorkspaceLayout>
    );
}
