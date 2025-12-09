<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Enums\ProductStatus;
use App\Models\Category;
use App\Models\FlashSaleEvent;
use App\Models\FlashSaleProduct;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\ProductView;
use App\Models\Review;
use App\Models\UserPreference;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use App\Services\CartService;
use App\Models\User;

class HomeController extends Controller
{
    public function __construct(private CartService $cartService)
    {
    }

    public function index(Request $request)
    {
        $user = Auth::user();
        
        if ($user) {
            $user = User::with('roles')->find($user->id);
        }
        
        $locale = app()->getLocale();

        $categories = Cache::remember("home_categories_{$locale}", 900, function () use ($locale) {
            try {
                return Category::where('is_active', true)
                    ->whereNotNull('image_url')
                    ->orderBy('name')
                    ->limit(30)
                    ->get()
                    ->map(function ($category) use ($locale) {
                        return [
                            'id' => $category->category_id,
                            'name' => $category->getTranslation('name', $locale) ?? $category->name,
                            'slug' => $category->slug,
                            'icon' => $this->getCategoryIcon($category->name),
                            'image_url' => $category->image_url,
                        ];
                    })
                    ->values()
                    ->toArray();
            } catch (\Exception $e) {
                Log::error('Failed to fetch categories: ' . $e->getMessage());
                return [];
            }
        });

        $flashSaleData = Cache::remember("home_flash_sale_{$locale}", 900, function () use ($locale) {
            return $this->getFlashSaleData($locale);
        });

        $suggestedProducts = $this->getSuggestedProducts($user, $locale);
        $bestSellers = $this->getBestSellerProducts($locale);
        $banners = $this->getActiveBanners();

        return Inertia::render('Home/Index', [
            'categories' => $categories,
            'flashSale' => $flashSaleData,
            'suggestedProducts' => $suggestedProducts,
            'bestSellers' => $bestSellers,
            'banners' => $banners,
        ]);
    }

    private function getFlashSaleData(string $locale): ?array
    {
        try {
            $activeEvent = FlashSaleEvent::query()
                ->where('status', 'active')
                ->where('start_time', '<=', now())
                ->where('end_time', '>=', now())
                ->first();

            if (!$activeEvent) {
                return null;
            }

            $flashSaleProducts = FlashSaleProduct::query()
                ->where('flash_sale_event_id', $activeEvent->id)
                ->where(function (Builder $query) {
                    $query->whereColumn('sold_count', '<', 'quantity_limit')
                        ->orWhere('quantity_limit', 0)
                        ->orWhereNull('quantity_limit');
                })
                ->whereHas('productVariant.product', function (Builder $productQuery) {
                    $productQuery->where('is_active', true);
                    $this->applyPublishedStatusFilter($productQuery);
                })
                ->with([
                    'productVariant.product.category',
                    'productVariant.product.brand',
                    'productVariant.product.images' => function ($query) {
                        $query->orderByDesc('is_primary')->orderBy('display_order');
                    },
                ])
                ->limit(10)
                ->get()
                ->map(function (FlashSaleProduct $flashSaleProduct) use ($locale) {
                    $variant = $flashSaleProduct->productVariant;
                    $product = $variant?->product;

                    if (!$product) {
                        return null;
                    }

                    return [
                        'id' => $product->product_id,
                        'name' => $product->getTranslation('name', $locale),
                        'image' => $this->resolveVariantImage($variant),
                        'price' => (float) $flashSaleProduct->flash_sale_price,
                        'oldPrice' => (float) ($variant?->price ?? 0),
                        'discount' => max(0, round((float) $flashSaleProduct->calculated_discount_percentage, 2)),
                        'category' => $product->category ? $product->category->getTranslation('name', $locale) : null,
                        'brand' => $product->brand?->name ?? null,
                    ];
                })
                ->filter()
                ->values()
                ->toArray();

            if (empty($flashSaleProducts)) {
                return null;
            }

            return [
                'event' => [
                    'id' => $activeEvent->id,
                    'name' => $activeEvent->name,
                    'status' => $activeEvent->status,
                    'start_time' => optional($activeEvent->start_time)?->toIso8601String(),
                    'end_time' => optional($activeEvent->end_time)?->toIso8601String(),
                    'banner_image' => $activeEvent->banner_image,
                ],
                'products' => $flashSaleProducts,
            ];
        } catch (\Throwable $e) {
            Log::error('Error in getFlashSaleData: ' . $e->getMessage(), ['exception' => $e]);

            return null;
        }
    }

