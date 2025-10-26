import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import axios from 'axios';
import HomeLayout from '@/layouts/app/HomeLayout';
import CartTitle from '@/Components/cart/CartTitle';
import { useTranslation } from '@/lib/i18n';

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

interface Promotion {
  id: number;
  name: string;
  description: string;
  type: string;
  value: number;
  min_order_amount?: number;
  max_discount_amount?: number;
  stackable: boolean;
  priority: string;
  terms_and_conditions?: string;
  codes: Array<{
    id: number;
    code: string;
  }>;
}

interface AddressOption {
  id: number;
  name: string;
  code: string;
}

interface PageProps {
  cartItems?: CartItem[];
  order?: Order;
  orderItems?: OrderItem[];
  totals?: Totals;
  subtotal?: number;
  shipping?: number;
  tax?: number;
  discount?: number;
  total?: number;
  addresses?: Address[];
  paymentMethods?: PaymentMethod[];
  promotion?: { code: string; discount: number } | null;
  availablePromotions?: Promotion[];
  ineligiblePromotions?: Promotion[];
  currency?: {
    code: string;
    rates: Record<string, number>;
  };
  [key: string]: unknown;
}

// Helper function to get CSRF token
const getCsrfToken = (): string => {
  const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  return token || '';
};

export default function Checkout() {
  const { cartItems, order, orderItems, totals, subtotal, shipping = 0, discount = 0, total, addresses = [], promotion, availablePromotions = [], ineligiblePromotions = [], currency } = usePage<PageProps>().props;
  const { t } = useTranslation();
  
  // Determine checkout type
  const isBuyNowCheckout = !!(order && orderItems && totals);
  // const isCartCheckout = !!(cartItems && subtotal !== undefined && total !== undefined);
  
  // Use appropriate data based on checkout type
  const items = isBuyNowCheckout ? orderItems : cartItems;
  const finalSubtotal = isBuyNowCheckout ? totals!.subtotal : subtotal!;
  const finalShipping = isBuyNowCheckout ? totals!.shipping_fee : shipping;
  const finalDiscount = isBuyNowCheckout ? totals!.discount_amount : discount;
  const finalTotal = isBuyNowCheckout ? totals!.total : total!;
  
  const [selectedAddress, setSelectedAddress] = useState<number>(
    addresses.find(addr => addr.is_default)?.id || (addresses[0]?.id || 0)
  );
  const [selectedPayment, setSelectedPayment] = useState<string>('stripe');
  const [promoCode, setPromoCode] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState(promotion);
  const [selectedPromotions, setSelectedPromotions] = useState<number[]>([]);
  const [orderNotes, setOrderNotes] = useState<string>('');
  const [processing, setProcessing] = useState<boolean>(false);
  const [showAddressModal, setShowAddressModal] = useState<boolean>(false);
  const [newAddress, setNewAddress] = useState({
    name: '',
    phone: '',
    address: '',
    province_id: '',
    district_id: '',
    ward_id: '',
    is_default: false,
  });

  // Address options state
  const [provinces, setProvinces] = useState<AddressOption[]>([]);
  const [districts, setDistricts] = useState<AddressOption[]>([]);
  const [wards, setWards] = useState<AddressOption[]>([]);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);

  // Load provinces on component mount
  React.useEffect(() => {
    loadProvinces();
  }, []);

  const loadProvinces = async () => {
    setLoadingProvinces(true);
    try {
      const response = await axios.get('/addresses/provinces');
      if (response.data?.success) {
        setProvinces(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load provinces:', error);
    } finally {
      setLoadingProvinces(false);
    }
  };

  const loadDistricts = async (provinceId: string) => {
    if (!provinceId) {
      setDistricts([]);
      setWards([]);
      return;
    }

    setLoadingDistricts(true);
    try {
      const response = await axios.get(`/addresses/districts/${provinceId}`);
      if (response.data?.success) {
        setDistricts(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load districts:', error);
    } finally {
      setLoadingDistricts(false);
    }
  };

  const loadWards = async (districtId: string) => {
    if (!districtId) {
      setWards([]);
      return;
    }

    setLoadingWards(true);
    try {
      const response = await axios.get(`/addresses/wards/${districtId}`);
      if (response.data?.success) {
        setWards(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load wards:', error);
    } finally {
      setLoadingWards(false);
    }
  };

  const handleProvinceChange = (provinceId: string) => {
    setNewAddress({
      ...newAddress,
      province_id: provinceId,
      district_id: '',
      ward_id: '',
    });
    setDistricts([]);
    setWards([]);
    if (provinceId) {
      loadDistricts(provinceId);
    }
  };

  const handleDistrictChange = (districtId: string) => {
    setNewAddress({
      ...newAddress,
      district_id: districtId,
      ward_id: '',
    });
    setWards([]);
    if (districtId) {
      loadWards(districtId);
    }
  };

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      alert('Please enter a promotion code');
      return;
    }
    
    try {
      const response = await axios.post('/cart/apply-promotion', 
        { code: promoCode },
        { headers: { 'X-CSRF-TOKEN': getCsrfToken() } }
      );
      
      if (response.data?.success) {
        setAppliedPromo(response.data.promotion);
        alert('Promotion applied successfully!');
        router.reload();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || 'Invalid promotion code');
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

  const handleAddAddress = async () => {
    try {
      const response = await axios.post('/addresses', newAddress, {
        headers: { 'X-CSRF-TOKEN': getCsrfToken() }
      });
      
      if (response.data?.success) {
        setShowAddressModal(false);
        setNewAddress({
          name: '',
          phone: '',
          address: '',
          province_id: '',
          district_id: '',
          ward_id: '',
          is_default: false,
        });
        setDistricts([]);
        setWards([]);
        router.reload();
      }
    } catch (error) {
      console.error('Failed to add address:', error);
    }
  };

  const handleSetDefaultAddress = async (addressId: number) => {
    try {
      await axios.patch(`/addresses/${addressId}/default`, {}, {
        headers: { 'X-CSRF-TOKEN': getCsrfToken() }
      });
      router.reload();
    } catch (error) {
      console.error('Failed to set default address:', error);
    }
  };

  const handleCheckout = async () => {
    if (!isBuyNowCheckout && !selectedAddress && addresses.length > 0) {
      alert('Please select a shipping address');
      return;
    }

    setProcessing(true);
    
    try {
      const endpoint = isBuyNowCheckout ? `/buy-now/checkout/${order!.order_id}` : '/checkout';
      const payload = isBuyNowCheckout 
        ? { provider: selectedPayment }
        : { provider: selectedPayment, address_id: selectedAddress, notes: orderNotes, promotion_ids: selectedPromotions };

      const response = await axios.post(endpoint, payload, {
        headers: { 'X-CSRF-TOKEN': getCsrfToken() }
      });

      if (response.data?.success && response.data?.payment_url) {
        window.location.href = response.data.payment_url;
      } else {
        console.error('Invalid response from checkout:', response.data);
        alert(response.data?.message || 'Failed to process checkout. Please try again.');
        setProcessing(false);
      }
    } catch (error: unknown) {
      setProcessing(false);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Failed to process checkout. Please try again.';
        console.error('Checkout failed:', error.response?.data);
        alert(errorMessage);
      } else {
        console.error('Unexpected error during checkout:', error);
        alert('An unexpected error occurred. Please try again.');
      }
    }
  };

  const getProductImage = (item: CartItem | OrderItem): string => {
    // For cart items
    if ('variant' in item && item.variant?.product?.images) {
      const images = item.variant.product.images;
      return images.length > 0 ? `/storage/${images[0].image_path}` : '/image/default-product.png';
    }
    // For order items
    if ('image' in item) {
      return item.image || '/image/default-product.png';
    }
    return '/image/ShopnestLogo.png';
  };

  const getVariantText = (item: CartItem | OrderItem): string => {
    // For cart items
    if ('variant' in item && item.variant) {
      const variant = item.variant;
      const parts = [];
      if (variant.color) parts.push(variant.color);
      if (variant.size) parts.push(variant.size);
      return parts.length > 0 ? parts.join(' / ') : variant.sku;
    }
    // For order items
    if ('variant_name' in item) {
      return item.variant_name;
    }
    return '';
  };

  const getItemPrice = (item: CartItem | OrderItem): number => {
    // For cart items
    if ('variant' in item && item.variant) {
      return item.variant.sale_price || item.variant.price || item.total_price / item.quantity;
    }
    // For order items
    if ('unit_price' in item) {
      return item.unit_price;
    }
    return item.total_price / item.quantity;
  };

  const getOriginalPrice = (item: CartItem | OrderItem): number | null => {
    // For cart items
    if ('variant' in item && item.variant?.sale_price && item.variant?.price) {
      return item.variant.price;
    }
    return null;
  };

  const formatPrice = (price: number): string => {
    // Price is assumed to be in USD from backend
    const usdPrice = price;
    const vndPrice = currency?.rates?.VND ? usdPrice * currency.rates.VND : usdPrice * 25000; // fallback rate
    
    // Format VND (primary currency for Vietnamese users)
    const vndFormatted = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(vndPrice);
    
    // Format USD (for Stripe payment)
    const usdFormatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(usdPrice);
    
    // Return both currencies
    return `${vndFormatted} (${usdFormatted})`;
  };

  if (!items || items.length === 0) {
    return (
      <HomeLayout>
        <div className="checkout-wrapper">
          <div className="checkout-empty">
            <i className="fas fa-shopping-cart"></i>
            <div className="checkout-empty-text">Your cart is empty</div>
            <a href="/" className="checkout-empty-btn">Continue Shopping</a>
          </div>
        </div>
      </HomeLayout>
    );
  }

  return (
    <HomeLayout>
      <div className="checkout-wrapper">
        <CartTitle title={t("Checkout Order")} />

        <div className="checkout-container">
          {/* Main Content */}
          <div className="checkout-main">
            {/* Product List Section */}
            <div className="checkout-section">
              <h2 className="checkout-section-title">
                <i className="fas fa-box"></i>
                {t("Order Items")} ({items!.length})
              </h2>
              <div className="checkout-product-list">
                {items!.map((item) => (
                  <div key={item.id} className="checkout-product-item">
                    <img 
                      src={getProductImage(item)} 
                      alt={item.product_name}
                      className="checkout-product-image"
                    />
                    <div className="checkout-product-details">
                      <div className="checkout-product-name">{item.product_name}</div>
                      {getVariantText(item) && (
                        <div className="checkout-product-variant">
                          <i className="fas fa-tag"></i> {getVariantText(item)}
                        </div>
                      )}
                      <div className="checkout-product-price">
                        <span className="checkout-price-current">
                          {formatPrice(getItemPrice(item))}
                        </span>
                        {getOriginalPrice(item) && (
                          <span className="checkout-price-original">
                            {formatPrice(getOriginalPrice(item)!)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="checkout-product-quantity">
                      <div className="checkout-quantity-text">{t("Qty")}: {item.quantity}</div>
                      <div className="checkout-product-subtotal">
                        {formatPrice(item.total_price)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address Section */}
            <div className="checkout-section">
              <div className="checkout-section-header">
                <h2 className="checkout-section-title">
                  <i className="fas fa-map-marker-alt"></i>
                  {t("Shipping Address")}
                </h2>
                <button 
                  onClick={() => setShowAddressModal(true)}
                  className="checkout-add-address-btn"
                >
                  <i className="fas fa-plus"></i> {t("Add New Address")}
                </button>
              </div>
              
              {addresses.length > 0 ? (
                <div className="checkout-address-list">
                  {addresses.map((address) => (
                    <div 
                      key={address.id}
                      className={`checkout-address-item ${selectedAddress === address.id ? 'selected' : ''}`}
                      onClick={() => setSelectedAddress(address.id)}
                    >
                      <div className="checkout-address-header">
                        <input 
                          type="radio"
                          name="address"
                          checked={selectedAddress === address.id}
                          onChange={() => setSelectedAddress(address.id)}
                          className="checkout-address-radio"
                        />
                        <span className="checkout-address-name">{address.name}</span>
                        {address.is_default && (
                          <span className="checkout-address-default">{t("Default")}</span>
                        )}
                        <span className="checkout-address-phone">{address.phone}</span>
                        {!address.is_default && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSetDefaultAddress(address.id);
                            }}
                            className="checkout-set-default-btn"
                          >
                            {t("Set as Default")}
                          </button>
                        )}
                      </div>
                      <div className="checkout-address-detail">
                        {address.address}, {address.ward}, {address.district}, {address.province}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="checkout-no-address">
                  <i className="fas fa-map-marker-alt"></i>
                  <div className="checkout-no-address-text">{t("You don't have any shipping address yet")}</div>
                  <button 
                    onClick={() => setShowAddressModal(true)}
                    className="checkout-add-first-address-btn"
                  >
                    {t("Add Shipping Address")}
                  </button>
                </div>
              )}
            </div>

            {/* Payment Method Section */}
            <div className="checkout-section">
              <h2 className="checkout-section-title">
                <i className="fas fa-credit-card"></i>
                {t("Payment Method")}
              </h2>
              <div className="checkout-payment-methods">
                <div 
                  className={`checkout-payment-item ${selectedPayment === 'stripe' ? 'selected' : ''}`}
                  onClick={() => setSelectedPayment('stripe')}
                >
                  <input 
                    type="radio"
                    name="payment"
                    value="stripe"
                    checked={selectedPayment === 'stripe'}
                    onChange={() => setSelectedPayment('stripe')}
                    className="checkout-payment-radio"
                  />
                  <div className="checkout-payment-info">
                    <div className="checkout-payment-name">{t("Credit/Debit Card")}</div>
                    <div className="checkout-payment-desc">{t("Pay securely with Stripe")}</div>
                  </div>
                </div>
                <div 
                  className={`checkout-payment-item ${selectedPayment === 'paypal' ? 'selected' : ''}`}
                  onClick={() => setSelectedPayment('paypal')}
                >
                  <input 
                    type="radio"
                    name="payment"
                    value="paypal"
                    checked={selectedPayment === 'paypal'}
                    onChange={() => setSelectedPayment('paypal')}
                    className="checkout-payment-radio"
                  />
                  <div className="checkout-payment-info">
                    <div className="checkout-payment-name">PayPal</div>
                    <div className="checkout-payment-desc">Pay with your PayPal account</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Promotion Section */}
            <div className="checkout-section">
              <h2 className="checkout-section-title">
                <i className="fas fa-gift"></i>
                {t("Promotions & Vouchers")}
              </h2>
              
              {/* Promotion Code Input */}
              <div className="checkout-promotion-form">
                <input 
                  type="text"
                  placeholder={t("Enter promo code")}
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="checkout-promotion-input"
                  disabled={!!appliedPromo}
                />
                <button 
                  onClick={handleApplyPromo}
                  className="checkout-promotion-btn"
                  disabled={!!appliedPromo}
                >
                  {t("Apply")}
                </button>
              </div>
              
              {/* Applied Promotion */}
              {appliedPromo && (
                <div className="checkout-promotion-applied">
                  <span className="checkout-promotion-applied-text">
                    <i className="fas fa-check-circle"></i> {appliedPromo.code} {t("applied")}
                  </span>
                  <button onClick={handleRemovePromo} className="checkout-promotion-remove">
                    {t("Remove")}
                  </button>
                </div>
              )}

              {/* Available Promotions */}
              {availablePromotions.length > 0 && (
                <div className="checkout-available-promotions">
                  <h3 className="checkout-promotions-subtitle">{t("Available Vouchers")}:</h3>
                  <div className="checkout-promotions-list">
                    {availablePromotions.map((promo) => (
                      <div key={promo.id} className="checkout-promotion-item">
                        <input
                          type="checkbox"
                          id={`promo-${promo.id}`}
                          checked={selectedPromotions.includes(promo.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedPromotions([...selectedPromotions, promo.id]);
                            } else {
                              setSelectedPromotions(selectedPromotions.filter(id => id !== promo.id));
                            }
                          }}
                          className="checkout-promotion-checkbox"
                        />
                        <label htmlFor={`promo-${promo.id}`} className="checkout-promotion-label">
                          <div className="checkout-promotion-header">
                            <span className="checkout-promotion-name">{promo.name}</span>
                            <span className="checkout-promotion-value">
                              {promo.type === 'percentage' ? `${promo.value}%` : `$${promo.value}`}
                            </span>
                          </div>
                          <div className="checkout-promotion-desc">{promo.description}</div>
                          {promo.min_order_amount && (
                            <div className="checkout-promotion-condition">
                              Đơn tối thiểu: ${promo.min_order_amount}
                            </div>
                          )}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ineligible Promotions */}
              {ineligiblePromotions.length > 0 && (
                <div className="checkout-ineligible-promotions">
                  <h3 className="checkout-promotions-subtitle">{t("Ineligible Vouchers")}:</h3>
                  <div className="checkout-promotions-list">
                    {ineligiblePromotions.map((promo) => (
                      <div key={promo.id} className="checkout-promotion-item ineligible">
                        <input
                          type="checkbox"
                          disabled
                          className="checkout-promotion-checkbox"
                        />
                        <label className="checkout-promotion-label">
                          <div className="checkout-promotion-header">
                            <span className="checkout-promotion-name">{promo.name}</span>
                            <span className="checkout-promotion-value">
                              {promo.type === 'percentage' ? `${promo.value}%` : `$${promo.value}`}
                            </span>
                          </div>
                          <div className="checkout-promotion-desc">{promo.description}</div>
                          {promo.min_order_amount && (
                            <div className="checkout-promotion-condition">
                              Đơn tối thiểu: ${promo.min_order_amount}
                            </div>
                          )}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Order Notes Section */}
            <div className="checkout-section">
              <h2 className="checkout-section-title">
                <i className="fas fa-sticky-note"></i>
                {t("Order Notes")} ({t("Optional")})
              </h2>
              <textarea
                placeholder={t("Add notes about your order (e.g., delivery instructions)")}
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                className="checkout-notes-textarea"
              />
            </div>
          </div>

          {/* Sidebar - Order Summary */}
          <div className="checkout-sidebar">
            <div className="checkout-summary">
              <h3 className="checkout-summary-title">{t("Order Summary")}</h3>
              
              <div className="checkout-summary-row">
                <span className="checkout-summary-label">{t("Subtotal")}:</span>
                <span className="checkout-summary-value">{formatPrice(finalSubtotal)}</span>
              </div>

              {finalShipping > 0 && (
                <div className="checkout-summary-row">
                  <span className="checkout-summary-label">{t("Shipping")}:</span>
                  <span className="checkout-summary-value">{formatPrice(finalShipping)}</span>
                </div>
              )}

              {finalDiscount > 0 && (
                <div className="checkout-summary-row">
                  <span className="checkout-summary-label">{t("Discount")}:</span>
                  <span className="checkout-summary-value checkout-summary-discount">
                    -{formatPrice(finalDiscount)}
                  </span>
                </div>
              )}

              <div className="checkout-summary-row checkout-summary-total">
                <span className="checkout-summary-label">{t("Total")}:</span>
                <span className="checkout-summary-value">{formatPrice(finalTotal)}</span>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={processing}
                className="checkout-payment-btn"
              >
                {processing ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> {t("Processing")}...
                  </>
                ) : (
                  <>
                    <i className="fas fa-lock"></i> {t("Proceed to Payment")}
                  </>
                )}
              </button>

              <button 
                onClick={() => router.visit('/')}
                className="checkout-back-btn"
              >
                <i className="fas fa-arrow-left"></i> {t("Back to Home")}
              </button>

              <div className="checkout-security-note">
                <i className="fas fa-shield-alt"></i>
                {t("Your payment information is secure and encrypted")}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      {showAddressModal && (
        <div className="checkout-modal-overlay" onClick={() => setShowAddressModal(false)}>
          <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
            <div className="checkout-modal-header">
              <h3 className="checkout-modal-title">Thêm địa chỉ mới</h3>
              <button 
                onClick={() => setShowAddressModal(false)}
                className="checkout-modal-close"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="checkout-modal-body">
              <div className="checkout-form-group">
                <label className="checkout-form-label">Họ tên người nhận</label>
                <input
                  type="text"
                  value={newAddress.name}
                  onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
                  className="checkout-form-input"
                  placeholder="Nhập họ tên"
                />
              </div>
              
              <div className="checkout-form-group">
                <label className="checkout-form-label">Số điện thoại</label>
                <input
                  type="tel"
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                  className="checkout-form-input"
                  placeholder="Nhập số điện thoại"
                />
              </div>
              
              <div className="checkout-form-group">
                <label className="checkout-form-label">Địa chỉ</label>
                <input
                  type="text"
                  value={newAddress.address}
                  onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                  className="checkout-form-input"
                  placeholder={t("House number, street name")}
                />
              </div>
              
              <div className="checkout-form-row">
                <div className="checkout-form-group">
                  <label className="checkout-form-label">{t("Ward/Commune")}</label>
                  <select
                    value={newAddress.ward_id}
                    onChange={(e) => setNewAddress({...newAddress, ward_id: e.target.value})}
                    className="checkout-form-input"
                    disabled={loadingWards || wards.length === 0}
                  >
                    <option value="">
                      {loadingWards ? t('Loading...') : newAddress.district_id ? t('Select ward/commune') : t('Select district first')}
                    </option>
                    {wards.map((ward) => (
                      <option key={ward.id} value={ward.id}>
                        {ward.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="checkout-form-group">
                  <label className="checkout-form-label">{t("District")}</label>
                  <select
                    value={newAddress.district_id}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className="checkout-form-input"
                    disabled={loadingDistricts || districts.length === 0}
                  >
                    <option value="">
                      {loadingDistricts ? t('Loading...') : newAddress.province_id ? t('Select district') : t('Select province first')}
                    </option>
                    {districts.map((district) => (
                      <option key={district.id} value={district.id}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="checkout-form-group">
                <label className="checkout-form-label">{t("Province/City")}</label>
                <select
                  value={newAddress.province_id}
                  onChange={(e) => handleProvinceChange(e.target.value)}
                  className="checkout-form-input"
                  disabled={loadingProvinces}
                >
                  <option value="">
                    {loadingProvinces ? 'Đang tải...' : 'Chọn tỉnh/thành phố'}
                  </option>
                  {provinces.map((province) => (
                    <option key={province.id} value={province.id}>
                      {province.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="checkout-form-group">
                <label className="checkout-form-checkbox">
                  <input
                    type="checkbox"
                    checked={newAddress.is_default}
                    onChange={(e) => setNewAddress({...newAddress, is_default: e.target.checked})}
                    className="checkout-form-checkbox-input"
                  />
                  <span className="checkout-form-checkbox-text">{t("Set as default address")}</span>
                </label>
              </div>
            </div>
            
            <div className="checkout-modal-footer">
              <button 
                onClick={() => setShowAddressModal(false)}
                className="checkout-modal-cancel-btn"
              >
                {t("Cancel")}
              </button>
              <button 
                onClick={handleAddAddress}
                className="checkout-modal-save-btn"
              >
                {t("Add Address")}
              </button>
            </div>
          </div>
        </div>
      )}
    </HomeLayout>
  );
}