<?php

namespace App\Services;

use App\Models\Promotion;
use App\Models\PromotionTemplate;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PromotionTemplateService
{
    /**
     * Get available promotion templates
     */
    public function getTemplates(): array
    {
        // Get built-in templates
        $builtInTemplates = Cache::remember('promotion_templates', 3600, function () {
            return [
                [
                    'id' => 'seasonal_black_friday',
                    'name' => 'Black Friday Sale',
                    'description' => 'High-discount percentage promotion for Black Friday',
                    'type' => 'percentage',
                    'value' => 50,
                    'min_order_amount' => 500000,
                    'max_discount_amount' => 1000000,
                    'usage_limit' => 1000,
                    'priority' => 'high',
                    'stackable' => false,
                    'category' => 'seasonal',
                    'is_public' => true,
                ],
                [
                    'id' => 'seasonal_christmas',
                    'name' => 'Christmas Special',
                    'description' => 'Fixed amount discount for Christmas season',
                    'type' => 'fixed_amount',
                    'value' => 100000,
                    'min_order_amount' => 200000,
                    'usage_limit' => 500,
                    'priority' => 'high',
                    'stackable' => true,
                    'category' => 'seasonal',
                    'is_public' => true,
                ],
                [
                    'id' => 'category_electronics',
                    'name' => 'Electronics Category Discount',
                    'description' => 'Percentage discount for electronics category',
                    'type' => 'percentage',
                    'value' => 15,
                    'min_order_amount' => 100000,
                    'priority' => 'medium',
                    'stackable' => true,
                    'category' => 'category',
                    'is_public' => true,
                ],
                [
                    'id' => 'new_customer_welcome',
                    'name' => 'New Customer Welcome',
                    'description' => 'Special discount for first-time customers',
                    'type' => 'percentage',
                    'value' => 20,
                    'first_time_customer_only' => true,
                    'usage_limit' => 1,
                    'priority' => 'medium',
                    'stackable' => false,
                    'category' => 'customer',
                    'is_public' => true,
                ],
                [
                    'id' => 'loyalty_reward',
                    'name' => 'Loyalty Reward',
                    'description' => 'Discount for loyal customers',
                    'type' => 'fixed_amount',
                    'value' => 50000,
                    'min_order_amount' => 300000,
                    'priority' => 'low',
                    'stackable' => true,
                    'category' => 'loyalty',
                    'is_public' => true,
                ],
                [
                    'id' => 'flash_sale',
                    'name' => 'Flash Sale',
                    'description' => 'Short-term high discount promotion',
                    'type' => 'percentage',
                    'value' => 70,
                    'usage_limit' => 100,
                    'daily_usage_limit' => 50,
                    'priority' => 'urgent',
                    'stackable' => false,
                    'category' => 'flash',
                    'is_public' => true,
                ],
            ];
        });

        // Get custom templates from database
        $customTemplates = PromotionTemplate::public()
            ->with('creator')
            ->get()
            ->map(function ($template) {
                return [
                    'id' => 'db_' . $template->template_id,
                    'name' => $template->name,
                    'description' => $template->description,
                    'type' => $template->type,
                    'value' => $template->value,
                    'config' => $template->config,
                    'category' => $template->category,
                    'is_public' => $template->is_public,
                    'created_by' => $template->creator?->name,
                    'created_at' => $template->created_at,
                    'is_custom' => true,
                ];
            })
            ->toArray();

        return array_merge($builtInTemplates, $customTemplates);
    }

    /**
     * Create promotion from template
     */
    public function createFromTemplate(array $requestData): Promotion
    {
        $templates = $this->getTemplates();
        $template = collect($templates)->firstWhere('id', $requestData['template_id']);

        if (!$template) {
            throw new Exception('Template not found.');
        }

        try {
            $promotion = null;

            DB::transaction(function () use (&$promotion, $requestData, $template) {
                // Extract config for custom templates
                $config = $template['config'] ?? [];

                $promotion = Promotion::create([
                    'name' => $requestData['name'],
                    'description' => $requestData['description'] ?? $template['description'],
                    'type' => $this->mapTypeForStorage($template['type']),
                    'value' => $template['value'],
                    'min_order_amount' => $template['min_order_amount'] ?? $config['min_order_amount'] ?? null,
                    'max_discount_amount' => $template['max_discount_amount'] ?? $config['max_discount_amount'] ?? null,
                    'start_date' => $requestData['starts_at'],
                    'end_date' => $requestData['expires_at'],
                    'usage_limit' => $template['usage_limit'] ?? $config['usage_limit'] ?? null,
                    'used_count' => 0,
                    'is_active' => false, // Start inactive for review
                    'priority' => $template['priority'] ?? $config['priority'] ?? 'medium',
                    'stackable' => $template['stackable'] ?? $config['stackable'] ?? false,
                    'first_time_customer_only' => $template['first_time_customer_only'] ?? $config['first_time_customer_only'] ?? false,
                    'daily_usage_limit' => $template['daily_usage_limit'] ?? $config['daily_usage_limit'] ?? null,
                    'daily_usage_count' => 0,
                    'budget_used' => 0,
                    'budget_limit' => $config['budget_limit'] ?? null,
                ]);

                // Sync relationships if provided
                if (!empty($requestData['product_ids']) || !empty($requestData['category_ids'])) {
                    $this->syncRelationships($promotion, $requestData['product_ids'] ?? [], $requestData['category_ids'] ?? []);
                }
            });

            if (!$promotion) {
                throw new Exception('Failed to create promotion from template');
            }

            return $promotion;
        } catch (Exception $exception) {
            Log::error('Failed to create promotion from template', ['exception' => $exception]);
            throw $exception;
        }
    }

    /**
     * Save current promotion as template
     */
    public function saveAsTemplate(Promotion $promotion, array $requestData): array
    {
        $template = PromotionTemplate::create([
            'name' => $requestData['template_name'],
            'description' => $requestData['description'] ?? $promotion->description,
            'type' => $this->resolveTypeForResponse($promotion->type),
            'value' => $promotion->value,
            'config' => [
                'min_order_amount' => $promotion->min_order_amount,
                'max_discount_amount' => $promotion->max_discount_amount,
                'usage_limit' => $promotion->usage_limit,
                'priority' => $promotion->priority ?? 'medium',
                'stackable' => $promotion->stackable ?? false,
                'first_time_customer_only' => $promotion->first_time_customer_only ?? false,
                'daily_usage_limit' => $promotion->daily_usage_limit,
                'budget_limit' => $promotion->budget_limit,
            ],
            'category' => 'custom',
            'is_public' => $requestData['is_public'] ?? false,
            'created_by' => Auth::id(),
        ]);

        return $template->toArray();
    }

    /**
     * Get custom templates from database
     */
    public function getCustomTemplates(): array
    {
        return PromotionTemplate::with('creator')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($template) {
                return [
                    'id' => 'db_' . $template->template_id,
                    'name' => $template->name,
                    'description' => $template->description,
                    'type' => $template->type,
                    'value' => $template->value,
                    'config' => $template->config,
                    'category' => $template->category,
                    'is_public' => $template->is_public,
                    'created_by' => $template->creator?->name,
                    'created_at' => $template->created_at,
                    'is_custom' => true,
                ];
            })
            ->toArray();
    }

    /**
     * Map type for storage
     */
    private function mapTypeForStorage(string $type): int
    {
        $typeMap = [
            'percentage' => 1,
            'fixed_amount' => 2,
            'free_shipping' => 3,
            'buy_x_get_y' => 4,
        ];

        if (!array_key_exists($type, $typeMap)) {
            throw new Exception('The selected promotion type is not supported.');
        }

        return $typeMap[$type];
    }

    /**
     * Resolve type for response
     */
    private function resolveTypeForResponse(int|string|null $type): string
    {
        if (is_numeric($type)) {
            $reversed = array_flip([
                'percentage' => 1,
                'fixed_amount' => 2,
                'free_shipping' => 3,
                'buy_x_get_y' => 4,
            ]);
            return $reversed[(int) $type] ?? 'percentage';
        }
        return $type ? (string) $type : 'percentage';
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

        if (\Illuminate\Support\Facades\Schema::hasTable('promotion_products')) {
            $promotion->products()->sync($productIds);
        }

        if (\Illuminate\Support\Facades\Schema::hasTable('promotion_categories')) {
            $promotion->categories()->sync($categoryIds);
        }
    }
}