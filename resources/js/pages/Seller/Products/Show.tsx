import React, { useCallback, useMemo } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app/AppLayout';
import Header from '@/Components/ui/Header';
import ActionButton from '@/Components/ui/ActionButton';
import { useTranslation } from '@/lib/i18n';
import { useToast } from '@/Contexts/ToastContext';
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
  variant_id: number;
  variant_name?: string;
  sku?: string;
  price: number;
  stock_quantity: number;
  option_values?: Array<{ name: string; value: string }>;
  is_primary: boolean;
}

interface ProductImage {
  image_id: number;
  image_url: string;
  alt_text?: string;
}

interface Product {
  product_id: number;
  name: string | Record<string, string>;
  name_en: string | Record<string, string>;
  description: string | Record<string, string>;
  description_en: string | Record<string, string>;
  sku: string;
  category: Category | null;
  brand: Brand | null;
  status: string;
  meta_title: string;
  meta_slug: string;
  meta_description: string;
  variants: ProductVariant[];
  images: ProductImage[];
  created_at: string;
  updated_at: string;
}

interface SellerProductShowPageProps extends Record<string, unknown> {
  product: Product;
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

const STATUS_LABELS = {
  draft: 'Draft',
  pending_approval: 'Pending Review',
  published: 'Published',
  hidden: 'Hidden',
};

function ShowContent() {
  const { t } = useTranslation();
  const { info: showInfo } = useToast();

  const { product } = usePage<SellerProductShowPageProps>().props;

  const getLocalizedValue = useCallback((value: string | Record<string, string> | undefined) => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    const locale = document.documentElement.lang || 'en';
    return value[locale] || value['en'] || value['vi'] || Object.values(value)[0] || '';
  }, []);

  const primaryVariant = product.variants.find(v => v.is_primary) || product.variants[0];

  const seoPreview = useMemo(() => {
    const productName = getLocalizedValue(product.name);
    const productDescription = getLocalizedValue(product.description);
    const fallbackTitle = productName.trim();
    const fallbackSlug = slugify(productName || '');
    const fallbackDescription = stripHtml(productDescription || '').slice(0, 160);

    return {
      title: product.meta_title || fallbackTitle,
      slug: product.meta_slug || fallbackSlug,
      description: product.meta_description || fallbackDescription,
    };
  }, [product.meta_title, product.meta_slug, product.meta_description, product.name, product.description, getLocalizedValue]);

  const handleEdit = useCallback(() => {
    router.visit(`/seller/products/${product.product_id}/edit`);
  }, [product.product_id]);

