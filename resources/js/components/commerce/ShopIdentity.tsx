import { MessageCircle, Store } from 'lucide-react';

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
    onChat?: () => void;
    onViewShop?: () => void;
    className?: string;
};

export function ShopIdentity({ shop, onChat, onViewShop, className }: ShopIdentityProps) {
    return (
        <div className={className ? `${styles.shopIdentity} ${className}` : styles.shopIdentity}>
            <div className={styles.shopMain}>
                <Avatar name={shop.name} src={shop.logo} size="lg" />
                <div className={styles.shopText}>
                    <span className={styles.shopName}>{shop.name}</span>
                    <div className={styles.shopMeta}>
                        {typeof shop.rating === 'number' && <Rating value={shop.rating} compact />}
                        {typeof shop.totalProducts === 'number' && <span>{shop.totalProducts} sản phẩm</span>}
                        {shop.lastActiveAt && <span>Hoạt động {shop.lastActiveAt}</span>}
                    </div>
                </div>
            </div>
            {(onChat || onViewShop) && (
                <div className={styles.shopActions}>
                    {onChat && (
                        <Button variant="outline" size="sm" leftIcon={MessageCircle} onClick={onChat}>
                            Chat
                        </Button>
                    )}
                    {onViewShop && (
                        <Button variant="ghost" size="sm" leftIcon={Store} onClick={onViewShop}>
                            Xem shop
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}

export type { ShopIdentityProps, ShopInfo };
export default ShopIdentity;
