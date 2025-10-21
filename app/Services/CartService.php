<?php

namespace App\Services;

use App\Exceptions\CartException;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Events\Cart\LowStockDetected;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\ProductVariant;
use App\Models\Promotion;
use App\Models\PromotionCode;
use App\Models\User;
use Illuminate\Contracts\Cache\Repository as CacheRepository;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Throwable;

class CartService
{
    private const SESSION_APPLIED_PROMOTION_KEY = 'cart.applied_promotion';
    private const SESSION_GUEST_PROMOTION_KEY = 'cart.guest_promotion';
    private const SESSION_GUEST_ITEMS_KEY = 'cart.guest_items';

    public function __construct(private CacheRepository $cache)
    {
    }

    public function getCartItems(?User $user): Collection
    {
        if ($user) {
            $results = collect();

            CartItem::with(['variant.product'])
                ->where('user_id', $user->id)
                ->orderBy('cart_item_id')
                ->chunkById(100, function ($chunk) use (&$results) {
                    foreach ($chunk as $item) {
                        $results->push(
                            $this->transformCartItem(
                                $item->variant,
                                $item->quantity,
                                $item
                            )
                        );
                    }
                });

            return $results;
        }

        $sessionItems = collect(session(self::SESSION_GUEST_ITEMS_KEY, []));

        return $sessionItems->map(function (array $payload) {
            $variant = $this->getVariantById((int) ($payload['variant_id'] ?? 0));
            $quantity = (int) ($payload['quantity'] ?? 0);

            return $this->transformCartItem($variant, $quantity);
        });
    }

    public function addItem(?User $user, int $variantId, int $quantity): array
    {
        return $user
            ? $this->addItemForUser($user, $variantId, $quantity)
            : $this->addItemForGuest($variantId, $quantity);
    }

    public function updateItem(?User $user, int $cartItemId, int $quantity): array
    {
        return $user
            ? $this->updateItemForUser($user, $cartItemId, $quantity)
            : $this->updateItemForGuest($cartItemId, $quantity);
    }

    public function removeItem(?User $user, int $cartItemId): void
    {
        if ($user) {
            $this->removeItemForUser($user, $cartItemId);
            return;
        }

        $this->removeItemForGuest($cartItemId);
    }

    public function clearCart(?User $user): void
    {
        if ($user) {
            CartItem::where('user_id', $user->id)->delete();
        } else {
            session()->forget(self::SESSION_GUEST_ITEMS_KEY);
        }

        $this->removePromotion($user);
    }

    public function applyPromotion(?User $user, string $code, Collection $cartItems): Promotion
    {
        $promotionCode = $this->getPromotionCodeByCode($code);
        $promotion = $promotionCode->promotion()->withTrashed()->first();

        if (!$promotion) {
            throw CartException::promotionNotFound($code);
        }

        if (!$promotion->is_active || !$promotionCode->is_active) {
            throw CartException::promotionInactive($code);
        }

        if ($promotion->start_date && now()->lt($promotion->start_date)) {
            throw CartException::promotionInactive($code);
        }

        if ($promotion->end_date && now()->gt($promotion->end_date)) {
            throw CartException::promotionInactive($code);
        }

        if ($promotion->usage_limit !== null && $promotion->used_count >= $promotion->usage_limit) {
            throw CartException::promotionUsageLimitReached($code);
        }

        if ($promotionCode->usage_limit !== null && $promotionCode->used_count >= $promotionCode->usage_limit) {
            throw CartException::promotionUsageLimitReached($code);
        }

        if ($promotion->isBudgetExceeded()) {
            throw CartException::promotionBudgetExceeded($code);
        }

        if (!$promotion->canBeUsed()) {
            throw CartException::promotionInactive($code);
        }

        $subtotal = $this->calculateSubtotal($cartItems);
        if ($promotion->min_order_amount && $subtotal < (float) $promotion->min_order_amount) {
            throw CartException::promotionMinimumNotMet($code);
        }

        if ($user && $promotion->per_customer_limit !== null) {
            $usageCount = Order::where('customer_id', $user->id)
                ->whereHas('promotions', function (Builder $query) use ($promotion) {
                    $query->where('promotions.promotion_id', $promotion->promotion_id);
                })
                ->count();

            if ($usageCount >= $promotion->per_customer_limit) {
                throw CartException::promotionPerCustomerLimitReached($code);
            }
        }

        $sessionKey = $user ? self::SESSION_APPLIED_PROMOTION_KEY : self::SESSION_GUEST_PROMOTION_KEY;
        session([$sessionKey => [
            'promotion_id' => $promotion->promotion_id,
            'promotion_code_id' => $promotionCode->promotion_code_id,
            'code' => $promotionCode->code,
        ]]);

        // Forget legacy keys if they exist
        session()->forget('applied_promotion_id');
        session()->forget('applied_promotion_code_id');
        session()->forget('applied_promotion_code');

        return $promotion;
    }

