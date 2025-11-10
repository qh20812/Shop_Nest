import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app/AppLayout';
import FilterPanel from '@/Components/ui/FilterPanel';
import DataTable from '@/Components/ui/DataTable';
import Pagination from '@/Components/ui/Pagination';
import ActionButtons, { ActionConfig } from '@/Components/ui/ActionButtons';
import StatusBadge from '@/Components/ui/StatusBadge';
import ProductInfoCell from '@/Components/admin/products/ProductInfoCell';
import { useTranslation } from '@/lib/i18n';
import '@/../css/Page.css';

interface Category {
  category_id: number;
  name: string | Record<string, string>;
}

interface Brand {
  brand_id: number;
  name: string | Record<string, string>;
}

interface ProductVariant {
  price: number;
  stock_quantity?: number;
}

interface Product {
  product_id: number;
  name: string | Record<string, string>;
  category?: { category_id: number; name: string | Record<string, string> } | null;
  brand?: { brand_id: number; name: string | Record<string, string> } | null;
  status: number;
  variants?: ProductVariant[];
  variants_count?: number;
  variants_sum_stock_quantity?: number | string | null;
  images?: Array<{ image_url: string; is_primary: boolean }>;
}

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface PaginatedProducts {
  data: Product[];
  links: PaginationLink[];
  meta?: {
    total?: number;
  };
}

type ProductInfoCellProduct = Parameters<typeof ProductInfoCell>[0]['product'];

interface SellerProductsPageProps extends Record<string, unknown> {
  products: PaginatedProducts;
  filters: {
    search?: string | null;
    category_id?: string | number | null;
    brand_id?: string | number | null;
    status?: string | number | null;
  };
  categories: Category[];
  brands: Brand[];
}

