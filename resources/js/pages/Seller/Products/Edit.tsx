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

interface VariantOptionValue {
  name: string;
  value: string;
}

interface ProductVariant {
  variant_id?: number;
  variant_name?: string;
  sku?: string;
  price?: number | string;
  stock_quantity?: number | string;
  option_values?: VariantOptionValue[] | null;
  is_primary?: boolean;
}

interface ProductImage {
  image_id: number;
  image_url: string;
  alt_text?: string | null;
}

interface Product {
  product_id: number;
  name: string | Record<string, string>;
  name_en?: string | null;
  description: string | Record<string, string>;
  description_en?: string | null;
  category_id?: number | null;
  brand_id?: number | null;
  status?: string | { value: string } | null;
  meta_title?: string | null;
  meta_slug?: string | null;
  meta_description?: string | null;
  variants?: ProductVariant[];
  images?: ProductImage[];
}

interface SellerProductEditPageProps extends Record<string, unknown> {
  product: Product;
  categories: Category[];
  brands: Brand[];
}

interface SellerProductVariantForm {
  variant_id?: number;
  variant_name: string;
  sku: string;
  price: string;
  stock_quantity: string;
  option_values: VariantOptionValue[];
  is_primary: boolean;
}

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
  variants: SellerProductVariantForm[];
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

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

const normalizeStatus = (status: Product['status']): string => {
  if (!status) return STATUS_OPTIONS[0]?.value ?? 'draft';
  if (typeof status === 'string') return status;
  if (typeof status === 'object' && 'value' in status && typeof status.value === 'string') {
    return status.value;
  }
  return STATUS_OPTIONS[0]?.value ?? 'draft';
};

