import { Head, usePage } from '@inertiajs/react';

import ProductImageGallery from '@/components/admin/products/ProductImageGallery';
import ProductInfo from '@/components/admin/products/ProductInfo';
import ProductTabs from '@/components/admin/products/ProductTabs';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import Header from '@/components/ui/header';
import { useTranslation } from '@/lib/i18n';

import styles from '@/components/admin/admin.module.css';

interface AttributeValue {
    attribute_value_id: number;
    value: string;
    attribute: {
        attribute_id: number;
        name: string;
    };
}

interface ProductVariant {
    variant_id: number;
    price: number;
    stock_quantity: number;
    attributeValues: AttributeValue[];
}

interface ProductImage {
    image_id: number;
    image_url: string;
    is_primary: boolean;
}

interface Review {
    review_id: number;
    rating: number;
    comment: string;
    created_at: string;
    user: {
        user_id: number;
        username: string;
        first_name: string;
        last_name: string;
    };
}

interface Product {
    product_id: number;
    name: { en: string; vi: string };
    description: { en: string; vi: string };
    status: number;
    category: {
        category_id: number;
        name: { en: string; vi: string };
    };
    brand: {
        brand_id: number;
        name: string;
    };
    images: ProductImage[];
    variants: ProductVariant[];
    reviews: Review[];
}

interface PageProps {
    product: Product;
    [key: string]: unknown;
}

export default function Show() {
    const { t, locale } = useTranslation();
    const { product } = usePage<PageProps>().props;

    const currentLocale = locale as 'en' | 'vi';

    const getProductName = (): string => {
        if (!product.name) return t('Unnamed Product');
        if (typeof product.name === 'string') return product.name;
        return product.name[currentLocale] || product.name.en || t('Unnamed Product');
    };

    return (
        <WorkspaceLayout>
            <Head title={`${getProductName()} - ${t('Product Details')}`} />

            <Header
                title={t('Product Details')}
                breadcrumbs={[
                    { label: t('Dashboard'), href: '/admin/dashboard' },
                    { label: t('Products'), href: '/admin/products' },
                    { label: getProductName(), href: `/admin/products/${product.product_id}`, active: true },
                ]}
            />

            <div className={styles.stack}>
                <div className={styles.gridTwo}>
                    <ProductImageGallery images={product.images} />
                    <ProductInfo product={product} currentLocale={currentLocale} />
                </div>

                <section className={styles.section}>
                    <ProductTabs description={product.description} reviews={product.reviews} />
                </section>
            </div>
        </WorkspaceLayout>
    );
}
