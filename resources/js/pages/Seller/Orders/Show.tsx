import Toast from '@/components/admin/users/Toast';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Header from '@/components/ui/header';
import { Select } from '@/components/ui/select';
import StatusBadge from '@/components/ui/status-badge';
import { Table, type ColumnDef } from '@/components/ui/table';
import { formatDateTime, formatVnd } from '@/lib/format';
import { useTranslation } from '@/lib/i18n';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { CreditCard, MapPin, Package, Receipt, User } from 'lucide-react';
import { useState } from 'react';

import styles from '../seller.module.css';

interface Product {
    id: number;
    name: string;
    variant?: string;
    quantity: number;
    price: number;
}

interface Customer {
    id: number;
    first_name: string;
    last_name: string;
    email?: string;
    phone?: string;
}

interface Address {
    address_line: string;
    city: string;
    state?: string;
    postal_code?: string;
}

interface OrderHistory {
    status: number;
    note?: string;
    created_at: string;
}

interface Order {
    id: number;
    order_number: string;
    total_amount: number;
    shipping_fee: number;
    payment_method: string;
    status: number;
    created_at: string;
    customer: Customer;
    address: Address;
    products: Product[];
    history?: OrderHistory[];
}

const STATUS_VALUES = [0, 1, 2, 3, 4];

const STATUS_LABELS: Record<number, string> = {
    0: 'Pending',
    1: 'Processing',
    2: 'Shipped',
    3: 'Delivered',
    4: 'Cancelled',
};

