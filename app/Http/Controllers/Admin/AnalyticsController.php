<?php

namespace App\Http\Controllers\Admin;

use App\Enums\OrderStatus;
use App\Http\Controllers\Admin\Concerns\AnalyticsQueryTrait;
use App\Http\Controllers\Controller;
use App\Models\AnalyticsReport;
use App\Services\AnalyticsService;
use App\Services\ExchangeRateService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\App;

class AnalyticsController extends Controller
{
	use AnalyticsQueryTrait;

	public function __construct(private readonly AnalyticsService $analyticsService)
	{
	}

	public function index(Request $request): Response
	{
		$this->authorize('viewAny', AnalyticsReport::class);

		[, $activeCurrency, $conversionRate] = $this->resolveCurrencyContext($request);

		$stats = $this->analyticsService->calculateKPIs();
		$revenue = $this->analyticsService->getRevenueTrends('7days');
		$userAnalytics = $this->analyticsService->getUserAnalytics(['range' => '4weeks']);

		$statsArray = $stats->toArray();
		$statsArray['totalRevenue'] = $this->convertAmount($statsArray['totalRevenue'] ?? 0.0, $conversionRate);

		$revenueData = $revenue->toArray();
		$revenueChart = $this->convertSeriesValues($revenueData['timeSeries'] ?? [], $conversionRate);
		$userGrowthChart = $userAnalytics->toArray()['growthSeries'] ?? [];

		return Inertia::render('Admin/Analytics/Index', [
			'stats' => $statsArray,
			'revenueChart' => $revenueChart,
			'userGrowthChart' => $userGrowthChart,
			'meta' => [
				'generatedAt' => now(),
			],
			'locale' => app()->getLocale(),
			'currencyCode' => $activeCurrency,
		]);
	}

	public function revenue(Request $request): Response
	{
		$this->authorize('viewAny', AnalyticsReport::class);

		[, $activeCurrency, $conversionRate] = $this->resolveCurrencyContext($request);

		$validated = $request->validate([
			'period' => ['nullable', 'string', Rule::in(['7days', '14days', '30days', '90days', '12months', 'custom'])],
			'date_from' => ['nullable', 'date'],
			'date_to' => ['nullable', 'date'],
			'category_id' => ['nullable', 'integer'],
			'seller_id' => ['nullable', 'integer'],
			'brand_id' => ['nullable', 'integer'],
		]);

		$period = $validated['period'] ?? '30days';
		$data = $this->analyticsService->getRevenueTrends($period, $validated)->toArray();
		$data['timeSeries'] = $this->convertSeriesValues($data['timeSeries'] ?? [], $conversionRate);
		$data['byCategory'] = $this->convertSeriesValues($data['byCategory'] ?? [], $conversionRate);
		$data['bySeller'] = $this->convertSeriesValues($data['bySeller'] ?? [], $conversionRate);
		$data['topProducts'] = $this->convertSeriesValues($data['topProducts'] ?? [], $conversionRate);

		return Inertia::render('Admin/Analytics/Revenue', [
			'revenue' => $data,
			'filters' => $validated,
			'availablePeriods' => ['7days', '14days', '30days', '90days', '12months'],
			'currencyCode' => $activeCurrency,
		]);
	}

	public function users(Request $request): Response
	{
		$this->authorize('viewAny', AnalyticsReport::class);

		[, $activeCurrency, ] = $this->resolveCurrencyContext($request);

		$validated = $request->validate([
			'range' => ['nullable', 'string', Rule::in(['4weeks', '6months', '12months'])],
			'date_from' => ['nullable', 'date'],
			'date_to' => ['nullable', 'date'],
			'segment_id' => ['nullable', 'integer'],
			'role' => ['nullable', 'string'],
		]);

		$data = $this->analyticsService->getUserAnalytics($validated)->toArray();

		return Inertia::render('Admin/Analytics/Users', [
			'users' => $data,
			'filters' => $validated,
			'availableRanges' => ['4weeks', '6months', '12months'],
			'currencyCode' => $activeCurrency,
		]);
	}

