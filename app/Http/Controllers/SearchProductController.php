<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SearchProductController extends Controller
{
    /**
     * Handle product search with filters and sorting.
     */
    public function index(Request $request)
    {
        $locale = app()->getLocale();

        $keyword      = trim((string)$request->query('search', ''));
        $categoryIds  = array_filter((array)$request->query('category_ids', []));
        $brandIds     = array_filter((array)$request->query('brand_ids', []));
        $priceMin     = $request->query('price_min');
        $priceMax     = $request->query('price_max');
        $ratingMin    = $request->query('rating_min'); // placeholder (requires review aggregation)
        $states       = array_filter((array)$request->query('states', [])); // e.g. ['new','sale']
        $sort         = $request->query('sort', 'popular');

        $query = Product::query()
            ->with(['images' => function ($q) {
                $q->orderByDesc('is_primary')->orderBy('display_order');
            }, 'variants'])
            ->where('is_active', true);

        if ($keyword !== '') {
            $query->where(function ($q) use ($keyword) {
                $q->where('name->vi', 'LIKE', "%$keyword%")
                  ->orWhere('name->en', 'LIKE', "%$keyword%")
                  ->orWhere('description->vi', 'LIKE', "%$keyword%")
                  ->orWhere('description->en', 'LIKE', "%$keyword%");
            });
        }

        if ($categoryIds) {
            $query->whereIn('category_id', $categoryIds);
        }
        if ($brandIds) {
            $query->whereIn('brand_id', $brandIds);
        }

        // Price filtering via variants
        if ($priceMin !== null || $priceMax !== null) {
            $query->whereHas('variants', function ($q) use ($priceMin, $priceMax) {
                if ($priceMin !== null) {
                    $q->where(function ($qq) use ($priceMin) {
                        $qq->where('discount_price', '>=', $priceMin)
                           ->orWhere(function ($qqq) use ($priceMin) {
                               $qqq->whereNull('discount_price')->where('price', '>=', $priceMin);
                           });
                    });
                }
                if ($priceMax !== null) {
                    $q->where(function ($qq) use ($priceMax) {
                        $qq->where('discount_price', '<=', $priceMax)
                           ->orWhere(function ($qqq) use ($priceMax) {
                               $qqq->whereNull('discount_price')->where('price', '<=', $priceMax);
                           });
                    });
                }
            });
        }

        // Placeholder rating filter (requires review aggregation). Currently ignored if no mechanism.
        if ($ratingMin !== null) {
            // Future implementation: $query->whereRaw('(SELECT AVG(rating) FROM order_reviews WHERE order_reviews.product_id = products.product_id) >= ?', [$ratingMin]);
        }

        // State filters
        if ($states) {
            $query->where(function ($q) use ($states) {
                foreach ($states as $state) {
                    if ($state === 'new') {
                        $q->orWhere('created_at', '>=', now()->subDays(14));
                    }
                    if ($state === 'sale') {
                        $q->orWhereHas('variants', function ($v) {
                            $v->whereNotNull('discount_price');
                        });
                    }
                }
            });
        }

        // Sorting
        switch ($sort) {
            case 'price_asc':
                // Sort by minimum effective price asc using subquery
                $query->addSelect([
                    'min_effective_price' => \App\Models\ProductVariant::selectRaw('MIN(LEAST(COALESCE(discount_price, price), price))')
                        ->whereColumn('product_id', 'products.product_id')
                ])->orderBy('min_effective_price');
                break;
            case 'price_desc':
                // Sort by minimum effective price desc using subquery
                $query->addSelect([
                    'min_effective_price' => \App\Models\ProductVariant::selectRaw('MIN(LEAST(COALESCE(discount_price, price), price))')
                        ->whereColumn('product_id', 'products.product_id')
                ])->orderByDesc('min_effective_price');
                break;
            case 'newest':
                $query->orderByDesc('created_at');
                break;
            case 'popular':
            default:
                // Placeholder popularity: newest fallback
                $query->orderByDesc('created_at');
        }

        $perPage = (int)$request->query('per_page', 20);
        $productsPaginator = $query->paginate($perPage)->appends($request->query());

        // Transform products to card shape
        $productsData = $productsPaginator->getCollection()->map(function (Product $product) use ($locale) {
            $primaryImage = $product->images->first();
            $imageUrl = $primaryImage?->image_url;
            if ($imageUrl && !str_starts_with($imageUrl, 'http')) {
                $imageUrl = Storage::url($imageUrl);
            }

            // Price range
            $minPrice = null; $maxPrice = null; $minDiscount = null;
            foreach ($product->variants as $variant) {
                $price = (float)$variant->price;
                $discount = $variant->discount_price !== null ? (float)$variant->discount_price : null;
                $minPrice = $minPrice === null ? $price : min($minPrice, $price);
                $maxPrice = $maxPrice === null ? $price : max($maxPrice, $price);
                if ($discount !== null) {
                    $minDiscount = $minDiscount === null ? $discount : min($minDiscount, $discount);
                }
            }
            $isSale = $minDiscount !== null && $minDiscount < $minPrice;
            $currentPrice = $isSale ? $minDiscount : $minPrice;
            $originalPrice = $isSale ? $minPrice : null;

            $rating = null; // Placeholder until review aggregation available
            $isNew = $product->created_at && $product->created_at->gt(now()->subDays(14));

            return [
                'id'            => $product->product_id,
                'image'         => $imageUrl ?? null,
                'name'          => $product->getTranslation('name', $locale) ?? '',
                'rating'        => $rating, // may be null
                'currentPrice'  => $currentPrice,
                'originalPrice' => $originalPrice,
                'isSale'        => $isSale,
                'isNew'         => $isNew,
                'favorited'     => false, // wishlist integration pending
            ];
        })->values();

        // Filters data (for sidebar)
        $categories = Category::query()->where('is_active', true)->limit(50)->get()->map(function ($c) use ($locale) {
            return [
                'id' => $c->category_id,
                'name' => $c->getTranslation('name', $locale) ?? $c->name,
            ];
        });
        $brands = Brand::query()->where('is_active', true)->limit(50)->get()->map(function ($b) use ($locale) {
            return [
                'id' => $b->brand_id,
                'name' => $b->getTranslation('name', $locale) ?? $b->name,
            ];
        });

        $activeFilters = [
            'search'       => $keyword ?: null,
            'category_ids' => $categoryIds ?: null,
            'brand_ids'    => $brandIds ?: null,
            'price_min'    => $priceMin !== null ? (float)$priceMin : null,
            'price_max'    => $priceMax !== null ? (float)$priceMax : null,
            'rating_min'   => $ratingMin !== null ? (int)$ratingMin : null,
            'states'       => $states ?: null,
            'sort'         => $sort,
        ];

        return Inertia::render('Home/search-page', [
            'query'      => $keyword,
            'total'      => $productsPaginator->total(),
            'products'   => [
                'data' => $productsData,
                'current_page' => $productsPaginator->currentPage(),
                'last_page' => $productsPaginator->lastPage(),
                'per_page' => $productsPaginator->perPage(),
                'total' => $productsPaginator->total(),
            ],
            'filters'    => [
                'categories' => $categories,
                'brands'     => $brands,
                'ratingOptions' => [5,4,3],
                'states' => ['new','sale'],
                'sortOptions' => [
                    ['value' => 'popular', 'label' => 'Phổ biến nhất'],
                    ['value' => 'price_asc', 'label' => 'Giá: Thấp đến cao'],
                    ['value' => 'price_desc', 'label' => 'Giá: Cao đến thấp'],
                    ['value' => 'newest', 'label' => 'Mới nhất'],
                ],
            ],
            'activeFilters' => $activeFilters,
        ]);
    }
}
