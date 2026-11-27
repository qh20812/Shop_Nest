import * as React from 'react';

import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Heading, Text } from '@/components/ui/typography';
import { cx } from '@/lib/cx';
import { useTranslation } from '@/lib/i18n';

import styles from './storefront.module.css';

type LegalSection = {
    heading: string;
    body: React.ReactNode;
};

type LegalDocumentProps = {
    title: string;
    description: string;
    sections: LegalSection[];
    className?: string;
};

export function LegalDocument({ title, description, sections, className }: LegalDocumentProps) {
    const { t, locale } = useTranslation();

    return (
        <PageContainer size="prose" className={cx(styles.legalPage, className)}>
            <PageHeader eyebrow={t('Legal')} title={title} description={description} />
            {locale === 'en' ? (
                <Text size="body-sm" tone="muted">
                    {t('This document is available in Vietnamese only; the Vietnamese version prevails.')}
                </Text>
            ) : null}
            <article className={styles.legalDocument}>
                {sections.map((section) => (
                    <section key={section.heading} className={styles.legalSection}>
                        <Heading level={2} size="headline-3" className={styles.legalHeading}>
                            {section.heading}
                        </Heading>
                        <Text size="body-md" tone="muted" className={styles.legalBody}>
                            {section.body}
                        </Text>
                    </section>
                ))}
            </article>
        </PageContainer>
    );
}

export type { LegalDocumentProps, LegalSection };
export default LegalDocument;
