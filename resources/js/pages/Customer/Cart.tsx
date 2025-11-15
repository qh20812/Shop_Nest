import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import axios from 'axios';
import HomeLayout from '@/layouts/app/HomeLayout';
import '@/../css/cart-page.css';

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

export default function Cart() {
  const { cartItems, totals, promotion } = usePage<PageProps>().props;
  const [selectedItems, setSelectedItems] = useState<number[]>(cartItems.map(item => item.cart_item_id));
  const [couponCode, setCouponCode] = useState('');
  const [quantities, setQuantities] = useState<Record<number, number>>(
    cartItems.reduce((acc, item) => ({ ...acc, [item.cart_item_id]: item.quantity }), {})
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const isAllSelected = cartItems.length > 0 && selectedItems.length === cartItems.length;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(cartItems.map(item => item.cart_item_id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (itemId: number, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, itemId]);
    } else {
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    }
  };

  const handleQuantityChange = async (itemId: number, newQuantity: number) => {
    const item = cartItems.find(i => i.cart_item_id === itemId);
    if (!item) return;

    const clampedQuantity = Math.max(1, Math.min(item.variant.available_quantity, newQuantity));
    setQuantities(prev => ({ ...prev, [itemId]: clampedQuantity }));
  };

  const handleUpdateCart = async () => {
    try {
      for (const [itemId, quantity] of Object.entries(quantities)) {
        await axios.put(`/cart/${itemId}`, { quantity: Number(quantity) });
      }
      router.reload();
    } catch (error) {
      console.error('Failed to update cart:', error);
      alert('Không thể cập nhật giỏ hàng');
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      await axios.delete(`/cart/${itemId}`);
      router.reload();
    } catch (error) {
      console.error('Failed to remove item:', error);
      alert('Không thể xóa sản phẩm');
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0) return;
    
    if (!confirm(`Bạn có chắc muốn xóa ${selectedItems.length} sản phẩm đã chọn?`)) return;

    try {
      await Promise.all(selectedItems.map(itemId => axios.delete(`/cart/${itemId}`)));
      router.reload();
    } catch (error) {
      console.error('Failed to delete selected items:', error);
      alert('Không thể xóa sản phẩm đã chọn');
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    try {
      await axios.post('/cart/apply-promotion', { code: couponCode });
      router.reload();
      setCouponCode('');
    } catch (error) {
      console.error('Failed to apply coupon:', error);
      alert('Mã khuyến mãi không hợp lệ');
    }
  };

  const handleCheckout = async () => {
    if (selectedItems.length === 0) {
      alert('Vui lòng chọn ít nhất một sản phẩm để thanh toán');
      return;
    }

    try {
      const response = await axios.post('/cart/checkout', {
        provider: 'stripe',
      });

      if (response.data?.success && response.data?.payment_url) {
        window.location.href = response.data.payment_url;
      } else {
        alert(response.data?.message || 'Không thể xử lý thanh toán');
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Không thể xử lý thanh toán';
        alert(errorMessage);
      } else {
        alert('Đã xảy ra lỗi không xác định');
      }
    }
  };

  const selectedTotal = cartItems
    .filter(item => selectedItems.includes(item.cart_item_id))
    .reduce((sum, item) => {
      const quantity = quantities[item.cart_item_id] || item.quantity;
      const price = item.discount_price || item.price;
      return sum + (price * quantity);
    }, 0);

  const selectedCount = selectedItems.length;

  if (cartItems.length === 0) {
    return (
      <HomeLayout>
        <div className="cart-page-container">
          <div className="cart-empty-state">
            <div className="cart-empty-icon">
              <span className="material-symbols-outlined" style={{ fontSize: '64px' }}>shopping_cart</span>
            </div>
            <h4 className="cart-empty-title">Giỏ hàng trống</h4>
            <p className="cart-empty-text">
              Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy tiếp tục mua sắm và thêm sản phẩm yêu thích!
            </p>
            <button 
              className="cart-action-btn cart-continue-shopping-btn"
              onClick={() => router.visit('/')}
            >
              <span className="material-symbols-outlined">arrow_back</span>
              <span>Tiếp tục mua sắm</span>
            </button>
          </div>
        </div>
      </HomeLayout>
    );
  }

  return (
    <HomeLayout>
      <div className="cart-page-container">
        <div className="cart-grid">
          <div className="cart-items-section">
            <div className="cart-select-all-header">
              <div className="cart-select-all-left">
                <input
                  type="checkbox"
                  className="cart-checkbox"
                  checked={isAllSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
                <label className="cart-select-all-label">
                  Chọn tất cả ({cartItems.length} sản phẩm)
                </label>
              </div>
              <button className="cart-delete-selected-btn" onClick={handleDeleteSelected}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                Xóa
              </button>
            </div>

            <div className="cart-items-list">
              {cartItems.map((item) => {
                const product = item.variant.product;
                if (!product) return null;

                const productImage = product.images?.[0]?.image_url || '/image/ShopnestLogo.png';
                const currentQuantity = quantities[item.cart_item_id] || item.quantity;
                const itemTotal = (item.discount_price || item.price) * currentQuantity;
                const hasDiscount = item.discount_price && item.discount_price < item.price;

                return (
                  <div key={item.cart_item_id} className="cart-shop-card">
                    <div className="cart-shop-header">
                      <input
                        type="checkbox"
                        className="cart-checkbox"
                        checked={selectedItems.includes(item.cart_item_id)}
                        onChange={(e) => handleSelectItem(item.cart_item_id, e.target.checked)}
                      />
                      <div 
                        className="cart-shop-avatar"
                        style={{ backgroundImage: `url(${productImage})` }}
                      />
                      <span className="cart-shop-name">ShopNest Official</span>
                    </div>

                    <div className="cart-products-list">
                      <div className="cart-product-item">
                        <div className="cart-product-left">
                          <input
                            type="checkbox"
                            className="cart-checkbox cart-product-checkbox"
                            checked={selectedItems.includes(item.cart_item_id)}
                            onChange={(e) => handleSelectItem(item.cart_item_id, e.target.checked)}
                          />
                          <div 
                            className="cart-product-image"
                            style={{ backgroundImage: `url(${productImage})` }}
                          />
                          <div className="cart-product-info">
                            <p className="cart-product-name">{product.name}</p>
                            <p className="cart-product-variant">SKU: {item.variant.sku}</p>
                            <div className="cart-product-prices">
                              {hasDiscount && (
                                <p className="cart-product-original-price">{formatPrice(item.price)}</p>
                              )}
                              <p className={hasDiscount ? 'cart-product-sale-price' : 'cart-product-regular-price'}>
                                {formatPrice(item.discount_price || item.price)}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="cart-product-right">
                          <div className="cart-quantity-control">
                            <button
                              className="cart-quantity-btn"
                              onClick={() => handleQuantityChange(item.cart_item_id, currentQuantity - 1)}
                              disabled={currentQuantity <= 1}
                            >
                              -
                            </button>
                            <input
                              type="text"
                              className="cart-quantity-input"
                              value={currentQuantity}
                              onChange={(e) => {
                                const value = parseInt(e.target.value) || 1;
                                handleQuantityChange(item.cart_item_id, value);
                              }}
                            />
                            <button
                              className="cart-quantity-btn"
                              onClick={() => handleQuantityChange(item.cart_item_id, currentQuantity + 1)}
                              disabled={currentQuantity >= item.variant.available_quantity}
                            >
                              +
                            </button>
                          </div>
                          <p className="cart-product-total">{formatPrice(itemTotal)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="cart-actions">
              <button 
                className="cart-action-btn cart-continue-shopping-btn"
                onClick={() => router.visit('/')}
              >
                <span className="material-symbols-outlined">arrow_back</span>
                <span>Tiếp tục mua sắm</span>
              </button>
              <button 
                className="cart-action-btn cart-update-btn"
                onClick={handleUpdateCart}
              >
                <span className="material-symbols-outlined">refresh</span>
                <span>Cập nhật giỏ hàng</span>
              </button>
            </div>
          </div>

          <div className="cart-summary">
            <h2 className="cart-summary-title">Tóm tắt đơn hàng</h2>

            <div className="cart-coupon-section">
              <div className="cart-coupon-input-wrapper">
                <div className="cart-coupon-input-container">
                  <input
                    type="text"
                    className="cart-coupon-input"
                    placeholder="Nhập mã khuyến mãi"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <button className="cart-apply-coupon-btn" onClick={handleApplyCoupon}>
                    Áp dụng
                  </button>
                </div>
                <button className="cart-select-voucher-btn">Chọn voucher</button>
              </div>
            </div>

            <div className="cart-summary-details">
              <div className="cart-summary-row">
                <span className="cart-summary-label">Tạm tính ({selectedCount} sản phẩm)</span>
                <span className="cart-summary-value">{formatPrice(selectedTotal)}</span>
              </div>
              {promotion && (
                <div className="cart-summary-row">
                  <span className="cart-summary-label">Giảm giá khuyến mãi</span>
                  <span className="cart-summary-discount">-{formatPrice(totals.discount)}</span>
                </div>
              )}
              <div className="cart-summary-row">
                <span className="cart-summary-label">Phí vận chuyển</span>
                <span className="cart-summary-value">{formatPrice(totals.shipping || 30000)}</span>
              </div>
            </div>

            <div className="cart-summary-divider" />

            <div className="cart-summary-total">
              <span>Tổng cộng</span>
              <span>{formatPrice(selectedTotal + (totals.shipping || 30000) - (totals.discount || 0))}</span>
            </div>

            <button 
              className="cart-checkout-btn"
              onClick={handleCheckout}
              disabled={selectedCount === 0}
            >
              <span>Tiến hành thanh toán</span>
            </button>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}
