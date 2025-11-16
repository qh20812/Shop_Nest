<?php

namespace App\Services\ContextGatherers;

use App\Enums\OrderStatus;
use App\Models\AnalyticsReport;
use App\Models\InventoryLog;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\DB;

class AdminContextGatherer implements ContextGathererInterface
{
    public function gather(?User $user = null): array
    {
        $locale = App::getLocale();
        $pendingStatuses = [
            OrderStatus::PENDING_CONFIRMATION,
            OrderStatus::PROCESSING,
            OrderStatus::PENDING_ASSIGNMENT,
            OrderStatus::ASSIGNED_TO_SHIPPER,
            OrderStatus::DELIVERING,
        ];

        $now = Carbon::now();
        $ordersLast30Query = Order::query()
            ->where('created_at', '>=', $now->copy()->subDays(30));

        $lowStockVariants = ProductVariant::query()
            ->lowStock()
            ->with(['product.category'])
            ->orderBy('stock_quantity')
            ->take(5)
            ->get();

        $topCategories = Product::query()
            ->select('category_id', DB::raw('COUNT(*) as total_products'))
            ->whereNotNull('category_id')
            ->groupBy('category_id')
            ->orderByDesc('total_products')
            ->with('category')
            ->take(5)
            ->get();

        $recentReports = AnalyticsReport::query()
            ->latest('created_at')
            ->take(5)
            ->get(['title', 'type', 'status', 'created_at']);

        return [
            'summary' => [
                'total_orders' => Order::count(),
                'orders_last_30_days' => (clone $ordersLast30Query)->count(),
                'revenue_last_30_days' => (float) (clone $ordersLast30Query)->sum('total_amount'),
                'pending_orders' => Order::whereIn('status', array_map(fn ($status) => $status->value, $pendingStatuses))->count(),
            ],
            'low_stock_alerts' => $lowStockVariants->map(function (ProductVariant $variant) use ($locale) {
                return [
                    'sku' => $variant->sku,
                    'stock' => (int) $variant->stock_quantity,
                    'product' => $variant->product?->getTranslation('name', $locale),
                    'category' => $variant->product?->category?->getTranslation('name', $locale),
                ];
            })->values()->all(),
            'top_categories' => $topCategories->map(function (Product $product) use ($locale) {
                return [
                    'category' => $product->category?->getTranslation('name', $locale),
                    'total_products' => (int) $product->total_products,
                ];
            })->values()->all(),
            'inventory_movements_7_days' => (function () {
                $row = InventoryLog::query()
                    ->where('created_at', '>=', Carbon::now()->subDays(7))
                    ->selectRaw('SUM(CASE WHEN quantity_change > 0 THEN quantity_change ELSE 0 END) as stock_in')
                    ->selectRaw('SUM(CASE WHEN quantity_change < 0 THEN ABS(quantity_change) ELSE 0 END) as stock_out')
                    ->first();

                return [
                    'stock_in' => (int) ($row->stock_in ?? 0),
                    'stock_out' => (int) ($row->stock_out ?? 0),
                ];
            })(),
            'recent_reports' => $recentReports->map(fn (AnalyticsReport $report) => [
                'title' => $report->title,
                'type' => $report->type,
                'status' => $report->status,
                'generated_on' => optional($report->created_at)->toDateString(),
            ])->values()->all(),
        ];
    }
}