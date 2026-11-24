import { Head } from '@inertiajs/react';
import { Clock, Mail, MapPin, Phone, Send } from 'lucide-react';
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

import styles from './Contact.module.css';

const contactItems = [
    { icon: MapPin, title: 'Địa chỉ', value: 'Tầng 5 Tòa nhà Emporium, 184 Lê Đại Hành, Phường 15, Quận 11, TP. Hồ Chí Minh' },
    { icon: Phone, title: 'Điện thoại', value: '1900 6886', href: 'tel:19006886' },
    { icon: Mail, title: 'Email', value: 'hotro@shopnest.vn', href: 'mailto:hotro@shopnest.vn' },
    { icon: Clock, title: 'Giờ làm việc', value: 'Thứ 2 - Thứ 6: 8:00 - 18:00, Thứ 7 - CN: 9:00 - 17:00' },
];

const insetCardVariant = 'inset' as const;

export default function Contact() {
    const { success } = useToast();
    const [submitting, setSubmitting] = React.useState(false);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        setSubmitting(true);
        window.setTimeout(() => {
            setSubmitting(false);
            success('Đã gửi tin nhắn', 'ShopNest sẽ phản hồi trong giờ làm việc.');
            form.reset();
        }, 500);
    };

    return (
        <StorefrontLayout compactFooter pinLight={false}>
            <Head title="Liên hệ ShopNest" />

            <PageContainer className={styles.page}>
                <PageHeader
                    eyebrow="Liên hệ"
                    title="Cần hỏi một điều rõ ràng?"
                    description="Gửi tin nhắn hoặc gọi tổng đài. Chúng tôi trả lời trong giờ làm việc."
                />

                <div className={styles.grid}>
                    <Card className={styles.formCard} padding="lg">
                        <Heading level={2} size="headline-2">
                            Gửi tin nhắn
                        </Heading>
                        <Text size="body-sm" tone="muted">
                            Càng cụ thể càng dễ hỗ trợ.
                        </Text>

                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formGrid}>
                                <FormField label="Họ và tên" required>
                                    <Input placeholder="Nguyễn Thu Hà" autoComplete="name" required />
                                </FormField>
                                <FormField label="Email" required>
                                    <Input type="email" placeholder="ban@example.com" autoComplete="email" required />
                                </FormField>
                            </div>
                            <FormField label="Chủ đề" required>
                                <Input placeholder="Ví dụ: Kiểm tra đơn hàng #SN-24817" required />
                            </FormField>
                            <FormField label="Nội dung" required>
                                <Textarea rows={5} placeholder="Bạn cần ShopNest hỗ trợ điều gì?" required />
                            </FormField>
                            <div className={styles.formActions}>
                                <Button type="submit" loading={submitting} rightIcon={Send}>
                                    Gửi tin nhắn
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
                                                    {item.value}
                                                </a>
                                            ) : (
                                                <p className={styles.infoValue}>{item.value}</p>
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