    public function removePromotion(?User $user): void
    {
        $sessionKey = $user ? self::SESSION_APPLIED_PROMOTION_KEY : self::SESSION_GUEST_PROMOTION_KEY;
        session()->forget($sessionKey);

        session()->forget('applied_promotion_id');
        session()->forget('applied_promotion_code_id');
        session()->forget('applied_promotion_code');
    }

    public function getActivePromotion(?User $user): ?Promotion
    {
        $sessionKey = $user ? self::SESSION_APPLIED_PROMOTION_KEY : self::SESSION_GUEST_PROMOTION_KEY;
        $payload = session($sessionKey);

        if (!$payload && session()->has('applied_promotion_id')) {
            $payload = [
                'promotion_id' => session('applied_promotion_id'),
                'promotion_code_id' => session('applied_promotion_code_id'),
                'code' => session('applied_promotion_code'),
            ];

            session([$sessionKey => $payload]);
            session()->forget('applied_promotion_id');
            session()->forget('applied_promotion_code_id');
            session()->forget('applied_promotion_code');
        }

        if (!$payload) {
            return null;
        }

        $promotion = Promotion::find($payload['promotion_id']);

        if (!$promotion || !$promotion->canBeUsed()) {
            session()->forget($sessionKey);
            return null;
        }

        $promotionCode = $this->getPromotionCodeById((int) ($payload['promotion_code_id'] ?? 0));
        if (!$promotionCode || !$promotionCode->is_active) {
            session()->forget($sessionKey);
            return null;
        }

        return $promotion;
    }

    public function calculateTotals(Collection $cartItems, ?Promotion $promotion = null): array
    {
        $subtotal = $this->calculateSubtotal($cartItems);
        $discount = 0.0;

        if ($promotion) {
            $discount = $this->calculatePromotionDiscount($promotion, $subtotal);
        }

        $total = max(0, $subtotal - $discount);

        return [
            'subtotal' => round($subtotal, 2),
            'discount' => round($discount, 2),
            'total' => round($total, 2),
        ];
    }

    public function prepareCheckoutData(?User $user): array
    {
        $cartItems = $this->getCartItems($user);

        if ($cartItems->isEmpty()) {
            return [];
        }

        $promotion = $this->getActivePromotion($user);
        $this->verifyStockForCheckout($user, $cartItems);

        $totals = $this->calculateTotals($cartItems, $promotion);

        session(['checkout_data' => [
            'cartItems' => $cartItems->map(fn (array $item) => $item)->toArray(),
            'totals' => $totals,
            'promotion' => $promotion ? $promotion->toArray() : null,
        ]]);

        return session('checkout_data', []);
    }

    public function mergeGuestCartIntoUser(User $user): void
    {
        $guestItems = collect(session(self::SESSION_GUEST_ITEMS_KEY, []));

        if ($guestItems->isEmpty()) {
            return;
        }

        foreach ($guestItems as $payload) {
            $variantId = (int) ($payload['variant_id'] ?? 0);
            $quantity = (int) ($payload['quantity'] ?? 0);

            if ($variantId <= 0 || $quantity <= 0) {
                continue;
            }

            try {
                $this->addItemForUser($user, $variantId, $quantity);
            } catch (CartException $exception) {
                Log::warning('Unable to merge guest cart item into user cart.', [
                    'user_id' => $user->id,
                    'variant_id' => $variantId,
                    'quantity' => $quantity,
                    'message' => $exception->getMessage(),
                ]);
            }
        }

        session()->forget(self::SESSION_GUEST_ITEMS_KEY);

        $guestPromotion = session(self::SESSION_GUEST_PROMOTION_KEY);
        if ($guestPromotion && isset($guestPromotion['code'])) {
            try {
                $this->applyPromotion($user, $guestPromotion['code'], $this->getCartItems($user));
            } catch (CartException $exception) {
                Log::info('Guest promotion could not be merged into authenticated cart.', [
                    'user_id' => $user->id,
                    'code' => $guestPromotion['code'],
                    'message' => $exception->getMessage(),
                ]);
            }
        }

        session()->forget(self::SESSION_GUEST_PROMOTION_KEY);
    }

