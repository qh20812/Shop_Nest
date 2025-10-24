import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import axios from 'axios';
import HomeLayout from '@/layouts/app/HomeLayout';

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
  city: string;
  district: string;
  ward: string;
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
  tax?: number;
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
  const { cartItems, order, orderItems, totals, subtotal, shipping = 0, discount = 0, total, addresses = [], promotion } = usePage<PageProps>().props;
  
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
  const [orderNotes, setOrderNotes] = useState<string>('');
  const [processing, setProcessing] = useState<boolean>(false);

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

  const handleCheckout = async () => {
    if (!isBuyNowCheckout && !selectedAddress && addresses.length > 0) {
      alert('Please select a shipping address');
      return;
    }

    setProcessing(true);
    
    try {
      const endpoint = isBuyNowCheckout ? `/buy-now/checkout/${order!.order_id}` : '/cart/checkout';
      const payload = isBuyNowCheckout 
        ? { provider: selectedPayment }
        : { provider: selectedPayment, address_id: selectedAddress, notes: orderNotes };

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
    return '/image/default-product.png';
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
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
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
        <h1 className="checkout-page-title">
          <i className="fas fa-shopping-bag"></i> Checkout
        </h1>

        <div className="checkout-container">
          {/* Main Content */}
          <div className="checkout-main">
            {/* Product List Section */}
            <div className="checkout-section">
              <h2 className="checkout-section-title">
                <i className="fas fa-box"></i>
                Order Items ({items!.length})
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
                      <div className="checkout-quantity-text">Qty: {item.quantity}</div>
                      <div className="checkout-product-subtotal">
                        {formatPrice(item.total_price)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address Section */}
            {addresses.length > 0 && (
              <div className="checkout-section">
                <h2 className="checkout-section-title">
                  <i className="fas fa-map-marker-alt"></i>
                  Shipping Address
                </h2>
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
                          <span className="checkout-address-default">Default</span>
                        )}
                        <span className="checkout-address-phone">{address.phone}</span>
                      </div>
                      <div className="checkout-address-detail">
                        {address.address}, {address.ward}, {address.district}, {address.city}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Payment Method Section */}
            <div className="checkout-section">
              <h2 className="checkout-section-title">
                <i className="fas fa-credit-card"></i>
                Payment Method
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
                    <div className="checkout-payment-name">Credit/Debit Card</div>
                    <div className="checkout-payment-desc">Pay securely with Stripe</div>
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

            {/* Promotion Code Section */}
            <div className="checkout-section">
              <h2 className="checkout-section-title">
                <i className="fas fa-gift"></i>
                Promotion Code
              </h2>
              <div className="checkout-promotion-form">
                <input 
                  type="text"
                  placeholder="Enter promotion code"
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
                  Apply
                </button>
              </div>
              {appliedPromo && (
                <div className="checkout-promotion-applied">
                  <span className="checkout-promotion-applied-text">
                    <i className="fas fa-check-circle"></i> {appliedPromo.code} applied
                  </span>
                  <button onClick={handleRemovePromo} className="checkout-promotion-remove">
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Order Notes Section */}
            <div className="checkout-section">
              <h2 className="checkout-section-title">
                <i className="fas fa-sticky-note"></i>
                Order Notes (Optional)
              </h2>
              <textarea
                placeholder="Add notes about your order (e.g., delivery instructions)"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                className="checkout-notes-textarea"
              />
            </div>
          </div>

          {/* Sidebar - Order Summary */}
          <div className="checkout-sidebar">
            <div className="checkout-summary">
              <h3 className="checkout-summary-title">Order Summary</h3>
              
              <div className="checkout-summary-row">
                <span className="checkout-summary-label">Subtotal:</span>
                <span className="checkout-summary-value">{formatPrice(finalSubtotal)}</span>
              </div>

              {finalShipping > 0 && (
                <div className="checkout-summary-row">
                  <span className="checkout-summary-label">Shipping:</span>
                  <span className="checkout-summary-value">{formatPrice(finalShipping)}</span>
                </div>
              )}

              {finalDiscount > 0 && (
                <div className="checkout-summary-row">
                  <span className="checkout-summary-label">Discount:</span>
                  <span className="checkout-summary-value checkout-summary-discount">
                    -{formatPrice(finalDiscount)}
                  </span>
                </div>
              )}

              <div className="checkout-summary-row checkout-summary-total">
                <span className="checkout-summary-label">Total:</span>
                <span className="checkout-summary-value">{formatPrice(finalTotal)}</span>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={processing}
                className="checkout-payment-btn"
              >
                {processing ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Processing...
                  </>
                ) : (
                  <>
                    <i className="fas fa-lock"></i> Proceed to Payment
                  </>
                )}
              </button>

              <button 
                onClick={() => router.visit('/cart')}
                className="checkout-back-btn"
              >
                <i className="fas fa-arrow-left"></i> Back to Cart
              </button>

              <div className="checkout-security-note">
                <i className="fas fa-shield-alt"></i>
                Your payment information is secure and encrypted
              </div>
            </div>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}