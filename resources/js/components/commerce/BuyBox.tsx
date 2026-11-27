import { useTranslation } from '@/lib/i18n';
import { CheckCircle2, ShoppingCart, Truck, Zap } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { formatNumber } from '@/lib/format';

import { Price } from './Price';
import { QuantityStepper } from './QuantityStepper';
import styles from './commerce.module.css';

type BuyBoxProps = {
    price: number;
    compareAt?: number;
    stock?: number;
    canBuy?: boolean;
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
    price,
    compareAt,
    stock,
    canBuy = true,
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
    const inStock = typeof stock === 'number' ? stock > 0 : true;
    const purchasable = canBuy && inStock;

    return (
        <div className={className ? `${styles.buyBox} ${className}` : styles.buyBox}>
            <div className={styles.buyBoxPrice}>
                <Price value={price} compareAt={compareAt} size="xl" />
                {typeof stock === 'number' && (
                    <span className={styles.buyBoxStock} data-out={!inStock ? 'true' : undefined}>
                        {inStock ? t(':count items left', { count: formatNumber(stock) }) : t('Out of stock')}
                    </span>
                )}
            </div>

            {children}

            <div className={styles.buyBoxQuantity}>
                <QuantityStepper value={quantity} min={1} max={Math.max(1, maxQuantity)} onChange={onQuantityChange} disabled={!purchasable} />
                <span>{t('Max :count items', { count: Math.max(1, maxQuantity) })}</span>
            </div>

            <div className={styles.buyBoxActions}>
                <Button type="button" size="lg" leftIcon={ShoppingCart} loading={adding} disabled={!purchasable} onClick={onAddToCart}>
                    {t('Add to cart')}
                </Button>
                <Button type="button" size="lg" variant="secondary" leftIcon={Zap} loading={buying} disabled={!purchasable} onClick={onBuyNow}>
                    {t('Buy now')}
                </Button>
            </div>

            <div className={styles.buyBoxAssurance}>
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
        </div>
    );
}

export type { BuyBoxProps };
export default BuyBox;