    private function addItemForUser(User $user, int $variantId, int $quantity): array
    {
        $cartItem = null;
        $variant = null;

        DB::transaction(function () use ($user, $variantId, $quantity, &$cartItem, &$variant) {
            $variant = ProductVariant::with('product')
                ->lockForUpdate()
                ->findOrFail($variantId);

            $existing = CartItem::where('user_id', $user->id)
                ->where('variant_id', $variantId)
                ->lockForUpdate()
                ->first();

            $newQuantity = $quantity + ($existing?->quantity ?? 0);

            $this->ensureStock($variant, $newQuantity);

            $cartItem = CartItem::updateOrCreate(
                ['user_id' => $user->id, 'variant_id' => $variantId],
                ['quantity' => $newQuantity]
            );
        });

        if (!$cartItem) {
            throw new CartException('Failed to add item to cart.');
        }

        if ($variant) {
            $this->cache->forget($this->variantCacheKey($variant->variant_id));
        }

        $cartItem->loadMissing('variant.product');

        return $this->transformCartItem($cartItem->variant, $cartItem->quantity, $cartItem);
    }

    private function addItemForGuest(int $variantId, int $quantity): array
    {
        $variant = $this->getVariantById($variantId);
        $items = collect(session(self::SESSION_GUEST_ITEMS_KEY, []));

        $index = $items->search(fn (array $item) => (int) ($item['variant_id'] ?? 0) === $variantId);
        $currentQuantity = $index !== false ? (int) $items[$index]['quantity'] : 0;
        $newQuantity = $currentQuantity + $quantity;

        $this->ensureStock($variant, $newQuantity);

        if ($index === false) {
            $items->push([
                'variant_id' => $variantId,
                'quantity' => $newQuantity,
            ]);
        } else {
            $items[$index]['quantity'] = $newQuantity;
        }

        session([self::SESSION_GUEST_ITEMS_KEY => $items->values()->all()]);

        return $this->transformCartItem($variant, $newQuantity);
    }

    private function updateItemForUser(User $user, int $cartItemId, int $quantity): array
    {
        $cartItem = CartItem::where('user_id', $user->id)
            ->with('variant.product')
            ->findOrFail($cartItemId);

        if ($quantity === 0) {
            $this->removeItemForUser($user, $cartItemId);
            return [];
        }

        DB::transaction(function () use ($cartItem, $quantity) {
            $variant = ProductVariant::with('product')
                ->lockForUpdate()
                ->findOrFail($cartItem->variant_id);

            $this->ensureStock($variant, $quantity);

            $cartItem->update(['quantity' => $quantity]);
        });

        $cartItem->refresh()->loadMissing('variant.product');

        return $this->transformCartItem($cartItem->variant, $cartItem->quantity, $cartItem);
    }

    private function updateItemForGuest(int $variantId, int $quantity): array
    {
        $items = collect(session(self::SESSION_GUEST_ITEMS_KEY, []));
        $index = $items->search(fn (array $item) => (int) ($item['variant_id'] ?? 0) === $variantId);

        if ($index === false) {
            return [];
        }

        if ($quantity === 0) {
            $items->forget($index);
            session([self::SESSION_GUEST_ITEMS_KEY => $items->values()->all()]);
            return [];
        }

        $variant = $this->getVariantById($variantId);
        $this->ensureStock($variant, $quantity);

        $items[$index]['quantity'] = $quantity;
        session([self::SESSION_GUEST_ITEMS_KEY => $items->values()->all()]);

        return $this->transformCartItem($variant, $quantity);
    }

