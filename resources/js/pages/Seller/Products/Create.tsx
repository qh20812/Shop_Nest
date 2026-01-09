import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app/AppLayout';
import Header from '@/Components/ui/Header';
import PrimaryInput from '@/Components/ui/PrimaryInput';
import ActionButton from '@/Components/ui/ActionButton';
import RichTextEditor from '@/Components/ui/RichTextEditor';
import { useTranslation } from '@/lib/i18n';
import { useToast } from '@/Contexts/ToastContext';
import '@/../css/Page.css';

interface CategoryOption {
  value: string;
  label: string;
}

interface Category {
  category_id: number;
  name: string | Record<string, string>;
}

interface Brand {
  brand_id: number;
  name: string | Record<string, string>;
}

interface SellerProductCreatePageProps extends Record<string, unknown> {
  categories: Category[];
  brands: Brand[];
}

interface MediaPreview {
  id: string;
  url: string;
  isObjectUrl: boolean;
  file?: File;
}

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'pending_approval', label: 'Pending Review' },
  { value: 'published', label: 'Published' },
  { value: 'hidden', label: 'Hidden' },
];

interface SellerProductFormData {
  name: string;
  name_en: string;
  description: string;
  description_en: string;
  price: string;
  stock: string;
  category_id: string;
  brand_id: string;
  status: string;
  sku: string;
  images: File[];
  meta_title: string;
  meta_slug: string;
  meta_description: string;
  variants: Array<{
    variant_name?: string;
    sku?: string;
    price: number;
    stock_quantity: number;
    option_values?: Array<{ name: string; value: string }>;
    is_primary: boolean;
  }>;
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

function CreateContent() {
  const { t } = useTranslation();
  const { success: showSuccess, error: showError, info: showInfo } = useToast();

  const { categories = [], brands = [] } = usePage<SellerProductCreatePageProps>().props;

  const defaultCategoryId = categories[0]?.category_id ? String(categories[0].category_id) : '';
  const defaultBrandId = brands[0]?.brand_id ? String(brands[0].brand_id) : '';

  const form = useForm<SellerProductFormData>({
    name: '',
    name_en: '',
    description: '',
    description_en: '',
    price: '',
    stock: '',
    category_id: defaultCategoryId,
    brand_id: defaultBrandId,
    status: STATUS_OPTIONS[0]?.value ?? 'draft',
    sku: '',
    images: [],
    meta_title: '',
    meta_slug: '',
    meta_description: '',
    variants: [
      {
        variant_name: '',
        sku: '',
        price: 0,
        stock_quantity: 0,
        option_values: [],
        is_primary: true,
      },
    ],
  });
  const [isMetaTitleTouched, setIsMetaTitleTouched] = useState(false);
  const [isMetaSlugTouched, setIsMetaSlugTouched] = useState(false);
  const [isMetaDescriptionTouched, setIsMetaDescriptionTouched] = useState(false);
  const [mediaPreviews, setMediaPreviews] = useState<MediaPreview[]>([]);
  const seoPreview = useMemo(() => {
    const fallbackTitle = form.data.name.trim();
    const fallbackSlug = slugify(form.data.name || '');
    const fallbackDescription = stripHtml(form.data.description || '').slice(0, 160);

    return {
      title: form.data.meta_title || fallbackTitle,
      slug: form.data.meta_slug || fallbackSlug,
      description: form.data.meta_description || fallbackDescription,
    };
  }, [form.data.meta_title, form.data.meta_slug, form.data.meta_description, form.data.name, form.data.description]);

  const getLocalizedValue = useCallback((value: string | Record<string, string> | undefined) => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    const locale = document.documentElement.lang || 'en';
    return value[locale] || value['en'] || value['vi'] || Object.values(value)[0] || '';
  }, []);

  const categoryOptions = useMemo<CategoryOption[]>(() => {
    return [
      { value: '', label: t('-- Select Category --') },
      ...categories.map((category) => ({
        value: String(category.category_id),
        label: getLocalizedValue(category.name),
      })),
    ];
  }, [categories, getLocalizedValue, t]);

  const brandOptions = useMemo<CategoryOption[]>(() => {
    return [
      { value: '', label: t('-- Select Brand --') },
      ...brands.map((brand) => ({
        value: String(brand.brand_id),
        label: getLocalizedValue(brand.name),
      })),
    ];
  }, [brands, getLocalizedValue, t]);

  const statusOptions = useMemo(() => STATUS_OPTIONS.map((status) => ({
    value: status.value,
    label: t(status.label),
  })), [t]);

  useEffect(() => {
    return () => {
      mediaPreviews
        .filter((media) => media.isObjectUrl)
        .forEach((media) => URL.revokeObjectURL(media.url));
    };
  }, [mediaPreviews]);

