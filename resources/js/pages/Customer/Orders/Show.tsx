import { Head, Link, router } from '@inertiajs/react';
import { AlertTriangle, ArrowLeft, CheckCircle2, CreditCard, MapPin, RefreshCw, Star, XCircle } from 'lucide-react';
import * as React from 'react';

import { OrderItemRow } from '@/components/commerce/OrderItemRow';
import { OrderStatusBadge } from '@/components/commerce/OrderStatusBadge';
import { OrderTimeline, type TimelineStep } from '@/components/commerce/OrderTimeline';
import { Rating } from '@/components/commerce/Rating';
import { AccountLayout } from '@/components/layout/AccountLayout';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { FormField } from '@/components/ui/form-field';
import Textarea from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toast';
import { Heading } from '@/components/ui/typography';
import { formatVnd } from '@/lib/format';
import { backendOrderStatusLabel, normalizeOrderStatus, paymentStatusLabel, paymentStatusTone } from '@/lib/status';
import { cn } from '@/lib/utils';

interface OrderItem {
    id: number;
    product_name: string;
    product_image: string | null;
    sku?: string | null;
    quantity: number;
    price: number;
}

interface OrderReview {
    id: number;
    rating: number;
    comment: string | null;
    created_at: string;
}

interface OrderDetail {
    id: number;
    code: string;
    status: string;
    payment_status: string;
    subtotal: number;
    shipping_fee: number;
    discount_total: number;
    total: number;
    created_at: string | null;
    can_cancel: boolean;
    can_review: boolean;
    shipping_address: {
        name: string;
        phone: string;
        full_address: string;
    } | null;
    items: OrderItem[];
    reviews: OrderReview[];
}

interface ShowProps extends Record<string, unknown> {
    order: OrderDetail;
}

const stepDefinitions: TimelineStep[] = [
    { key: 'placed', label: 'Đặt hàng', description: 'ShopNest đã nhận đơn của bạn.' },
    { key: 'confirmed', label: 'Shop xác nhận', description: 'Người bán đang chuẩn bị món hàng.' },
    { key: 'shipping', label: 'Đang giao', description: 'Đơn đã được giao cho đơn vị vận chuyển.' },
    { key: 'delivered', label: 'Đã giao', description: 'Đơn đã tới địa chỉ giao hàng.' },
];

function currentStep(status: string): number {
    if (['delivered', 'completed'].includes(status)) return 3;
    if (['assigned_to_shipper', 'delivering', 'shipped'].includes(status)) return 2;
    if (['processing', 'pending_assignment'].includes(status)) return 1;
    return 0;
}

