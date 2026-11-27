<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\InventoryCrudTrait;
use App\Http\Controllers\Admin\Concerns\InventoryQueryTrait;
use App\Http\Controllers\Admin\Concerns\InventoryReportingTrait;
use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\InventoryLog;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use App\Services\InventoryReportService;
use App\Services\InventoryService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class InventoryController extends Controller
{
    use InventoryCrudTrait;
    use InventoryQueryTrait;
    use InventoryReportingTrait;

    private const PAGINATION_PER_PAGE = 20;

    public function __construct(
        private readonly InventoryService $inventoryService,
        private readonly InventoryReportService $reportService
    ) {}

    /**
     * Hiển thị danh sách tồn kho sản phẩm (theo biến thể).
     * Cho phép lọc theo từ khóa, người bán, danh mục, thương hiệu, và trạng thái tồn kho.
     */
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', ProductVariant::class);

        $filters = $request->only(['search', 'seller_id', 'category_id', 'brand_id', 'stock_status']);

        $variants = $this->getVariantInventoryListing($filters);

        return Inertia::render('Admin/Inventory/Index', [
            'variants' => $variants,
            'filters' => $filters,
            'sellers' => User::whereHas('roles', fn ($query) => $query->where('name->en', 'Seller'))->get(['id', 'first_name', 'last_name', 'username']),
            'categories' => Category::all(['category_id', 'name']),
            'brands' => Brand::all(['brand_id', 'name']),
            'stockStatuses' => [
                ['value' => 'in_stock', 'label' => __('In Stock')],
                ['value' => 'low_stock', 'label' => __('Low Stock')],
                ['value' => 'out_of_stock', 'label' => __('Out of Stock')],
            ],
        ]);
    }

    /**
     * Xem chi tiết tồn kho của một sản phẩm, bao gồm tất cả các biến thể của nó.
     */
    public function show(int $productId): Response
    {
        $this->authorize('viewAny', ProductVariant::class);

        $product = Product::with([
            'seller',
            'category',
            'brand',
            'variants.attributeValues.attribute',
            'variants.inventoryLogs' => function ($query) {
                $query->with('user')->latest()->take(20); // Lấy 20 log gần nhất cho mỗi variant
            },
            'variants.orderItems.order',
        ])->findOrFail($productId);

        return Inertia::render('Admin/Inventory/Show', [
            'product' => $product,
        ]);
    }

    /**
     * Hiển thị lịch sử thay đổi tồn kho cho một sản phẩm.
     */
    public function history(Request $request, int $productId): Response
    {
        $this->authorize('viewAny', ProductVariant::class);

        $product = Product::with([
            'seller',
            'category',
            'brand',
            'variants' => fn ($query) => $query->with(['attributeValues.attribute'])->orderBy('variant_id'),
        ])->findOrFail($productId);

        $variantIds = $product->variants->pluck('variant_id');

        $validated = $request->validate([
            'variant' => ['nullable', 'integer'],
            'type' => ['nullable', Rule::in(['in', 'out'])],
        ]);

        $filters = array_filter(
            [
                'variant' => $validated['variant'] ?? null,
                'type' => $validated['type'] ?? null,
            ],
            fn ($value) => $value !== null && $value !== '',
        );

        if (isset($filters['variant'])) {
            abort_unless($variantIds->contains((int) $filters['variant']), 404);
        }

        $query = InventoryLog::query()
            ->whereIn('variant_id', $variantIds)
            ->with(['user', 'variant.attributeValues.attribute']);

        if (isset($filters['variant'])) {
            $query->where('variant_id', (int) $filters['variant']);
        }

        if (($filters['type'] ?? null) === 'in') {
            $query->where('quantity_change', '>', 0);
        } elseif (($filters['type'] ?? null) === 'out') {
            $query->where('quantity_change', '<', 0);
        }

        $summary = [
            'total' => (clone $query)->count(),
            'in' => (clone $query)->where('quantity_change', '>', 0)->count(),
            'out' => (clone $query)->where('quantity_change', '<', 0)->count(),
            'last' => (clone $query)->max('created_at'),
        ];

        $history = $query->latest()->paginate(50)->withQueryString();

        return Inertia::render('Admin/Inventory/History', [
            'product' => $product,
            'history' => $history,
            'filters' => $filters,
            'summary' => $summary,
        ]);
    }
}
