import { Head, Link, router, usePage } from '@inertiajs/react';
import { EyeOff, Pencil, Plus, RotateCcw, Search, Store } from 'lucide-react';
import { useEffect, useState } from 'react';

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
import { formatDate, formatNumber } from '@/lib/format';
import { useTranslation } from '@/lib/i18n';
import { htmlToPlainText } from '@/utils/htmlUtils';

import adminStyles from '@/components/admin/admin.module.css';
import styles from './Brands.module.css';

interface Brand {
    brand_id: number;
    name: string | { [key: string]: string };
    description?: string | null;
    logo_url?: string | null;
    is_active: boolean;
    deleted_at: string | null;
    products_count: number;
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface BrandPaginator {
    data: Brand[];
    links: PaginationLink[];
    from?: number | null;
    to?: number | null;
    total?: number;
}

interface PageProps {
    brands: BrandPaginator;
    totalBrands: number;
    statusCounts: Record<string, number>;
    filters: { search?: string; status?: string };
    flash?: { success?: string; error?: string };
    [key: string]: unknown;
}

type BrandAction = 'hide' | 'restore';

const resolveName = (value: Brand['name'] | undefined, locale: string, fallback: string): string => {
    if (!value) {
        return fallback;
    }

    if (typeof value === 'string') {
        return value;
    }

    return value[locale] || value.en || value.vi || Object.values(value)[0] || fallback;
};

const brandStatus = (brand: Brand): string => {
    if (brand.deleted_at) {
        return 'hidden';
    }

    return brand.is_active ? 'active' : 'inactive';
};

export default function Index() {
    const { t, locale } = useTranslation();
    const { brands = { data: [], links: [] }, totalBrands = 0, statusCounts = {}, filters = {}, flash } = usePage<PageProps>().props;

    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        brandId: number | null;
        action: BrandAction | null;
        title: string;
        message: string;
    }>({ isOpen: false, brandId: null, action: null, title: '', message: '' });

    useEffect(() => {
        setSearch(filters.search || '');
        setStatus(filters.status || '');
    }, [filters.search, filters.status]);

    useEffect(() => {
        if (flash?.success) {
            setToast({ type: 'success', message: flash.success });
        } else if (flash?.error) {
            setToast({ type: 'error', message: flash.error });
        }
    }, [flash?.success, flash?.error]);

    useEffect(() => {
        const delayTimer = setTimeout(() => {
            if (search !== (filters.search || '')) {
                router.get(
                    '/admin/brands',
                    {
                        search: search || undefined,
                        status: status || undefined,
                    },
                    {
                        preserveState: true,
                        preserveScroll: true,
                    },
                );
            }
        }, 500);

        return () => clearTimeout(delayTimer);
    }, [search, status, filters.search]);

    const applyFilters = () => {
        router.get('/admin/brands', { search: search || undefined, status: status || undefined }, { preserveState: true, preserveScroll: true });
    };

    const getBrandName = (brand: Brand): string => resolveName(brand.name, locale, t('Unnamed Brand'));

    const openConfirm = (brand: Brand, action: BrandAction) => {
        const brandName = getBrandName(brand);
        const labels: Record<BrandAction, { title: string; message: string }> = {
            hide: {
                title: t('Confirm Hide Brand'),
                message: `${t('Are you sure you want to hide brand')} "${brandName}"? ${t('This will make it invisible to users but can be restored later.')}`,
            },
            restore: {
                title: t('Confirm Restore Brand'),
                message: `${t('Are you sure you want to restore brand')} "${brandName}"? ${t('This will make it active again.')}`,
            },
        };

        setConfirmModal({ isOpen: true, brandId: brand.brand_id, action, ...labels[action] });
    };

    const closeConfirm = () => setConfirmModal({ isOpen: false, brandId: null, action: null, title: '', message: '' });

    const handleConfirmAction = () => {
        if (!confirmModal.brandId || !confirmModal.action) {
            return;
        }

        const brandId = confirmModal.brandId;
        const action = confirmModal.action;
        closeConfirm();

        if (action === 'hide') {
            router.delete(`/admin/brands/${brandId}`, { preserveScroll: true });
        } else {
            router.patch(`/admin/brands/${brandId}/restore`, {}, { preserveScroll: true });
        }
    };

    const visibleTotal = brands.total ?? totalBrands;
    const hasFilters = Boolean(filters.search || filters.status);
    const rangeLabel =
        visibleTotal > 0 ? `${formatNumber(brands.from ?? 0)}-${formatNumber(brands.to ?? 0)} / ${formatNumber(visibleTotal)}` : formatNumber(0);

    const summaryItems = [
        { key: 'total', label: t('Total Brands'), value: statusCounts.total ?? 0 },
        { key: 'active', label: t('Active Brands'), value: statusCounts.active ?? 0 },
        { key: 'inactive', label: t('Inactive Brands'), value: statusCounts.inactive ?? 0 },
        { key: 'trashed', label: t('Hidden Brands'), value: statusCounts.trashed ?? 0 },
    ];

