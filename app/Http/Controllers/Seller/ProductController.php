<?php


namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Http\Requests\Seller\StoreProductRequest;
use App\Http\Requests\Seller\UpdateProductRequest;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use App\Enums\ProductStatus;
use App\Events\ProductUpdated;
use App\Services\ImageValidationService;
use App\Services\Seller\StoreImagesService;
use App\Services\Seller\GenerateSkuService;
use App\Services\Seller\ProductViewService;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Validation\Rule;

class ProductController extends Controller
{
    protected ImageValidationService $imageValidationService;
    protected StoreImagesService $storeImagesService;
    protected GenerateSkuService $generateSkuService;
    protected ProductViewService $productViewService;

    public function __construct(ImageValidationService $imageValidationService, StoreImagesService $storeImagesService, GenerateSkuService $generateSkuService, ProductViewService $productViewService)
    {
        $this->authorizeResource(Product::class, 'product');
        $this->imageValidationService = $imageValidationService;
        $this->storeImagesService = $storeImagesService;
        $this->generateSkuService = $generateSkuService;
        $this->productViewService = $productViewService;
    }

    public function index(): Response
    {
        $filters = request()->validate([
            'search' => ['nullable', 'string', 'max:255'],
            'category_id' => ['nullable', 'integer'],
            'brand_id' => ['nullable', 'integer'],
            'status' => ['nullable', Rule::in(array_merge(ProductStatus::values(), ['1', '2', '3', '4', 1, 2, 3, 4]))],
        ]);

        $query = Product::with([
            'category',
            'brand',
            'images' => fn($query) => $query->where('is_primary', true),
            'variants' => fn($query) => $query->orderBy('created_at'),
            'reviews' => fn($query) => $query->latest()->limit(
                (int) config('app.reviews.limit', 5)
            ),
        ])
            ->withCount('variants')
            ->withSum('variants', 'stock_quantity')
            ->where('seller_id', Auth::id());

        // Search and filters
        if ($search = Arr::get($filters, 'search')) {
            $query->where(function ($query) use ($search) {
                $like = "%{$search}%";
                $query->whereRaw('JSON_UNQUOTE(JSON_EXTRACT(name, "$.vi")) LIKE ?', [$like])
                    ->orWhereRaw('JSON_UNQUOTE(JSON_EXTRACT(name, "$.en")) LIKE ?', [$like]);
            });
        }

        if ($categoryId = Arr::get($filters, 'category_id')) {
            $query->where('category_id', $categoryId);
        }

        if ($brandId = Arr::get($filters, 'brand_id')) {
            $query->where('brand_id', $brandId);
        }

        if (($status = Arr::get($filters, 'status')) !== null) {
            $normalizedStatus = is_numeric($status)
                ? ProductStatus::fromLegacyInt((int) $status)->value
                : $status;

            $query->where('status', $normalizedStatus);
        }

        $products = $query->latest()->paginate((int) config('app.pagination.per_page', 10))->withQueryString();

        return Inertia::render('Seller/Products/Index', [
            'products' => $products,
            'filters' => request()->only(['search', 'category_id', 'brand_id', 'status']),
            'categories' => $this->getCachedCategories(),
            'brands' => $this->getCachedBrands(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Seller/Products/Create', [
            'categories' => $this->getCachedCategories(),
            'brands' => $this->getCachedBrands(),
        ]);
    }

    public function store(StoreProductRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $sellerId = Auth::id();
        /** @var User|null $seller */
        $seller = Auth::user();
        $activeShop = $seller?->ownedShops()->where('status', 'active')->first();
        $shopId = $activeShop?->id ?? $seller?->ownedShops()->value('id');

        try {
            DB::transaction(function () use ($validated, $sellerId, $shopId): void {
                $productData = [
                    'seller_id' => $sellerId,
                    'category_id' => $validated['category_id'],
                    'brand_id' => $validated['brand_id'],
                    'status' => ProductStatus::from($validated['status'])->value,
                    'is_active' => true,
                    'meta_title' => Arr::get($validated, 'meta_title') ?: null,
                    'meta_slug' => Arr::get($validated, 'meta_slug') ?: null,
                    'meta_description' => Arr::get($validated, 'meta_description') ?: null,
                ];

                if ($shopId) {
                    $productData['shop_id'] = $shopId;
                }

                $nameTranslations = ['vi' => $validated['name']];
                if (!empty($validated['name_en'])) {
                    $nameTranslations['en'] = $validated['name_en'];
                }
                $productData['name'] = $nameTranslations;

                $descriptionTranslations = ['vi' => $validated['description'] ?? ''];
                if (!empty($validated['description_en'])) {
                    $descriptionTranslations['en'] = $validated['description_en'];
                }
                $productData['description'] = $descriptionTranslations;

                $product = Product::create($productData);

                $this->createVariants($product, $validated['variants']);

                if (!empty($validated['images'])) {
                    $this->storeImagesService->storeImages($product, $validated['images']);
                }
            });

            return redirect()->route('seller.products.index')->with('success', 'Tạo sản phẩm thành công.');
        } catch (\Exception $e) {
            Log::error('Seller product creation failed', [
                'seller_id' => $sellerId,
                'errors' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return back()->withErrors([
                'error' => 'Có lỗi xảy ra khi tạo sản phẩm: ' . $e->getMessage(),
            ])->withInput();
        }
    }

    public function show(Product $product): Response
    {
        $productForView = $this->productViewService->prepareForView($product);

        return Inertia::render('Seller/Products/Show', [
            'product' => $productForView,
        ]);
    }

    public function edit(Product $product): Response
    {
        $productForView = $this->productViewService->prepareForView($product);

        return Inertia::render('Seller/Products/Edit', [
            'product' => $productForView,
            'categories' => $this->getCachedCategories(),
            'brands' => $this->getCachedBrands(),
        ]);
    }

    public function update(UpdateProductRequest $request, Product $product): RedirectResponse
    {
        $validated = $request->validated();

        try {
            DB::transaction(function () use ($product, $validated): void {
                $productData = [
                    'category_id' => $validated['category_id'],
                    'brand_id' => $validated['brand_id'],
                    'status' => ProductStatus::from($validated['status'])->value,
                    'meta_title' => Arr::get($validated, 'meta_title') ?: null,
                    'meta_slug' => Arr::get($validated, 'meta_slug') ?: null,
                    'meta_description' => Arr::get($validated, 'meta_description') ?: null,
                ];

                $nameTranslations = ['vi' => $validated['name']];
                if (!empty($validated['name_en'])) {
                    $nameTranslations['en'] = $validated['name_en'];
                }
                $productData['name'] = $nameTranslations;

                $descriptionTranslations = ['vi' => $validated['description'] ?? ''];
                if (!empty($validated['description_en'])) {
                    $descriptionTranslations['en'] = $validated['description_en'];
                }
                $productData['description'] = $descriptionTranslations;
                $product->update($productData);

                $this->updateVariants($product, $validated['variants']);

                if (isset($validated['images'])) {
                    $this->storeImagesService->storeImages($product, $validated['images']);
                }
            });

            ProductUpdated::dispatch($product);

            return redirect()->route('seller.products.index')->with('success', 'Cập nhật sản phẩm thành công.');
        } catch (\Exception $e) {
            Log::error('Seller product update failed', [
                'seller_id' => $product->seller_id,
                'product_id' => $product->product_id,
                'errors' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return back()->withErrors([
                'error' => 'Có lỗi xảy ra khi cập nhật sản phẩm: ' . $e->getMessage(),
            ])->withInput();
        }
    }

    public function destroy(Product $product): RedirectResponse
    {
        DB::transaction(function () use ($product): void {
            $product->loadMissing('images');

            $this->storeImagesService->deleteProductImages($product);

            $product->delete();
        });

        return redirect()->route('seller.products.index')->with('success', 'Xóa sản phẩm thành công.');
    }

    /**
     * Create multiple variants for a product.
     */
    private function createVariants(Product $product, array $variantsData): void
    {
        foreach ($variantsData as $variantData) {
            $product->variants()->create([
                'variant_name' => Arr::get($variantData, 'variant_name'),
                'sku' => Arr::get($variantData, 'sku') ?: $this->generateSkuService->generateSku(),
                'price' => Arr::get($variantData, 'price', 0),
                'stock_quantity' => Arr::get($variantData, 'stock_quantity', 0),
                'option_values' => Arr::get($variantData, 'option_values'),
                'option_signature' => Arr::get($variantData, 'option_signature'),
                'is_primary' => Arr::get($variantData, 'is_primary', false),
            ]);
        }
    }

    /**
     * Update variants for a product, handling additions, updates, and deletions.
     */
    private function updateVariants(Product $product, array $variantsData): void
    {
        $existingVariants = $product->variants()->get()->keyBy('variant_id');
        $updatedVariantIds = [];

        foreach ($variantsData as $variantData) {
            $variantId = Arr::get($variantData, 'variant_id');

            if ($variantId && isset($existingVariants[$variantId])) {
                // Update existing variant
                $existingVariants[$variantId]->update([
                    'variant_name' => Arr::get($variantData, 'variant_name'),
                    'sku' => Arr::get($variantData, 'sku'),
                    'price' => Arr::get($variantData, 'price', 0),
                    'stock_quantity' => Arr::get($variantData, 'stock_quantity', 0),
                    'option_values' => Arr::get($variantData, 'option_values'),
                    'option_signature' => Arr::get($variantData, 'option_signature'),
                    'is_primary' => Arr::get($variantData, 'is_primary', false),
                ]);
                $updatedVariantIds[] = $variantId;
            } else {
                // Create new variant
                $newVariant = $product->variants()->create([
                    'variant_name' => Arr::get($variantData, 'variant_name'),
                    'sku' => Arr::get($variantData, 'sku') ?: $this->generateSkuService->generateSku(),
                    'price' => Arr::get($variantData, 'price', 0),
                    'stock_quantity' => Arr::get($variantData, 'stock_quantity', 0),
                    'option_values' => Arr::get($variantData, 'option_values'),
                    'option_signature' => Arr::get($variantData, 'option_signature'),
                    'is_primary' => Arr::get($variantData, 'is_primary', false),
                ]);
                $updatedVariantIds[] = $newVariant->variant_id;
            }
        }

        // Delete variants that are no longer present
        $variantsToDelete = $existingVariants->filter(function ($variant) use ($updatedVariantIds) {
            return !in_array($variant->variant_id, $updatedVariantIds);
        });

        foreach ($variantsToDelete as $variant) {
            $variant->delete();
        }
    }

    private function getCachedCategories()
    {
        return Cache::remember('seller_categories_list', 3600, static function () {
            return Category::select('category_id', 'name')->get();
        });
    }

    private function getCachedBrands()
    {
        return Cache::remember('seller_brands_list', 3600, static function () {
            return Brand::select('brand_id', 'name')->get();
        });
    }
}
