import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '../../../layouts/app/AppLayout';
import ProductImageGallery from '../../../Components/admin/products/ProductImageGallery';
import ProductInfo from '../../../Components/admin/products/ProductInfo';
import ProductTabs from '../../../Components/admin/products/ProductTabs';
import { useTranslation } from '../../../lib/i18n';

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
    
    // Get current locale for prop passing
    const currentLocale = locale as 'en' | 'vi';

    // Helper function to get localized product name
    const getProductName = (): string => {
        if (!product.name) return t('Unnamed Product');
        if (typeof product.name === 'string') return product.name;
        return product.name[currentLocale] || product.name.en || t('Unnamed Product');
    };

    return (
        <AppLayout>
            <Head title={`${getProductName()} - ${t('Product Details')}`} />
            
            <div className="product-detail">
                {/* Main Product Details Section */}
                <div className="product-detail__main">
                    <div className="product-detail__gallery-container">
                        <ProductImageGallery images={product.images} />
                    </div>
                    <div className="product-detail__info-container">
                        <ProductInfo product={product} currentLocale={currentLocale} />
                    </div>
                </div>

                {/* Description and Reviews Section */}
                <div className="product-detail__tabs-container">
                    <ProductTabs 
                        description={product.description} 
                        reviews={product.reviews} 
                    />
                </div>
            </div>
        </AppLayout>
    );
}