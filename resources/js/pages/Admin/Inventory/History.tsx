import React, { useMemo } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app/AppLayout';
import DataTable from '@/Components/ui/DataTable';
import Pagination from '@/Components/ui/Pagination';
import '@/../css/Page.css';
import { useTranslation } from '@/lib/i18n';

const toLocaleTag = (locale: string): string => {
  if (!locale) {
    return 'en-US';
  }

  if (locale === 'vi') {
    return 'vi-VN';
  }

  if (locale === 'en') {
    return 'en-US';
  }

  return locale;
};

const resolveText = (value: unknown, locale: string, fallback: string): string => {
  if (!value) {
    return fallback;
  }

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'object') {
    const record = value as Record<string, unknown>;

    const direct = record[locale];
    if (typeof direct === 'string') {
      return direct;
    }

    const shortLocale = locale.split('-')[0];
    const shortMatch = record[shortLocale];
    if (typeof shortMatch === 'string') {
      return shortMatch;
    }

    const english = record.en;
    if (typeof english === 'string') {
      return english;
    }

    const first = Object.values(record).find((entry): entry is string => typeof entry === 'string');
    if (first) {
      return first;
    }
  }

  return String(value);
};

interface Person {
  first_name?: string;
  last_name?: string;
  name?: string | Record<string, string>;
  username?: string;
}

interface Category {
  category_id: number;
  name?: string | Record<string, string>;
}

interface Brand {
  brand_id: number;
  name?: string | Record<string, string>;
}

interface VariantSummary {
  variant_id: number;
  sku?: string;
  product?: {
    product_id: number;
    name?: string | Record<string, string>;
  };
}

interface InventoryLog {
  id?: number;
  quantity_change: number;
  reason: string;
  created_at: string;
  user?: Person;
  variant?: VariantSummary;
}

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface PaginatedLogs {
  data: InventoryLog[];
  links: PaginationLink[];
  meta?: {
    total?: number;
  };
}

interface Product {
  product_id: number;
  name?: string | Record<string, string>;
  seller?: Person;
  category?: Category;
  brand?: Brand;
}

interface PageProps extends Record<string, unknown> {
  product: Product;
  history: PaginatedLogs;
  locale: string;
}

const resolvePersonName = (person: Person | undefined, locale: string, fallback: string): string => {
  if (!person) {
    return fallback;
  }

  const fullName = `${person.first_name ?? ''} ${person.last_name ?? ''}`.trim();
  if (fullName) {
    return fullName;
  }

  if (person.name) {
    return resolveText(person.name, locale, fallback);
  }

  if (person.username) {
    return person.username;
  }

  return fallback;
};

const formatQuantity = (value: number, localeTag: string): string => {
  const absolute = Math.abs(value).toLocaleString(localeTag);
  if (value > 0) {
    return `+${absolute}`;
  }
  if (value < 0) {
    return `-${absolute}`;
  }
  return absolute;
};

const formatDateTime = (value: string, localeTag: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString(localeTag);
};