export default function OrderShow({ order }: ShowProps) {
    const { success, error: showError } = useToast();
    const [cancelOpen, setCancelOpen] = React.useState(false);
    const [cancelReason, setCancelReason] = React.useState('');
    const [cancelProcessing, setCancelProcessing] = React.useState(false);
    const [rating, setRating] = React.useState(5);
    const [comment, setComment] = React.useState('');
    const [reviewProcessing, setReviewProcessing] = React.useState(false);

    const normalizedStatus = normalizeOrderStatus(order.status);
    const isCancelled = ['cancelled', 'canceled'].includes(order.status);
    const isReturned = order.status.startsWith('returned');
    const timelineTone = isCancelled ? 'cancelled' : isReturned ? 'returned' : 'default';
    const canReview = order.can_review && order.reviews.length === 0;

    const handleReorder = () => {
        router.post(
            `/user/orders/${order.id}/reorder`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => success('Đã thêm lại món vào giỏ'),
                onError: () => showError('Không thể mua lại đơn này'),
            },
        );
    };

    const handleCancel = () => {
        setCancelProcessing(true);
        router.post(
            `/user/orders/${order.id}/cancel`,
            { reason: cancelReason.trim() || undefined },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setCancelOpen(false);
                    setCancelReason('');
                    success('Đã huỷ đơn hàng');
                },
                onError: () => showError('Không thể huỷ đơn hàng'),
                onFinish: () => setCancelProcessing(false),
            },
        );
    };

    const handleReview = (event: React.FormEvent) => {
        event.preventDefault();
        setReviewProcessing(true);
        router.post(
            `/user/orders/${order.id}/review`,
            { rating, comment },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setComment('');
                    success('Cảm ơn bạn đã đánh giá đơn hàng');
                },
                onError: () => showError('Không thể gửi đánh giá'),
                onFinish: () => setReviewProcessing(false),
            },
        );
    };

    return (
        <AccountLayout
            active="orders"
            breadcrumbs={[{ label: 'Chợ', href: '/' }, { label: 'Đơn hàng', href: '/user/orders' }, { label: order.code }]}
            eyebrow="Chi tiết đơn hàng"
            title={order.code}
            description={order.created_at ? `Đặt lúc ${order.created_at}` : undefined}
            actions={
                <div className="flex flex-wrap items-center gap-2">
                    <Button variant="secondary" size="sm" leftIcon={ArrowLeft} asChild>
                        <Link href="/user/orders">Danh sách</Link>
                    </Button>
                    <Button variant="outline" size="sm" leftIcon={RefreshCw} onClick={handleReorder}>
                        Mua lại
                    </Button>
                    {order.can_cancel && (
                        <Button variant="destructive" size="sm" leftIcon={XCircle} onClick={() => setCancelOpen(true)}>
                            Huỷ đơn
                        </Button>
                    )}
                </div>
            }
        >
            <Head title={`Đơn hàng ${order.code}`} />

            <div className="grid gap-6 lg:grid-cols-12">
                <div className="flex flex-col gap-6 lg:col-span-8">
                    {(isCancelled || isReturned) && (
                        <Alert
                            tone={isCancelled ? 'danger' : 'warning'}
                            title={isCancelled ? 'Đơn hàng đã huỷ' : 'Đơn hàng đang trả hàng'}
                            description={
                                isCancelled
                                    ? 'Đơn này không thể tiếp tục giao. Nếu đã thanh toán, khoản hoàn tiền sẽ được xử lý theo chính sách.'
                                    : 'Yêu cầu trả hàng đang được shop xử lý. Bạn sẽ nhận thông báo khi có cập nhật.'
                            }
                        />
                    )}

                    <Card padding="lg" className="flex flex-col gap-5">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <Heading level={2} size="headline-3">
                                Tiến trình đơn hàng
                            </Heading>
                            <div className="flex flex-wrap items-center gap-2">
                                <OrderStatusBadge status={normalizedStatus} label={backendOrderStatusLabel(order.status)} />
                                <Badge tone={paymentStatusTone[order.payment_status] ?? 'neutral'} dot>
                                    {paymentStatusLabel[order.payment_status] ?? order.payment_status}
                                </Badge>
                            </div>
                        </div>

                        <OrderTimeline steps={stepDefinitions} current={currentStep(order.status)} tone={timelineTone} />
                    </Card>

                    <Card padding="lg" className="flex flex-col gap-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <Heading level={2} size="headline-3">
                                Sản phẩm
                            </Heading>
                            <span className="font-mono text-label-code text-ink-muted">{order.items.length} món</span>
                        </div>

                        <div className="flex flex-col">
                            {order.items.map((item) => (
                                <OrderItemRow
                                    key={item.id}
                                    item={{
                                        id: item.id,
                                        name: item.product_name,
                                        image: item.product_image,
                                        variant: item.sku ?? undefined,
                                        quantity: item.quantity,
                                        price: item.price,
                                    }}
                                />
                            ))}
                        </div>
                    </Card>

                    {canReview && (
                        <Card padding="lg" className="flex flex-col gap-4">
                            <div className="flex items-center gap-2">
                                <Star aria-hidden="true" className="size-5 text-turmeric" />
                                <Heading level={2} size="headline-3">
                                    Đánh giá đơn hàng
                                </Heading>
                            </div>

                            <form onSubmit={handleReview} className="flex flex-col gap-4">
                                <fieldset className="flex flex-col gap-2">
                                    <legend className="text-body-sm font-medium text-ink">Chọn mức độ hài lòng</legend>
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((value) => (
                                            <button
                                                key={value}
                                                type="button"
                                                aria-label={`${value} sao`}
                                                aria-pressed={rating === value}
                                                onClick={() => setRating(value)}
                                                className="focus-ring rounded-chip p-1 transition-colors hover:bg-raw-linen"
                                            >
                                                <Star
                                                    aria-hidden="true"
                                                    className={cn('size-6', value <= rating ? 'fill-turmeric text-turmeric' : 'text-ink-faint')}
                                                />
                                            </button>
                                        ))}
                                        <span className="ml-2 font-mono text-label-code text-ink-muted">{rating}/5</span>
                                    </div>
                                </fieldset>

                                <FormField label="Bình luận" hint="Chia sẻ trải nghiệm về sản phẩm và shop.">
                                    <Textarea
                                        value={comment}
                                        onChange={(event) => setComment(event.target.value)}
                                        rows={4}
                                        maxLength={1000}
                                        counter
                                        placeholder="Hàng đóng gói cẩn thận, giao đúng hẹn..."
                                    />
                                </FormField>

                                <div className="flex justify-end">
                                    <Button type="submit" loading={reviewProcessing}>
                                        Gửi đánh giá
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    )}

                    {order.reviews.length > 0 && (
                        <Card padding="lg" className="flex flex-col gap-4">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 aria-hidden="true" className="size-5 text-jade" />
                                <Heading level={2} size="headline-3">
                                    Đánh giá của bạn
                                </Heading>
                            </div>

                            {order.reviews.map((review) => (
                                <div key={review.id} className="flex flex-col gap-2 border-t border-border pt-4 first:border-t-0 first:pt-0">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <Rating value={review.rating} compact showValue={false} />
                                        <span className="font-mono text-label-micro text-ink-faint">{review.created_at}</span>
                                    </div>
                                    {review.comment && <p className="text-body-sm leading-relaxed text-ink-muted">{review.comment}</p>}
                                </div>
                            ))}
                        </Card>
                    )}
                </div>

                <aside className="flex flex-col gap-6 lg:col-span-4">
                    <Card padding="lg" className="flex flex-col gap-4 lg:sticky lg:top-24">
                        <Heading level={2} size="headline-3">
                            Tóm tắt thanh toán
                        </Heading>

                        <div className="flex flex-col gap-2 text-body-sm">
                            <div className="flex items-center justify-between text-ink-muted">
                                <span>Tạm tính</span>
                                <span className="font-mono text-ink">{formatVnd(order.subtotal)}</span>
                            </div>
                            <div className="flex items-center justify-between text-ink-muted">
                                <span>Phí vận chuyển</span>
                                <span className="font-mono text-ink">{order.shipping_fee > 0 ? formatVnd(order.shipping_fee) : 'Miễn phí'}</span>
                            </div>
                            {order.discount_total > 0 && (
                                <div className="flex items-center justify-between text-ink-muted">
                                    <span>Giảm giá</span>
                                    <span className="font-mono text-lacquer-red">-{formatVnd(order.discount_total)}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex items-baseline justify-between border-t border-border pt-4">
                            <span className="text-body-md font-semibold text-ink">Tổng cộng</span>
                            <span className="font-mono text-headline-3 font-bold text-ink">{formatVnd(order.total)}</span>
                        </div>

                        <div className="flex flex-col gap-2 border-t border-border pt-4 text-body-sm text-ink-muted">
                            <span className="inline-flex items-center gap-2">
                                <CreditCard aria-hidden="true" className="size-4 text-ink-faint" />
                                {paymentStatusLabel[order.payment_status] ?? order.payment_status}
                            </span>
                            {order.shipping_address && (
                                <span className="inline-flex items-start gap-2">
                                    <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-lacquer-red" />
                                    <span>
                                        <strong className="block font-medium text-ink">{order.shipping_address.name}</strong>
                                        <span className="font-mono text-label-micro">{order.shipping_address.phone}</span>
                                        <span className="mt-1 block">{order.shipping_address.full_address}</span>
                                    </span>
                                </span>
                            )}
                        </div>

                        <Button variant="secondary" size="sm" leftIcon={RefreshCw} onClick={handleReorder} className="mt-1">
                            Mua lại đơn này
                        </Button>
                    </Card>

                    {isCancelled && (
                        <Alert
                            tone="danger"
                            icon={AlertTriangle}
                            title="Cần hỗ trợ?"
                            description="Liên hệ shop trong mục chat để được kiểm tra hoàn tiền hoặc tạo đơn mới."
                        />
                    )}
                </aside>
            </div>

            <Dialog
                open={cancelOpen}
                onOpenChange={setCancelOpen}
                title="Huỷ đơn hàng?"
                description="Đơn đã huỷ không thể khôi phục. Nếu đã thanh toán, khoản hoàn tiền sẽ được xử lý theo chính sách."
                size="md"
                footer={
                    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                        <Button variant="secondary" onClick={() => setCancelOpen(false)} disabled={cancelProcessing}>
                            Giữ đơn
                        </Button>
                        <Button variant="destructive" loading={cancelProcessing} onClick={handleCancel}>
                            Huỷ đơn
                        </Button>
                    </div>
                }
            >
                <FormField label="Lý do (tuỳ chọn)" className="mt-4">
                    <Textarea
                        value={cancelReason}
                        onChange={(event) => setCancelReason(event.target.value)}
                        rows={3}
                        maxLength={500}
                        placeholder="Ví dụ: Muốn đổi địa chỉ giao hàng."
                    />
                </FormField>
            </Dialog>
        </AccountLayout>
    );
}