    private function getSuggestedProducts($user, string $locale): array
    {
        try {
            if ($user) {
                $query = $this->buildBaseProductQuery();

                $userPreference = UserPreference::where('user_id', $user->id)->first();

                if ($userPreference) {
                    if ($userPreference->preferred_category_id) {
                        $query->where('category_id', $userPreference->preferred_category_id);
                    }

                    if ($userPreference->preferred_brand_id) {
                        $query->where('brand_id', $userPreference->preferred_brand_id);
                    }

                    if ($userPreference->min_price_range || $userPreference->max_price_range) {
                        $query->whereHas('variants', function ($variantQuery) use ($userPreference) {
                            if ($userPreference->min_price_range) {
                                $variantQuery->where('price', '>=', $userPreference->min_price_range);
                            }
                            if ($userPreference->max_price_range) {
                                $variantQuery->where('price', '<=', $userPreference->max_price_range);
                            }
                        });
                    }
                } else {
                    $viewedCategories = ProductView::where('user_id', $user->id)
                        ->join('products', 'product_views.product_id', '=', 'products.product_id')
                        ->select('products.category_id')
                        ->distinct()
                        ->pluck('category_id')
                        ->take(3);

                    if ($viewedCategories->isNotEmpty()) {
                        $query->whereIn('category_id', $viewedCategories);
                    }
                }

                $viewedProductIds = ProductView::where('user_id', $user->id)
                    ->pluck('product_id');

                if ($viewedProductIds->isNotEmpty()) {
                    $query->whereNotIn('product_id', $viewedProductIds);
                }

                $products = $query->limit(12)->get();

                return $this->formatProducts($products, $locale);
            }

            return Cache::remember("home_suggested_guest_{$locale}", 900, function () use ($locale) {
                $products = $this->buildBaseProductQuery()
                    ->inRandomOrder()
                    ->limit(12)
                    ->get();

                return $this->formatProducts($products, $locale);
            });
        } catch (\Throwable $e) {
            Log::error('Error in getSuggestedProducts: ' . $e->getMessage(), ['exception' => $e]);

            return [];
        }
    }

    private function getBestSellerProducts(string $locale): array
    {
        try {
            return Cache::remember("home_best_sellers_{$locale}", 900, function () use ($locale) {
                $productIds = OrderItem::query()
                    ->join('product_variants', 'order_items.variant_id', '=', 'product_variants.variant_id')
                    ->join('orders', 'order_items.order_id', '=', 'orders.order_id')
                    ->where('orders.status', '!=', 'cancelled')
                    ->selectRaw('product_variants.product_id, SUM(order_items.quantity) as total_sold')
                    ->groupBy('product_variants.product_id')
                    ->orderByDesc('total_sold')
                    ->limit(12)
                    ->pluck('product_id');

                if ($productIds->isEmpty()) {
                    $products = $this->buildBaseProductQuery()
                        ->inRandomOrder()
                        ->limit(12)
                        ->get();
                } else {
                    $products = $this->buildBaseProductQuery()
                        ->whereIn('product_id', $productIds)
                        ->get()
                        ->sortBy(function ($product) use ($productIds) {
                            return array_search($product->product_id, $productIds->toArray());
                        })
                        ->values();
                }

                return $this->formatProducts($products, $locale);
            });
        } catch (\Throwable $e) {
            Log::error('Error in getBestSellerProducts: ' . $e->getMessage(), ['exception' => $e]);

            return [];
        }
    }

