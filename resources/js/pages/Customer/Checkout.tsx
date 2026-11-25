import { Head, Link, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { Banknote, CreditCard, MapPin, Plus, ShieldCheck, Truck } from 'lucide-react';
import * as React from 'react';

import CheckoutAddressForm, { type NewAddress } from '@/components/commerce/CheckoutAddressForm';
import CheckoutExitConfirmation from '@/components/commerce/CheckoutExitConfirmation';
import { CheckoutStepper } from '@/components/commerce/CheckoutStepper';
import { OrderSummary } from '@/components/commerce/OrderSummary';
import { PaymentOption } from '@/components/commerce/PaymentOption';
import { PromoField } from '@/components/commerce/PromoField';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { StorefrontLayout } from '@/components/layout/StorefrontLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { FormField } from '@/components/ui/form-field';
import { RadioCard } from '@/components/ui/radio-card';
import Textarea from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toast';
import { Heading, Text } from '@/components/ui/typography';
import { formatVnd } from '@/lib/format';
import { useTranslation } from '@/lib/i18n';
import { resolveLocalizedString, type LocalizedValue } from '@/utils/localization';
import { toNumericPrice, type PriceLike } from '@/utils/price';

import styles from './customer.module.css';

interface ProductImage {
    id: number;
    image_path: string;
}

interface Product {
    id: number;
    name: LocalizedValue;
    slug: string;
    images: ProductImage[];
}

interface Variant {
    id: number;
    sku: string;
    size?: LocalizedValue;
    color?: LocalizedValue;
    price: PriceLike;
    discount_price?: PriceLike;
    product: Product;
}

interface CartItem {
    id: number;
    product_name: LocalizedValue;
    quantity: number;
    price: PriceLike;
    discount_price?: PriceLike;
    total_price: PriceLike;
    variant?: Variant;
}

interface Address {
    id: number;
    name: string;
    phone: string;
    address: string;
    province: string;
    district?: string | null;
    ward: string;
    is_default: boolean;
}

interface PaymentMethod {
    id: string;
    name: string;
    description: string;
}

interface OrderItem {
    id: number;
    product_name: LocalizedValue;
    variant_name: LocalizedValue;
    quantity: number;
    unit_price: PriceLike;
    total_price: PriceLike;
    image?: string;
}

interface Order {
    order_id: number;
    order_number: string;
    status: string;
    created_at: string;
}

interface Totals {
    subtotal: number;
    shipping_fee: number;
    discount_amount: number;
    total: number;
}

interface PageProps {
    cartItems?: CartItem[];
    order?: Order;
    orderItems?: OrderItem[];
    totals?: Totals;
    subtotal?: number;
    shipping?: number;
    discount?: number;
    total?: number;
    addresses?: Address[];
    paymentMethods?: PaymentMethod[];
    promotion?: { code: string; discount?: number } | null;
    [key: string]: unknown;
}

const PAYMENT_METHOD_FALLBACK: PaymentMethod[] = [
    { id: 'stripe', name: 'Stripe - Thẻ quốc tế', description: 'Thanh toán bằng thẻ Visa, Mastercard hoặc JCB' },
    { id: 'cod', name: 'Thanh toán khi nhận hàng', description: 'Thanh toán bằng tiền mặt khi nhận hàng' },
];

function formatAddress(address: Address): string {
    return [address.address, address.ward, address.district, address.province].filter(Boolean).join(', ');
}

export default function Checkout() {
    const pageProps = usePage<PageProps>().props;
    const { success, error: showError } = useToast();
    const { locale } = useTranslation();

    const cartItems = pageProps.cartItems ?? [];
    const orderItems = pageProps.orderItems ?? [];
    const order = pageProps.order;
    const totals = pageProps.totals;
    const promotion = pageProps.promotion ?? null;
    const addresses = React.useMemo(() => (Array.isArray(pageProps.addresses) ? pageProps.addresses : []), [pageProps.addresses]);
    const isBuyNowCheckout = Boolean(order && orderItems.length > 0 && totals);
    const items = isBuyNowCheckout ? orderItems : cartItems;

    const finalSubtotal = isBuyNowCheckout ? (totals?.subtotal ?? 0) : (pageProps.subtotal ?? 0);
    const finalShipping = isBuyNowCheckout ? (totals?.shipping_fee ?? 0) : (pageProps.shipping ?? 0);
    const finalDiscount = isBuyNowCheckout ? (totals?.discount_amount ?? 0) : (pageProps.discount ?? 0);
    const finalTotal = isBuyNowCheckout ? (totals?.total ?? 0) : (pageProps.total ?? 0);

    const availablePaymentMethods = React.useMemo<PaymentMethod[]>(
        () => (Array.isArray(pageProps.paymentMethods) && pageProps.paymentMethods.length > 0 ? pageProps.paymentMethods : PAYMENT_METHOD_FALLBACK),
        [pageProps.paymentMethods],
    );

    const [selectedAddress, setSelectedAddress] = React.useState(() => {
        const defaultAddress = addresses.find((address) => address.is_default) ?? addresses[0];
        return defaultAddress?.id ?? 0;
    });
    const [selectedPayment, setSelectedPayment] = React.useState(() => availablePaymentMethods[0]?.id ?? '');
    const [promoCode, setPromoCode] = React.useState('');
    const [appliedPromo, setAppliedPromo] = React.useState(promotion);
    const [orderNotes, setOrderNotes] = React.useState('');
    const [processing, setProcessing] = React.useState(false);
    const [applyingPromo, setApplyingPromo] = React.useState(false);
    const [promoError, setPromoError] = React.useState<string | null>(null);
    const [showAddressModal, setShowAddressModal] = React.useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);

    React.useEffect(() => {
        if (addresses.length === 0) {
            setSelectedAddress(0);
            return;
        }

        if (!addresses.some((address) => address.id === selectedAddress)) {
            const fallback = addresses.find((address) => address.is_default) ?? addresses[0];
            setSelectedAddress(fallback?.id ?? 0);
        }
    }, [addresses, selectedAddress]);

    React.useEffect(() => {
        if (!availablePaymentMethods.some((method) => method.id === selectedPayment)) {
            setSelectedPayment(availablePaymentMethods[0]?.id ?? '');
        }
    }, [availablePaymentMethods, selectedPayment]);

    React.useEffect(() => {
        setHasUnsavedChanges(Boolean(orderNotes.trim() || promoCode.trim()));
    }, [orderNotes, promoCode]);

    React.useEffect(() => {
        setAppliedPromo(promotion);
    }, [promotion]);

    const getProductImage = (item: CartItem | OrderItem): string => {
        if ('variant' in item && item.variant?.product?.images) {
            const image = item.variant.product.images[0];
            return image ? `/storage/${image.image_path}` : '/image/default-product.png';
        }

        if ('image' in item) {
            return item.image || '/image/default-product.png';
        }

        return '/image/default-product.png';
    };

    const getVariantText = (item: CartItem | OrderItem): string => {
        if ('variant' in item && item.variant) {
            const parts: string[] = [];
            const color = item.variant.color ? resolveLocalizedString(item.variant.color, locale) : '';
            const size = item.variant.size ? resolveLocalizedString(item.variant.size, locale) : '';

            if (color) parts.push(color);
            if (size) parts.push(size);

            return parts.length > 0 ? parts.join(' / ') : item.variant.sku;
        }

        return 'variant_name' in item ? resolveLocalizedString(item.variant_name, locale) : '';
    };

    const getItemName = (item: CartItem | OrderItem): string => resolveLocalizedString(item.product_name, locale) || 'Sản phẩm';

    const getItemPrice = (item: CartItem | OrderItem): number => {
        if ('variant' in item && item.variant) {
            if (item.variant.discount_price !== null && item.variant.discount_price !== undefined) {
                return toNumericPrice(item.variant.discount_price);
            }

            if (item.variant.price !== null && item.variant.price !== undefined) {
                return toNumericPrice(item.variant.price);
            }
        }

        if ('unit_price' in item) {
            return toNumericPrice(item.unit_price);
        }

        return toNumericPrice(item.total_price) / Math.max(1, item.quantity);
    };

    const handleApplyPromo = async () => {
        if (!promoCode.trim()) return;

        setApplyingPromo(true);
        setPromoError(null);

        try {
            const response = await axios.post('/cart/apply-promotion', { code: promoCode.trim() });
            if (response.data?.success === false) {
                setPromoError(response.data?.message || 'Mã khuyến mãi không hợp lệ.');
                return;
            }

            setAppliedPromo(response.data?.promotion ?? { code: promoCode.trim() });
            setPromoCode('');
            success('Đã áp dụng mã khuyến mãi');
            router.reload();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setPromoError(error.response?.data?.message || 'Mã khuyến mãi không hợp lệ.');
            } else {
                setPromoError('Không thể áp dụng mã khuyến mãi.');
            }
        } finally {
            setApplyingPromo(false);
        }
    };

    const handleRemovePromo = async () => {
        try {
            await axios.post('/cart/remove-promotion');
            setAppliedPromo(null);
            success('Đã bỏ mã khuyến mãi');
            router.reload();
        } catch {
            showError('Không thể bỏ mã khuyến mãi');
        }
    };

    const handleAddAddress = async (newAddress: NewAddress) => {
        try {
            // AddressController::store redirects to the address list, so axios follows the
            // redirect and resolves on success. Inertia would navigate away from checkout.
            await axios.post('/user/addresses', {
                ...newAddress,
                country: 'Việt Nam',
            });

            setShowAddressModal(false);
            success('Đã thêm địa chỉ giao hàng');
            router.reload({ only: ['addresses'] });
        } catch (error) {
            const message = axios.isAxiosError(error) ? (error.response?.data?.message as string | undefined) : undefined;
            showError('Không thể thêm địa chỉ', message);
        }
    };

    const handleCheckout = async () => {
        if (!isBuyNowCheckout) {
            if (addresses.length === 0 || !selectedAddress) {
                showError('Vui lòng thêm và chọn địa chỉ giao hàng');
                return;
            }
        }

        if (!selectedPayment) {
            showError('Vui lòng chọn phương thức thanh toán');
            return;
        }

        setProcessing(true);
        setHasUnsavedChanges(false);

        try {
            const endpoint = isBuyNowCheckout && order ? `/buy-now/checkout/${order.order_id}` : '/checkout';
            const payload: Record<string, unknown> = { provider: selectedPayment };

            if (!isBuyNowCheckout && selectedAddress && selectedAddress !== 0) {
                payload.address_id = selectedAddress;
            }

            if (!isBuyNowCheckout && orderNotes.trim()) {
                payload.notes = orderNotes.trim();
            }

            const response = await axios.post(endpoint, payload);

            if (response.data?.success && response.data?.payment_url) {
                window.location.href = response.data.payment_url;
                return;
            }

            showError(response.data?.message || 'Không thể xử lý thanh toán.');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                showError('Không thể xử lý thanh toán', error.response?.data?.message);
            } else {
                showError('Đã xảy ra lỗi không xác định');
            }
        } finally {
            setProcessing(false);
        }
    };

    if (items.length === 0) {
        return (
            <StorefrontLayout compactFooter>
                <Head title="Thanh toán" />
                <PageContainer className={styles.pageTight}>
                    <EmptyState
                        icon={MapPin}
                        title="Chưa có món nào để thanh toán"
                        description="Giỏ hàng của bạn đang trống. Chọn một món cho tổ ấm nhé."
                        actions={
                            <Button asChild>
                                <Link href="/">Xem chợ hôm nay</Link>
                            </Button>
                        }
                    />
                </PageContainer>
            </StorefrontLayout>
        );
    }

    const summaryItems = items.map((item) => ({
        id: item.id,
        name: getItemName(item),
        image: getProductImage(item),
        variant: getVariantText(item),
        quantity: item.quantity,
        price: getItemPrice(item),
    }));

    return (
        <StorefrontLayout compactFooter>
            <Head title="Thanh toán" />

            <PageContainer className={styles.page}>
                <PageHeader
                    breadcrumbs={[{ label: 'Chợ', href: '/' }, { label: 'Giỏ hàng', href: '/cart' }, { label: 'Thanh toán' }]}
                    eyebrow="Bước cuối"
                    title="Hoàn tất đơn hàng"
                    description="Kiểm tra địa chỉ, phương thức thanh toán và tổng tiền trước khi đặt."
                    count={`${items.length} món`}
                />

                <CheckoutStepper
                    className={styles.stepperOffset}
                    current={1}
                    steps={[{ label: 'Giỏ hàng', state: 'done' }, { label: 'Thông tin và thanh toán' }, { label: 'Hoàn tất' }]}
                />

                <div className={styles.checkoutGrid}>
                    <div className={styles.checkoutMain}>
                        <section className={styles.checkSection}>
                            <div className={styles.sectionHead}>
                                <Heading level={2} size="headline-3">
                                    Địa chỉ giao hàng
                                </Heading>
                                <Button variant="ghost" size="sm" leftIcon={Plus} onClick={() => setShowAddressModal(true)}>
                                    Thêm địa chỉ
                                </Button>
                            </div>

                            {addresses.length === 0 ? (
                                <Card variant="inset" padding="md">
                                    <Text size="body-sm" tone="muted">
                                        Bạn chưa có địa chỉ giao hàng. Thêm địa chỉ để tiếp tục.
                                    </Text>
                                </Card>
                            ) : (
                                <div className={styles.addressList}>
                                    {addresses.map((address) => (
                                        <RadioCard
                                            key={address.id}
                                            name="address"
                                            value={String(address.id)}
                                            checked={selectedAddress === address.id}
                                            onChange={() => setSelectedAddress(address.id)}
                                            title={
                                                <span className={styles.addressTitle}>
                                                    {address.name}
                                                    <span className={styles.addressPhone}>{address.phone}</span>
                                                    {address.is_default ? (
                                                        <Badge tone="success" size="sm">
                                                            Mặc định
                                                        </Badge>
                                                    ) : null}
                                                </span>
                                            }
                                            description={formatAddress(address)}
                                        />
                                    ))}
                                </div>
                            )}
                        </section>

                        <section className={styles.checkSection}>
                            <div className={styles.sectionHeadSimple}>
                                <Heading level={2} size="headline-3">
                                    Phương thức vận chuyển
                                </Heading>
                            </div>
                            <Card variant="inset" padding="md">
                                <div className={styles.shipRow}>
                                    <Truck aria-hidden="true" className={styles.shipIcon} />
                                    <div className={styles.shipBody}>
                                        <span className={styles.shipTitle}>Giao tiêu chuẩn</span>
                                        <span className={styles.shipText}>Đơn vị vận chuyển được chỉ định theo địa chỉ.</span>
                                    </div>
                                    <span className={styles.shipPrice}>{finalShipping > 0 ? formatVnd(finalShipping) : 'Miễn phí'}</span>
                                </div>
                            </Card>
                        </section>

                        <section className={styles.checkSection}>
                            <div className={styles.sectionHeadSimple}>
                                <Heading level={2} size="headline-3">
                                    Phương thức thanh toán
                                </Heading>
                            </div>
                            <div className={styles.addressList}>
                                {availablePaymentMethods.map((method) => (
                                    <PaymentOption
                                        key={method.id}
                                        value={method.id}
                                        selected={selectedPayment === method.id}
                                        onChange={setSelectedPayment}
                                        title={method.name}
                                        description={method.description}
                                        icon={method.id === 'stripe' ? CreditCard : Banknote}
                                        marks={method.id === 'stripe' ? ['visa', 'mastercard', 'jcb', 'stripe'] : ['cod']}
                                    />
                                ))}
                            </div>
                            <div className={styles.secureNote}>
                                <ShieldCheck aria-hidden="true" className={styles.secureIcon} />
                                Thông tin thanh toán được mã hóa và xử lý an toàn.
                            </div>
                        </section>

                        <section>
                            <FormField label="Ghi chú giao hàng (tuỳ chọn)" hint="Ví dụ: Gọi trước khi giao, gửi bảo vệ toà nhà.">
                                <Textarea
                                    rows={3}
                                    value={orderNotes}
                                    onChange={(event) => setOrderNotes(event.target.value)}
                                    placeholder="Ghi chú cho shop hoặc bưu tá"
                                    maxLength={300}
                                    counter
                                />
                            </FormField>
                        </section>
                    </div>

                    <div className={styles.checkoutAside}>
                        <OrderSummary
                            items={summaryItems}
                            subtotal={finalSubtotal}
                            discount={finalDiscount}
                            shipping={finalShipping}
                            shippingLabel={finalShipping > 0 ? formatVnd(finalShipping) : 'Miễn phí'}
                            total={finalTotal}
                            promotion={
                                <PromoField
                                    value={promoCode}
                                    onChange={setPromoCode}
                                    onApply={handleApplyPromo}
                                    onRemove={handleRemovePromo}
                                    appliedCode={appliedPromo?.code}
                                    appliedLabel={appliedPromo ? `- Giảm ${formatVnd(finalDiscount)}` : undefined}
                                    error={promoError}
                                    loading={applyingPromo}
                                />
                            }
                            ctaLabel="Đặt hàng"
                            onCheckout={handleCheckout}
                            loading={processing}
                            disabled={(!isBuyNowCheckout && (!selectedAddress || addresses.length === 0)) || !selectedPayment}
                            trust={['Thanh toán bảo mật', 'Đổi trả theo chính sách']}
                            footerNote="Bằng cách đặt hàng, bạn đồng ý với Điều khoản và Chính sách bảo mật."
                        />
                    </div>
                </div>
            </PageContainer>

            <Dialog
                open={showAddressModal}
                onOpenChange={setShowAddressModal}
                title="Thêm địa chỉ giao hàng"
                description="Địa chỉ rõ ràng giúp đơn hàng tới đúng nơi."
                size="lg"
            >
                <CheckoutAddressForm onSubmit={handleAddAddress} onCancel={() => setShowAddressModal(false)} />
            </Dialog>

            <CheckoutExitConfirmation hasUnsavedChanges={hasUnsavedChanges} />
        </StorefrontLayout>
    );
}
