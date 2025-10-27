<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Promotion;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class PromotionRuleService
{
    public const SUPPORTED_RULE_TYPES = [
        'price_range',
        'brand',
        'category',
        'seller',
    ];

    public const SUPPORTED_OPERATORS = [
        'equals',
        'contains',
        'between',
        'greater_than',
        'less_than',
    ];

    /**
     * Validate rule payload.
     *
     * @throws ValidationException
     */
    public function validateRules(array $rules): void
    {
        $validator = Validator::make([
            'rules' => $rules,
        ], [
            'rules' => 'required|array|min:1',
            'rules.*.type' => 'required|string|in:' . implode(',', self::SUPPORTED_RULE_TYPES),
            'rules.*.operator' => 'nullable|string|in:' . implode(',', self::SUPPORTED_OPERATORS),
            'rules.*.value' => 'required',
        ]);

        $validator->after(function ($validator) use ($rules) {
            foreach ($rules as $index => $rule) {
                $type = $rule['type'] ?? null;
                $operator = $rule['operator'] ?? 'equals';
                $value = $rule['value'] ?? null;

                if ($type === 'price_range') {
                    if ($operator === 'between') {
                        if (!is_array($value) || !array_key_exists('min', $value) || !array_key_exists('max', $value)) {
                            $validator->errors()->add("rules.$index.value", 'Price range between operator requires min and max values.');
                        }
                    } elseif (!is_numeric($value)) {
                        $validator->errors()->add("rules.$index.value", 'Price rule requires a numeric value.');
                    }
                }

                if (in_array($type, ['brand', 'category', 'seller'], true)) {
                    if ($operator === 'contains' && !is_array($value)) {
                        $validator->errors()->add("rules.$index.value", ucfirst($type) . ' contains operator requires an array of values.');
                    }
                }
            }
        });

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }
    }

    /**
     * Build base query for rules.
     */
    protected function buildQueryForRules(array $rules): Builder
    {
        $query = Product::query()->select('products.product_id')->with(['category', 'brand']);

        foreach ($rules as $rule) {
            $this->applyRuleToQuery($query, $rule);
        }

        return $query->distinct();
    }

    /**
     * Retrieve matching products for given rules.
     */
    public function getMatchingProducts(array $rules): Collection
    {
        if (empty($rules)) {
            return collect();
        }

        $query = $this->buildQueryForRules($rules);

        return $query
            ->with(['brand:brand_id,name', 'category:category_id,name'])
            ->get()
            ->map(function (Product $product) {
                return [
                    'product_id' => $product->product_id,
                    'name' => $product->name,
                    'brand' => $product->brand?->name,
                    'category' => $product->category?->name,
                ];
            });
    }

    /**
     * Apply rules to promotion and sync matching products.
     */
    public function applyRulesToPromotion(Promotion $promotion, array $rules): Collection
    {
        $matches = $this->getMatchingProducts($rules);
        $promotion->forceFill([
            'selection_rules' => $rules,
        ])->save();

        $productIds = $matches->pluck('product_id')->unique()->values();

        if ($productIds->isNotEmpty()) {
            $promotion->products()->sync($productIds->all());
        } else {
            $promotion->products()->detach();
        }

        return $matches;
    }

    /**
     * Determine if a single product matches rules.
     */
    public function productMatchesRules(Product $product, array $rules): bool
    {
        if (empty($rules)) {
            return false;
        }

        $query = $this->buildQueryForRules($rules);

        return $query->where('products.product_id', $product->product_id)->exists();
    }

    /**
     * Apply a single rule to query builder.
     */
    protected function applyRuleToQuery(Builder $query, array $rule): void
    {
        $type = $rule['type'] ?? null;
        $operator = $rule['operator'] ?? 'equals';
        $value = $rule['value'] ?? null;

        if (!$type || $value === null) {
            return;
        }

        switch ($type) {
            case 'price_range':
                $query->whereHas('variants', function (Builder $variantQuery) use ($operator, $value) {
                    $this->applyNumericFilter($variantQuery, 'price', $operator, $value);
                });
                break;

            case 'brand':
                $this->applySimpleFilter($query, 'brand_id', $operator, $value);
                break;

            case 'category':
                $this->applySimpleFilter($query, 'category_id', $operator, $value);
                break;

            case 'seller':
                $this->applySimpleFilter($query, 'seller_id', $operator, $value);
                break;

            default:
                Log::warning('Unsupported promotion rule type encountered', ['rule' => $rule]);
        }
    }

    protected function applySimpleFilter(Builder $query, string $column, string $operator, mixed $value): void
    {
        if (in_array($operator, ['contains', 'in'], true)) {
            $values = is_array($value) ? $value : [$value];
            $query->whereIn($column, $values);
            return;
        }

        if ($operator === 'equals') {
            $query->where($column, $value);
            return;
        }

        if ($operator === 'not_equals') {
            $query->where($column, '!=', $value);
            return;
        }

        // Fallback to equality
        $query->where($column, $value);
    }

    protected function applyNumericFilter(Builder $query, string $column, string $operator, mixed $value): void
    {
        switch ($operator) {
            case 'between':
                $min = is_array($value) ? ($value['min'] ?? null) : null;
                $max = is_array($value) ? ($value['max'] ?? null) : null;
                if ($min !== null && $max !== null) {
                    $query->whereBetween($column, [(float) $min, (float) $max]);
                }
                break;
            case 'greater_than':
                $query->where($column, '>', (float) $value);
                break;
            case 'less_than':
                $query->where($column, '<', (float) $value);
                break;
            case 'equals':
            default:
                $query->where($column, '=', (float) $value);
                break;
        }
    }
}
