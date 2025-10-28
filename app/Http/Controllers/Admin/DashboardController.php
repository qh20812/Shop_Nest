<?php

namespace App\Http\Controllers\Admin;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $admin = Auth::user();
        $cacheKey = $admin ? "admin_dashboard_{$admin->id}" : 'admin_dashboard_guest';

        $dashboardData = Cache::remember($cacheKey, 900, function () {
            return [
                'stats' => $this->getStatsCardsData(),
                'recentOrders' => $this->getRecentOrders(),
                'newUsers' => $this->getNewUsers(),
                'revenueChart' => $this->getRevenueChartData(),
                'userGrowthChart' => $this->getUserGrowthChartData(),
            ];
        });

        return Inertia::render('Admin/Dashboard/Index', $dashboardData);
    }

    private function getStatsCardsData(): array
    {
        $defaults = [
            'total_revenue' => 0.0,
            'pending_orders' => 0,
            'user_growth_monthly' => 0.0,
            'system_health' => 0.0,
        ];

        try {
            $totalRevenueRaw = Order::query()
                ->where('status', OrderStatus::COMPLETED->value)
                ->sum('total_amount_base');

            $totalRevenue = round((float) $totalRevenueRaw, 2) + 0.0;

            $pendingStatuses = [
                OrderStatus::PENDING_CONFIRMATION->value,
                OrderStatus::PROCESSING->value,
                OrderStatus::PENDING_ASSIGNMENT->value,
                OrderStatus::ASSIGNED_TO_SHIPPER->value,
                OrderStatus::DELIVERING->value,
            ];

            $pendingOrders = Order::query()
                ->whereIn('status', $pendingStatuses)
                ->count();

            $totalOrders = Order::query()->count();
            $completedOrders = Order::query()
                ->where('status', OrderStatus::COMPLETED->value)
                ->count();

            $systemHealth = $totalOrders > 0
                ? round(($completedOrders / $totalOrders) * 100, 2)
                : 0.0;

            $now = Carbon::now();
            $currentStart = (clone $now)->startOfMonth();
            $previousStart = (clone $currentStart)->subMonth();
            $previousEnd = (clone $previousStart)->endOfMonth();

            $currentMonthUsers = User::query()
                ->whereBetween('created_at', [$currentStart, $now])
                ->count();

            $previousMonthUsers = User::query()
                ->whereBetween('created_at', [$previousStart, $previousEnd])
                ->count();

            if ($previousMonthUsers === 0) {
                $userGrowth = $currentMonthUsers > 0 ? 100.0 : 0.0;
            } else {
                $userGrowth = round((($currentMonthUsers - $previousMonthUsers) / $previousMonthUsers) * 100, 2);
            }

            return [
                'total_revenue' => $totalRevenue,
                'pending_orders' => $pendingOrders,
                'user_growth_monthly' => $userGrowth,
                'system_health' => $systemHealth,
            ];
        } catch (\Throwable $throwable) {
            Log::error('Failed to fetch admin dashboard stats', [
                'error' => $throwable->getMessage(),
            ]);

            return $defaults;
        }
    }

    private function getRecentOrders(): Collection
    {
        try {
            return Order::query()
                ->select([
                    'order_id',
                    'order_number',
                    'customer_id',
                    'status',
                    'total_amount',
                    'total_amount_base',
                    'created_at',
                ])
                ->with([
                    'customer:id,username,first_name,last_name,email,avatar,avatar_url',
                ])
                ->orderByDesc('created_at')
                ->limit(5)
                ->get();
        } catch (\Throwable $throwable) {
            Log::error('Failed to fetch admin recent orders', [
                'error' => $throwable->getMessage(),
            ]);

            return collect();
        }
    }

    private function getNewUsers(): Collection
    {
        try {
            return User::query()
                ->select(['id', 'username', 'created_at'])
                ->latest('created_at')
                ->limit(5)
                ->get();
        } catch (\Throwable $throwable) {
            Log::error('Failed to fetch admin new users', [
                'error' => $throwable->getMessage(),
            ]);

            return collect();
        }
    }

    private function getRevenueChartData(): array
    {
        try {
            $endDate = Carbon::now()->endOfDay();
            $startDate = (clone $endDate)->subDays(6)->startOfDay();

            $rawResults = Order::query()
                ->where('status', OrderStatus::COMPLETED->value)
                ->whereBetween('created_at', [$startDate, $endDate])
                ->selectRaw('DATE(created_at) as chart_date, SUM(total_amount_base) as revenue')
                ->groupBy('chart_date')
                ->orderBy('chart_date')
                ->pluck('revenue', 'chart_date');

            $period = CarbonPeriod::create($startDate, '1 day', $endDate);

            return collect($period)->map(function (Carbon $date) use ($rawResults) {
                $key = $date->toDateString();

                return [
                    'date' => $key,
                    'label' => $date->format('d/m'),
                    'revenue' => (float) ($rawResults[$key] ?? 0),
                ];
            })->all();
        } catch (\Throwable $throwable) {
            Log::warning('Failed to build revenue chart data', [
                'error' => $throwable->getMessage(),
            ]);

            return [];
        }
    }

    private function getUserGrowthChartData(): array
    {
        try {
            $currentWeekEnd = Carbon::now()->endOfWeek();
            $currentWeekStart = (clone $currentWeekEnd)->startOfWeek();
            $startOfPeriod = (clone $currentWeekStart)->subWeeks(3);

            $rawResults = User::query()
                ->whereBetween('created_at', [$startOfPeriod, $currentWeekEnd])
                ->get(['id', 'created_at'])
                ->groupBy(function (User $user) {
                    return Carbon::parse($user->created_at)->startOfWeek()->format('oW');
                })
                ->map(fn ($users) => $users->count());

            $weeks = [];
            for ($i = 3; $i >= 0; $i--) {
                $weekStart = (clone $currentWeekStart)->subWeeks($i);
                $weekEnd = (clone $weekStart)->endOfWeek();
                $key = $weekStart->format('oW');

                $weeks[] = [
                    'week' => $key,
                    'label' => $weekStart->format('d/m') . ' - ' . $weekEnd->format('d/m'),
                    'users' => (int) ($rawResults->get($key, 0)),
                ];
            }

            return $weeks;
        } catch (\Throwable $throwable) {
            Log::warning('Failed to build user growth chart data', [
                'error' => $throwable->getMessage(),
            ]);

            return [];
        }
    }
}