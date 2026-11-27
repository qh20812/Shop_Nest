import { Head, Link, usePage } from '@inertiajs/react';
import { AlertTriangle, ArrowLeft, BarChart3, Package, ShoppingBag, Store, Users } from 'lucide-react';

import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import DataTable from '@/components/ui/data-table';
import Header from '@/components/ui/header';
import Insights from '@/components/ui/insights';
import { formatDate, formatDateTime, formatNumber, formatVnd } from '@/lib/format';
import { useTranslation } from '@/lib/i18n';

import styles from '@/components/admin/admin.module.css';

interface ShopUser {
    id: number;
    username?: string | null;
    first_name?: string | null;
    last_name?: string | null;
    email?: string | null;
    shop_status?: string;
    created_at?: string;
    approved_at?: string | null;
    suspended_until?: string | null;
    rejection_reason?: string | null;
    suspension_reason?: string | null;
}

interface ShopRecord {
    name?: string | null;
    description?: string | null;
}

interface Statistics {
    products?: {
        total?: number;
        active?: number;
        inactive?: number;
        lowStockVariants?: number;
        outOfStockVariants?: number;
    };
    orders?: {
        orders?: number;
        itemsSold?: number;
        revenue?: number;
    };
    recentCustomers?: Array<{ id?: number; username?: string; first_name?: string; last_name?: string } | null>;
}

interface RecentOrder {
    order_id: number;
    order_number?: string;
    total_amount?: number;
    created_at: string;
}

interface Violation {
    id: number;
    violation_type?: string;
    severity?: string;
    description?: string;
    status?: string;
    created_at?: string;
    reported_by?: { username?: string; first_name?: string; last_name?: string } | null;
}

interface AuditLog {
    id: number;
    action?: string;
    notes?: string | null;
    created_at?: string;
    admin?: { username?: string; first_name?: string; last_name?: string } | null;
}

interface PageProps extends Record<string, unknown> {
    shop: ShopUser;
    shop_record?: ShopRecord | null;
    statistics?: Statistics;
    recentOrders?: RecentOrder[];
    recentViolations?: Violation[];
    auditLogs?: AuditLog[];
}

const severityTone = (severity?: string) => {
    if (severity === 'critical' || severity === 'high') {
        return 'danger' as const;
    }

    if (severity === 'medium') {
        return 'warning' as const;
    }

    return 'neutral' as const;
};

