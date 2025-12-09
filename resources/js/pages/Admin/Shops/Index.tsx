import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '../../../layouts/app/AppLayout';
import BulkActions from '@/Components/admin/Shops/BulkActions';
import Pagination from '@/Components/ui/Pagination';
import DataTable from '@/Components/ui/DataTable';
import ActionDropdown from '@/Components/ui/ActionDropdown';
import { useTranslation } from '@/lib/i18n';
import FilterPanel from '@/Components/ui/FilterPanel';
import type { Shop, ShopCollection, ShopFilters as FilterParams, ShopMetrics } from './types';
import '@/../css/Page.css';

interface PageProps extends Record<string, unknown> {
  shops: ShopCollection & {
    links?: Array<{ url: string | null; label: string; active: boolean }>;
  };
  filters: FilterParams;
  metrics?: ShopMetrics;
}

const numberFormatter = new Intl.NumberFormat();

type ShopAction = 'approve' | 'reject' | 'suspend' | 'reactivate';

const statusClassMap: Record<Shop['shop_status'], string> = {
  pending: 'status pending',
  active: 'status completed',
  suspended: 'status process',
  rejected: 'status danger',
};

const formatCurrency = (value: number | null | undefined, label: string) => {
  if (value === null || value === undefined) {
    return `0 ${label}`;
  }

  const formatter = new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return `${formatter.format(value)} ${label}`;
};

const formatDate = (input?: string | null) => {
  if (!input) {
    return '—';
  }

  const parsed = new Date(input);
  if (Number.isNaN(parsed.getTime())) {
    return input;
  }

  return parsed.toLocaleDateString();
};

const formatRelative = (input?: string | null, fallback = '—') => {
  if (!input) {
    return fallback;
  }

  const parsed = new Date(input);
  if (Number.isNaN(parsed.getTime())) {
    return fallback;
  }

  const now = new Date();
  const diffMs = now.getTime() - parsed.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) {
    return '< 1h';
  }

  if (diffHours < 24) {
    return `${diffHours}h`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) {
    return `${diffDays}d`;
  }

  return parsed.toLocaleDateString();
};

