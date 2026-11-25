import { Head, router, usePage } from '@inertiajs/react';
import { EyeOff, Pencil, Plus, RotateCcw, Store } from 'lucide-react';
import { useEffect, useState } from 'react';

import Toast from '@/components/admin/users/Toast';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import ActionButtons, { type ActionConfig } from '@/components/ui/action-buttons';
import { Badge } from '@/components/ui/badge';
import ConfirmationModal from '@/components/ui/confirmation-modal';
import DataTable from '@/components/ui/data-table';
import FilterPanel from '@/components/ui/filter-panel';
import Pagination from '@/components/ui/pagination';
import StatusBadge from '@/components/ui/status-badge';
import { useTranslation } from '@/lib/i18n';
import { htmlToPlainText } from '@/utils/htmlUtils';

import styles from '@/components/admin/admin.module.css';

interface Brand {
    brand_id: number;
    name: string | { [key: string]: string };
    description?: string;
    logo_url?: string;
    is_active: boolean;
    deleted_at: string | null;
    products_count: number;
    created_at: string;
}

interface PageProps {
    brands: {
        data: Brand[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    totalBrands: number;
    filters: { search?: string; status?: string };
    flash?: { success?: string; error?: string };
    [key: string]: unknown;
}

type BrandAction = 'deactivate' | 'restore';

export default function Index() {
    const { t, locale } = useTranslation();
    const { brands = { data: [], links: [] }, totalBrands = 0, filters = {}, flash = {} } = usePage<PageProps>().props;

    const getStringValue = (value: string | { [key: string]: string }): string => {
        if (typeof value === 'string') return value;
        if (typeof value === 'object' && value !== null) {
            return value[locale] || value['en'] || value['vi'] || Object.values(value)[0] || '';
        }
        return '';
    };

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
        if (flash?.success) {
            setToast({ type: 'success', message: flash.success });
        } else if (flash?.error) {
            setToast({ type: 'error', message: flash.error });
        }
    }, [flash]);

    useEffect(() => {
        const delayTimer = setTimeout(() => {
            if (search !== filters.search) {
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
    }, [search, filters.search, status]);

    const applyFilters = () => {
        router.get('/admin/brands', { search, status }, { preserveState: true });
    };

    const openConfirm = (brand: Brand, action: BrandAction) => {
        const brandName = getStringValue(brand.name);
        const labels: Record<BrandAction, { title: string; message: string }> = {
            deactivate: {
                title: t('Confirm Deactivate Brand'),
                message: `${t('Are you sure you want to deactivate brand')} "${brandName}"? ${t('This will make it inactive but can be restored later.')}`,
            },
            restore: {
                title: t('Confirm Restore Brand'),
                message: `${t('Are you sure you want to restore brand')} "${brandName}"? ${t('This will make it active again.')}`,
            },
        };

        setConfirmModal({ isOpen: true, brandId: brand.brand_id, action, ...labels[action] });
    };

    const handleConfirmAction = () => {
        if (!confirmModal.brandId || !confirmModal.action) return;

        if (confirmModal.action === 'deactivate') {
            router.delete(`/admin/brands/${confirmModal.brandId}`);
        } else {
            router.patch(`/admin/brands/${confirmModal.brandId}/restore`);
        }
    };

    const brandColumns = [
        {
            key: 'id',
            header: 'ID',
            cell: (brand: Brand) => <span className={styles.numeric}>#{brand.brand_id}</span>,
        },
        {
            key: 'brand',
            header: t('Brand'),
            cell: (brand: Brand) => {
                const brandName = getStringValue(brand.name);

                return (
                    <div className={styles.brandCell}>
                        {brand.logo_url ? (
                            <img src={brand.logo_url} alt={brandName} className={styles.brandLogo} />
                        ) : (
                            <span className={styles.brandInitial} aria-hidden="true">
                                {brandName.charAt(0).toUpperCase()}
                            </span>
                        )}
                        <div className={styles.brandBody}>
                            <span className={styles.brandName}>{brandName}</span>
                            {brand.description && (
                                <span className={styles.brandMeta}>
                                    {(() => {
                                        const plainText = htmlToPlainText(brand.description);
                                        return plainText.length > 50 ? `${plainText.substring(0, 50)}...` : plainText;
                                    })()}
                                </span>
                            )}
                        </div>
                    </div>
                );
            },
        },
        {
            key: 'products',
            header: t('Products'),
            cell: (brand: Brand) => (
                <Badge tone="accent">
                    {brand.products_count} {t('Products')}
                </Badge>
            ),
        },
        {
            key: 'status',
            header: t('Status'),
            cell: (brand: Brand) => <StatusBadge status={brand.deleted_at ? 'inactive' : 'active'} />,
        },
        {
            key: 'actions',
            header: t('Actions'),
            cell: (brand: Brand) => {
                const actions: ActionConfig[] = [];

                if (!brand.deleted_at) {
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
                            onClick: () => openConfirm(brand, 'deactivate'),
                            variant: 'danger',
                            icon: EyeOff,
                            label: t('Deactivate'),
                        },
                    );
                } else {
                    actions.push({
                        type: 'button',
                        onClick: () => openConfirm(brand, 'restore'),
                        variant: 'primary',
                        icon: RotateCcw,
                        label: t('Restore'),
                    });
                }

                return <ActionButtons actions={actions} />;
            },
        },
    ];

    return (
        <WorkspaceLayout>
            <Head title={t('Brand Management')} />

            {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

            <FilterPanel
                title={t('Brand Management')}
                breadcrumbs={[
                    { label: t('Dashboard'), href: '/admin/dashboard' },
                    { label: t('Brands'), href: '/admin/brands', active: true },
                ]}
                searchConfig={{
                    value: search,
                    onChange: setSearch,
                    placeholder: t('Search by brand name...'),
                }}
                filterConfigs={[
                    {
                        value: status,
                        onChange: setStatus,
                        label: t('-- All Brands --'),
                        options: [
                            { value: '', label: t('Active Brands') },
                            { value: 'inactive', label: t('Inactive Brands') },
                        ],
                    },
                ]}
                buttonConfigs={[
                    {
                        href: '/admin/brands/create',
                        label: t('Create Brand'),
                        icon: Plus,
                        color: 'success',
                    },
                ]}
                onApplyFilters={applyFilters}
            />

            <DataTable
                columns={brandColumns}
                data={brands.data}
                headerTitle={`${t('Brand List')} (${totalBrands})`}
                headerIcon={Store}
                emptyMessage={t('No brands found')}
            />

            <Pagination links={brands.links} />

            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false, brandId: null, action: null, title: '', message: '' })}
                onConfirm={handleConfirmAction}
                title={confirmModal.title}
                message={confirmModal.message}
            />
        </WorkspaceLayout>
    );
}
