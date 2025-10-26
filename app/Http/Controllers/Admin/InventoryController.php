<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Exceptions\InventoryException;
use App\Models\Brand;
use App\Models\Category;
use App\Models\InventoryLog;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use App\Services\InventoryService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class InventoryController extends Controller
{
    public function __construct(private readonly InventoryService $inventoryService)
    {
    }

    /**
     * Hiển thị danh sách tồn kho sản phẩm (theo biến thể).
     * Cho phép lọc theo từ khóa, người bán, danh mục, thương hiệu, và trạng thái tồn kho.
     *
     * @param Request $request
     * @return Response
     */
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', ProductVariant::class);

        $filters = $request->only(['search', 'seller_id', 'category_id', 'brand_id', 'stock_status']);

        $variants = ProductVariant::query()
            ->with(['product.seller', 'product.category', 'product.brand'])
            ->select('product_variants.*')
            ->join('products', 'product_variants.product_id', '=', 'products.product_id')
            ->search($filters['search'] ?? null)
            ->forSeller(isset($filters['seller_id']) ? (int) $filters['seller_id'] : null)
            ->forCategory(isset($filters['category_id']) ? (int) $filters['category_id'] : null)
            ->forBrand(isset($filters['brand_id']) ? (int) $filters['brand_id'] : null)
            ->when($filters['stock_status'] ?? null, function ($query, $status) {
                return match ($status) {
                    'in_stock' => $query->where('product_variants.stock_quantity', '>', InventoryService::IN_STOCK_THRESHOLD),
                    'low_stock' => $query->whereBetween('product_variants.stock_quantity', [1, InventoryService::LOW_STOCK_THRESHOLD]),
                    'out_of_stock' => $query->where('product_variants.stock_quantity', '=', 0),
                    default => $query,
                };
            })
            ->orderBy('products.product_id')
            ->orderBy('product_variants.variant_id')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Inventory/Index', [
            'variants' => $variants,
            'filters' => $filters,
            'sellers' => User::whereHas('roles', fn ($q) => $q->where('name->en', 'Seller'))->get(['id', 'name']),
            'categories' => Category::all(['category_id', 'name']),
            'brands' => Brand::all(['brand_id', 'name']),
            'stockStatuses' => [
                ['value' => 'in_stock', 'label' => __('In Stock')],
                ['value' => 'low_stock', 'label' => __('Low Stock')],
                ['value' => 'out_of_stock', 'label' => __('Out of Stock')],
            ]
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
     *
     * @param int $productId
     * @return Response
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

    /**
     * Tạo và hiển thị các báo cáo tồn kho.
     *
     * @param Request $request
     * @return Response
     */
    public function report(Request $request): Response
    {
        $this->authorize('viewReports', ProductVariant::class);

        $reportData = $this->buildReportData();

        return Inertia::render('Admin/Inventory/Report', $reportData);
    }

    /**
     * Tạo phiếu nhập kho (tăng số lượng).
     *
     * @param Request $request
     * @return RedirectResponse
     */
    public function store(Request $request): RedirectResponse
    {
        $this->authorize('manageInventory', ProductVariant::class);

        $validated = $request->validate([
            'variant_id' => 'required|exists:product_variants,variant_id',
            'quantity' => 'required|integer|min:1',
            'reason' => 'required|string|max:255',
        ]);

        try {
            $this->inventoryService->adjustStock(
                (int) $validated['variant_id'],
                (int) $validated['quantity'],
                __('Stock In: :reason', ['reason' => $validated['reason']])
            );
        } catch (InventoryException|ModelNotFoundException $exception) {
            return back()->withErrors(['general' => $exception->getMessage()]);
        }

        return back()->with('success', __('Inventory increased successfully.'));
    }

    /**
     * Tạo phiếu xuất kho (giảm số lượng).
     *
     * @param Request $request
     * @return RedirectResponse
     */
    public function stockOut(Request $request): RedirectResponse
    {
        $this->authorize('manageInventory', ProductVariant::class);

        $validated = $request->validate([
            'variant_id' => 'required|exists:product_variants,variant_id',
            'quantity' => 'required|integer|min:1',
            'reason' => 'required|string|max:255',
        ]);

        try {
            $this->inventoryService->adjustStock(
                (int) $validated['variant_id'],
                -abs((int) $validated['quantity']),
                __('Stock Out: :reason', ['reason' => $validated['reason']])
            );
        } catch (InventoryException $exception) {
            return back()->withErrors(['general' => $exception->getMessage()]);
        }

        return back()->with('success', __('Inventory decreased successfully.'));
    }

    /**
     * Điều chỉnh tồn kho thủ công (set về một số lượng cụ thể).
     *
     * @param Request $request
     * @param int $variantId
     * @return RedirectResponse
     */
    public function update(Request $request, int $variantId): RedirectResponse
    {
        $this->authorize('manageInventory', ProductVariant::class);

        $validated = $request->validate([
            'new_quantity' => 'required|integer|min:0',
            'reason' => 'required|string|max:255',
        ]);

        try {
            $this->inventoryService->setStock(
                $variantId,
                (int) $validated['new_quantity'],
                __('Adjustment: :reason', ['reason' => $validated['reason']])
            );
        } catch (InventoryException $exception) {
            return back()->withErrors(['general' => $exception->getMessage()]);
        }

        return back()->with('success', __('Inventory adjusted successfully.'));
    }

    /**
     * Bulk adjust inventory levels for multiple variants.
     */
    public function bulkUpdate(Request $request): RedirectResponse
    {
        $this->authorize('manageInventory', ProductVariant::class);

        $validated = $request->validate([
            'reason' => 'required|string|max:255',
            'adjustments' => 'required|array|min:1',
            'adjustments.*.variant_id' => 'required|distinct|exists:product_variants,variant_id',
            'adjustments.*.quantity_change' => 'required|integer',
        ]);

        try {
            $this->inventoryService->bulkAdjust($validated['adjustments'], $validated['reason']);
        } catch (InventoryException|ModelNotFoundException $exception) {
            return back()->withErrors(['general' => $exception->getMessage()]);
        }

        return back()->with('success', __('Bulk inventory update completed.'));
    }

    public function export(Request $request): StreamedResponse
    {
        $this->authorize('viewReports', ProductVariant::class);

        $reportData = $this->buildReportData();

        $fileName = 'inventory-report-' . now()->format('Ymd_His') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $fileName . '"',
        ];

        $callback = function () use ($reportData) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['Section', 'Identifier', 'Label', 'Value']);

            foreach ($reportData['statsBySeller'] as $row) {
                fputcsv($handle, ['Seller', $row->seller_id ?? '', $row->seller_name, $row->total_stock]);
            }

            foreach ($reportData['statsByCategory'] as $row) {
                fputcsv($handle, ['Category', $row->category_id ?? '', $row->category_name, $row->total_stock]);
            }

            foreach ($reportData['forecast'] as $row) {
                fputcsv($handle, ['Forecast', $row->variant_id, $row->sku ?? '', $row->avg_daily_demand]);
            }

            fclose($handle);
        };

        return response()->streamDownload($callback, $fileName, $headers);
    }

    /**
     * Build report data arrays with caching.
     *
     * @return array<string, mixed>
     */
    private function buildReportData(): array
    {
        $statsBySeller = Cache::remember(
            'inventory_report_stats_by_seller',
            now()->addHour(),
            fn () => ProductVariant::select(
                'users.id as seller_id',
                DB::raw("CONCAT(users.first_name, ' ', users.last_name) as seller_name"),
                DB::raw('SUM(product_variants.stock_quantity) as total_stock')
            )
                ->join('products', 'product_variants.product_id', '=', 'products.product_id')
                ->join('users', 'products.seller_id', '=', 'users.id')
                ->groupBy('users.id', 'users.first_name', 'users.last_name')
                ->orderByDesc('total_stock')
                ->get()
        );

        $statsByCategory = Cache::remember(
            'inventory_report_stats_by_category',
            now()->addHour(),
            fn () => ProductVariant::select(
                'categories.category_id',
                'categories.name',
                DB::raw('SUM(product_variants.stock_quantity) as total_stock')
            )
                ->join('products', 'product_variants.product_id', '=', 'products.product_id')
                ->join('categories', 'products.category_id', '=', 'categories.category_id')
                ->groupBy('categories.category_id', 'categories.name')
                ->orderByDesc('total_stock')
                ->get()
                ->map(function ($row) {
                    $translations = is_array($row->name)
                        ? $row->name
                        : json_decode($row->name, true) ?? [];

                    $locale = app()->getLocale();
                    $row->category_name = $translations[$locale] ?? reset($translations) ?: __('Unknown category');

                    return $row;
                })
        );

        $lowStockVariants = Cache::remember(
            'inventory_report_low_stock',
            now()->addHour(),
            fn () => ProductVariant::with('product.seller')
                ->lowStock()
                ->orderBy('stock_quantity')
                ->get()
        );

        $outOfStockVariants = Cache::remember(
            'inventory_report_out_of_stock',
            now()->addHour(),
            fn () => ProductVariant::with('product.seller')
                ->outOfStock()
                ->get()
        );

        $ninetyDaysAgo = now()->subDays(90);
        $agingVariants = Cache::remember(
            'inventory_report_aging',
            now()->addHour(),
            fn () => ProductVariant::with('product.seller')
                ->where('stock_quantity', '>', 0)
                ->whereDoesntHave('inventoryLogs', fn ($query) => $query->where('created_at', '>', $ninetyDaysAgo))
                ->get()
        );

        $thirtyDaysAgo = now()->subDays(30);
        $forecast = Cache::remember(
            'inventory_report_forecast',
            now()->addHour(),
            function () use ($thirtyDaysAgo) {
                return OrderItem::select(
                    'order_items.variant_id',
                    DB::raw('SUM(order_items.quantity) as total_quantity'),
                    DB::raw('COUNT(DISTINCT DATE(orders.created_at)) as active_days')
                )
                    ->join('orders', 'order_items.order_id', '=', 'orders.order_id')
                    ->where('orders.created_at', '>=', $thirtyDaysAgo)
                    ->groupBy('order_items.variant_id')
                    ->get()
                    ->map(function ($row) {
                        $variant = ProductVariant::find($row->variant_id);
                        $days = max(1, (int) $row->active_days ?: 30);

                        $row->avg_daily_demand = round($row->total_quantity / $days, 2);
                        $row->sku = $variant?->sku;

                        return $row;
                    });
            }
        );

        return [
            'statsBySeller' => $statsBySeller,
            'statsByCategory' => $statsByCategory,
            'lowStockVariants' => $lowStockVariants,
            'outOfStockVariants' => $outOfStockVariants,
            'agingVariants' => $agingVariants,
            'forecast' => $forecast,
        ];
    }
}
