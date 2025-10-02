import React from 'react';
import { usePage } from '@inertiajs/react';
import { useTranslation } from '../../../lib/i18n';

interface Product {
    product_id: number;
    name: { en: string; vi: string };
    category: { name: { en: string; vi: string } };
    images?: Array<{ image_url: string; is_primary: boolean }>;
}

interface ProductInfoCellProps {
    product: Product;
}

interface PageProps {
    locale?: string;
    [key: string]: unknown;
}

export default function ProductInfoCell({ product }: ProductInfoCellProps) {
    const { t, locale } = useTranslation();
    const { locale: pageLocale } = usePage<PageProps>().props;
    
    // Use locale from translation hook, fallback to page props, then to 'en'
    const currentLocale = locale || pageLocale || 'en';
    
    // Helper functions to get localized names
    const getProductName = (): string => {
        if (!product.name) return 'Unnamed Product';
        if (typeof product.name === 'string') return product.name;
        return product.name[currentLocale as keyof typeof product.name] || product.name.en || 'Unnamed Product';
    };
    
    const getCategoryName = (): string => {
        if (!product.category?.name) return t('No Category');
        if (typeof product.category.name === 'string') return product.category.name;
        return product.category.name[currentLocale as keyof typeof product.category.name] || product.category.name.en || t('No Category');
    };
    
    // Get primary image or first image
    const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0];

    return (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {primaryImage ? (
                <img
                    src={`/storage/${primaryImage.image_url}`}
                    alt={getProductName()}
                    style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        border: "1px solid var(--grey)"
                    }}
                />
            ) : (
                <div style={{
                    width: "50px",
                    height: "50px",
                    backgroundColor: "var(--grey)",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    color: "var(--dark-grey)"
                }}>
                    {t("No Image")}
                </div>
            )}
            <div>
                <div style={{ fontWeight: "500", color: "var(--dark)", marginBottom: "4px" }}>
                    {getProductName()}
                </div>
                <div style={{ fontSize: "12px", color: "var(--dark-grey)" }}>
                    {getCategoryName()}
                </div>
            </div>
        </div>
    );
}
