import React, { useEffect, useMemo, useState } from 'react';
import { usePage, router, Head } from '@inertiajs/react';
import axios from 'axios';
import HomeLayout from '@/layouts/app/HomeLayout';
import CartTitle from '@/Components/cart/CartTitle';
import { useTranslation } from '@/lib/i18n';
import { resolveLocalizedString, type LocalizedValue } from '@/utils/localization';
import { toNumericPrice, type PriceLike } from '@/utils/price';

// Import new components
import OrderSummary from '@/Components/Shared/OrderSummary';
import PromotionInput from '@/Components/Shared/PromotionInput';
import AddressSelector from '@/Components/Shared/AddressSelector';
import CheckoutProductList from '@/Components/Checkout/CheckoutProductList';
import CheckoutAddressForm from '@/Components/Checkout/CheckoutAddressForm';
import CheckoutPaymentSection from '@/Components/Checkout/CheckoutPaymentSection';
import CheckoutOrderNotes from '@/Components/Checkout/CheckoutOrderNotes';
import CheckoutModal from '@/Components/Checkout/CheckoutModal';
import CheckoutExitConfirmation from '@/Components/Checkout/CheckoutExitConfirmation';

// Interfaces
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
  sale_price?: PriceLike;
  product: Product;
}

interface CartItem {
  id: number;
  product_name: LocalizedValue;
  quantity: number;
  total_price: PriceLike;
  variant?: Variant;
  product?: Product;
}

interface Address {
  id: number;
  name: string;
  phone: string;
  address: string;
  province: string;
  district: string;
  ward: string;
  province_id?: number;
  district_id?: number;
  ward_id?: number;
  is_default: boolean;
}

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

interface OrderItem {
  id: number;
  variant_id: number;
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
  promotion?: { code: string; discount: number } | null;
  [key: string]: unknown;
}

const PAYMENT_METHOD_FALLBACK: PaymentMethod[] = [
  { id: 'stripe', name: 'Stripe (Thẻ quốc tế)', description: 'Thanh toán bằng thẻ Visa/MasterCard/JCB' },
  { id: 'paypal', name: 'PayPal', description: 'Thanh toán nhanh qua tài khoản PayPal' },
  { id: 'vnpay', name: 'VNPay', description: 'Thanh toán qua ngân hàng nội địa và QR' },
  { id: 'momo', name: 'MoMo', description: 'Thanh toán bằng ví điện tử MoMo' },
];

// Helper function to get CSRF token
const getCsrfToken = (): string => {
  const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  return token || '';
};

