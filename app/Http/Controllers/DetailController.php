<?php

namespace App\Http\Controllers;

use App\Enums\ProductStatus;
use App\Exceptions\CartException;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Review;
use App\Services\CartService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class DetailController extends Controller
{
    public function __construct(private CartService $cartService)
    {
    }

    public function show(Request $request, int $productId): Response
    {
        $locale = app()->getLocale();

        $productBase = Cache::remember(
            "product_detail_{$productId}_{$locale}",
            1800,
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
        $product = $this->findPublishedProduct($productId);

        $data = $request->validate([
            'variant_id' => [
                'required',
                'integer',
                Rule::exists('product_variants', 'variant_id')->where(function (Builder $query) use ($product) {
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

    public function buyNow(Request $request, int $productId)
    {
        $product = $this->findPublishedProduct($productId);

        $data = $request->validate([
            'variant_id' => [
                'required',
                'integer',
                Rule::exists('product_variants', 'variant_id')->where(function (Builder $query) use ($product) {
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

            try {
                $this->cartService->prepareCheckoutData($user);
            } catch (CartException $exception) {
                return response()->json([
                    'success' => false,
                    'message' => $exception->getMessage(),
                ], 422);
            }

            if (!$user) {
                session(['url.intended' => route('cart.checkout')]);
            }

            return response()->json([
                'success' => true,
                'message' => $user ? 'Chuyển đến trang thanh toán.' : 'Vui lòng đăng nhập để tiếp tục thanh toán.',
                'redirect' => $user ? route('cart.checkout') : route('login'),
            ]);
        } catch (CartException $exception) {
            return response()->json([
                'success' => false,
                'message' => $exception->getMessage(),
            ], 422);
        } catch (\Throwable $exception) {
            Log::error('DetailController@buyNow failed', [
                'product_id' => $productId,
                'variant_id' => $data['variant_id'] ?? null,
                'error' => $exception->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Không thể xử lý yêu cầu mua ngay lúc này.',
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
        return $query->where(function (Builder $statusQuery) {
            $statusQuery->where('status', ProductStatus::PUBLISHED->value)
                ->orWhere('status', ProductStatus::PUBLISHED->name)
                ->orWhere('status', 3)
                ->orWhere('status', '3');
        });
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
}
