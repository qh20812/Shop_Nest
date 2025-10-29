<?php

namespace App\Http\Controllers\Admin;

use App\Enums\OrderStatus;
use App\Http\Controllers\Admin\Concerns\AnalyticsQueryTrait;
use App\Http\Controllers\Controller;
use App\Models\AnalyticsReport;
use App\Services\AnalyticsService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AnalyticsController extends Controller
{
	use AnalyticsQueryTrait;

	public function __construct(private readonly AnalyticsService $analyticsService)
	{
	}

	public function index(Request $request): Response
	{
		$this->authorize('viewAny', AnalyticsReport::class);

		$stats = $this->analyticsService->calculateKPIs();
		$revenue = $this->analyticsService->getRevenueTrends('7days');
		$userAnalytics = $this->analyticsService->getUserAnalytics(['range' => '4weeks']);

		return Inertia::render('Admin/Analytics/Index', [
			'stats' => $stats->toArray(),
			'revenueChart' => $revenue->toArray()['timeSeries'] ?? [],
			'userGrowthChart' => $userAnalytics->toArray()['growthSeries'] ?? [],
			'meta' => [
				'generatedAt' => now(),
			],
			'locale' => app()->getLocale(),
		]);
	}

	public function revenue(Request $request): Response
	{
		$this->authorize('viewAny', AnalyticsReport::class);

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

		return Inertia::render('Admin/Analytics/Revenue', [
			'revenue' => $data,
			'filters' => $validated,
			'availablePeriods' => ['7days', '14days', '30days', '90days', '12months'],
		]);
	}

	public function users(Request $request): Response
	{
		$this->authorize('viewAny', AnalyticsReport::class);

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
		]);
	}

	public function products(Request $request): Response
	{
		$this->authorize('viewAny', AnalyticsReport::class);

		$validated = $request->validate([
			'date_from' => ['nullable', 'date'],
			'date_to' => ['nullable', 'date'],
			'seller_id' => ['nullable', 'integer'],
			'category_id' => ['nullable', 'integer'],
			'brand_id' => ['nullable', 'integer'],
			'low_stock_threshold' => ['nullable', 'integer', 'min:0'],
		]);

		$data = $this->analyticsService->getProductAnalytics($validated)->toArray();

		return Inertia::render('Admin/Analytics/Products', [
			'products' => $data,
			'filters' => $validated,
		]);
	}

	public function orders(Request $request): Response
	{
		$this->authorize('viewAny', AnalyticsReport::class);

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

		return Inertia::render('Admin/Analytics/Orders', [
			'orders' => $data,
			'filters' => $filters,
			'statusOptions' => OrderStatus::options(),
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
}