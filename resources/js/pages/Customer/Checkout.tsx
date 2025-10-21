import React from 'react';
import { usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import HomeLayout from '@/layouts/app/HomeLayout';

interface CartItem {
  id: number;
  product_name: string;
  quantity: number;
  total_price: number;
}

interface Totals {
  total: number;
}

interface PageProps {
  cartItems: CartItem[];
  totals: Totals;
  promotion: any;
  [key: string]: any;
}

export default function Checkout() {
  const { cartItems, totals } = usePage<PageProps>().props;

  const handleCheckout = () => {
    router.post('/cart/checkout');
  };

  return (
    <HomeLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.product_name} x {item.quantity}</span>
                  <span>${item.total_price}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span>${totals.total}</span>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Payment</h2>
            <button onClick={handleCheckout} className="w-full bg-blue-600 text-white py-2 px-4 rounded">
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}