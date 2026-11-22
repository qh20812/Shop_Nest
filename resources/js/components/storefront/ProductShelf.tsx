import { ArrowRight, Package } from 'lucide-react';
import * as React from 'react';

import { ProductCard } from '@/components/commerce/ProductCard';
import { PageContainer } from '@/components/layout/PageContainer';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { EmptyState } from '@/components/ui/empty-state';
import { TextLink } from '@/components/ui/text-link';
import { cx } from '@/lib/cx';
import type { ProductCardModel } from '@/types/commerce';

import styles from './storefront.module.css';

type ProductShelfProps = {
    title: React.ReactNode;
    eyebrow?: React.ReactNode;
    description?: React.ReactNode;
    products: ProductCardModel[];
    action?: React.ReactNode;
    variant?: 'grid' | 'rail';
    emptyTitle?: string;
    emptyDescription?: string;
    onAddToCart?: (product: ProductCardModel) => void;
    onToggleWishlist?: (product: ProductCardModel) => void;
    className?: string;
    id?: string;
};

export function ProductShelf({
    title,
    eyebrow,
    description,
    products,
    action,
    variant = 'grid',
    emptyTitle = 'Chưa có sản phẩm',
    emptyDescription = 'Các món được tuyển chọn sẽ xuất hiện ở đây.',
    onAddToCart,
    onToggleWishlist,
    className,
    id,
}: ProductShelfProps) {
    const fallbackAction = (
        <TextLink href="/search" tone="muted" underline={false}>
            Xem tất cả
            <ArrowRight aria-hidden="true" className={styles.inlineIcon} />
        </TextLink>
    );

    return (
        <section id={id} className={cx(styles.productShelf, className)}>
            <PageContainer>
                <SectionHeader eyebrow={eyebrow} title={title} description={description} action={action ?? fallbackAction} />
                {products.length === 0 ? (
                    <EmptyState icon={Package} title={emptyTitle} description={emptyDescription} />
                ) : variant === 'rail' ? (
                    <div className={styles.shelfRail}>
                        {products.map((product, index) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                priority={index < 2}
                                onAddToCart={onAddToCart}
                                onToggleWishlist={onToggleWishlist}
                                className={styles.shelfRailCard}
                            />
                        ))}
                    </div>
                ) : (
                    <div className={styles.shelfGrid}>
                        {products.map((product, index) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                priority={index < 4}
                                onAddToCart={onAddToCart}
                                onToggleWishlist={onToggleWishlist}
                            />
                        ))}
                    </div>
                )}
            </PageContainer>
        </section>
    );
}

export type { ProductShelfProps };
export default ProductShelf;
