import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Heading, Text } from '@/components/ui/typography';
import { cx } from '@/lib/cx';

import styles from './storefront.module.css';

type BrandSpotlightProps = {
    eyebrow?: string;
    title?: string;
    description?: string;
    cta?: { label: string; href: string };
    image?: string;
    className?: string;
};

export function BrandSpotlight({
    title = 'Người bán thật, nguồn gốc thật.',
    description = 'Mỗi shop trên ShopNest được kiểm duyệt hồ sơ, nguồn hàng và chính sách đổi trả trước khi mở bán.',
    cta = { label: 'Khám phá Shop Việt', href: '/search' },
    image = '/images/shops/shopnest-official.jpg',
    className,
}: BrandSpotlightProps) {
    return (
        <section id="shop-viet" className={cx(styles.brandSpotlight, className)}>
            <PageContainer>
                <div className={styles.brandGrid}>
                    <div className={styles.brandCopy}>
                        <Heading level={2} size="headline-1" className={styles.brandTitle}>
                            {title}
                        </Heading>
                        <Text size="body-md" tone="muted" className={styles.brandText}>
                            {description}
                        </Text>
                        <Button asChild variant="secondary" rightIcon={ArrowRight} className={styles.brandCta}>
                            <Link href={cta.href}>{cta.label}</Link>
                        </Button>
                    </div>
                    <div className={styles.brandMedia}>
                        <img src={image} alt="Gian hàng Shop Việt" loading="lazy" className={styles.brandImage} />
                    </div>
                </div>
            </PageContainer>
        </section>
    );
}

export type { BrandSpotlightProps };
export default BrandSpotlight;
