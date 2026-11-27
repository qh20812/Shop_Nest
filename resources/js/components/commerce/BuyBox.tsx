import { useTranslation } from '@/lib/i18n';
import { CheckCircle2, ShoppingCart, Truck, Zap } from 'lucide-react';
import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatNumber } from '@/lib/format';

import { Price } from './Price';
import { QuantityStepper } from './QuantityStepper';
import { Rating } from './Rating';
import { ShopIdentity, type ShopInfo } from './ShopIdentity';
import styles from './commerce.module.css';

type BuyBoxProps = {
    title: string;
    shop?: ShopInfo;
    rating?: number;
    reviewCount?: number;
    soldCount?: number;
    price: number;
    compareAt?: number;
    stock?: number;
    quantity: number;
    maxQuantity: number;
    onQuantityChange: (quantity: number) => void;
    onAddToCart?: () => void;
    onBuyNow?: () => void;
    adding?: boolean;
    buying?: boolean;
    deliveryNote?: string;
    trust?: string[];
    children?: React.ReactNode;
    className?: string;
};

export function BuyBox({
    title,
    shop,
    rating,
    reviewCount,
    soldCount,
    price,
    compareAt,
    stock,
    quantity,
    maxQuantity,
    onQuantityChange,
    onAddToCart,
    onBuyNow,
    adding = false,
    buying = false,
    deliveryNote,
    trust = [],
    children,
    className,
}: BuyBoxProps) {
    const { t } = useTranslation();
    const resolvedDeliveryNote = deliveryNote ?? t('By shipping address.');
    const inStock = (stock ?? maxQuantity) > 0;

    return (
        <div className={className ? `${styles.buyBox} ${className}` : styles.buyBox}>
            {shop && <ShopIdentity shop={shop} />}

            <div>
                <h1 className={styles.buyBoxTitle}>{title}</h1>
                <div className={styles.buyBoxRating}>
                    {typeof rating === 'number' && rating > 0 && <Rating value={rating} count={reviewCount} compact chip />}
                    {typeof soldCount === 'number' && <span>{t('Sold :count', { count: formatNumber(soldCount) })}</span>}
                </div>
            </div>

            <div className={styles.buyBoxPrice}>
                <Price value={price} compareAt={compareAt} size="xl" />
                {stock !== undefined && (
                    <Badge tone={inStock ? 'success' : 'danger'} dot size="sm">
                        {inStock ? t(':count items left', { count: formatNumber(stock) }) : t('Out of stock')}
                    </Badge>
                )}
            </div>

            {children}

            <div className={styles.buyBoxQuantity}>
                <QuantityStepper value={quantity} min={1} max={Math.max(1, maxQuantity)} onChange={onQuantityChange} disabled={!inStock} />
                <span>{t('Max :count items', { count: Math.max(1, maxQuantity) })}</span>
            </div>

            <div className={styles.buyBoxActions}>
                <Button size="lg" leftIcon={ShoppingCart} loading={adding} disabled={!inStock} onClick={onAddToCart}>
                    {t('Add to cart')}
                </Button>
                <Button size="lg" variant="secondary" leftIcon={Zap} loading={buying} disabled={!inStock} onClick={onBuyNow}>
                    Mua ngay
                </Button>
            </div>

            <div className={styles.buyBoxDelivery}>
                <Truck aria-hidden="true" className={styles.buyBoxDeliveryIcon} />
                <div className={styles.buyBoxDeliveryText}>
                    <span className={styles.buyBoxDeliveryTitle}>{t('Estimated delivery')}</span>
                    <span>{resolvedDeliveryNote}</span>
                </div>
            </div>

            {trust.length > 0 && (
                <div className={styles.buyBoxTrust}>
                    {trust.map((item) => (
                        <span key={item} className={styles.buyBoxTrustItem}>
                            <CheckCircle2 aria-hidden="true" className={styles.buyBoxTrustIcon} />
                            {item}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

export type { BuyBoxProps };
export default BuyBox;