    private function buildBaseProductQuery(): Builder
    {
        $query = Product::with(['variants', 'images', 'category', 'brand'])
            ->where('is_active', true);

        $this->applyPublishedStatusFilter($query);

        return $query;
    }

    private function formatProducts(Collection $products, string $locale): array
    {
        if ($products->isEmpty()) {
            return [];
        }

        $productIds = $products->pluck('product_id')->all();
        $averageRatings = $this->fetchAverageRatings($productIds);
        $reviewCounts = $this->fetchReviewCounts($productIds);

        return $products->map(function ($product) use ($locale, $averageRatings, $reviewCounts) {
            $mainVariant = $product->variants->first();
            $mainImage = $product->images->where('is_primary', true)->first()
                ?? $product->images->first();

            $price = (float) ($mainVariant?->price ?? 0);
            $discountPrice = $mainVariant?->discount_price !== null ? (float) $mainVariant->discount_price : null;

            return [
                'id' => $product->product_id,
                'name' => $product->getTranslation('name', $locale),
                'image' => $mainImage?->image_url ?? '/images/placeholder.jpg',
                'price' => $discountPrice ?? $price,
                'oldPrice' => $discountPrice ? $price : null,
                'discount' => $discountPrice ? round((($price - $discountPrice) / $price) * 100, 0) : null,
                'rating' => $averageRatings[$product->product_id] ?? null,
                'reviews' => $reviewCounts[$product->product_id] ?? 0,
                'category' => $product->category ? $product->category->getTranslation('name', $locale) : null,
                'brand' => $product->brand?->name ?? null,
            ];
        })->values()->toArray();
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

    private function resolveVariantImage(?ProductVariant $variant): string
    {
        if (!$variant) {
            return '/images/placeholder.jpg';
        }

        $product = $variant->relationLoaded('product')
            ? $variant->product
            : $variant->product()->with(['images' => function ($query) {
                $query->orderByDesc('is_primary')->orderBy('display_order');
            }])->first();

        if (!$product) {
            return '/images/placeholder.jpg';
        }

        $images = $product->relationLoaded('images')
            ? $product->images
            : $product->images()->orderByDesc('is_primary')->orderBy('display_order')->get();

        if ($variant->image_id) {
            $variantImage = $images->firstWhere('image_id', $variant->image_id);
            if ($variantImage) {
                return $variantImage->image_url;
            }
        }

        $primaryImage = $images->firstWhere('is_primary', true);
        if ($primaryImage) {
            return $primaryImage->image_url;
        }

        $fallbackImage = $images->sortBy('display_order')->first();
        if ($fallbackImage) {
            return $fallbackImage->image_url;
        }

        return '/images/placeholder.jpg';
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
            ->map(function ($average) {
                return round((float) $average, 1);
            })
            ->toArray();
    }

    private function fetchReviewCounts(array $productIds): array
    {
        if (empty($productIds)) {
            return [];
        }

        return Review::query()
            ->whereIn('product_id', $productIds)
            ->where('is_approved', true)
            ->selectRaw('product_id, COUNT(*) as review_count')
            ->groupBy('product_id')
            ->pluck('review_count', 'product_id')
            ->map(function ($count) {
                return (int) $count;
            })
            ->toArray();
    }

    private function getCategoryIcon(string $categoryName): string
    {
        $icons = [
            'Electronics' => '📱',
            'Fashion' => '👔',
            'Home' => '🏠',
            'Books' => '📚',
            'Sports' => '⚽',
            'Toys' => '🧸',
            'Beauty' => '💄',
            'Automotive' => '🚗',
            'Food' => '🍔',
            'Health' => '💊',
        ];

        foreach ($icons as $key => $icon) {
            if (stripos($categoryName, $key) !== false) {
                return $icon;
            }
        }

        return '📦';
    }

    private function getActiveBanners(): array
    {
        try {
            return Cache::remember('home_banners', 900, function () {
                return [];
            });
        } catch (\Throwable $e) {
            Log::error('Error in getActiveBanners: ' . $e->getMessage(), ['exception' => $e]);
            return [];
        }
    }
}