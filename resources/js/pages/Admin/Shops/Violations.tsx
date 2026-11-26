import { Head, router, usePage } from '@inertiajs/react';
import { AlertTriangle, Filter } from 'lucide-react';
import { useMemo, useState } from 'react';

import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import DataTable from '@/components/ui/data-table';
import Header from '@/components/ui/header';
import Pagination from '@/components/ui/pagination';
import { Select } from '@/components/ui/select';
import { formatDateTime } from '@/lib/format';
import { useTranslation } from '@/lib/i18n';

import styles from '@/components/admin/admin.module.css';

interface ShopSummary {
    id: number;
    username?: string;
    first_name?: string;
    last_name?: string;
    shop_status?: string;
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

interface PageProps extends Record<string, unknown> {
    shop: ShopSummary;
    violations: {
        data: Violation[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: { status?: string; severity?: string };
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

export default function Violations() {
    const { t } = useTranslation();
    const { shop, violations, filters = {} } = usePage<PageProps>().props;

    const [status, setStatus] = useState(filters.status ?? '');
    const [severity, setSeverity] = useState(filters.severity ?? '');

    const shopName = shop.username || `${shop.first_name ?? ''} ${shop.last_name ?? ''}`.trim() || `#${shop.id}`;

    const applyFilters = () => {
        router.get(`/admin/shops/${shop.id}/violations`, { status: status || undefined, severity: severity || undefined }, { preserveState: true });
    };

    const columns = useMemo(
        () => [
            {
                key: 'type',
                header: t('Violation Type'),
                cell: (violation: Violation) => <span className={styles.cellTitle}>{violation.violation_type || '-'}</span>,
            },
            {
                key: 'severity',
                header: t('Severity'),
                cell: (violation: Violation) => <Badge tone={severityTone(violation.severity)}>{t(ucfirst(violation.severity ?? 'low'))}</Badge>,
            },
            {
                key: 'description',
                header: t('Description'),
                cell: (violation: Violation) => <span className={styles.brandMeta}>{violation.description}</span>,
            },
            {
                key: 'status',
                header: t('Status'),
                cell: (violation: Violation) => (
                    <Badge tone={violation.status === 'resolved' ? 'success' : 'warning'}>{t(ucfirst(violation.status ?? 'open'))}</Badge>
                ),
            },
            {
                key: 'reporter',
                header: t('Reported By'),
                cell: (violation: Violation) => {
                    const reporter = violation.reported_by;
                    const name = reporter ? `${reporter.first_name ?? ''} ${reporter.last_name ?? ''}`.trim() || reporter.username : t('System');
                    return <span className={styles.muted}>{name}</span>;
                },
            },
            {
                key: 'created_at',
                header: t('Timestamp'),
                cell: (violation: Violation) => (
                    <span className={styles.numeric}>{violation.created_at ? formatDateTime(violation.created_at) : '-'}</span>
                ),
            },
        ],
        [t],
    );

    return (
        <WorkspaceLayout>
            <Head title={`${shopName} - ${t('Violations')}`} />

            <Header
                title={t('Violations')}
                breadcrumbs={[
                    { label: t('Dashboard'), href: '/admin/dashboard' },
                    { label: t('Shops'), href: '/admin/shops' },
                    { label: shopName, href: `/admin/shops/${shop.id}` },
                    { label: t('Violations'), href: `/admin/shops/${shop.id}/violations`, active: true },
                ]}
            />

            <section className={`${styles.filterSection} sn-glass-surface`}>
                <div className={styles.sectionHead}>
                    <h2 className={styles.sectionTitle}>
                        <Filter aria-hidden="true" className={styles.sectionIcon} />
                        {t('Filters')}
                    </h2>
                </div>

                <div className={styles.filterRow}>
                    <div className={styles.filterField}>
                        <span className={styles.filterLabel}>{t('Status')}</span>
                        <Select value={status} onChange={(event) => setStatus(event.target.value)} aria-label={t('Status')} surface="glass">
                            <option value="">{t('All')}</option>
                            <option value="open">{t('Open')}</option>
                            <option value="resolved">{t('Resolved')}</option>
                            <option value="dismissed">{t('Dismissed')}</option>
                        </Select>
                    </div>

                    <div className={styles.filterField}>
                        <span className={styles.filterLabel}>{t('Severity')}</span>
                        <Select value={severity} onChange={(event) => setSeverity(event.target.value)} aria-label={t('Severity')} surface="glass">
                            <option value="">{t('All')}</option>
                            <option value="low">{t('Low')}</option>
                            <option value="medium">{t('Medium')}</option>
                            <option value="high">{t('High')}</option>
                            <option value="critical">{t('Critical')}</option>
                        </Select>
                    </div>

                    <div className={styles.filterActions}>
                        <Button type="button" variant="primary" onClick={applyFilters}>
                            {t('Apply')}
                        </Button>
                    </div>
                </div>
            </section>

            <DataTable
                columns={columns}
                data={violations.data}
                headerTitle={t('Shop Violations')}
                headerIcon={AlertTriangle}
                emptyMessage={t('No violations recorded')}
            />

            <Pagination links={violations.links} filters={{ status, severity }} />
        </WorkspaceLayout>
    );
}

const ucfirst = (value: string) => (value ? value.charAt(0).toUpperCase() + value.slice(1) : value);
