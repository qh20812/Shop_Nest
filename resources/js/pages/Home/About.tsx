import { Head } from '@inertiajs/react';
import { CheckCircle2 } from 'lucide-react';

import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { StorefrontLayout } from '@/components/layout/StorefrontLayout';
import { Card } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';

import styles from './About.module.css';

const reasons = [
    'Sáu nhóm ngành thiết yếu cho tổ ấm và đời sống mỗi ngày',
    'Nhà bán được kiểm duyệt hồ sơ và nguồn gốc',
    'Giá và chính sách đổi trả hiển thị rõ trước khi mua',
    'Giao hàng toàn quốc, hỗ trợ khi đơn hàng có vấn đề',
    'Thanh toán Stripe hoặc khi nhận hàng',
];

export default function About() {
    return (
        <StorefrontLayout compactFooter>
            <Head title="Về ShopNest" />

            <PageContainer size="prose" className={styles.page}>
                <PageHeader
                    eyebrow="Về ShopNest"
                    title="Một chợ nhỏ, vận hành như một cuốn sổ kỹ."
                    description="ShopNest là sàn thương mại điện tử tuyển chọn cho tổ ấm Việt: đa ngành, nhưng không bán tràn lan."
                />

                <div className={styles.content}>
                    <Card padding="lg">
                        <div className={styles.cardBody}>
                            <Heading level={2} size="headline-2">
                                Sứ mệnh của chúng tôi
                            </Heading>
                            <Text size="body-md" tone="muted">
                                Giúp người Việt chọn đúng món đồ cho nhà mình mà không phải đánh đổi sự rõ ràng. Chúng tôi kết nối người mua với những
                                nhà bán tử tế, minh bạch nguồn gốc và đồng hành đến khi kiện hàng tới tay.
                            </Text>
                        </div>
                    </Card>

                    <div>
                        <Heading level={2} size="headline-2">
                            Vì sao chọn ShopNest?
                        </Heading>
                        <ul className={styles.reasons}>
                            {reasons.map((reason) => (
                                <li key={reason} className={styles.reason}>
                                    <CheckCircle2 aria-hidden="true" className={styles.reasonIcon} />
                                    <span>{reason}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <Card variant="inset" padding="lg">
                        <div className={styles.cardBody}>
                            <Heading level={3} size="headline-3">
                                Cách chúng tôi tuyển chọn
                            </Heading>
                            <Text size="body-md" tone="muted">
                                Mỗi nhóm ngành có bộ tiêu chí riêng: điện tử cần bảo hành và cấu hình rõ; gia dụng cần công suất và dung tích; mẹ & bé
                                cần tiêu chuẩn an toàn; thời trang và làm đẹp cần chất liệu, size và hạn dùng. Cùng một hệ thống, khác nhau ở thông
                                tin cần thiết.
                            </Text>
                        </div>
                    </Card>
                </div>
            </PageContainer>
        </StorefrontLayout>
    );
}