    private function removeItemForUser(User $user, int $cartItemId): void
    {
        CartItem::where('user_id', $user->id)
            ->where('cart_item_id', $cartItemId)
            ->delete();
    }

    private function removeItemForGuest(int $variantId): void
    {
        $items = collect(session(self::SESSION_GUEST_ITEMS_KEY, []));
        $index = $items->search(fn (array $item) => (int) ($item['variant_id'] ?? 0) === $variantId);

        if ($index !== false) {
            $items->forget($index);
            session([self::SESSION_GUEST_ITEMS_KEY => $items->values()->all()]);
        }
    }

    private function verifyStockForCheckout(?User $user, Collection $cartItems): void
    {
        if (!$user) {
            session()->forget('checkout_reserved');

            Log::debug('cart.verifyStock.guest_start', ['items' => $cartItems->map(fn ($item) => [
                'variant_id' => $item['variant_id'],
                'quantity' => $item['quantity'],
            ])->all()]);

            DB::transaction(function () use ($cartItems) {
                foreach ($cartItems as $item) {
                    $variant = ProductVariant::with('product')
                        ->lockForUpdate()
                        ->findOrFail((int) $item['variant_id']);

                    $quantity = (int) $item['quantity'];
                    $this->ensureStock($variant, $quantity);
                }
            }, 3);

            Log::debug('cart.verifyStock.guest_completed');
            return;
        }

        $previousReserved = session('checkout_reserved', []);
        if (!empty($previousReserved)) {
            $this->releaseReservedQuantities($previousReserved);
        }

        session()->forget('checkout_reserved');

        $reservedSummary = [];

        DB::transaction(function () use ($cartItems, $user, &$reservedSummary) {
            Log::debug('cart.verifyStock.user_start', [
                'user_id' => $user->id,
                'items' => $cartItems->map(fn ($item) => [
                    'variant_id' => $item['variant_id'],
                    'quantity' => $item['quantity'],
                ])->all(),
            ]);

            foreach ($cartItems as $item) {
                $variant = ProductVariant::with('product')
                    ->lockForUpdate()
                    ->findOrFail((int) $item['variant_id']);

                $quantity = (int) $item['quantity'];
                $this->ensureStock($variant, $quantity);

                if ($variant->track_inventory && !$variant->reserveQuantity($quantity)) {
                    Log::warning('Failed to reserve stock during checkout.', [
                        'variant_id' => $variant->variant_id,
                        'requested_quantity' => $quantity,
                        'reserved_quantity' => $variant->reserved_quantity,
                        'available_quantity' => $this->availableQuantity($variant),
                    ]);
                    throw CartException::insufficientStock($variant, $quantity);
                }

                $reservedSummary[$variant->variant_id] = ($reservedSummary[$variant->variant_id] ?? 0) + $quantity;

                $this->cache->forget($this->variantCacheKey($variant->variant_id));
            }

            Log::debug('cart.verifyStock.user_completed', ['user_id' => $user->id]);
        });

        session(['checkout_reserved' => $reservedSummary]);
    }

    private function transformCartItem(ProductVariant $variant, int $quantity, ?CartItem $cartItem = null): array
    {
        $product = $variant->relationLoaded('product') ? $variant->product : $variant->product()->first();

        return [
            'cart_item_id' => $cartItem?->cart_item_id,
            'variant_id' => $variant->variant_id,
            'quantity' => $quantity,
            'price' => (float) $variant->price,
            'discount_price' => $variant->discount_price ? (float) $variant->discount_price : null,
            'subtotal' => (float) $variant->price * $quantity,
            'variant' => [
                'variant_id' => $variant->variant_id,
                'sku' => $variant->sku,
                'price' => (float) $variant->price,
                'discount_price' => $variant->discount_price ? (float) $variant->discount_price : null,
                'stock_quantity' => (int) $variant->stock_quantity,
                'available_quantity' => $this->availableQuantity($variant),
                'reserved_quantity' => (int) ($variant->reserved_quantity ?? 0),
                'product' => $product ? [
                    'product_id' => $product->product_id,
                    'name' => $product->name,
                ] : null,
            ],
        ];
    }