    const columns = [
        {
            key: 'brand',
            header: t('Brand'),
            cell: (brand: Brand) => {
                const brandName = getBrandName(brand);

                return (
                    <div className={styles.brand}>
                        {brand.logo_url ? (
                            <img src={brand.logo_url} alt={brandName} className={styles.logo} />
                        ) : (
                            <span className={styles.initial} aria-hidden="true">
                                {brandName.charAt(0).toUpperCase()}
                            </span>
                        )}
                        <div className={styles.brandBody}>
                            <span className={styles.brandName} title={brandName}>
                                {brandName}
                            </span>
                            <span className={styles.brandMeta}>
                                <span>#{brand.brand_id}</span>
                                <span>{formatDate(brand.created_at)}</span>
                            </span>
                        </div>
                    </div>
                );
            },
        },
        {
            key: 'description',
            header: t('Description'),
            cell: (brand: Brand) => {
                const description = brand.description ? htmlToPlainText(brand.description) : '';

                return description ? (
                    <span className={styles.description} title={description}>
                        {description}
                    </span>
                ) : (
                    <span className={styles.description}>{t('No description')}</span>
                );
            },
        },
        {
            key: 'catalog',
            header: t('Products'),
            cell: (brand: Brand) => (
                <span className={styles.catalog}>
                    {formatNumber(brand.products_count)} <span className={styles.catalogLabel}>{t('Products')}</span>
                </span>
            ),
        },
        {
            key: 'status',
            header: t('Status'),
            cell: (brand: Brand) => <StatusBadge status={brandStatus(brand)} />,
        },
        {
            key: 'actions',
            header: t('Actions'),
            cell: (brand: Brand) => {
                const actions: ActionConfig[] = [];

                if (brand.deleted_at) {
                    actions.push({
                        type: 'button',
                        onClick: () => openConfirm(brand, 'restore'),
                        variant: 'primary',
                        icon: RotateCcw,
                        label: t('Restore'),
                    });
                } else {
                    actions.push(
                        {
                            type: 'link',
                            href: `/admin/brands/${brand.brand_id}/edit`,
                            variant: 'primary',
                            icon: Pencil,
                            label: t('Edit'),
                        },
                        {
                            type: 'button',
                            onClick: () => openConfirm(brand, 'hide'),
                            variant: 'danger',
                            icon: EyeOff,
                            label: t('Hide'),
                        },
                    );
                }

                return <ActionButtons actions={actions} />;
            },
        },
    ];

    return (
        <WorkspaceLayout>
            <Head title={t('Brand Management')} />

            {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

            <div className={adminStyles.stack}>
                <PageHeader
                    breadcrumbs={[
                        { label: t('Dashboard'), href: '/admin/dashboard' },
                        { label: t('Brands'), current: true },
                    ]}
                    title={t('Brand Management')}
                    count={formatNumber(visibleTotal)}
                    actions={
                        <Button asChild variant="primary" size="sm">
                            <Link href="/admin/brands/create">
                                <Plus aria-hidden="true" />
                                {t('Add Brand')}
                            </Link>
                        </Button>
                    }
                />

                <form
                    className={cx(styles.filters, 'sn-glass-surface')}
                    aria-label={t('Filters')}
                    onSubmit={(event) => {
                        event.preventDefault();
                        applyFilters();
                    }}
                >
                    <FormField label={t('Search')} htmlFor="brand-search">
                        <Input
                            id="brand-search"
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder={t('Search by brand name...')}
                            leadingIcon={Search}
                            surface="glass"
                        />
                    </FormField>

                    <FormField label={t('Status')} htmlFor="brand-status-filter">
                        <Select id="brand-status-filter" value={status} onChange={(event) => setStatus(event.target.value)} surface="glass">
                            <option value="">{t('All Brands')}</option>
                            <option value="active">{t('Active Brands')}</option>
                            <option value="inactive">{t('Inactive Brands')}</option>
                            <option value="trashed">{t('Hidden Brands')}</option>
                        </Select>
                    </FormField>

                    <div className={styles.filterActions}>
                        <Button type="submit" variant="primary" leftIcon={Search}>
                            {t('Apply')}
                        </Button>
                    </div>
                </form>

                <dl className={styles.summaryRail}>
                    {summaryItems.map((item) => (
                        <div key={item.key} className={styles.summary}>
                            <dt className={styles.summaryLabel}>{item.label}</dt>
                            <dd className={styles.summaryValue}>{formatNumber(item.value)}</dd>
                        </div>
                    ))}
                </dl>

                <div className={styles.table}>
                    <DataTable
                        columns={columns}
                        data={brands.data}
                        headerTitle={t('Brand List')}
                        headerIcon={Store}
                        headerMeta={rangeLabel}
                        emptyMessage={hasFilters ? t('No brands match the filters.') : t('No brands found')}
                    />
                </div>

                <Pagination links={brands.links} filters={{ search, status }} />
            </div>

            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={closeConfirm}
                onConfirm={handleConfirmAction}
                title={confirmModal.title}
                message={confirmModal.message}
            />
        </WorkspaceLayout>
    );
}
