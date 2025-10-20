<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Promotion;
use Exception;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class SellerPromotionService
{
    private const TYPE_MAP = [
        'percentage' => 1,
        'fixed_amount' => 2,
        'free_shipping' => 3,
        'buy_x_get_y' => 4,
    ];

    public function __construct(private SellerWalletService $walletService)
    {
    }

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
                'spent_budget' => $data['spent_budget'] ?? 0,
            ]);

            if (!empty($productIds)) {
                $promotion->products()->sync($productIds);
            }

            $budget = (float) $promotion->allocated_budget;
            if ($budget > 0) {
                $wallet = $this->walletService->getWallet($sellerId);
                $this->walletService->deductFromWallet(
                    $wallet->wallet_id,
                    $budget,
                    sprintf('Budget allocated to promotion %s', $promotion->name),
                    'promotion',
                    $promotion->promotion_id,
                    false
                );
            }

            return $promotion->fresh(['products']);
        });
    }

    public function updatePromotion(Promotion $promotion, array $data, int $sellerId): Promotion
    {
        $this->assertPromotionBelongsToSeller($promotion, $sellerId);

        return DB::transaction(function () use ($promotion, $data, $sellerId) {
            $productIds = $data['product_ids'] ?? [];
            if (!empty($productIds)) {
                $this->assertSellerOwnsProducts($productIds, $sellerId);
            }

            $newBudget = $data['allocated_budget'] ?? null;
            if ($newBudget !== null) {
                if ((float) ($promotion->spent_budget ?? 0) > (float) $newBudget) {
                    throw new InvalidArgumentException('Allocated budget cannot be less than the amount already spent.');
                }

                $currentBudget = (float) ($promotion->allocated_budget ?? 0);
                $difference = (float) $newBudget - $currentBudget;

                if ($difference > 0) {
                    $wallet = $this->walletService->getWallet($sellerId);
                    $this->walletService->deductFromWallet(
                        $wallet->wallet_id,
                        $difference,
                        sprintf('Budget increase for promotion %s', $promotion->name),
                        'promotion_adjustment',
                        $promotion->promotion_id,
                        false
                    );
                } elseif ($difference < 0) {
                    $wallet = $this->walletService->getWallet($sellerId);
                    $this->walletService->creditWallet(
                        $wallet->wallet_id,
                        abs($difference),
                        sprintf('Budget release from promotion %s', $promotion->name),
                        'promotion_adjustment',
                        $promotion->promotion_id,
                        false
                    );
                }

                $promotion->allocated_budget = $newBudget;
            }

            $promotion->update([
                'name' => $data['name'] ?? $promotion->name,
                'description' => $data['description'] ?? $promotion->description,
                'type' => isset($data['type'])
                    ? $this->mapTypeForStorage($data['type'])
                    : $promotion->type,
                'value' => $data['value'] ?? $promotion->value,
                'min_order_amount' => $data['min_order_amount'] ?? $promotion->min_order_amount,
                'max_discount_amount' => $data['max_discount_amount'] ?? $promotion->max_discount_amount,
                'start_date' => $data['start_date'] ?? $promotion->start_date,
                'end_date' => $data['end_date'] ?? $promotion->end_date,
                'usage_limit' => $data['usage_limit'] ?? $promotion->usage_limit,
                'is_active' => array_key_exists('is_active', $data) ? (bool) $data['is_active'] : $promotion->is_active,
                'allocated_budget' => $promotion->allocated_budget,
            ]);

            if (!empty($productIds)) {
                $promotion->products()->sync($productIds);
            }

            return $promotion->fresh(['products']);
        });
    }

    public function deletePromotion(Promotion $promotion, int $sellerId): bool
    {
        $this->assertPromotionBelongsToSeller($promotion, $sellerId);

        return DB::transaction(function () use ($promotion, $sellerId) {
            $remainingBudget = max(0, (float) ($promotion->allocated_budget ?? 0) - (float) ($promotion->spent_budget ?? 0));

            if ($remainingBudget > 0) {
                $wallet = $this->walletService->getWallet($sellerId);
                $this->walletService->creditWallet(
                    $wallet->wallet_id,
                    $remainingBudget,
                    sprintf('Budget refund from promotion %s', $promotion->name),
                    'promotion_refund',
                    $promotion->promotion_id,
                    false
                );
            }

            $promotion->products()->detach();

            return (bool) $promotion->delete();
        });
    }

    public function pausePromotion(Promotion $promotion, int $sellerId): Promotion
    {
        $this->assertPromotionBelongsToSeller($promotion, $sellerId);

        $promotion->update(['is_active' => false]);

        return $promotion->refresh();
    }

    public function resumePromotion(Promotion $promotion, int $sellerId): Promotion
    {
        $this->assertPromotionBelongsToSeller($promotion, $sellerId);

        if ($promotion->end_date && Carbon::parse($promotion->end_date)->isPast()) {
            throw new InvalidArgumentException('Cannot resume an expired promotion.');
        }

        $promotion->update(['is_active' => true]);

        return $promotion->refresh();
    }

    public function getSellerPromotions(int $sellerId, array $filters = []): LengthAwarePaginator
    {
        $query = Promotion::query()
            ->where('seller_id', $sellerId)
            ->orderByDesc('promotion_id');

        if (!empty($filters['status'])) {
            $status = $filters['status'];
            $query->where(function ($builder) use ($status) {
                $now = Carbon::now();

                if ($status === 'active') {
                    $builder->where('is_active', true)
                        ->where('start_date', '<=', $now)
                        ->where('end_date', '>=', $now);
                } elseif ($status === 'paused') {
                    $builder->where('is_active', false)
                        ->where('end_date', '>=', $now);
                } elseif ($status === 'upcoming') {
                    $builder->where('start_date', '>', $now);
                } elseif ($status === 'expired') {
                    $builder->where('end_date', '<', $now);
                }
            });
        }

        if (!empty($filters['type'])) {
            $query->where('type', $this->mapTypeForStorage($filters['type']));
        }

        $query->with(['products']);

        $perPage = (int) ($filters['per_page'] ?? 10);

        return $query->paginate($perPage)->withQueryString();
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

    public function validateSellerOwnershipForPromotion(Promotion $promotion, int $sellerId): bool
    {
        return (int) $promotion->seller_id === $sellerId;
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

        if (!array_key_exists($type, self::TYPE_MAP)) {
            throw new InvalidArgumentException('Unsupported promotion type.');
        }

        return self::TYPE_MAP[$type];
    }

    private function assertSellerOwnsProducts(array $productIds, int $sellerId): void
    {
        if (!$this->validateSellerOwnership($productIds, $sellerId)) {
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
