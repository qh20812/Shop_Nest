import { Head } from '@inertiajs/react';

import { StorefrontLayout } from '@/components/layout/StorefrontLayout';
import { LegalDocument } from '@/components/storefront/LegalDocument';

export default function PrivacyPolicy() {
    return (
        <StorefrontLayout compactFooter pinLight={false}>
            <Head title="Chính sách bảo mật" />

            <LegalDocument
                title="Chính sách bảo mật"
                description="Cách ShopNest thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn."
                sections={[
                    {
                        heading: '1. Thông tin chúng tôi thu thập',
                        body: 'Chúng tôi thu thập thông tin bạn cung cấp khi tạo tài khoản, đặt hàng hoặc liên hệ hỗ trợ, bao gồm tên, email, số điện thoại và địa chỉ giao hàng.',
                    },
                    {
                        heading: '2. Mục đích sử dụng',
                        body: 'Thông tin được dùng để xử lý đơn hàng, hỗ trợ khách hàng, cải thiện dịch vụ và gửi thông báo liên quan đến tài khoản hoặc đơn hàng.',
                    },
                    {
                        heading: '3. Chia sẻ thông tin',
                        body: 'Chúng tôi không bán thông tin cá nhân. Thông tin chỉ được chia sẻ với shop, đơn vị vận chuyển hoặc đối tác thanh toán khi cần để hoàn tất đơn hàng.',
                    },
                    {
                        heading: '4. Bảo mật dữ liệu',
                        body: 'Chúng tôi áp dụng các biện pháp bảo mật phù hợp để bảo vệ thông tin khỏi truy cập, thay đổi hoặc tiết lộ trái phép.',
                    },
                    {
                        heading: '5. Quyền của bạn',
                        body: 'Bạn có thể yêu cầu xem, cập nhật hoặc xoá thông tin cá nhân bằng cách liên hệ bộ phận hỗ trợ.',
                    },
                    {
                        heading: '6. Liên hệ',
                        body: 'Nếu có câu hỏi về chính sách này, vui lòng liên hệ hotro@shopnest.vn.',
                    },
                ]}
            />
        </StorefrontLayout>
    );
}
