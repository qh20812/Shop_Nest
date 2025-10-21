<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\CartItem;
use App\Services\ExchangeRateService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    /**
     * Display the checkout page.
     */
    public function index(): Response
    {
        $cartItems = CartItem::with(['variant.product'])
            ->where('user_id', Auth::id())
            ->get();

        $subtotal = $cartItems->sum(function ($item) {
            return $item->quantity * $item->variant->price;
        });

        return Inertia::render('Checkout/Index', [
            'cartItems' => $cartItems,
            'subtotal' => $subtotal,
            'availableCurrencies' => ExchangeRateService::getSupportedCurrencies(),
        ]);
    }

    /**
     * Process the checkout and create a new order with multi-currency support.
     */
    public function store(Request $request): RedirectResponse
    {
        $supportedCurrencies = implode(',', ExchangeRateService::getSupportedCurrencies());
        
        $request->validate([
            'currency' => "required|string|in:{$supportedCurrencies}",
            'shipping_address_id' => 'required|exists:user_addresses,id',
            'payment_method' => 'required|integer|in:1,2,3',
            'notes' => 'nullable|string|max:500',
        ]);

        DB::beginTransaction();
        
        try {
            // Get user's cart items
            $cartItems = CartItem::with(['variant.product'])
                ->where('user_id', Auth::id())
                ->get();

            if ($cartItems->isEmpty()) {
                return redirect()->route('cart.index')
                    ->with('error', 'Your cart is empty.');
            }

            // Calculate order totals
            $subtotal = $cartItems->sum(function ($item) {
                return $item->quantity * $item->variant->price;
            });

            $shippingFee = $this->calculateShippingFee($subtotal);
            $discountAmount = 0; // Apply discount logic here if needed
            $totalAmount = $subtotal + $shippingFee - $discountAmount;

            // Get currency and exchange rate
            $currency = $request->input('currency');
            $exchangeRate = $this->getExchangeRate($currency);
            
            // Calculate base currency amount (USD)
            $totalAmountBase = $this->convertToBaseCurrency($totalAmount, $currency);

            // Create the order
            $order = Order::create([
                'customer_id' => Auth::id(),
                'order_number' => $this->generateOrderNumber(),
                'sub_total' => $subtotal,
                'shipping_fee' => $shippingFee,
                'discount_amount' => $discountAmount,
                'total_amount' => $totalAmount,
                'currency' => $currency,
                'exchange_rate' => $exchangeRate,
                'total_amount_base' => $totalAmountBase,
                'status' => 0, // Pending
                'payment_method' => $request->input('payment_method'),
                'payment_status' => 0, // Unpaid
                'shipping_address_id' => $request->input('shipping_address_id'),
                'notes' => $request->input('notes'),
            ]);

            // Create order items
            foreach ($cartItems as $cartItem) {
                $order->items()->create([
                    'variant_id' => $cartItem->variant_id,
                    'quantity' => $cartItem->quantity,
                    'unit_price' => $cartItem->variant->price,
                    'total_price' => $cartItem->quantity * $cartItem->variant->price,
                    'original_currency' => $currency,
                    'original_unit_price' => $cartItem->variant->price,
                    'original_total_price' => $cartItem->quantity * $cartItem->variant->price,
                ]);
            }

            // Clear the cart
            CartItem::where('user_id', Auth::id())->delete();

            DB::commit();

            return redirect()->route('orders.show', $order->order_id)
                ->with('success', 'Order placed successfully!');

        } catch (\Exception $e) {
            DB::rollBack();
            
            return redirect()->back()
                ->with('error', 'Failed to process order. Please try again.');
        }
    }

    /**
     * Get exchange rate for the given currency to USD.
     */
    private function getExchangeRate(string $currency): float
    {
        return ExchangeRateService::getRate($currency, 'USD');
    }

    /**
     * Convert amount to base currency (USD).
     */
    private function convertToBaseCurrency(float $amount, string $currency): float
    {
        return ExchangeRateService::convert($amount, $currency, 'USD');
    }

    /**
     * Calculate shipping fee based on subtotal.
     */
    private function calculateShippingFee(float $subtotal): float
    {
        // Example shipping logic
        if ($subtotal >= 100) {
            return 0; // Free shipping for orders over $100
        }
        
        return 10; // Standard shipping fee
    }

    /**
     * Generate a unique order number.
     */
    private function generateOrderNumber(): string
    {
        return 'ORD-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -6));
    }
}
