import { Flame } from 'lucide-react';

import { Countdown } from '@/components/commerce/Countdown';
import { ProductCard } from '@/components/commerce/ProductCard';
import { PageContainer } from '@/components/layout/PageContainer';
import { Badge } from '@/components/ui/badge';
import { Heading, Text } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import type { ProductCardModel } from '@/types/commerce';

type FlashSaleModuleProps = {
    endsAt: string | number | Date | null | undefined;
    name?: string;
    products: ProductCardModel[];
    onAddToCart?: (product: ProductCardModel) => void;
    onToggleWishlist?: (product: ProductCardModel) => void;
    className?: string;
};

export function FlashSaleModule({ endsAt, name, products, onAddToCart, onToggleWishlist, className }: FlashSaleModuleProps) {
    if (products.length === 0) {
        return null;
    }

    return (
        <section id="flash-sale" className={cn('py-8 md:py-10', className)}>
            <PageContainer>
                <div className="rounded-surface border border-border bg-warm-porcelain p-5 md:p-7">
                    <div className="flex flex-col gap-4 border-b border-border pb-5 md:flex-row md:items-center md:justify-between">
                        <div className="flex flex-col gap-2">
                            <Badge tone="accent" icon={Flame} size="md" className="w-fit">
                                Giờ Vàng Tuyển Chọn
                            </Badge>
                            <Heading level={2} size="headline-2">
                                {name ?? 'Flash sale hôm nay'}
                            </Heading>
                            <Text size="body-sm" tone="muted">
                                Số lượng giới hạn trong ngày.
                            </Text>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-label-micro font-semibold tracking-[0.12em] text-ink-muted uppercase">Kết thúc sau</span>
                            <Countdown endsAt={endsAt} />
                        </div>
                    </div>

                    <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {products.slice(0, 8).map((product, index) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                priority={index < 2}
                                onAddToCart={onAddToCart}
                                onToggleWishlist={onToggleWishlist}
                            />
                        ))}
                    </div>
                </div>
            </PageContainer>
        </section>
    );
}

export type { FlashSaleModuleProps };
export default FlashSaleModule;
