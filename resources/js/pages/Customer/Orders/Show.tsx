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
import { useMoney } from '@/hooks/useMoney';
import { cx } from '@/lib/cx';
import { useTranslation } from '@/lib/i18n';
import { backendOrderStatusLabel, normalizeOrderStatus, paymentStatusKey, paymentStatusTone } from '@/lib/status';

import styles from '../customer.module.css';

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

const stepDefinitionKeys = [
    { key: 'placed', labelKey: 'Order placed', descriptionKey: 'ShopNest received your order.' },
    { key: 'confirmed', labelKey: 'Shop confirmed', descriptionKey: 'The seller is preparing your items.' },
    { key: 'shipping', labelKey: 'Delivering', descriptionKey: 'The order has been handed to the carrier.' },
    { key: 'delivered', labelKey: 'Delivered', descriptionKey: 'The order arrived at the shipping address.' },
];

function currentStep(status: string): number {
    if (['delivered', 'completed'].includes(status)) return 3;
    if (['assigned_to_shipper', 'delivering', 'shipped'].includes(status)) return 2;
    if (['processing', 'pending_assignment'].includes(status)) return 1;
    return 0;
}

export default function OrderShow({ order }: ShowProps) {
    const { money } = useMoney();
    const { t } = useTranslation();
    const resolvedSteps: TimelineStep[] = stepDefinitionKeys.map((step) => ({
        key: step.key,
        label: t(step.labelKey),
        description: t(step.descriptionKey),
    }));
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
                onSuccess: () => success(t('Items added back to your cart')),
                onError: () => showError(t('Could not reorder this order')),
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
                    success(t('Order cancelled'));
                },
                onError: () => showError(t('Could not cancel the order')),
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
                    success(t('Thanks for reviewing your order'));
                },
                onError: () => showError(t('Could not submit the review')),
                onFinish: () => setReviewProcessing(false),
            },
        );
    };

    return (
        <AccountLayout
            active="orders"
            breadcrumbs={[{ label: t('Market'), href: '/' }, { label: t('Orders'), href: '/user/orders' }, { label: order.code }]}
            eyebrow={t('Order details')}
            title={order.code}
            description={order.created_at ? t('Placed at :time', { time: order.created_at }) : undefined}
            actions={
                <div className={styles.badgeRow}>
                    <Button variant="secondary" size="sm" leftIcon={ArrowLeft} asChild>
                        <Link href="/user/orders">{t('Order list')}</Link>
                    </Button>
                    <Button variant="outline" size="sm" leftIcon={RefreshCw} onClick={handleReorder}>
                        {t('Reorder')}
                    </Button>
                    {order.can_cancel ? (
                        <Button variant="destructive" size="sm" leftIcon={XCircle} onClick={() => setCancelOpen(true)}>
                            {t('Cancel order')}
                        </Button>
                    ) : null}
                </div>
            }
        >
            <Head title={t('Order :code', { code: order.code })} />

            <div className={styles.orderGrid}>
                <div className={styles.orderMain}>
                    {isCancelled || isReturned ? (
                        <Alert
                            tone={isCancelled ? 'danger' : 'warning'}
                            title={isCancelled ? t('Order cancelled') : t('Order is being returned')}
                            description={
                                isCancelled
                                    ? t('This order cannot be delivered. If you already paid, the refund follows policy.')
                                    : t('Your return request is being handled by the shop. We will notify you when it changes.')
                            }
                        />
                    ) : null}

                    <Card padding="lg" className={styles.cardStack}>
                        <div className={styles.cardHead}>
                            <Heading level={2} size="headline-3">
                                {t('Order progress')}
                            </Heading>
                            <div className={styles.badgeRow}>
                                <OrderStatusBadge status={normalizedStatus} label={backendOrderStatusLabel(order.status, t)} />
                                <Badge tone={paymentStatusTone[order.payment_status] ?? 'neutral'} dot>
                                    {t(paymentStatusKey[order.payment_status] ?? order.payment_status)}
                                </Badge>
                            </div>
                        </div>

                        <OrderTimeline steps={resolvedSteps} current={currentStep(order.status)} tone={timelineTone} />
                    </Card>

                    <Card padding="lg" className={styles.cardStackTight}>
                        <div className={styles.cardHead}>
                            <Heading level={2} size="headline-3">
                                {t('Products')}
                            </Heading>
                            <span className={styles.metaCode}>{t(':count products', { count: order.items.length })}</span>
                        </div>

                        <div>
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

                    {canReview ? (
                        <Card padding="lg" className={styles.cardStackTight}>
                            <div className={styles.cardHeadPlain}>
                                <Star aria-hidden="true" className={styles.iconWarning} />
                                <Heading level={2} size="headline-3">
                                    {t('Review your order')}
                                </Heading>
                            </div>

                            <form onSubmit={handleReview} className={styles.reviewForm}>
                                <fieldset className={styles.reviewFieldset}>
                                    <legend className={styles.reviewLegend}>{t('How satisfied are you?')}</legend>
                                    <div className={styles.starRow}>
                                        {[1, 2, 3, 4, 5].map((value) => (
                                            <button
                                                key={value}
                                                type="button"
                                                aria-label={`${value} sao`}
                                                aria-pressed={rating === value}
                                                onClick={() => setRating(value)}
                                                className={styles.starButton}
                                            >
                                                <Star aria-hidden="true" className={cx(styles.star, value <= rating && styles.starActive)} />
                                            </button>
                                        ))}
                                        <span className={styles.ratingValue}>{rating}/5</span>
                                    </div>
                                </fieldset>

                                <FormField label={t('Comment')} hint={t('Share your experience with the product and the shop.')}>
                                    <Textarea
                                        value={comment}
                                        onChange={(event) => setComment(event.target.value)}
                                        rows={4}
                                        maxLength={1000}
                                        counter
                                        placeholder={t('Packaged carefully and delivered on time...')}
                                    />
                                </FormField>

                                <div className={styles.formActions}>
                                    <Button type="submit" loading={reviewProcessing}>
                                        {t('Submit review')}
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    ) : null}

                    {order.reviews.length > 0 ? (
                        <Card padding="lg" className={styles.cardStackTight}>
                            <div className={styles.cardHeadPlain}>
                                <CheckCircle2 aria-hidden="true" className={styles.iconSuccess} />
                                <Heading level={2} size="headline-3">
                                    {t('Your review')}
                                </Heading>
                            </div>

                            {order.reviews.map((review) => (
                                <div key={review.id} className={styles.reviewItem}>
                                    <div className={styles.reviewMeta}>
                                        <Rating value={review.rating} compact showValue={false} />
                                        <span className={styles.reviewTime}>{review.created_at}</span>
                                    </div>
                                    {review.comment ? <p className={styles.reviewComment}>{review.comment}</p> : null}
                                </div>
                            ))}
                        </Card>
                    ) : null}
                </div>

                <aside className={styles.orderAside}>
                    <Card padding="lg" className={cx(styles.cardStackTight, styles.stickyAside)}>
                        <Heading level={2} size="headline-3">
                            {t('Payment summary')}
                        </Heading>

                        <div className={styles.summaryRows}>
                            <div className={styles.summaryLine}>
                                <span>{t('Subtotal')}</span>
                                <span className={styles.summaryValue}>{money(order.subtotal)}</span>
                            </div>
                            <div className={styles.summaryLine}>
                                <span>{t('Shipping fee')}</span>
                                <span className={styles.summaryValue}>{order.shipping_fee > 0 ? money(order.shipping_fee) : t('Free')}</span>
                            </div>
                            {order.discount_total > 0 ? (
                                <div className={styles.summaryLine}>
                                    <span>{t('Discount')}</span>
                                    <span className={cx(styles.summaryValue, styles.summaryValueDiscount)}>-{money(order.discount_total)}</span>
                                </div>
                            ) : null}
                        </div>

                        <div className={styles.summaryTotalRow}>
                            <span className={styles.summaryTotalLabel}>{t('Total')}</span>
                            <span className={styles.summaryTotalValue}>{money(order.total)}</span>
                        </div>

                        <div className={styles.summaryMeta}>
                            <span className={styles.summaryMetaRow}>
                                <CreditCard aria-hidden="true" className={styles.iconFaint} />
                                {t(paymentStatusKey[order.payment_status] ?? order.payment_status)}
                            </span>
                            {order.shipping_address ? (
                                <span className={styles.summaryAddress}>
                                    <MapPin aria-hidden="true" className={styles.iconAccent} />
                                    <span>
                                        <strong className={styles.summaryAddressName}>{order.shipping_address.name}</strong>
                                        <span className={styles.summaryAddressPhone}>{order.shipping_address.phone}</span>
                                        <span className={styles.summaryAddressText}>{order.shipping_address.full_address}</span>
                                    </span>
                                </span>
                            ) : null}
                        </div>

                        <Button variant="secondary" size="sm" leftIcon={RefreshCw} onClick={handleReorder}>
                            {t('Reorder this order')}
                        </Button>
                    </Card>

                    {isCancelled ? (
                        <Alert
                            tone="danger"
                            icon={AlertTriangle}
                            title={t('Need help?')}
                            description={t('Message the shop in chat to check the refund or place a new order.')}
                        />
                    ) : null}
                </aside>
            </div>

            <Dialog
                open={cancelOpen}
                onOpenChange={setCancelOpen}
                title={t('Cancel this order?')}
                description={t('Cancelled orders cannot be restored. If you already paid, the refund follows policy.')}
                size="md"
                footer={
                    <div className={styles.dialogFooter}>
                        <Button variant="secondary" onClick={() => setCancelOpen(false)} disabled={cancelProcessing}>
                            {t('Keep order')}
                        </Button>
                        <Button variant="destructive" loading={cancelProcessing} onClick={handleCancel}>
                            {t('Cancel order')}
                        </Button>
                    </div>
                }
            >
                <FormField label={t('Reason (optional)')} className={styles.dialogField}>
                    <Textarea
                        value={cancelReason}
                        onChange={(event) => setCancelReason(event.target.value)}
                        rows={3}
                        maxLength={500}
                        placeholder={t('e.g. I want to change the shipping address.')}
                    />
                </FormField>
            </Dialog>
        </AccountLayout>
    );
}
