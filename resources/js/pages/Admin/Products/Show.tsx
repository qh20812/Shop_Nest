import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Check, EyeOff, Layers, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import ProductImageGallery from '@/components/admin/products/ProductImageGallery';
import ProductInfo from '@/components/admin/products/ProductInfo';
import ProductTabs from '@/components/admin/products/ProductTabs';
import Toast from '@/components/admin/users/Toast';
import { PageHeader } from '@/components/layout/PageHeader';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import { Badge, type BadgeTone } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ConfirmationModal from '@/components/ui/confirmation-modal';
import DataTable from '@/components/ui/data-table';
import { formatNumber, formatVnd } from '@/lib/format';
import { useTranslation } from '@/lib/i18n';

import adminStyles from '@/components/admin/admin.module.css';
import styles from './Show.module.css';

const LOW_STOCK_THRESHOLD = 10;

interface NamedRecord {
    name?: string | Record<string, string>;
}

interface Seller {
    id: number;
    username?: string | null;
    first_name?: string | null;
    last_name?: string | null;
    email?: string | null;
    avatar?: string | null;
}

interface ProductImage {
    image_id: number;
    image_url: string;
    is_primary: boolean;
}

interface AttributeValue {
    attribute_value_id: number;
    value: string;
    attribute: {
        attribute_id: number;
        name: string;
    };
}

interface Variant {
    variant_id: number;
    sku?: string | null;
    price?: number | string | null;
    discount_price?: number | string | null;
    stock_quantity?: number | string | null;
    attributeValues?: AttributeValue[];
    option_values?: Array<{ name?: string | null; value?: string | null }> | null;
}

interface Review {
    review_id: number;
    rating: number;
    comment?: string | null;
    is_approved?: boolean | number;
    created_at?: string | null;
    user?: {
        id?: number;
        username?: string | null;
        first_name?: string | null;
        last_name?: string | null;
        avatar?: string | null;
    } | null;
}

interface Product {
    product_id: number;
    name: string | Record<string, string>;
    description?: string | Record<string, string> | null;
    status: string;
    category?: NamedRecord | null;
    brand?: NamedRecord | null;
    seller?: Seller | null;
    images?: ProductImage[];
    variants?: Variant[];
    reviews?: Review[];
    created_at?: string | null;
    updated_at?: string | null;
}

interface PageProps {
    product: Product;
    flash?: { success?: string; error?: string };
    [key: string]: unknown;
}

type StatusAction = 'approve' | 'reject' | 'deactivate' | 'activate';

type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

const resolveText = (value: string | Record<string, string> | undefined, locale: string, fallback: string): string => {
    if (!value) {
        return fallback;
    }

    if (typeof value === 'string') {
        return value;
    }

    return value[locale] ?? value.en ?? Object.values(value)[0] ?? fallback;
};

const getStockStatus = (quantity?: number | string | null): StockStatus => {
    const stock = Number(quantity ?? 0);

    if (stock <= 0) {
        return 'out_of_stock';
    }

    if (stock <= LOW_STOCK_THRESHOLD) {
        return 'low_stock';
    }

    return 'in_stock';
};

