<?php

namespace App\Services;

use App\Models\Promotion;
use App\Models\PromotionAuditLog;
use App\Traits\AuditLoggable;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Request;

class PromotionBulkService
{
    use AuditLoggable;
    private PromotionConflictResolver $conflictResolver;

    public function __construct(PromotionConflictResolver $conflictResolver)
    {
        $this->conflictResolver = $conflictResolver;
    }

    /**
     * Bulk activate multiple promotions
     */
    public function bulkActivate(array $promotionIds): array
    {
        $updated = 0;
        $errors = [];
        $activatedPromotions = [];

        foreach ($promotionIds as $id) {
            try {
                $promotion = Promotion::findOrFail($id);
                if (!$promotion->is_active) {
                    $oldValues = ['is_active' => $promotion->is_active];
                    $promotion->is_active = true;
                    $promotion->save();
                    $this->logAudit('activated', $promotion, $oldValues, ['is_active' => true]);
                    $updated++;
                    $activatedPromotions[] = $promotion;
                }
            } catch (Exception $e) {
                $errors[] = "Failed to activate promotion ID {$id}: " . $e->getMessage();
            }
        }

        // Handle conflicts for activated promotions
        foreach ($activatedPromotions as $promotion) {
            $promotion->refresh();
            $this->conflictResolver->handlePromotionConflicts($promotion);
        }

        return [
            'success' => true,
            'updated_count' => $updated,
            'errors' => $errors,
            'message' => "Successfully activated {$updated} promotions.",
        ];
    }

    /**
     * Bulk deactivate multiple promotions
     */
    public function bulkDeactivate(array $promotionIds): array
    {
        $updated = 0;
        $errors = [];

        foreach ($promotionIds as $id) {
            try {
                $promotion = Promotion::findOrFail($id);
                if ($promotion->is_active) {
                    $oldValues = ['is_active' => $promotion->is_active];
                    $promotion->is_active = false;
                    $promotion->save();
                    $this->logAudit('deactivated', $promotion, $oldValues, ['is_active' => false]);
                    $updated++;
                }
            } catch (Exception $e) {
                $errors[] = "Failed to deactivate promotion ID {$id}: " . $e->getMessage();
            }
        }

        return [
            'success' => true,
            'updated_count' => $updated,
            'errors' => $errors,
            'message' => "Successfully deactivated {$updated} promotions.",
        ];
    }

    /**
     * Bulk delete multiple promotions
     */
    public function bulkDelete(array $promotionIds): array
    {
        $deleted = 0;
        $errors = [];

        DB::transaction(function () use ($promotionIds, &$deleted, &$errors) {
            foreach ($promotionIds as $id) {
                try {
                    $promotion = Promotion::findOrFail($id);
                    $this->logAudit('deleted', $promotion, $promotion->toArray(), []);
                    $promotion->delete();
                    $deleted++;
                } catch (Exception $e) {
                    $errors[] = "Failed to delete promotion ID {$id}: " . $e->getMessage();
                }
            }
        });

        return [
            'success' => true,
            'deleted_count' => $deleted,
            'errors' => $errors,
            'message' => "Successfully deleted {$deleted} promotions.",
        ];
    }

    /**
     * Bulk duplicate promotions
     */
    public function bulkDuplicate(Promotion $sourcePromotion, int $count, string $namePrefix = 'Copy of '): array
    {
        $created = 0;
        $errors = [];

        DB::transaction(function () use ($sourcePromotion, $count, $namePrefix, &$created, &$errors) {
            for ($i = 1; $i <= $count; $i++) {
                try {
                    $newPromotion = $sourcePromotion->replicate();
                    $newPromotion->name = $namePrefix . $sourcePromotion->name . " ({$i})";
                    $newPromotion->is_active = false; // Start as inactive
                    $newPromotion->used_count = 0;
                    $newPromotion->budget_used = 0;
                    $newPromotion->daily_usage_count = 0;
                    $newPromotion->last_used_at = null;
                    $newPromotion->save();

                    // Sync relationships
                    $this->syncRelationships($newPromotion, $sourcePromotion);

                    $created++;
                } catch (Exception $e) {
                    $errors[] = "Failed to create copy {$i}: " . $e->getMessage();
                }
            }
        });

        return [
            'success' => true,
            'created_count' => $created,
            'errors' => $errors,
            'message' => "Successfully created {$created} copies of the promotion.",
        ];
    }

    /**
     * Sync relationships from source to target promotion
     */
    private function syncRelationships(Promotion $targetPromotion, Promotion $sourcePromotion): void
    {
        $productIds = $sourcePromotion->products->pluck('product_id')->toArray();
        $categoryIds = $sourcePromotion->categories->pluck('category_id')->toArray();

        $productIds = array_values(array_unique(array_filter($productIds, static function ($id) {
            return $id !== null && $id !== '';
        })));
        $categoryIds = array_values(array_unique(array_filter($categoryIds, static function ($id) {
            return $id !== null && $id !== '';
        })));

        if (\Illuminate\Support\Facades\Schema::hasTable('promotion_products')) {
            $targetPromotion->products()->sync($productIds);
        }

        if (\Illuminate\Support\Facades\Schema::hasTable('promotion_categories')) {
            $targetPromotion->categories()->sync($categoryIds);
        }
    }
}