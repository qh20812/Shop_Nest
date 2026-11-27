import { Link } from '@inertiajs/react';
import { BadgeCheck, Heart, ShoppingCart, type LucideIcon } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { cx } from '@/lib/cx';
import { useTranslation } from '@/lib/i18n';
import type { ProductCardModel } from '@/types/commerce';

import { Price } from './Price';
import { Rating } from './Rating';
import styles from './commerce.module.css';

type ProductCardProps = {
    product: ProductCardModel;
    variant?: 'default' | 'compact' | 'wishlist';
    wishlisted?: boolean;
    priority?: boolean;
    onAddToCart?: (product: ProductCardModel) => void;
    onToggleWishlist?: (product: ProductCardModel) => void;
    actionLabel?: string;
    actionIcon?: LucideIcon;
    className?: string;
};

const statusLabels = {
    new: 'New',
    'fast-ship': 'Fast delivery',
    official: 'Official',
    'low-stock': 'Low stock',
} as const;

type StatusBadge = keyof typeof statusLabels;

const statusTone: Record<StatusBadge, string> = {
    new: styles.productTagNew,
    'fast-ship': styles.productTagFast,
    official: styles.productTagOfficial,
    'low-stock': styles.productTagLow,
};

export function ProductCard({
    product,
    variant = 'default',
    wishlisted = false,
    priority = false,
    onAddToCart,
    onToggleWishlist,
    actionLabel,
    actionIcon,
    className,
}: ProductCardProps) {
    const { t } = useTranslation();
    const href = `/product/${product.id}`;
    const [imageSrc, setImageSrc] = React.useState(product.image);

    React.useEffect(() => {
        setImageSrc(product.image);
    }, [product.image]);

    const badges = product.badges ?? [];
    const isOutOfStock = product.stock === 'out';
    const isLowStock = product.stock === 'low' || badges.includes('low-stock');
    const discount = product.compareAt && product.compareAt > product.price ? Math.round((1 - product.price / product.compareAt) * 100) : null;
    const saleLabel = discount !== null ? `-${discount}%` : badges.includes('sale') ? t('Sale') : null;
    const trusted = product.shopBadge === 'verified' || product.shopBadge === 'official' || badges.includes('official');

    const statusBadges: StatusBadge[] = [];
    if (isLowStock) {
        statusBadges.push('low-stock');
    }
    if (badges.includes('new')) {
        statusBadges.push('new');
    }
    if (badges.includes('fast-ship')) {
        statusBadges.push('fast-ship');
    }
    if (badges.includes('official') && !product.shopName) {
        statusBadges.push('official');
    }
    const visibleStatus = statusBadges.slice(0, 2);

    const resolvedActionLabel = actionLabel ?? (isOutOfStock ? t('Out of stock') : t('Choose options'));
    const ActionIcon = actionIcon ?? ShoppingCart;

    return (
        <article className={cx(styles.productCard, className)} data-variant={variant}>
            <div className={styles.productMedia} data-out={isOutOfStock ? 'true' : undefined}>
                <Link href={href} tabIndex={-1} aria-hidden="true" className={styles.productImageLink}>
                    <img
                        src={imageSrc}
                        alt=""
                        loading={priority ? 'eager' : 'lazy'}
                        decoding="async"
                        onError={() => setImageSrc('/image/default-product.png')}
                        className={styles.productImage}
                    />
                </Link>

                {saleLabel ? <span className={styles.productSale}>{saleLabel}</span> : null}

                {onToggleWishlist ? (
                    <IconButton
                        label={wishlisted ? t('Remove from wishlist') : t('Save to wishlist')}
                        size="sm"
                        variant="secondary"
                        surface="overlay"
                        onClick={() => onToggleWishlist(product)}
                        className={styles.productWishlist}
                    >
                        <Heart aria-hidden="true" className={cx(styles.icon, wishlisted && styles.wishlisted)} />
                    </IconButton>
                ) : null}

                {onAddToCart && variant !== 'wishlist' ? (
                    <Button
                        variant="secondary"
                        size="sm"
                        surface="overlay"
                        shape="pill"
                        leftIcon={ActionIcon}
                        disabled={isOutOfStock}
                        onClick={() => onAddToCart(product)}
                        className={styles.productQuick}
                    >
                        {resolvedActionLabel}
                    </Button>
                ) : null}

                {isOutOfStock ? <span className={styles.productOutOverlay}>{t('Out of stock')}</span> : null}
            </div>

            <div className={styles.productBody}>
                {product.shopName ? (
                    <div className={styles.productShopRow}>
                        <span className={styles.productShop}>{product.shopName}</span>
                        {trusted ? <BadgeCheck aria-hidden="true" className={styles.productShopCheck} /> : null}
                    </div>
                ) : null}

                <Link href={href} className={styles.productTitleLink}>
                    <h3 className={styles.productTitle}>{product.name}</h3>
                </Link>

                {visibleStatus.length > 0 ? (
                    <div className={styles.productTagList}>
                        {visibleStatus.map((badge) => (
                            <span key={badge} className={cx(styles.productTag, statusTone[badge])}>
                                {t(statusLabels[badge])}
                            </span>
                        ))}
                    </div>
                ) : null}

                {variant !== 'compact' && product.metadata ? <span className={styles.productMeta}>{product.metadata}</span> : null}

                {typeof product.rating === 'number' ? <Rating value={product.rating} count={product.reviewCount} compact chip /> : null}

                <div className={styles.productFooter}>
                    <Price value={product.price} compareAt={product.compareAt} showDiscount={false} size={variant === 'compact' ? 'sm' : 'md'} />

                    {onAddToCart && variant === 'wishlist' ? (
                        <Button
                            variant="secondary"
                            size="sm"
                            leftIcon={ActionIcon}
                            disabled={isOutOfStock}
                            onClick={() => onAddToCart(product)}
                            className={styles.productAdd}
                        >
                            {resolvedActionLabel}
                        </Button>
                    ) : null}
                </div>
            </div>
        </article>
    );
}

export default ProductCard;