export default function Show() {
    const { t } = useTranslation();
    const page = usePage<{ order: Order }>();
    const { order } = page.props;

    const [status, setStatus] = useState(order.status);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const handleUpdateStatus = () => {
        setLoading(true);
        router.put(
            `/seller/orders/${order.id}/status`,
            { status },
            {
                preserveScroll: true,
                onFinish: () => setLoading(false),
                onSuccess: () => setToast({ type: 'success', message: t('Order status updated successfully!') }),
                onError: () => setToast({ type: 'error', message: t('Failed to update order status.') }),
            },
        );
    };

    const productColumns: ColumnDef<Product>[] = [
        { key: 'product', header: t('Product'), cell: (product) => <span className={styles.cellTitle}>{product.name}</span> },
        { key: 'variant', header: t('Variant'), cell: (product) => <span className={styles.cellMeta}>{product.variant || '-'}</span> },
        {
            key: 'quantity',
            header: t('Qty'),
            align: 'center',
            cell: (product) => <span className={styles.numeric}>{product.quantity}</span>,
        },
        {
            key: 'price',
            header: t('Price'),
            align: 'right',
            cell: (product) => <span className={styles.price}>{formatVnd(product.price)}</span>,
        },
        {
            key: 'subtotal',
            header: t('Subtotal'),
            align: 'right',
            cell: (product) => <span className={styles.price}>{formatVnd(product.price * product.quantity)}</span>,
        },
    ];

    return (
        <WorkspaceLayout>
            <Head title={`${t('Order')} #${order.order_number}`} />
            {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

            <Header
                title={`${t('Order')} #${order.order_number}`}
                breadcrumbs={[
                    { label: t('Seller Dashboard'), href: '/seller/dashboard' },
                    { label: t('Orders'), href: '/seller/orders' },
                    { label: t('Details'), href: `/seller/orders/${order.id}`, active: true },
                ]}
            />

            <div className={styles.orderGrid}>
                <div className={styles.stack}>
                    <Card variant="flat" padding="md">
                        <div className={styles.panelBody}>
                            <div className={styles.sectionHead}>
                                <h2 className={styles.sectionTitle}>
                                    <User aria-hidden="true" className={styles.sectionIcon} />
                                    {t('Customer Information')}
                                </h2>
                                <StatusBadge status={order.status} type="order" />
                            </div>

                            <dl className={styles.detailList}>
                                <div className={styles.detailLine}>
                                    <dt>{t('Name')}</dt>
                                    <dd className={styles.detailValue}>
                                        {order.customer.first_name} {order.customer.last_name}
                                    </dd>
                                </div>
                                {order.customer.email && (
                                    <div className={styles.detailLine}>
                                        <dt>{t('Email')}</dt>
                                        <dd className={styles.detailValue}>{order.customer.email}</dd>
                                    </div>
                                )}
                                {order.customer.phone && (
                                    <div className={styles.detailLine}>
                                        <dt>{t('Phone number')}</dt>
                                        <dd className={styles.detailValue}>{order.customer.phone}</dd>
                                    </div>
                                )}
                            </dl>
                        </div>
                    </Card>

                    <Card variant="flat" padding="md">
                        <div className={styles.panelBody}>
                            <div className={styles.sectionHead}>
                                <h2 className={styles.sectionTitle}>
                                    <MapPin aria-hidden="true" className={styles.sectionIcon} />
                                    {t('Shipping Address')}
                                </h2>
                            </div>
                            <dl className={styles.detailList}>
                                <div className={styles.detailLine}>
                                    <dt>{t('Address')}</dt>
                                    <dd className={styles.detailValue}>{order.address?.address_line || '-'}</dd>
                                </div>
                                <div className={styles.detailLine}>
                                    <dt>{t('City')}</dt>
                                    <dd className={styles.detailValue}>
                                        {order.address
                                            ? [order.address.city, order.address.state, order.address.postal_code].filter(Boolean).join(', ')
                                            : t('No address provided')}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </Card>

                    <Card variant="flat" padding="md">
                        <div className={styles.panelBody}>
                            <div className={styles.sectionHead}>
                                <h2 className={styles.sectionTitle}>
                                    <Package aria-hidden="true" className={styles.sectionIcon} />
                                    {t('Products')}
                                </h2>
                            </div>
                            <Table columns={productColumns} data={order.products ?? []} rowKey="id" empty={t('No products found')} />
                        </div>
                    </Card>

                    {order.history && order.history.length > 0 && (
                        <Card variant="flat" padding="md">
                            <div className={styles.panelBody}>
                                <div className={styles.sectionHead}>
                                    <h2 className={styles.sectionTitle}>
                                        <Receipt aria-hidden="true" className={styles.sectionIcon} />
                                        {t('Order History')}
                                    </h2>
                                </div>
                                <ul className={styles.historyList}>
                                    {order.history.map((entry, index) => (
                                        <li key={index} className={styles.historyItem}>
                                            <StatusBadge status={entry.status} type="order" />
                                            <span className={styles.historyTime}>{formatDateTime(entry.created_at)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </Card>
                    )}
                </div>

                <div className={styles.stack}>
                    <Card variant="flat" padding="md">
                        <div className={styles.panelBody}>
                            <div className={styles.sectionHead}>
                                <h2 className={styles.sectionTitle}>
                                    <CreditCard aria-hidden="true" className={styles.sectionIcon} />
                                    {t('Payment Summary')}
                                </h2>
                            </div>

                            <dl className={styles.detailList}>
                                <div className={styles.detailLine}>
                                    <dt>{t('Payment Method')}</dt>
                                    <dd className={styles.detailValue}>{order.payment_method}</dd>
                                </div>
                                <div className={styles.detailLine}>
                                    <dt>{t('Shipping Fee')}</dt>
                                    <dd className={styles.detailValue}>{formatVnd(order.shipping_fee)}</dd>
                                </div>
                            </dl>

                            <div className={styles.totalRow}>
                                <span className={styles.totalLabel}>{t('Total Amount')}</span>
                                <span className={styles.totalValue}>{formatVnd(order.total_amount)}</span>
                            </div>
                        </div>
                    </Card>

                    <Card variant="flat" padding="md">
                        <div className={styles.panelBody}>
                            <div className={styles.sectionHead}>
                                <h2 className={styles.sectionTitle}>{t('Update Order Status')}</h2>
                            </div>

                            <div className={styles.statusForm}>
                                <div className={styles.statusField}>
                                    <Select
                                        value={String(status)}
                                        onChange={(event) => setStatus(Number(event.target.value))}
                                        aria-label={t('Status')}
                                    >
                                        {STATUS_VALUES.map((value) => (
                                            <option key={value} value={value}>
                                                {t(STATUS_LABELS[value])}
                                            </option>
                                        ))}
                                    </Select>
                                </div>
                                <Button type="button" variant="primary" onClick={handleUpdateStatus} loading={loading}>
                                    {t('Update')}
                                </Button>
                            </div>
                        </div>
                    </Card>

                    <div>
                        <Button asChild variant="secondary">
                            <Link href="/seller/orders">{t('Back to Orders')}</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </WorkspaceLayout>
    );
}
