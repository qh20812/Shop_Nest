<?php

namespace App\Services;

use App\Models\Promotion;
use App\Models\PromotionAuditLog;
use App\Traits\AuditLoggable;
use Exception;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Validation\ValidationException;

class PromotionService
{
    use AuditLoggable;
    private const TYPE_MAP = [
        'percentage' => 1,
        'fixed_amount' => 2,
        'free_shipping' => 3,
        'buy_x_get_y' => 4,
    ];

    private const PRIORITY_WEIGHTS = [
        'low' => 1,
        'medium' => 2,
        'high' => 3,
        'urgent' => 4,
    ];

    /**
     * Create a new promotion
     */
    public function create(array $data, array $productIds = [], array $categoryIds = []): Promotion
    {
        $this->validateBusinessRules($data);

        try {
            $promotion = null;

            DB::transaction(function () use (&$promotion, $data, $productIds, $categoryIds) {
                $promotion = Promotion::create([
                    'name' => $data['name'],
                    'description' => $data['description'] ?? null,
                    'type' => $this->mapTypeForStorage($data['type']),
                    'value' => $data['value'],
                    'min_order_amount' => $data['minimum_order_value'] ?? null,
                    'max_discount_amount' => $data['max_discount_amount'] ?? null,
                    'start_date' => $data['starts_at'],
                    'end_date' => $data['expires_at'],
                    'usage_limit' => $data['usage_limit_per_user'] ?? null,
                    'used_count' => 0,
                    'is_active' => true,
                ]);

                $this->syncRelationships($promotion, $productIds, $categoryIds);
                $this->applyAutomaticStatusUpdates($promotion, $data['is_active'] ?? true);
            });

            if (!$promotion) {
                throw new Exception('Failed to create promotion');
            }

            // Log audit trail
            $this->logAudit('created', $promotion, [], $promotion->toArray());

            return $promotion;
        } catch (Exception $exception) {
            Log::error('Failed to create promotion', ['exception' => $exception]);
            throw $exception;
        }
    }

    /**
     * Update an existing promotion
     */
    public function update(Promotion $promotion, array $data, array $productIds = [], array $categoryIds = []): Promotion
    {
        $this->validateBusinessRules($data, $promotion);

        // Capture old values for audit
        $oldValues = $promotion->toArray();

        try {
            DB::transaction(function () use ($promotion, $data, $productIds, $categoryIds) {
                $promotion->update([
                    'name' => $data['name'],
                    'description' => $data['description'] ?? null,
                    'type' => $this->mapTypeForStorage($data['type']),
                    'value' => $data['value'],
                    'min_order_amount' => $data['minimum_order_value'] ?? null,
                    'max_discount_amount' => $data['max_discount_amount'] ?? null,
                    'start_date' => $data['starts_at'],
                    'end_date' => $data['expires_at'],
                    'usage_limit' => $data['usage_limit_per_user'] ?? null,
                    'is_active' => $promotion->is_active,
                ]);

                $this->syncRelationships($promotion, $productIds, $categoryIds);
                $promotion->refresh();
                $this->applyAutomaticStatusUpdates($promotion, $data['is_active'] ?? true);
            });

            // Log audit trail
            $this->logAudit('updated', $promotion, $oldValues, $promotion->toArray());

            return $promotion;
        } catch (Exception $exception) {
            Log::error('Failed to update promotion', [
                'promotion_id' => $promotion->promotion_id,
                'exception' => $exception,
            ]);
            throw $exception;
        }
    }

    /**
     * Delete a promotion
     */
    public function delete(Promotion $promotion): bool
    {
        try {
            // Log audit trail before deletion
            $this->logAudit('deleted', $promotion, $promotion->toArray(), []);

            $promotion->delete();
            return true;
        } catch (Exception $exception) {
            Log::error('Failed to delete promotion', [
                'promotion_id' => $promotion->promotion_id,
                'exception' => $exception,
            ]);
            throw $exception;
        }
    }

    /**
     * Get promotion type options
     */
    public function getPromotionTypeOptions(): array
    {
        return [
            'percentage' => 'Percentage Discount',
            'fixed_amount' => 'Fixed Amount Discount',
            'free_shipping' => 'Free Shipping',
            'buy_x_get_y' => 'Buy X Get Y',
        ];
    }

    /**
     * Get product options for forms
     */
    public function getProductOptions(): Collection
    {
        $locale = app()->getLocale();

        return \App\Models\Product::select('product_id', 'name', 'sku', 'price')
            ->orderBy('product_id')
            ->get()
            ->map(function (\App\Models\Product $product) use ($locale) {
                return [
                    'product_id' => $product->product_id,
                    'name' => $product->getTranslation('name', $locale) ?? $product->name,
                    'sku' => $product->sku,
                    'price' => $product->price,
                ];
            })
            ->values();
    }