export default function Index() {
  const { t } = useTranslation();
  const { shops, filters } = usePage<PageProps>().props;

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isGridLoading, setIsGridLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [actingShopId, setActingShopId] = useState<number | null>(null);
  const [localFilters, setLocalFilters] = useState<FilterParams>(filters);

  const currentShopIds = useMemo(() => shops.data.map((shop) => shop.id), [shops.data]);

  useEffect(() => {
    setSelectedIds((prev) => prev.filter((id) => currentShopIds.includes(id)));
  }, [currentShopIds]);

  useEffect(() => {
    setIsGridLoading(false);
    setActingShopId(null);
  }, [shops.data]);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const allSelectedOnPage = shops.data.length > 0 && shops.data.every((shop) => selectedIds.includes(shop.id));

  const toggleShopSelection = useCallback((shopId: number, isSelected: boolean) => {
    setSelectedIds((prev) => {
      if (isSelected) {
        if (prev.includes(shopId)) {
          return prev;
        }
        return [...prev, shopId];
      }
      return prev.filter((id) => id !== shopId);
    });
  }, []);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => {
        const combined = new Set(prev);
        shops.data.forEach((shop) => combined.add(shop.id));
        return Array.from(combined);
      });
      return;
    }

    setSelectedIds((prev) => prev.filter((id) => !currentShopIds.includes(id)));
  };

  const clearSelection = useCallback(() => setSelectedIds([]), []);

  const handleShopAction = useCallback(async (shop: Shop, action: ShopAction) => {
    if (actingShopId !== null) {
      return;
    }

    const confirmationLabels: Record<ShopAction, string> = {
      approve: t('Approve this shop?'),
      reject: t('Reject this shop?'),
      suspend: t('Suspend this shop?'),
      reactivate: t('Reactivate this shop?'),
    };

    const confirmed = window.confirm(confirmationLabels[action]);
    if (!confirmed) {
      return;
    }

    const actionRoutes: Record<ShopAction, string> = {
      approve: `/admin/shops/${shop.id}/approve`,
      reject: `/admin/shops/${shop.id}/reject`,
      suspend: `/admin/shops/${shop.id}/suspend`,
      reactivate: `/admin/shops/${shop.id}/reactivate`,
    };

    const payload: Record<string, string | number> = {};

    if (action === 'reject') {
      const reason = window.prompt(t('Provide a rejection reason (min 10 characters).')) ?? '';
      if (reason.trim().length < 10) {
        window.alert(t('Rejection reason must contain at least 10 characters.'));
        return;
      }
      payload.reason = reason.trim();
    }

    if (action === 'suspend') {
      const reason = window.prompt(t('Provide a suspension reason (min 10 characters).')) ?? '';
      if (reason.trim().length < 10) {
        window.alert(t('Suspension reason must contain at least 10 characters.'));
        return;
      }
      const durationInput = window.prompt(t('Number of suspension days (1-365).')) ?? '';
      const duration = Number.parseInt(durationInput, 10);
      if (!Number.isInteger(duration) || duration < 1 || duration > 365) {
        window.alert(t('Please enter a valid suspension duration between 1 and 365 days.'));
        return;
      }
      payload.reason = reason.trim();
      payload.duration_days = duration;
    }

    setActingShopId(shop.id);

    router.post(actionRoutes[action], payload, {
      preserveScroll: true,
      onFinish: () => setActingShopId(null),
    });
  }, [actingShopId, t]);

  const handleBulkApprove = () => {
    if (!selectedIds.length) {
      return Promise.resolve();
    }

    setIsProcessing(true);

    return new Promise<void>((resolve) => {
      router.post(
        '/admin/shops/bulk-approve',
        { shop_ids: selectedIds },
        {
          preserveScroll: true,
          onSuccess: () => setSelectedIds([]),
          onFinish: () => {
            setIsProcessing(false);
            resolve();
          },
        }
      );
    });
  };

  const handleBulkReject = (reason: string) => {
    if (!selectedIds.length) {
      return Promise.resolve();
    }

    setIsProcessing(true);

    return new Promise<void>((resolve) => {
      router.post(
        '/admin/shops/bulk-reject',
        { shop_ids: selectedIds, reason },
        {
          preserveScroll: true,
          onSuccess: () => setSelectedIds([]),
          onFinish: () => {
            setIsProcessing(false);
            resolve();
          },
        }
      );
    });
  };

  const handleFilterChange = useCallback((key: keyof FilterParams, value: string | number | undefined) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleApplyFilters = useCallback(() => {
    const payload = Object.fromEntries(Object.entries(localFilters || {}).filter(([, value]) => value !== undefined && value !== null && value !== '')) as Record<string, string | number | boolean>;
    router.get('/admin/shops', payload, {
      preserveState: true,
      onStart: () => setIsGridLoading(true),
      onFinish: () => setIsGridLoading(false),
      onSuccess: () => clearSelection(),
    });
  }, [localFilters, clearSelection]);

  const paginationLinks = shops.links ?? [];
  const paginationFilters = useMemo(() => {
    const entries = Object.entries(filters ?? {}).filter(([, value]) => value !== undefined && value !== null && value !== '');
    return Object.fromEntries(entries) as Record<string, string | number | boolean | undefined>;
  }, [filters]);

  const statusOptions = useMemo(() => [
    { value: 'pending', label: t('Pending') },
    { value: 'active', label: t('Active') },
    { value: 'suspended', label: t('Suspended') },
    { value: 'rejected', label: t('Rejected') },
  ], [t]);

  const searchConfig = useMemo(() => ({
    value: localFilters.search || '',
    onChange: (value: string) => handleFilterChange('search', value),
    placeholder: t('Search shops...'),
  }), [localFilters.search, handleFilterChange, t]);

  const filterConfigs = useMemo(() => [
    {
      value: localFilters.status || '',
      onChange: (value: string) => handleFilterChange('status', value),
      label: t('All Statuses'),
      options: statusOptions,
    },
  ], [localFilters.status, handleFilterChange, t, statusOptions]);

  const breadcrumbs = useMemo(() => [
    { label: t('Dashboard'), href: '/admin/dashboard' },
    { label: t('Shops'), href: '#', active: true },
  ], [t]);

  const statusLabelMap: Record<Shop['shop_status'], string> = useMemo(() => ({
    pending: t('Pending'),
    active: t('Active'),
    suspended: t('Suspended'),
    rejected: t('Rejected'),
  }), [t]);

  const title = t('Shop Management');

  const columns = useMemo(() => {
    const currencyLabel = t('VND');

    return [
      // {
      //   header: 'Select',
      //   cell: (shop: Shop) => (
      //     <input
      //       type="checkbox"
      //       checked={selectedIds.includes(shop.id)}
      //       onChange={(event) => toggleShopSelection(shop.id, event.target.checked)}
      //       aria-label={`${t('Select shop')} ${shop.name ?? shop.username ?? shop.id}`}
      //     />
      //   ),
      // },
      {
        header: 'Shop Name',
        accessorKey: 'name' as keyof Shop,
        cell: (shop: Shop) => (
          <div style={{ fontWeight: 600, color: 'var(--dark)' }}>
            {shop.name?.trim() || '—'}
          </div>
        ),
      },
      {
        header: 'Owner',
        cell: (shop: Shop) => {
          const fallbackName = `${shop.first_name ?? ''} ${shop.last_name ?? ''}`.trim();
          const ownerName = (fallbackName.length ? fallbackName : undefined) || (shop.username?.trim() ? shop.username : undefined) || `${t('Shop')} #${shop.id}`;
          return (<div style={{ color: 'var(--dark)' }}>{ownerName}</div>);
        },
      },
      {
        header: 'Email',
        accessorKey: 'email' as keyof Shop,
        cell: (shop: Shop) => (
          <div style={{ color: 'var(--dark-grey)' }}>{shop.email || '—'}</div>
        ),
      },
      {
        header: 'Joined',
        accessorKey: 'created_at' as keyof Shop,
        cell: (shop: Shop) => (
          <div style={{ color: 'var(--grey-dark)' }}>{formatDate(shop.created_at)}</div>
        ),
      },
      {
        header: 'Status',
        cell: (shop: Shop) => (
          <span className={statusClassMap[shop.shop_status]}>{statusLabelMap[shop.shop_status]}</span>
        ),
      },
      {
        header: 'Products',
        cell: (shop: Shop) => (
          <div style={{ color: 'var(--dark)' }}>{numberFormatter.format(shop.products_count ?? 0)}</div>
        ),
      },
      {
        header: 'Orders',
        cell: (shop: Shop) => (
          <div style={{ color: 'var(--dark)' }}>{numberFormatter.format(shop.orders_count ?? 0)}</div>
        ),
      },
      {
        header: 'Revenue',
        cell: (shop: Shop) => formatCurrency(shop.total_revenue, currencyLabel),
      },
      {
        header: 'Open Violations',
        cell: (shop: Shop) => shop.open_violations_count ?? 0,
      },
      {
        header: 'Last Activity',
        cell: (shop: Shop) => formatRelative(shop.last_activity, t('N/A')),
      },
      {
        header: 'Actions',
            cell: (shop: Shop) => {
              type DropdownAction = {
                label: string;
                icon: string;
                onClick: () => void;
                color?: 'primary' | 'success' | 'warning' | 'danger';
                disabled?: boolean;
              };
              const actions: DropdownAction[] = [
                {
                  label: 'View',
                  icon: 'bx-show',
                  onClick: () => router.get(`/admin/shops/${shop.id}`),
                  color: 'primary' as const
                },
              ];

              if (shop.shop_status === 'pending') {
                actions.push(
                  {
                    label: 'Approve',
                    icon: 'bx-check',
                    onClick: () => handleShopAction(shop, 'approve'),
                    color: 'success' as const,
                    disabled: actingShopId === shop.id,
                  },
                  {
                    label: 'Reject',
                    icon: 'bx-x',
                    onClick: () => handleShopAction(shop, 'reject'),
                    color: 'danger' as const,
                    disabled: actingShopId === shop.id,
                  }
                );
              }

              if (shop.shop_status === 'active') {
                actions.push({
                  label: 'Suspend',
                  icon: 'bx-pause-circle',
                  onClick: () => handleShopAction(shop, 'suspend'),
                  color: 'warning' as const,
                  disabled: actingShopId === shop.id,
                });
              }

              if (shop.shop_status === 'suspended') {
                actions.push({
                  label: 'Reactivate',
                  icon: 'bx-reset',
                  onClick: () => handleShopAction(shop, 'reactivate'),
                  color: 'success' as const,
                  disabled: actingShopId === shop.id,
                });
              }

              return <ActionDropdown actions={actions} />;
            },
      },
    ];
  }, [selectedIds, toggleShopSelection, t, statusLabelMap, handleShopAction, actingShopId]);

  return (
    <AppLayout>
      <Head title={t('Shop Management')} />

      

      <FilterPanel
        title={title}
        breadcrumbs={breadcrumbs}
        onApplyFilters={handleApplyFilters}
        searchConfig={searchConfig}
        filterConfigs={filterConfigs}
      />

      {/* <BulkActions
        totalOnPage={shops.data.length}
        selectedCount={selectedIds.length}
        allSelected={allSelectedOnPage}
        onToggleSelectAll={handleSelectAll}
        onClearSelection={clearSelection}
        onBulkApprove={handleBulkApprove}
        onBulkReject={handleBulkReject}
        isProcessing={isProcessing}
      /> */}

      <div style={{ opacity: isGridLoading ? 0.6 : 1 }} aria-busy={isGridLoading}>
        <DataTable
          columns={columns}
          data={shops.data}
          headerTitle="Shop List"
          headerIcon="bx-store"
          emptyMessage="No shops found"
        />
      </div>

      <Pagination links={paginationLinks} filters={paginationFilters} />
    </AppLayout>
  );
}