  return (
    <>
      <Head title={t('View Product')} />

      <Header
        title={t('Product Details')}
        breadcrumbs={[
          { label: t('Seller Dashboard'), href: '/seller/dashboard' },
          { label: t('Products'), href: '/seller/products' },
          { label: t('View'), href: `/seller/products/${product.product_id}`, active: true },
        ]}
        reportButton={{
          label: t('Product Guidelines'),
          icon: 'bx-help-circle',
          onClick: () => {
            showInfo(t('Guidelines are coming soon. This is a placeholder action.'));
          },
        }}
      />

      <div className="bottom-data" style={{ display: 'grid', gap: '20px' }}>
        {/* Basic Information & Localization */}
        <div className="orders">
          <div className="header">
            <i className="bx bx-package"></i>
            <h3>{t('Product Basics')}</h3>
          </div>

          <div style={{ padding: '20px', display: 'grid', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>{t('Product Name (Vietnamese)')}</label>
                <div style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px', background: '#f9f9f9' }}>
                  {getLocalizedValue(product.name)}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>{t('Product Name (English)')}</label>
                <div style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px', background: '#f9f9f9' }}>
                  {getLocalizedValue(product.name_en)}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>{t('Product SKU')}</label>
                <div style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px', background: '#f9f9f9' }}>
                  {product.sku}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>{t('Category')}</label>
                <div style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px', background: '#f9f9f9' }}>
                  {product.category ? getLocalizedValue(product.category.name) : t('N/A')}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>{t('Brand')}</label>
                <div style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px', background: '#f9f9f9' }}>
                  {product.brand ? getLocalizedValue(product.brand.name) : t('N/A')}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>{t('Status')}</label>
                <div style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px', background: '#f9f9f9' }}>
                  {t(STATUS_LABELS[product.status as keyof typeof STATUS_LABELS] || product.status)}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>{t('Product Description (Vietnamese)')}</label>
                <div
                  style={{
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    background: '#f9f9f9',
                    minHeight: '220px',
                    overflow: 'auto'
                  }}
                  dangerouslySetInnerHTML={{ __html: getLocalizedValue(product.description) }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>{t('Product Description (English)')}</label>
                <div
                  style={{
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    background: '#f9f9f9',
                    minHeight: '220px',
                    overflow: 'auto'
                  }}
                  dangerouslySetInnerHTML={{ __html: getLocalizedValue(product.description_en) }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="orders">
          <div className="header">
            <i className="bx bx-dollar-circle"></i>
            <h3>{t('Pricing & Inventory')}</h3>
          </div>

          <div style={{ padding: '20px', display: 'grid', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>{t('Base Price (VND)')}</label>
                <div style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px', background: '#f9f9f9' }}>
                  {primaryVariant ? primaryVariant.price.toLocaleString('vi-VN') : 'N/A'}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>{t('Total Stock')}</label>
                <div style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px', background: '#f9f9f9' }}>
                  {primaryVariant ? primaryVariant.stock_quantity : 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Media Library */}
        <div className="orders">
          <div className="header">
            <i className="bx bx-image"></i>
            <h3>{t('Media & Gallery')}</h3>
          </div>

          <div style={{ padding: '20px', display: 'grid', gap: '20px' }}>
            <div
              style={{
                display: 'grid',
                gap: '16px',
                gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              }}
            >
              {product.images.map((image) => (
                <div
                  key={image.image_id}
                  style={{
                    position: 'relative',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 6px 18px rgba(15, 23, 42, 0.08)',
                  }}
                >
                  <img
                    src={image.image_url}
                    alt={image.alt_text || 'product image'}
                    style={{ width: '100%', height: '160px', objectFit: 'cover' }}
                  />
                </div>
              ))}
              {product.images.length === 0 && (
                <div
                  style={{
                    border: '2px dashed var(--grey)',
                    borderRadius: '12px',
                    minHeight: '160px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: '12px',
                    color: 'var(--dark-grey)',
                  }}
                >
                  <i className="bx bx-image" style={{ fontSize: '28px' }}></i>
                  <span>{t('No images available')}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SEO Preview */}
        <div className="orders">
          <div className="header">
            <i className="bx bx-chart"></i>
            <h3>{t('SEO Preview')}</h3>
          </div>

          <div style={{ padding: '20px', display: 'grid', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>{t('Meta Title')}</label>
                <div style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px', background: '#f9f9f9' }}>
                  {product.meta_title}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>{t('Meta Slug')}</label>
                <div style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px', background: '#f9f9f9' }}>
                  {product.meta_slug}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>{t('Meta Description')}</label>
                <div style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px', background: '#f9f9f9' }}>
                  {product.meta_description}
                </div>
              </div>
            </div>

            <div style={{
              border: '1px solid #dadce0',
              borderRadius: '12px',
              padding: '16px',
              background: '#fff',
            }}>
              <span style={{ color: '#70757a', fontSize: '12px' }}>{t('Search preview')}</span>
              <div style={{ marginTop: '8px' }}>
                <div style={{ color: '#1a0dab', fontSize: '18px', lineHeight: '1.3' }}>{seoPreview.title}</div>
                <div style={{ color: '#006621', fontSize: '14px' }}>shopnest.vn/products/{seoPreview.slug}</div>
                <div style={{ color: '#4d5156', fontSize: '13px', lineHeight: '1.6' }}>{seoPreview.description}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '12px', marginTop: '24px' }}>
        <ActionButton
          variant="secondary"
          type="button"
          icon="bx bx-arrow-back"
          onClick={() => router.visit('/seller/products')}
        >
          {t('Back to Products')}
        </ActionButton>
        <ActionButton
          variant="primary"
          type="button"
          icon="bx bx-edit"
          onClick={handleEdit}
        >
          {t('Edit Product')}
        </ActionButton>
      </div>
    </>
  );
}

export default function Show() {
  return (
    <AppLayout>
      <ShowContent />
    </AppLayout>
  );
}
