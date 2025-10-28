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
use Inertia\Inertia;
use Inertia\Response;

class InventoryController extends Controller
{
    use InventoryCrudTrait;
    use InventoryReportingTrait;
    use InventoryQueryTrait;

    private const PAGINATION_PER_PAGE = 20;

    public function __construct(
        private readonly InventoryService $inventoryService,
        private readonly InventoryReportService $reportService
    ) {
    }

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
     *
     * @param int $productId
     * @return Response
     */
    public function show(int $productId): Response
    {
        $this->authorize('viewAny', ProductVariant::class);

        $product = Product::with([
            'seller',
            'category',
            'brand',
            'variants.inventoryLogs' => function ($query) {
                $query->with('user')->latest()->take(20); // Lấy 20 log gần nhất cho mỗi variant
            },
            'variants.orderItems.order'
        ])->findOrFail($productId);

        return Inertia::render('Admin/Inventory/Show', [
            'product' => $product,
        ]);
    }

    /**
     * Hiển thị lịch sử thay đổi tồn kho cho một sản phẩm.
     */
    public function history(int $productId): Response
    {
        $this->authorize('viewAny', ProductVariant::class);

        $product = Product::with('variants')->findOrFail($productId);
        $variantIds = $product->variants->pluck('variant_id');

        $history = InventoryLog::whereIn('variant_id', $variantIds)
            ->with('user', 'variant.product') // Eager load người thực hiện và thông tin biến thể
            ->latest()
            ->paginate(50);

        return Inertia::render('Admin/Inventory/History', [
            'product' => $product,
            'history' => $history,
        ]);
    }
}
