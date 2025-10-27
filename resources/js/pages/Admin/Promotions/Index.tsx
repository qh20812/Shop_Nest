import React, { useEffect, useMemo, useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '../../../layouts/app/AppLayout';
import FilterPanel from '@/Components/ui/FilterPanel';
import DataTable from '@/Components/ui/DataTable';
import Pagination from '@/Components/ui/Pagination';
import StatusBadge from '@/Components/ui/StatusBadge';
import ActionButtons, { ActionConfig } from '@/Components/ui/ActionButtons';
import ConfirmationModal from '@/Components/ui/ConfirmationModal';
import Toast from '@/Components/admin/users/Toast';
import { useTranslation } from '@/lib/i18n';
import '@/../css/Page.css';

interface Promotion {
  promotion_id: number;
  name: string;
  type: string;
  value: number | string;
  start_date: string;
  end_date: string;
  usage_limit: number | null;
  used_count: number;
  is_active: boolean;
  allocated_budget?: number | string | null;
  spent_budget?: number | string | null;
  roi_percentage?: number | string | null;
  status: string;
}

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface PromotionPaginator {
  data: Promotion[];
  links: PaginationLink[];
}

interface PageProps {
  promotions: PromotionPaginator;
  typeOptions: Record<string, string>;
  statusFilters: string[];
  filters?: Record<string, string>;
  flash?: { success?: string; error?: string };
  [key: string]: unknown;
}

interface ConfirmState {
  open: boolean;
  promotionId: number | null;
  promotionName: string;
}

type TableColumn = {
  header: string;
  accessorKey?: keyof Promotion;
  cell?: (promotion: Promotion) => React.ReactNode;
};

const formatDate = (value?: string | null) => {
  if (!value) {
    return '—';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString();
};

const formatCurrency = (value?: number | string | null) => {
  if (value === null || value === undefined || value === '') {
    return '—';
  }

  const numeric = typeof value === 'string' ? parseFloat(value) : Number(value);
  if (Number.isNaN(numeric)) {
    return '—';
  }

  return `${numeric.toLocaleString()} VND`;
};

export default function Index() {
  const { t } = useTranslation();
  const { promotions, typeOptions, statusFilters, filters = {}, flash } = usePage<PageProps>().props;

  const [search, setSearch] = useState(filters.search ?? '');
  const [status, setStatus] = useState(filters.status ?? '');
  const [type, setType] = useState(filters.type ?? '');
  const [confirmState, setConfirmState] = useState<ConfirmState>({ open: false, promotionId: null, promotionName: '' });
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    setSearch(filters.search ?? '');
    setStatus(filters.status ?? '');
    setType(filters.type ?? '');
  }, [filters.search, filters.status, filters.type]);

  useEffect(() => {
    if (flash?.success) {
      setToast({ type: 'success', message: flash.success });
    } else if (flash?.error) {
      setToast({ type: 'error', message: flash.error });
    }
  }, [flash?.success, flash?.error]);

  const applyFilters = () => {
    router.get(
      '/admin/promotions',
      {
        search: search || undefined,
        status: status || undefined,
        type: type || undefined,
      },
      {
        preserveState: true,
        preserveScroll: true,
      }
    );
  };

  const openDeleteModal = (promotion: Promotion) => {
    setConfirmState({
      open: true,
      promotionId: promotion.promotion_id,
      promotionName: promotion.name,
    });
  };

  const handleConfirmDelete = () => {
    if (!confirmState.promotionId) {
      return;
    }

    router.delete(`/admin/promotions/${confirmState.promotionId}`, {
      preserveScroll: true,
    });
  };

  const clearToast = () => {
    setToast(null);
  };

  const columns: TableColumn[] = useMemo(() => {
    return [
      {
        header: 'Promotion Name',
        cell: (promotion) => (
          <div className="promotion-cell">
            <div className="promotion-name">{promotion.name || t('Unnamed Promotion')}</div>
            <div className="promotion-meta">
              {formatDate(promotion.start_date)} ⟶ {formatDate(promotion.end_date)}
            </div>
          </div>
        ),
      },
      {
        header: 'Type',
        cell: (promotion) => (
          <div className="promotion-meta">{typeOptions[promotion.type] ?? promotion.type}</div>
        ),
      },
      {
        header: 'Discount Value',
        cell: (promotion) => (
          <div className="promotion-discount">
            {promotion.type === 'percentage'
              ? `${Number(promotion.value).toLocaleString()}%`
              : formatCurrency(promotion.value)}
          </div>
        ),
      },
      {
        header: 'Budget',
        cell: (promotion) => (
          <div className="promotion-budget">
            <div className="promotion-budget-amount">{formatCurrency(promotion.allocated_budget)}</div>
            <div className="promotion-meta">
              {t('Spent')}: {formatCurrency(promotion.spent_budget)}
            </div>
          </div>
        ),
      },
      {
        header: 'Usage',
        cell: (promotion) => (
          <div className="promotion-meta">
            {promotion.usage_limit
              ? `${promotion.used_count} / ${promotion.usage_limit}`
              : `${promotion.used_count}`}
          </div>
        ),
      },
      {
        header: 'Status',
        cell: (promotion) => <StatusBadge status={promotion.status} />,
      },
      {
        header: 'Actions',
        cell: (promotion) => {
          const actions: ActionConfig[] = [
            {
              type: 'link',
              label: t('View'),
              href: `/admin/promotions/${promotion.promotion_id}`,
              icon: 'bx bx-show',
              variant: 'primary',
            },
            {
              type: 'link',
              label: t('Edit'),
              href: `/admin/promotions/${promotion.promotion_id}/edit`,
              icon: 'bx bx-edit',
              variant: 'primary',
            },
            {
              type: 'button',
              label: t('Delete'),
              onClick: () => openDeleteModal(promotion),
              icon: 'bx bx-trash',
              variant: 'danger',
            },
          ];

          return <ActionButtons actions={actions} />;
        },
      },
    ];
  }, [t, typeOptions]);

  return (
    <AppLayout>
      <Head title={t('Promotion Management')} />

      {toast && (
        <Toast type={toast.type} message={toast.message} onClose={clearToast} />
      )}

      <FilterPanel
        title="Promotion Management"
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin/dashboard' },
          { label: 'Promotions', href: '/admin/promotions', active: true },
        ]}
        onApplyFilters={applyFilters}
        searchConfig={{
          value: search,
          onChange: setSearch,
          placeholder: 'Search promotions, sellers, products...',
        }}
        filterConfigs={[
          {
            value: status,
            onChange: setStatus,
            label: t('-- All Statuses --'),
            options: statusFilters.map((item) => ({ value: item, label: t(ucfirst(item)) })),
          },
          {
            value: type,
            onChange: setType,
            label: t('-- All Types --'),
            options: Object.keys(typeOptions).map((key) => ({ value: key, label: t(typeOptions[key]) })),
          },
        ]}
        buttonConfigs={[
          {
            href: '/admin/promotions/create',
            label: t('Create Promotion'),
            icon: 'bx bx-plus',
            color: 'primary',
          },
        ]}
      />

      <DataTable<Promotion>
        columns={columns}
        data={promotions.data}
        headerTitle={t('Promotions')}
        headerIcon="bx-purchase-tag"
        emptyMessage={t('No promotions found')}
      />

      <Pagination links={promotions.links} filters={{ search, status, type }} />

      <ConfirmationModal
        isOpen={confirmState.open}
        onClose={() => setConfirmState({ open: false, promotionId: null, promotionName: '' })}
        onConfirm={handleConfirmDelete}
        title={t('Delete Promotion')}
        message={t('Are you sure you want to delete this promotion?')}
      />
    </AppLayout>
  );
}

const ucfirst = (value: string) => {
  if (!value) {
    return value;
  }
  return value.charAt(0).toUpperCase() + value.slice(1);
};