export default function History() {
  const { t } = useTranslation();
  const { product, history, locale } = usePage<PageProps>().props;

  const localeTag = toLocaleTag(locale);
  const productName = resolveText(product?.name, locale, t('Unnamed Product'));
  const sellerName = resolvePersonName(product?.seller, locale, t('Unknown Seller'));
  const categoryName = resolveText(product?.category?.name, locale, t('No Category'));
  const brandName = resolveText(product?.brand?.name, locale, t('No Brand'));

  const logs = useMemo(() => history?.data ?? [], [history]);
  const totalChanges = history?.meta?.total ?? logs.length;
  const stockInCount = useMemo(
    () => logs.filter((log) => log.quantity_change > 0).length,
    [logs],
  );
  const stockOutCount = useMemo(
    () => logs.filter((log) => log.quantity_change < 0).length,
    [logs],
  );
  const lastUpdate = logs.length > 0 ? formatDateTime(logs[0].created_at, localeTag) : t('N/A');

  const columns = useMemo(() => [
    {
      header: t('Timestamp'),
      cell: (log: InventoryLog) => (
        <span className="inventory-log-date">{formatDateTime(log.created_at, localeTag)}</span>
      ),
    },
    {
      header: t('Product'),
      cell: (log: InventoryLog) => resolveText(log.variant?.product?.name, locale, t('Unknown Product')),
    },
    {
      header: t('SKU'),
      cell: (log: InventoryLog) => log.variant?.sku ?? `#${log.variant?.variant_id ?? '-'}`,
    },
    {
      header: t('Variant ID'),
      cell: (log: InventoryLog) => `#${log.variant?.variant_id ?? '-'}`,
    },
    {
      header: t('Change'),
      cell: (log: InventoryLog) => {
        const changeClass = log.quantity_change > 0
          ? 'inventory-change inventory-change-positive'
          : log.quantity_change < 0
            ? 'inventory-change inventory-change-negative'
            : 'inventory-change inventory-change-neutral';
        return <span className={changeClass}>{formatQuantity(log.quantity_change, localeTag)}</span>;
      },
    },
    {
      header: t('Reason'),
      cell: (log: InventoryLog) => (
        <span className="inventory-log-reason">{log.reason}</span>
      ),
    },
    {
      header: t('User'),
      cell: (log: InventoryLog) => (
        <span>{resolvePersonName(log.user, locale, t('System'))}</span>
      ),
    },
  ], [t, locale, localeTag]);

  const summaryItems = [
    {
      icon: 'bx bx-history',
      value: totalChanges.toLocaleString(localeTag),
      label: t('Total Changes'),
    },
    {
      icon: 'bx bx-trending-up',
      value: stockInCount.toLocaleString(localeTag),
      label: t('Stock In Entries'),
    },
    {
      icon: 'bx bx-trending-down',
      value: stockOutCount.toLocaleString(localeTag),
      label: t('Stock Out Entries'),
    },
    {
      icon: 'bx bx-time',
      value: lastUpdate,
      label: t('Last Update'),
    },
  ];

  return (
    <AppLayout>
      <Head title={`${productName} · ${t('Inventory History')}`} />

      <div className="inventory-page">
        <div className="header">
          <div className="left">
            <h1>{t('Inventory History')}</h1>
            <ul className="breadcrumb">
              <li><a href="#">Admin</a></li>
              <li><a href="#">{t('Inventory')}</a></li>
              <li><a href="#" className="active">{t('History')}</a></li>
            </ul>
          </div>
          <div className="inventory-history-actions">
            <Link href={`/admin/inventory/${product.product_id}`} className="inventory-link-button secondary">
              <i className="bx bx-arrow-back"></i>
              {t('Back to Product Overview')}
            </Link>
            <Link href="/admin/inventory" className="inventory-link-button">
              <i className="bx bx-package"></i>
              {t('Inventory Index')}
            </Link>
          </div>
        </div>

        <div className="inventory-section">
          <h2 className="inventory-section-title">{t('Product Overview')}</h2>
          <div className="inventory-meta-grid">
            <div className="inventory-meta-item">
              <span className="inventory-meta-label">{t('Product')}</span>
              <span className="inventory-meta-value">{productName}</span>
            </div>
            <div className="inventory-meta-item">
              <span className="inventory-meta-label">{t('Product ID')}</span>
              <span className="inventory-meta-value">#{product.product_id}</span>
            </div>
            <div className="inventory-meta-item">
              <span className="inventory-meta-label">{t('Seller')}</span>
              <span className="inventory-meta-value">{sellerName}</span>
            </div>
            <div className="inventory-meta-item">
              <span className="inventory-meta-label">{t('Category')}</span>
              <span className="inventory-meta-value">{categoryName}</span>
            </div>
            <div className="inventory-meta-item">
              <span className="inventory-meta-label">{t('Brand')}</span>
              <span className="inventory-meta-value">{brandName}</span>
            </div>
          </div>
        </div>

        <ul className="insights">
          {summaryItems.map((item, index) => (
            <li key={index}>
              <i className={item.icon}></i>
              <div className="info">
                <h3>{item.value}</h3>
                <p>{item.label}</p>
              </div>
            </li>
          ))}
        </ul>

        <DataTable
          columns={columns}
          data={logs}
          headerTitle="Inventory History"
          headerIcon="bx bx-history"
          emptyMessage="No inventory changes recorded"
        />

        <Pagination links={history?.links ?? []} />
      </div>
    </AppLayout>
  );
}