export default function Index() {
  const { t } = useTranslation();
  const { products, filters, categories, brands } = usePage<SellerProductsPageProps>().props;

  const [search, setSearch] = useState(filters?.search ? String(filters.search) : '');
  const [categoryId, setCategoryId] = useState(filters?.category_id ? String(filters.category_id) : '');
  const [brandId, setBrandId] = useState(filters?.brand_id ? String(filters.brand_id) : '');
  const [status, setStatus] = useState(filters?.status ? String(filters.status) : '');

  useEffect(() => {
    setSearch(filters?.search ? String(filters.search) : '');
    setCategoryId(filters?.category_id ? String(filters.category_id) : '');
    setBrandId(filters?.brand_id ? String(filters.brand_id) : '');
    setStatus(filters?.status ? String(filters.status) : '');
  }, [filters]);

  const applyFilters = useCallback(() => {
    router.get('/seller/products', {
      search: search || undefined,
      category_id: categoryId || undefined,
      brand_id: brandId || undefined,
      status: status || undefined,
    }, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    });
  }, [brandId, categoryId, search, status]);

  const getStringValue = useCallback((value: string | Record<string, string> | undefined | null): string => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    const locale = document.documentElement.lang || 'en';
    return value[locale] || value['en'] || value['vi'] || Object.values(value)[0] || '';
  }, []);

  const getProductStatus = useCallback((productStatus: number) => {
    switch (productStatus) {
      case 1:
        return 'pending';
      case 2:
        return 'active';
      case 3:
        return 'inactive';
      default:
        return 'pending';
    }
  }, []);

  const getProductPrice = useCallback((product: Product) => {
    if (!product.variants || product.variants.length === 0) {
      return t('No variants');
    }

    const prices = product.variants
      .map((variant) => Number(variant.price))
      .filter((price) => !Number.isNaN(price));

    if (prices.length === 0) {
      return t('No variants');
    }

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    if (minPrice === maxPrice) {
      return `${minPrice.toLocaleString()} VND`;
    }

    return `${minPrice.toLocaleString()} - ${maxPrice.toLocaleString()} VND`;
  }, [t]);

  const handleDelete = useCallback((product: Product) => {
    if (!window.confirm(t('Are you sure you want to delete this product?'))) {
      return;
    }

    router.delete(`/seller/products/${product.product_id}`, {
      preserveScroll: true,
      onError: () => {
        console.error('Failed to delete product');
      },
    });
  }, [t]);

  const productData = useMemo(() => products?.data ?? [], [products]);

  const totalProducts = useMemo(() => {
    return products?.meta?.total ?? productData.length;
  }, [productData.length, products?.meta?.total]);

  const adaptProductForCell = useCallback((product: Product): ProductInfoCellProduct => ({
    ...product,
    category: product.category ?? { name: t('No Category') },
    images: product.images ?? [],
  }), [t]);

  const productColumns = useMemo(() => [
    {
      id: 'product_info',
      header: t('Product'),
      cell: (product: Product) => <ProductInfoCell product={adaptProductForCell(product)} />,
    },
    {
      id: 'category_name',
      header: t('Category'),
      cell: (product: Product) => (
        <span style={{ color: 'var(--dark)' }}>{getStringValue(product.category?.name) || t('No Category')}</span>
      ),
    },
    {
      id: 'brand_name',
      header: t('Brand'),
      cell: (product: Product) => (
        <span style={{ color: 'var(--dark)' }}>{getStringValue(product.brand?.name) || t('No Brand')}</span>
      ),
    },
    {
      id: 'price_range',
      header: t('Price'),
      cell: (product: Product) => (
        <span style={{ color: 'var(--primary)', fontWeight: 500 }}>
          {getProductPrice(product)}
        </span>
      ),
    },
    {
      id: 'stock_quantity',
      header: t('Stock'),
      cell: (product: Product) => (
        <div
          style={{
            padding: '4px 8px',
            background: Number(product.variants_sum_stock_quantity ?? 0) > 0
              ? 'var(--light-success)'
              : 'var(--light-danger)',
            color: Number(product.variants_sum_stock_quantity ?? 0) > 0
              ? 'var(--success)'
              : 'var(--danger)',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 500,
            textAlign: 'center',
          }}
        >
          {Number(product.variants_sum_stock_quantity ?? 0).toLocaleString()} {t('units')}
        </div>
      ),
    },
    {
      id: 'status',
      header: t('Status'),
      cell: (product: Product) => (
        <StatusBadge status={getProductStatus(product.status)} />
      ),
    },
    {
      id: 'actions',
      header: t('Actions'),
      cell: (product: Product) => {
        const actions: ActionConfig[] = [
          {
            type: 'link',
            href: `/seller/products/${product.product_id}`,
            variant: 'primary',
            icon: 'bx bx-show',
            label: 'View',
          },
          {
            type: 'link',
            href: `/seller/products/${product.product_id}/edit`,
            variant: 'primary',
            icon: 'bx bx-edit',
            label: 'Edit',
          },
          {
            type: 'button',
            onClick: () => handleDelete(product),
            variant: 'danger',
            icon: 'bx bx-trash',
            label: 'Delete',
          },
        ];

        return <ActionButtons actions={actions} />;
      },
    },
  ], [adaptProductForCell, getProductPrice, getProductStatus, getStringValue, handleDelete, t]);

  return (
    <AppLayout>
      <Head title={t('Seller Product Management')} />

      <FilterPanel
        title={t('Product Management')}
        breadcrumbs={[
          { label: t('Dashboard'), href: '/seller/dashboard' },
          { label: t('Products'), href: '/seller/products', active: true },
        ]}
        reportButtonConfig={{
          label: 'Tạo sản phẩm',
          icon: 'bx bx-plus',
          onClick: () => router.visit('/seller/products/create'),
        }}
        searchConfig={{
          value: search,
          onChange: setSearch,
          placeholder: t('Search by product name or SKU...'),
        }}
        filterConfigs={[
          {
            value: categoryId,
            onChange: setCategoryId,
            label: t('-- All Categories --'),
            options: (categories ?? []).map((category) => ({
              value: category.category_id,
              label: getStringValue(category.name),
            })),
          },
          {
            value: brandId,
            onChange: setBrandId,
            label: t('-- All Brands --'),
            options: (brands ?? []).map((brand) => ({
              value: brand.brand_id,
              label: getStringValue(brand.name),
            })),
          },
          {
            value: status,
            onChange: setStatus,
            label: t('-- All Statuses --'),
            options: [
              { value: '1', label: t('Pending Approval') },
              { value: '2', label: t('Active') },
              { value: '3', label: t('Inactive') },
            ],
          },
        ]}
        onApplyFilters={applyFilters}
      />

      <DataTable
        columns={productColumns}
        data={productData}
        headerTitle={`${t('Product List')} (${totalProducts})`}
        headerIcon="bx-package"
        emptyMessage={t('No products found')}
      />

      <Pagination links={products?.links ?? []} />
    </AppLayout>
  );
}
