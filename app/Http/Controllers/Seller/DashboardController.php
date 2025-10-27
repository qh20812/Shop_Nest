<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia; // <-- Thêm vào
use Inertia\Response; // <-- Thêm vào

class DashboardController extends Controller
{
    public function index(): Response // <-- Sửa kiểu trả về
    {
        $seller = Auth::user();

        $shopStats = $this->getShopStats($seller->id);
        $recentOrders = $this->getRecentShopOrders($seller->id);
        $topSellingProducts = $this->getTopSellingProducts();
        $stockAlerts = $this->getStockAlerts();

        // Giả sử bạn có một trang dashboard cho Seller
        return Inertia::render('Seller/Dashboard/Index', [
            'shopStats' => $shopStats,
            'recentOrders' => $recentOrders,
            'topSellingProducts' => $topSellingProducts,
            'stockAlerts' => $stockAlerts,
        ]);
    }

    private function getShopStats(int $sellerId): array
    {
        // Lấy các sản phẩm của người bán
        $productIds = Product::where('seller_id', $sellerId)->pluck('product_id');
        
        // Lấy các biến thể của các sản phẩm đó
        $variantIds = \App\Models\ProductVariant::whereIn('product_id', $productIds)->pluck('variant_id');

        // Lấy các order item liên quan
        $orderItems = \App\Models\OrderItem::whereIn('variant_id', $variantIds);
        
        $revenue = $orderItems->sum('total_price');
        $totalOrders = $orderItems->distinct('order_id')->count();

        return [
            'revenue' => $revenue,
            'total_orders' => $totalOrders,
            'products_count' => count($productIds),
            // 'avg_rating' => Product::where('seller_id', $sellerId)->avg('rating'), // Cần có cột rating
        ];
    }

    private function getRecentShopOrders(int $sellerId)
    {
        // Lấy các đơn hàng chứa sản phẩm của người bán
        return Order::whereHas('items.variant.product', fn($query) => $query->where('seller_id', $sellerId))
            ->with('customer')
            ->latest()
            ->take(10)
            ->get();
    }

    private function getTopSellingProducts()
    {
        $sellerId = Auth::id();
        return Product::where('seller_id', $sellerId)
            ->orderByDesc('sold_count')
            ->take(5)
            ->get();
    }

    private function getStockAlerts()
    {
        $sellerId = Auth::id();
        return Product::where('seller_id', $sellerId)
            ->where('stock', '<', 10)
            ->get();
    }
}