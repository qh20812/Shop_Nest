<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Promotion;
use App\Models\WalletTransaction;
use App\Traits\AuditLoggable;
use Exception;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class SellerPromotionService
{
    use AuditLoggable;

    private const TYPE_MAP = [
        'percentage' => 1,
        'fixed_amount' => 2,
        'free_shipping' => 3,
        'buy_x_get_y' => 4,
    ];

    public function __construct(private WalletService $walletService) {}

    public function createPromotion(array $data, int $sellerId): Promotion
    {
        return DB::transaction(function () use ($data, $sellerId) {
            $productIds = $data['product_ids'] ?? [];
            $this->assertSellerOwnsProducts($productIds, $sellerId);

            $promotion = Promotion::create([
                'name' => $data['name'],
                'description' => $data['description'] ?? null,
                'type' => $this->mapTypeForStorage($data['type'] ?? 'percentage'),
                'value' => $data['value'] ?? 0,
                'min_order_amount' => $data['min_order_amount'] ?? $data['minimum_order_value'] ?? null,
                'max_discount_amount' => $data['max_discount_amount'] ?? null,
                'start_date' => $data['start_date'],
                'end_date' => $data['end_date'],
                'usage_limit' => $data['usage_limit'] ?? null,
                'is_active' => (bool) ($data['is_active'] ?? true),
                'created_by_type' => 'seller',
                'seller_id' => $sellerId,
                'budget_source' => 'seller_wallet',
                'allocated_budget' => $data['allocated_budget'] ?? 0,
                'spent_budget' => 0,
            ]);

            if (! empty($productIds)) {
                $promotion->products()->sync($productIds);
            }

            $budget = (float) $promotion->allocated_budget;
            if ($budget > 0) {
                $wallet = $this->walletService->forUser($sellerId);
                $this->walletService->debit(
                    $wallet->wallet_id,
                    $budget,
                    WalletTransaction::TYPE_PROMOTION_BUDGET,
                    sprintf('Budget allocated to promotion %s', $promotion->name),
                    'promotion',
                    $promotion->promotion_id,
                    false,
                );
            }

            $this->logAudit('created', $promotion, [], $promotion->toArray());

            return $promotion->fresh(['products']);
        });
    }

    public function updatePromotion(Promotion $promotion, array $data, int $sellerId): Promotion
    {
        $this->assertPromotionBelongsToSeller($promotion, $sellerId);

        $oldValues = $promotion->toArray();

        return DB::transaction(function () use ($promotion, $data, $sellerId, $oldValues) {
            $productIds = $data['product_ids'] ?? [];
            if (! empty($productIds)) {
                $this->assertSellerOwnsProducts($productIds, $sellerId);
            }

            if (array_key_exists('allocated_budget', $data) && $data['allocated_budget'] !== null) {
                $newBudget = (float) $data['allocated_budget'];

                if ((float) ($promotion->spent_budget ?? 0) > $newBudget) {
                    throw new InvalidArgumentException('Allocated budget cannot be less than the amount already spent.');
                }

                $difference = $newBudget - (float) ($promotion->allocated_budget ?? 0);

                if ($difference > 0) {
                    $wallet = $this->walletService->forUser($sellerId);
                    $this->walletService->debit(
                        $wallet->wallet_id,
                        $difference,
                        WalletTransaction::TYPE_PROMOTION_BUDGET,
                        sprintf('Budget increase for promotion %s', $promotion->name),
                        'promotion',
                        $promotion->promotion_id,
                        false,
                    );
                } elseif ($difference < 0) {
                    $wallet = $this->walletService->forUser($sellerId);
                    $this->walletService->credit(
                        $wallet->wallet_id,
                        abs($difference),
                        WalletTransaction::TYPE_PROMOTION_REFUND,
                        sprintf('Budget release from promotion %s', $promotion->name),
                        'promotion',
                        $promotion->promotion_id,
                        false,
                        false,
                        true,
                    );
                }

                $promotion->allocated_budget = $newBudget;
            }

            $payload = [
                'name' => $data['name'] ?? $promotion->name,
                'type' => isset($data['type'])
                    ? $this->mapTypeForStorage($data['type'])
                    : $promotion->type,
                'value' => $data['value'] ?? $promotion->value,
                'start_date' => $data['start_date'] ?? $promotion->start_date,
                'end_date' => $data['end_date'] ?? $promotion->end_date,
                'allocated_budget' => $promotion->allocated_budget,
            ];

            foreach (['description', 'min_order_amount', 'max_discount_amount', 'usage_limit'] as $field) {
                if (array_key_exists($field, $data)) {
                    $payload[$field] = $data[$field];
                }
            }

            if (array_key_exists('is_active', $data)) {
                $payload['is_active'] = (bool) $data['is_active'];
            }

            $promotion->update($payload);

            if (array_key_exists('product_ids', $data)) {
                $promotion->products()->sync($productIds);
            }

            $promotion->refresh();
            $this->logAudit('updated', $promotion, $oldValues, $promotion->toArray());

            return $promotion->fresh(['products']);
        });
    }

    public function deletePromotion(Promotion $promotion, int $sellerId): bool
    {
        $this->assertPromotionBelongsToSeller($promotion, $sellerId);

        return DB::transaction(function () use ($promotion, $sellerId) {
            $remainingBudget = max(0, (float) ($promotion->allocated_budget ?? 0) - (float) ($promotion->spent_budget ?? 0));

            if ($remainingBudget > 0) {
                $wallet = $this->walletService->forUser($sellerId);
                $this->walletService->credit(
                    $wallet->wallet_id,
                    $remainingBudget,
                    WalletTransaction::TYPE_PROMOTION_REFUND,
                    sprintf('Budget refund from promotion %s', $promotion->name),
                    'promotion',
                    $promotion->promotion_id,
                    false,
                    false,
                    true,
                );
            }

            $promotion->products()->detach();
            $promotion->categories()->detach();

            $this->logAudit('deleted', $promotion, $promotion->toArray(), []);

            return (bool) $promotion->delete();
        });
    }

    public function pausePromotion(Promotion $promotion, int $sellerId): Promotion
    {
        $this->assertPromotionBelongsToSeller($promotion, $sellerId);

        $promotion->update(['is_active' => false]);
        $this->logAudit('deactivated', $promotion, ['is_active' => true], ['is_active' => false]);

        return $promotion->refresh();
    }

    public function resumePromotion(Promotion $promotion, int $sellerId): Promotion
    {
        $this->assertPromotionBelongsToSeller($promotion, $sellerId);

        if ($promotion->end_date && Carbon::parse($promotion->end_date)->isPast()) {
            throw new InvalidArgumentException('Cannot resume an expired promotion.');
        }

        $promotion->update(['is_active' => true]);
        $this->logAudit('activated', $promotion, ['is_active' => false], ['is_active' => true]);

        return $promotion->refresh();
    }

    public function getSellerPromotions(int $sellerId, array $filters = []): LengthAwarePaginator
    {
        $query = Promotion::query()
            ->where('seller_id', $sellerId)
            ->orderByDesc('promotion_id');

        if (! empty($filters['search'])) {
            $query->where('name', 'like', '%'.$filters['search'].'%');
        }

        if (! empty($filters['status'])) {
            $query->ofStatus((string) $filters['status']);
        }

        if (! empty($filters['type'])) {
            $query->where('type', $this->mapTypeForStorage($filters['type']));
        }

        if (! empty($filters['date_range'])) {
            $days = match ($filters['date_range']) {
                'last_7_days' => 7,
                'last_30_days' => 30,
                'last_90_days' => 90,
                default => null,
            };

            if ($days !== null) {
                $query->where('created_at', '>=', Carbon::now()->subDays($days));
            }
        }

        if (! empty($filters['budget_range'])) {
            [$min, $max] = $this->parseBudgetRange((string) $filters['budget_range']);

            if ($min !== null) {
                $query->where('allocated_budget', '>=', $min);
            }

            if ($max !== null) {
                $query->where('allocated_budget', '<=', $max);
            }
        }

        $query->with(['products']);

        $perPage = max(1, min(50, (int) ($filters['per_page'] ?? 10)));

        return $query->paginate($perPage)->withQueryString();
    }

    /**
     * @return array{0: float|null, 1: float|null}
     */
    private function parseBudgetRange(string $range): array
    {
        if (str_ends_with($range, '+')) {
            return [(float) str_replace('+', '', $range), null];
        }

        if (str_contains($range, '-')) {
            [$min, $max] = explode('-', $range, 2);

            return [(float) $min, (float) $max];
        }

        return [null, null];
    }

    public function validateSellerOwnership(array $productIds, int $sellerId): bool
    {
        if (empty($productIds)) {
            return true;
        }

        $owned = Product::query()
            ->whereIn('product_id', $productIds)
            ->where('seller_id', $sellerId)
            ->count();

        return $owned === count(array_unique($productIds));
    }

    public function calculatePromotionROI(Promotion $promotion): float
    {
        $allocated = (float) ($promotion->allocated_budget ?? 0);
        if ($allocated <= 0) {
            return 0.0;
        }

        $revenue = (float) $promotion->orders()->sum('total_amount');
        $roi = (($revenue - (float) ($promotion->spent_budget ?? 0)) / $allocated) * 100;
        $rounded = round($roi, 2);

        $promotion->update(['roi_percentage' => $rounded]);

        return $rounded;
    }

    public function resolveStatus(Promotion $promotion): string
    {
        $now = Carbon::now();
        $start = Carbon::parse($promotion->start_date);
        $end = Carbon::parse($promotion->end_date);

        if ($end->lt($now)) {
            return 'expired';
        }

        if ($start->gt($now)) {
            return 'draft';
        }

        return $promotion->is_active ? 'active' : 'paused';
    }

    public function mapTypeForResponse(int|string|null $type): string
    {
        if (is_numeric($type)) {
            $map = array_flip(self::TYPE_MAP);

            return $map[(int) $type] ?? 'percentage';
        }

        return (string) ($type ?? 'percentage');
    }

    private function mapTypeForStorage(string $type): int
    {
        $type = strtolower($type);

        if (! array_key_exists($type, self::TYPE_MAP)) {
            throw new InvalidArgumentException('Unsupported promotion type.');
        }

        return self::TYPE_MAP[$type];
    }

    private function assertSellerOwnsProducts(array $productIds, int $sellerId): void
    {
        if (! $this->validateSellerOwnership($productIds, $sellerId)) {
            throw new InvalidArgumentException('You can only manage promotions for your own products.');
        }
    }

    private function assertPromotionBelongsToSeller(Promotion $promotion, int $sellerId): void
    {
        if ((int) $promotion->seller_id !== $sellerId) {
            throw new Exception('You are not allowed to modify this promotion.');
        }
    }
}
