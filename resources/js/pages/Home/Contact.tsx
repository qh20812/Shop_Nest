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

const contactItems = [
    { icon: MapPin, title: 'Địa chỉ', value: 'Số 18, Ngõ 42, Phố Tràng Tiền, Hoàn Kiếm, Hà Nội' },
    { icon: Phone, title: 'Điện thoại', value: '1900 6886', href: 'tel:19006886' },
    { icon: Mail, title: 'Email', value: 'hotro@shopnest.vn', href: 'mailto:hotro@shopnest.vn' },
    { icon: Clock, title: 'Giờ làm việc', value: 'Thứ 2 – Thứ 6: 8:00 – 18:00 · Thứ 7 – CN: 9:00 – 17:00' },
];

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
        <StorefrontLayout compactFooter>
            <Head title="Liên hệ ShopNest" />

            <PageContainer className="py-section">
                <PageHeader
                    eyebrow="Liên hệ"
                    title="Cần hỏi một điều rõ ràng?"
                    description="Gửi tin nhắn hoặc gọi tổng đài. Chúng tôi trả lời trong giờ làm việc."
                />

                <div className="mt-8 grid gap-8 lg:grid-cols-12">
                    <Card className="lg:col-span-7" padding="lg">
                        <Heading level={2} size="headline-2">
                            Gửi tin nhắn
                        </Heading>
                        <Text size="body-sm" tone="muted" className="mt-1">
                            Càng cụ thể càng dễ hỗ trợ.
                        </Text>

                        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                            <Button type="submit" loading={submitting} rightIcon={Send} className="w-full sm:w-fit">
                                Gửi tin nhắn
                            </Button>
                        </form>
                    </Card>

                    <div className="flex flex-col gap-4 lg:col-span-5">
                        {contactItems.map((item) => {
                            const Icon = item.icon;

                            return (
                                <Card key={item.title} variant="inset" padding="md">
                                    <div className="flex items-start gap-3">
                                        <span className="flex size-9 shrink-0 items-center justify-center rounded-control bg-warm-porcelain text-lacquer-red">
                                            <Icon aria-hidden="true" className="size-4" />
                                        </span>
                                        <div>
                                            <h3 className="text-body-sm font-semibold text-ink">{item.title}</h3>
                                            {item.href ? (
                                                <a href={item.href} className="text-body-sm text-ink-muted transition-colors hover:text-lacquer-red">
                                                    {item.value}
                                                </a>
                                            ) : (
                                                <p className="text-body-sm text-ink-muted">{item.value}</p>
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
