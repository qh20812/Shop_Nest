import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Heading, Text } from '@/components/ui/typography';
import { cx } from '@/lib/cx';
import { useTranslation } from '@/lib/i18n';

import styles from './storefront.module.css';

type BrandSpotlightProps = {
    eyebrow?: string;
    title?: string;
    description?: string;
    cta?: { label: string; href: string };
    image?: string;
    className?: string;
};

export function BrandSpotlight({ title, description, cta, image = '/images/shops/shopnest-official.jpg', className }: BrandSpotlightProps) {
    const { t } = useTranslation();
    const resolvedTitle = title ?? t('Real sellers, real origin.');
    const resolvedDescription = description ?? t('Every shop on ShopNest is vetted for profile, sourcing and return policy before opening.');
    const resolvedCta = cta ?? { label: t('Explore Vietnamese shops'), href: '/search' };

    return (
        <section id="shop-viet" className={cx(styles.brandSpotlight, className)}>
            <PageContainer>
                <div className={styles.brandGrid}>
                    <div className={styles.brandCopy}>
                        <Heading level={2} size="headline-1" className={styles.brandTitle}>
                            {resolvedTitle}
                        </Heading>
                        <Text size="body-md" tone="muted" className={styles.brandText}>
                            {resolvedDescription}
                        </Text>
                        <Button asChild variant="secondary" rightIcon={ArrowRight} className={styles.brandCta}>
                            <Link href={resolvedCta.href}>{resolvedCta.label}</Link>
                        </Button>
                    </div>
                    <div className={styles.brandMedia}>
                        <img src={image} alt={t('Vietnamese shop storefront')} loading="lazy" className={styles.brandImage} />
                    </div>
                </div>
            </PageContainer>
        </section>
    );
}

export type { BrandSpotlightProps };
export default BrandSpotlight;
