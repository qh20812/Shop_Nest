import { useTranslation } from '@/lib/i18n';
import { PackageSearch } from 'lucide-react';

import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { cx } from '@/lib/cx';
import type { ProductCardModel } from '@/types/commerce';

import { ProductCard } from './ProductCard';
import styles from './commerce.module.css';

type ProductGridProps = {
    products: ProductCardModel[];
    columns?: 2 | 3 | 4;
    loading?: boolean;
    emptyTitle?: string;
    emptyDescription?: string;
    onAddToCart?: (product: ProductCardModel) => void;
    onToggleWishlist?: (product: ProductCardModel) => void;
    className?: string;
};

export function ProductGrid({
    products,
    columns = 3,
    loading = false,
    emptyTitle,
    emptyDescription,
    onAddToCart,
    onToggleWishlist,
    className,
}: ProductGridProps) {
    const { t } = useTranslation();
    const resolvedEmptyTitle = emptyTitle ?? t('No matching products');
    const resolvedEmptyDescription = emptyDescription ?? t('Try another keyword or remove some filters.');
    if (loading) {
        return (
            <div className={cx(styles.productGrid, className)} data-columns={columns}>
                {Array.from({ length: columns * 2 }).map((_, index) => (
                    <div key={index} className={styles.skeletonCard}>
                        <Skeleton className={styles.skeletonImage} />
                        <div className={styles.skeletonBody}>
                            <Skeleton className={styles.skeletonLineShort} />
                            <Skeleton className={styles.skeletonLine} />
                            <Skeleton className={styles.skeletonLineHalf} />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (products.length === 0) {
        return <EmptyState icon={PackageSearch} title={resolvedEmptyTitle} description={resolvedEmptyDescription} />;
    }

    return (
        <div className={cx(styles.productGrid, className)} data-columns={columns}>
            {products.map((product, index) => (
                <ProductCard key={product.id} product={product} priority={index < 4} onAddToCart={onAddToCart} onToggleWishlist={onToggleWishlist} />
            ))}
        </div>
    );
}

export default ProductGrid;
