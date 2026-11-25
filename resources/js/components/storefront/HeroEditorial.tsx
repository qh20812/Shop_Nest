import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import * as React from 'react';

import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Eyebrow, Heading, Text } from '@/components/ui/typography';
import { cx } from '@/lib/cx';
import { useTranslation } from '@/lib/i18n';

import styles from './storefront.module.css';

type HeroImage = {
    src: string;
    alt: string;
    label?: string;
};

type HeroEditorialProps = {
    eyebrow?: React.ReactNode;
    title: React.ReactNode;
    subcopy: React.ReactNode;
    cta?: { label: string; href: string };
    images: HeroImage[];
    className?: string;
};

export function HeroEditorial({ eyebrow, title, subcopy, cta, images, className }: HeroEditorialProps) {
    const { t } = useTranslation();
    const [lead, ...rest] = images;

    return (
        <section className={cx(styles.hero, className)}>
            <PageContainer>
                <div className={styles.heroGrid}>
                    <div className={styles.heroCopy}>
                        <Eyebrow tone="accent">{eyebrow ?? t('Everything for Vietnamese homes')}</Eyebrow>
                        <Heading level={1} size="display-lg" className={styles.heroTitle}>
                            {title}
                        </Heading>
                        <Text size="body-lg" tone="muted" className={styles.heroSubcopy}>
                            {subcopy}
                        </Text>

                        {cta && (
                            <div className={styles.heroActions}>
                                <Button asChild size="lg" rightIcon={ArrowRight}>
                                    <Link href={cta.href}>{cta.label}</Link>
                                </Button>
                            </div>
                        )}
                    </div>

                    {lead && (
                        <div className={styles.heroMedia}>
                            <HeroCell image={lead} wide priority />
                            {rest.slice(0, 2).map((image) => (
                                <HeroCell key={image.src} image={image} />
                            ))}
                        </div>
                    )}
                </div>
            </PageContainer>
        </section>
    );
}

function HeroCell({ image, wide = false, priority = false }: { image: HeroImage; wide?: boolean; priority?: boolean }) {
    return (
        <div className={wide ? `${styles.heroLead} ${styles.heroCell}` : styles.heroCell}>
            <div className={styles.heroImageBox}>
                <img src={image.src} alt={image.alt} loading={priority ? 'eager' : 'lazy'} className={styles.heroImage} />
            </div>
            {image.label && <span className={styles.heroCaption}>{image.label}</span>}
        </div>
    );
}

export type { HeroEditorialProps, HeroImage };
export default HeroEditorial;