  const handleMediaUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) {
      return;
    }

    const previews: MediaPreview[] = files.map((file) => ({
      id: `media-${file.name}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      url: URL.createObjectURL(file),
      isObjectUrl: true,
      file,
    }));

    setMediaPreviews((prev) => [...prev, ...previews]);
    form.setData('images', [...form.data.images, ...files]);
    showInfo(t('Sample previews added. Files are not uploaded yet.'));
  }, [form, showInfo, t]);

  const handleRemoveMedia = useCallback((id: string) => {
    setMediaPreviews((prev) => {
      const target = prev.find((media) => media.id === id);
      if (target?.isObjectUrl) {
        URL.revokeObjectURL(target.url);
      }
      if (target?.file) {
        form.setData('images', form.data.images.filter((imageFile) => imageFile !== target.file));
      }
      return prev.filter((media) => media.id !== id);
    });
    showInfo(t('Removed selected media preview.'));
  }, [form, showInfo, t]);

  const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.data.name.trim() || !form.data.description.trim()) {
      showError(t('Please provide the product name and description.'));
      return;
    }

    form.transform((data) => {
      // Always create variants from the legacy price/stock fields for single variant
      const price = parseFloat(data.price) || 0;
      const stock = parseInt(data.stock) || 0;
      let variants = data.variants;

      if (!variants || variants.length === 0) {
        variants = [
          {
            variant_name: '',
            sku: data.sku.trim() || undefined,
            price: price,
            stock_quantity: stock,
            option_values: [],
            is_primary: true,
          },
        ];
      } else {
        // Update the first variant with the entered price/stock if it's the primary
        if (variants[0] && variants[0].is_primary) {
          variants[0].price = price;
          variants[0].stock_quantity = stock;
          variants[0].sku = data.sku.trim() || variants[0].sku;
        }
      }

      return {
        ...data,
        name: data.name.trim(),
        name_en: data.name_en.trim(),
        description: data.description,
        description_en: data.description_en.trim(),
        category_id: data.category_id,
        brand_id: data.brand_id,
        status: data.status,
        variants: variants,
        images: data.images,
        meta_title: (data.meta_title || data.name).trim(),
        meta_slug: slugify(data.meta_slug || data.name),
        meta_description: (data.meta_description || stripHtml(data.description).slice(0, 160)).trim(),
      };
    });

    form.post('/seller/products', {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        showSuccess(t('Product created successfully!'));
      },
      onError: () => {
        showError(t('Please review the highlighted fields.'));
      },
      onFinish: () => {
        form.transform((original) => original);
      },
    });
  }, [form, showSuccess, showError, t]);

  useEffect(() => {
    if (!form.data.name) {
      return;
    }

    const currentName = form.data.name;

    if (!isMetaTitleTouched && form.data.meta_title !== currentName) {
      form.setData('meta_title', currentName);
    }

    if (!isMetaSlugTouched) {
      const slugValue = slugify(currentName);
      if (form.data.meta_slug !== slugValue) {
        form.setData('meta_slug', slugValue);
      }
    }
  }, [form, form.data.name, isMetaSlugTouched, isMetaTitleTouched]);

  useEffect(() => {
    if (!form.data.description || isMetaDescriptionTouched) {
      return;
    }

    const cleanDescription = stripHtml(form.data.description).slice(0, 160);
    if (form.data.meta_description !== cleanDescription) {
      form.setData('meta_description', cleanDescription);
    }
  }, [form, form.data.description, isMetaDescriptionTouched]);

  return (
    <>
      <Head title={t('Create Product')} />

      <Header
        title={t('Create New Product')}
        breadcrumbs={[
          { label: t('Seller Dashboard'), href: '/seller/dashboard' },
          { label: t('Products'), href: '/seller/products' },
          { label: t('Create'), href: '/seller/products/create', active: true },
        ]}
        reportButton={{
          label: t('Product Guidelines'),
          icon: 'bx-help-circle',
          onClick: () => {
            showInfo(t('Guidelines are coming soon. This is a placeholder action.'));
          },
        }}
      />

      <form onSubmit={handleSubmit}>
        <div className="bottom-data" style={{ display: 'grid', gap: '20px' }}>
          {/* Basic Information & Localization */}
          <div className="orders">
            <div className="header">
              <i className="bx bx-package"></i>
              <h3>{t('Product Basics')}</h3>
            </div>

            <div style={{ padding: '20px', display: 'grid', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <PrimaryInput
                  label={t('Product Name (Vietnamese)')}
                  name="name_vi"
                  value={form.data.name}
                  onChange={(event) => form.setData('name', event.target.value)}
                  error={form.errors.name}
                  required
                />
                <PrimaryInput
                  label={t('Product Name (English)')}
                  name="name_en"
                  value={form.data.name_en}
                  onChange={(event) => form.setData('name_en', event.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '20px' }}>
                <PrimaryInput
                  label={t('Product SKU')}
                  name="sku"
                  value={form.data.sku}
                  onChange={(event) => form.setData('sku', event.target.value)}
                  required
                />
                <PrimaryInput
                  label={t('Category')}
                  name="category_id"
                  type="select"
                  value={form.data.category_id}
                  onChange={(event) => form.setData('category_id', event.target.value)}
                  options={categoryOptions}
                  error={form.errors.category_id}
                  required
                />
                <PrimaryInput
                  label={t('Brand')}
                  name="brand_id"
                  type="select"
                  value={form.data.brand_id}
                  onChange={(event) => form.setData('brand_id', event.target.value)}
                  options={brandOptions}
                  error={form.errors.brand_id}
                  required
                />
                <PrimaryInput
                  label={t('Status')}
                  name="status"
                  type="select"
                  value={form.data.status}
                  onChange={(event) => form.setData('status', event.target.value)}
                  options={statusOptions}
                  error={form.errors.status}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <RichTextEditor
                  label={t('Product Description (Vietnamese)')}
                  value={form.data.description}
                  onChange={(value) => form.setData('description', value)}
                  error={form.errors.description as string}
                  height="220px"
                />
                <RichTextEditor
                  label={t('Product Description (English)')}
                  value={form.data.description_en}
                  onChange={(value) => form.setData('description_en', value)}
                  height="220px"
                />
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
                <PrimaryInput
                  label={t('Base Price (VND)')}
                  name="price"
                  value={form.data.price}
                  onChange={(event) => form.setData('price', event.target.value)}
                  error={form.errors.price}
                  required
                />
                <PrimaryInput
                  label={t('Total Stock')}
                  name="stock"
                  value={form.data.stock}
                  onChange={(event) => form.setData('stock', event.target.value)}
                  error={form.errors.stock}
                  required
                />
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
                {mediaPreviews.map((media) => (
                  <div
                    key={media.id}
                    style={{
                      position: 'relative',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: '0 6px 18px rgba(15, 23, 42, 0.08)',
                    }}
                  >
                    <img
                      src={media.url}
                      alt="product preview"
                      style={{ width: '100%', height: '160px', objectFit: 'cover' }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveMedia(media.id)}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        background: 'rgba(255,255,255,0.9)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <i className="bx bx-x" style={{ color: 'var(--danger)', fontSize: '18px' }}></i>
                    </button>
                  </div>
                ))}

                <label
                  htmlFor="product-media-uploader"
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
                    cursor: 'pointer',
                  }}
                >
                  <i className="bx bx-cloud-upload" style={{ fontSize: '28px' }}></i>
                  <span>{t('Click or drop files to add sample images')}</span>
                  <input
                    id="product-media-uploader"
                    type="file"
                    accept="image/*"
                    multiple
                    style={{ display: 'none' }}
                    onChange={handleMediaUpload}
                  />
                </label>
                {form.errors.images && (
                  <div className="form-error">{form.errors.images}</div>
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
                <PrimaryInput
                  label={t('Meta Title')}
                  name="seo_title"
                  value={form.data.meta_title}
                  onChange={(event) => {
                    setIsMetaTitleTouched(true);
                    form.setData('meta_title', event.target.value);
                  }}
                  required
                />
                <PrimaryInput
                  label={t('Meta Slug')}
                  name="seo_slug"
                  value={form.data.meta_slug}
                  onChange={(event) => {
                    setIsMetaSlugTouched(true);
                    form.setData('meta_slug', event.target.value);
                  }}
                />
                <PrimaryInput
                  label={t('Meta Description')}
                  name="seo_description"
                  value={form.data.meta_description}
                  onChange={(event) => {
                    setIsMetaDescriptionTouched(true);
                    form.setData('meta_description', event.target.value);
                  }}
                />
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
            onClick={() => {
              if (!form.isDirty || window.confirm(t('You have unsaved changes. Leave the page?'))) {
                router.visit('/seller/products');
              }
            }}
          >
            {t('Back to Products')}
          </ActionButton>
          <ActionButton
            variant="primary"
            type="submit"
            icon="bx bx-save"
            loading={form.processing}
          >
            {t('Create Product')}
          </ActionButton>
        </div>
      </form>
    </>
  );
}

export default function Create() {
  return (
    <AppLayout>
      <CreateContent />
    </AppLayout>
  );
}
