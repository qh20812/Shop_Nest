import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import axios from 'axios';
import HomeLayout from '@/layouts/app/HomeLayout';
import CartTitle from '@/Components/cart/CartTitle';
import { useTranslation } from '@/lib/i18n';

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
  name: string;
  slug: string;
  images: ProductImage[];
}

interface Variant {
  id: number;
  sku: string;
  size?: string;
  color?: string;
  price: number;
  sale_price?: number;
  product: Product;
}

interface CartItem {
  id: number;
  product_name: string;
  quantity: number;
  total_price: number;
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
  product_name: string;
  variant_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
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

// Helper function to get CSRF token
const getCsrfToken = (): string => {
  const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  return token || '';
};

export default function Checkout() {
  const { 
    cartItems, 
    order, 
    orderItems, 
    totals, 
    subtotal, 
    shipping = 0, 
    discount = 0, 
    total, 
    addresses = [], 
    paymentMethods = [
      { id: 'stripe', name: 'Credit/Debit Card', description: 'Pay securely with Stripe' },
      { id: 'paypal', name: 'PayPal', description: 'Pay with your PayPal account' },
    ],
    promotion 
  } = usePage<PageProps>().props;
  
  const { t } = useTranslation();
  
  // Determine checkout type
  const isBuyNowCheckout = !!(order && orderItems && totals);
  
  // Use appropriate data based on checkout type
  const items = isBuyNowCheckout ? orderItems : cartItems;
  const finalSubtotal = isBuyNowCheckout ? totals!.subtotal : subtotal!;
  const finalShipping = isBuyNowCheckout ? totals!.shipping_fee : shipping;
  const finalDiscount = isBuyNowCheckout ? totals!.discount_amount : discount;
  const finalTotal = isBuyNowCheckout ? totals!.total : total!;
  
  // State management
  const [selectedAddress, setSelectedAddress] = useState<number>(
    addresses.find(addr => addr.is_default)?.id || (addresses[0]?.id || 0)
  );
  const [selectedPayment, setSelectedPayment] = useState<string>('stripe');
  const [promoCode, setPromoCode] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState(promotion);
  const [orderNotes, setOrderNotes] = useState<string>('');
  const [processing, setProcessing] = useState<boolean>(false);
  const [showAddressModal, setShowAddressModal] = useState<boolean>(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  // Track unsaved changes
  React.useEffect(() => {
    if (orderNotes.trim() || promoCode.trim()) {
      setHasUnsavedChanges(true);
    } else {
      setHasUnsavedChanges(false);
    }
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

  const getVariantText = (item: CartItem | OrderItem): string => {
    if ('variant' in item && item.variant) {
      const variant = item.variant;
      const parts = [];
      if (variant.color) parts.push(variant.color);
      if (variant.size) parts.push(variant.size);
      return parts.length > 0 ? parts.join(' / ') : variant.sku;
    }
    if ('variant_name' in item) {
      return item.variant_name;
    }
    return '';
  };

  const getItemPrice = (item: CartItem | OrderItem): number => {
    if ('variant' in item && item.variant) {
      return item.variant.sale_price || item.variant.price || item.total_price / item.quantity;
    }
    if ('unit_price' in item) {
      return item.unit_price;
    }
    return item.total_price / item.quantity;
  };

  const getOriginalPrice = (item: CartItem | OrderItem): number | null => {
    if ('variant' in item && item.variant?.sale_price && item.variant?.price) {
      return item.variant.price;
    }
    return null;
  };

  // Handlers
  const handleApplyPromo = async (code: string) => {
    try {
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
    if (!isBuyNowCheckout && !selectedAddress && addresses.length > 0) {
      alert(t('Please select a shipping address'));
      return;
    }

    setProcessing(true);
    setHasUnsavedChanges(false); // Clear unsaved changes when proceeding
    
    try {
      const endpoint = isBuyNowCheckout ? `/buy-now/checkout/${order!.order_id}` : '/checkout';
      const payload = isBuyNowCheckout 
        ? { provider: selectedPayment }
        : { provider: selectedPayment, address_id: selectedAddress, notes: orderNotes };

      const response = await axios.post(endpoint, payload, {
        headers: { 'X-CSRF-TOKEN': getCsrfToken() }
      });

      if (response.data?.success && response.data?.payment_url) {
        window.location.href = response.data.payment_url;
      } else {
        alert(response.data?.message || t('Failed to process checkout. Please try again.'));
        setProcessing(false);
      }
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
              methods={paymentMethods}
              selectedMethod={selectedPayment}
              onMethodChange={setSelectedPayment}
              onCheckout={handleCheckout}
              processing={processing}
              disabled={!selectedAddress && addresses.length > 0}
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
