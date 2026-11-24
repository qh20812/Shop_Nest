import { useState } from 'react';

import { formatVnd } from '../../../lib/format';
import { useTranslation } from '../../../lib/i18n';
import { Select } from '../../ui/select';

import styles from './products.module.css';

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
    attributeValues?: AttributeValue[];
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
    variants: ProductVariant[];
}

interface ProductInfoProps {
    product: Product;
    currentLocale?: 'en' | 'vi';
}

export default function ProductInfo({ product, currentLocale }: ProductInfoProps) {
    const { t, locale } = useTranslation();
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(product.variants?.[0] || null);

    const activeLocale = currentLocale || (locale as 'en' | 'vi');

    const getProductName = (): string => {
        if (!product.name) return t('Unnamed Product');

        if (typeof product.name === 'string') return product.name;

        if (typeof product.name === 'object' && product.name !== null) {
            return product.name[activeLocale] || product.name.en || product.name.vi || t('Unnamed Product');
        }

        return t('Unnamed Product');
    };

    const getCategoryName = (): string => {
        if (!product.category?.name) return t('No Category');

        if (typeof product.category.name === 'string') return product.category.name;

        if (typeof product.category.name === 'object' && product.category.name !== null) {
            return product.category.name[activeLocale] || product.category.name.en || product.category.name.vi || t('No Category');
        }

        return t('No Category');
    };

    const getPrice = () => {
        if (!product.variants || product.variants.length === 0) {
            return t('Price not available');
        }

        if (selectedVariant) {
            return formatVnd(selectedVariant.price);
        }

        const prices = product.variants.map((variant) => variant.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        if (minPrice === maxPrice) {
            return formatVnd(minPrice);
        }

        return `${formatVnd(minPrice)} - ${formatVnd(maxPrice)}`;
    };

    const getStock = () => {
        if (selectedVariant) {
            return selectedVariant.stock_quantity;
        }

        return product.variants?.reduce((total, variant) => total + variant.stock_quantity, 0) || 0;
    };

    const getGroupedAttributes = () => {
        if (!product.variants || product.variants.length === 0) return {};

        const grouped: Record<string, AttributeValue[]> = {};

        product.variants.forEach((variant) => {
            if (variant.attributeValues && Array.isArray(variant.attributeValues)) {
                variant.attributeValues.forEach((attrValue) => {
                    const attrName = attrValue.attribute.name;
                    if (!grouped[attrName]) {
                        grouped[attrName] = [];
                    }
                    const exists = grouped[attrName].some((entry) => entry.attribute_value_id === attrValue.attribute_value_id);
                    if (!exists) {
                        grouped[attrName].push(attrValue);
                    }
                });
            }
        });

        return grouped;
    };

    const groupedAttributes = getGroupedAttributes();
    const stock = getStock();

    return (
        <div className={styles.info}>
            <h1 className={styles.title}>{getProductName()}</h1>

            <div className={styles.meta}>
                <span className={styles.metaItem}>
                    <strong>{t('Brand')}: </strong>
                    {product.brand?.name || t('Unknown Brand')}
                </span>
                <span className={styles.metaItem}>
                    <strong>{t('Category')}: </strong>
                    {getCategoryName()}
                </span>
            </div>

            <div className={styles.price}>{getPrice()}</div>

            <div>
                <span className={`${styles.stock} ${stock > 0 ? styles.stockIn : styles.stockOut}`.trim()}>
                    {stock > 0 ? `${t('In Stock')}: ${stock} ${t('units')}` : t('Out of Stock')}
                </span>
            </div>

            {Object.keys(groupedAttributes).length > 0 && (
                <div className={styles.variants}>
                    <h3 className={styles.variantsTitle}>{t('Select Options')}</h3>
                    {Object.entries(groupedAttributes).map(([attributeName, attributeValues]) => (
                        <div key={attributeName} className={styles.variantGroup}>
                            <span className={styles.variantsTitle}>{attributeName}</span>
                            <Select
                                defaultValue=""
                                aria-label={attributeName}
                                onChange={(event) => {
                                    const selectedValueId = Number.parseInt(event.target.value, 10);
                                    const variant = product.variants.find(
                                        (entry) =>
                                            entry.attributeValues &&
                                            entry.attributeValues.some((attrValue) => attrValue.attribute_value_id === selectedValueId),
                                    );
                                    if (variant) {
                                        setSelectedVariant(variant);
                                    }
                                }}
                            >
                                <option value="">
                                    {t('Select')} {attributeName}
                                </option>
                                {attributeValues.map((attrValue) => (
                                    <option key={attrValue.attribute_value_id} value={attrValue.attribute_value_id}>
                                        {attrValue.value}
                                    </option>
                                ))}
                            </Select>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
