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
import { useMoney } from '@/hooks/useMoney';
import { useTranslation } from '@/lib/i18n';

import styles from './customer.module.css';

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
    const { money } = useMoney();
    const { t } = useTranslation();
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
            success(t('Cart updated'));
            router.reload();
        } catch {
            showError(t('Could not update cart'), t('Please try again in a moment.'));
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
            success(t('Item removed from cart'));
            router.reload();
        } catch {
            showError(t('Could not remove item'), t('Please try again in a moment.'));
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
                setPromoError(response.data?.message || t('Invalid promotion code.'));
                return;
            }

            success(t('Promotion applied'));
            setCouponCode('');
            router.reload();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setPromoError(error.response?.data?.message || t('Invalid promotion code.'));
            } else {
                setPromoError(t('Could not apply promotion code.'));
            }
        } finally {
            setApplyingPromo(false);
        }
    };

    const handleRemovePromo = async () => {
        try {
            await axios.post('/cart/remove-promotion');
            success(t('Promotion removed'));
            router.reload();
        } catch {
            showError(t('Could not remove promotion code'));
        }
    };

    if (cartItems.length === 0) {
        return (
            <StorefrontLayout compactFooter>
                <Head title={t('Cart')} />
                <PageContainer className={styles.pageTight}>
                    <EmptyState
                        icon={ShoppingBag}
                        title={t('Your cart is empty')}
                        description={t('Pick something for your home.')}
                        actions={
                            <Button asChild leftIcon={ArrowLeft}>
                                <Link href="/">{t("Browse today's market")}</Link>
                            </Button>
                        }
                    />
                </PageContainer>
            </StorefrontLayout>
        );
    }

    const summaryItems = cartItems.map((item) => ({
        id: item.cart_item_id,
        name: item.variant.product?.name ?? t('Product'),
        image: normalizeImage(item.variant.product?.images?.[0]?.image_url),
        variant: item.variant.sku,
        quantity: quantities[item.cart_item_id] ?? item.quantity,
        price: item.discount_price || item.price,
    }));

    return (
        <StorefrontLayout compactFooter>
            <Head title={t('Cart')} />

            <PageContainer className={styles.page}>
                <PageHeader
                    breadcrumbs={[{ label: t('Market'), href: '/' }, { label: t('Cart') }]}
                    eyebrow={t('Your order')}
                    title={t('Cart')}
                    count={t(':count products', { count: cartItems.length })}
                    actions={
                        <Button variant="ghost" size="sm" leftIcon={ArrowLeft} asChild>
                            <Link href="/">{t('Continue shopping')}</Link>
                        </Button>
                    }
                />

                <div className={styles.cartGrid}>
                    <section className={styles.cartMain} aria-label={t('Products in cart')}>
                        <div className={styles.cartToolbar}>
                            <Checkbox
                                checked={isAllSelected}
                                onCheckedChange={(checked) => handleSelectAll(checked === true)}
                                label={t('Select all (:count items)', { count: cartItems.length })}
                            />
                            <Button
                                variant="ghost"
                                size="sm"
                                className={styles.dangerAction}
                                disabled={selectedItems.length === 0}
                                onClick={() => setPendingDelete(selectedItems)}
                            >
                                {t('Remove selected items')}
                            </Button>
                        </div>

                        <div className={styles.cartLines}>
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

                        <div className={styles.cartActions}>
                            <Button variant="secondary" leftIcon={ArrowLeft} asChild>
                                <Link href="/">{t('Continue shopping')}</Link>
                            </Button>
                            <Button variant="outline" leftIcon={RefreshCw} loading={updating} onClick={handleUpdateCart}>
                                {t('Update cart')}
                            </Button>
                        </div>
                    </section>

                    <div className={styles.cartAside}>
                        <OrderSummary
                            items={summaryItems}
                            subtotal={totals.subtotal}
                            discount={totals.discount}
                            shipping={totals.shipping}
                            shippingLabel={totals.shipping > 0 ? undefined : t('Calculated at next step')}
                            total={totals.total}
                            promotion={
                                <PromoField
                                    value={couponCode}
                                    onChange={setCouponCode}
                                    onApply={handleApplyPromo}
                                    onRemove={handleRemovePromo}
                                    appliedCode={promotion?.code}
                                    appliedLabel={promotion ? `- ${t('Discount')} ${money(totals.discount)}` : undefined}
                                    error={promoError}
                                    loading={applyingPromo}
                                />
                            }
                            ctaLabel={t('Checkout')}
                            onCheckout={() => router.visit('/checkout')}
                            disabled={cartItems.length === 0}
                            trust={[t('Secure payment'), t('Returns per policy')]}
                        />
                    </div>
                </div>
            </PageContainer>

            <ConfirmDialog
                open={pendingDelete !== null}
                onOpenChange={(open) => {
                    if (!open) setPendingDelete(null);
                }}
                title={t('Remove this item?')}
                description={t(':count items will be removed from your cart. You can add them again later.', { count: pendingDelete?.length ?? 0 })}
                confirmLabel={t('Remove')}
                loading={deleting}
                onConfirm={handleDelete}
            />
        </StorefrontLayout>
    );
}
