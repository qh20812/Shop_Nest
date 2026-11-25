import { PageContainer } from '@/components/layout/PageContainer';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { Heading, Text } from '@/components/ui/typography';
import { cx } from '@/lib/cx';
import { useTranslation } from '@/lib/i18n';

import styles from './storefront.module.css';

type EditorialPillar = {
    title: string;
    description: string;
    image?: string;
};

type EditorialPillarsProps = {
    pillars: EditorialPillar[];
    className?: string;
};

export function EditorialPillars({ pillars, className }: EditorialPillarsProps) {
    const { t } = useTranslation();

    return (
        <section className={cx(styles.editorial, className)}>
            <PageContainer>
                <SectionHeader title={t('Chosen with care, lived with ease')} />
                <div className={styles.editorialGrid}>
                    {pillars.slice(0, 3).map((pillar) => (
                        <article key={pillar.title} className={styles.editorialItem}>
                            {pillar.image && (
                                <div className={styles.editorialMedia}>
                                    <img src={pillar.image} alt="" loading="lazy" className={styles.editorialImage} />
                                </div>
                            )}
                            <Heading level={3} size="headline-3" className={styles.editorialTitle}>
                                {pillar.title}
                            </Heading>
                            <Text size="body-sm" tone="muted" className={styles.editorialText}>
                                {pillar.description}
                            </Text>
                        </article>
                    ))}
                </div>
            </PageContainer>
        </section>
    );
}

export type { EditorialPillar, EditorialPillarsProps };
export default EditorialPillars;
