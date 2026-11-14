import { CheckCircle2, ShoppingCart, Truck, Zap } from 'lucide-react';
import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatNumber } from '@/lib/format';
import { cn } from '@/lib/utils';

import { Price } from './Price';
import { QuantityStepper } from './QuantityStepper';
import { Rating } from './Rating';
import { ShopIdentity, type ShopInfo } from './ShopIdentity';

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
    deliveryNote = 'Giao trong 2–4 ngày tại TP.HCM.',
    trust = ['Shop đã kiểm duyệt', 'Đổi trả 7 ngày'],
    children,
    className,
}: BuyBoxProps) {
    const inStock = (stock ?? maxQuantity) > 0;

    return (
        <div className={cn('flex flex-col gap-5 rounded-surface border border-border bg-warm-porcelain p-5 lg:sticky lg:top-24', className)}>
            {shop && <ShopIdentity shop={shop} />}

            <div className="flex flex-col gap-2">
                <h1 className="text-headline-3 text-ink">{title}</h1>
                <div className="flex flex-wrap items-center gap-3 text-body-sm text-ink-muted">
                    {typeof rating === 'number' && <Rating value={rating} count={reviewCount} compact />}
                    {typeof soldCount === 'number' && <span>· Đã bán {formatNumber(soldCount)}</span>}
                </div>
            </div>

            <div className="rounded-card border border-border bg-rice-paper/60 p-4">
                <Price value={price} compareAt={compareAt} size="xl" />
                {stock !== undefined && (
                    <div className="mt-2">
                        <Badge tone={inStock ? 'success' : 'danger'} dot size="sm">
                            {inStock ? `Còn ${formatNumber(stock)} sản phẩm` : 'Tạm hết hàng'}
                        </Badge>
                    </div>
                )}
            </div>

            {children}

            <div className="flex flex-wrap items-center justify-between gap-3">
                <QuantityStepper value={quantity} min={1} max={Math.max(1, maxQuantity)} onChange={onQuantityChange} disabled={!inStock} />
                <span className="text-body-sm text-ink-muted">Tối đa {Math.max(1, maxQuantity)} món</span>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
                <Button size="lg" className="flex-1" leftIcon={ShoppingCart} loading={adding} disabled={!inStock} onClick={onAddToCart}>
                    Thêm vào giỏ
                </Button>
                <Button size="lg" variant="secondary" className="flex-1" leftIcon={Zap} loading={buying} disabled={!inStock} onClick={onBuyNow}>
                    Mua ngay
                </Button>
            </div>

            <div className="flex items-start gap-3 rounded-control border border-border bg-raw-linen/50 p-3">
                <Truck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-jade" />
                <div className="flex flex-col gap-0.5">
                    <span className="text-body-sm font-medium text-ink">Dự kiến nhận hàng</span>
                    <span className="text-body-sm text-ink-muted">{deliveryNote}</span>
                </div>
            </div>

            {trust.length > 0 && (
                <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-border pt-4">
                    {trust.map((item) => (
                        <span key={item} className="inline-flex items-center gap-1.5 text-body-sm text-ink-muted">
                            <CheckCircle2 aria-hidden="true" className="size-4 text-jade" />
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
