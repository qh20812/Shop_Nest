<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProductRequest;
use App\Http\Requests\Admin\UpdateProductRequest;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;


class ProductController extends Controller
{
    /**
     * Display a listing of products for admin moderation
     */
    public function index(Request $request)
    {
        $query = Product::with(['category', 'brand', 'seller', 'images']);

        // Filter by search (product name)
        if ($request->search) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        // Filter by category
        if ($request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        // Filter by brand
        if ($request->brand_id) {
            $query->where('brand_id', $request->brand_id);
        }

        // Filter by status
        if ($request->status) {
            $query->where('status', (int)$request->status);
        }

        // Get products with variant count, total stock, and price range
        $products = $query->withCount('variants')
            ->withSum('variants', 'stock_quantity')
            ->with(['variants' => function($query) {
                $query->select('product_id', 'price')
                      ->orderBy('price');
            }])
            ->latest()
            ->paginate(10)
            ->withQueryString();

        // Transform products to resolve translations
        $transformedProducts = $products->getCollection()->map(function ($product) {
            return [
                'product_id' => $product->product_id,
                'name' => $product->getTranslation('name', app()->getLocale()),
                'category' => $product->category ? [
                    'name' => $product->category->getTranslation('name', app()->getLocale())
                ] : null,
                'brand' => $product->brand ? [
                    'name' => $product->brand->getTranslation('name', app()->getLocale())
                ] : null,
                'seller' => $product->seller ? [
                    'username' => $product->seller->username,
                    'first_name' => $product->seller->first_name,
                    'last_name' => $product->seller->last_name
                ] : null,
                'status' => $product->status,
                'images' => $product->images ? $product->images->map(function($image) {
                    return [
                        'image_url' => $image->image_url,
                        'is_primary' => $image->is_primary
                    ];
                }) : null,
                'variants' => $product->variants ? $product->variants->map(function($variant) {
                    return [
                        'price' => $variant->price
                    ];
                }) : null,
                'variants_count' => $product->variants_count,
                'variants_sum_stock_quantity' => $product->variants_sum_stock_quantity,
            ];
        });
        $products->setCollection($transformedProducts);

        // Get filter data and resolve translations
        $categories = Category::select('category_id', 'name')->get()
            ->map(function ($category) {
                return [
                    'category_id' => $category->category_id,
                    'name' => $category->getTranslation('name', app()->getLocale())
                ];
            });
        
        $brands = Brand::select('brand_id', 'name')->get()
            ->map(function ($brand) {
                return [
                    'brand_id' => $brand->brand_id,
                    'name' => $brand->getTranslation('name', app()->getLocale())
                ];
            });

        $totalProducts = Product::count();

        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
            'categories' => $categories,
            'brands' => $brands,
            'filters' => $request->only(['search', 'category_id', 'brand_id', 'status']),
            'totalProducts' => $totalProducts,
        ]);
    }

    /**
     * Update product status (approve, reject, activate, deactivate)
     */
    public function updateStatus(Request $request, Product $product)
    {
        $request->validate([
            'status' => 'required|integer|in:1,2,3', // 1=pending, 2=active, 3=inactive
        ]);

        $product->update([
            'status' => $request->status
        ]);

        $statusMessages = [
            1 => 'Product status changed to pending.',
            2 => 'Product approved and activated successfully.',
            3 => 'Product deactivated successfully.',
        ];

        return redirect()->route('admin.products.index')
            ->with('success', $statusMessages[$request->status]);
    }

    /**
     * Display the specified product
     */
    public function show(Product $product)
    {
        // Eager-load all necessary relationships with proper nesting
        $product->load([
            'category',
            'brand', 
            'images',
            'variants' => function($query) {
                $query->with(['attributeValues' => function($subQuery) {
                    $subQuery->with('attribute');
                }]);
            },
            'reviews.user'
        ]);

        return Inertia::render('Admin/Products/Show', [
            'product' => $product,
        ]);
    }

    /**
     * Soft delete product (admin can remove products)
     */
    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()->route('admin.products.index')->with('success', 'Product removed successfully.');
    }
}