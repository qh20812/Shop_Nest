<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ProductStatus;
use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Services\ProductDeletionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function __construct(private ProductDeletionService $productDeletionService) {}

    /**
     * Display a listing of products for admin moderation
     */
    public function index(Request $request)
    {
        $query = Product::with(['category', 'brand', 'seller', 'images']);

        // Filter by search (product name or variant SKU)
        if ($search = trim((string) $request->input('search'))) {
            $like = "%{$search}%";

            $query->where(function ($query) use ($like) {
                $query->where('name->vi', 'like', $like)
                    ->orWhere('name->en', 'like', $like)
                    ->orWhereHas('variants', fn ($variants) => $variants->where('sku', 'like', $like));
            });
        }

        // Filter by category
        if ($request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        // Filter by brand
        if ($request->brand_id) {
            $query->where('brand_id', $request->brand_id);
        }

        // Filter by status (accepts enum strings and legacy integers)
        if ($request->filled('status')) {
            $status = $request->input('status');
            $normalizedStatus = is_numeric($status)
                ? ProductStatus::fromLegacyInt((int) $status)->value
                : $status;

            $query->where('status', $normalizedStatus);
        }

        $totalProducts = (clone $query)->count();

        // Get products with variant count, total stock, and price range
        $products = $query->withCount('variants')
            ->withSum('variants', 'stock_quantity')
            ->with(['variants' => function ($query) {
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
                    'name' => $product->category->getTranslation('name', app()->getLocale()),
                ] : null,
                'brand' => $product->brand ? [
                    'name' => $product->brand->getTranslation('name', app()->getLocale()),
                ] : null,
                'seller' => $product->seller ? [
                    'username' => $product->seller->username,
                    'first_name' => $product->seller->first_name,
                    'last_name' => $product->seller->last_name,
                ] : null,
                'status' => $product->status,
                'images' => $product->images ? $product->images->map(function ($image) {
                    // Normalize image URL: if it's already an absolute URL (http/https), keep it,
                    // otherwise convert it using Storage::url (public disk)
                    $rawUrl = $image->image_url;
                    $imageUrl = $rawUrl;
                    if (! preg_match('/^https?:\/\//i', (string) $rawUrl) && ! str_starts_with((string) $rawUrl, '/')) {
                        $imageUrl = Storage::url($rawUrl);
                    }

                    return [
                        'image_url' => $imageUrl,
                        'is_primary' => $image->is_primary,
                    ];
                }) : null,
                'variants' => $product->variants ? $product->variants->map(function ($variant) {
                    return [
                        'price' => $variant->price,
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
                    'name' => $category->getTranslation('name', app()->getLocale()),
                ];
            });

        $brands = Brand::select('brand_id', 'name')->get()
            ->map(function ($brand) {
                return [
                    'brand_id' => $brand->brand_id,
                    'name' => $brand->getTranslation('name', app()->getLocale()),
                ];
            });

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
        $validated = $request->validate([
            'status' => ['required', Rule::in(array_merge(ProductStatus::values(), ['1', '2', '3', '4', 1, 2, 3, 4]))],
            'redirect_to' => ['sometimes', 'string', Rule::in(['index', 'show'])],
        ]);

        $status = is_numeric($validated['status'])
            ? ProductStatus::fromLegacyInt((int) $validated['status'])
            : ProductStatus::from($validated['status']);

        $product->update([
            'status' => $status->value,
        ]);

        $statusMessages = [
            ProductStatus::PUBLISHED->value => 'Product approved and activated successfully.',
            ProductStatus::HIDDEN->value => 'Product deactivated successfully.',
            ProductStatus::PENDING_APPROVAL->value => 'Product status changed to pending approval.',
            ProductStatus::DRAFT->value => 'Product status changed to draft.',
        ];

        $redirect = ($validated['redirect_to'] ?? 'index') === 'show'
            ? redirect()->route('admin.products.show', $product)
            : redirect()->route('admin.products.index');

        return $redirect->with('success', $statusMessages[$status->value]);
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
            'seller' => fn ($query) => $query->select('id', 'username', 'first_name', 'last_name', 'email', 'avatar'),
            'images',
            'variants' => function ($query) {
                $query->with(['attributeValues' => function ($subQuery) {
                    $subQuery->with('attribute');
                }])->orderBy('variant_id');
            },
            'reviews' => fn ($query) => $query->with('user')->latest('created_at'),
        ]);

        // Normalize image urls for client (convert storage paths to public URLs)
        if ($product->images) {
            $product->images = $product->images->map(function ($image) {
                $rawUrl = $image->image_url;
                if (! preg_match('/^https?:\/\//i', (string) $rawUrl) && ! str_starts_with((string) $rawUrl, '/')) {
                    $image->image_url = Storage::url($rawUrl);
                }

                return $image;
            });
        }

        return Inertia::render('Admin/Products/Show', [
            'product' => $product,
        ]);
    }

    /**
     * Soft delete product (admin can remove products)
     */
    public function destroy(Product $product)
    {
        $this->productDeletionService->delete($product);

        return redirect()->route('admin.products.index')->with('success', 'Product removed successfully.');
    }
}