    /**
     * Get category options for forms
     */
    public function getCategoryOptions(): Collection
    {
        $locale = app()->getLocale();

        return \App\Models\Category::select('category_id', 'name')
            ->whereNull('parent_category_id')
            ->orderBy('category_id')
            ->get()
            ->map(function (\App\Models\Category $category) use ($locale) {
                return [
                    'category_id' => $category->category_id,
                    'name' => $category->getTranslation('name', $locale) ?? $category->name,
                ];
            })
            ->values();
    }

    /**
     * Format products collection for response
     */
    public function formatProductsCollection(Collection $products): Collection
    {
        $locale = app()->getLocale();

        return $products->map(function (\App\Models\Product $product) use ($locale) {
            return [
                'product_id' => $product->product_id,
                'name' => $product->getTranslation('name', $locale) ?? $product->name,
                'sku' => $product->sku,
            ];
        })->values();
    }

    /**
     * Format categories collection for response
     */
    public function formatCategoriesCollection(Collection $categories): Collection
    {
        $locale = app()->getLocale();

        return $categories->map(function (\App\Models\Category $category) use ($locale) {
            return [
                'category_id' => $category->category_id,
                'name' => $category->getTranslation('name', $locale) ?? $category->name,
            ];
        })->values();
    }

    /**
     * Resolve promotion type for response
     */
    public function resolveTypeForResponse(int|string|null $type): string
    {
        if (is_numeric($type)) {
            $reversed = array_flip(self::TYPE_MAP);
            return $reversed[(int) $type] ?? 'percentage';
        }
        return $type ? (string) $type : 'percentage';
    }

    /**
     * Resolve promotion status
     */
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

    /**
     * Validate business rules for promotion data
     */
    private function validateBusinessRules(array $data, ?Promotion $promotion = null): void
    {
        $validator = \Illuminate\Support\Facades\Validator::make($data, []);

        $validator->after(function ($validator) use ($data, $promotion) {
            if (($data['type'] ?? null) && !array_key_exists($data['type'], self::TYPE_MAP)) {
                $validator->errors()->add('type', 'The selected promotion type is not supported.');
            }

            if (($data['type'] ?? null) === 'percentage' && isset($data['value']) && (float) $data['value'] > 100) {
                $validator->errors()->add('value', 'The promotion value cannot exceed 100% for percentage discounts.');
            }

            if (isset($data['usage_limit_per_user']) && $data['usage_limit_per_user'] !== null && (int) $data['usage_limit_per_user'] < 0) {
                $validator->errors()->add('usage_limit_per_user', 'The usage limit per user must be zero or greater.');
            }

            if (isset($data['starts_at'], $data['expires_at'])) {
                $start = Carbon::parse($data['starts_at']);
                $end = Carbon::parse($data['expires_at']);

                if ($start->gte($end)) {
                    $validator->errors()->add('expires_at', 'The expiry date must be after the start date.');
                }

                if ($promotion && $promotion->used_count > 0 && $end->lessThan(now())) {
                    $validator->errors()->add('expires_at', 'You cannot set an expiry date in the past for a promotion that has already been used.');
                }
            }
        });

        $validator->validate();
    }

    /**
     * Sync promotion relationships
     */
    private function syncRelationships(Promotion $promotion, array $productIds, array $categoryIds): void
    {
        $productIds = array_values(array_unique(array_filter($productIds, static function ($id) {
            return $id !== null && $id !== '';
        })));
        $categoryIds = array_values(array_unique(array_filter($categoryIds, static function ($id) {
            return $id !== null && $id !== '';
        })));

        if (Schema::hasTable('promotion_products')) {
            $promotion->products()->sync($productIds);
        }

        if (Schema::hasTable('promotion_categories')) {
            $promotion->categories()->sync($categoryIds);
        }
    }

    /**
     * Apply automatic status updates
     */
    private function applyAutomaticStatusUpdates(?Promotion $promotion = null, bool $requestedActive = true): void
    {
        $now = Carbon::now();

        if ($promotion) {
            $shouldBeActive = $this->shouldRemainActive($promotion, $requestedActive, $now);

            if ($promotion->is_active !== $shouldBeActive) {
                $promotion->is_active = $shouldBeActive;
                $promotion->save();
            }

            return;
        }

        Promotion::where('end_date', '<', $now)->update(['is_active' => false]);
        Promotion::where('start_date', '>', $now)->update(['is_active' => false]);
    }

    /**
     * Check if promotion should remain active
     */
    private function shouldRemainActive(Promotion $promotion, bool $requestedActive, Carbon $moment): bool
    {
        $start = Carbon::parse($promotion->start_date);
        $end = Carbon::parse($promotion->end_date);

        if ($end->lt($moment)) {
            return false;
        }

        if ($start->gt($moment)) {
            return false;
        }

        return $requestedActive;
    }

    /**
     * Map type for storage
     */
    private function mapTypeForStorage(string $type): int
    {
        if (!array_key_exists($type, self::TYPE_MAP)) {
            throw ValidationException::withMessages([
                'type' => 'The selected promotion type is not supported.',
            ]);
        }

        return self::TYPE_MAP[$type];
    }
}