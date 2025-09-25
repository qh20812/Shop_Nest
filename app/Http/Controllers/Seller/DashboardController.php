<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SellerDashboardController extends Controller
{
    public function index()
    {
        $shopStats = $this->getShopStats();
        $recentOrders = $this->getRecentShopOrders();
        $topProducts = $this->getTopSellingProducts();
        $stockAlerts = $this->getStockAlerts();

        return view('seller.dashboard', compact('shopStats', 'recentOrders', 'topProducts', 'stockAlerts'));
    }

    private function getShopStats()
    {
        $sellerId = Auth::id();

        $products = Product::where('seller_id', $sellerId);
        $orders = Order::where('seller_id', $sellerId)->where('status', 'completed');

        return [
            'revenue' => $orders->sum('total_price'),
            'total_orders' => $orders->count(),
            'products_count' => $products->count(),
            'avg_rating' => $products->avg('rating'),
        ];
    }

    private function getRecentShopOrders()
    {
        $sellerId = Auth::id();
        return Order::where('seller_id', $sellerId)->latest()->take(10)->get();
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