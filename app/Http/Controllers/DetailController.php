<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Enums\ProductStatus;
use App\Exceptions\CartException;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Review;
use App\Models\UserAddress;
use App\Models\User;
use App\Services\CartService;
use App\Services\InventoryService;
use App\Services\PaymentService;
use App\Support\Localization;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Query\Builder as QueryBuilder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use InvalidArgumentException;

class DetailController extends Controller
{
    public function __construct(
        private CartService $cartService,
        private InventoryService $inventoryService
    ) {
    }

    public function show(Request $request, int $productId): Response
    {
        $locale = app()->getLocale();

        $productBase = Cache::remember(
            "product_detail_{$productId}_{$locale}",
            300, // Reduced from 1800 to 300 seconds (5 minutes)
            function () use ($productId, $locale) {
                $product = $this->buildProductQuery($productId)->first();

                if (!$product) {
                    abort(404);
                }

                return $this->transformProduct($product, $locale);
            }
        );

        $productPayload = $productBase;
        $productPayload['rating'] = $this->calculateRatingSummary($productId);
        $productPayload['sold_count'] = $this->calculateSoldCount($productId);

        $relatedProducts = Cache::remember(
            "product_detail_related_{$productId}_{$locale}",
            900,
            function () use ($productId, $productPayload, $locale) {
                $categoryId = $productPayload['category']['id'] ?? null;
                $brandId = $productPayload['brand']['id'] ?? null;

                return $this->resolveRelatedProducts($productId, $categoryId, $brandId, $locale);
            }
        );

        $reviews = $this->buildReviewsPayload($request, $productId);

        $user = Auth::user();
        $cartItems = $this->cartService->getCartItems($user);

        return Inertia::render('Customer/Detail', [
            'product' => $productPayload,
            'reviews' => $reviews,
            'relatedProducts' => $relatedProducts,
            'cartItems' => $cartItems->values()->all(),
            'user' => $user ? [
                'id' => $user->id,
                'username' => $user->username,
                'email' => $user->email,
                'avatar' => $user->avatar,
            ] : null,
        ]);
    }

    public function addToCart(Request $request, int $productId)
    {
        // Require authentication for Add to Cart
        if (!Auth::check()) {
            return response()->json([
                'success' => false,
                'message' => 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.',
                'redirect' => route('login'),
                'action' => 'login_required',
            ]);
        }

        $product = $this->findPublishedProduct($productId);

        $data = $request->validate([
            'variant_id' => [
                'required',
                'integer',
                Rule::exists('product_variants', 'variant_id')->where(function (QueryBuilder $query) use ($product) {
                    $query->where('product_id', $product->product_id)->whereNull('deleted_at');
                }),
            ],
            'quantity' => ['required', 'integer', 'min:1', 'max:99'],
        ]);

        try {
            $variant = ProductVariant::where('product_id', $product->product_id)
                ->where('variant_id', $data['variant_id'])
                ->whereNull('deleted_at')
                ->first();

            if (!$variant) {
                return response()->json([
                    'success' => false,
                    'message' => 'Biến thể không hợp lệ.',
                ], 422);
            }

            $user = Auth::user();

            $this->cartService->addItem($user, (int) $variant->variant_id, (int) $data['quantity']);

            $cartCount = $this->cartService->getCartItems($user)->count();

            return response()->json([
                'success' => true,
                'message' => 'Đã thêm sản phẩm vào giỏ hàng.',
                'cartCount' => $cartCount,
            ]);
        } catch (CartException $exception) {
            return response()->json([
                'success' => false,
                'message' => $exception->getMessage(),
            ], 422);
        } catch (\Throwable $exception) {
            Log::error('DetailController@addToCart failed', [
                'product_id' => $productId,
                'variant_id' => $data['variant_id'] ?? null,
                'error' => $exception->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Không thể thêm sản phẩm vào giỏ hàng lúc này.',
            ], 500);
        }
    }

