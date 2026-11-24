import { DataTable, type DataTableColumn } from '@/components/ui/data-table';
import Header from '@/components/ui/header';
import Insights from '@/components/ui/insights';
import StatusBadge from '@/components/ui/status-badge';
import AppLayout from '@/layouts/app/AppLayout';
import { formatDate, formatDecimal, formatVnd } from '@/lib/format';
import { useTranslation } from '@/lib/i18n';
import { Head, usePage } from '@inertiajs/react';
import { AlertTriangle, CheckCircle2, CreditCard, Info, Package, Receipt, ShoppingBag, TrendingUp, Users } from 'lucide-react';
import { useMemo } from 'react';

import styles from '../seller.module.css';

interface ShopStats {
    total_revenue: number;
    total_orders: number;
    unique_customers: number;
    monthly_revenue_growth: number;
    low_stock_alerts: number;
    pending_orders_count: number;
    average_order_value: number;
    top_selling_product: string | null;
}

interface Customer {
    id?: number;
    username: string;
    first_name?: string;
    last_name?: string;
    avatar?: string;
    avatar_url?: string;
}

interface Order {
    id?: number;
    order_id?: number;
    order_number?: string;
    created_at: string;
    status: string;
    total_amount?: number | string;
    total_amount_base?: number | string;
    total_amount_converted?: number;
    currency_code?: string;
    customer: Customer;
    items?: Array<{
        product_name: string;
        quantity: number;
        total_price: number;
    }>;
}

interface TopSellingProduct {
    product_id: number;
    name: string;
    total_quantity: number;
    total_revenue: number;
}

interface SellerDashboardProps extends Record<string, unknown> {
    shopStats?: ShopStats;
    recentOrders?: Order[];
    topSellingProducts?: TopSellingProduct[];
    stockAlerts?: number;
}

