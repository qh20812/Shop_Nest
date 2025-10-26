<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $stats = $this->getStatsCardsData();
        $recentOrders = $this->getRecentOrders();
        $newUsers = $this->getNewUsers();
        // $salesChart = $this->getSalesChartData();

        // Sửa lại để trả về Inertia Response
        return Inertia::render('Admin/Dashboard/Index', [
            'stats' => $stats,
            'recentOrders' => $recentOrders,
            'newUsers' => $newUsers,
            // 'salesChart' => $salesChart,
        ]);
    }

    private function getStatsCardsData(): array
    {
        try {
            return [
                // Sums the base currency amount for an accurate total across all currencies
                'total_revenue' => Order::where('status', \App\Enums\OrderStatus::COMPLETED)->sum('total_amount_base') ?? 0,
                'total_orders' => Order::count(),
                'new_users' => User::whereDate('created_at', '>=', now()->subWeek())->count(),
                'total_products' => Product::count(),
            ];
        } catch (\Exception $e) {
            // Return default values if database error occurs
            return [
                'total_revenue' => 0,
                'total_orders' => 0,
                'new_users' => 0,
                'total_products' => 0,
            ];
        }
    }

    private function getRecentOrders()
    {
        try {
            return Order::with('customer')->latest()->take(5)->get();
        } catch (\Exception $e) {
            return collect([]); // Return empty collection
        }
    }

    private function getNewUsers()
    {
        try {
            return User::latest()->take(5)->get(['id', 'username', 'created_at']);
        } catch (\Exception $e) {
            return collect([]); // Return empty collection
        }
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