    /**
     * Buy Now: Create order directly without adding to cart
     */
    public function buyNow(Request $request, int $productId)
    {
        Log::info('DetailController@buyNow start', [
            'product_id' => $productId,
            'user_id' => Auth::id(),
            'request_data' => $request->all(),
        ]);

        // Require authentication for Buy Now
        if (!Auth::check()) {
            return response()->json([
                'success' => false,
                'message' => 'Vui lòng đăng nhập để tiếp tục mua hàng.',
                'redirect' => route('login'),
                'action' => 'login_required',
            ]);
        }

        $user = Auth::user();
        $product = $this->findPublishedProduct($productId);

        $data = $request->validate([
            'variant_id' => [
                'required',
                'integer',
                Rule::exists('product_variants', 'variant_id')->where(function (QueryBuilder $query) use ($product) {
                    $query->where('product_id', $product->product_id)->whereNull('deleted_at');
                }),
            ],
            'quantity' => ['required', 'integer', 'min:1', 'max:99'],
            'provider' => ['nullable', 'string', 'in:stripe,paypal,vnpay,momo'],
        ]);

        try {
            // Get the variant
            $variant = ProductVariant::where('product_id', $product->product_id)
                ->where('variant_id', $data['variant_id'])
                ->whereNull('deleted_at')
                ->first();

            if (!$variant) {
                return response()->json([
                    'success' => false,
                    'message' => 'Biến thể không hợp lệ.',
                ], 422);
            }

            // Check stock availability
            if ($variant->stock_quantity < $data['quantity']) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không đủ số lượng trong kho.',
                ], 422);
            }

            // Create order directly (without cart)
            DB::beginTransaction();

            try {
                $unitPrice = $variant->sale_price ?? $variant->price;
                $subtotal = $unitPrice * $data['quantity'];
                $shippingFee = $this->calculateShippingFee($subtotal);
                $totalAmount = max(0, $subtotal + $shippingFee);

                $order = Order::create([
                    'customer_id' => $user->id,
                    'order_number' => 'ORD-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -6)),
                    'sub_total' => $subtotal,
                    'shipping_fee' => $shippingFee,
                    'discount_amount' => 0,
                    'total_amount' => $totalAmount,
                    'currency' => 'VND',
                    'exchange_rate' => 1.0,
                    'total_amount_base' => $totalAmount,
                    'status' => OrderStatus::PENDING_CONFIRMATION,
                    'payment_method' => 3,
                    'payment_status' => PaymentStatus::UNPAID,
                    'notes' => 'Mua ngay từ trang chi tiết sản phẩm',
                ]);

                $order->items()->create([
                    'variant_id' => $variant->variant_id,
                    'quantity' => $data['quantity'],
                    'unit_price' => $unitPrice,
                    'total_price' => $subtotal,
                    'original_currency' => 'VND',
                    'original_unit_price' => $unitPrice,
                    'original_total_price' => $subtotal,
                ]);

                DB::commit();

                Log::info('DetailController@buyNow order created', [
                    'user_id' => $user->id,
                    'order_id' => $order->order_id,
                    'order_number' => $order->order_number,
                ]);

                return response()->json([
                    'success' => true,
                    'redirect_url' => route('buy.now.checkout.show', ['orderId' => $order->order_id]),
                    'order_id' => $order->order_id,
                    'order_number' => $order->order_number,
                    'message' => 'Đang chuyển đến trang thanh toán...',
                ]);

            } catch (\Throwable $e) {
                DB::rollBack();
                throw $e;
            }

        } catch (\Throwable $exception) {
            Log::error('DetailController@buyNow failed', [
                'product_id' => $productId,
                'variant_id' => $data['variant_id'] ?? null,
                'error' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Không thể xử lý yêu cầu mua ngay lúc này. Vui lòng thử lại.',
            ], 500);
        }
    }

    private function buildProductQuery(int $productId): Builder
    {
        $query = Product::query()
            ->where('product_id', $productId)
            ->where('is_active', true);

        return $this->applyPublishedStatusFilter($query)
            ->with([
                'category',
                'brand',
                'images' => function ($query) {
                    $query->orderByDesc('is_primary')->orderBy('display_order');
                },
                'variants' => function ($query) {
                    $query->with(['attributeValues.attribute'])->orderBy('variant_id');
                },
            ]);
    }

    private function findPublishedProduct(int $productId): Product
    {
        $query = Product::query()
            ->where('product_id', $productId)
            ->where('is_active', true);

        $this->applyPublishedStatusFilter($query);

        $product = $query->first();

        if (!$product) {
            abort(404);
        }

        return $product;
    }

    private function applyPublishedStatusFilter(Builder $query): Builder
    {
        return $query->where('status', ProductStatus::PUBLISHED);
    }

    private function transformProduct(Product $product, string $locale): array
    {
        $variants = $product->variants->map(function (ProductVariant $variant) {
            $attributeValues = $variant->attributeValues->map(function ($attributeValue) {
                return [
                    'attribute_id' => (int) $attributeValue->attribute_id,
                    'attribute_value_id' => (int) $attributeValue->attribute_value_id,
                    'attribute_name' => $attributeValue->attribute?->name ?? '',
                    'value' => $attributeValue->value,
                ];
            })->values()->all();

            $available = $variant->available_quantity ?? max(0, (int) $variant->stock_quantity - (int) ($variant->reserved_quantity ?? 0));

            return [
                'variant_id' => (int) $variant->variant_id,
                'sku' => $variant->sku,
                'price' => (float) $variant->price,
                'discount_price' => $variant->discount_price !== null ? (float) $variant->discount_price : null,
                'final_price' => $variant->discount_price !== null ? (float) $variant->discount_price : (float) $variant->price,
                'stock_quantity' => (int) $variant->stock_quantity,
                'available_quantity' => $available,
                'reserved_quantity' => (int) ($variant->reserved_quantity ?? 0),
                'attribute_values' => $attributeValues,
            ];
    })->values();

        $attributes = [];
        foreach ($variants as $variant) {
            foreach ($variant['attribute_values'] as $attributeValue) {
                $attributeId = $attributeValue['attribute_id'];

                if (!isset($attributes[$attributeId])) {
                    $attributes[$attributeId] = [
                        'attribute_id' => $attributeId,
                        'name' => $attributeValue['attribute_name'],
                        'values' => [],
                    ];
                }

                if (!isset($attributes[$attributeId]['values'][$attributeValue['attribute_value_id']])) {
                    $attributes[$attributeId]['values'][$attributeValue['attribute_value_id']] = [
                        'attribute_value_id' => $attributeValue['attribute_value_id'],
                        'value' => $attributeValue['value'],
                    ];
                }
            }
        }

        $attributes = array_map(function (array $attribute) {
            $attribute['values'] = array_values($attribute['values']);
            return $attribute;
        }, $attributes);

        $imageCollection = $product->images->map(function ($image) {
            return [
                'id' => (int) $image->image_id,
                'url' => $image->image_url,
                'alt' => $image->alt_text,
            ];
        })->values();

        if ($imageCollection->isEmpty()) {
            $imageCollection->push([
                'id' => 0,
                'url' => '/image/ShopnestLogo.png',
                'alt' => 'Product image placeholder',
            ]);
        }

        $finalPrices = $variants->pluck('final_price')->filter(fn ($price) => $price !== null);
        $minPrice = $finalPrices->min() ?? 0;
        $maxPrice = $finalPrices->max() ?? 0;

        $defaultVariant = $variants->first();
        $variantArray = $variants->all();
        $attributesArray = array_values($attributes);

        return [
            'id' => (int) $product->product_id,
            'name' => $product->getTranslation('name', $locale) ?? $product->name,
            'description' => $product->getTranslation('description', $locale) ?? '',
            'category' => $product->category ? [
                'id' => (int) $product->category->category_id,
                'name' => $product->category->getTranslation('name', $locale) ?? $product->category->name,
            ] : null,
            'brand' => $product->brand ? [
                'id' => (int) $product->brand->brand_id,
                'name' => $product->brand->getTranslation('name', $locale) ?? $product->brand->name,
            ] : null,
            'images' => $imageCollection->all(),
            'variants' => $variantArray,
            'attributes' => $attributesArray,
            'default_variant_id' => $defaultVariant['variant_id'] ?? null,
            'min_price' => (float) $minPrice,
            'max_price' => (float) $maxPrice,
            'specifications' => array_map(function (array $attribute) {
                return [
                    'label' => $attribute['name'],
                    'value' => implode(', ', array_map(fn ($value) => $value['value'], $attribute['values'])),
                ];
            }, $attributesArray),
        ];
    }

    private function calculateRatingSummary(int $productId): array
    {
        $ratingQuery = Review::query()
            ->where('product_id', $productId)
            ->where('is_approved', true);

        $average = round((float) ($ratingQuery->avg('rating') ?? 0), 1);
        $counts = Review::query()
            ->where('product_id', $productId)
            ->where('is_approved', true)
            ->selectRaw('rating, COUNT(*) as total')
            ->groupBy('rating')
            ->pluck('total', 'rating');

        $totalReviews = (int) $counts->sum();

        $breakdown = [];
        for ($rating = 5; $rating >= 1; $rating--) {
            $breakdown[] = [
                'rating' => $rating,
                'count' => (int) ($counts[$rating] ?? 0),
            ];
        }

        return [
            'average' => $average,
            'count' => $totalReviews,
            'breakdown' => $breakdown,
        ];
    }

    private function calculateSoldCount(int $productId): int
    {
        return (int) OrderItem::query()
            ->whereHas('variant', function (Builder $query) use ($productId) {
                $query->where('product_id', $productId);
            })
            ->sum('quantity');
    }

    private function buildReviewsPayload(Request $request, int $productId): array
    {
        $reviewsQuery = Review::query()
            ->where('product_id', $productId)
            ->where('is_approved', true)
            ->with(['user:id,username,email,avatar'])
            ->latest();

        $paginator = $reviewsQuery->paginate(10)->appends($request->query());

        $items = $paginator->through(function (Review $review) {
            return [
                'id' => (int) $review->review_id,
                'rating' => (int) $review->rating,
                'comment' => $review->comment,
                'created_at' => optional($review->created_at)?->toDateTimeString(),
                'created_at_human' => optional($review->created_at)?->diffForHumans(),
                'user' => $review->user ? [
                    'id' => (int) $review->user->id,
                    'username' => $review->user->username ?? $review->user->email,
                    'avatar' => $review->user->avatar,
                ] : null,
            ];
        });

        return [
            'data' => $items->items(),
            'meta' => [
                'current_page' => $items->currentPage(),
                'last_page' => $items->lastPage(),
                'per_page' => $items->perPage(),
                'total' => $items->total(),
            ],
            'links' => [
                'next' => $items->nextPageUrl(),
                'prev' => $items->previousPageUrl(),
            ],
        ];
    }

    private function resolveRelatedProducts(int $productId, ?int $categoryId, ?int $brandId, string $locale): array
    {
        $query = Product::query()
            ->where('product_id', '!=', $productId)
            ->where('is_active', true);

        if ($categoryId) {
            $query->where('category_id', $categoryId);
        } elseif ($brandId) {
            $query->where('brand_id', $brandId);
        }

        $this->applyPublishedStatusFilter($query);

        $products = $query
            ->with([
                'images' => function ($query) {
                    $query->orderByDesc('is_primary')->orderBy('display_order');
                },
                'variants' => function ($query) {
                    $query->orderBy('variant_id');
                },
            ])
            ->limit(8)
            ->get();

        if ($products->isEmpty()) {
            return [];
        }

        $productIds = $products->pluck('product_id')->all();
        $averageRatings = $this->fetchAverageRatings($productIds);
        $soldCounts = $this->fetchSoldCounts($productIds);

        return $products->map(function (Product $product) use ($locale, $averageRatings, $soldCounts) {
            $prices = $product->variants->map(function (ProductVariant $variant) {
                return $variant->discount_price !== null ? (float) $variant->discount_price : (float) $variant->price;
            });

            $image = $product->images->first();

            return [
                'id' => (int) $product->product_id,
                'name' => $product->getTranslation('name', $locale) ?? $product->name,
                'image' => $image?->image_url ?? '/image/ShopnestLogo.png',
                'price' => (float) ($prices->min() ?? 0),
                'max_price' => (float) ($prices->max() ?? 0),
                'rating' => (float) ($averageRatings[$product->product_id] ?? 0),
                'sold_count' => (int) ($soldCounts[$product->product_id] ?? 0),
            ];
        })->values()->all();
    }

    private function fetchAverageRatings(array $productIds): array
    {
        if (empty($productIds)) {
            return [];
        }

        return Review::query()
            ->whereIn('product_id', $productIds)
            ->where('is_approved', true)
            ->selectRaw('product_id, AVG(rating) as avg_rating')
            ->groupBy('product_id')
            ->pluck('avg_rating', 'product_id')
            ->map(fn ($average) => round((float) $average, 1))
            ->toArray();
    }

    private function fetchSoldCounts(array $productIds): array
    {
        if (empty($productIds)) {
            return [];
        }

        return OrderItem::query()
            ->join('product_variants', 'order_items.variant_id', '=', 'product_variants.variant_id')
            ->whereIn('product_variants.product_id', $productIds)
            ->selectRaw('product_variants.product_id as product_id, SUM(order_items.quantity) as total_sold')
            ->groupBy('product_variants.product_id')
            ->pluck('total_sold', 'product_id')
            ->map(fn ($count) => (int) $count)
            ->toArray();
    }

    public function showBuyNowCheckout(int $orderId)
    {
        $user = Auth::user();
        if (!$user instanceof User) {
            abort(403);
        }

        $locale = app()->getLocale();

        // Find the order and ensure it belongs to the user
        $order = Order::where('order_id', $orderId)
            ->where('customer_id', $user->id)
            ->where('status', OrderStatus::PENDING_CONFIRMATION)
            ->with(['items.variant.product'])
            ->firstOrFail();

        // Calculate totals
        $subtotal = Localization::resolveNumber($order->sub_total, $locale);
        $shippingFee = Localization::resolveNumber($order->shipping_fee, $locale);
        $discountAmount = Localization::resolveNumber($order->discount_amount, $locale);
        $totalAmount = Localization::resolveNumber($order->total_amount, $locale);

        return Inertia::render('Customer/Checkout', [
            'order' => $order,
            'orderItems' => $order->items->map(function ($item) use ($locale) {
                $product = $item->variant?->product;
                $imagePath = $product?->images->first()?->image_path ?? null;

                return [
                    'id' => (int) $item->order_item_id,
                    'variant_id' => (int) $item->variant_id,
                    'product_name' => $product
                        ? Localization::resolveField($product->name, $locale, 'Unknown Product')
                        : 'Unknown Product',
                    'variant_name' => Localization::resolveField($item->variant?->name ?? '', $locale, ''),
                    'quantity' => (int) $item->quantity,
                    'unit_price' => Localization::resolveNumber($item->unit_price, $locale),
                    'total_price' => Localization::resolveNumber($item->total_price, $locale),
                    'image' => $imagePath ? '/storage/' . ltrim($imagePath, '/') : null,
                ];
            }),
            'totals' => [
                'subtotal' => $subtotal,
                'shipping_fee' => $shippingFee,
                'discount_amount' => $discountAmount,
                'total' => $totalAmount,
            ],
            'addresses' => $this->buildAddressPayload($user),
            'paymentMethods' => PaymentService::list(),
        ]);
    }

    public function processBuyNowCheckout(Request $request, int $orderId)
    {
        $user = Auth::user();
        if (!$user instanceof User) {
            abort(403);
        }
        
        // Validate request
        $data = $request->validate([
            'provider' => ['required', 'string', 'in:stripe,paypal,vnpay,momo'],
            'address_id' => ['nullable', 'exists:user_addresses,id'],
        ]);

        // Find the order and ensure it belongs to the user
        $order = Order::where('order_id', $orderId)
            ->where('customer_id', $user->id)
            ->where('status', OrderStatus::PENDING_CONFIRMATION)
            ->firstOrFail();

        // Update shipping address if provided, otherwise use default
        if (!empty($data['address_id'])) {
            $address = UserAddress::where('id', $data['address_id'])
                ->where('user_id', $user->id)
                ->firstOrFail();

            $order->update(['shipping_address_id' => $address->id]);
        } else {
            // Use default address if no address_id provided
            $defaultAddress = UserAddress::where('user_id', $user->id)
                ->where('is_default', true)
                ->first();

            if ($defaultAddress) {
                $order->update(['shipping_address_id' => $defaultAddress->id]);
            }
        }

        try {
            $gateway = PaymentService::make($data['provider']);
            $paymentUrl = $gateway->createPayment($order);

            Log::info('DetailController@processBuyNowCheckout payment initiated', [
                'user_id' => $user->id,
                'order_id' => $order->order_id,
                'provider' => $data['provider'],
                'payment_url' => $paymentUrl,
            ]);

            return response()->json([
                'success' => true,
                'payment_url' => $paymentUrl,
                'message' => 'Đang chuyển đến cổng thanh toán...',
            ]);

        } catch (InvalidArgumentException $exception) {
            Log::warning('DetailController@processBuyNowCheckout invalid_provider', [
                'order_id' => $orderId,
                'user_id' => $user->id,
                'provider' => $data['provider'],
                'error' => $exception->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Phương thức thanh toán không hợp lệ.',
            ], 422);

        } catch (\Throwable $exception) {
            Log::error('DetailController@processBuyNowCheckout failed', [
                'order_id' => $orderId,
                'user_id' => $user->id,
                'error' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Không thể xử lý thanh toán. Vui lòng thử lại.',
            ], 500);
        }
    }

    private function calculateShippingFee(float $subtotal): float
    {
        if ($subtotal >= 1_000_000) {
            return 0.0;
        }

        return 30_000.0;
    }

    private function buildAddressPayload(User $user): array
    {
        $locale = app()->getLocale();

        return $user->addresses()
            ->with(['province', 'district', 'ward'])
            ->orderBy('is_default', 'desc')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($address) use ($locale) {
                return [
                    'id' => $address->id,
                    'name' => $address->full_name ?? 'Recipient',
                    'phone' => $address->phone_number ?? '',
                    'address' => $address->street_address ?? '',
                    'province' => Localization::resolveField($address->province->name ?? '', $locale, ''),
                    'district' => Localization::resolveField($address->district->name ?? '', $locale, ''),
                    'ward' => Localization::resolveField($address->ward->name ?? '', $locale, ''),
                    'province_id' => $address->province_id,
                    'district_id' => $address->district_id,
                    'ward_id' => $address->ward_id,
                    'is_default' => (bool) $address->is_default,
                ];
            })
            ->values()
            ->all();
    }
}
