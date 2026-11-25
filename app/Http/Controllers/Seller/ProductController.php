<?php

namespace App\Http\Controllers\Seller;

use App\Enums\ProductStatus;
use App\Events\ProductUpdated;
use App\Http\Controllers\Controller;
use App\Http\Requests\Seller\StoreProductRequest;
use App\Http\Requests\Seller\UpdateProductRequest;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use App\Services\InventoryService;
use App\Services\ProductDeletionService;
use App\Services\Seller\GenerateSkuService;
use App\Services\Seller\ProductViewService;
use App\Services\Seller\StoreImagesService;
use App\Services\Seller\VariantSkuService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function __construct(
        private StoreImagesService $storeImagesService,
        private GenerateSkuService $generateSkuService,
        private ProductViewService $productViewService,
        private InventoryService $inventoryService,
        private VariantSkuService $variantSkuService,
        private ProductDeletionService $productDeletionService,
    ) {
        $this->authorizeResource(Product::class, 'product');
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
            'images' => fn ($query) => $query->where('is_primary', true),
            'variants' => fn ($query) => $query->orderBy('created_at'),
            'reviews' => fn ($query) => $query->latest()->limit(
                (int) config('app.reviews.limit', 5)
            ),
        ])
            ->withCount('variants')
            ->withSum('variants', 'stock_quantity')
            ->where('seller_id', Auth::id());

        if ($search = Arr::get($filters, 'search')) {
            $like = "%{$search}%";

            $query->where(function ($query) use ($like) {
                $query->where('name->vi', 'like', $like)
                    ->orWhere('name->en', 'like', $like)
                    ->orWhereHas('variants', fn ($variants) => $variants->where('sku', 'like', $like));
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
                if (! empty($validated['name_en'])) {
                    $nameTranslations['en'] = $validated['name_en'];
                }
                $productData['name'] = $nameTranslations;

                $descriptionTranslations = ['vi' => $validated['description'] ?? ''];
                if (! empty($validated['description_en'])) {
                    $descriptionTranslations['en'] = $validated['description_en'];
                }
                $productData['description'] = $descriptionTranslations;

                $product = Product::create($productData);

                $this->createVariants($product, $validated['variants']);

                if (! empty($validated['images'])) {
                    $this->storeImagesService->storeImages($product, $validated['images']);
                }
            });

            return redirect()->route('seller.products.index')->with('success', 'Tạo sản phẩm thành công.');
        } catch (ValidationException $exception) {
            throw $exception;
        } catch (\Throwable $exception) {
            Log::error('Seller product creation failed', [
                'seller_id' => $sellerId,
                'errors' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString(),
            ]);

            return back()->withErrors([
                'error' => 'Có lỗi xảy ra khi tạo sản phẩm. Vui lòng thử lại.',
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
                $productData = $this->buildProductUpdatePayload($product, $validated);

                if ($productData !== []) {
                    $product->update($productData);
                }

                if (array_key_exists('variants', $validated)) {
                    $this->updateVariants($product, $validated['variants']);
                }

                if (! empty($validated['images'])) {
                    $this->storeImagesService->storeImages($product, $validated['images']);
                }
            });

            ProductUpdated::dispatch($product);

            return redirect()->route('seller.products.index')->with('success', 'Cập nhật sản phẩm thành công.');
        } catch (ValidationException $exception) {
            throw $exception;
        } catch (\Throwable $exception) {
            Log::error('Seller product update failed', [
                'seller_id' => $product->seller_id,
                'product_id' => $product->product_id,
                'errors' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString(),
            ]);

            return back()->withErrors([
                'error' => 'Có lỗi xảy ra khi cập nhật sản phẩm. Vui lòng thử lại.',
            ])->withInput();
        }
    }

    public function destroy(Product $product): RedirectResponse
    {
        $this->productDeletionService->delete($product);

        return redirect()->route('seller.products.index')->with('success', 'Xóa sản phẩm thành công.');
    }

    /**
     * Build a partial update payload without overwriting fields that were not sent.
     *
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    private function buildProductUpdatePayload(Product $product, array $validated): array
    {
        $payload = [];

        if (array_key_exists('category_id', $validated)) {
            $payload['category_id'] = $validated['category_id'];
        }

        if (array_key_exists('brand_id', $validated)) {
            $payload['brand_id'] = $validated['brand_id'];
        }

        if (array_key_exists('status', $validated)) {
            $payload['status'] = ProductStatus::from($validated['status'])->value;
        }

        foreach (['meta_title', 'meta_slug', 'meta_description'] as $metaField) {
            if (array_key_exists($metaField, $validated)) {
                $payload[$metaField] = $validated[$metaField] ?: null;
            }
        }

        if (array_key_exists('name', $validated) || array_key_exists('name_en', $validated)) {
            $nameTranslations = $product->getTranslations('name');

            if (array_key_exists('name', $validated) && $validated['name'] !== null) {
                $nameTranslations['vi'] = $validated['name'];
            }

            if (array_key_exists('name_en', $validated)) {
                if (! empty($validated['name_en'])) {
                    $nameTranslations['en'] = $validated['name_en'];
                } else {
                    unset($nameTranslations['en']);
                }
            }

            $payload['name'] = $nameTranslations;
        }

        if (array_key_exists('description', $validated) || array_key_exists('description_en', $validated)) {
            $descriptionTranslations = $product->getTranslations('description');

            if (array_key_exists('description', $validated) && $validated['description'] !== null) {
                $descriptionTranslations['vi'] = $validated['description'];
            }

            if (array_key_exists('description_en', $validated)) {
                if (! empty($validated['description_en'])) {
                    $descriptionTranslations['en'] = $validated['description_en'];
                } else {
                    unset($descriptionTranslations['en']);
                }
            }

            $payload['description'] = $descriptionTranslations;
        }

        return $payload;
    }

    /**
     * Create multiple variants for a product.
     *
     * @param  array<int, array<string, mixed>>  $variantsData
     */
    private function createVariants(Product $product, array $variantsData): void
    {
        foreach ($variantsData as $variantData) {
            $stock = (int) Arr::get($variantData, 'stock_quantity', 0);

            $variant = $product->variants()->create([
                'variant_name' => Arr::get($variantData, 'variant_name'),
                'sku' => Arr::get($variantData, 'sku') ?: $this->generateSkuService->generateSku(),
                'price' => Arr::get($variantData, 'price', 0),
                'stock_quantity' => 0,
                'option_values' => Arr::get($variantData, 'option_values'),
                'option_signature' => Arr::get($variantData, 'option_signature'),
                'is_primary' => Arr::get($variantData, 'is_primary', false),
            ]);

            if ($stock > 0) {
                $this->inventoryService->setStock(
                    $variant->variant_id,
                    $stock,
                    'Initial stock on product creation',
                    Auth::id(),
                );
            }
        }
    }

    /**
     * Update variants for a product, handling additions, updates, and deletions.
     *
     * @param  array<int, array<string, mixed>>  $variantsData
     */
    private function updateVariants(Product $product, array $variantsData): void
    {
        $existingVariants = $product->variants()->get()->keyBy('variant_id');
        $incomingVariantIds = collect($variantsData)
            ->pluck('variant_id')
            ->filter()
            ->map(fn ($id) => (int) $id);

        // Release and remove variants first so their unique SKU / option
        // signature can be reused by the variants created below.
        $variantsToDelete = $existingVariants->reject(
            fn (ProductVariant $variant) => $incomingVariantIds->contains($variant->variant_id)
        );

        foreach ($variantsToDelete as $variant) {
            $this->variantSkuService->releaseUniqueValues($variant);
            $variant->delete();
        }

        $updatedVariantIds = [];

        foreach ($variantsData as $variantData) {
            $variantId = Arr::get($variantData, 'variant_id');
            $stock = Arr::get($variantData, 'stock_quantity');

            if ($variantId && $existingVariants->has($variantId) && ! $variantsToDelete->has($variantId)) {
                /** @var ProductVariant $variant */
                $variant = $existingVariants->get($variantId);
                $payload = [
                    'sku' => Arr::get($variantData, 'sku') ?: $variant->sku,
                    'option_values' => Arr::get($variantData, 'option_values'),
                    'option_signature' => Arr::get($variantData, 'option_signature'),
                    'is_primary' => Arr::get($variantData, 'is_primary', false),
                ];

                if (array_key_exists('variant_name', $variantData)) {
                    $payload['variant_name'] = Arr::get($variantData, 'variant_name');
                }

                if (Arr::get($variantData, 'price') !== null) {
                    $payload['price'] = Arr::get($variantData, 'price');
                }

                $variant->update($payload);

                if ($stock !== null && (int) $stock !== (int) $variant->stock_quantity) {
                    $this->inventoryService->setStock(
                        $variant->variant_id,
                        (int) $stock,
                        'Seller product update',
                        Auth::id(),
                    );
                }

                $updatedVariantIds[] = $variant->variant_id;

                continue;
            }

            $variant = $product->variants()->create([
                'variant_name' => Arr::get($variantData, 'variant_name'),
                'sku' => Arr::get($variantData, 'sku') ?: $this->generateSkuService->generateSku(),
                'price' => Arr::get($variantData, 'price', 0),
                'stock_quantity' => 0,
                'option_values' => Arr::get($variantData, 'option_values'),
                'option_signature' => Arr::get($variantData, 'option_signature'),
                'is_primary' => Arr::get($variantData, 'is_primary', false),
            ]);

            if ($stock !== null && (int) $stock > 0) {
                $this->inventoryService->setStock(
                    $variant->variant_id,
                    (int) $stock,
                    'Initial stock on product update',
                    Auth::id(),
                );
            }

            $updatedVariantIds[] = $variant->variant_id;
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
