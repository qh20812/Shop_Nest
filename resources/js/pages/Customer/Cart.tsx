import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import '@/../css/Home.css';
import CartTitle from '@/components/cart/CartTitle';
import CartColumnTitle from '@/components/cart/CartColumnTitle';
import CartShopCard from '@/components/cart/CartShopCard';
import HomeLayout from '@/layouts/app/HomeLayout';

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
}

interface PageProps {
  cartItems: CartItem[];
  totals: Totals;
  promotion: Promotion | null;
  [key: string]: unknown;
}

interface CartProduct {
  id: number;
  name: string;
  image: string;
  variant: string;
  price: number;
  quantity: number;
  maxQuantity?: number;
}

interface Shop {
  id: number;
  name: string;
  products: CartProduct[];
}

export default function Cart() {
  const { cartItems, promotion } = usePage<PageProps>().props;

  // Transform cartItems to shops format
  const shops: Shop[] = React.useMemo(() => {
    const shopMap = new Map<number, Shop>();

    cartItems.forEach((item) => {
      const product = item.variant.product;
      if (!product) return;

      const shopId = product.product_id; // Using product_id as shop_id for simplicity
      const shopName = 'Shop'; // You might want to get actual shop name

      if (!shopMap.has(shopId)) {
        shopMap.set(shopId, {
          id: shopId,
          name: shopName,
          products: []
        });
      }

      const shop = shopMap.get(shopId)!;
      shop.products.push({
        id: item.cart_item_id,
        name: product.name,
        image: '/image/ShopnestLogo.png', // Default image
        variant: item.variant.sku,
        price: item.price,
        quantity: item.quantity,
        maxQuantity: item.variant.available_quantity
      });
    });

    return Array.from(shopMap.values());
  }, [cartItems]);

  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

  const allProducts = shops.flatMap(shop => shop.products);
  const isAllSelected = allProducts.length > 0 && allProducts.every(product => 
    selectedProducts.includes(product.id)
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(allProducts.map(product => product.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectShop = (shopId: number, checked: boolean) => {
    const shop = shops.find(s => s.id === shopId);
    if (!shop) return;

    const shopProductIds = shop.products.map(p => p.id);
    
    if (checked) {
      setSelectedProducts(prev => [
        ...prev.filter(id => !shopProductIds.includes(id)),
        ...shopProductIds
      ]);
    } else {
      setSelectedProducts(prev => prev.filter(id => !shopProductIds.includes(id)));
    }
  };

  const handleSelectProduct = (productId: number, checked: boolean) => {
    if (checked) {
      setSelectedProducts(prev => [...prev, productId]);
    } else {
      setSelectedProducts(prev => prev.filter(id => id !== productId));
    }
  };

  const handleQuantityChange = (productId: number, quantity: number) => {
    // Update quantity logic here
    console.log(`Update product ${productId} quantity to ${quantity}`);
  };

  const handleRemoveProduct = (productId: number) => {
    // Remove product logic here
    console.log(`Remove product ${productId}`);
  };

  const selectedTotal = allProducts
    .filter(product => selectedProducts.includes(product.id))
    .reduce((sum, product) => sum + (product.price * product.quantity), 0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <HomeLayout>
      <div className="cart-container">
        <CartTitle title="Giỏ hàng của tôi" />
        
        <CartColumnTitle 
          isAllSelected={isAllSelected}
          onSelectAll={handleSelectAll}
        />

        <div className="cart-content">
          {shops.map(shop => (
            <CartShopCard
              key={shop.id}
              shop={shop}
              selectedProducts={selectedProducts}
              onSelectShop={(checked) => handleSelectShop(shop.id, checked)}
              onSelectProduct={handleSelectProduct}
              onQuantityChange={handleQuantityChange}
              onRemoveProduct={handleRemoveProduct}
            />
          ))}
        </div>

        {selectedProducts.length > 0 && (
          <div className="cart-checkout-summary">
            <div className="checkout-summary-content">
              <div className="summary-info">
                <span>Tổng thanh toán ({selectedProducts.length} sản phẩm): </span>
                <span className="total-price">{formatPrice(selectedTotal)}</span>
              </div>
              {promotion && (
                <div className="promotion-info">
                  <span>Mã khuyến mãi: {promotion.code}</span>
                </div>
              )}
              <button 
                className="checkout-btn" 
                type="button"
                onClick={handleCheckout}
              >
                Mua hàng
              </button>
            </div>
          </div>
        )}
      </div>
    </HomeLayout>
  );
}

  const handleCheckout = () => {
    // Use Inertia router to POST to checkout endpoint
    router.post('/cart/checkout', {
      provider: 'stripe', // Default to Stripe, can be changed to 'paypal'
    }, {
      onError: (errors: Record<string, string>) => {
        console.error('Checkout failed:', errors);
      },
    });
  };
