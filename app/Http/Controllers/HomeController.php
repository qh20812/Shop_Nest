<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Category;
use App\Models\Product;
use App\Models\FlashSaleEvent;
use App\Models\FlashSaleProduct;
use App\Models\User;
use App\Models\UserPreference;
use App\Models\ProductView;
use App\Models\SearchHistory;
use Illuminate\Support\Facades\Auth;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        
        // Get categories - active categories with image
        $categories = Category::where('is_active', true)
            ->whereNotNull('image_url')
            ->orderBy('category_id')
            ->limit(20)
            ->get()
            ->map(function ($category) {
                return [
                    'id' => $category->category_id,
                    'name' => $category->getTranslation('name', app()->getLocale()),
                    'img' => $category->image_url,
                ];
            });

        // Get active flash sale event and products
        $flashSaleData = $this->getFlashSaleData();

        // Get daily discover products (personalized)
        $dailyDiscoverProducts = $this->getDailyDiscoverProducts($user);

        return Inertia::render('Home/Index', [
            'categories' => $categories,
            'flashSale' => $flashSaleData,
            'dailyDiscover' => $dailyDiscoverProducts,
            'user' => $user ? [
                'id' => $user->id,
                'username' => $user->username,
                'email' => $user->email,
                'avatar' => $user->avatar,
            ] : null,
        ]);
    }

    private function getFlashSaleData()
    {
        $activeEvent = FlashSaleEvent::where('status', 'active')
            ->where('start_time', '<=', now())
            ->where('end_time', '>=', now())
            ->first();

        if (!$activeEvent) {
            return null;
        }

        $flashSaleProducts = FlashSaleProduct::where('flash_sale_event_id', $activeEvent->id)
            ->with(['productVariant.product', 'productVariant.image'])
            ->whereRaw('sold_count < quantity_limit')
            ->limit(10)
            ->get()
            ->map(function ($flashSaleProduct) {
                $variant = $flashSaleProduct->productVariant;
                $product = $variant?->product;
                $image = $variant?->image;
                return [
                    'id' => $product?->product_id ?? null,
                    'name' => $product ? $product->getTranslation('name', app()->getLocale()) : '',
                    'image' => $image?->image_url ?? '/images/placeholder.jpg',
                    'original_price' => $variant?->price ?? 0,
                    'flash_sale_price' => $flashSaleProduct->flash_sale_price,
                    'discount_percentage' => $flashSaleProduct->calculated_discount_percentage ?? 0,
                    'sold_count' => $flashSaleProduct->sold_count,
                    'quantity_limit' => $flashSaleProduct->quantity_limit,
                    'remaining_quantity' => $flashSaleProduct->remaining_quantity,
                ];
            });

        return [
            'event' => [
                'id' => $activeEvent->id,
                'name' => $activeEvent->name,
                'end_time' => $activeEvent->end_time,
                'banner_image' => $activeEvent->banner_image,
            ],
            'products' => $flashSaleProducts,
        ];
    }

    private function getDailyDiscoverProducts($user)
    {
        $query = Product::with(['variants', 'images', 'category', 'brand'])
            ->where('is_active', true)
            ->where('status', 'published');

        if ($user) {
            // Personalized recommendations for logged-in users
            $userPreference = UserPreference::where('user_id', $user->id)->first();
            
            if ($userPreference) {
                // Recommend based on preferred category
                if ($userPreference->preferred_category_id) {
                    $query->where('category_id', $userPreference->preferred_category_id);
                }
                
                // Filter by price range if set
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
                // Recommend based on user's viewing history if no preferences set
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

            // Exclude already viewed products
            $viewedProductIds = ProductView::where('user_id', $user->id)
                ->pluck('product_id');
            
            if ($viewedProductIds->isNotEmpty()) {
                $query->whereNotIn('product_id', $viewedProductIds);
            }
        } else {
            // Random popular products for guests
            $query->inRandomOrder();
        }

        $products = $query->limit(20)->get()
            ->map(function ($product) {
                $mainVariant = $product->variants->first();
                $mainImage = $product->images->where('is_primary', true)->first() 
                           ?? $product->images->first();

                return [
                    'id' => $product->product_id,
                    'name' => $product->getTranslation('name', app()->getLocale()),
                    'description' => $product->getTranslation('description', app()->getLocale()),
                    'image' => $mainImage?->image_url ?? '/images/placeholder.jpg',
                    'price' => $mainVariant?->price ?? 0,
                    'discount_price' => $mainVariant?->discount_price ?? null,
                    'category' => $product->category ? $product->category->getTranslation('name', app()->getLocale()) : '',
                    'brand' => $product->brand?->name ?? '',
                    'rating' => 4.5, // TODO: Calculate from reviews
                    'sold_count' => rand(10, 1000), // TODO: Get from order_items
                ];
            });

        return $products;
    }
}