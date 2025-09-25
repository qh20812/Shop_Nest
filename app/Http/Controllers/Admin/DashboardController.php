<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\User;
use App\Models\Product;
use Illuminate\Http\Request;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $stats = $this->getStatsCardsData();
        $recentOrders = $this->getRecentOrders();
        $newUsers = $this->getNewUsers();
        $salesChart = $this->getSalesChartData();

        return view('admin.dashboard', compact('stats', 'recentOrders', 'newUsers', 'salesChart'));
    }

    private function getStatsCardsData()
    {
        return [
            'total_revenue' => Order::where('status', 'completed')->sum('total_price'),
            'total_orders' => Order::count(),
            'new_users' => User::whereDate('created_at', '>=', now()->subWeek())->count(),
            'new_products' => Product::whereDate('created_at', '>=', now()->subWeek())->count(),
        ];
    }

    private function getRecentOrders()
    {
        return Order::latest()->take(10)->get();
    }

    private function getNewUsers()
    {
        return User::latest()->take(10)->get();
    }

    private function getSalesChartData()
    {
        // Ví dụ: doanh thu theo ngày trong 7 ngày gần nhất
        return Order::where('status', 'completed')
            ->whereDate('created_at', '>=', now()->subDays(7))
            ->selectRaw('DATE(created_at) as date, SUM(total_price) as revenue')
            ->groupBy('date')
            ->orderBy('date')
            ->get();
    }
}