    private function ensureStock(ProductVariant $variant, int $desiredQuantity): void
    {
        if ($desiredQuantity <= 0) {
            Log::warning('Invalid quantity requested', [
                'variant_id' => $variant->variant_id,
                'desired_quantity' => $desiredQuantity,
            ]);
            throw CartException::insufficientStock($variant, $desiredQuantity);
        }

        if ((bool) ($variant->track_inventory ?? true)) {
            // When adding to cart, only check actual stock_quantity (not reserved)
            // Reservations are only enforced during checkout in verifyStockForCheckout
            $stockQuantity = (int) $variant->stock_quantity;

            Log::info('Stock check (add to cart)', [
                'variant_id' => $variant->variant_id,
                'stock_quantity' => $stockQuantity,
                'reserved_quantity' => $variant->reserved_quantity ?? 0,
                'desired_quantity' => $desiredQuantity,
            ]);

            if ($stockQuantity < $desiredQuantity) {
                Log::warning('Insufficient stock detected', [
                    'variant_id' => $variant->variant_id,
                    'stock_available' => $stockQuantity,
                    'desired' => $desiredQuantity,
                ]);
                Event::dispatch(new LowStockDetected($variant, $desiredQuantity));
                throw CartException::insufficientStock($variant, $desiredQuantity);
            }

            $minimumLevel = (int) ($variant->minimum_stock_level ?? 0);
            if ($minimumLevel > 0 && $stockQuantity <= $minimumLevel) {
                Event::dispatch(new LowStockDetected($variant, $desiredQuantity));
            }
        }
    }

    private function calculateSubtotal(Collection $cartItems): float
    {
        return $cartItems->sum(fn (array $item) => (float) ($item['price'] ?? $item['variant']['price'] ?? 0) * (int) ($item['quantity'] ?? 0));
    }

    private function calculatePromotionDiscount(Promotion $promotion, float $subtotal): float
    {
        if ($promotion->min_order_amount && $subtotal < (float) $promotion->min_order_amount) {
            return 0.0;
        }

        if ((int) $promotion->type === 1) {
            $discount = $subtotal * ((float) $promotion->value / 100);
            $maxDiscount = $promotion->max_discount_amount ? (float) $promotion->max_discount_amount : null;

            if ($maxDiscount !== null && $discount > $maxDiscount) {
                $discount = $maxDiscount;
            }

            return $discount;
        }

        if ((int) $promotion->type === 2) {
            return min((float) $promotion->value, $subtotal);
        }

        return 0.0;
    }

    private function getVariantById(int $variantId): ProductVariant
    {
        $cacheKey = $this->variantCacheKey($variantId);

        return $this->cache->remember($cacheKey, now()->addMinutes(5), function () use ($variantId) {
            return ProductVariant::with('product')->findOrFail($variantId);
        });
    }

    private function getPromotionCodeByCode(string $code): PromotionCode
    {
        $cacheKey = "cart:promotion_code:{$code}";

        $promotionCode = $this->cache->remember($cacheKey, now()->addMinutes(5), function () use ($code) {
            return PromotionCode::where('code', $code)->first();
        });

        if (!$promotionCode) {
            throw CartException::promotionNotFound($code);
        }

        return $promotionCode;
    }

    private function getPromotionCodeById(int $promotionCodeId): ?PromotionCode
    {
        if ($promotionCodeId <= 0) {
            return null;
        }

        $cacheKey = "cart:promotion_code_id:{$promotionCodeId}";

        return $this->cache->remember($cacheKey, now()->addMinutes(5), function () use ($promotionCodeId) {
            return PromotionCode::find($promotionCodeId);
        });
    }

    private function variantCacheKey(int $variantId): string
    {
        return "cart:variant:{$variantId}";
    }

    private function availableQuantity(ProductVariant $variant): int
    {
        if ($variant->available_quantity !== null) {
            return (int) $variant->available_quantity;
        }

        $stockQuantity = (int) $variant->stock_quantity;
        $reserved = (int) ($variant->reserved_quantity ?? 0);

        return max(0, $stockQuantity - $reserved);
    }

