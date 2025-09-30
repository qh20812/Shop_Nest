import React, { useState } from 'react';
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
    attributeValues?: AttributeValue[]; // Make this optional
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
    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
        product.variants?.[0] || null
    );

    // Use passed currentLocale or fallback to hook locale
    const activeLocale = currentLocale || (locale as 'en' | 'vi');

    // Helper functions for localized content
    const getProductName = (): string => {
        if (!product.name) return t('Unnamed Product');
        
        // Handle string case (fallback)
        if (typeof product.name === 'string') return product.name;
        
        // Handle multilingual object case
        if (typeof product.name === 'object' && product.name !== null) {
            return product.name[activeLocale] || product.name.en || product.name.vi || t('Unnamed Product');
        }
        
        return t('Unnamed Product');
    };

    const getCategoryName = (): string => {
        if (!product.category?.name) return t('No Category');
        
        // Handle string case (fallback)
        if (typeof product.category.name === 'string') return product.category.name;
        
        // Handle multilingual object case
        if (typeof product.category.name === 'object' && product.category.name !== null) {
            return product.category.name[activeLocale] || product.category.name.en || product.category.name.vi || t('No Category');
        }
        
        return t('No Category');
    };

    // Get price range or specific price
    const getPrice = () => {
        if (!product.variants || product.variants.length === 0) {
            return t('Price not available');
        }

        if (selectedVariant) {
            return `${selectedVariant.price.toLocaleString()} VND`;
        }

        const prices = product.variants.map(v => v.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        if (minPrice === maxPrice) {
            return `${minPrice.toLocaleString()} VND`;
        }
        return `${minPrice.toLocaleString()} - ${maxPrice.toLocaleString()} VND`;
    };

    // Get available stock
    const getStock = () => {
        if (selectedVariant) {
            return selectedVariant.stock_quantity;
        }
        return product.variants?.reduce((total, variant) => total + variant.stock_quantity, 0) || 0;
    };

    // Group attributes for variant selection - FIX THE BUG HERE
    const getGroupedAttributes = () => {
        if (!product.variants || product.variants.length === 0) return {};

        const grouped: Record<string, AttributeValue[]> = {};
        
        product.variants.forEach(variant => {
            // ADD NULL CHECK HERE
            if (variant.attributeValues && Array.isArray(variant.attributeValues)) {
                variant.attributeValues.forEach(attrValue => {
                    const attrName = attrValue.attribute.name;
                    if (!grouped[attrName]) {
                        grouped[attrName] = [];
                    }
                    const exists = grouped[attrName].some(av => av.attribute_value_id === attrValue.attribute_value_id);
                    if (!exists) {
                        grouped[attrName].push(attrValue);
                    }
                });
            }
        });

        return grouped;
    };

    const groupedAttributes = getGroupedAttributes();

    const handleAddToCart = () => {
        // TODO: Implement add to cart functionality
        alert(t('Add to cart functionality will be implemented soon'));
    };

    return (
        <div className="product-info">
            {/* Product Name */}
            <h1 className="product-info__title">{getProductName()}</h1>

            {/* Brand and Category */}
            <div className="product-info__meta">
                <span className="product-info__brand">
                    <strong>{t('Brand')}: </strong>
                    {product.brand?.name || t('Unknown Brand')}
                </span>
                <span className="product-info__category">
                    <strong>{t('Category')}: </strong>
                    {getCategoryName()}
                </span>
            </div>

            {/* Price */}
            <div className="product-info__price">
                {getPrice()}
            </div>

            {/* Stock Information */}
            <div className="product-info__stock">
                <span className={`product-info__stock-status ${getStock() > 0 ? 'product-info__stock-status--in-stock' : 'product-info__stock-status--out-of-stock'}`}>
                    {getStock() > 0 ? `${t('In Stock')}: ${getStock()} ${t('units')}` : t('Out of Stock')}
                </span>
            </div>

            {/* Product Variants */}
            {Object.keys(groupedAttributes).length > 0 && (
                <div className="product-info__variants">
                    <h3 className="product-info__variants-title">{t('Select Options')}</h3>
                    {Object.entries(groupedAttributes).map(([attributeName, attributeValues]) => (
                        <div key={attributeName} className="product-info__variant-group">
                            <label className="product-info__variant-label">
                                {attributeName}:
                            </label>
                            <select 
                                className="product-info__variant-select"
                                onChange={(e) => {
                                    const selectedValueId = parseInt(e.target.value);
                                    const variant = product.variants.find(v => 
                                        v.attributeValues && v.attributeValues.some(av => av.attribute_value_id === selectedValueId)
                                    );
                                    if (variant) {
                                        setSelectedVariant(variant);
                                    }
                                }}
                            >
                                <option value="">{t('Select')} {attributeName}</option>
                                {attributeValues.map((attrValue) => (
                                    <option 
                                        key={attrValue.attribute_value_id} 
                                        value={attrValue.attribute_value_id}
                                    >
                                        {attrValue.value}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ))}
                </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="product-info__actions">
                <div className="product-info__quantity">
                    <label className="product-info__quantity-label">
                        {t('Quantity')}:
                    </label>
                    <div className="product-info__quantity-controls">
                        <button 
                            type="button"
                            className="product-info__quantity-btn"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            disabled={quantity <= 1}
                        >
                            -
                        </button>
                        <input 
                            type="number"
                            className="product-info__quantity-input"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                            min="1"
                            max={getStock()}
                        />
                        <button 
                            type="button"
                            className="product-info__quantity-btn"
                            onClick={() => setQuantity(Math.min(getStock(), quantity + 1))}
                            disabled={quantity >= getStock()}
                        >
                            +
                        </button>
                    </div>
                </div>

                <button 
                    type="button"
                    className="product-info__add-to-cart"
                    onClick={handleAddToCart}
                    disabled={getStock() === 0}
                >
                    <i className="bx bx-cart-add"></i>
                    {t('Add to Cart')}
                </button>
            </div>
        </div>
    );
}