export default function Index() {
    const { t } = useTranslation();
    const props = usePage<SellerDashboardProps>().props;

    const shopStats = props.shopStats ?? {
        total_revenue: 0,
        total_orders: 0,
        unique_customers: 0,
        monthly_revenue_growth: 0,
        low_stock_alerts: 0,
        pending_orders_count: 0,
        average_order_value: 0,
        top_selling_product: null,
    };

    const recentOrders = props.recentOrders ?? [];
    const topSellingProducts = props.topSellingProducts ?? [];
    const stockAlertCount = Array.isArray(props.stockAlerts) ? props.stockAlerts.length : Number(props.stockAlerts ?? 0);

    const breadcrumbs = [
        { label: t('Dashboard'), href: '/seller/dashboard' },
        { label: t('Overview'), href: '#', active: true },
    ];

    const insightsData = [
        {
            icon: CreditCard,
            value: formatVnd(shopStats.total_revenue),
            label: t('Total Revenue'),
        },
        {
            icon: ShoppingBag,
            value: shopStats.total_orders.toLocaleString('vi-VN'),
            label: t('Total Orders'),
            tooltip: t('Total completed orders'),
        },
        {
            icon: TrendingUp,
            value: `${formatDecimal(shopStats.monthly_revenue_growth)}%`,
            label: t('Monthly Growth'),
            tooltip: t('Revenue growth compared to last month'),
        },
        {
            icon: Users,
            value: shopStats.unique_customers.toLocaleString('vi-VN'),
            label: t('Unique Customers'),
            tooltip: t('Total unique customers served'),
        },
    ];

    const orderColumns = useMemo<DataTableColumn<Order>[]>(
        () => [
            {
                key: 'customer',
                header: t('Customer'),
                cell: (order) => (
                    <div className={styles.cellStack}>
                        <span className={styles.cellTitle}>{order.customer?.username || t('Unknown')}</span>
                        <span className={styles.cellMeta}>
                            {[order.customer?.first_name, order.customer?.last_name].filter(Boolean).join(' ') || ' '}
                        </span>
                    </div>
                ),
            },
            {
                key: 'created_at',
                header: t('Order Date'),
                cell: (order) => <span className={styles.numeric}>{formatDate(order.created_at)}</span>,
            },
            {
                key: 'status',
                header: t('Status'),
                cell: (order) => <StatusBadge status={order.status} type="order" />,
            },
            {
                key: 'total',
                header: t('Total Amount'),
                align: 'right',
                cell: (order) => {
                    const totalForDisplay =
                        typeof order.total_amount_converted === 'number'
                            ? order.total_amount_converted
                            : Number(order.total_amount ?? order.total_amount_base ?? 0);

                    return <span className={styles.price}>{formatVnd(totalForDisplay)}</span>;
                },
            },
            {
                key: 'products',
                header: t('Products'),
                cell: (order) => {
                    const items = order.items ?? [];

                    if (items.length === 0) {
                        return <span className={styles.faint}>-</span>;
                    }

                    return (
                        <div className={styles.cellStack}>
                            {items.slice(0, 2).map((item, index) => (
                                <span key={index} className={styles.cellMeta}>
                                    {item.product_name} ({item.quantity})
                                </span>
                            ))}
                            {items.length > 2 && (
                                <span className={styles.faint}>
                                    +{items.length - 2} {t('more')}
                                </span>
                            )}
                        </div>
                    );
                },
            },
        ],
        [t],
    );

    return (
        <AppLayout>
            <Head title={t('Seller Dashboard')} />
            <Header title={t('Seller Dashboard')} breadcrumbs={breadcrumbs} />

            <Insights items={insightsData} />

            <section className={styles.widgetGrid} aria-label={t('Shop overview')}>
                <div className={styles.widgetCard}>
                    <div className={styles.widgetHead}>
                        <h2 className={styles.widgetTitle}>{t('Top Selling Products')}</h2>
                    </div>

                    {topSellingProducts.length > 0 ? (
                        <ul className={styles.topList}>
                            {topSellingProducts.map((product, index) => (
                                <li key={product.product_id} className={styles.topItem}>
                                    <span className={styles.rank}>{index + 1}</span>
                                    <div className={styles.rankBody}>
                                        <span className={styles.rankName}>{product.name}</span>
                                        <span className={styles.rankStats}>
                                            <span>
                                                {product.total_quantity} {t('sold')}
                                            </span>
                                            <span>{formatVnd(product.total_revenue)}</span>
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className={styles.muted}>{t('No sales data yet')}</p>
                    )}
                </div>

                <div className={styles.widgetCard}>
                    <div className={styles.widgetHead}>
                        <h2 className={styles.widgetTitle}>{t('Stock Alerts')}</h2>
                        <span className={styles.widgetMeta}>
                            {stockAlertCount} {t('items')}
                        </span>
                    </div>

                    <div className={styles.alertList}>
                        {stockAlertCount > 0 ? (
                            <>
                                <div className={`${styles.alertRow} ${styles.alertWarning}`}>
                                    <AlertTriangle aria-hidden="true" className={styles.alertRowIcon} />
                                    <div className={styles.alertRowBody}>
                                        <span className={styles.alertRowTitle}>{t('Low Stock Alert')}</span>
                                        <span className={styles.alertRowText}>
                                            {t('You have')} {stockAlertCount} {t('products with low stock')}
                                        </span>
                                    </div>
                                </div>
                                <div className={`${styles.alertRow} ${styles.alertInfo}`}>
                                    <Info aria-hidden="true" className={styles.alertRowIcon} />
                                    <div className={styles.alertRowBody}>
                                        <span className={styles.alertRowTitle}>{t('Stock Management')}</span>
                                        <span className={styles.alertRowText}>{t('Monitor your inventory levels regularly')}</span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className={`${styles.alertRow} ${styles.alertSuccess}`}>
                                <CheckCircle2 aria-hidden="true" className={styles.alertRowIcon} />
                                <div className={styles.alertRowBody}>
                                    <span className={styles.alertRowTitle}>{t('All Stock Levels Good')}</span>
                                    <span className={styles.alertRowText}>{t('No low stock alerts at this time')}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <DataTable
                columns={orderColumns}
                data={recentOrders}
                headerTitle={t('Recent Orders')}
                headerIcon={Receipt}
                emptyMessage={t('No recent orders')}
            />

            <div className={styles.metricGrid}>
                <div className={styles.metricCard}>
                    <span className={styles.metricIcon}>
                        <TrendingUp aria-hidden="true" />
                    </span>
                    <div className={styles.metricBody}>
                        <span className={styles.metricLabel}>{t('Average Order Value')}</span>
                        <span className={styles.metricValue}>{formatVnd(shopStats.average_order_value)}</span>
                    </div>
                </div>

                <div className={styles.metricCard}>
                    <span className={styles.metricIcon}>
                        <Receipt aria-hidden="true" />
                    </span>
                    <div className={styles.metricBody}>
                        <span className={styles.metricLabel}>{t('Pending Orders')}</span>
                        <span className={styles.metricValue}>{shopStats.pending_orders_count}</span>
                    </div>
                </div>

                <div className={styles.metricCard}>
                    <span className={styles.metricIcon}>
                        <Package aria-hidden="true" />
                    </span>
                    <div className={styles.metricBody}>
                        <span className={styles.metricLabel}>{t('Top Product')}</span>
                        <span className={`${styles.metricValue} ${styles.metricValueText}`}>{shopStats.top_selling_product || t('No data')}</span>
                    </div>
                </div>

                <div className={styles.metricCard}>
                    <span className={styles.metricIcon}>
                        <AlertTriangle aria-hidden="true" />
                    </span>
                    <div className={styles.metricBody}>
                        <span className={styles.metricLabel}>{t('Stock Alerts')}</span>
                        <span className={styles.metricValue}>{stockAlertCount}</span>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
