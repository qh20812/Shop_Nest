import { MessageCircle, Store } from 'lucide-react';

import Avatar from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { Rating } from './Rating';

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
        <div className={cn('flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4', className)}>
            <div className="flex min-w-0 items-center gap-3">
                <Avatar name={shop.name} src={shop.logo} size="lg" />
                <div className="flex min-w-0 flex-col gap-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="truncate text-body-md font-semibold text-ink">{shop.name}</span>
                        <Badge tone="success" dot size="sm">
                            Shop Việt
                        </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-body-sm text-ink-muted">
                        {typeof shop.rating === 'number' && <Rating value={shop.rating} compact />}
                        {typeof shop.totalProducts === 'number' && <span>{shop.totalProducts} sản phẩm</span>}
                        {shop.lastActiveAt && <span>· {shop.lastActiveAt}</span>}
                    </div>
                </div>
            </div>
            {(onChat || onViewShop) && (
                <div className="flex items-center gap-2">
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
