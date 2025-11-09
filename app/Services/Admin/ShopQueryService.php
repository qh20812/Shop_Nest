<?php

namespace App\Services\Admin;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ShopQueryService
{
    public function buildListing(Request $request, ?string $forcedStatus = null): array
    {
        $filters = $request->only([
            'search',
            'status',
            'date_from',
            'date_to',
            'sort',
            'direction',
            'per_page',
        ]);

        if ($forcedStatus) {
            $filters['status'] = $forcedStatus;
        }

        $perPage = (int) ($filters['per_page'] ?? 20);
        $perPage = $perPage > 100 ? 100 : max(10, $perPage);

        $query = $this->shopQuery($filters);

        $sortOptions = [
            'created_at' => 'users.created_at',
            'approved_at' => 'users.approved_at',
            'total_revenue' => 'total_revenue',
            'orders_count' => 'orders_count',
            'products_count' => 'products_count',
            'items_sold' => 'items_sold',
        ];

        $sort = $filters['sort'] ?? 'created_at';
        $direction = strtolower($filters['direction'] ?? 'desc');
        $direction = $direction === 'asc' ? 'asc' : 'desc';

        $query->orderBy($sortOptions[$sort] ?? 'users.created_at', $direction);

        $shops = $query->paginate($perPage)->withQueryString();

        $base = User::sellers();
        $metrics = [
            'total' => (clone $base)->count(),
            'active' => (clone $base)->shopStatus('active')->count(),
            'pending' => (clone $base)->shopStatus('pending')->count(),
            'suspended' => (clone $base)->shopStatus('suspended')->count(),
            'rejected' => (clone $base)->shopStatus('rejected')->count(),
        ];

        return [$filters, $shops, $metrics];
    }

    public function buildExportQuery(Request $request): array
    {
        $filters = $request->only(['search', 'status', 'date_from', 'date_to']);
        $query = $this->shopQuery($filters);

        return [$filters, $query];
    }

    /**
     * @return Builder
     */
    private function shopQuery(array $filters)
    {
        $query = User::sellers()
            ->select('users.*')
            ->withCount('products')
            ->withCount([
                'shopViolations as open_violations_count' => fn ($q) => $q->where('status', 'open'),
            ])
            ->selectSub($this->orderCountSubquery(), 'orders_count')
            ->selectSub($this->orderRevenueSubquery(), 'total_revenue')
            ->selectSub($this->orderItemsSubquery(), 'items_sold');

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($sub) use ($search) {
                $sub->where('username', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%");
            });
        }

        if (!empty($filters['status'])) {
            $query->shopStatus($filters['status']);
        }

        if (!empty($filters['date_from'])) {
            $query->whereDate('users.created_at', '>=', $filters['date_from']);
        }

        if (!empty($filters['date_to'])) {
            $query->whereDate('users.created_at', '<=', $filters['date_to']);
        }

        return $query;
    }

    private function orderCountSubquery()
    {
        return OrderItem::query()
            ->selectRaw('COUNT(DISTINCT order_items.order_id)')
            ->join('product_variants', 'order_items.variant_id', '=', 'product_variants.variant_id')
            ->join('products', 'product_variants.product_id', '=', 'products.product_id')
            ->whereColumn('products.seller_id', 'users.id');
    }

    private function orderRevenueSubquery()
    {
        return OrderItem::query()
            ->selectRaw('COALESCE(SUM(order_items.total_price), 0)')
            ->join('product_variants', 'order_items.variant_id', '=', 'product_variants.variant_id')
            ->join('products', 'product_variants.product_id', '=', 'products.product_id')
            ->whereColumn('products.seller_id', 'users.id');
    }

    private function orderItemsSubquery()
    {
        return OrderItem::query()
            ->selectRaw('COALESCE(SUM(order_items.quantity), 0)')
            ->join('product_variants', 'order_items.variant_id', '=', 'product_variants.variant_id')
            ->join('products', 'product_variants.product_id', '=', 'products.product_id')
            ->whereColumn('products.seller_id', 'users.id');
    }
}