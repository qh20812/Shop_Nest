<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\Promotion;
use App\Models\User;
use App\Services\PaymentService;
use App\Support\Localization;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use InvalidArgumentException;

class CheckoutController extends Controller
{
    /**
     * Display the checkout page.
     */
    public function index(): Response
    {
        $user = Auth::user();
        if (!$user instanceof User) {
            abort(403);
        }

        $locale = app()->getLocale();

        $promotion = session('applied_promotion', null);
        $addressPayload = $this->buildAddressPayload($user);

        $cartItems = CartItem::with(['variant.product.images'])
            ->where('user_id', $user->id)
            ->get();

        if ($cartItems->isEmpty()) {
            return Inertia::render('Customer/Checkout', [
                'cartItems' => [],
                'subtotal' => 0,
                'shipping' => 0,
                'discount' => 0,
                'total' => 0,
                'addresses' => $addressPayload,
                'promotion' => $promotion,
                'paymentMethods' => PaymentService::list(),
                'availablePromotions' => [],
                'ineligiblePromotions' => [],
            ]);
        }

        $cartItems = $cartItems
            ->filter(fn (CartItem $item) => $item->variant && $item->variant->product)
            ->values();

        if ($cartItems->isEmpty()) {
            Log::warning('checkout.index.empty_after_filter', ['user_id' => $user->id]);

            return Inertia::render('Customer/Checkout', [
                'cartItems' => [],
                'subtotal' => 0,
                'shipping' => 0,
                'discount' => 0,
                'total' => 0,
                'addresses' => $addressPayload,
                'promotion' => $promotion,
                'paymentMethods' => PaymentService::list(),
                'availablePromotions' => [],
                'ineligiblePromotions' => [],
            ]);
        }

        $subtotal = $cartItems->sum(function (CartItem $item) use ($locale) {
            $variant = $item->variant;
            $unitPrice = Localization::resolveNumber($variant->discount_price ?? $variant->price, $locale);

            return $item->quantity * $unitPrice;
        });

        $shipping = $this->calculateShippingFee($subtotal);
        $discount = $this->calculatePromotionDiscount($promotion, $subtotal);
        $total = max(0, $subtotal + $shipping - $discount);

        $formattedCartItems = $cartItems->map(function (CartItem $item) use ($locale) {
            $variant = $item->variant;
            $product = $variant->product;
            $unitPrice = Localization::resolveNumber($variant->discount_price ?? $variant->price, $locale);
            $productName = Localization::resolveField($product->name ?? '', $locale, 'Product');

            return [
                'id' => (int) $item->getKey(),
                'product_name' => $productName,
                'quantity' => (int) $item->quantity,
                'price' => $unitPrice, // Effective price (discount_price if available, otherwise price)
                'discount_price' => $variant->discount_price !== null
                    ? Localization::resolveNumber($variant->discount_price, $locale)
                    : null,
                'total_price' => $item->quantity * $unitPrice,
                'variant' => [
                    'id' => (int) $variant->getKey(),
                    'sku' => $variant->sku,
                    'size' => $variant->size ?? null,
                    'color' => $variant->color ?? null,
                    'price' => Localization::resolveNumber($variant->price, $locale),
                    'discount_price' => $variant->discount_price !== null
                        ? Localization::resolveNumber($variant->discount_price, $locale)
                        : null,
                    'product' => [
                        'id' => (int) $product->id,
                        'name' => $productName,
                        'slug' => $product->slug,
                        'images' => $product->images->map(function ($image) {
                            return [
                                'id' => (int) $image->id,
                                'image_path' => $image->image_path,
                            ];
                        })->values()->all(),
                    ],
                ],
            ];
        });

        $promotionsData = $this->getAvailablePromotions(Request::create('/checkout/available-promotions', 'GET', []))->getData();

        return Inertia::render('Customer/Checkout', [
            'cartItems' => $formattedCartItems,
            'subtotal' => round($subtotal, 2),
            'shipping' => round($shipping, 2),
            'discount' => round($discount, 2),
            'total' => round($total, 2),
            'addresses' => $addressPayload,
            'promotion' => $promotion,
            'availablePromotions' => $promotionsData->available_promotions ?? [],
            'ineligiblePromotions' => $promotionsData->ineligible_promotions ?? [],
            'paymentMethods' => PaymentService::list(),
        ]);
    }

