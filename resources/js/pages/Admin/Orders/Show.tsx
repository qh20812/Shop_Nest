import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Package } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import Toast from '@/components/admin/users/Toast';
import { PageHeader } from '@/components/layout/PageHeader';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import { Button } from '@/components/ui/button';
import FormField from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import StatusBadge from '@/components/ui/status-badge';
import { Table } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { formatDateTime, formatOrderCode } from '@/lib/format';
import { useTranslation } from '@/lib/i18n';

import adminStyles from '@/components/admin/admin.module.css';
import styles from './Show.module.css';

interface TranslatedName {
    en?: string;
    vi?: string;
    [key: string]: string | undefined;
}

interface ProductImage {
    image_id: number;
    image_url: string;
    is_primary: boolean;
    display_order: number;
}

interface Product {
    product_id: number;
    name: string | TranslatedName;
    images?: ProductImage[];
}

interface Variant {
    variant_id: number;
    product_id: number;
    variant_name?: string | null;
    sku: string;
    price: number | string;
    option_values?: Record<string, string> | null;
    product?: Product | null;
}

interface OrderItem {
    order_item_id: number;
    quantity: number;
    unit_price: number | string;
    total_price: number | string;
    variant?: Variant | null;
}

interface Customer {
    first_name: string;
    last_name: string;
    email: string;
    phone_number?: string | null;
}

interface Address {
    id: number;
    full_name?: string | null;
    phone_number?: string | null;
    street_address?: string | null;
    full_address?: string | null;
    postal_code?: string | null;
}

interface Shipper {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
}

interface Order {
    order_id: number;
    order_number: string;
    status: string;
    payment_status: string;
    payment_method?: number | string | null;
    created_at: string;
    shipped_at?: string | null;
    delivered_at?: string | null;
    notes?: string | null;
    shipper_id?: number | null;
    total_amount: number | string;
    currency?: string | null;
    customer?: Customer | null;
    shippingAddress?: Address | null;
    shipper?: Shipper | null;
    items?: OrderItem[];
}

interface OrderSummary {
    subtotal: number | string;
    shipping_fee: number | string;
    discount_amount: number | string;
    total_amount: number | string;
    paid_amount: number | string;
    refunded_amount: number | string;
}

interface PageProps {
    order: Order;
    availableShippers?: Shipper[];
    orderSummary: OrderSummary;
    flash?: { success?: string; error?: string };
    [key: string]: unknown;
}

const toNumber = (value: number | string | null | undefined): number => {
    const numeric = typeof value === 'number' ? value : Number(value ?? 0);

    return Number.isFinite(numeric) ? numeric : 0;
};

const resolveName = (value: string | TranslatedName | null | undefined, locale: string, fallback: string): string => {
    if (!value) {
        return fallback;
    }

    if (typeof value === 'string') {
        return value;
    }

    return value[locale] || value.en || value.vi || Object.values(value)[0] || fallback;
};

const normalizeImageUrl = (value: string | null | undefined): string | null => {
    if (!value) {
        return null;
    }

    if (/^https?:\/\//i.test(value)) {
        return value;
    }

    if (value.startsWith('/')) {
        return value;
    }

    return `/storage/${value.replace(/^\/?storage\//, '')}`;
};

const finalStatuses = ['delivered', 'completed', 'cancelled', 'returned'];

