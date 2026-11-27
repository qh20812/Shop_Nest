import { ImageOff } from 'lucide-react';

import { useTranslation } from '../../../lib/i18n';

import styles from './product-info-cell.module.css';

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
    };

    const primaryImage = product.images?.find((img) => img.is_primary) || product.images?.[0];

    const resolveSrc = (url?: string) => {
        if (!url) return null;
        // If image is already a full URL or absolute path, keep it
        if (/^https?:\/\//i.test(url) || url.startsWith('/')) {
            return url;
        }
        // Otherwise assume it's a storage path
        return `/storage/${url}`;
    };

    return (
        <div className={styles.cell}>
            {primaryImage ? (
                <img src={resolveSrc(primaryImage.image_url) || '/image/ShopnestLogo.png'} alt={getProductName()} className={styles.thumb} />
            ) : (
                <span className={styles.placeholder} aria-hidden="true">
                    <ImageOff className={styles.placeholderIcon} />
                </span>
            )}
            <div className={styles.body}>
                <span className={styles.name}>{getProductName()}</span>
                <span className={styles.category}>{getCategoryName()}</span>
            </div>
        </div>
    );
}
