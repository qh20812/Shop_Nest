import React from 'react';
import { useTranslation } from '../../../lib/i18n';

interface Product {
    product_id: number;
    name: string | { [key: string]: string };
    category: { name: string | { [key: string]: string } };
    images?: Array<{ image_url: string; is_primary: boolean }>;
}

interface ProductInfoCellProps {
    product: Product;
}

export default function ProductInfoCell({ product }: ProductInfoCellProps) {
    const { t } = useTranslation();

    // Safety helper to extract string from potential translation object
    const getStringValue = (value: string | { [key: string]: string }): string => {
        if (typeof value === 'string') return value;
        if (typeof value === 'object' && value !== null) {
            const locale = document.documentElement.lang || 'en';
            return value[locale] || value['en'] || value['vi'] || Object.values(value)[0] || '';
        }
        return '';
    };

    // Helper functions to get localized names
    const getProductName = (): string => {
        return getStringValue(product.name) || 'Unnamed Product';
    };
    
    const getCategoryName = (): string => {
        return product.category?.name ? getStringValue(product.category.name) : t('No Category');
    };    // Get primary image or first image
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