export default function Show() {
    const { t } = useTranslation();
    const { shop, shop_record, statistics = {}, recentOrders = [], recentViolations = [], auditLogs = [] } = usePage<PageProps>().props;

    const shopName = shop_record?.name || shop.username || `#${shop.id}`;
    const ownerName = `${shop.first_name ?? ''} ${shop.last_name ?? ''}`.trim() || shop.username || '-';

    const summaryItems = [
        { icon: Package, value: formatNumber(statistics.products?.total ?? 0), label: t('Total Products') },
        { icon: ShoppingBag, value: formatNumber(statistics.orders?.orders ?? 0), label: t('Orders') },
        { icon: BarChart3, value: formatNumber(statistics.orders?.itemsSold ?? 0), label: t('Items Sold') },
        { icon: Store, value: formatVnd(statistics.orders?.revenue ?? 0), label: t('Revenue') },
    ];

    const orderColumns = [
        {
            key: 'order_number',
            header: t('Order Number'),
            cell: (order: RecentOrder) => <span className={styles.numeric}>{order.order_number ?? `#${order.order_id}`}</span>,
        },
        {
            key: 'created_at',
            header: t('Date'),
            cell: (order: RecentOrder) => <span className={styles.numeric}>{formatDate(order.created_at)}</span>,
        },
        {
            key: 'total_amount',
            header: t('Total Amount'),
            align: 'right' as const,
            cell: (order: RecentOrder) => <span className={styles.price}>{formatVnd(Number(order.total_amount ?? 0))}</span>,
        },
    ];

    return (
        <WorkspaceLayout>
            <Head title={`${shopName} - ${t('Shop Details')}`} />

            <Header
                title={t('Shop Details')}
                breadcrumbs={[
                    { label: t('Dashboard'), href: '/admin/dashboard' },
                    { label: t('Shops'), href: '/admin/shops' },
                    { label: shopName, href: `/admin/shops/${shop.id}`, active: true },
                ]}
            />

            <div className={styles.actions}>
                <Button asChild variant="secondary">
                    <Link href="/admin/shops">
                        <ArrowLeft aria-hidden="true" />
                        {t('Back to Shops')}
                    </Link>
                </Button>
                <Button asChild variant="secondary">
                    <Link href={`/admin/shops/${shop.id}/statistics`}>
                        <BarChart3 aria-hidden="true" />
                        {t('Statistics')}
                    </Link>
                </Button>
                <Button asChild variant="secondary">
                    <Link href={`/admin/shops/${shop.id}/violations`}>
                        <AlertTriangle aria-hidden="true" />
                        {t('Violations')}
                    </Link>
                </Button>
            </div>

            <section className={styles.section}>
                <div className={styles.sectionHead}>
                    <h2 className={styles.sectionTitle}>
                        <Store aria-hidden="true" className={styles.sectionIcon} />
                        {t('Shop Overview')}
                    </h2>
                    <Badge tone={shop.shop_status === 'active' ? 'success' : shop.shop_status === 'pending' ? 'warning' : 'accent'}>
                        {t(ucfirst(shop.shop_status ?? 'pending'))}
                    </Badge>
                </div>

                <div className={styles.detailGrid}>
                    <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>{t('Shop Name')}</span>
                        <span className={styles.detailValue}>{shopName}</span>
                    </div>
                    <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>{t('Owner')}</span>
                        <span className={styles.detailValue}>{ownerName}</span>
                    </div>
                    <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Email</span>
                        <span className={styles.detailValue}>{shop.email || '-'}</span>
                    </div>
                    <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>{t('Joined')}</span>
                        <span className={styles.detailValue}>{shop.created_at ? formatDate(shop.created_at) : '-'}</span>
                    </div>
                    <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>{t('Approved At')}</span>
                        <span className={styles.detailValue}>{shop.approved_at ? formatDate(shop.approved_at) : '-'}</span>
                    </div>
                    <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>{t('Suspended Until')}</span>
                        <span className={styles.detailValue}>{shop.suspended_until ? formatDate(shop.suspended_until) : '-'}</span>
                    </div>
                </div>

                {shop_record?.description && <p className={styles.detailProse}>{shop_record.description}</p>}
            </section>

            <Insights items={summaryItems} />

            <section className={styles.section}>
                <div className={styles.sectionHead}>
                    <h2 className={styles.sectionTitle}>
                        <Package aria-hidden="true" className={styles.sectionIcon} />
                        {t('Product Statistics')}
                    </h2>
                </div>
                <div className={styles.detailGrid}>
                    <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>{t('Total Products')}</span>
                        <span className={styles.detailValue}>{formatNumber(statistics.products?.total ?? 0)}</span>
                    </div>
                    <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>{t('Active')}</span>
                        <span className={styles.detailValue}>{formatNumber(statistics.products?.active ?? 0)}</span>
                    </div>
                    <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>{t('Inactive')}</span>
                        <span className={styles.detailValue}>{formatNumber(statistics.products?.inactive ?? 0)}</span>
                    </div>
                    <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>{t('Low Stock Variants')}</span>
                        <span className={styles.detailValue}>{formatNumber(statistics.products?.lowStockVariants ?? 0)}</span>
                    </div>
                    <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>{t('Out of Stock Variants')}</span>
                        <span className={styles.detailValue}>{formatNumber(statistics.products?.outOfStockVariants ?? 0)}</span>
                    </div>
                </div>
            </section>

            <DataTable
                columns={orderColumns}
                data={recentOrders}
                headerTitle={t('Recent Orders')}
                headerIcon={ShoppingBag}
                emptyMessage={t('No recent orders')}
            />

            <section className={styles.section}>
                <div className={styles.sectionHead}>
                    <h2 className={styles.sectionTitle}>
                        <AlertTriangle aria-hidden="true" className={styles.sectionIcon} />
                        {t('Recent Violations')}
                    </h2>
                </div>
                {recentViolations.length > 0 ? (
                    <ul className={styles.logList}>
                        {recentViolations.map((violation) => (
                            <li key={violation.id} className={styles.logItem}>
                                <div className={styles.logTop}>
                                    <Badge tone={severityTone(violation.severity)}>{t(ucfirst(violation.severity ?? 'low'))}</Badge>
                                    <span className={styles.logReason}>{violation.violation_type || t('Violation')}</span>
                                </div>
                                <span className={styles.muted}>{violation.description}</span>
                                <div className={styles.logMeta}>
                                    <span>{violation.created_at ? formatDateTime(violation.created_at) : '-'}</span>
                                    <span>{violation.status ? t(ucfirst(violation.status)) : '-'}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className={styles.muted}>{t('No violations recorded')}</p>
                )}
            </section>

            <section className={styles.section}>
                <div className={styles.sectionHead}>
                    <h2 className={styles.sectionTitle}>
                        <Users aria-hidden="true" className={styles.sectionIcon} />
                        {t('Audit Trail')}
                    </h2>
                </div>
                {auditLogs.length > 0 ? (
                    <ul className={styles.logList}>
                        {auditLogs.map((log) => (
                            <li key={log.id} className={styles.logItem}>
                                <div className={styles.logTop}>
                                    <span className={styles.logReason}>{log.action || '-'}</span>
                                    <span className={styles.faint}>{log.created_at ? formatDateTime(log.created_at) : '-'}</span>
                                </div>
                                {log.notes && <span className={styles.muted}>{log.notes}</span>}
                                <span className={styles.logMeta}>
                                    {log.admin
                                        ? `${log.admin.first_name ?? ''} ${log.admin.last_name ?? ''}`.trim() || log.admin.username
                                        : t('System')}
                                </span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className={styles.muted}>{t('No audit entries recorded')}</p>
                )}
            </section>
        </WorkspaceLayout>
    );
}

const ucfirst = (value: string) => (value ? value.charAt(0).toUpperCase() + value.slice(1) : value);