    private function releaseReservedQuantities(array $reservations): void
    {
        if (empty($reservations)) {
            return;
        }

        DB::transaction(function () use ($reservations) {
            foreach ($reservations as $variantId => $quantity) {
                $variantId = (int) $variantId;
                $quantity = (int) $quantity;

                if ($variantId <= 0 || $quantity <= 0) {
                    continue;
                }

                $variant = ProductVariant::lockForUpdate()->find($variantId);

                if (!$variant) {
                    Log::warning('cart.releaseReserved.variant_missing', [
                        'variant_id' => $variantId,
                    ]);
                    continue;
                }

                $currentReserved = (int) ($variant->reserved_quantity ?? 0);
                $decrement = min($quantity, $currentReserved);

                if ($decrement <= 0) {
                    continue;
                }

                $variant->decrement('reserved_quantity', $decrement);

                Log::debug('cart.releaseReserved.decrement', [
                    'variant_id' => $variantId,
                    'released' => $decrement,
                    'reserved_after' => (int) ($variant->reserved_quantity ?? 0),
                ]);

                $this->cache->forget($this->variantCacheKey($variantId));
            }
        }, 3);
    }

    /**
     * Create an order from current cart items.
     * 
     * @param User $user
     * @return Order
     * @throws CartException
     */
    public function createOrderFromCart(User $user): Order
    {
        $cartItems = $this->getCartItems($user);

        if ($cartItems->isEmpty()) {
            throw new CartException('Cart is empty');
        }

        $promotion = $this->getActivePromotion($user);
        $this->verifyStockForCheckout($user, $cartItems);
        $totals = $this->calculateTotals($cartItems, $promotion);
        $reservedDuringPreparation = collect(session('checkout_reserved', []));

        try {
            $order = DB::transaction(function () use ($user, $cartItems, $promotion, $totals, $reservedDuringPreparation) {
                $order = Order::create([
                    'customer_id' => $user->id,
                    'order_number' => $this->generateOrderNumber(),
                    'sub_total' => $totals['subtotal'],
                    'shipping_fee' => 0,
                    'discount_amount' => $totals['discount'],
                    'total_amount' => $totals['total'],
                    'status' => OrderStatus::PENDING_CONFIRMATION,
                    'payment_method' => 3,
                    'payment_status' => PaymentStatus::UNPAID,
                ]);

                foreach ($cartItems as $item) {
                    $variant = ProductVariant::lockForUpdate()->find($item['variant_id']);

                    if (!$variant) {
                        throw new CartException("Product variant not found");
                    }

                    if ($variant->track_inventory) {
                        $alreadyReserved = (int) $reservedDuringPreparation->get($variant->variant_id, 0);
                        $neededQuantity = (int) $item['quantity'];

                        if ($alreadyReserved >= $neededQuantity) {
                            $reservedDuringPreparation->put($variant->variant_id, $alreadyReserved - $neededQuantity);
                        } else {
                            $additionalReserve = $neededQuantity - max(0, $alreadyReserved);

                            if ($additionalReserve > 0) {
                                $variant->increment('reserved_quantity', $additionalReserve);
                                Log::debug('order.reserve.additional', [
                                    'variant_id' => $variant->variant_id,
                                    'additional' => $additionalReserve,
                                    'reserved_after' => (int) ($variant->reserved_quantity ?? 0),
                                ]);
                            }
                        }
                    }

                    $order->items()->create([
                        'variant_id' => $variant->variant_id,
                        'quantity' => $item['quantity'],
                        'unit_price' => $item['price'],
                        'total_price' => $item['subtotal'],
                    ]);
                }

                if ($promotion) {
                    $order->promotions()->attach($promotion->promotion_id, [
                        'discount_applied' => $totals['discount'],
                    ]);
                }

                Log::info('order.created_from_cart', [
                    'order_id' => $order->order_id,
                    'user_id' => $user->id,
                    'total' => $totals['total'],
                ]);

                return $order;
            });
        } catch (Throwable $exception) {
            $this->releaseReservedQuantities(session('checkout_reserved', []));
            session()->forget('checkout_reserved');
            throw $exception;
        }

        session()->forget('checkout_reserved');

        return $order;
    }

    /**
     * Generate a unique order ID.
     */
    private function generateOrderNumber(): string
    {
        do {
            $number = 'SN' . now()->format('YmdHis') . Str::upper(Str::random(4));
        } while (Order::where('order_number', $number)->exists());

        return $number;
    }
}
