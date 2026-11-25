import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import { Badge, type BadgeTone } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Header from '@/components/ui/header';
import { formatVnd } from '@/lib/format';
import { useTranslation } from '@/lib/i18n';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ChartColumn, CreditCard, Image as ImageIcon, Package, Pencil } from 'lucide-react';
import { useCallback, useMemo } from 'react';

import styles from '../seller.module.css';

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

const stripHtml = (value: string) =>
    value
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

const STATUS_LABELS = {
    draft: 'Draft',
    pending_approval: 'Pending Review',
    published: 'Published',
    hidden: 'Hidden',
};

const STATUS_TONES: Record<string, BadgeTone> = {
    draft: 'warning',
    pending_approval: 'warning',
    published: 'success',
    hidden: 'accent',
};

function ShowContent() {
    const { t } = useTranslation();

    const { product } = usePage<SellerProductShowPageProps>().props;

    const getLocalizedValue = useCallback((value: string | Record<string, string> | undefined) => {
        if (!value) return '';
        if (typeof value === 'string') return value;
        const locale = document.documentElement.lang || 'en';
        return value[locale] || value['en'] || value['vi'] || Object.values(value)[0] || '';
    }, []);

    const primaryVariant = product.variants.find((v) => v.is_primary) || product.variants[0];

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
            />

            <div className={styles.stack}>
                <Card variant="flat" padding="md">
                    <div className={styles.panelBody}>
                        <div className={styles.sectionHead}>
                            <h2 className={styles.sectionTitle}>
                                <Package aria-hidden="true" className={styles.sectionIcon} />
                                {t('Product Basics')}
                            </h2>
                            <Badge tone={STATUS_TONES[product.status] ?? 'warning'}>
                                {t(STATUS_LABELS[product.status as keyof typeof STATUS_LABELS] || product.status)}
                            </Badge>
                        </div>

                        <div className={styles.formGrid}>
                            <div>
                                <span className={styles.readonlyLabel}>{t('Product Name (Vietnamese)')}</span>
                                <div className={styles.readonlyBox}>{getLocalizedValue(product.name)}</div>
                            </div>
                            <div>
                                <span className={styles.readonlyLabel}>{t('Product Name (English)')}</span>
                                <div className={styles.readonlyBox}>{getLocalizedValue(product.name_en)}</div>
                            </div>
                        </div>

                        <div className={styles.formGrid4}>
                            <div>
                                <span className={styles.readonlyLabel}>{t('Product SKU')}</span>
                                <div className={styles.readonlyBox}>{product.sku}</div>
                            </div>
                            <div>
                                <span className={styles.readonlyLabel}>{t('Category')}</span>
                                <div className={styles.readonlyBox}>{product.category ? getLocalizedValue(product.category.name) : t('N/A')}</div>
                            </div>
                            <div>
                                <span className={styles.readonlyLabel}>{t('Brand')}</span>
                                <div className={styles.readonlyBox}>{product.brand ? getLocalizedValue(product.brand.name) : t('N/A')}</div>
                            </div>
                            <div>
                                <span className={styles.readonlyLabel}>{t('Status')}</span>
                                <div className={styles.readonlyBox}>
                                    {t(STATUS_LABELS[product.status as keyof typeof STATUS_LABELS] || product.status)}
                                </div>
                            </div>
                        </div>

                        <div className={styles.formGrid}>
                            <div>
                                <span className={styles.readonlyLabel}>{t('Product Description (Vietnamese)')}</span>
                                <div
                                    className={`${styles.readonlyBox} ${styles.readonlyProse}`}
                                    dangerouslySetInnerHTML={{ __html: getLocalizedValue(product.description) }}
                                />
                            </div>
                            <div>
                                <span className={styles.readonlyLabel}>{t('Product Description (English)')}</span>
                                <div
                                    className={`${styles.readonlyBox} ${styles.readonlyProse}`}
                                    dangerouslySetInnerHTML={{ __html: getLocalizedValue(product.description_en) }}
                                />
                            </div>
                        </div>
                    </div>
                </Card>

                <Card variant="flat" padding="md">
                    <div className={styles.panelBody}>
                        <div className={styles.sectionHead}>
                            <h2 className={styles.sectionTitle}>
                                <CreditCard aria-hidden="true" className={styles.sectionIcon} />
                                {t('Pricing & Inventory')}
                            </h2>
                        </div>

                        <div className={styles.formGrid}>
                            <div>
                                <span className={styles.readonlyLabel}>{t('Base Price (VND)')}</span>
                                <div className={styles.readonlyBox}>
                                    <span className={styles.price}>{primaryVariant ? formatVnd(primaryVariant.price) : 'N/A'}</span>
                                </div>
                            </div>
                            <div>
                                <span className={styles.readonlyLabel}>{t('Total Stock')}</span>
                                <div className={`${styles.readonlyBox} ${styles.numeric}`}>
                                    {primaryVariant ? primaryVariant.stock_quantity : 'N/A'}
                                </div>
                            </div>
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

                        <div className={styles.mediaGrid}>
                            {product.images.map((image) => (
                                <div key={image.image_id} className={styles.mediaItem}>
                                    <img src={image.image_url} alt={image.alt_text || t('Product image')} className={styles.mediaImage} />
                                </div>
                            ))}
                            {product.images.length === 0 && (
                                <div className={styles.mediaEmpty}>
                                    <ImageIcon aria-hidden="true" className={styles.mediaEmptyIcon} />
                                    <span>{t('No images available')}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </Card>

                <Card variant="flat" padding="md">
                    <div className={styles.panelBody}>
                        <div className={styles.sectionHead}>
                            <h2 className={styles.sectionTitle}>
                                <ChartColumn aria-hidden="true" className={styles.sectionIcon} />
                                {t('SEO Preview')}
                            </h2>
                        </div>

                        <div className={styles.formGrid4}>
                            <div>
                                <span className={styles.readonlyLabel}>{t('Meta Title')}</span>
                                <div className={styles.readonlyBox}>{product.meta_title}</div>
                            </div>
                            <div>
                                <span className={styles.readonlyLabel}>{t('Meta Slug')}</span>
                                <div className={styles.readonlyBox}>{product.meta_slug}</div>
                            </div>
                            <div>
                                <span className={styles.readonlyLabel}>{t('Meta Description')}</span>
                                <div className={styles.readonlyBox}>{product.meta_description}</div>
                            </div>
                        </div>

                        <div className={styles.seoPreview}>
                            <span className={styles.seoLabel}>{t('Search preview')}</span>
                            <span className={styles.seoTitle}>{seoPreview.title}</span>
                            <span className={styles.seoUrl}>shopnest.vn/products/{seoPreview.slug}</span>
                            <span className={styles.seoDescription}>{seoPreview.description}</span>
                        </div>
                    </div>
                </Card>

                <div className={styles.actions}>
                    <Button asChild variant="secondary">
                        <Link href="/seller/products">{t('Back to Products')}</Link>
                    </Button>
                    <Button type="button" variant="primary" leftIcon={Pencil} onClick={handleEdit}>
                        {t('Edit Product')}
                    </Button>
                </div>
            </div>
        </>
    );
}

export default function Show() {
    return (
        <WorkspaceLayout>
            <ShowContent />
        </WorkspaceLayout>
    );
}
