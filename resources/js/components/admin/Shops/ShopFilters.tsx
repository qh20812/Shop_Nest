import React, { useEffect, useMemo, useRef, useState } from 'react';
import { router } from '@inertiajs/react';
import { useTranslation } from '@/lib/i18n';
import '@/../css/Page.css';

export interface ShopFilterState {
  search?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
}

interface ShopFiltersProps {
  initialFilters: ShopFilterState;
  baseRoute?: string;
  onFiltersChange?: (filters: ShopFilterState) => void;
  onLoadingChange?: (loading: boolean) => void;
}

type StatusOption = {
  value: string;
  label: string;
};

type TimeoutRef = ReturnType<typeof setTimeout> | null;

const DEFAULT_ROUTE = '/admin/shops';

const normalizeFilters = (filters: ShopFilterState): ShopFilterState => ({
  search: filters.search ?? '',
  status: filters.status ?? '',
  date_from: filters.date_from ?? '',
  date_to: filters.date_to ?? '',
});

export default function ShopFilters({
  initialFilters,
  baseRoute = DEFAULT_ROUTE,
  onFiltersChange,
  onLoadingChange,
}: ShopFiltersProps) {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<ShopFilterState>(() => normalizeFilters(initialFilters));
  const debounceRef = useRef<TimeoutRef>(null);

  useEffect(() => {
    setFilters(normalizeFilters(initialFilters));
  }, [initialFilters]);

  const statusOptions = useMemo<StatusOption[]>(
    () => [
      { value: '', label: t('-- All Statuses --') },
      { value: 'pending', label: t('Pending') },
      { value: 'active', label: t('Active') },
      { value: 'suspended', label: t('Suspended') },
      { value: 'rejected', label: t('Rejected') },
    ],
    [t]
  );

  const applyFilters = (nextFilters: ShopFilterState, replaceHistory = true) => {
    const cleaned = Object.fromEntries(
      Object.entries(nextFilters).filter(([, value]) => value !== undefined && value !== '')
    );

    onLoadingChange?.(true);

    router.get(
      baseRoute,
      cleaned,
      {
        preserveState: true,
        preserveScroll: true,
        replace: replaceHistory,
        onFinish: () => {
          onLoadingChange?.(false);
        },
      }
    );

    onFiltersChange?.(nextFilters);
  };

  const handleFieldUpdate = (key: keyof ShopFilterState, value: string) => {
    setFilters((prev) => {
      const next = { ...prev, [key]: value };

      if (key === 'search') {
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }
        debounceRef.current = setTimeout(() => applyFilters(next, false), 400);
      } else {
        applyFilters(next);
      }

      return next;
    });
  };

  const handleClearFilters = () => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    const cleared = {
      search: '',
      status: '',
      date_from: '',
      date_to: '',
    } satisfies ShopFilterState;

    setFilters(cleared);
    applyFilters(cleared);
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <section
      aria-label={t('Shop Filters')}
      style={{
        background: 'var(--light)',
        borderRadius: '20px',
        padding: '24px',
        marginBottom: '24px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: '0 4px 24px rgba(15, 23, 42, 0.06)',
      }}
    >
      <div className="form-group" style={{ flex: '1 1 240px', minWidth: '220px' }}>
        <label htmlFor="shop-search" className="form-label">
          {t('Search')}
        </label>
        <input
          id="shop-search"
          type="search"
          className="form-input-field"
          placeholder={t('Search by shop name or email')}
          value={filters.search}
          onChange={(event) => handleFieldUpdate('search', event.target.value)}
          aria-label={t('Search shops by keyword')}
        />
      </div>

      <div className="form-group" style={{ flex: '1 1 200px', minWidth: '180px' }}>
        <label htmlFor="shop-status" className="form-label">
          {t('Status')}
        </label>
        <select
          id="shop-status"
          className="form-input-field"
          value={filters.status ?? ''}
          onChange={(event) => handleFieldUpdate('status', event.target.value)}
          aria-label={t('Filter shops by status')}
        >
          {statusOptions.map((option) => (
            <option key={option.value || 'all'} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group" style={{ flex: '1 1 180px', minWidth: '160px' }}>
        <label htmlFor="shop-date-from" className="form-label">
          {t('Registered From')}
        </label>
        <input
          id="shop-date-from"
          type="date"
          className="form-input-field"
          value={filters.date_from ?? ''}
          onChange={(event) => handleFieldUpdate('date_from', event.target.value)}
          aria-label={t('Filter shops created after this date')}
          max={filters.date_to || undefined}
        />
      </div>

      <div className="form-group" style={{ flex: '1 1 180px', minWidth: '160px' }}>
        <label htmlFor="shop-date-to" className="form-label">
          {t('Registered To')}
        </label>
        <input
          id="shop-date-to"
          type="date"
          className="form-input-field"
          value={filters.date_to ?? ''}
          onChange={(event) => handleFieldUpdate('date_to', event.target.value)}
          aria-label={t('Filter shops created before this date')}
          min={filters.date_from || undefined}
        />
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'flex-start',
          gap: '12px',
          flex: '0 0 auto',
        }}
      >
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleClearFilters}
        >
          {t('Clear Filters')}
        </button>
      </div>
    </section>
  );
}
