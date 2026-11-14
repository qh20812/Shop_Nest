import { Head, Link } from '@inertiajs/react';

import { OrderSummary } from '@/components/commerce/OrderSummary';
import { ResultState } from '@/components/feedback/ResultState';
import { PageContainer } from '@/components/layout/PageContainer';
import { StorefrontLayout } from '@/components/layout/StorefrontLayout';
import { Button } from '@/components/ui/button';

interface PaymentResultAction {
    label: string;
    href: string;
    primary?: boolean;
}

interface PaymentResultItem {
    id?: string | number;
    name?: string;
    product_name?: string;
    quantity?: number;
    total_price?: number;
    unit_price?: number;
    price?: number;
    image?: string;
}

interface PaymentResultOrder {
    id?: string | number;
    reference?: string;
    code?: string;
    total?: number;
    total_amount?: number;
    currency?: string;
    payment_method?: string;
    created_at?: string;
    items?: PaymentResultItem[];
}

interface PaymentResultProps {
    provider: string;
    status: string;
    message?: string;
    order?: PaymentResultOrder | null;
    actions?: PaymentResultAction[];
}

const statusConfig = {
    succeeded: {
        result: 'success' as const,
        title: 'Đặt hàng thành công',
        message: 'Shop sẽ xác nhận đơn trong 15 phút. Bạn có thể theo dõi đơn trong mục Đơn hàng.',
    },
    canceled: {
        result: 'pending' as const,
        title: 'Thanh toán đã huỷ',
        message: 'Đơn hàng chưa được thanh toán. Bạn có thể thử lại hoặc chọn phương thức khác.',
    },
    failed: {
        result: 'failure' as const,
        title: 'Thanh toán thất bại',
        message: 'Giao dịch không thành công. Vui lòng kiểm tra lại thông tin hoặc liên hệ hỗ trợ.',
    },
};

export default function PaymentResult({ status, message, order, actions }: PaymentResultProps) {
    const normalized = status?.toLowerCase?.() ?? 'failed';
    const config = statusConfig[normalized as keyof typeof statusConfig] ?? {
        result: 'pending' as const,
        title: 'Đang xử lý thanh toán',
        message: 'Chúng tôi đang kiểm tra giao dịch. Vui lòng quay lại sau ít phút.',
    };

    const orderCode = order?.reference ?? order?.code ?? order?.id;
    const total = order?.total ?? order?.total_amount ?? 0;
    const items = (order?.items ?? []).map((item) => ({
        id: item.id ?? item.name ?? 'item',
        name: item.product_name ?? item.name ?? 'Sản phẩm',
        image: item.image,
        quantity: item.quantity ?? 1,
        price: item.unit_price ?? item.price ?? (item.total_price ? item.total_price / Math.max(1, item.quantity ?? 1) : 0),
    }));

    const fallbackActions: PaymentResultAction[] =
        config.result === 'success'
            ? [
                  { label: 'Xem đơn hàng', href: '/user/orders', primary: true },
                  { label: 'Tiếp tục mua sắm', href: '/' },
              ]
            : [
                  { label: 'Thử lại thanh toán', href: '/checkout', primary: true },
                  { label: 'Về trang chủ', href: '/' },
              ];

    const resolvedActions = actions && actions.length > 0 ? actions : fallbackActions;

    return (
        <StorefrontLayout compactFooter>
            <Head title="Kết quả thanh toán" />

            <PageContainer size="narrow" className="py-section">
                <ResultState
                    status={config.result}
                    orderCode={orderCode}
                    title={config.title}
                    message={message || config.message}
                    actions={resolvedActions.map((action) => (
                        <Button key={`${action.href}-${action.label}`} asChild variant={action.primary ? 'primary' : 'secondary'}>
                            <Link href={action.href}>{action.label}</Link>
                        </Button>
                    ))}
                />

                {order && items.length > 0 && (
                    <div className="mt-10">
                        <OrderSummary
                            items={items}
                            subtotal={total}
                            total={total}
                            showItems
                            trust={order.payment_method ? [`Thanh toán: ${order.payment_method}`, 'Hỗ trợ 24/7'] : ['Hỗ trợ 24/7']}
                            footerNote="Cảm ơn bạn đã mua sắm tại ShopNest."
                        />
                    </div>
                )}
            </PageContainer>
        </StorefrontLayout>
    );
}
