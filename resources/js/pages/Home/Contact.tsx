import { Head } from '@inertiajs/react';
import { Clock, Mail, MapPin, Phone, Send, type LucideIcon } from 'lucide-react';
import * as React from 'react';

import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { StorefrontLayout } from '@/components/layout/StorefrontLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import Input from '@/components/ui/input';
import Textarea from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toast';
import { Heading, Text } from '@/components/ui/typography';
import { useTranslation } from '@/lib/i18n';

import styles from './Contact.module.css';

type ContactItemMeta = {
    icon: LucideIcon;
    titleKey: string;
    value?: string;
    valueKey?: string;
    href?: string;
};

const contactItemsMeta: ContactItemMeta[] = [
    { icon: MapPin, titleKey: 'Address', value: 'Tầng 5 Tòa nhà Emporium, 184 Lê Đại Hành, Phường 15, Quận 11, TP. Hồ Chí Minh' },
    { icon: Phone, titleKey: 'Phone', value: '1900 6886', href: 'tel:19006886' },
    { icon: Mail, titleKey: 'Email', value: 'hotro@shopnest.vn', href: 'mailto:hotro@shopnest.vn' },
    { icon: Clock, titleKey: 'Opening hours', valueKey: 'Mon - Fri: 8:00 - 18:00, Sat - Sun: 9:00 - 17:00' },
];

const insetCardVariant = 'inset' as const;

export default function Contact() {
    const { success } = useToast();
    const { t } = useTranslation();
    const [submitting, setSubmitting] = React.useState(false);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        setSubmitting(true);
        window.setTimeout(() => {
            setSubmitting(false);
            success(t('Message sent'), t('ShopNest will reply during opening hours.'));
            form.reset();
        }, 500);
    };

    const contactItems = contactItemsMeta.map((item) => ({
        ...item,
        title: t(item.titleKey),
        displayValue: item.valueKey ? t(item.valueKey) : item.value,
    }));

    return (
        <StorefrontLayout compactFooter>
            <Head title={t('Contact ShopNest')} />

            <PageContainer className={styles.page}>
                <PageHeader
                    eyebrow={t('Contact')}
                    title={t('Need a clear answer?')}
                    description={t('Send a message or call our hotline. We reply during opening hours.')}
                />

                <div className={styles.grid}>
                    <Card className={styles.formCard} padding="lg">
                        <Heading level={2} size="headline-2">
                            {t('Send a message')}
                        </Heading>
                        <Text size="body-sm" tone="muted">
                            {t('The more specific, the easier it is to help.')}
                        </Text>

                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formGrid}>
                                <FormField label={t('Full name')} required>
                                    <Input placeholder={t('e.g. Nguyen Thu Ha')} autoComplete="name" required />
                                </FormField>
                                <FormField label={t('Email')} required>
                                    <Input type="email" placeholder="you@example.com" autoComplete="email" required />
                                </FormField>
                            </div>
                            <FormField label={t('Subject')} required>
                                <Input placeholder={t('e.g. Check order #SN-24817')} required />
                            </FormField>
                            <FormField label={t('Message')} required>
                                <Textarea rows={5} placeholder={t('What do you need help with?')} required />
                            </FormField>
                            <div className={styles.formActions}>
                                <Button type="submit" loading={submitting} rightIcon={Send}>
                                    {t('Send message')}
                                </Button>
                            </div>
                        </form>
                    </Card>

                    <div className={styles.infoList}>
                        {contactItems.map((item) => {
                            const Icon = item.icon;

                            return (
                                <Card key={item.title} variant={insetCardVariant} padding="md" className={styles.infoCard}>
                                    <div className={styles.infoRow}>
                                        <span className={styles.infoIcon}>
                                            <Icon aria-hidden="true" />
                                        </span>
                                        <div className={styles.infoText}>
                                            <h3 className={styles.infoTitle}>{item.title}</h3>
                                            {item.href ? (
                                                <a href={item.href} className={styles.infoValue}>
                                                    {item.displayValue}
                                                </a>
                                            ) : (
                                                <p className={styles.infoValue}>{item.displayValue}</p>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </PageContainer>
        </StorefrontLayout>
    );
}