export default function Show() {
    const { t, locale } = useTranslation();
    const { product, flash } = usePage<PageProps>().props;

    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [confirmAction, setConfirmAction] = useState<StatusAction | null>(null);

    useEffect(() => {
        if (flash?.success) {
            setToast({ type: 'success', message: flash.success });
        } else if (flash?.error) {
            setToast({ type: 'error', message: flash.error });
        }
    }, [flash]);

    const productName = resolveText(product.name, locale, t('Unnamed Product'));
    const categoryName = resolveText(product.category?.name, locale, t('No Category'));
    const brandName = resolveText(product.brand?.name, locale, t('No Brand'));

    const images = product.images ?? [];
    const variants = product.variants ?? [];
    const reviews = product.reviews ?? [];

    const statusLabels: Record<string, string> = {
        draft: t('Draft'),
        pending_approval: t('Pending Approval'),
        published: t('Published'),
        hidden: t('Hidden'),
    };

    const statusTones: Record<string, BadgeTone> = {
        draft: 'neutral',
        pending_approval: 'warning',
        published: 'success',
        hidden: 'outline',
    };

    const stockLabels: Record<StockStatus, string> = {
        in_stock: t('In Stock'),
        low_stock: t('Low Stock'),
        out_of_stock: t('Out of Stock'),
    };

    const stockTones: Record<StockStatus, BadgeTone> = {
        in_stock: 'success',
        low_stock: 'warning',
        out_of_stock: 'danger',
    };

    const isPending = product.status === 'draft' || product.status === 'pending_approval';

    const confirmMessages: Record<StatusAction, { title: string; message: string }> = {
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

    const handleConfirm = () => {
        if (!confirmAction) {
            return;
        }

        const statusMap: Record<StatusAction, string> = {
            approve: 'published',
            reject: 'hidden',
            deactivate: 'hidden',
            activate: 'published',
        };

        router.patch(
            `/admin/products/${product.product_id}/status`,
            { status: statusMap[confirmAction], redirect_to: 'show' },
            { preserveScroll: true },
        );
        setConfirmAction(null);
    };

    const variantColumns = [
        {
            key: 'sku',
            header: t('SKU'),
            cell: (variant: Variant) => <span className={styles.variantSku}>{variant.sku ?? `#${variant.variant_id}`}</span>,
        },
        {
            key: 'attributes',
            header: t('Attributes'),
            cell: (variant: Variant) => {
                const attributeValues = (variant.attributeValues ?? []).map((attribute) => attribute.value).filter(Boolean);
                const optionValues = (variant.option_values ?? [])
                    .map((option) => [option.name, option.value].filter(Boolean).join(': '))
                    .filter(Boolean);
                const attributes = attributeValues.length > 0 ? attributeValues : optionValues;

                return <span className={styles.variantAttributes}>{attributes.length > 0 ? attributes.join(', ') : '-'}</span>;
            },
        },
        {
            key: 'price',
            header: t('Price'),
            align: 'right' as const,
            cell: (variant: Variant) => {
                const price = variant.price === null || variant.price === undefined || variant.price === '' ? null : Number(variant.price);
                const discount =
                    variant.discount_price === null || variant.discount_price === undefined || variant.discount_price === ''
                        ? null
                        : Number(variant.discount_price);
                const hasDiscount = price !== null && Number.isFinite(price) && discount !== null && Number.isFinite(discount) && discount < price;

                return (
                    <div className={styles.priceCell}>
                        <span className={adminStyles.price}>{price !== null && Number.isFinite(price) ? formatVnd(price) : t('N/A')}</span>
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
            key: 'stock',
            header: t('Stock'),
            align: 'right' as const,
            cell: (variant: Variant) => {
                const stockStatus = getStockStatus(variant.stock_quantity);

                return (
                    <div className={styles.stockCell}>
                        <span className={adminStyles.numeric}>{formatNumber(Number(variant.stock_quantity ?? 0))}</span>
                        <Badge tone={stockTones[stockStatus]}>{stockLabels[stockStatus]}</Badge>
                    </div>
                );
            },
        },
    ];

    return (
        <WorkspaceLayout>
            <Head title={`${productName} - ${t('Product Details')}`} />

            {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

            <div className={adminStyles.stack}>
                <PageHeader
                    breadcrumbs={[
                        { label: t('Dashboard'), href: '/admin/dashboard' },
                        { label: t('Products'), href: '/admin/products' },
                        { label: productName, current: true },
                    ]}
                    title={productName}
                    description={
                        <span className={styles.headerMeta}>
                            <Badge tone={statusTones[product.status] ?? 'warning'}>{statusLabels[product.status] ?? product.status}</Badge>
                            <span>
                                {categoryName} / {brandName}
                            </span>
                        </span>
                    }
                    actions={
                        <>
                            <Button asChild variant="secondary" size="sm">
                                <Link href="/admin/products">
                                    <ArrowLeft aria-hidden="true" />
                                    {t('Back to Products')}
                                </Link>
                            </Button>

                            {isPending && (
                                <>
                                    <Button type="button" variant="destructive" size="sm" leftIcon={X} onClick={() => setConfirmAction('reject')}>
                                        {t('Reject')}
                                    </Button>
                                    <Button type="button" variant="primary" size="sm" leftIcon={Check} onClick={() => setConfirmAction('approve')}>
                                        {t('Approve')}
                                    </Button>
                                </>
                            )}

                            {product.status === 'published' && (
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    leftIcon={EyeOff}
                                    onClick={() => setConfirmAction('deactivate')}
                                >
                                    {t('Deactivate')}
                                </Button>
                            )}

                            {product.status === 'hidden' && (
                                <Button type="button" variant="primary" size="sm" leftIcon={Check} onClick={() => setConfirmAction('activate')}>
                                    {t('Activate')}
                                </Button>
                            )}
                        </>
                    }
                />

                <div className={styles.layout}>
                    <div className={styles.main}>
                        <section className={styles.mediaPanel}>
                            <ProductImageGallery images={images} productName={productName} />
                        </section>

                        <ProductTabs description={product.description} reviews={reviews} />
                    </div>

                    <aside className={styles.rail} aria-label={t('Product Overview')}>
                        <ProductInfo product={product} />
                    </aside>
                </div>

                <div className={styles.table}>
                    <DataTable
                        columns={variantColumns}
                        data={variants}
                        headerTitle={t('Variants')}
                        headerIcon={Layers}
                        headerMeta={formatNumber(variants.length)}
                        emptyMessage={t('No variants')}
                    />
                </div>
            </div>

            <ConfirmationModal
                isOpen={confirmAction !== null}
                onClose={() => setConfirmAction(null)}
                onConfirm={handleConfirm}
                title={confirmAction ? confirmMessages[confirmAction].title : ''}
                message={confirmAction ? confirmMessages[confirmAction].message : ''}
            />
        </WorkspaceLayout>
    );
}
