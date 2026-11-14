import { PackageSearch } from 'lucide-react';

import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { ProductCardModel } from '@/types/commerce';

import { ProductCard } from './ProductCard';

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

const columnClasses = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 lg:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
};

export function ProductGrid({
    products,
    columns = 3,
    loading = false,
    emptyTitle = 'Không tìm thấy món phù hợp',
    emptyDescription = 'Thử một từ khoá khác hoặc xoá bớt bộ lọc.',
    onAddToCart,
    onToggleWishlist,
    className,
}: ProductGridProps) {
    if (loading) {
        return (
            <div className={cn('grid grid-cols-1 gap-5', columnClasses[columns], className)}>
                {Array.from({ length: columns * 2 }).map((_, index) => (
                    <div key={index} className="rounded-card border border-border bg-warm-porcelain p-3">
                        <Skeleton className="aspect-[4/5] h-auto rounded-card" />
                        <div className="mt-3 flex flex-col gap-2">
                            <Skeleton className="h-3 w-1/3" />
                            <Skeleton className="h-4 w-4/5" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (products.length === 0) {
        return <EmptyState icon={PackageSearch} title={emptyTitle} description={emptyDescription} />;
    }

    return (
        <div className={cn('grid grid-cols-1 gap-5', columnClasses[columns], className)}>
            {products.map((product, index) => (
                <ProductCard key={product.id} product={product} priority={index < 4} onAddToCart={onAddToCart} onToggleWishlist={onToggleWishlist} />
            ))}
        </div>
    );
}

export default ProductGrid;
