import React, { useState } from 'react';
import Navbar from '@/components/home/ui/Navbar';
import '@/../css/Home.css';
import Footer from '@/components/home/ui/Footer';
import CartTitle from '@/components/cart/CartTitle';
import CartColumnTitle from '@/components/cart/CartColumnTitle';
import CartShopCard from '@/components/cart/CartShopCard';

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
  // Sample data - replace with real data from props or API
  const [shops] = useState<Shop[]>([
    {
      id: 1,
      name: "Fashion Store",
      products: [
        {
          id: 1,
          name: "Quần tây đen chuẩn vải âu",
          image: "/image/ShopnestLogo.png",
          variant: "Đen, Size L",
          price: 500000,
          quantity: 1,
          maxQuantity: 10
        },
        {
          id: 2,
          name: "Áo sơ mi trắng công sở",
          image: "/image/ShopnestLogo.png",
          variant: "Trắng, Size M",
          price: 350000,
          quantity: 2,
          maxQuantity: 5
        }
      ]
    },
    {
      id: 2,
      name: "Tech World",
      products: [
        {
          id: 3,
          name: "Tai nghe Bluetooth cao cấp",
          image: "/image/ShopnestLogo.png",
          variant: "Đen, Wireless",
          price: 1200000,
          quantity: 1,
          maxQuantity: 3
        }
      ]
    }
  ]);

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
    <>
      <Navbar />
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
              <button className="checkout-btn" type="button">
                Mua hàng
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
