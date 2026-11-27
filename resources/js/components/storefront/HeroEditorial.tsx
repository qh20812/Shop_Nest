import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import * as React from 'react';

import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Heading, Text } from '@/components/ui/typography';
import { cx } from '@/lib/cx';

import styles from './storefront.module.css';

type HeroImage = {
    src: string;
    alt: string;
    label?: string;
};

type HeroEditorialProps = {
    title: React.ReactNode;
    subcopy: React.ReactNode;
    cta?: { label: string; href: string };
    images: HeroImage[];
    backdropImage?: string;
    className?: string;
};

export function HeroEditorial({ title, subcopy, cta, images, backdropImage, className }: HeroEditorialProps) {
    const [lead, ...rest] = images;

    return (
        <section className={cx(styles.hero, className)}>
            {backdropImage && (
                <div className={styles.heroWash} aria-hidden="true">
                    <img src={backdropImage} alt="" loading="eager" decoding="async" fetchPriority="low" className={styles.heroWashImage} />
                </div>
            )}
            <PageContainer className={styles.heroStage}>
                <div className={styles.heroGrid}>
                    <div className={styles.heroCopy}>
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
                        <div className={styles.heroMedia} data-count={Math.min(images.length, 3)}>
                            <HeroCell image={lead} lead priority />
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

function HeroCell({ image, lead = false, priority = false }: { image: HeroImage; lead?: boolean; priority?: boolean }) {
    return (
        <figure className={cx(styles.heroCell, lead && styles.heroLead)}>
            <div className={styles.heroImageBox}>
                <img
                    src={image.src}
                    alt={image.alt}
                    loading={priority ? 'eager' : 'lazy'}
                    fetchPriority={priority ? 'high' : undefined}
                    decoding={priority ? 'sync' : 'async'}
                    className={styles.heroImage}
                />
            </div>
            {image.label && <figcaption className={styles.heroCaption}>{image.label}</figcaption>}
        </figure>
    );
}

export type { HeroEditorialProps, HeroImage };
export default HeroEditorial;