    /**
     * Process the checkout and create a new order (VND only).
     */
    public function store(Request $request): JsonResponse
    {
        $user = Auth::user();
        if (!$user instanceof User) {
            abort(403);
        }

        $locale = app()->getLocale();

        $data = $request->validate([
            'provider' => ['required', 'string', Rule::in(['stripe', 'paypal', 'vnpay', 'momo'])],
            'address_id' => ['required', 'integer', 'exists:user_addresses,id'],
            'notes' => ['nullable', 'string', 'max:500'],
        ]);

        $address = $user->addresses()->where('id', $data['address_id'])->first();

        if (!$address) {
            return response()->json([
                'success' => false,
                'message' => 'The selected address is not available.',
            ], 422);
        }

        $cartItems = CartItem::with('variant.product')
            ->where('user_id', $user->id)
            ->get();

        if ($cartItems->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Your cart is empty.',
            ], 400);
        }

        $cartItems = $cartItems
            ->filter(fn (CartItem $item) => $item->variant && $item->variant->product)
            ->values();

        if ($cartItems->isEmpty()) {
            Log::warning('checkout.store.empty_after_filter', ['user_id' => $user->id]);

            return response()->json([
                'success' => false,
                'message' => 'Unable to process cart items. Please refresh and try again.',
            ], 400);
        }

        $promotion = session('applied_promotion', null);

        $subtotal = $cartItems->sum(function (CartItem $item) use ($locale) {
            $variant = $item->variant;
            $unitPrice = Localization::resolveNumber($variant->discount_price ?? $variant->price, $locale);

            return $item->quantity * $unitPrice;
        });

        $shippingFee = $this->calculateShippingFee($subtotal);
        $discountAmount = $this->calculatePromotionDiscount($promotion, $subtotal);
        $totalAmount = max(0, $subtotal + $shippingFee - $discountAmount);

        DB::beginTransaction();

        try {
            $order = Order::create([
                'customer_id' => $user->id,
                'order_number' => $this->generateOrderNumber(),
                'sub_total' => $subtotal,
                'shipping_fee' => $shippingFee,
                'discount_amount' => $discountAmount,
                'total_amount' => $totalAmount,
                'currency' => 'VND',
                'exchange_rate' => 1,
                'total_amount_base' => $totalAmount,
                'status' => OrderStatus::PENDING_CONFIRMATION,
                'payment_method' => 3,
                'payment_status' => PaymentStatus::UNPAID,
                'shipping_address_id' => $address->id,
                'notes' => isset($data['notes']) ? trim($data['notes']) : null,
            ]);

            foreach ($cartItems as $cartItem) {
                $variant = $cartItem->variant;
                $unitPrice = Localization::resolveNumber($variant->discount_price ?? $variant->price, $locale);
                $lineTotal = $unitPrice * $cartItem->quantity;

                $order->items()->create([
                    'variant_id' => $variant->getKey(),
                    'quantity' => $cartItem->quantity,
                    'unit_price' => $unitPrice,
                    'total_price' => $lineTotal,
                    'original_currency' => 'VND',
                    'original_unit_price' => $unitPrice,
                    'original_total_price' => $lineTotal,
                ]);
            }

            if ($promotion) {
                $promotionData = is_array($promotion) ? $promotion : (array) $promotion;
                $promotionId = $promotionData['promotion_id'] ?? $promotionData['id'] ?? null;

                if ($promotionId) {
                    $order->promotions()->syncWithoutDetaching([
                        $promotionId => [
                            'discount_applied' => $discountAmount,
                        ],
                    ]);
                }
            }

            CartItem::where('user_id', $user->id)->delete();

            DB::commit();
        } catch (\Throwable $exception) {
            DB::rollBack();

            Log::error('checkout.store.failed', [
                'user_id' => $user->id,
                'error' => $exception->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to create order. Please try again.',
            ], 500);
        }

        session()->forget('applied_promotion');

        try {
            $gateway = PaymentService::make($data['provider']);
        } catch (InvalidArgumentException $exception) {
            Log::warning('checkout.store.invalid_provider', [
                'user_id' => $user->id,
                'provider' => $data['provider'],
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Invalid payment provider selected.',
            ], 422);
        }

        try {
            $paymentUrl = $gateway->createPayment($order);
        } catch (\Throwable $exception) {
            Log::error('checkout.store.payment_init_failed', [
                'user_id' => $user->id,
                'order_id' => $order->order_id,
                'provider' => $data['provider'],
                'error' => $exception->getMessage(),
            ]);

            $order->update(['payment_status' => PaymentStatus::FAILED]);

            return response()->json([
                'success' => false,
                'message' => 'Unable to initiate payment. Please try again later.',
            ], 502);
        }

        return response()->json([
            'success' => true,
            'order_id' => $order->order_id,
            'payment_url' => $paymentUrl,
            'message' => 'Redirecting to payment gateway...',
        ]);
    }

    /**
     * Calculate shipping fee based on subtotal.
     */
    private function calculateShippingFee(float $subtotal): float
    {
        if ($subtotal >= 1_000_000) {
            return 0.0;
        }

        return 30_000.0;
    }

    /**
     * Generate a unique order number.
     */
    private function generateOrderNumber(): string
    {
        return 'ORD-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -6));
    }

    private function buildAddressPayload(User $user): array
    {
        return $user->addresses()
            ->with(['province', 'district', 'ward'])
            ->orderBy('is_default', 'desc')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($address) {
                return [
                    'id' => $address->id,
                    'name' => $address->full_name ?? 'Recipient',
                    'phone' => $address->phone_number ?? '',
                    'address' => $address->street_address ?? '',
                    'province' => $address->province->name ?? '',
                    'district' => $address->district->name ?? '',
                    'ward' => $address->ward->name ?? '',
                    'province_id' => $address->province_id,
                    'district_id' => $address->district_id,
                    'ward_id' => $address->ward_id,
                    'is_default' => (bool) $address->is_default,
                ];
            })
            ->values()
            ->all();
    }

    private function calculatePromotionDiscount($promotion, float $subtotal): float
    {
        if (!$promotion || $subtotal <= 0) {
            return 0.0;
        }

        $data = is_array($promotion) ? $promotion : (array) $promotion;

        $type = $data['type'] ?? 'percentage';
        $rawValue = (float) ($data['discount'] ?? $data['value'] ?? 0);
        $discount = 0.0;

        if ($type === 'fixed') {
            $discount = $rawValue;
        } else {
            $discount = $subtotal * ($rawValue / 100);
        }

        if (isset($data['max_discount_amount'])) {
            $discount = min($discount, (float) $data['max_discount_amount']);
        }

        return max(0.0, min($discount, $subtotal));
    }

    /**
     * Get available promotions for checkout
     */
    public function getAvailablePromotions(Request $request)
    {
        $user = Auth::user();
        $locale = app()->getLocale();
        
        // Get cart items or order items based on checkout type
        $isBuyNow = $request->has('order_id');
        $subtotal = 0;
        $cartItems = collect();
        
        if ($isBuyNow) {
            $order = Order::with('items.variant.product')->findOrFail($request->order_id);
            if ($order->customer_id !== $user->id) {
                abort(403);
            }
            $cartItems = $order->items;
            $subtotal = Localization::resolveNumber($order->sub_total, $locale);
        } else {
            $cartItems = CartItem::with('variant.product')
                ->where('user_id', $user->id)
                ->get();
            $subtotal = $cartItems->sum(function ($item) use ($locale) {
                $unitPrice = Localization::resolveNumber($item->variant->discount_price ?? $item->variant->price, $locale);

                return $item->quantity * $unitPrice;
            });
        }

        // Get all active promotions
        $promotions = Promotion::with('codes')
            ->where('is_active', true)
            ->where(function ($query) {
                $query->whereNull('start_date')
                      ->orWhere('start_date', '<=', now());
            })
            ->where(function ($query) {
                $query->whereNull('end_date')
                      ->orWhere('end_date', '>=', now());
            })
            ->orderBy('priority', 'desc')
            ->get();

        $availablePromotions = [];
        $ineligiblePromotions = [];

        foreach ($promotions as $promotion) {
            $isEligible = $this->checkPromotionEligibility($promotion, $user, $subtotal, $cartItems);
            
            $promotionData = [
                'id' => $promotion->promotion_id,
                'name' => $promotion->name,
                'description' => $promotion->description,
                'type' => $promotion->type,
                'value' => $promotion->value,
                'min_order_amount' => $promotion->min_order_amount,
                'max_discount_amount' => $promotion->max_discount_amount,
                'stackable' => $promotion->stackable,
                'priority' => $promotion->priority,
                'terms_and_conditions' => $promotion->terms_and_conditions,
                'codes' => $promotion->codes->map(function ($code) {
                    return [
                        'id' => $code->promotion_code_id,
                        'code' => $code->code,
                    ];
                }),
            ];

            if ($isEligible) {
                $availablePromotions[] = $promotionData;
            } else {
                $ineligiblePromotions[] = $promotionData;
            }
        }

        return response()->json([
            'available_promotions' => $availablePromotions,
            'ineligible_promotions' => $ineligiblePromotions,
            'current_subtotal' => $subtotal,
        ]);
    }

    /**
     * Check if promotion is eligible for user and cart
     */
    private function checkPromotionEligibility(Promotion $promotion, $user, float $subtotal, $cartItems): bool
    {
        // Check minimum order amount
        if ($promotion->min_order_amount && $subtotal < $promotion->min_order_amount) {
            return false;
        }

        // Check usage limits
        if ($promotion->usage_limit !== null && $promotion->used_count >= $promotion->usage_limit) {
            return false;
        }

        // Check budget
        if ($promotion->isBudgetExceeded()) {
            return false;
        }

        // Check per customer limit
        if ($user && $promotion->per_customer_limit !== null) {
            $usageCount = Order::where('customer_id', $user->id)
                ->whereHas('promotions', function ($query) use ($promotion) {
                    $query->where('promotions.promotion_id', $promotion->promotion_id);
                })
                ->count();

            if ($usageCount >= $promotion->per_customer_limit) {
                return false;
            }
        }

        // Check first time customer only
        if ($promotion->first_time_customer_only && $user) {
            $hasPreviousOrders = Order::where('customer_id', $user->id)->exists();
            if ($hasPreviousOrders) {
                return false;
            }
        }

        // Check product restrictions
        if ($promotion->product_restrictions) {
            $restrictedProductIds = $promotion->product_restrictions;
            $cartProductIds = $cartItems->pluck('variant.product.id')->unique();
            
            // If restriction type is 'include', check if cart has restricted products
            // If restriction type is 'exclude', check if cart has non-restricted products
            // This is a simplified check - you might need more complex logic
            if (!empty($restrictedProductIds)) {
                $hasEligibleProducts = $cartProductIds->intersect($restrictedProductIds)->isNotEmpty();
                if (!$hasEligibleProducts) {
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * Get provinces (level 1)
     */
    public function getProvinces()
    {
        $provinces = \App\Models\AdministrativeDivision::where('level', 1)
            ->orderBy('name->vi')
            ->get(['id', 'name', 'code']);

        return response()->json([
            'success' => true,
            'data' => $provinces->map(function ($province) {
                return [
                    'id' => $province->id,
                    'name' => $province->name['vi'] ?? $province->name,
                    'code' => $province->code,
                ];
            }),
        ]);
    }

    /**
     * Get districts by province ID (level 2)
     */
    public function getDistricts($provinceId)
    {
        $districts = \App\Models\AdministrativeDivision::where('parent_id', $provinceId)
            ->where('level', 2)
            ->orderBy('name->vi')
            ->get(['id', 'name', 'code']);

        return response()->json([
            'success' => true,
            'data' => $districts->map(function ($district) {
                return [
                    'id' => $district->id,
                    'name' => $district->name['vi'] ?? $district->name,
                    'code' => $district->code,
                ];
            }),
        ]);
    }

    /**
     * Get wards by district ID (level 3)
     */
    public function getWards($districtId)
    {
        $wards = \App\Models\AdministrativeDivision::where('parent_id', $districtId)
            ->where('level', 3)
            ->orderBy('name->vi')
            ->get(['id', 'name', 'code']);

        return response()->json([
            'success' => true,
            'data' => $wards->map(function ($ward) {
                return [
                    'id' => $ward->id,
                    'name' => $ward->name['vi'] ?? $ward->name,
                    'code' => $ward->code,
                ];
            }),
        ]);
    }
}
