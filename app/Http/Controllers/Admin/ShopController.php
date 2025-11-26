<?php

namespace App\Http\Controllers\Admin;

use App\Enums\NotificationType;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\ShopViolation;
use App\Models\Shop as ShopModel;
use App\Models\User;
use App\Services\Admin\ShopAuditService;
use App\Services\Admin\ShopExportService;
use App\Services\Admin\ShopManagementService;
use App\Services\Admin\ShopQueryService;
use App\Services\Admin\ShopStatisticsService;
use App\Services\NotificationService;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Collection;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ShopController extends Controller
{
    public function __construct(
        private ShopManagementService $management,
        private ShopStatisticsService $statistics,
        private ShopQueryService $queries,
        private ShopExportService $export,
        private ShopAuditService $audit
    ) {
        $this->middleware(['auth', 'can:manage shops']);
    }

    public function index(Request $request): InertiaResponse
    {
        [$filters, $shops, $metrics] = $this->queries->buildListing($request);

        return Inertia::render('Admin/Shops/Index', [
            'shops' => $shops,
            'filters' => $filters,
            'metrics' => $metrics,
        ]);
    }

    public function pending(Request $request): InertiaResponse
    {
        [$filters, $shops, $metrics] = $this->queries->buildListing($request, 'pending');

        return Inertia::render('Admin/Shops/Pending', [
            'shops' => $shops,
            'filters' => $filters,
            'metrics' => $metrics,
        ]);
    }

    public function dashboard(Request $request): InertiaResponse
    {
        $metrics = Cache::remember('admin_shop_dashboard_metrics', 3600, fn () => $this->statistics->buildGlobalMetrics());

        $chartRange = (int) $request->integer('months', 6);
        $chartRange = $chartRange > 12 ? 12 : max($chartRange, 3);
        $chartData = $this->statistics->buildRevenueTrend($chartRange);

        return Inertia::render('Admin/Shops/Dashboard', [
            'metrics' => $metrics,
            'trend' => $chartData,
            'filters' => [
                'months' => $chartRange,
            ],
        ]);
    }

    /**
     * Display shop overview, including recent orders, audit logs and open violations.
     */
    public function show(User $shop): InertiaResponse
    {
        $shop = $this->prepareShopForShow($shop);

        $shop->load([
            'products' => fn ($query) => $query->select('product_id', 'seller_id', 'name', 'status', 'created_at')
                ->latest()
                ->take(8),
        ]);

        $statistics = $this->statistics->getCachedStatistics($shop);

        $recentOrders = $this->recentOrdersForShop($shop, 8);
        $auditLogs = $shop->shopAuditLogs()
            ->with('admin:id,username,first_name,last_name')
            ->latest()
            ->take(10)
            ->get();

        $openViolations = $shop->shopViolations()
            ->with('reportedBy:id,username,first_name,last_name')
            ->latest()
            ->take(5)
            ->get();

        $shopRecord = ShopModel::where('owner_id', $shop->id)->first();

        return Inertia::render('Admin/Shops/Show', [
            'shop' => $shop,
            'shop_record' => $shopRecord,
            'statistics' => $statistics,
            'recentOrders' => $recentOrders,
            'recentViolations' => $openViolations,
            'auditLogs' => $auditLogs,
        ]);
    }

    /**
     * Prepare a `User` model to be shown as a shop in admin UI.
     * Ensures user is a seller and load commonly needed relationships.
     */
    private function prepareShopForShow(User $shop): User
    {
        $this->ensureSeller($shop);
        $shop->load(['roles:id,name']);
        return $shop;
    }

    public function statistics(Request $request, User $shop): InertiaResponse
    {
        $this->ensureSeller($shop);

        $from = $request->date('from');
        $to = $request->date('to');

        if ($from && $to && $from->greaterThan($to)) {
            throw ValidationException::withMessages([
                'from' => 'The start date must be earlier than the end date.',
            ]);
        }

        $statistics = $this->statistics->compileStatistics($shop, $from, $to, true);

        return Inertia::render('Admin/Shops/Statistics', [
            'shop' => $shop->only(['id', 'username', 'first_name', 'last_name', 'shop_status']),
            'filters' => [
                'from' => $from?->toDateString(),
                'to' => $to?->toDateString(),
            ],
            'statistics' => $statistics,
        ]);
    }

    public function violations(Request $request, User $shop): InertiaResponse
    {
        $this->ensureSeller($shop);

        $filters = $request->only(['status', 'severity']);
        $violations = $shop->shopViolations()
            ->with('reportedBy:id,username,first_name,last_name')
            ->when($filters['status'] ?? null, fn ($query, $status) => $query->where('status', $status))
            ->when($filters['severity'] ?? null, fn ($query, $severity) => $query->where('severity', $severity))
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Shops/Violations', [
            'shop' => $shop->only(['id', 'username', 'first_name', 'last_name', 'shop_status']),
            'violations' => $violations,
            'filters' => $filters,
        ]);
    }

    public function addViolation(Request $request, User $shop): RedirectResponse
    {
        $this->ensureSeller($shop);

        $validated = $request->validate([
            'violation_type' => ['required', 'string', 'max:255'],
            'severity' => ['required', Rule::in(['low', 'medium', 'high', 'critical'])],
            'description' => ['required', 'string', 'min:10', 'max:2000'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);

        try {
            $shop->shopViolations()->create([
            'reported_by' => Auth::id(),
            'violation_type' => $validated['violation_type'],
            'severity' => $validated['severity'],
            'description' => $validated['description'],
        ]);

            $this->audit->logAction(
            $shop,
            'shop.violation.recorded',
            $this->snapshot($shop),
            $this->snapshot($shop),
            $validated['notes'] ?? null,
            $request->ip()
        );

            if ($validated['severity'] === 'critical' && $shop->shop_status !== 'suspended') {
            $autoUntil = now()->addDays(7);
            $this->management->suspend($shop, 'Automatic suspension due to critical violation', $autoUntil, $request->ip(), false);
        }

            return back()->with('success', 'Violation recorded successfully.');
        } catch (\Throwable $e) {
            Log::error('Failed to record violation', ['shop_id' => $shop->id, 'error' => $e->getMessage()]);
            return back()->withErrors(['error' => 'Failed to record violation: ' . $e->getMessage()]);
        }
    }

    public function approve(Request $request, User $shop): RedirectResponse
    {
        $this->ensureSeller($shop);
        $notes = $request->input('notes');
        try {
            $this->management->approve($shop, $request->ip(), $notes);
            return back()->with('success', 'Shop approved successfully.');
        } catch (\Throwable $e) {
            Log::error('Failed to approve shop', ['shop_id' => $shop->id, 'error' => $e->getMessage()]);
            return back()->withErrors(['error' => 'Unable to approve shop: ' . $e->getMessage()]);
        }
    }

    public function reject(Request $request, User $shop): RedirectResponse
    {
        $this->ensureSeller($shop);

        $validated = $request->validate([
            'reason' => ['required', 'string', 'min:10', 'max:500'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);

        try {
            $this->management->reject($shop, $validated['reason'], $request->ip(), $validated['notes'] ?? null);
            return back()->with('success', 'Shop rejected successfully.');
        } catch (\Throwable $e) {
            Log::error('Failed to reject shop', ['shop_id' => $shop->id, 'error' => $e->getMessage()]);
            return back()->withErrors(['error' => 'Unable to reject shop: ' . $e->getMessage()]);
        }
    }

    public function suspend(Request $request, User $shop): RedirectResponse
    {
        $this->ensureSeller($shop);

        $validated = $request->validate([
            'reason' => ['required', 'string', 'min:10', 'max:500'],
            'duration_days' => ['required', 'integer', 'min:1', 'max:365'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);

        $until = now()->addDays($validated['duration_days']);
        try {
            $this->management->suspend($shop, $validated['reason'], $until, $request->ip(), true, $validated['notes'] ?? null);
        } catch (\Throwable $e) {
            Log::error('Failed to suspend shop', ['shop_id' => $shop->id, 'error' => $e->getMessage()]);
            return back()->withErrors(['error' => 'Unable to suspend shop: ' . $e->getMessage()]);
        }

        $actor = $request->user()?->username ?? 'System';
        $message = sprintf(
            '%s suspended shop %s until %s for reason: %s.',
            $actor,
            $shop->username,
            $until->toDayDateTimeString(),
            $validated['reason']
        );

        NotificationService::sendToRole(
            'admin',
            'Shop Suspended',
            $message,
            NotificationType::ADMIN_USER_MODERATION,
            $shop,
            route('admin.shops.show', $shop->id)
        );

        return back()->with('success', 'Shop suspended successfully.');
    }

    public function reactivate(Request $request, User $shop): RedirectResponse
    {
        $this->ensureSeller($shop);
        $notes = $request->input('notes');
        try {
            $this->management->reactivate($shop, $request->ip(), $notes);
            return back()->with('success', 'Shop reactivated successfully.');
        } catch (\Throwable $e) {
            Log::error('Failed to reactivate shop', ['shop_id' => $shop->id, 'error' => $e->getMessage()]);
            return back()->withErrors(['error' => 'Unable to reactivate shop: ' . $e->getMessage()]);
        }
    }

    public function bulkApprove(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'shop_ids' => ['required', 'array', 'min:1', 'max:50'],
            'shop_ids.*' => ['integer', 'exists:users,id'],
        ]);

        $shops = User::sellers()->whereIn('id', $validated['shop_ids'])->get();

        try {
            DB::transaction(function () use ($shops, $request) {
                foreach ($shops as $shop) {
                    $this->management->approve($shop, $request->ip());
                }
            });
        } catch (\Throwable $e) {
            Log::error('Bulk approve failed', ['error' => $e->getMessage(), 'shop_ids' => $validated['shop_ids'] ?? []]);
            return back()->withErrors(['error' => 'Bulk approve failed: ' . $e->getMessage()]);
        }

        return back()->with('success', 'Selected shops have been approved.');
    }

    public function bulkReject(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'shop_ids' => ['required', 'array', 'min:1', 'max:50'],
            'shop_ids.*' => ['integer', 'exists:users,id'],
            'reason' => ['required', 'string', 'min:10', 'max:500'],
        ]);

        $shops = User::sellers()->whereIn('id', $validated['shop_ids'])->get();

        try {
            DB::transaction(function () use ($shops, $validated, $request) {
                foreach ($shops as $shop) {
                    $this->management->reject($shop, $validated['reason'], $request->ip());
                }
            });
        } catch (\Throwable $e) {
            Log::error('Bulk reject failed', ['error' => $e->getMessage(), 'shop_ids' => $validated['shop_ids'] ?? []]);
            return back()->withErrors(['error' => 'Bulk reject failed: ' . $e->getMessage()]);
        }

        return back()->with('success', 'Selected shops have been rejected.');
    }

    public function export(Request $request): StreamedResponse
    {
        [$filters, $query] = $this->queries->buildExportQuery($request);
        $filename = 'shops_' . now()->format('Ymd_His') . '.csv';

        return $this->export->export($query, $filename);
    }

    /**
     * Get recent orders that include products from the given shop
     *
     * @param User $shop
     * @param int $limit
     * @return Collection
     */
    private function recentOrdersForShop(User $shop, int $limit = 10): Collection
    {
        return Order::query()
            ->select('orders.order_id', 'orders.order_number', 'orders.total_amount', 'orders.created_at')
            ->join('order_items', 'orders.order_id', '=', 'order_items.order_id')
            ->join('product_variants', 'order_items.variant_id', '=', 'product_variants.variant_id')
            ->join('products', 'product_variants.product_id', '=', 'products.product_id')
            ->where('products.seller_id', $shop->id)
            ->distinct()
            ->latest('orders.created_at')
            ->take($limit)
            ->get();
    }

    /**
     * Return a snapshot of the shop's relevant fields for audit logging.
     *
     * @param User $shop
     * @return array<string, mixed>
     */
    private function snapshot(User $shop): array
    {
        $snapshot = $shop->only([
            'shop_status',
            'approved_at',
            'suspended_until',
            'shop_settings',
            'rejection_reason',
            'suspension_reason',
        ]);

        foreach ($snapshot as $key => $value) {
            if ($value instanceof Carbon) {
                $snapshot[$key] = $value->toDateTimeString();
            }
        }

        return $snapshot;
    }

    private function ensureSeller(User $shop): void
    {
        if (!$shop->isSeller()) {
            abort(404);
        }
    }
}
