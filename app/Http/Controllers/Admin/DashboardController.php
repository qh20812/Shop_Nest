<?php

namespace App\Http\Controllers\Admin;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use App\Services\AnalyticsService;
use App\Services\ExchangeRateService;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(private readonly AnalyticsService $analyticsService)
    {
    }

    public function index(Request $request): Response
    {
        $admin = Auth::user();
        [$baseCurrency, $activeCurrency, $conversionRate] = $this->resolveCurrencyContext($request);
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

        $preparedStats = $dashboardData['stats'] ?? [];
        $preparedStats['total_revenue'] = $this->convertAmount((float) ($preparedStats['total_revenue'] ?? 0.0), $conversionRate);

        $preparedRevenueChart = $this->convertSeriesValues($dashboardData['revenueChart'] ?? [], $conversionRate);
        $preparedRecentOrders = $this->convertRecentOrders($dashboardData['recentOrders'] ?? [], $conversionRate, $activeCurrency);

        return Inertia::render('Admin/Dashboard/Index', [
            ...$dashboardData,
            'stats' => $preparedStats,
            'revenueChart' => $preparedRevenueChart,
            'recentOrders' => $preparedRecentOrders,
            'currencyCode' => $activeCurrency,
            'meta' => [
                'generatedAt' => now(),
                'locale' => App::getLocale(),
                'baseCurrency' => $baseCurrency,
                'conversionRate' => $conversionRate,
                'currencyCode' => $activeCurrency,
            ],
        ]);
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
            $kpis = $this->analyticsService->calculateKPIs()->toArray();

            return [
                'total_revenue' => (float) ($kpis['totalRevenue'] ?? 0.0),
                'pending_orders' => (int) ($kpis['pendingOrders'] ?? 0),
                'user_growth_monthly' => (float) ($kpis['userGrowth']['change'] ?? 0.0),
                'system_health' => (float) ($kpis['systemHealth'] ?? 0.0),
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
                ->whereIn('status', [
                    OrderStatus::COMPLETED->value,
                    OrderStatus::DELIVERED->value,
                ])
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
                    'revenue' => (float) ($rawResults[$key] ?? 0.0),
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

    private function resolveCurrencyContext(Request $request): array
    {
        $baseCurrency = strtoupper(config('services.exchange_rate.base_currency', 'USD'));
        $defaultCurrency = App::getLocale() === 'vi' ? 'VND' : $baseCurrency;
        $activeCurrency = strtoupper((string) $request->session()->get('currency', $defaultCurrency));

        if ($activeCurrency === '') {
            $activeCurrency = $baseCurrency;
        }

        $conversionRate = $activeCurrency === $baseCurrency
            ? 1.0
            : max(ExchangeRateService::getRate($baseCurrency, $activeCurrency), 0.0000001);

        return [$baseCurrency, $activeCurrency, $conversionRate];
    }

    private function convertAmount(float $amount, float $conversionRate): float
    {
        return round($amount * $conversionRate, 2);
    }

    private function convertSeriesValues(array $series, float $conversionRate): array
    {
        return array_map(function (array $point) use ($conversionRate) {
            if (isset($point['value'])) {
                $point['value'] = $this->convertAmount((float) $point['value'], $conversionRate);
            }

            if (isset($point['revenue'])) {
                $point['revenue'] = $this->convertAmount((float) $point['revenue'], $conversionRate);
            }

            return $point;
        }, $series);
    }

    private function convertRecentOrders(iterable $orders, float $conversionRate, string $currencyCode): array
    {
        return collect($orders)
            ->map(function ($order) use ($conversionRate, $currencyCode) {
                $orderArray = $order instanceof Order ? $order->toArray() : (array) $order;
                $baseAmount = (float) ($orderArray['total_amount_base'] ?? $orderArray['total_amount'] ?? 0.0);

                $orderArray['total_amount_converted'] = $this->convertAmount($baseAmount, $conversionRate);
                $orderArray['currency_code'] = $currencyCode;

                return $orderArray;
            })
            ->all();
    }
}