function EditContent() {
  const { t } = useTranslation();
  const { success: showSuccess, error: showError, info: showInfo, warning: showWarning } = useToast();

  const { product, categories = [], brands = [] } = usePage<SellerProductEditPageProps>().props;

  const getLocalizedValue = useCallback((value: string | Record<string, string> | undefined, locale: 'vi' | 'en') => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return value[locale] || value[locale === 'vi' ? 'en' : 'vi'] || Object.values(value)[0] || '';
  }, []);

  const initialVariants: SellerProductVariantForm[] = useMemo(() => {
    const variants = product.variants ?? [];

    if (variants.length === 0) {
      return [
        {
          variant_name: '',
          sku: '',
          price: '',
          stock_quantity: '',
          option_values: [],
          is_primary: true,
        },
      ];
    }

    const existingPrimaryIndex = variants.findIndex((variant) => Boolean(variant.is_primary));
    const primaryIndex = existingPrimaryIndex >= 0 ? existingPrimaryIndex : 0;

    return variants.map((variant, index) => ({
      variant_id: variant.variant_id,
      variant_name: variant.variant_name ?? '',
      sku: variant.sku ?? '',
      price: variant.price !== undefined && variant.price !== null ? String(variant.price) : '',
      stock_quantity: variant.stock_quantity !== undefined && variant.stock_quantity !== null
        ? String(variant.stock_quantity)
        : '',
      option_values: (variant.option_values ?? []).map((option) => ({
        name: option?.name ?? '',
        value: option?.value ?? '',
      })),
      is_primary: index === primaryIndex,
    }));
  }, [product.variants]);

  const primaryVariant = useMemo(() => {
    const explicitPrimary = initialVariants.find((variant) => variant.is_primary);
    return explicitPrimary ?? initialVariants[0];
  }, [initialVariants]);

  const form = useForm<SellerProductFormData>({
    name: getLocalizedValue(product.name, 'vi'),
    name_en: getLocalizedValue((product.name_en as string | Record<string, string>) ?? product.name, 'en'),
    description: getLocalizedValue(product.description, 'vi'),
    description_en: getLocalizedValue((product.description_en as string | Record<string, string>) ?? product.description, 'en'),
    price: primaryVariant?.price ?? '',
    stock: primaryVariant?.stock_quantity ?? '',
    category_id: product.category_id ? String(product.category_id) : '',
    brand_id: product.brand_id ? String(product.brand_id) : '',
    status: normalizeStatus(product.status),
    sku: primaryVariant?.sku ?? '',
    images: [],
    meta_title: product.meta_title ?? '',
    meta_slug: product.meta_slug ?? '',
    meta_description: product.meta_description ?? '',
    variants: initialVariants,
  });

  const [isMetaTitleTouched, setIsMetaTitleTouched] = useState(Boolean(product.meta_title));
  const [isMetaSlugTouched, setIsMetaSlugTouched] = useState(Boolean(product.meta_slug));
  const [isMetaDescriptionTouched, setIsMetaDescriptionTouched] = useState(Boolean(product.meta_description));
  const [mediaPreviews, setMediaPreviews] = useState<MediaPreview[]>([]);

  useEffect(() => () => {
    mediaPreviews
      .filter((media) => media.isObjectUrl)
      .forEach((media) => URL.revokeObjectURL(media.url));
  }, [mediaPreviews]);

  const categoryOptions = useMemo<CategoryOption[]>(() => ([
    { value: '', label: t('-- Select Category --') },
    ...categories.map((category) => ({
      value: String(category.category_id),
      label: getLocalizedValue(category.name, 'vi') || t('Unnamed Category'),
    })),
  ]), [categories, getLocalizedValue, t]);

  const brandOptions = useMemo<CategoryOption[]>(() => ([
    { value: '', label: t('-- Select Brand --') },
    ...brands.map((brand) => ({
      value: String(brand.brand_id),
      label: getLocalizedValue(brand.name, 'vi') || t('Unnamed Brand'),
    })),
  ]), [brands, getLocalizedValue, t]);

  const statusOptions = useMemo(() => STATUS_OPTIONS.map((status) => ({
    value: status.value,
    label: t(status.label),
  })), [t]);

  const seoPreview = useMemo(() => {
    const fallbackTitle = form.data.name.trim();
    const fallbackSlug = slugify(form.data.name || '');
    const fallbackDescription = stripHtml(form.data.description || '').slice(0, 160);

    return {
      title: form.data.meta_title || fallbackTitle,
      slug: form.data.meta_slug || fallbackSlug,
      description: form.data.meta_description || fallbackDescription,
    };
  }, [form.data.meta_description, form.data.meta_slug, form.data.meta_title, form.data.name, form.data.description]);

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
    showWarning(t('Removed selected media preview.'));
  }, [form, showWarning, t]);

  const handleVariantFieldChange = useCallback((index: number, field: keyof SellerProductVariantForm, value: string | boolean) => {
    const updated = form.data.variants.map((variant, idx) => {
      if (idx !== index) return variant;
      return {
        ...variant,
        [field]: value,
      };
    });

    form.setData('variants', updated);

    if (field === 'price' && updated[index].is_primary) {
      form.setData('price', String(value));
    }

    if (field === 'stock_quantity' && updated[index].is_primary) {
      form.setData('stock', String(value));
    }

    if (field === 'sku' && updated[index].is_primary) {
      form.setData('sku', String(value));
    }
  }, [form]);

  const handleVariantOptionChange = useCallback((variantIndex: number, optionIndex: number, field: 'name' | 'value', value: string) => {
    const updated = form.data.variants.map((variant, idx) => {
      if (idx !== variantIndex) return variant;
      const optionValues = variant.option_values.map((option, optIdx) => {
        if (optIdx !== optionIndex) return option;
        return {
          ...option,
          [field]: value,
        };
      });
      return {
        ...variant,
        option_values: optionValues,
      };
    });

    form.setData('variants', updated);
  }, [form]);

  const handleAddVariantOption = useCallback((variantIndex: number) => {
    const updated = form.data.variants.map((variant, idx) => {
      if (idx !== variantIndex) return variant;
      return {
        ...variant,
        option_values: [...variant.option_values, { name: '', value: '' }],
      };
    });

    form.setData('variants', updated);
  }, [form]);

  const handleRemoveVariantOption = useCallback((variantIndex: number, optionIndex: number) => {
    const updated = form.data.variants.map((variant, idx) => {
      if (idx !== variantIndex) return variant;
      return {
        ...variant,
        option_values: variant.option_values.filter((_, optIdx) => optIdx !== optionIndex),
      };
    });

    form.setData('variants', updated);
  }, [form]);

  const handleSetPrimaryVariant = useCallback((index: number) => {
    const updated = form.data.variants.map((variant, idx) => ({
      ...variant,
      is_primary: idx === index,
    }));

    form.setData('variants', updated);

    const current = updated[index];
    form.setData('price', current.price);
    form.setData('stock', current.stock_quantity);
    form.setData('sku', current.sku);
  }, [form]);

  const handleAddVariant = useCallback(() => {
    form.setData('variants', [
      ...form.data.variants,
      {
        variant_name: '',
        sku: '',
        price: '',
        stock_quantity: '',
        option_values: [],
        is_primary: false,
      },
    ]);
  }, [form]);

  const handleRemoveVariant = useCallback((index: number) => {
    if (form.data.variants.length === 1) {
      showError(t('At least one variant must remain.'));
      return;
    }

    const updated = form.data.variants.filter((_, idx) => idx !== index);

    if (!updated.some((variant) => variant.is_primary)) {
      updated[0] = { ...updated[0], is_primary: true };
      form.setData('price', updated[0].price);
      form.setData('stock', updated[0].stock_quantity);
      form.setData('sku', updated[0].sku);
    }

    form.setData('variants', updated);
  }, [form, showError, t]);

  useEffect(() => {
    if (!form.data.name) {
      return;
    }

    if (!isMetaTitleTouched && form.data.meta_title !== form.data.name) {
      form.setData('meta_title', form.data.name);
    }

    if (!isMetaSlugTouched) {
      const slugValue = slugify(form.data.name);
      if (form.data.meta_slug !== slugValue) {
        form.setData('meta_slug', slugValue);
      }
    }
  }, [form, form.data.name, form.data.meta_slug, form.data.meta_title, isMetaSlugTouched, isMetaTitleTouched]);

  useEffect(() => {
    if (!form.data.description || isMetaDescriptionTouched) {
      return;
    }

    const cleanDescription = stripHtml(form.data.description).slice(0, 160);
    if (form.data.meta_description !== cleanDescription) {
      form.setData('meta_description', cleanDescription);
    }
  }, [form, form.data.description, form.data.meta_description, isMetaDescriptionTouched]);

  const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.data.name.trim() || !form.data.description.trim()) {
      showError(t('Please provide the product name and description.'));
      return;
    }

    form.transform((data) => {
      const primaryIndex = data.variants.findIndex((variant) => variant.is_primary);
      const resolvedPrimaryIndex = primaryIndex >= 0 ? primaryIndex : 0;

      const normalizedVariants = data.variants.map((variant, index) => {
        const isPrimary = index === resolvedPrimaryIndex;
        const priceValue = parseFloat(isPrimary ? data.price : variant.price) || 0;
        const stockValue = parseInt(isPrimary ? data.stock : variant.stock_quantity, 10) || 0;
        const skuValue = (isPrimary ? data.sku : variant.sku).trim();

        return {
          variant_id: variant.variant_id,
          variant_name: variant.variant_name.trim() || '',
          sku: skuValue,
          price: priceValue,
          stock_quantity: stockValue,
          option_values: variant.option_values
            .filter((option) => option.name.trim() || option.value.trim())
            .map((option) => ({
              name: option.name.trim(),
              value: option.value.trim(),
            })),
          is_primary: isPrimary,
        };
      });

      return {
        ...data,
        name: data.name.trim(),
        name_en: data.name_en.trim(),
        description: data.description,
        description_en: data.description_en.trim(),
        category_id: data.category_id,
        brand_id: data.brand_id,
        status: data.status,
        sku: data.sku.trim(),
        variants: normalizedVariants,
        meta_title: (data.meta_title || data.name).trim(),
        meta_slug: slugify(data.meta_slug || data.name),
        meta_description: (data.meta_description || stripHtml(data.description).slice(0, 160)).trim(),
      };
    });

    form.put(`/seller/products/${product.product_id}`, {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        showSuccess(t('Product updated successfully!'));
      },
      onError: () => {
        showError(t('Please review the highlighted fields.'));
      },
      onFinish: () => {
        form.transform((original) => original);
      },
    });
  }, [form, product.product_id, showSuccess, showError, t]);

  return (
    <>
      <Head title={t('Edit Product')} />

      <Header
        title={t('Update Product')}
        breadcrumbs={[
          { label: t('Seller Dashboard'), href: '/seller/dashboard' },
          { label: t('Products'), href: '/seller/products' },
          { label: t('Edit'), href: `/seller/products/${product.product_id}/edit`, active: true },
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
                  error={form.errors.name_en}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '20px' }}>
                <PrimaryInput
                  label={t('Product SKU')}
                  name="sku"
                  value={form.data.sku}
                  onChange={(event) => {
                    form.setData('sku', event.target.value);
                    const primaryIndex = form.data.variants.findIndex((variant) => variant.is_primary);
                    if (primaryIndex >= 0) {
                      handleVariantFieldChange(primaryIndex, 'sku', event.target.value);
                    }
                  }}
                  error={form.errors.sku}
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
                  error={form.errors.description_en as string}
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
                  onChange={(event) => {
                    form.setData('price', event.target.value);
                    const primaryIndex = form.data.variants.findIndex((variant) => variant.is_primary);
                    if (primaryIndex >= 0) {
                      handleVariantFieldChange(primaryIndex, 'price', event.target.value);
                    }
                  }}
                  error={form.errors.price}
                  required
                />
                <PrimaryInput
                  label={t('Total Stock')}
                  name="stock"
                  value={form.data.stock}
                  onChange={(event) => {
                    form.setData('stock', event.target.value);
                    const primaryIndex = form.data.variants.findIndex((variant) => variant.is_primary);
                    if (primaryIndex >= 0) {
                      handleVariantFieldChange(primaryIndex, 'stock_quantity', event.target.value);
                    }
                  }}
                  error={form.errors.stock}
                  required
                />
              </div>
            </div>
          </div>

          {/* Variants */}
          <div className="orders">
            <div className="header">
              <i className="bx bx-git-branch"></i>
              <h3>{t('Product Variants')}</h3>
            </div>

            <div style={{ padding: '20px', display: 'grid', gap: '20px' }}>
              {form.data.variants.map((variant, index) => (
                <div
                  key={variant.variant_id ?? index}
                  style={{
                    border: '1px solid var(--grey)',
                    borderRadius: '12px',
                    padding: '16px',
                    display: 'grid',
                    gap: '16px',
                    position: 'relative',
                    background: '#fff',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0 }}>{t('Variant')} #{index + 1}</h4>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}>
                        <input
                          type="radio"
                          name="primary_variant"
                          checked={variant.is_primary}
                          onChange={() => handleSetPrimaryVariant(index)}
                        />
                        {t('Primary')}
                      </label>
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(index)}
                        className="btn btn-secondary btn-small"
                      >
                        <i className="bx bx-trash"></i>
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '16px' }}>
                    <PrimaryInput
                      label={t('Variant Name')}
                      name={`variants.${index}.variant_name`}
                      value={variant.variant_name}
                      onChange={(event) => handleVariantFieldChange(index, 'variant_name', event.target.value)}
                      error={form.errors[`variants.${index}.variant_name` as keyof typeof form.errors] as string}
                    />
                    <PrimaryInput
                      label={t('Variant SKU')}
                      name={`variants.${index}.sku`}
                      value={variant.sku}
                      onChange={(event) => handleVariantFieldChange(index, 'sku', event.target.value)}
                      error={form.errors[`variants.${index}.sku` as keyof typeof form.errors] as string}
                    />
                    <PrimaryInput
                      label={t('Variant Price (VND)')}
                      name={`variants.${index}.price`}
                      value={variant.price}
                      onChange={(event) => handleVariantFieldChange(index, 'price', event.target.value)}
                      error={form.errors[`variants.${index}.price` as keyof typeof form.errors] as string}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '16px' }}>
                    <PrimaryInput
                      label={t('Variant Stock')}
                      name={`variants.${index}.stock_quantity`}
                      value={variant.stock_quantity}
                      onChange={(event) => handleVariantFieldChange(index, 'stock_quantity', event.target.value)}
                      error={form.errors[`variants.${index}.stock_quantity` as keyof typeof form.errors] as string}
                    />
                    <div>
                      <label className="form-label">{t('Options')}</label>
                      <div style={{ display: 'grid', gap: '12px' }}>
                        {variant.option_values.map((option, optionIndex) => (
                          <div key={optionIndex} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '12px', alignItems: 'center' }}>
                            <input
                              type="text"
                              className="form-input-field"
                              placeholder={t('Option name (e.g., Color)')}
                              value={option.name}
                              onChange={(event) => handleVariantOptionChange(index, optionIndex, 'name', event.target.value)}
                            />
                            <input
                              type="text"
                              className="form-input-field"
                              placeholder={t('Option value (e.g., Red)')}
                              value={option.value}
                              onChange={(event) => handleVariantOptionChange(index, optionIndex, 'value', event.target.value)}
                            />
                            <button
                              type="button"
                              className="btn btn-secondary btn-small"
                              onClick={() => handleRemoveVariantOption(index, optionIndex)}
                            >
                              <i className="bx bx-x"></i>
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="btn btn-secondary btn-small"
                          onClick={() => handleAddVariantOption(index)}
                        >
                          <i className="bx bx-plus"></i> {t('Add Option')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAddVariant}
              >
                <i className="bx bx-plus"></i> {t('Add Variant')}
              </button>
            </div>
          </div>

          {/* Media Library */}
          <div className="orders">
            <div className="header">
              <i className="bx bx-image"></i>
              <h3>{t('Media & Gallery')}</h3>
            </div>

            <div style={{ padding: '20px', display: 'grid', gap: '20px' }}>
              <div style={{ fontSize: '13px', color: 'var(--dark-grey)' }}>
                {t('Existing images remain unchanged. Upload new files to append to the gallery.')}
              </div>

              <div
                style={{
                  display: 'grid',
                  gap: '16px',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                }}
              >
                {(product.images ?? []).map((image) => (
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
                      alt={image.alt_text ?? 'product image'}
                      style={{ width: '100%', height: '160px', objectFit: 'cover' }}
                    />
                  </div>
                ))}

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
                  error={form.errors.meta_title}
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
                  error={form.errors.meta_slug}
                />
                <PrimaryInput
                  label={t('Meta Description')}
                  name="seo_description"
                  value={form.data.meta_description}
                  onChange={(event) => {
                    setIsMetaDescriptionTouched(true);
                    form.setData('meta_description', event.target.value);
                  }}
                  error={form.errors.meta_description}
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
            {t('Save Changes')}
          </ActionButton>
        </div>
      </form>
    </>
  );
}

export default function Edit() {
  return (
    <AppLayout>
      <EditContent />
    </AppLayout>
  );
}
