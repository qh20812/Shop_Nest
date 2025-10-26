<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\InventoryLog;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class InventoryController extends Controller
{
    /**
     * Hiển thị danh sách tồn kho sản phẩm (theo biến thể).
     * Cho phép lọc theo từ khóa, người bán, danh mục, thương hiệu, và trạng thái tồn kho.
     *
     * @param Request $request
     * @return Response
     */
    public function index(Request $request): Response
    {
        // Giả định rằng việc quản lý tồn kho được thực hiện ở cấp độ ProductVariant.
        $filters = $request->only(['search', 'seller_id', 'category_id', 'brand_id', 'stock_status']);

        $variants = ProductVariant::with(['product.seller', 'product.category', 'product.brand'])
            ->select('product_variants.*') // Bắt đầu với bảng product_variants
            ->join('products', 'product_variants.product_id', '=', 'products.product_id') // Join để lọc
            ->when($request->input('search'), function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('products.name', 'like', "%{$search}%")
                        ->orWhere('product_variants.sku', 'like', "%{$search}%");
                });
            })
            ->when($request->input('seller_id'), function ($query, $sellerId) {
                $query->where('products.seller_id', $sellerId);
            })
            ->when($request->input('category_id'), function ($query, $categoryId) {
                $query->where('products.category_id', $categoryId);
            })
            ->when($request->input('brand_id'), function ($query, $brandId) {
                $query->where('products.brand_id', $brandId);
            })
            ->when($request->input('stock_status'), function ($query, $status) {
                if ($status === 'in_stock') {
                    $query->where('product_variants.stock_quantity', '>', 10);
                } elseif ($status === 'low_stock') {
                    $query->whereBetween('product_variants.stock_quantity', [1, 10]);
                } elseif ($status === 'out_of_stock') {
                    $query->where('product_variants.stock_quantity', '=', 0);
                }
            })
            ->orderBy('products.name')
            ->orderBy('product_variants.variant_id')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Inventory/Index', [
            'variants' => $variants,
            'filters' => $filters,
            'sellers' => User::whereHas('roles', function ($q) {
                $q->whereRaw("JSON_UNQUOTE(JSON_EXTRACT(roles.name, '$.en')) = 'Seller'");
            })
                ->get()
                ->map(fn($u) => [
                    'id' => $u->id,
                    'name' => $u->full_name,
                ]),
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
        // Báo cáo tồn kho theo người bán (Seller)
        $statsBySeller = ProductVariant::select(
            DB::raw("JSON_UNQUOTE(JSON_EXTRACT(users.name, '$.vi')) as seller_name"),
            DB::raw('SUM(product_variants.stock_quantity) as total_stock')
        )
            ->join('products', 'product_variants.product_id', '=', 'products.product_id')
            ->join('users', 'products.seller_id', '=', 'users.id')
            ->groupBy('seller_name')
            ->get();

        // Báo cáo theo danh mục
        $statsByCategory = ProductVariant::select(
            DB::raw("JSON_UNQUOTE(JSON_EXTRACT(categories.name, '$.vi')) as category_name"),
            DB::raw('SUM(product_variants.stock_quantity) as total_stock')
        )
            ->join('products', 'product_variants.product_id', '=', 'products.product_id')
            ->join('categories', 'products.category_id', '=', 'categories.category_id')
            ->groupBy('category_name')
            ->get();

        // Các biến thể sắp hết hàng
        $lowStockVariants = ProductVariant::with('product.seller')
            ->whereBetween('stock_quantity', [1, 10])
            ->orderBy('stock_quantity', 'asc')
            ->get();

        // Hết hàng
        $outOfStockVariants = ProductVariant::with('product.seller')
            ->where('stock_quantity', '=', 0)
            ->get();

        // Hàng tồn kho lâu ngày (90 ngày không thay đổi)
        $ninetyDaysAgo = now()->subDays(90);
        $agingVariants = ProductVariant::with('product.seller')
            ->where('stock_quantity', '>', 0)
            ->whereDoesntHave('inventoryLogs', function ($query) use ($ninetyDaysAgo) {
                $query->where('created_at', '>', $ninetyDaysAgo);
            })
            ->get();

        return Inertia::render('Admin/Inventory/Report', [
            'statsBySeller' => $statsBySeller,
            'statsByCategory' => $statsByCategory,
            'lowStockVariants' => $lowStockVariants,
            'outOfStockVariants' => $outOfStockVariants,
            'agingVariants' => $agingVariants,
        ]);
    }

    /**
     * Điều chỉnh tồn kho thủ công (set về một số lượng cụ thể).
     *
     * @param Request $request
     * @param int $variantId
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, int $variantId)
    {
        $validated = $request->validate([
            'new_quantity' => 'required|integer|min:0',
            'reason' => 'required|string|max:255',
        ]);

        // $this->authorize('manageInventory', ProductVariant::class);

        $variant = ProductVariant::findOrFail($variantId);
        $change = $validated['new_quantity'] - $variant->stock_quantity;

        if ($change === 0) {
            return back()->with('info', 'Số lượng tồn kho không thay đổi.');
        }

        return $this->addInventoryLog(
            $variantId,
            $change,
            "Adjustment: " . $validated['reason']
        );
    }

    /**
     * Helper method để cập nhật tồn kho và ghi log.
     *
     * @param int $variantId
     * @param int $quantityChange
     * @param string $reason
     * @return \Illuminate\Http\RedirectResponse
     */
    private function addInventoryLog(int $variantId, int $quantityChange, string $reason)
    {
        try {
            DB::transaction(function () use ($variantId, $quantityChange, $reason) {
                $variant = ProductVariant::lockForUpdate()->findOrFail($variantId);

                $newQuantity = $variant->stock_quantity + $quantityChange;

                if ($newQuantity < 0) {
                    throw new \Exception(__('Stock cannot be negative.'));
                }

                $variant->update(['stock_quantity' => $newQuantity]);

                // Giả định có model InventoryLog để ghi lại lịch sử
                InventoryLog::create([
                    'variant_id' => $variantId,
                    'user_id' => Auth::id(),
                    'quantity_change' => $quantityChange,
                    'reason' => $reason,
                ]);
            });
        } catch (\Exception $e) {
            return back()->withErrors(['general' => 'Đã xảy ra lỗi: ' . $e->getMessage()]);
        }

        return back()->with('success', 'Cập nhật tồn kho thành công.');
    }
}
