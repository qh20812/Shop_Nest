import { ProductCard } from '@/components/commerce/ProductCard';
import { PageContainer } from '@/components/layout/PageContainer';
import { Heading, Text } from '@/components/ui/typography';
import { cx } from '@/lib/cx';
import { useTranslation } from '@/lib/i18n';
import type { ProductCardModel } from '@/types/commerce';

import { Countdown } from '@/components/commerce/Countdown';
import styles from './storefront.module.css';

type FlashSaleModuleProps = {
    endsAt: string | number | Date | null | undefined;
    name?: string;
    products: ProductCardModel[];
    onAddToCart?: (product: ProductCardModel) => void;
    onToggleWishlist?: (product: ProductCardModel) => void;
    className?: string;
};

export function FlashSaleModule({ endsAt, name, products, onAddToCart, onToggleWishlist, className }: FlashSaleModuleProps) {
    const { t } = useTranslation();

    if (products.length === 0) {
        return null;
    }

    return (
        <section id="flash-sale" className={cx(styles.flashSale, className)}>
            <PageContainer>
                <div className={styles.flashPanel}>
                    <div className={styles.flashHead}>
                        <div className={styles.flashCopy}>
                            <Heading level={2} size="headline-2" className={styles.flashTitle}>
                                {name ?? t("Today's flash sale")}
                            </Heading>
                            <Text size="body-sm" tone="muted" className={styles.flashText}>
                                {t('Limited quantities for today only.')}
                            </Text>
                        </div>
                        <div className={styles.flashTime}>
                            <span className={styles.flashTimeLabel}>{t('Ends in')}</span>
                            <Countdown endsAt={endsAt} />
                        </div>
                    </div>

                    <div className={styles.flashGrid}>
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
