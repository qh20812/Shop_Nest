import { Head } from '@inertiajs/react';
import { CheckCircle2 } from 'lucide-react';

import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { StorefrontLayout } from '@/components/layout/StorefrontLayout';
import { Card } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { useTranslation } from '@/lib/i18n';

import styles from './About.module.css';

const reasonKeys = [
    'Six essential categories for your home and everyday life',
    'Sellers are vetted for profile and product origin',
    'Prices and return policies are shown clearly before you buy',
    'Nationwide delivery and support when an order has a problem',
    'Pay with Stripe or cash on delivery',
];

export default function About() {
    const { t } = useTranslation();

    return (
        <StorefrontLayout compactFooter>
            <Head title={t('About ShopNest')} />

            <PageContainer size="prose" className={styles.page}>
                <PageHeader
                    eyebrow={t('About ShopNest')}
                    title={t('A small market, run like a careful notebook.')}
                    description={t('ShopNest is a curated marketplace for Vietnamese homes: many categories, but nothing sold carelessly.')}
                />

                <div className={styles.content}>
                    <Card padding="lg">
                        <div className={styles.cardBody}>
                            <Heading level={2} size="headline-2">
                                {t('Our mission')}
                            </Heading>
                            <Text size="body-md" tone="muted">
                                {t(
                                    'Help Vietnamese shoppers choose the right item for their home without giving up clarity. We connect buyers with fair sellers who are transparent about origin and stay with you until the parcel arrives.',
                                )}
                            </Text>
                        </div>
                    </Card>

                    <div>
                        <Heading level={2} size="headline-2">
                            {t('Why ShopNest?')}
                        </Heading>
                        <ul className={styles.reasons}>
                            {reasonKeys.map((key) => (
                                <li key={key} className={styles.reason}>
                                    <CheckCircle2 aria-hidden="true" className={styles.reasonIcon} />
                                    <span>{t(key)}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <Card variant="inset" padding="lg">
                        <div className={styles.cardBody}>
                            <Heading level={3} size="headline-3">
                                {t('How we curate')}
                            </Heading>
                            <Text size="body-md" tone="muted">
                                {t(
                                    'Each category has its own criteria: electronics need clear warranty and specs; appliances need capacity and power; mother & baby need safety standards; fashion and beauty need materials, sizing and shelf life. One system, different essentials.',
                                )}
                            </Text>
                        </div>
                    </Card>
                </div>
            </PageContainer>
        </StorefrontLayout>
    );
}
