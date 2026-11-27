import { useTranslation } from '@/lib/i18n';
import { MessageCircle, Store } from 'lucide-react';
import * as React from 'react';

import Avatar from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

import { Rating } from './Rating';
import styles from './commerce.module.css';

type ShopInfo = {
    id?: number;
    name: string;
    logo?: string | null;
    rating?: number;
    totalProducts?: number;
    lastActiveAt?: string | null;
};

type ShopIdentityProps = {
    shop: ShopInfo;
    variant?: 'default' | 'compact';
    chatLabel?: React.ReactNode;
    viewShopLabel?: React.ReactNode;
    onChat?: () => void;
    onViewShop?: () => void;
    className?: string;
};

export function ShopIdentity({ shop, variant = 'default', chatLabel, viewShopLabel, onChat, onViewShop, className }: ShopIdentityProps) {
    const { t } = useTranslation();
    return (
        <div className={className ? `${styles.shopIdentity} ${className}` : styles.shopIdentity} data-variant={variant}>
            <div className={styles.shopMain}>
                <Avatar name={shop.name} src={shop.logo} size="lg" />
                <div className={styles.shopText}>
                    <span className={styles.shopName}>{shop.name}</span>
                    <div className={styles.shopMeta}>
                        {typeof shop.rating === 'number' && <Rating value={shop.rating} compact />}
                        {typeof shop.totalProducts === 'number' && <span>{t(':count products', { count: shop.totalProducts })}</span>}
                        {shop.lastActiveAt && <span>{t('Active :time', { time: shop.lastActiveAt })}</span>}
                    </div>
                </div>
            </div>
            {(onChat || onViewShop) && (
                <div className={styles.shopActions}>
                    {onChat && (
                        <Button type="button" variant="outline" size="sm" leftIcon={MessageCircle} onClick={onChat}>
                            {chatLabel ?? t('Chat')}
                        </Button>
                    )}
                    {onViewShop && (
                        <Button type="button" variant="ghost" size="sm" leftIcon={Store} onClick={onViewShop}>
                            {viewShopLabel ?? t('View shop')}
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}

export type { ShopIdentityProps, ShopInfo };
export default ShopIdentity;
