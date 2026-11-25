import { Head } from '@inertiajs/react';

import { StorefrontLayout } from '@/components/layout/StorefrontLayout';
import { LegalDocument } from '@/components/storefront/LegalDocument';

export default function Terms() {
    return (
        <StorefrontLayout compactFooter>
            <Head title="Điều khoản sử dụng" />

            <LegalDocument
                title="Điều khoản sử dụng"
                description="Các quy định khi bạn dùng ShopNest để mua sắm hoặc bán hàng."
                sections={[
                    {
                        heading: '1. Chấp nhận điều khoản',
                        body: 'Khi truy cập và sử dụng ShopNest, bạn đồng ý tuân theo các điều khoản này. Nếu không đồng ý, vui lòng ngừng sử dụng nền tảng.',
                    },
                    {
                        heading: '2. Tài khoản',
                        body: 'Bạn chịu trách nhiệm bảo mật thông tin đăng nhập và mọi hoạt động phát sinh dưới tài khoản của mình. Thông tin đăng ký cần chính xác và được cập nhật khi thay đổi.',
                    },
                    {
                        heading: '3. Đặt hàng và thanh toán',
                        body: 'Đơn hàng chỉ được xử lý khi thông tin sản phẩm, số lượng và phương thức thanh toán hợp lệ. Giá và ưu đãi được hiển thị tại thời điểm đặt hàng.',
                    },
                    {
                        heading: '4. Vận chuyển và đổi trả',
                        body: 'Thời gian giao hàng phụ thuộc khu vực và đơn vị vận chuyển. Chính sách đổi trả áp dụng theo cam kết của từng shop và quy định của ShopNest.',
                    },
                    {
                        heading: '5. Hành vi bị cấm',
                        body: 'Không sử dụng ShopNest cho mục đích trái pháp luật, gian lận, spam hoặc xâm phạm quyền của người khác.',
                    },
                    {
                        heading: '6. Liên hệ',
                        body: 'Nếu có câu hỏi về điều khoản này, vui lòng liên hệ hotro@shopnest.vn.',
                    },
                ]}
            />
        </StorefrontLayout>
    );
}
