<?php

namespace App\Http\Controllers;

use App\Exceptions\CartException;
use App\Http\Controllers\Controller;
use App\Http\Requests\AddToCartRequest;
use App\Http\Requests\ApplyPromotionRequest;
use App\Http\Requests\UpdateCartItemRequest;
use App\Models\CartItem;
use App\Services\CartService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function __construct(private CartService $cartService)
    {
    }

    public function index(): Response
    {
        $user = Auth::user();
        $cartItems = $this->cartService->getCartItems($user);
        $promotion = $this->cartService->getActivePromotion($user);
        $totals = $this->cartService->calculateTotals($cartItems, $promotion);

        return Inertia::render('Customer/Cart', [
            'cartItems' => $cartItems->values()->all(),
            'totals' => $totals,
            'promotion' => $promotion ? $promotion->toArray() : null,
        ]);
    }

    /**
     * Add a product variant to the cart, checking stock levels.
     */
    public function add(AddToCartRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $user = Auth::user();

        try {
            $this->cartService->addItem($user, $data['variant_id'], $data['quantity']);
        } catch (CartException $exception) {
            return back()->with('error', $exception->getMessage());
        }

        return back()->with('success', 'Product added to cart!');
    }

    /**
     * Update the quantity of a product in the cart, ensuring stock levels.
     */
    public function update(UpdateCartItemRequest $request, int $itemId): RedirectResponse
    {
        $quantity = $request->validated()['quantity'];
        $user = Auth::user();

        if ($user) {
            $cartItem = CartItem::where('user_id', $user->id)->findOrFail($itemId);
            $this->authorize('update', $cartItem);
        }

        try {
            $this->cartService->updateItem($user, $itemId, $quantity);
        } catch (CartException $exception) {
            return back()->with('error', $exception->getMessage());
        }

        if ($quantity === 0) {
            return back()->with('success', 'Product removed from cart.');
        }

        return back()->with('success', 'Cart updated.');
    }

    /**
     * Remove a product from the cart.
     */
    public function remove(int $itemId): RedirectResponse
    {
        $user = Auth::user();

        if ($user) {
            $cartItem = CartItem::where('user_id', $user->id)->findOrFail($itemId);
            $this->authorize('delete', $cartItem);
        }

        $this->cartService->removeItem($user, $itemId);

        return back()->with('success', 'Product removed from cart.');
    }

    /**
     * Clear the entire shopping cart.
     */
    public function clear(): RedirectResponse
    {
        $user = Auth::user();

        $this->cartService->clearCart($user);

        return back()->with('success', 'Cart cleared.');
    }

    /**
     * Apply a promotion code to the cart.
     */
    public function applyPromotion(ApplyPromotionRequest $request): RedirectResponse
    {
        $user = Auth::user();
        $code = $request->validated()['code'];
        $cartItems = $this->cartService->getCartItems($user);

        if ($cartItems->isEmpty()) {
            return back()->with('error', 'Your cart is empty.');
        }

        try {
            $this->cartService->applyPromotion($user, $code, $cartItems);
        } catch (CartException $exception) {
            return back()->with('error', $exception->getMessage());
        }

        return back()->with('success', 'Promotion applied!');
    }

    /**
     * Remove the applied promotion code from the cart.
     */
    public function removePromotion(): RedirectResponse
    {
        $user = Auth::user();
        $this->cartService->removePromotion($user);

        return back()->with('success', 'Promotion removed.');
    }

    /**
     * Create order from cart and redirect to payment gateway.
     */
    public function checkout(): RedirectResponse|\Illuminate\Http\JsonResponse
    {
        $user = Auth::user();
        $cartItems = $this->cartService->getCartItems($user);

        if ($cartItems->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Your cart is empty.'
            ], 400);
        }

        try {
            // Pre-check: Verify all items have sufficient stock before proceeding
            Log::info('cart.checkout.initiated', [
                'user_id' => $user->id,
                'cart_items_count' => $cartItems->count(),
            ]);

            // Create order from cart items (this internally verifies stock)
            $order = $this->cartService->createOrderFromCart($user);

            Log::info('cart.checkout.order_created', [
                'user_id' => $user->id,
                'order_id' => $order->order_id,
                'order_number' => $order->order_number,
                'total_amount' => $order->total_amount,
            ]);

            // Get payment provider (default to Stripe)
            $provider = request()->input('provider', 'stripe');
            
            try {
                $gateway = \App\Services\PaymentService::make($provider);
            } catch (\InvalidArgumentException $e) {
                Log::error('cart.checkout.invalid_provider', [
                    'user_id' => $user->id,
                    'order_id' => $order->order_id,
                    'provider' => $provider,
                    'message' => $e->getMessage(),
                ]);
                
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid payment provider selected.'
                ], 400);
            }

            // Create payment and get redirect URL
            $paymentUrl = $gateway->createPayment($order);

            Log::info('cart.checkout.payment_initiated', [
                'user_id' => $user->id,
                'order_id' => $order->order_id,
                'provider' => $provider,
                'payment_url' => $paymentUrl,
            ]);

            // Return JSON response with payment URL for client-side redirect
            return response()->json([
                'success' => true,
                'payment_url' => $paymentUrl,
                'order_id' => $order->order_id,
                'order_number' => $order->order_number,
            ]);

        } catch (CartException $exception) {
            Log::error('cart.checkout.cart_exception', [
                'user_id' => $user->id,
                'message' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString(),
            ]);
            
            return response()->json([
                'success' => false,
                'message' => $exception->getMessage()
            ], 400);
        } catch (\Throwable $exception) {
            Log::error('cart.checkout_failed', [
                'user_id' => $user->id,
                'message' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString(),
                'file' => $exception->getFile(),
                'line' => $exception->getLine(),
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Cannot process payment at this time. Please try again later.'
            ], 500);
        }
    }

    /**
     * Show the checkout page.
     */
    public function showCheckout(): Response
    {
        $user = Auth::user();
        $cartItems = $this->cartService->getCartItems($user);
        $promotion = $this->cartService->getActivePromotion($user);
        $totals = $this->cartService->calculateTotals($cartItems, $promotion);

        return Inertia::render('Customer/Checkout', [
            'cartItems' => $cartItems->values()->all(),
            'totals' => $totals,
            'promotion' => $promotion ? $promotion->toArray() : null,
        ]);
    }
}