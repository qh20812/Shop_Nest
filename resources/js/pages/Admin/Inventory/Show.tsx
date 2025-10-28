import React, { useMemo } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app/AppLayout';
import DataTable from '@/Components/ui/DataTable';
import ActionButtons, { ActionConfig } from '@/Components/ui/ActionButtons';
import '@/../css/Page.css';
import { useTranslation } from '@/lib/i18n';

const LOW_STOCK_THRESHOLD = 10;

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

interface InventoryLog {
  id?: number;
  quantity_change: number;
  reason: string;
  created_at: string;
  user?: Person;
}

interface AttributeValue {
  value?: string;
  name?: string | Record<string, string>;
}

interface InventoryVariant {
  variant_id: number;
  sku?: string;
  stock_quantity?: number;
  reserved_quantity?: number;
  price?: number;
  discount_price?: number;
  attribute_values?: AttributeValue[];
  attributeValues?: AttributeValue[];
  inventory_logs?: InventoryLog[];
  inventoryLogs?: InventoryLog[];
}

interface Product {
  product_id: number;
  name?: string | Record<string, string>;
  seller?: Person;
  category?: Category;
  brand?: Brand;
  variants?: InventoryVariant[];
}

interface PageProps extends Record<string, unknown> {
  product: Product;
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

const getStockStatusValue = (stockQuantity?: number): 'in_stock' | 'low_stock' | 'out_of_stock' => {
  const quantity = stockQuantity ?? 0;

  if (quantity <= 0) {
    return 'out_of_stock';
  }

  if (quantity <= LOW_STOCK_THRESHOLD) {
    return 'low_stock';
  }

  return 'in_stock';
};

const getStockStatusClass = (status: 'in_stock' | 'low_stock' | 'out_of_stock'): string => {
  if (status === 'in_stock') {
    return 'status completed';
  }

  if (status === 'low_stock') {
    return 'status process';
  }

  return 'status danger';
};

const formatQuantity = (value: number | undefined, localeTag: string): string => (
  (value ?? 0).toLocaleString(localeTag)
);

const formatDateTime = (value: string, localeTag: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString(localeTag);
};

const getVariantLogs = (variant: InventoryVariant): InventoryLog[] => (
  variant.inventory_logs ?? variant.inventoryLogs ?? []
);

const getVariantAttributes = (variant: InventoryVariant, locale: string): string[] => {
  const source = variant.attribute_values ?? variant.attributeValues;
  if (!Array.isArray(source)) {
    return [];
  }

  return source
    .map((attribute) => attribute.value ?? resolveText(attribute.name, locale, ''))
    .filter((text): text is string => Boolean(text));
};

export default function Show() {
  const { t } = useTranslation();
  const { product, locale } = usePage<PageProps>().props;

  const localeTag = toLocaleTag(locale);
  const variants = useMemo(() => product?.variants ?? [], [product]);
  const stockStatusLabels = useMemo(() => ({
    in_stock: t('In Stock'),
    low_stock: t('Low Stock'),
    out_of_stock: t('Out of Stock'),
  }), [t]);

  const productName = resolveText(product?.name, locale, t('Unnamed Product'));
  const sellerName = resolvePersonName(product?.seller, locale, t('Unknown Seller'));
  const categoryName = resolveText(product?.category?.name, locale, t('No Category'));
  const brandName = resolveText(product?.brand?.name, locale, t('No Brand'));

  const totalStock = useMemo(
    () => variants.reduce((sum, variant) => sum + (variant.stock_quantity ?? 0), 0),
    [variants],
  );

  const lowStockCount = useMemo(
    () => variants.filter((variant) => getStockStatusValue(variant.stock_quantity) === 'low_stock').length,
    [variants],
  );

  const outOfStockCount = useMemo(
    () => variants.filter((variant) => getStockStatusValue(variant.stock_quantity) === 'out_of_stock').length,
    [variants],
  );

  const variantCount = variants.length;
  const historyLink = `/admin/inventory/${product.product_id}/history`;

  const columns = useMemo(() => [
    {
      header: t('SKU'),
      cell: (variant: InventoryVariant) => variant.sku ?? `#${variant.variant_id}`,
    },
    {
      header: t('Attributes'),
      cell: (variant: InventoryVariant) => {
        const attributes = getVariantAttributes(variant, locale);
        return attributes.length > 0 ? attributes.join(', ') : '-';
      },
    },
    {
      header: t('Reserved'),
      cell: (variant: InventoryVariant) => formatQuantity(variant.reserved_quantity, localeTag),
    },
    {
      header: t('Price'),
      cell: (variant: InventoryVariant) => (
        variant.price !== undefined && variant.price !== null
          ? `${variant.price.toLocaleString(localeTag)} VND`
          : t('N/A')
      ),
    },
    {
      header: t('Qty'),
      cell: (variant: InventoryVariant) => formatQuantity(variant.stock_quantity, localeTag),
    },
    {
      header: t('Status'),
      cell: (variant: InventoryVariant) => {
        const statusValue = getStockStatusValue(variant.stock_quantity);
        return <span className={getStockStatusClass(statusValue)}>{stockStatusLabels[statusValue]}</span>;
      },
    },
    {
      header: t('Actions'),
      cell: (variant: InventoryVariant) => {
        const actions: ActionConfig[] = [
          {
            type: 'link',
            href: `${historyLink}?variant=${variant.variant_id}`,
            icon: 'bx bx-history',
            label: t('History'),
            variant: 'primary',
          },
        ];
        return <ActionButtons actions={actions} />;
      },
    },
  ], [t, locale, localeTag, stockStatusLabels, historyLink]);

  const summaryItems = [
    {
      icon: 'bx bx-package',
      value: totalStock.toLocaleString(localeTag),
      label: t('Total Stock'),
    },
    {
      icon: 'bx bx-error',
      value: lowStockCount.toLocaleString(localeTag),
      label: t('Low Stock Variants'),
    },
    {
      icon: 'bx bx-block',
      value: outOfStockCount.toLocaleString(localeTag),
      label: t('Out of Stock Variants'),
    },
    {
      icon: 'bx bx-grid',
      value: variantCount.toLocaleString(localeTag),
      label: t('Total Variants'),
    },
  ];

  const hasAnyLogs = useMemo(
    () => variants.some((variant) => getVariantLogs(variant).length > 0),
    [variants],
  );

  return (
    <AppLayout>
      <Head title={`${productName} · ${t('Inventory')}`} />

      <div className="inventory-page">
        <div className="header">
          <div className="left">
            <h1>{t('Inventory Details')}</h1>
            <ul className="breadcrumb">
              <li><a href="#">Admin</a></li>
              <li><a href="#" className="active">{t('Inventory')}</a></li>
            </ul>
          </div>
          <div className="inventory-header-actions">
            <Link href="/admin/inventory" className="inventory-link-button secondary">
              <i className="bx bx-arrow-back"></i>
              {t('Back to Inventory')}
            </Link>
            <Link href={historyLink} className="inventory-link-button">
              <i className="bx bx-history"></i>
              {t('View History')}
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
            <div className="inventory-meta-item">
              <span className="inventory-meta-label">{t('Total Stock')}</span>
              <span className="inventory-meta-value">{totalStock.toLocaleString(localeTag)}</span>
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
          data={variants}
          headerTitle="Variant Inventory"
          headerIcon="bx bx-layer"
          emptyMessage="No variants found"
        />

        <div className="inventory-log-section">
          <h2 className="inventory-section-title">{t('Recent Inventory Activity')}</h2>
          <p className="inventory-section-description">{t('Showing the latest 20 changes per variant.')}</p>

          {hasAnyLogs ? (
            <div className="inventory-log-grid">
              {variants.map((variant) => {
                const logs = getVariantLogs(variant);
                const statusValue = getStockStatusValue(variant.stock_quantity);
                const statusLabel = stockStatusLabels[statusValue];
                const attributes = getVariantAttributes(variant, locale);

                return (
                  <div key={variant.variant_id} className="inventory-log-card">
                    <div className="inventory-log-card-header">
                      <span className="inventory-product-name">
                        {variant.sku ?? `${t('Variant')} #${variant.variant_id}`}
                      </span>
                      <span className={getStockStatusClass(statusValue)}>{statusLabel}</span>
                    </div>

                    {attributes.length > 0 && (
                      <div className="inventory-variant-meta">
                        <span>{t('Attributes')}: {attributes.join(', ')}</span>
                      </div>
                    )}

                    <ul className="inventory-log-list">
                      {logs.length > 0 ? (
                        logs.map((log, index) => {
                          const changeClass = log.quantity_change > 0
                            ? 'inventory-change inventory-change-positive'
                            : log.quantity_change < 0
                              ? 'inventory-change inventory-change-negative'
                              : 'inventory-change inventory-change-neutral';

                          const formattedChange = formatQuantity(Math.abs(log.quantity_change), localeTag);
                          const signedChange = `${log.quantity_change > 0 ? '+' : log.quantity_change < 0 ? '-' : ''}${formattedChange}`;

                          return (
                            <li
                              key={log.id ?? `${variant.variant_id}-${log.created_at}-${index}`}
                              className="inventory-log-item"
                            >
                              <div className="inventory-log-item-top">
                                <span className={changeClass}>{signedChange}</span>
                                <span className="inventory-log-reason">{log.reason}</span>
                              </div>
                              <div className="inventory-log-meta">
                                <span>{resolvePersonName(log.user, locale, t('System'))}</span>
                                <span>{formatDateTime(log.created_at, localeTag)}</span>
                              </div>
                            </li>
                          );
                        })
                      ) : (
                        <li className="inventory-log-empty">{t('No recent movements for this variant.')}</li>
                      )}
                    </ul>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="inventory-log-empty">{t('No inventory activity recorded yet.')}</div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
