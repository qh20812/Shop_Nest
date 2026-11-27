<?php

namespace App\Services;

use App\Models\Category;
use App\Models\Product;
use App\Models\Promotion;
use App\Traits\AuditLoggable;
use Exception;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class PromotionService
{
    use AuditLoggable;

    public function __construct(private PromotionRuleService $ruleService) {}

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
                    'is_active' => $data['is_active'] ?? true,
                    'selection_rules' => $data['selection_rules'] ?? null,
                    'auto_apply_new_products' => (bool) ($data['auto_apply_new_products'] ?? false),
                ]);

                $this->syncRelationships($promotion, $productIds, $categoryIds);
            });

            if (! $promotion) {
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
     * Create a promotion using selection rules
     */
    public function createWithRules(array $data): Promotion
    {
        $rules = $data['selection_rules'] ?? [];

        $this->ruleService->validateRules($rules);

        $matches = $this->ruleService->getMatchingProducts($rules);
        $productIds = $matches->pluck('product_id')->all();

        return $this->create($data, $productIds, $data['category_ids'] ?? []);
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
                $payload = [
                    'name' => $data['name'] ?? $promotion->name,
                    'type' => $this->mapTypeForStorage($data['type'] ?? $this->resolveTypeForResponse($promotion->type)),
                    'value' => $data['value'] ?? $promotion->value,
                    'start_date' => $data['starts_at'] ?? $promotion->start_date,
                    'end_date' => $data['expires_at'] ?? $promotion->end_date,
                ];

                foreach (['description', 'min_order_amount', 'max_discount_amount'] as $field) {
                    if (array_key_exists($field, $data)) {
                        $payload[$field] = $data[$field];
                    }
                }

                if (array_key_exists('minimum_order_value', $data)) {
                    $payload['min_order_amount'] = $data['minimum_order_value'];
                }

                if (array_key_exists('usage_limit_per_user', $data)) {
                    $payload['usage_limit'] = $data['usage_limit_per_user'];
                }

                if (array_key_exists('is_active', $data)) {
                    $payload['is_active'] = (bool) $data['is_active'];
                }

                if (array_key_exists('selection_rules', $data)) {
                    $payload['selection_rules'] = $data['selection_rules'];
                }

                if (array_key_exists('auto_apply_new_products', $data)) {
                    $payload['auto_apply_new_products'] = (bool) $data['auto_apply_new_products'];
                }

                $promotion->update($payload);

                $this->syncRelationships($promotion, $productIds, $categoryIds);
                $promotion->refresh();
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
     * Update a promotion and re-evaluate selection rules
     */
    public function updateWithRules(Promotion $promotion, array $data): Promotion
    {
        $rules = $data['selection_rules'] ?? [];

        $this->ruleService->validateRules($rules);

        $matches = $this->ruleService->getMatchingProducts($rules);
        $productIds = $matches->pluck('product_id')->all();

        return $this->update($promotion, $data, $productIds, $data['category_ids'] ?? []);
    }

    /**
     * Toggle auto-apply behaviour for a promotion
     */
    public function toggleAutoApply(Promotion $promotion, bool $enabled): Promotion
    {
        $previous = $promotion->auto_apply_new_products;

        if ($previous === $enabled) {
            return $promotion;
        }

        $promotion->auto_apply_new_products = $enabled;
        $promotion->save();

        $this->logAudit(
            $enabled ? 'auto_apply_enabled' : 'auto_apply_disabled',
            $promotion,
            ['auto_apply_new_products' => $previous],
            ['auto_apply_new_products' => $enabled]
        );

        return $promotion->refresh();
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

        return Product::select('product_id', 'name', 'sku')
            ->orderBy('product_id')
            ->get()
            ->map(function (Product $product) use ($locale) {
                $name = $product->name;

                // If name is an array/object, extract the locale value
                if (is_array($name)) {
                    $name = $name[$locale] ?? $name['en'] ?? reset($name) ?? 'Unnamed';
                }

                // Ensure it's a string
                if (! is_string($name)) {
                    $name = 'Unnamed';
                }

                return [
                    'product_id' => $product->product_id,
                    'name' => $name,
                    'sku' => $product->sku,
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

        return Category::select('category_id', 'name')
            ->whereNull('parent_category_id')
            ->orderBy('category_id')
            ->get()
            ->map(function (Category $category) use ($locale) {
                $name = $category->name;

                // If name is an array/object, extract the locale value
                if (is_array($name)) {
                    $name = $name[$locale] ?? $name['en'] ?? reset($name) ?? 'Unnamed';
                }

                // Ensure it's a string
                if (! is_string($name)) {
                    $name = 'Unnamed';
                }

                return [
                    'category_id' => $category->category_id,
                    'name' => $name,
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

        return $products->map(function (Product $product) use ($locale) {
            $name = $product->name;

            // If name is an array/object, extract the locale value
            if (is_array($name)) {
                $name = $name[$locale] ?? $name['en'] ?? reset($name) ?? 'Unnamed';
            }

            // Ensure it's a string
            if (! is_string($name)) {
                $name = 'Unnamed';
            }

            return [
                'product_id' => $product->product_id,
                'name' => $name,
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

        return $categories->map(function (Category $category) use ($locale) {
            $name = $category->name;

            // If name is an array/object, extract the locale value
            if (is_array($name)) {
                $name = $name[$locale] ?? $name['en'] ?? reset($name) ?? 'Unnamed';
            }

            // Ensure it's a string
            if (! is_string($name)) {
                $name = 'Unnamed';
            }

            return [
                'category_id' => $category->category_id,
                'name' => $name,
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
     * Map promotion type from request to stored value.
     */
    public function mapTypeForQuery(string|int $type): int
    {
        if (is_numeric($type)) {
            return (int) $type;
        }

        return self::TYPE_MAP[$type] ?? self::TYPE_MAP['percentage'];
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
        $validator = Validator::make($data, []);

        $validator->after(function ($validator) use ($data, $promotion) {
            if (($data['type'] ?? null) && ! array_key_exists($data['type'], self::TYPE_MAP)) {
                $validator->errors()->add('type', __('The selected promotion type is not supported.'));
            }

            if (($data['type'] ?? null) === 'percentage' && isset($data['value']) && (float) $data['value'] > 100) {
                $validator->errors()->add('value', __('The promotion value cannot exceed 100% for percentage discounts.'));
            }

            if (isset($data['usage_limit_per_user']) && $data['usage_limit_per_user'] !== null && (int) $data['usage_limit_per_user'] < 0) {
                $validator->errors()->add('usage_limit_per_user', __('The usage limit per user must be zero or greater.'));
            }

            if (isset($data['starts_at'], $data['expires_at'])) {
                $start = Carbon::parse($data['starts_at']);
                $end = Carbon::parse($data['expires_at']);

                if ($start->gte($end)) {
                    $validator->errors()->add('expires_at', __('The expiry date must be after the start date.'));
                }

                if ($promotion && $promotion->used_count > 0 && $end->lessThan(now())) {
                    $validator->errors()->add('expires_at', __('You cannot set an expiry date in the past for a promotion that has already been used.'));
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
     * Resolve localized "name" attribute for translatable models
     */
    private function resolveLocalizedName(Model $model, string $locale): string
    {
        // Get the raw attribute value first
        $value = $model->getRawOriginal('name') ?? $model->getAttribute('name');

        // If it's a JSON string, decode it
        if (is_string($value)) {
            $decoded = json_decode($value, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                // Extract the locale-specific value
                $candidate = $decoded[$locale] ?? $decoded['en'] ?? reset($decoded);
                if (is_string($candidate) && $candidate !== '') {
                    return $candidate;
                }
            }
            // If not JSON, return as-is
            if ($value !== '') {
                return $value;
            }
        }

        // If it's already an array
        if (is_array($value)) {
            $candidate = $value[$locale] ?? $value['en'] ?? reset($value);
            if (is_string($candidate) && $candidate !== '') {
                return $candidate;
            }
        }

        // Try using getTranslation method as fallback
        if (method_exists($model, 'getTranslation')) {
            try {
                $translated = $model->getTranslation('name', $locale, false);
                if (is_string($translated) && $translated !== '') {
                    return $translated;
                }
            } catch (Exception $e) {
                // Silently fail and continue
            }
        }

        // Last resort - try to get any string value
        if (is_scalar($value)) {
            return (string) $value;
        }

        return 'Unnamed';
    }

    /**
     * Map type for storage
     */
    private function mapTypeForStorage(string $type): int
    {
        if (! array_key_exists($type, self::TYPE_MAP)) {
            throw ValidationException::withMessages([
                'type' => __('The selected promotion type is not supported.'),
            ]);
        }

        return self::TYPE_MAP[$type];
    }
}
