<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\ProductVariant;
use App\Models\Promotion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    /**
     * Display the shopping cart with items, totals, and applied promotions.
     */
    public function index(Request $request): Response
    {
        $user = Auth::user();
        $cartItems = CartItem::where('user_id', $user->id)->with('variant.product')->get();
        $promotion = $this->getActivePromotion($user); // Fetch applied promotion if any

        $totals = $this->calculateTotals($cartItems, $promotion);

        return Inertia::render('User/Cart/Index', [
            'cartItems' => $cartItems,
            'totals' => $totals,
            'promotion' => $promotion,
        ]);
    }

    /**
     * Add a product variant to the cart, checking stock levels.
     */
    public function add(Request $request)
    {
        $validated = $request->validate([
            'variant_id' => 'required|exists:product_variants,variant_id',
            'quantity' => 'required|integer|min:1',
        ]);

        $variantId = $validated['variant_id'];
        $quantity = $validated['quantity'];
        $user = Auth::user();

        $variant = ProductVariant::find($variantId);
        if (!$this->checkStock($variant, $quantity)) {
            return back()->with('error', 'Insufficient stock.');
        }

        CartItem::updateOrCreate(
            ['user_id' => $user->id, 'variant_id' => $variantId],
            ['quantity' => DB::raw("quantity + $quantity")]
        );

        return back()->with('success', 'Product added to cart!');
    }

    /**
     * Update the quantity of a product in the cart, ensuring stock levels.
     */
    public function update(Request $request, $itemId)
    {
        $validated = $request->validate([
            'quantity' => 'required|integer|min:0', // Allow 0 to remove item
        ]);

        $quantity = $validated['quantity'];
        $user = Auth::user();

        $cartItem = CartItem::where('user_id', $user->id)->findOrFail($itemId);
        $variant = $cartItem->variant;

        if ($quantity > 0) {
            if (!$this->checkStock($variant, $quantity)) {
                return back()->with('error', 'Insufficient stock.');
            }
            $cartItem->update(['quantity' => $quantity]);
        } else {
            // Remove the item if quantity is set to 0
            $this->remove($itemId);
            return;
        }

        return back()->with('success', 'Cart updated.');
    }

    /**
     * Remove a product from the cart.
     */
    public function remove($itemId)
    {
        $user = Auth::user();
        CartItem::where('user_id', $user->id)->findOrFail($itemId)->delete();

        return back()->with('success', 'Product removed from cart.');
    }

    /**
     * Clear the entire shopping cart.
     */
    public function clear()
    {
        $user = Auth::user();
        CartItem::where('user_id', $user->id)->delete();

        return back()->with('success', 'Cart cleared.');
    }

    /**
     * Apply a promotion code to the cart.
     */
    public function applyPromotion(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string',
        ]);

        $code = $validated['code'];
        $user = Auth::user();

        // Validate promotion code, conditions, time, usage limits, etc.
        $promotion = Promotion::where('code', $code)
            ->where('is_active', true)
            ->first();

        if (!$promotion) {
            return back()->with('error', 'Invalid promotion code.');
        }

        // Check if promotion is valid for the user
        if ($promotion->usage_limit_per_user !== null && $promotion->users()->where('user_id', $user->id)->exists()) {
            return back()->with('error', 'You have already used this promotion.');
        }

        // Store the promotion ID in session or a dedicated cart table
        session(['applied_promotion_id' => $promotion->promotion_id]);

        return back()->with('success', 'Promotion applied!');
    }

    /**
     * Remove the applied promotion code from the cart.
     */
    public function removePromotion()
    {
        session()->forget('applied_promotion_id');

        return back()->with('success', 'Promotion removed.');
    }

    /**
     * Move cart data to the checkout page, re-verifying promotion and stock.
     */
    public function checkout(Request $request)
    {
        $user = Auth::user();
        $cartItems = CartItem::where('user_id', $user->id)->with('variant.product')->get();
        $promotion = $this->getActivePromotion($user);

        // Re-verify stock and promotion
        foreach ($cartItems as $cartItem) {
            if (!$this->checkStock($cartItem->variant, $cartItem->quantity)) {
                return redirect()->route('cart.index')->with('error', 'Insufficient stock for some items.');
            }
        }

        // Calculate totals
        $totals = $this->calculateTotals($cartItems, $promotion);

        // Store cart data in session or pass it to the checkout view
        session(['checkout_data' => [
            'cartItems' => $cartItems->toArray(),
            'totals' => $totals,
            'promotion' => $promotion ? $promotion->toArray() : null,
        ]]);

        return redirect()->route('checkout.index'); // Redirect to checkout page
    }

    /**
     * Get active promotion
     */
    private function getActivePromotion($user)
    {
        $promotionId = session('applied_promotion_id');

        if ($promotionId) {
            // Load promotion and validate
            $promotion = Promotion::find($promotionId);

            if (!$promotion || !$promotion->is_active) {
                session()->forget('applied_promotion_id');
                return null;
            }

            return $promotion;
        }

        return null;
    }

    /**
     * Calculate cart totals, including discounts from promotions.
     */
    protected function calculateTotals($cartItems, $promotion = null): array
    {
        $subtotal = 0;
        foreach ($cartItems as $item) {
            $subtotal += $item->variant->price * $item->quantity;
        }

        $discountAmount = 0;
        if ($promotion) {
            // Calculate discount based on promotion type (percentage or fixed amount)
            if ($promotion->type == 1) { // Percentage
                $discountAmount = ($subtotal * $promotion->value) / 100;
                if ($discountAmount > $promotion->max_discount_amount) {
                    $discountAmount = $promotion->max_discount_amount;
                }
            } else { // Fixed Amount
                $discountAmount = $promotion->value;
            }
        }

        $total = $subtotal - $discountAmount;

        return [
            'subtotal' => $subtotal,
            'discount' => $discountAmount,
            'total' => $total,
        ];
    }

    /**
     * Check if there is enough stock for a product.
     */
    protected function checkStock(ProductVariant $variant, int $quantity): bool
    {
        if ($variant->stock_quantity < $quantity) {
            Log::warning("Insufficient stock for product {$variant->product->name}", [
                'product_id' => $variant->product->product_id,
                'requested_quantity' => $quantity,
                'available_quantity' => $variant->stock_quantity,
            ]);
            return false;
        }
        return true;
    }
}