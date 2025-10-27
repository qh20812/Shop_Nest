<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\CartItem;
use App\Models\Promotion;
use App\Models\PromotionCode;
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
        $user = Auth::user();
        
        // Get cart items with full product and variant details
        $cartItems = CartItem::with([
            'variant.product.images',
            'variant.product.category',
        ])
            ->where('user_id', $user->id)
            ->get();

        // If cart is empty, still render page (component handles empty state)
        if ($cartItems->isEmpty()) {
            return Inertia::render('Customer/Checkout', [
                'cartItems' => [],
                'subtotal' => 0,
                'shipping' => 0,
                'tax' => 0,
                'discount' => 0,
                'total' => 0,
                'addresses' => [],
                'promotion' => null,
            ]);
        }

        // Calculate subtotal
        $subtotal = $cartItems->sum(function ($item) {
            $price = $item->variant->sale_price ?? $item->variant->price;
            return $item->quantity * $price;
        });

        // Calculate shipping fee
        $shipping = $this->calculateShippingFee($subtotal);
        
        // Calculate tax (example: 10% tax)
        $tax = $subtotal * 0.0; // Set to 0 or apply tax logic as needed
        
        // Get applied promotion/discount if exists
        $promotion = session('applied_promotion', null);
        $discount = 0;
        
        if ($promotion) {
            // Calculate discount based on promotion type
            if (isset($promotion['type']) && $promotion['type'] === 'percentage') {
                $discount = $subtotal * ($promotion['discount'] / 100);
            } elseif (isset($promotion['type']) && $promotion['type'] === 'fixed') {
                $discount = $promotion['discount'];
            } else {
                // Default: treat as percentage
                $discount = $subtotal * ($promotion['discount'] / 100);
            }
        }
        
        // Calculate total
        $total = $subtotal + $shipping + $tax - $discount;
        
        // Get user addresses
        $addresses = $user->addresses()
            ->with(['province', 'district', 'ward'])
            ->orderBy('is_default', 'desc')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($address) {
                return [
                    'id' => $address->id,
                    'name' => $address->recipient_name ?? 'Recipient',
                    'phone' => $address->phone ?? '',
                    'address' => $address->address_line ?? '',
                    'province' => $address->province ? $address->province->name : '',
                    'district' => $address->district ? $address->district->name : '',
                    'ward' => $address->ward ? $address->ward->name : '',
                    'province_id' => $address->province_id,
                    'district_id' => $address->district_id,
                    'ward_id' => $address->ward_id,
                    'is_default' => (bool) $address->is_default,
                ];
            });

        // Format cart items for frontend
        $formattedCartItems = $cartItems->map(function ($item) {
            return [
                'id' => $item->id,
                'product_name' => $item->variant->product->name ?? 'Product',
                'quantity' => $item->quantity,
                'total_price' => $item->quantity * ($item->variant->sale_price ?? $item->variant->price),
                'variant' => [
                    'id' => $item->variant->id,
                    'sku' => $item->variant->sku,
                    'size' => $item->variant->size ?? null,
                    'color' => $item->variant->color ?? null,
                    'price' => $item->variant->price,
                    'sale_price' => $item->variant->sale_price ?? null,
                    'product' => [
                        'id' => $item->variant->product->id,
                        'name' => $item->variant->product->name,
                        'slug' => $item->variant->product->slug,
                        'images' => $item->variant->product->images->map(function ($image) {
                            return [
                                'id' => $image->id,
                                'image_path' => $image->image_path,
                            ];
                        }),
                    ],
                ],
            ];
        });

        // Get available promotions
        $promotionsData = $this->getAvailablePromotions(Request::create('/checkout/available-promotions', 'GET', []))->getData();

        return Inertia::render('Customer/Checkout', [
            'cartItems' => $formattedCartItems,
            'subtotal' => round($subtotal, 2),
            'shipping' => round($shipping, 2),
            'tax' => round($tax, 2),
            'discount' => round($discount, 2),
            'total' => round($total, 2),
            'addresses' => $addresses,
            'promotion' => $promotion,
            'availablePromotions' => $promotionsData->available_promotions ?? [],
            'ineligiblePromotions' => $promotionsData->ineligible_promotions ?? [],
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

    /**
     * Get available promotions for checkout
     */
    public function getAvailablePromotions(Request $request)
    {
        $user = Auth::user();
        
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
            $subtotal = $order->sub_total;
        } else {
            $cartItems = CartItem::with('variant.product')
                ->where('user_id', $user->id)
                ->get();
            $subtotal = $cartItems->sum(function ($item) {
                return $item->quantity * ($item->variant->sale_price ?? $item->variant->price);
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