	public function products(Request $request): Response
	{
		$this->authorize('viewAny', AnalyticsReport::class);

		[, $activeCurrency, $conversionRate] = $this->resolveCurrencyContext($request);

		$validated = $request->validate([
			'date_from' => ['nullable', 'date'],
			'date_to' => ['nullable', 'date'],
			'seller_id' => ['nullable', 'integer'],
			'category_id' => ['nullable', 'integer'],
			'brand_id' => ['nullable', 'integer'],
			'low_stock_threshold' => ['nullable', 'integer', 'min:0'],
		]);

		$data = $this->analyticsService->getProductAnalytics($validated)->toArray();
		$data['topProducts'] = $this->convertSeriesValues($data['topProducts'] ?? [], $conversionRate);
		$data['categoryPerformance'] = $this->convertSeriesValues($data['categoryPerformance'] ?? [], $conversionRate);

		return Inertia::render('Admin/Analytics/Products', [
			'products' => $data,
			'filters' => $validated,
			'currencyCode' => $activeCurrency,
		]);
	}

	public function orders(Request $request): Response
	{
		$this->authorize('viewAny', AnalyticsReport::class);

		[, $activeCurrency, $conversionRate] = $this->resolveCurrencyContext($request);

		$validated = $request->validate([
			'date_from' => ['nullable', 'date'],
			'date_to' => ['nullable', 'date'],
			'status' => ['nullable'],
			'status.*' => [Rule::in(OrderStatus::values())],
			'seller_id' => ['nullable', 'integer'],
			'category_id' => ['nullable', 'integer'],
			'customer_id' => ['nullable', 'integer'],
		]);

		$filters = $validated;
		if (isset($validated['status']) && !is_array($validated['status'])) {
			$filters['status'] = [$validated['status']];
		}

		$data = $this->analyticsService->getOrderAnalytics($filters)->toArray();
		$data['averageOrderValue'] = $this->convertAmount($data['averageOrderValue'] ?? 0.0, $conversionRate);

		return Inertia::render('Admin/Analytics/Orders', [
			'orders' => $data,
			'filters' => $filters,
			'statusOptions' => OrderStatus::options(),
			'currencyCode' => $activeCurrency,
		]);
	}

	public function reports(Request $request)
	{
		$this->authorize('viewAny', AnalyticsReport::class);

		$validated = $request->validate([
			'type' => ['nullable', 'string', Rule::in([
				AnalyticsReport::TYPE_REVENUE,
				AnalyticsReport::TYPE_ORDERS,
				AnalyticsReport::TYPE_PRODUCTS,
				AnalyticsReport::TYPE_USERS,
				AnalyticsReport::TYPE_CUSTOM,
			])],
			'period' => ['nullable', 'string', Rule::in(['7days', '14days', '30days', '90days', '12months'])],
			'date_from' => ['nullable', 'date'],
			'date_to' => ['nullable', 'date'],
			'category_id' => ['nullable', 'integer'],
			'seller_id' => ['nullable', 'integer'],
			'segment_id' => ['nullable', 'integer'],
			'export_format' => ['nullable', 'string', Rule::in(['csv', 'json', 'pdf'])],
			'download' => ['nullable'],
		]);

		$type = $validated['type'] ?? AnalyticsReport::TYPE_REVENUE;
		$result = $this->analyticsService->generateReport($type, $validated);

		if (!empty($validated['export_format']) && $request->boolean('download') && $result->exportPath) {
			$filePath = storage_path('app/' . $result->exportPath);

			if (file_exists($filePath)) {
				return response()->download($filePath)->deleteFileAfterSend(true);
			}
		}

		return Inertia::render('Admin/Analytics/Reports', [
			'report' => $result->toArray(),
			'filters' => $validated,
			'availableTypes' => [
				AnalyticsReport::TYPE_REVENUE,
				AnalyticsReport::TYPE_ORDERS,
				AnalyticsReport::TYPE_PRODUCTS,
				AnalyticsReport::TYPE_USERS,
				AnalyticsReport::TYPE_CUSTOM,
			],
			'exportFormats' => ['csv', 'json', 'pdf'],
		]);
	}

	/**
	 * Resolve the base and active currency along with conversion rate.
	 */
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

	/**
	 * Convert a monetary amount using the resolved conversion rate.
	 */
	private function convertAmount(float $amount, float $conversionRate): float
	{
		return round($amount * $conversionRate, 2);
	}

	/**
	 * Convert series values that contain monetary data.
	 */
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
}