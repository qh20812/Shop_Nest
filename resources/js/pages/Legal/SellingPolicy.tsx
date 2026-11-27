import { Head } from '@inertiajs/react';

import { StorefrontLayout } from '@/components/layout/StorefrontLayout';
import { LegalDocument } from '@/components/storefront/LegalDocument';
import { useTranslation } from '@/lib/i18n';

export default function SellingPolicy() {
    const { t } = useTranslation();

    return (
        <StorefrontLayout compactFooter>
            <Head title={t('Seller policy')} />

            <LegalDocument
                title={t('Seller policy')}
                description={t('Rules for sellers operating on ShopNest.')}
                sections={[
                    {
                        heading: '1. Điều kiện mở shop',
                        body: 'Người bán cần cung cấp hồ sơ hợp lệ, thông tin liên hệ chính xác và cam kết tuân thủ quy định của ShopNest.',
                    },
                    {
                        heading: '2. Đăng sản phẩm',
                        body: 'Sản phẩm phải được mô tả đúng thực tế, có nguồn gốc hợp pháp và không thuộc danh mục bị cấm.',
                    },
                    {
                        heading: '3. Giá và phí',
                        body: 'Người bán tự đặt giá bán và chịu trách nhiệm về các khoản phí phát sinh theo thỏa thuận với ShopNest.',
                    },
                    {
                        heading: '4. Xử lý đơn hàng',
                        body: 'Đơn hàng cần được xác nhận và đóng gói đúng thời hạn. Chậm xử lý hoặc huỷ đơn không hợp lý có thể ảnh hưởng đến quyền bán hàng.',
                    },
                    {
                        heading: '5. Chăm sóc khách hàng',
                        body: 'Người bán cần phản hồi câu hỏi, xử lý đổi trả và hoàn tiền theo chính sách đã công bố.',
                    },
                    {
                        heading: '6. Hành vi bị cấm',
                        body: 'Không gian lận, spam, bán hàng giả hoặc xâm phạm quyền sở hữu trí tuệ của bên khác.',
                    },
                    {
                        heading: '7. Chấm dứt hợp tác',
                        body: 'ShopNest có thể tạm ngưng hoặc chấm dứt quyền bán hàng nếu phát hiện vi phạm nghiêm trọng hoặc lặp lại.',
                    },
                ]}
            />
        </StorefrontLayout>
    );
}
