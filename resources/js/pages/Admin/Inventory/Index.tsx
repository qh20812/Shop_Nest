import React, { useEffect, useMemo, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app/AppLayout';
import FilterPanel from '@/Components/ui/FilterPanel';
import DataTable from '@/Components/ui/DataTable';
import Pagination from '@/Components/ui/Pagination';
import ActionButtons, { ActionConfig } from '@/Components/ui/ActionButtons';
import Toast from '@/Components/admin/users/Toast';
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

interface Seller extends Person {
  id: number;
}

interface Category {
  category_id: number;
  name?: string | Record<string, string>;
}

interface Brand {
  brand_id: number;
  name?: string | Record<string, string>;
}

interface StockStatusOption {
  value: string;
  label: string;
}

interface ProductSummary {
  product_id: number;
  name?: string | Record<string, string>;
  seller?: Seller;
  category?: Category;
  brand?: Brand;
}

interface InventoryVariant {
  variant_id: number;
  sku?: string;
  stock_quantity?: number;
  price?: number;
  discount_price?: number;
  reserved_quantity?: number;
  product?: ProductSummary;
}

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface Paginated<T> {
  data: T[];
  links: PaginationLink[];
  meta?: {
    total?: number;
    per_page?: number;
    current_page?: number;
    from?: number;
    to?: number;
  };
}

interface FilterState {
  search?: string;
  seller_id?: string;
  category_id?: string;
  brand_id?: string;
  stock_status?: string;
}

interface FlashMessages {
  success?: string;
  error?: string;
}

interface InventoryIndexPageProps {
  variants: Paginated<InventoryVariant>;
  filters: FilterState;
  sellers: Seller[];
  categories: Category[];
  brands: Brand[];
  stockStatuses: StockStatusOption[];
  flash?: FlashMessages;
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

export default function Index() {
  const { t } = useTranslation();
  const {
    variants,
    filters = {},
    sellers = [],
    categories = [],
    brands = [],
    stockStatuses = [],
    flash = {},
    locale,
  } = usePage<InventoryIndexPageProps>().props;

  const localeTag = toLocaleTag(locale);

  const [search, setSearch] = useState(filters.search ?? '');
  const [sellerId, setSellerId] = useState(filters.seller_id ?? '');
  const [categoryId, setCategoryId] = useState(filters.category_id ?? '');
  const [brandId, setBrandId] = useState(filters.brand_id ?? '');
  const [stockStatus, setStockStatus] = useState(filters.stock_status ?? '');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (flash?.success) {
      setToast({ type: 'success', message: flash.success });
    } else if (flash?.error) {
      setToast({ type: 'error', message: flash.error });
    }
  }, [flash]);

  const stockStatusLabelMap = useMemo(() => {
    const map: Record<string, string> = {};
    stockStatuses.forEach((status) => {
      map[status.value] = status.label;
    });

    return map;
  }, [stockStatuses]);

  const displayedVariants = useMemo(() => variants?.data ?? [], [variants]);
  const totalVariants = variants?.meta?.total ?? displayedVariants.length;

  const statusBreakdown = useMemo(() => {
    let inStock = 0;
    let lowStock = 0;
    let outOfStock = 0;

    displayedVariants.forEach((variant) => {
      const status = getStockStatusValue(variant.stock_quantity);

      if (status === 'in_stock') {
        inStock += 1;
      } else if (status === 'low_stock') {
        lowStock += 1;
      } else {
        outOfStock += 1;
      }
    });

    return { inStock, lowStock, outOfStock };
  }, [displayedVariants]);

  const applyFilters = () => {
    router.get('/admin/inventory', {
      search: search || undefined,
      seller_id: sellerId || undefined,
      category_id: categoryId || undefined,
      brand_id: brandId || undefined,
      stock_status: stockStatus || undefined,
    }, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const clearToast = () => setToast(null);

  const columns = useMemo(() => [
    {
      header: t('Product'),
      cell: (variant: InventoryVariant) => {
        const productName = resolveText(variant.product?.name, locale, t('Unnamed Product'));
        const productId = variant.product?.product_id;
        return productId ? (
          <Link href={`/admin/inventory/${productId}`} className="inventory-product-name">{productName}</Link>
        ) : (
          <span className="inventory-product-name">{productName}</span>
        );
      },
    },
    {
      header: t('SKU'),
      cell: (variant: InventoryVariant) => variant.sku ?? '-',
    },
    {
      header: t('Seller'),
      cell: (variant: InventoryVariant) => resolvePersonName(variant.product?.seller, locale, t('Unknown Seller')),
    },
    {
      header: t('Category'),
      cell: (variant: InventoryVariant) => resolveText(variant.product?.category?.name, locale, t('No Category')),
    },
    {
      header: t('Brand'),
      cell: (variant: InventoryVariant) => resolveText(variant.product?.brand?.name, locale, t('No Brand')),
    },
    {
      header: t('Price'),
      cell: (variant: InventoryVariant) => variant.price !== undefined && variant.price !== null
        ? `${variant.price.toLocaleString(localeTag)} VND`
        : t('N/A'),
    },
    {
      header: t('Discount'),
      cell: (variant: InventoryVariant) => variant.discount_price !== undefined && variant.discount_price !== null
        ? `${variant.discount_price.toLocaleString(localeTag)} VND`
        : '-',
    },
    {
      header: t('Qty'),
      cell: (variant: InventoryVariant) => (variant.stock_quantity ?? 0).toLocaleString(localeTag),
    },
    {
      header: t('Status'),
      cell: (variant: InventoryVariant) => {
        const statusValue = getStockStatusValue(variant.stock_quantity);
        const label = stockStatusLabelMap[statusValue] ?? t('Unknown');
        return <span className={getStockStatusClass(statusValue)}>{label}</span>;
      },
    },
    {
      header: t('Actions'),
      cell: (variant: InventoryVariant) => {
        const productId = variant.product?.product_id;
        if (!productId) return null;
        const actions: ActionConfig[] = [
          { type: 'link', href: `/admin/inventory/${productId}`, icon: 'bx bx-show', label: t('View'), variant: 'primary' },
          { type: 'link', href: `/admin/inventory/${productId}/history`, icon: 'bx bx-history', label: t('History'), variant: 'primary' },
        ];
        return <ActionButtons actions={actions} />;
      },
    },
  ], [t, locale, localeTag, stockStatusLabelMap]);

  const paginationFilters = useMemo(() => ({
    search,
    seller_id: sellerId,
    category_id: categoryId,
    brand_id: brandId,
    stock_status: stockStatus,
  }), [search, sellerId, categoryId, brandId, stockStatus]);

  const summaryItems = [
    {
      icon: 'bx bx-cube',
      value: totalVariants.toLocaleString(localeTag),
      label: t('Total Variants'),
    },
    {
      icon: 'bx bx-list-check',
      value: displayedVariants.length.toLocaleString(localeTag),
      label: t('Variants on Page'),
    },
    {
      icon: 'bx bx-error',
      value: statusBreakdown.lowStock.toLocaleString(localeTag),
      label: t('Low Stock (page)'),
    },
    {
      icon: 'bx bx-block',
      value: statusBreakdown.outOfStock.toLocaleString(localeTag),
      label: t('Out of Stock (page)'),
    },
  ];

  return (
    <AppLayout>
      <Head title={t('Inventory Management')} />

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={clearToast}
        />
      )}

      <div className="inventory-page">
        <FilterPanel
          title={t('Inventory Management')}
          breadcrumbs={[
            { label: 'Dashboard', href: '/admin/dashboard' },
            { label: 'Inventory', href: '/admin/inventory', active: true },
          ]}
          onApplyFilters={applyFilters}
          searchConfig={{
            value: search,
            onChange: setSearch,
            placeholder: t('Search by product name or SKU...'),
          }}
          filterConfigs={[
            {
              value: sellerId,
              onChange: setSellerId,
              label: t('-- All Sellers --'),
              options: sellers.map((seller) => ({
                value: String(seller.id),
                label: resolvePersonName(seller, locale, t('Unknown Seller')),
              })),
            },
            {
              value: categoryId,
              onChange: setCategoryId,
              label: t('-- All Categories --'),
              options: categories.map((category) => ({
                value: String(category.category_id),
                label: resolveText(category.name, locale, t('No Category')),
              })),
            },
            {
              value: brandId,
              onChange: setBrandId,
              label: t('-- All Brands --'),
              options: brands.map((brand) => ({
                value: String(brand.brand_id),
                label: resolveText(brand.name, locale, t('No Brand')),
              })),
            },
            {
              value: stockStatus,
              onChange: setStockStatus,
              label: t('-- All Stock Statuses --'),
              options: stockStatuses.map((status) => ({
                value: status.value,
                label: status.label,
              })),
            },
          ]}
          reportButtonConfig={{
            label: t('Inventory Reports'),
            icon: 'bx bx-bar-chart-alt',
            onClick: () => router.get('/admin/inventory/report'),
          }}
        />

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
          data={displayedVariants}
          headerTitle="Inventory Overview"
          headerIcon="bx bx-package"
          emptyMessage="No inventory records found"
        />

        <Pagination links={variants?.links ?? []} filters={paginationFilters} />
      </div>
    </AppLayout>
  );
}
