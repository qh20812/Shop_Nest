import { useTranslation } from '@/lib/i18n';
import { Link } from '@inertiajs/react';
import { Heart, ShoppingCart } from 'lucide-react';
import * as React from 'react';

import { IconButton } from '@/components/ui/icon-button';
import { cx } from '@/lib/cx';
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
    className?: string;
};

const badgeLabels = {
    new: 'New',
    'fast-ship': 'Fast delivery',
    official: 'Official',
    'low-stock': 'Low stock',
} as const;

export function ProductCard({
    product,
    variant = 'default',
    wishlisted = false,
    priority = false,
    onAddToCart,
    onToggleWishlist,
    className,
}: ProductCardProps) {
    const { t } = useTranslation();
    const href = `/product/${product.id}`;
    const [imageSrc, setImageSrc] = React.useState(product.image);
    const isOutOfStock = product.stock === 'out';
    const badgeItems = (product.badges ?? []).filter((badge) => badge !== 'sale');

    React.useEffect(() => {
        setImageSrc(product.image);
    }, [product.image]);

    return (
        <article className={cx(styles.productCard, className)} data-variant={variant}>
            <Link href={href} className={styles.productMedia} aria-label={product.name}>
                <img
                    src={imageSrc}
                    alt={product.imageAlt ?? product.name}
                    loading={priority ? 'eager' : 'lazy'}
                    onError={() => setImageSrc('/image/default-product.png')}
                    className={styles.productImage}
                />
            </Link>

            <div className={styles.productBody}>
                {product.shopName ? <span className={styles.productShop}>{product.shopName}</span> : null}

                <Link href={href}>
                    <h3 className={styles.productTitle}>{product.name}</h3>
                </Link>

                {(badgeItems.length > 0 || product.stock === 'low') && (
                    <div className={styles.productBadgeList}>
                        {badgeItems.map((badge) => (
                            <span key={badge}>{t(badgeLabels[badge as keyof typeof badgeLabels])}</span>
                        ))}
                        {product.stock === 'low' && !badgeItems.includes('low-stock') && <span>{t('Low stock')}</span>}
                    </div>
                )}

                {variant !== 'compact' && product.metadata ? <span className={styles.productMeta}>{product.metadata}</span> : null}

                {typeof product.rating === 'number' ? (
                    <div>
                        <Rating value={product.rating} count={product.reviewCount} compact />
                    </div>
                ) : null}

                <div className={styles.productFooter}>
                    <Price value={product.price} compareAt={product.compareAt} size={variant === 'compact' ? 'sm' : 'md'} />

                    <div className={styles.productActions}>
                        {onToggleWishlist ? (
                            <IconButton
                                label={wishlisted ? t('Remove from wishlist') : t('Save to wishlist')}
                                size="sm"
                                variant="secondary"
                                onClick={() => onToggleWishlist(product)}
                            >
                                <Heart aria-hidden="true" className={cx(styles.icon, wishlisted && styles.wishlisted)} />
                            </IconButton>
                        ) : null}

                        {variant === 'wishlist' ? (
                            <button type="button" disabled={isOutOfStock} onClick={() => onAddToCart?.(product)} className={styles.productAdd}>
                                <ShoppingCart aria-hidden="true" className={styles.productAddIcon} />
                                {t('Add to cart')}
                            </button>
                        ) : (
                            <IconButton
                                label={isOutOfStock ? t('Out of stock') : t('Add to cart')}
                                size="sm"
                                variant="secondary"
                                disabled={isOutOfStock}
                                onClick={() => onAddToCart?.(product)}
                            >
                                <ShoppingCart aria-hidden="true" className={styles.icon} />
                            </IconButton>
                        )}
                    </div>
                </div>

                {isOutOfStock ? <span className={styles.productOut}>{t('Out of stock')}</span> : null}
            </div>
        </article>
    );
}

export default ProductCard;
