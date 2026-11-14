import { Head, Link, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { ArrowLeft, RefreshCw, ShoppingBag } from 'lucide-react';
import * as React from 'react';

import { CartLine } from '@/components/commerce/CartLine';
import { OrderSummary } from '@/components/commerce/OrderSummary';
import { PromoField } from '@/components/commerce/PromoField';
import { ConfirmDialog } from '@/components/feedback/ConfirmDialog';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { StorefrontLayout } from '@/components/layout/StorefrontLayout';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { EmptyState } from '@/components/ui/empty-state';
import { useToast } from '@/components/ui/toast';
import { formatVnd } from '@/lib/format';

interface CartItem {
    cart_item_id: number;
    variant_id: number;
    quantity: number;
    price: number;
    discount_price?: number;
    subtotal: number;
    variant: {
        variant_id: number;
        sku: string;
        price: number;
        discount_price?: number;
        stock_quantity: number;
        available_quantity: number;
        reserved_quantity: number;
        product: {
            product_id: number;
            name: string;
            images?: Array<{ image_url: string }>;
        } | null;
    };
}

interface Promotion {
    promotion_id: number;
    code: string;
    type: number;
    value: number;
    min_order_amount?: number;
    max_discount_amount?: number;
}

interface Totals {
    subtotal: number;
    discount: number;
    total: number;
    shipping: number;
}

interface PageProps {
    cartItems: CartItem[];
    totals: Totals;
    promotion: Promotion | null;
    [key: string]: unknown;
}

function normalizeImage(src?: string | null): string {
    if (!src) return '/image/default-product.png';
    if (/^https?:\/\//.test(src) || src.startsWith('/')) return src;
    return `/storage/${src}`;
}

export default function Cart() {
    const { cartItems, totals, promotion } = usePage<PageProps>().props;
    const { success, error: showError } = useToast();
    const [selectedItems, setSelectedItems] = React.useState<number[]>(cartItems.map((item) => item.cart_item_id));
    const [quantities, setQuantities] = React.useState<Record<number, number>>(
        cartItems.reduce((acc, item) => ({ ...acc, [item.cart_item_id]: item.quantity }), {}),
    );
    const [couponCode, setCouponCode] = React.useState('');
    const [promoError, setPromoError] = React.useState<string | null>(null);
    const [applyingPromo, setApplyingPromo] = React.useState(false);
    const [updating, setUpdating] = React.useState(false);
    const [pendingDelete, setPendingDelete] = React.useState<number[] | null>(null);
    const [deleting, setDeleting] = React.useState(false);

    React.useEffect(() => {
        setSelectedItems(cartItems.map((item) => item.cart_item_id));
        setQuantities(cartItems.reduce((acc, item) => ({ ...acc, [item.cart_item_id]: item.quantity }), {}));
    }, [cartItems]);

    const isAllSelected = cartItems.length > 0 && selectedItems.length === cartItems.length;

    const handleSelectAll = (checked: boolean) => {
        setSelectedItems(checked ? cartItems.map((item) => item.cart_item_id) : []);
    };

    const handleSelectItem = (itemId: number, checked: boolean) => {
        setSelectedItems((current) => (checked ? Array.from(new Set([...current, itemId])) : current.filter((id) => id !== itemId)));
    };

    const handleQuantityChange = (itemId: number, nextQuantity: number) => {
        const item = cartItems.find((cartItem) => cartItem.cart_item_id === itemId);
        if (!item) return;

        const clamped = Math.max(1, Math.min(item.variant.available_quantity, nextQuantity));
        setQuantities((current) => ({ ...current, [itemId]: clamped }));
    };

    const handleUpdateCart = async () => {
        setUpdating(true);

        try {
            await Promise.all(
                Object.entries(quantities).map(([itemId, quantity]) => axios.post(`/cart/update/${itemId}`, { quantity: Number(quantity) })),
            );
            success('Đã cập nhật giỏ hàng');
            router.reload();
        } catch {
            showError('Không thể cập nhật giỏ hàng', 'Thử lại sau ít phút.');
        } finally {
            setUpdating(false);
        }
    };

    const handleDelete = async () => {
        if (!pendingDelete || pendingDelete.length === 0) return;

        setDeleting(true);

        try {
            await Promise.all(pendingDelete.map((itemId) => axios.post(`/cart/remove/${itemId}`)));
            setPendingDelete(null);
            success('Đã xoá sản phẩm khỏi giỏ');
            router.reload();
        } catch {
            showError('Không thể xoá sản phẩm', 'Thử lại sau ít phút.');
        } finally {
            setDeleting(false);
        }
    };

    const handleApplyPromo = async () => {
        if (!couponCode.trim()) return;

        setApplyingPromo(true);
        setPromoError(null);

        try {
            const response = await axios.post('/cart/apply-promotion', { code: couponCode.trim() });
            if (response.data?.success === false) {
                setPromoError(response.data?.message || 'Mã khuyến mãi không hợp lệ.');
                return;
            }

            success('Đã áp dụng mã khuyến mãi');
            setCouponCode('');
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
            success('Đã bỏ mã khuyến mãi');
            router.reload();
        } catch {
            showError('Không thể bỏ mã khuyến mãi');
        }
    };

    if (cartItems.length === 0) {
        return (
            <StorefrontLayout compactFooter>
                <Head title="Giỏ hàng" />
                <PageContainer className="py-section">
                    <EmptyState
                        icon={ShoppingBag}
                        title="Giỏ đang trống"
                        description="Chọn một món cho tổ ấm nhé."
                        actions={
                            <Button asChild leftIcon={ArrowLeft}>
                                <Link href="/">Xem chợ hôm nay</Link>
                            </Button>
                        }
                    />
                </PageContainer>
            </StorefrontLayout>
        );
    }

    const summaryItems = cartItems.map((item) => ({
        id: item.cart_item_id,
        name: item.variant.product?.name ?? 'Sản phẩm',
        image: normalizeImage(item.variant.product?.images?.[0]?.image_url),
        variant: item.variant.sku,
        quantity: quantities[item.cart_item_id] ?? item.quantity,
        price: item.discount_price || item.price,
    }));

    return (
        <StorefrontLayout compactFooter>
            <Head title="Giỏ hàng" />

            <PageContainer className="py-8 md:py-10">
                <PageHeader
                    breadcrumbs={[{ label: 'Chợ', href: '/' }, { label: 'Giỏ hàng' }]}
                    eyebrow="Đơn hàng của bạn"
                    title="Giỏ hàng"
                    count={`${cartItems.length} món`}
                    actions={
                        <Button variant="ghost" size="sm" leftIcon={ArrowLeft} asChild>
                            <Link href="/">Tiếp tục mua sắm</Link>
                        </Button>
                    }
                />

                <div className="mt-6 grid gap-6 lg:grid-cols-12">
                    <section className="lg:col-span-8" aria-label="Danh sách món hàng">
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-3">
                            <Checkbox
                                checked={isAllSelected}
                                onCheckedChange={(checked) => handleSelectAll(checked === true)}
                                label={`Chọn tất cả (${cartItems.length} sản phẩm)`}
                            />
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-brick hover:bg-brick-soft hover:text-brick"
                                disabled={selectedItems.length === 0}
                                onClick={() => setPendingDelete(selectedItems)}
                            >
                                Xoá món đã chọn
                            </Button>
                        </div>

                        <div className="divide-y divide-border">
                            {cartItems.map((item) => {
                                const product = item.variant.product;
                                if (!product) return null;

                                return (
                                    <CartLine
                                        key={item.cart_item_id}
                                        item={{
                                            id: item.cart_item_id,
                                            name: product.name,
                                            image: normalizeImage(product.images?.[0]?.image_url),
                                            href: `/product/${product.product_id}`,
                                            shopName: 'Shop Việt',
                                            variant: item.variant.sku,
                                            price: item.discount_price || item.price,
                                            compareAt: item.discount_price ? item.price : undefined,
                                            quantity: quantities[item.cart_item_id] ?? item.quantity,
                                            maxQuantity: item.variant.available_quantity,
                                        }}
                                        selected={selectedItems.includes(item.cart_item_id)}
                                        onSelect={(checked) => handleSelectItem(item.cart_item_id, checked)}
                                        onQuantityChange={(quantity) => handleQuantityChange(item.cart_item_id, quantity)}
                                        onRemove={() => setPendingDelete([item.cart_item_id])}
                                    />
                                );
                            })}
                        </div>

                        <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-border pt-5">
                            <Button variant="secondary" leftIcon={ArrowLeft} asChild>
                                <Link href="/">Tiếp tục mua sắm</Link>
                            </Button>
                            <Button variant="outline" leftIcon={RefreshCw} loading={updating} onClick={handleUpdateCart}>
                                Cập nhật giỏ hàng
                            </Button>
                        </div>
                    </section>

                    <div className="lg:col-span-4">
                        <OrderSummary
                            items={summaryItems}
                            subtotal={totals.subtotal}
                            discount={totals.discount}
                            shipping={totals.shipping}
                            shippingLabel={totals.shipping > 0 ? undefined : 'Tính ở bước sau'}
                            total={totals.total}
                            promotion={
                                <PromoField
                                    value={couponCode}
                                    onChange={setCouponCode}
                                    onApply={handleApplyPromo}
                                    onRemove={handleRemovePromo}
                                    appliedCode={promotion?.code}
                                    appliedLabel={promotion ? `– Giảm ${formatVnd(totals.discount)}` : undefined}
                                    error={promoError}
                                    loading={applyingPromo}
                                />
                            }
                            ctaLabel="Thanh toán"
                            onCheckout={() => router.visit('/checkout')}
                            disabled={cartItems.length === 0}
                            trust={['Shop Việt', 'Đổi trả 7 ngày', 'Thanh toán bảo mật']}
                            footerNote="Đã bao gồm thuế VAT và phí kiểm định."
                        />
                    </div>
                </div>
            </PageContainer>

            <ConfirmDialog
                open={pendingDelete !== null}
                onOpenChange={(open) => {
                    if (!open) setPendingDelete(null);
                }}
                title="Xác nhận bỏ sản phẩm?"
                description={`${pendingDelete?.length ?? 0} món sẽ được gỡ khỏi giỏ hàng. Bạn vẫn có thể thêm lại sau.`}
                confirmLabel="Đồng ý xoá"
                loading={deleting}
                onConfirm={handleDelete}
            />
        </StorefrontLayout>
    );
}
