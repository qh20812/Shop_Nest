<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Order;
use App\Models\Product;

class ReportController extends Controller
{
    // Báo cáo doanh thu
    public function revenue(Request $request)
    {
        $sellerId = Auth::id();
        $period = $request->input('period', 'month'); // 'day', 'week', 'month'
        $query = Order::where('seller_id', $sellerId)->where('status', 3);

        // Lấy doanh thu theo khoảng thời gian
        switch ($period) {
            case 'day':
                $revenues = $query->selectRaw('DATE(created_at) as label, SUM(total_price) as total')
                    ->groupBy('label')
                    ->orderBy('label', 'desc')
                    ->take(30)
                    ->get();
                break;
            case 'week':
                $revenues = $query->selectRaw('YEARWEEK(created_at, 1) as label, SUM(total_price) as total')
                    ->groupBy('label')
                    ->orderBy('label', 'desc')
                    ->take(12)
                    ->get();
                break;
            default: // month
                $revenues = $query->selectRaw('DATE_FORMAT(created_at, "%Y-%m") as label, SUM(total_price) as total')
                    ->groupBy('label')
                    ->orderBy('label', 'desc')
                    ->take(12)
                    ->get();
                break;
        }

        return Inertia::render('Seller/Reports/Revenue', [
            'revenues' => $revenues,
            'period' => $period,
        ]);
    }

    // Báo cáo sản phẩm
    public function products()
    {
        $sellerId = Auth::id();

        // Sản phẩm bán chạy nhất
        $topProducts = Product::where('seller_id', $sellerId)
            ->withCount(['orderItems as sold' => function ($q) {
                $q->whereHas('order', function ($orderQ) {
                    $orderQ->where('status', 3);
                });
            }])
            ->orderByDesc('sold')
            ->take(10)
            ->get();

        // Sản phẩm còn ít hàng trong kho
        $lowStockProducts = Product::where('seller_id', $sellerId)
            ->where('stock', '<', 10)
            ->orderBy('stock')
            ->take(10)
            ->get();

        return Inertia::render('Seller/Reports/Products', [
            'topProducts' => $topProducts,
            'lowStockProducts' => $lowStockProducts,
        ]);
    }
}
