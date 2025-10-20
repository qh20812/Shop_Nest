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

        return Inertia::render('User/Cart/Index', [
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
     * Move cart data to the checkout page, re-verifying promotion and stock.
     */
    public function checkout(): RedirectResponse
    {
        $user = Auth::user();
        $cartItems = $this->cartService->getCartItems($user);

        if ($cartItems->isEmpty()) {
            return redirect()->route('cart.index')->with('error', 'Your cart is empty.');
        }

        try {
            $this->cartService->prepareCheckoutData($user);
        } catch (CartException $exception) {
            return redirect()->route('cart.index')->with('error', $exception->getMessage());
        }

        return redirect()->route('cart.checkout');
    }
}