export default function Show() {
    const { t, locale } = useTranslation();
    const { order, availableShippers = [], orderSummary, flash } = usePage<PageProps>().props;
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const assignForm = useForm({
        shipper_id: order.shipper_id ? String(order.shipper_id) : '',
    });
    const refundForm = useForm({
        amount: '',
        reason: '',
    });

    useEffect(() => {
        if (flash?.success) {
            setToast({ type: 'success', message: flash.success });
        } else if (flash?.error) {
            setToast({ type: 'error', message: flash.error });
        }
    }, [flash?.success, flash?.error]);

    const currency = (order.currency || 'VND').toUpperCase();
    const formatAmount = (value: number | string | null | undefined) =>
        new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency,
            maximumFractionDigits: 0,
        }).format(toNumber(value));

    const paymentMethodLabels: Record<string, string> = {
        '1': t('COD'),
        '2': t('Bank Transfer'),
        '3': t('Online Gateway'),
        cod: t('COD'),
        stripe: t('Online Gateway'),
    };
    const paymentMethod = paymentMethodLabels[String(order.payment_method ?? '')] || t('Unknown');

    const customerName = order.customer ? `${order.customer.first_name} ${order.customer.last_name}` : t('Guest Customer');
    const items = order.items ?? [];
    const availableForRefund = Math.max(0, toNumber(orderSummary.paid_amount) - toNumber(orderSummary.refunded_amount));
    const canAssign = availableShippers.length > 0 && !finalStatuses.includes(order.status);
    const canRefund = availableForRefund > 0;

    const itemColumns = [
        {
            key: 'item',
            header: t('Item'),
            cell: (item: OrderItem) => {
                const productName = resolveName(item.variant?.product?.name, locale, t('Unnamed Product'));
                const image =
                    item.variant?.product?.images?.find((entry) => entry.is_primary)?.image_url || item.variant?.product?.images?.[0]?.image_url;
                const imageUrl = normalizeImageUrl(image);
                const variantLabel = item.variant?.variant_name || item.variant?.sku;

                return (
                    <div className={styles.itemCell}>
                        {imageUrl ? (
                            <img src={imageUrl} alt={productName} className={styles.itemThumb} />
                        ) : (
                            <span className={styles.itemPlaceholder} aria-hidden="true">
                                <Package className={styles.itemPlaceholderIcon} />
                            </span>
                        )}
                        <div className={styles.itemBody}>
                            <span className={styles.itemName}>{productName}</span>
                            {variantLabel && <span className={styles.itemMeta}>{variantLabel}</span>}
                        </div>
                    </div>
                );
            },
        },
        {
            key: 'quantity',
            header: t('Qty'),
            align: 'right' as const,
            cell: (item: OrderItem) => <span className={styles.qty}>{item.quantity}</span>,
        },
        {
            key: 'unit_price',
            header: t('Unit Price'),
            align: 'right' as const,
            cell: (item: OrderItem) => <span className={styles.amount}>{formatAmount(item.unit_price)}</span>,
        },
        {
            key: 'total_price',
            header: t('Total'),
            align: 'right' as const,
            cell: (item: OrderItem) => <span className={styles.amount}>{formatAmount(item.total_price)}</span>,
        },
    ];

    const totals = [
        { key: 'subtotal', label: t('Subtotal'), value: orderSummary.subtotal },
        { key: 'shipping', label: t('Shipping Fee'), value: orderSummary.shipping_fee },
        ...(toNumber(orderSummary.discount_amount) > 0 ? [{ key: 'discount', label: t('Discount'), value: orderSummary.discount_amount }] : []),
        { key: 'total', label: t('Total'), value: orderSummary.total_amount, strong: true },
        { key: 'paid', label: t('Paid'), value: orderSummary.paid_amount },
        ...(toNumber(orderSummary.refunded_amount) > 0 ? [{ key: 'refunded', label: t('Refunded'), value: orderSummary.refunded_amount }] : []),
    ];

    const handleAssign = (event: React.FormEvent) => {
        event.preventDefault();
        assignForm.post(`/admin/orders/${order.order_id}/assign-shipper`, {
            preserveScroll: true,
        });
    };

    const handleRefund = (event: React.FormEvent) => {
        event.preventDefault();
        refundForm.post(`/admin/orders/${order.order_id}/refund`, {
            preserveScroll: true,
            onSuccess: () => refundForm.reset(),
        });
    };

    return (
        <WorkspaceLayout>
            <Head title={`${t('Order Details')} - ${order.order_number}`} />

            {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

            <div className={adminStyles.stack}>
                <PageHeader
                    breadcrumbs={[
                        { label: t('Dashboard'), href: '/admin/dashboard' },
                        { label: t('Orders'), href: '/admin/orders' },
                        { label: formatOrderCode(order.order_number), current: true },
                    ]}
                    title={`${t('Order')} ${formatOrderCode(order.order_number)}`}
                    description={
                        <span className={styles.headerMeta}>
                            <StatusBadge status={order.status} type="order" />
                            <StatusBadge status={order.payment_status} type="payment" />
                            <span>{formatDateTime(order.created_at)}</span>
                        </span>
                    }
                    actions={
                        <Button asChild variant="secondary" size="sm">
                            <Link href="/admin/orders">{t('Back to List')}</Link>
                        </Button>
                    }
                />

                <div className={styles.layout}>
                    <div className={styles.main}>
                        <section className={styles.panel} aria-labelledby="orderItems">
                            <div className={styles.section}>
                                <div className={styles.sectionHead}>
                                    <h2 id="orderItems" className={styles.sectionTitle}>
                                        {t('Order Items')}
                                    </h2>
                                    <span className={styles.sectionMeta}>
                                        {items.length} {t('Items')}
                                    </span>
                                </div>

                                <Table
                                    columns={itemColumns}
                                    data={items}
                                    rowKey="order_item_id"
                                    empty={<span className={styles.empty}>{t('No products')}</span>}
                                />
                            </div>

                            <div className={styles.section}>
                                <h2 className={styles.sectionTitle}>{t('Payment Summary')}</h2>
                                <dl className={styles.totals}>
                                    {totals.map((entry) => (
                                        <div key={entry.key} className={entry.strong ? styles.totalRowStrong : styles.totalRow}>
                                            <dt className={styles.totalLabel}>{entry.label}</dt>
                                            <dd className={styles.totalValue}>{formatAmount(entry.value)}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>
                        </section>
                    </div>

                    <aside className={styles.rail} aria-label={t('Order Summary')}>
                        <section className={styles.railSection}>
                            <h2 className={styles.sectionTitle}>{t('Customer')}</h2>
                            <p className={styles.customerName}>{customerName}</p>
                            {order.customer?.email && <p className={styles.meta}>{order.customer.email}</p>}
                            {order.customer?.phone_number && <p className={styles.meta}>{order.customer.phone_number}</p>}
                        </section>

                        <section className={styles.railSection}>
                            <h2 className={styles.sectionTitle}>{t('Shipping Address')}</h2>
                            {order.shippingAddress ? (
                                <address className={styles.address}>
                                    {order.shippingAddress.full_name && <span>{order.shippingAddress.full_name}</span>}
                                    {order.shippingAddress.full_address && <span>{order.shippingAddress.full_address}</span>}
                                    {order.shippingAddress.phone_number && <span>{order.shippingAddress.phone_number}</span>}
                                </address>
                            ) : (
                                <p className={styles.meta}>{t('No shipping address')}</p>
                            )}
                        </section>

                        <section className={styles.railSection}>
                            <h2 className={styles.sectionTitle}>{t('Payment')}</h2>
                            <dl className={styles.facts}>
                                <div className={styles.fact}>
                                    <dt className={styles.factLabel}>{t('Payment Method')}</dt>
                                    <dd className={styles.factValue}>{paymentMethod}</dd>
                                </div>
                                <div className={styles.fact}>
                                    <dt className={styles.factLabel}>{t('Payment Status')}</dt>
                                    <dd className={styles.factValue}>
                                        <StatusBadge status={order.payment_status} type="payment" />
                                    </dd>
                                </div>
                                <div className={styles.fact}>
                                    <dt className={styles.factLabel}>{t('Created Date')}</dt>
                                    <dd className={styles.factValue}>{formatDateTime(order.created_at)}</dd>
                                </div>
                                {order.shipped_at && (
                                    <div className={styles.fact}>
                                        <dt className={styles.factLabel}>{t('Shipped At')}</dt>
                                        <dd className={styles.factValue}>{formatDateTime(order.shipped_at)}</dd>
                                    </div>
                                )}
                                {order.delivered_at && (
                                    <div className={styles.fact}>
                                        <dt className={styles.factLabel}>{t('Delivered At')}</dt>
                                        <dd className={styles.factValue}>{formatDateTime(order.delivered_at)}</dd>
                                    </div>
                                )}
                            </dl>
                        </section>

                        {order.shipper && (
                            <section className={styles.railSection}>
                                <h2 className={styles.sectionTitle}>{t('Shipper')}</h2>
                                <p className={styles.customerName}>
                                    {order.shipper.first_name} {order.shipper.last_name}
                                </p>
                                <p className={styles.meta}>{order.shipper.email}</p>
                            </section>
                        )}

                        {order.notes && (
                            <section className={styles.railSection}>
                                <h2 className={styles.sectionTitle}>{t('Notes')}</h2>
                                <p className={styles.notes}>{order.notes}</p>
                            </section>
                        )}

                        {canAssign && (
                            <section className={styles.railSection}>
                                <h2 className={styles.sectionTitle}>{t('Assign Shipper')}</h2>
                                <form className={styles.actionForm} onSubmit={handleAssign}>
                                    <FormField label={t('Shipper')} htmlFor="order-shipper" error={assignForm.errors.shipper_id}>
                                        <Select
                                            id="order-shipper"
                                            value={assignForm.data.shipper_id}
                                            onChange={(event) => assignForm.setData('shipper_id', event.target.value)}
                                        >
                                            <option value="">{t('Select Shipper')}</option>
                                            {availableShippers.map((shipper) => (
                                                <option key={shipper.id} value={shipper.id}>
                                                    {shipper.first_name} {shipper.last_name} ({shipper.email})
                                                </option>
                                            ))}
                                        </Select>
                                    </FormField>
                                    <Button type="submit" variant="primary" loading={assignForm.processing}>
                                        {t('Assign Shipper')}
                                    </Button>
                                </form>
                            </section>
                        )}

                        {canRefund && (
                            <section className={styles.railSection}>
                                <h2 className={styles.sectionTitle}>{t('Refund')}</h2>
                                <p className={styles.helper}>
                                    {t('Available for refund')}: {formatAmount(availableForRefund)}
                                </p>
                                <form className={styles.actionForm} onSubmit={handleRefund}>
                                    <FormField label={t('Amount')} htmlFor="refund-amount" error={refundForm.errors.amount}>
                                        <Input
                                            id="refund-amount"
                                            type="number"
                                            min="0.01"
                                            max={availableForRefund}
                                            step="0.01"
                                            value={refundForm.data.amount}
                                            onChange={(event) => refundForm.setData('amount', event.target.value)}
                                        />
                                    </FormField>
                                    <FormField label={t('Reason')} htmlFor="refund-reason" error={refundForm.errors.reason}>
                                        <Textarea
                                            id="refund-reason"
                                            rows={3}
                                            value={refundForm.data.reason}
                                            onChange={(event) => refundForm.setData('reason', event.target.value)}
                                        />
                                    </FormField>
                                    <Button type="submit" variant="primary" loading={refundForm.processing}>
                                        {t('Refund')}
                                    </Button>
                                </form>
                            </section>
                        )}
                    </aside>
                </div>
            </div>
        </WorkspaceLayout>
    );
}
