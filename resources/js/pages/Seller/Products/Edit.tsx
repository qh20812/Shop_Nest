import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Header from '@/components/ui/header';
import { Input } from '@/components/ui/input';
import PrimaryInput from '@/components/ui/primary-input';
import RichTextEditor from '@/components/ui/rich-text-editor';
import { useToast } from '@/Contexts/ToastContext';
import AppLayout from '@/layouts/app/AppLayout';
import { useTranslation } from '@/lib/i18n';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { GitBranch, Image as ImageIcon, Package, Plus, Save, Search, Tag, UploadCloud, X } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import styles from '../seller.module.css';

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

const MEDIA_HINT = 'Existing images remain unchanged. Upload new files to append to the gallery.';

const slugify = (value: string) =>
    value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/[\s-]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 80);

const stripHtml = (value: string) =>
    value
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

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
            stock_quantity: variant.stock_quantity !== undefined && variant.stock_quantity !== null ? String(variant.stock_quantity) : '',
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

    useEffect(
        () => () => {
            mediaPreviews.filter((media) => media.isObjectUrl).forEach((media) => URL.revokeObjectURL(media.url));
        },
        [mediaPreviews],
    );

    const categoryOptions = useMemo<CategoryOption[]>(
        () => [
            { value: '', label: t('-- Select Category --') },
            ...categories.map((category) => ({
                value: String(category.category_id),
                label: getLocalizedValue(category.name, 'vi') || t('Unnamed Category'),
            })),
        ],
        [categories, getLocalizedValue, t],
    );

    const brandOptions = useMemo<CategoryOption[]>(
        () => [
            { value: '', label: t('-- Select Brand --') },
            ...brands.map((brand) => ({
                value: String(brand.brand_id),
                label: getLocalizedValue(brand.name, 'vi') || t('Unnamed Brand'),
            })),
        ],
        [brands, getLocalizedValue, t],
    );

    const statusOptions = useMemo(
        () =>
            STATUS_OPTIONS.map((status) => ({
                value: status.value,
                label: t(status.label),
            })),
        [t],
    );

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

    const handleMediaUpload = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
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
            showInfo(t('Images added to the upload queue.'));
        },
        [form, showInfo, t],
    );

    const handleRemoveMedia = useCallback(
        (id: string) => {
            setMediaPreviews((prev) => {
                const target = prev.find((media) => media.id === id);
                if (target?.isObjectUrl) {
                    URL.revokeObjectURL(target.url);
                }
                if (target?.file) {
                    form.setData(
                        'images',
                        form.data.images.filter((imageFile) => imageFile !== target.file),
                    );
                }
                return prev.filter((media) => media.id !== id);
            });
            showWarning(t('Removed selected media preview.'));
        },
        [form, showWarning, t],
    );

    const handleVariantFieldChange = useCallback(
        (index: number, field: keyof SellerProductVariantForm, value: string | boolean) => {
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
        },
        [form],
    );

    const handleVariantOptionChange = useCallback(
        (variantIndex: number, optionIndex: number, field: 'name' | 'value', value: string) => {
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
        },
        [form],
    );

    const handleAddVariantOption = useCallback(
        (variantIndex: number) => {
            const updated = form.data.variants.map((variant, idx) => {
                if (idx !== variantIndex) return variant;
                return {
                    ...variant,
                    option_values: [...variant.option_values, { name: '', value: '' }],
                };
            });

            form.setData('variants', updated);
        },
        [form],
    );

    const handleRemoveVariantOption = useCallback(
        (variantIndex: number, optionIndex: number) => {
            const updated = form.data.variants.map((variant, idx) => {
                if (idx !== variantIndex) return variant;
                return {
                    ...variant,
                    option_values: variant.option_values.filter((_, optIdx) => optIdx !== optionIndex),
                };
            });

            form.setData('variants', updated);
        },
        [form],
    );

    const handleSetPrimaryVariant = useCallback(
        (index: number) => {
            const updated = form.data.variants.map((variant, idx) => ({
                ...variant,
                is_primary: idx === index,
            }));

            form.setData('variants', updated);

            const current = updated[index];
            form.setData('price', current.price);
            form.setData('stock', current.stock_quantity);
            form.setData('sku', current.sku);
        },
        [form],
    );

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

    const handleRemoveVariant = useCallback(
        (index: number) => {
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
        },
        [form, showError, t],
    );

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

    const handleSubmit = useCallback(
        (event: React.FormEvent<HTMLFormElement>) => {
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
        },
        [form, product.product_id, showSuccess, showError, t],
    );

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
            />

            <form onSubmit={handleSubmit} className={styles.stack}>
                <Card variant="flat" padding="md">
                    <div className={styles.panelBody}>
                        <div className={styles.sectionHead}>
                            <h2 className={styles.sectionTitle}>
                                <Package aria-hidden="true" className={styles.sectionIcon} />
                                {t('Product Basics')}
                            </h2>
                        </div>

                        <div className={styles.formGrid}>
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

                        <div className={styles.formGrid4}>
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

                        <div className={styles.formGrid}>
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
                </Card>

                <Card variant="flat" padding="md">
                    <div className={styles.panelBody}>
                        <div className={styles.sectionHead}>
                            <h2 className={styles.sectionTitle}>
                                <Tag aria-hidden="true" className={styles.sectionIcon} />
                                {t('Pricing & Inventory')}
                            </h2>
                        </div>

                        <div className={styles.formGrid}>
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
                </Card>

                <Card variant="flat" padding="md">
                    <div className={styles.panelBody}>
                        <div className={styles.sectionHead}>
                            <h2 className={styles.sectionTitle}>
                                <GitBranch aria-hidden="true" className={styles.sectionIcon} />
                                {t('Product Variants')}
                            </h2>
                        </div>

                        {form.data.variants.map((variant, index) => (
                            <div key={variant.variant_id ?? index} className={styles.variantCard}>
                                <div className={styles.variantHead}>
                                    <h3 className={styles.variantTitle}>
                                        {t('Variant')} #{index + 1}
                                    </h3>
                                    <div className={styles.variantTools}>
                                        <label className={styles.primaryToggle}>
                                            <input
                                                type="radio"
                                                name="primary_variant"
                                                checked={variant.is_primary}
                                                onChange={() => handleSetPrimaryVariant(index)}
                                            />
                                            {t('Primary')}
                                        </label>
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => handleRemoveVariant(index)}
                                            aria-label={t('Remove variant')}
                                        >
                                            <X aria-hidden="true" />
                                        </Button>
                                    </div>
                                </div>

                                <div className={styles.formGrid}>
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
                                </div>

                                <div className={styles.formGrid}>
                                    <PrimaryInput
                                        label={t('Variant Price (VND)')}
                                        name={`variants.${index}.price`}
                                        value={variant.price}
                                        onChange={(event) => handleVariantFieldChange(index, 'price', event.target.value)}
                                        error={form.errors[`variants.${index}.price` as keyof typeof form.errors] as string}
                                    />
                                    <PrimaryInput
                                        label={t('Variant Stock')}
                                        name={`variants.${index}.stock_quantity`}
                                        value={variant.stock_quantity}
                                        onChange={(event) => handleVariantFieldChange(index, 'stock_quantity', event.target.value)}
                                        error={form.errors[`variants.${index}.stock_quantity` as keyof typeof form.errors] as string}
                                    />
                                </div>

                                <div className={styles.stackTight}>
                                    <span className="sn-field__label">{t('Options')}</span>
                                    {variant.option_values.map((option, optionIndex) => (
                                        <div key={optionIndex} className={styles.optionRow}>
                                            <Input
                                                value={option.name}
                                                placeholder={t('Option name (e.g., Color)')}
                                                aria-label={t('Option name')}
                                                onChange={(event) => handleVariantOptionChange(index, optionIndex, 'name', event.target.value)}
                                            />
                                            <Input
                                                value={option.value}
                                                placeholder={t('Option value (e.g., Red)')}
                                                aria-label={t('Option value')}
                                                onChange={(event) => handleVariantOptionChange(index, optionIndex, 'value', event.target.value)}
                                            />
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                size="sm"
                                                aria-label={t('Remove option')}
                                                onClick={() => handleRemoveVariantOption(index, optionIndex)}
                                            >
                                                <X aria-hidden="true" />
                                            </Button>
                                        </div>
                                    ))}
                                    <div>
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            size="sm"
                                            leftIcon={Plus}
                                            onClick={() => handleAddVariantOption(index)}
                                        >
                                            {t('Add Option')}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div>
                            <Button type="button" variant="secondary" leftIcon={Plus} onClick={handleAddVariant}>
                                {t('Add Variant')}
                            </Button>
                        </div>
                    </div>
                </Card>

                <Card variant="flat" padding="md">
                    <div className={styles.panelBody}>
                        <div className={styles.sectionHead}>
                            <h2 className={styles.sectionTitle}>
                                <ImageIcon aria-hidden="true" className={styles.sectionIcon} />
                                {t('Media & Gallery')}
                            </h2>
                        </div>

                        <p className={styles.muted}>{t(MEDIA_HINT)}</p>

                        <div className={styles.mediaGrid}>
                            {(product.images ?? []).map((image) => (
                                <div key={image.image_id} className={styles.mediaItem}>
                                    <img src={image.image_url} alt={image.alt_text ?? t('Product image')} className={styles.mediaImage} />
                                </div>
                            ))}

                            {mediaPreviews.map((media) => (
                                <div key={media.id} className={styles.mediaItem}>
                                    <img src={media.url} alt={t('Product image preview')} className={styles.mediaImage} />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveMedia(media.id)}
                                        className={styles.mediaRemove}
                                        aria-label={t('Remove image')}
                                    >
                                        <X aria-hidden="true" />
                                    </button>
                                </div>
                            ))}

                            <label htmlFor="product-media-uploader" className={styles.dropzone}>
                                <UploadCloud aria-hidden="true" className={styles.dropzoneIcon} />
                                <span>{t('Click or drop files to add images')}</span>
                                <input
                                    id="product-media-uploader"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className={styles.hiddenInput}
                                    onChange={handleMediaUpload}
                                />
                            </label>
                        </div>
                        {form.errors.images && (
                            <span className="sn-field__error" role="alert">
                                {form.errors.images}
                            </span>
                        )}
                    </div>
                </Card>

                <Card variant="flat" padding="md">
                    <div className={styles.panelBody}>
                        <div className={styles.sectionHead}>
                            <h2 className={styles.sectionTitle}>
                                <Search aria-hidden="true" className={styles.sectionIcon} />
                                {t('SEO Preview')}
                            </h2>
                        </div>

                        <div className={styles.formGrid4}>
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

                        <div className={styles.seoPreview}>
                            <span className={styles.seoLabel}>{t('Search preview')}</span>
                            <span className={styles.seoTitle}>{seoPreview.title}</span>
                            <span className={styles.seoUrl}>shopnest.vn/products/{seoPreview.slug}</span>
                            <span className={styles.seoDescription}>{seoPreview.description}</span>
                        </div>
                    </div>
                </Card>

                <div className={styles.formFooter}>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                            if (!form.isDirty || window.confirm(t('You have unsaved changes. Leave the page?'))) {
                                router.visit('/seller/products');
                            }
                        }}
                    >
                        {t('Back to Products')}
                    </Button>
                    <Button type="submit" variant="primary" loading={form.processing} leftIcon={Save}>
                        {t('Save Changes')}
                    </Button>
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