export default function Checkout() {
  const pageProps = usePage<PageProps>().props;

  const cartItems = pageProps.cartItems ?? [];
  const orderItems = pageProps.orderItems ?? [];
  const order = pageProps.order;
  const totals = pageProps.totals;
  const promotion = pageProps.promotion ?? null;
  const addresses = useMemo<Address[]>(() => (
    Array.isArray(pageProps.addresses) ? pageProps.addresses : []
  ), [pageProps.addresses]);
  const cartSubtotal = pageProps.subtotal ?? 0;
  const cartShipping = pageProps.shipping ?? 0;
  const cartDiscount = pageProps.discount ?? 0;
  const cartTotal = pageProps.total ?? 0;
  const serverPaymentMethods = Array.isArray(pageProps.paymentMethods)
    ? (pageProps.paymentMethods as PaymentMethod[])
    : undefined;

  const { t, locale: currentLocale } = useTranslation();

  const isBuyNowCheckout = Boolean(order && orderItems.length > 0 && totals);
  const items = isBuyNowCheckout ? orderItems : cartItems;

  const resolvedTotals = totals ?? null;
  const finalSubtotal = isBuyNowCheckout ? (resolvedTotals?.subtotal ?? 0) : cartSubtotal;
  const finalShipping = isBuyNowCheckout ? (resolvedTotals?.shipping_fee ?? 0) : cartShipping;
  const finalDiscount = isBuyNowCheckout ? (resolvedTotals?.discount_amount ?? 0) : cartDiscount;
  const finalTotal = isBuyNowCheckout ? (resolvedTotals?.total ?? 0) : cartTotal;

  const availablePaymentMethods = useMemo<PaymentMethod[]>(() => {
    if (serverPaymentMethods && serverPaymentMethods.length > 0) {
      return serverPaymentMethods;
    }
    return PAYMENT_METHOD_FALLBACK;
  }, [serverPaymentMethods]);

  const [selectedAddress, setSelectedAddress] = useState<number>(() => {
    const defaultAddress = addresses.find((addr) => addr.is_default) ?? addresses[0];
    return defaultAddress ? defaultAddress.id : 0;
  });

  useEffect(() => {
    if (addresses.length === 0) {
      setSelectedAddress(0);
      return;
    }

    if (!addresses.some((addr) => addr.id === selectedAddress)) {
      const fallback = addresses.find((addr) => addr.is_default) ?? addresses[0];
      setSelectedAddress(fallback ? fallback.id : 0);
    }
  }, [addresses, selectedAddress]);

  const [selectedPayment, setSelectedPayment] = useState<string>(() => availablePaymentMethods[0]?.id ?? '');

  useEffect(() => {
    if (!availablePaymentMethods.some((method) => method.id === selectedPayment)) {
      setSelectedPayment(availablePaymentMethods[0]?.id ?? '');
    }
  }, [availablePaymentMethods, selectedPayment]);

  const [promoCode, setPromoCode] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState(promotion);
  const [orderNotes, setOrderNotes] = useState<string>('');
  const [processing, setProcessing] = useState<boolean>(false);
  const [showAddressModal, setShowAddressModal] = useState<boolean>(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  useEffect(() => {
    setHasUnsavedChanges(Boolean(orderNotes.trim() || promoCode.trim()));
  }, [orderNotes, promoCode]);

  // Helper functions
  const getProductImage = (item: CartItem | OrderItem): string => {
    if ('variant' in item && item.variant?.product?.images) {
      const images = item.variant.product.images;
      return images.length > 0 ? `/storage/${images[0].image_path}` : '/image/ShopnestLogo.png';
    }
    if ('image' in item) {
      return item.image || '/image/ShopnestLogo.png';
    }
    return '/image/ShopnestLogo.png';
  };

  const localeKey = currentLocale ?? 'vi';

  const getVariantText = (item: CartItem | OrderItem): string => {
    if ('variant' in item && item.variant) {
      const variant = item.variant;
      const parts: string[] = [];

      if (variant.color) {
        const color = resolveLocalizedString(variant.color, localeKey);
        if (color) {
          parts.push(color);
        }
      }

      if (variant.size) {
        const size = resolveLocalizedString(variant.size, localeKey);
        if (size) {
          parts.push(size);
        }
      }

      if (parts.length > 0) {
        return parts.join(' / ');
      }

      return variant.sku;
    }

    if ('variant_name' in item) {
      return resolveLocalizedString(item.variant_name, localeKey);
    }

    return '';
  };

  const getItemPrice = (item: CartItem | OrderItem): number => {
    const quantity = item.quantity > 0 ? item.quantity : 1;

    if ('variant' in item && item.variant) {
      if (item.variant.sale_price !== null && item.variant.sale_price !== undefined) {
        return toNumericPrice(item.variant.sale_price);
      }

      if (item.variant.price !== null && item.variant.price !== undefined) {
        return toNumericPrice(item.variant.price);
      }

      const fallbackTotal = toNumericPrice(item.total_price);
      return fallbackTotal / quantity;
    }

    if ('unit_price' in item) {
      return toNumericPrice(item.unit_price);
    }

    const fallbackTotal = toNumericPrice(item.total_price);
    return fallbackTotal / quantity;
  };

  const getOriginalPrice = (item: CartItem | OrderItem): number | null => {
    if ('variant' in item && item.variant) {
      const basePrice = item.variant.price;
      const salePrice = item.variant.sale_price;

      if (
        salePrice !== null &&
        salePrice !== undefined &&
        basePrice !== null &&
        basePrice !== undefined
      ) {
        const resolvedBase = toNumericPrice(basePrice);
        const resolvedSale = toNumericPrice(salePrice);

        if (resolvedBase > resolvedSale) {
          return resolvedBase;
        }
      }
    }

    return null;
  };

  // Handlers
  const handleApplyPromo = async (code: string) => {
    try {
      setPromoCode(code);
      const response = await axios.post('/cart/apply-promotion', 
        { code },
        { headers: { 'X-CSRF-TOKEN': getCsrfToken() } }
      );
      
      if (response.data?.success) {
        setAppliedPromo(response.data.promotion);
        alert(t('Promotion applied successfully!'));
        router.reload();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || t('Invalid promotion code'));
      }
    }
  };

  const handleRemovePromo = async () => {
    try {
      await axios.post('/cart/remove-promotion', {}, { headers: { 'X-CSRF-TOKEN': getCsrfToken() } });
      setAppliedPromo(null);
      setPromoCode('');
      router.reload();
    } catch (error) {
      console.error('Failed to remove promotion:', error);
    }
  };

  const handleAddAddress = async (newAddress: {
    name: string;
    phone: string;
    address: string;
    province_id: string;
    district_id: string;
    ward_id: string;
    is_default: boolean;
  }) => {
    try {
      const response = await axios.post('/addresses', newAddress, {
        headers: { 'X-CSRF-TOKEN': getCsrfToken() }
      });
      
      if (response.data?.success) {
        setShowAddressModal(false);
        router.reload();
      }
    } catch (error) {
      console.error('Failed to add address:', error);
      throw error;
    }
  };

  const handleCheckout = async () => {
    if (!selectedPayment) {
      alert(t('Please select a payment method'));
      return;
    }

    if (!isBuyNowCheckout && addresses.length > 0 && !selectedAddress) {
      alert(t('Please select a shipping address'));
      return;
    }

    setProcessing(true);
    setHasUnsavedChanges(false);

    try {
      const endpoint = isBuyNowCheckout && order
        ? `/buy-now/checkout/${order.order_id}`
        : '/checkout';

      const payload: Record<string, unknown> = {
        provider: selectedPayment,
      };

      if (!isBuyNowCheckout && selectedAddress) {
        payload.address_id = selectedAddress;
      }

      if (!isBuyNowCheckout && orderNotes.trim()) {
        payload.notes = orderNotes.trim();
      }

      const response = await axios.post(endpoint, payload, {
        headers: { 'X-CSRF-TOKEN': getCsrfToken() }
      });

      if (response.data?.success && response.data?.payment_url) {
        window.location.href = response.data.payment_url;
        return;
      }

      alert(response.data?.message || t('Failed to process checkout. Please try again.'));
      setProcessing(false);
    } catch (error: unknown) {
      setProcessing(false);
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || t('Failed to process checkout. Please try again.'));
      } else {
        alert(t('An unexpected error occurred. Please try again.'));
      }
    }
  };

  if (!items || items.length === 0) {
    return (
      <HomeLayout>
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <i className="fas fa-shopping-cart text-6xl text-gray-300 mb-4"></i>
            <div className="text-xl text-gray-600 mb-6">{t('Your cart is empty')}</div>
            <a 
              href="/" 
              className="px-6 py-3 btn-primary rounded-lg transition-colors duration-200"
            >
              {t('Continue Shopping')}
            </a>
          </div>
        </div>
      </HomeLayout>
    );
  }

  return (
    <HomeLayout>
      <Head title={t("Checkout")} />
      <div className="max-w-6xl mx-auto px-4 py-6 font-['Poppins',sans-serif]">
        <CartTitle title={t("Checkout Order")} />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 mt-6">
          {/* Main Content */}
          <div className="space-y-5">
            {/* Product List */}
            <CheckoutProductList
              items={items!}
              getProductImage={getProductImage}
              getVariantText={getVariantText}
              getItemPrice={getItemPrice}
              getOriginalPrice={getOriginalPrice}
            />

            {/* Shipping Address */}
            <div className="bg-gray-50 rounded-lg p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <i className="fas fa-map-marker-alt text-primary"></i>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {t("Shipping Address")}
                  </h3>
                </div>
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="px-4 py-2 text-sm text-primary border-2 border-dashed border-primary rounded-lg hover:bg-primary-light transition-colors duration-200"
                >
                  <i className="fas fa-plus mr-2"></i>
                  {t("Add New")}
                </button>
              </div>
              
              {addresses.length > 0 ? (
                <AddressSelector
                  addresses={addresses}
                  selectedId={selectedAddress}
                  onSelect={setSelectedAddress}
                />
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">{t("You don't have any shipping address yet")}</p>
                  <button
                    onClick={() => setShowAddressModal(true)}
                    className="px-6 py-2.5 btn-primary rounded-lg transition-colors duration-200"
                  >
                    {t("Add Shipping Address")}
                  </button>
                </div>
              )}
            </div>

            {/* Promotion Code */}
            <div className="bg-gray-50 rounded-lg p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <i className="fas fa-gift text-primary"></i>
                <h3 className="text-lg font-semibold text-gray-900">
                  {t("Promotions & Vouchers")}
                </h3>
              </div>
              
              <PromotionInput
                onApply={handleApplyPromo}
                onRemove={handleRemovePromo}
                appliedCode={appliedPromo?.code}
              />
            </div>

            {/* Payment Method */}
            <CheckoutPaymentSection
              methods={availablePaymentMethods}
              selectedMethod={selectedPayment}
              onMethodChange={setSelectedPayment}
              onCheckout={handleCheckout}
              processing={processing}
              disabled={!isBuyNowCheckout && addresses.length > 0 && !selectedAddress}
            />

            {/* Order Notes */}
            <CheckoutOrderNotes
              value={orderNotes}
              onChange={setOrderNotes}
            />
          </div>

          {/* Sidebar - Order Summary */}
          <div className="lg:sticky lg:top-4 h-fit">
            <div className="bg-white rounded-lg p-5 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-200">
                {t("Order Summary")}
              </h3>
              
              <OrderSummary
                subtotal={finalSubtotal}
                shipping={finalShipping}
                discount={finalDiscount}
                total={finalTotal}
              />

              <div className="mt-4 p-3 bg-primary-light rounded-lg text-xs text-gray-600 flex items-start gap-2">
                <i className="fas fa-shield-alt text-primary mt-0.5"></i>
                <span>{t("Your payment information is secure and encrypted")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      <CheckoutModal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        title={t("Add New Address")}
      >
        <CheckoutAddressForm
          onSubmit={handleAddAddress}
          onCancel={() => setShowAddressModal(false)}
        />
      </CheckoutModal>

      {/* Exit Confirmation */}
      <CheckoutExitConfirmation hasUnsavedChanges={hasUnsavedChanges} />
    </HomeLayout>
  );
}
