import { Link } from '@inertiajs/react';
import { Heart, ShoppingCart } from 'lucide-react';
import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { IconButton } from '@/components/ui/icon-button';
import { cn } from '@/lib/utils';
import type { ProductCardModel } from '@/types/commerce';

import { Price } from './Price';
import { Rating } from './Rating';

type ProductCardProps = {
    product: ProductCardModel;
    variant?: 'default' | 'compact' | 'wishlist';
    wishlisted?: boolean;
    priority?: boolean;
    onAddToCart?: (product: ProductCardModel) => void;
    onToggleWishlist?: (product: ProductCardModel) => void;
    className?: string;
};

const badgeLabels = {
    sale: 'Giảm giá',
    new: 'Mới',
    'fast-ship': 'Giao nhanh',
    official: 'Chính hãng',
    'low-stock': 'Sắp hết',
};

export function ProductCard({
    product,
    variant = 'default',
    wishlisted = false,
    priority = false,
    onAddToCart,
    onToggleWishlist,
    className,
}: ProductCardProps) {
    const href = `/product/${product.id}`;
    const [imageSrc, setImageSrc] = React.useState(product.image);
    const isOutOfStock = product.stock === 'out';

    React.useEffect(() => {
        setImageSrc(product.image);
    }, [product.image]);
    const discount = product.compareAt && product.compareAt > product.price ? Math.round((1 - product.price / product.compareAt) * 100) : null;

    return (
        <article
            className={cn(
                'group flex w-full flex-col rounded-card border border-border bg-warm-porcelain p-3 transition-colors duration-150 ease-nep hover:border-lacquer-red/40',
                variant === 'wishlist' && 'overflow-hidden p-0',
                className,
            )}
        >
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-card bg-raw-linen">
                <Link href={href} aria-label={product.name}>
                    <img
                        src={imageSrc}
                        alt={product.imageAlt ?? product.name}
                        loading={priority ? 'eager' : 'lazy'}
                        onError={() => setImageSrc('/image/default-product.png')}
                        className="size-full object-cover transition-transform duration-300 ease-nep group-hover:scale-[1.02]"
                    />
                </Link>

                <div className="absolute top-2.5 left-2.5 flex flex-col items-start gap-1.5">
                    {discount !== null && discount > 0 && (
                        <Badge tone="accent" size="sm">
                            -{discount}%
                        </Badge>
                    )}
                    {product.badges
                        ?.filter((badge) => badge !== 'sale')
                        .slice(0, 2)
                        .map((badge) => (
                            <Badge key={badge} tone={badge === 'low-stock' ? 'warning' : 'neutral'} size="sm">
                                {badgeLabels[badge]}
                            </Badge>
                        ))}
                    {product.stock === 'low' && !product.badges?.includes('low-stock') && (
                        <Badge tone="warning" size="sm">
                            Sắp hết
                        </Badge>
                    )}
                </div>

                {onToggleWishlist && (
                    <IconButton
                        label={wishlisted ? 'Bỏ lưu sản phẩm' : 'Lưu sản phẩm'}
                        size="sm"
                        variant="secondary"
                        className="absolute top-2.5 right-2.5"
                        onClick={() => onToggleWishlist(product)}
                    >
                        <Heart aria-hidden="true" className={wishlisted ? 'fill-lacquer-red text-lacquer-red' : undefined} />
                    </IconButton>
                )}

                {isOutOfStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-ink/35">
                        <Badge tone="ink" size="md">
                            Hết hàng
                        </Badge>
                    </div>
                )}
            </div>

            <div className={cn('flex flex-1 flex-col pt-3', variant === 'wishlist' && 'px-3 pb-3')}>
                <div className="mb-1 flex items-center gap-1.5">
                    <Badge tone="accent" size="sm">
                        {product.shopBadge === 'official' ? 'Chính hãng' : product.shopBadge === 'verified' ? 'Đã duyệt' : 'Shop Việt'}
                    </Badge>
                    <span className="truncate text-body-sm text-ink-muted">{product.shopName}</span>
                </div>

                <Link href={href} className="focus-ring rounded-chip">
                    <h3
                        className={cn(
                            'line-clamp-2 text-body-sm leading-snug font-semibold text-ink transition-colors group-hover:text-lacquer-red',
                            variant === 'compact' && 'text-body-sm',
                        )}
                    >
                        {product.name}
                    </h3>
                </Link>

                {variant !== 'compact' && product.metadata && (
                    <p className="mt-1.5 line-clamp-1 rounded-chip bg-raw-linen/60 p-1.5 font-mono text-label-code text-ink-muted">
                        {product.metadata}
                    </p>
                )}

                <div className="mt-2 flex items-center gap-2 text-body-sm text-ink-muted">
                    {typeof product.rating === 'number' && <Rating value={product.rating} count={product.reviewCount} compact />}
                </div>

                <div className="mt-3 flex items-center justify-between gap-2 border-t border-border pt-2.5">
                    <Price value={product.price} compareAt={product.compareAt} size={variant === 'compact' ? 'sm' : 'md'} showDiscount={false} />
                    {variant === 'wishlist' ? (
                        <button
                            type="button"
                            disabled={isOutOfStock}
                            onClick={() => onAddToCart?.(product)}
                            className="inline-flex h-control-sm items-center justify-center gap-1.5 rounded-control border border-border bg-transparent px-3 text-body-sm font-medium text-ink transition-colors hover:bg-lacquer-wash disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <ShoppingCart aria-hidden="true" className="size-4" />
                            Thêm vào giỏ
                        </button>
                    ) : (
                        <IconButton
                            label={isOutOfStock ? 'Hết hàng' : 'Thêm vào giỏ'}
                            size="sm"
                            variant="secondary"
                            disabled={isOutOfStock}
                            onClick={() => onAddToCart?.(product)}
                        >
                            <ShoppingCart aria-hidden="true" />
                        </IconButton>
                    )}
                </div>
            </div>
        </article>
    );
}

export default ProductCard;
