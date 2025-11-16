import '@/../css/Page.css';
import Avatar from '@/Components/ui/Avatar';
import Header from '@/Components/ui/Header';
import Insights from '@/Components/ui/Insights';
import AppLayout from '@/layouts/app/AppLayout';
import { useTranslation } from '@/lib/i18n';
import { formatCurrency } from '@/lib/utils';
import { Head, usePage } from '@inertiajs/react';
import { useMemo } from 'react';

// Định nghĩa TypeScript interfaces cho Seller Dashboard
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

type OrderStatusKey =
    | 'pending_confirmation'
    | 'processing'
    | 'pending_assignment'
    | 'assigned_to_shipper'
    | 'delivering'
    | 'delivered'
    | 'completed'
    | 'cancelled'
    | 'returned';

interface SellerDashboardProps extends Record<string, unknown> {
    shopStats?: ShopStats;
    recentOrders?: Order[];
    topSellingProducts?: TopSellingProduct[];
    stockAlerts?: number;
    currencyCode?: string;
}

export default function Index() {
    const { t, locale } = useTranslation();
    const page = usePage<SellerDashboardProps>();
    const props = page.props;

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
    const stockAlerts = Array.isArray(props.stockAlerts) ? props.stockAlerts : [];

    const currencyCode = props.currencyCode ?? 'VND';

    const breadcrumbs = [
        { label: t('Dashboard'), href: '/seller/dashboard' },
        { label: t('Overview'), href: '#', active: true },
    ];

    // Tạo insightsData từ shopStats
    const insightsData = [
        {
            icon: 'bx-dollar-circle',
            value: formatCurrency(shopStats.total_revenue, {
                from: currencyCode,
                to: currencyCode,
                rates: {},
                locale,
                abbreviate: true,
            }),
            label: t('Total Revenue'),
            tooltip: formatCurrency(shopStats.total_revenue, {
                from: currencyCode,
                to: currencyCode,
                rates: {},
                locale,
            }),
        },
        {
            icon: 'bx-shopping-bag',
            value: shopStats.total_orders.toLocaleString(locale),
            label: t('Total Orders'),
            tooltip: t('Total completed orders'),
        },
        {
            icon: 'bx-trending-up',
            value: `${shopStats.monthly_revenue_growth.toFixed(1)}%`,
            label: t('Monthly Growth'),
            tooltip: t('Revenue growth compared to last month'),
        },
        {
            icon: 'bx-user',
            value: shopStats.unique_customers.toLocaleString(locale),
            label: t('Unique Customers'),
            tooltip: t('Total unique customers served'),
        },
    ];

    const orderStatusMap = useMemo<Record<OrderStatusKey, { className: string; label: string }>>(
        () => ({
            pending_confirmation: { className: 'pending', label: t('Pending Confirmation') },
            processing: { className: 'process', label: t('Processing') },
            pending_assignment: { className: 'process', label: t('Pending Assignment') },
            assigned_to_shipper: { className: 'process', label: t('Assigned to Shipper') },
            delivering: { className: 'process', label: t('Delivering') },
            delivered: { className: 'completed', label: t('Delivered') },
            completed: { className: 'completed', label: t('Completed') },
            cancelled: { className: 'pending', label: t('Cancelled') },
            returned: { className: 'pending', label: t('Returned') },
        }),
        [t],
    );

    const getOrderStatus = (status: string) => {
        return orderStatusMap[status as OrderStatusKey] ?? { className: 'pending', label: t('Pending') };
    };

    // Helper function để format ngày
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const handleDownloadReport = () => {
        console.log('Download report clicked');
    };

    return (
        <AppLayout>
            <Head title={t('Seller Dashboard')} />
            <Header
                title={t('Seller Dashboard')}
                breadcrumbs={breadcrumbs}
                reportButton={{
                    label: t('Download Report'),
                    icon: 'bx-cloud-download',
                    onClick: handleDownloadReport,
                }}
            />

            <Insights items={insightsData} />

            <section className="seller-widgets">
                <div className="widget-card">
                    <div className="widget-header">
                        <h3>{t('Top Selling Products')}</h3>
                        <span>{t('This month')}</span>
                    </div>
                    <div className="widget-body">
                        <div className="top-products-list">
                            {topSellingProducts.map((product, index) => (
                                <div key={product.product_id} className="product-item">
                                    <div className="product-rank">#{index + 1}</div>
                                    <div className="product-info">
                                        <h4>{product.name}</h4>
                                        <div className="product-stats">
                                            <span className="quantity">
                                                {product.total_quantity} {t('sold')}
                                            </span>
                                            <span className="revenue">
                                                {formatCurrency(product.total_revenue, {
                                                    from: currencyCode,
                                                    to: currencyCode,
                                                    rates: {},
                                                    locale,
                                                    abbreviate: true,
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="widget-card">
                    <div className="widget-header">
                        <h3>{t('Stock Alerts')}</h3>
                        <span>
                            {Array.isArray(stockAlerts) ? stockAlerts.length : stockAlerts} {t('items')}
                        </span>
                    </div>
                    <div className="widget-body">
                        <div className="alerts-list">
                            {(Array.isArray(stockAlerts) ? stockAlerts.length : stockAlerts) > 0 ? (
                                <>
                                    <div className="alert-item warning">
                                        <i className="bx bx-error-circle"></i>
                                        <div className="alert-content">
                                            <h4>{t('Low Stock Alert')}</h4>
                                            <p>
                                                {t('You have')} {Array.isArray(stockAlerts) ? stockAlerts.length : stockAlerts}{' '}
                                                {t('products with low stock')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="alert-item info">
                                        <i className="bx bx-info-circle"></i>
                                        <div className="alert-content">
                                            <h4>{t('Stock Management')}</h4>
                                            <p>{t('Monitor your inventory levels regularly')}</p>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="alert-item success">
                                    <i className="bx bx-check-circle"></i>
                                    <div className="alert-content">
                                        <h4>{t('All Stock Levels Good')}</h4>
                                        <p>{t('No low stock alerts at this time')}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <div className="bottom-data">
                <div className="orders">
                    <div className="header">
                        <i className="bx bx-receipt"></i>
                        <h3>{t('Recent Orders')}</h3>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>{t('Customer')}</th>
                                <th>{t('Order Date')}</th>
                                <th>{t('Status')}</th>
                                <th>{t('Total Amount')}</th>
                                <th>{t('Products')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders && recentOrders.length > 0 ? (
                                recentOrders.map((order) => {
                                    const { className, label } = getOrderStatus(order.status);
                                    const rowKey = order.id ?? order.order_id ?? order.order_number ?? order.created_at;

                                    // Create safe user object for Avatar component
                                    const userForAvatar = order.customer
                                        ? {
                                              id: order.customer.id || 0,
                                              username: order.customer.username || 'N/A',
                                              first_name: order.customer.first_name || '',
                                              last_name: order.customer.last_name || '',
                                              avatar: order.customer.avatar,
                                              avatar_url: order.customer.avatar_url,
                                          }
                                        : {
                                              id: 0,
                                              username: 'N/A',
                                              first_name: '',
                                              last_name: '',
                                              avatar: undefined,
                                              avatar_url: undefined,
                                          };

                                    // Normalize avatar path if it's relative
                                    if (userForAvatar.avatar && !userForAvatar.avatar.startsWith('http')) {
                                        userForAvatar.avatar = `/storage/${userForAvatar.avatar}`;
                                    }

                                    const orderCurrency = order.currency_code ?? currencyCode;
                                    const totalForDisplay =
                                        typeof order.total_amount_converted === 'number'
                                            ? order.total_amount_converted
                                            : Number(order.total_amount ?? order.total_amount_base ?? 0);

                                    return (
                                        <tr key={String(rowKey)}>
                                            <td style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <Avatar user={userForAvatar} size={36} />
                                                <p style={{ margin: 0 }}>{userForAvatar.username}</p>
                                            </td>
                                            <td>{formatDate(order.created_at)}</td>
                                            <td>
                                                <span className={`status ${className}`}>{label}</span>
                                            </td>
                                            <td>
                                                {formatCurrency(totalForDisplay, {
                                                    from: orderCurrency,
                                                    to: orderCurrency,
                                                    rates: {},
                                                    locale,
                                                })}
                                            </td>
                                            <td>
                                                <div className="order-products">
                                                    {order.items && order.items.length > 0 ? (
                                                        order.items.slice(0, 2).map((item, idx) => (
                                                            <div key={idx} className="product-summary">
                                                                {item.product_name} ({item.quantity})
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <span className="no-products">-</span>
                                                    )}
                                                    {order.items && order.items.length > 2 && (
                                                        <span className="more-items">
                                                            +{order.items.length - 2} {t('more')}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>
                                        {t('No recent orders')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="performance">
                    <div className="header">
                        <i className="bx bx-bar-chart"></i>
                        <h3>{t('Performance Metrics')}</h3>
                    </div>
                    <div className="metrics-grid">
                        <div className="metric-card">
                            <div className="metric-icon">
                                <i className="bx bx-trending-up"></i>
                            </div>
                            <div className="metric-content">
                                <h4>{t('Average Order Value')}</h4>
                                <p className="metric-value">
                                    {formatCurrency(shopStats.average_order_value, {
                                        from: currencyCode,
                                        to: currencyCode,
                                        rates: {},
                                        locale,
                                        abbreviate: true,
                                    })}
                                </p>
                            </div>
                        </div>

                        <div className="metric-card">
                            <div className="metric-icon">
                                <i className="bx bx-time-five"></i>
                            </div>
                            <div className="metric-content">
                                <h4>{t('Pending Orders')}</h4>
                                <p className="metric-value">{shopStats.pending_orders_count}</p>
                            </div>
                        </div>

                        <div className="metric-card">
                            <div className="metric-icon">
                                <i className="bx bx-package"></i>
                            </div>
                            <div className="metric-content">
                                <h4>{t('Top Product')}</h4>
                                <p className="metric-value top-product">{shopStats.top_selling_product || t('No data')}</p>
                            </div>
                        </div>

                        <div className="metric-card">
                            <div className="metric-icon">
                                <i className="bx bx-bell"></i>
                            </div>
                            <div className="metric-content">
                                <h4>{t('Stock Alerts')}</h4>
                                <p className="metric-value alert-count">{Array.isArray(stockAlerts) ? stockAlerts.length : stockAlerts}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
