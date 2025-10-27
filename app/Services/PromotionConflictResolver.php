<?php

namespace App\Services;

use App\Models\Promotion;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

class PromotionConflictResolver
{
    private const PRIORITY_WEIGHTS = [
        'low' => 1,
        'medium' => 2,
        'high' => 3,
        'urgent' => 4,
    ];

    /**
     * Handle promotion conflicts for a given promotion
     */
    public function handlePromotionConflicts(?Promotion $promotion): void
    {
        if (!$promotion) {
            return;
        }

        $promotion->loadMissing('products:product_id', 'categories:category_id');

        $windowEnd = Carbon::parse($promotion->end_date);
        if (!$promotion->is_active && $windowEnd->isPast()) {
            return;
        }

        $conflictSnapshot = $this->detectConflicts($promotion);

        if (empty($conflictSnapshot['items'])) {
            return;
        }

        $resolution = $this->resolveConflicts($promotion, $conflictSnapshot['items']);
        $this->flashConflictNotifications($promotion, $resolution);

        foreach ($resolution['log_entries'] as $entry) {
            Log::warning($entry['message'], $entry['context']);
        }
    }

    /**
     * Detect conflicts for a promotion
     */
    public function detectConflicts(Promotion $promotion): array
    {
        $promotionTargets = $this->getTargetsForPromotion($promotion);

        $candidates = Promotion::query()
            ->with(['products:product_id', 'categories:category_id'])
            ->where('promotion_id', '!=', $promotion->promotion_id)
            ->whereNull('deleted_at')
            ->where(function ($query) use ($promotion) {
                $query->whereBetween('start_date', [$promotion->start_date, $promotion->end_date])
                    ->orWhereBetween('end_date', [$promotion->start_date, $promotion->end_date])
                    ->orWhere(function ($inner) use ($promotion) {
                        $inner->where('start_date', '<=', $promotion->start_date)
                            ->where('end_date', '>=', $promotion->end_date);
                    });
            })
            ->get();

        $items = [];

        foreach ($candidates as $candidate) {
            if (!$this->timeRangesOverlap($promotion, $candidate)) {
                continue;
            }

            $candidateTargets = $this->getTargetsForPromotion($candidate);
            $targetOverlap = $this->targetsOverlap($promotionTargets, $candidateTargets);

            if (!$targetOverlap['overlap']) {
                continue;
            }

            $conflictPair = collect([$promotion, $candidate]);
            $stackableAllowed = $this->validateStackableRules($conflictPair);

            $items[] = [
                'promotion' => $candidate,
                'targets' => $targetOverlap,
                'stackable_allowed' => $stackableAllowed,
                'priority_delta' => $this->comparePriority($promotion->priority, $candidate->priority),
                'time_overlap' => [
                    'start' => $this->getOverlapBoundary($promotion->start_date, $candidate->start_date, 'max'),
                    'end' => $this->getOverlapBoundary($promotion->end_date, $candidate->end_date, 'min'),
                ],
            ];
        }

        return [
            'items' => $items,
            'count' => count($items),
        ];
    }

    /**
     * Resolve conflicts and generate suggestions
     */
    public function resolveConflicts(Promotion $promotion, array $conflicts): array
    {
        $suggestions = [];
        $logEntries = [];
        $requiresManualReview = false;
        $summaries = [];

        foreach ($conflicts as $conflict) {
            /** @var Promotion $other */
            $other = $conflict['promotion'];
            $overlapDescription = $this->describeOverlap($conflict['targets']);
            $stackableAllowed = $conflict['stackable_allowed'];
            $priorityDelta = $conflict['priority_delta'];

            if (!$stackableAllowed) {
                if ($priorityDelta >= 0) {
                    $suggestions[] = sprintf(
                        'Pause promotion #%d "%s" while #%d "%s" is active to avoid non-stackable overlap on %s.',
                        $other->promotion_id,
                        $other->name,
                        $promotion->promotion_id,
                        $promotion->name,
                        $overlapDescription
                    );
                } else {
                    $requiresManualReview = true;
                    $suggestions[] = sprintf(
                        'Consider pausing promotion #%d "%s" or adjusting schedule because higher-priority promotion #%d "%s" overlaps on %s.',
                        $promotion->promotion_id,
                        $promotion->name,
                        $other->promotion_id,
                        $other->name,
                        $overlapDescription
                    );
                }
            } else {
                $suggestions[] = sprintf(
                    'Monitor combined impact of promotion #%d "%s" and #%d "%s"; both are stackable on %s.',
                    $promotion->promotion_id,
                    $promotion->name,
                    $other->promotion_id,
                    $other->name,
                    $overlapDescription
                );
            }

            $logEntries[] = [
                'message' => 'Promotion conflict detected',
                'context' => [
                    'primary_promotion_id' => $promotion->promotion_id,
                    'conflicting_promotion_id' => $other->promotion_id,
                    'stackable_allowed' => $stackableAllowed,
                    'priority_delta' => $priorityDelta,
                    'overlap' => $conflict['targets'],
                    'time_overlap' => $conflict['time_overlap'],
                ],
            ];

            $summaries[] = [
                'promotion_id' => $other->promotion_id,
                'name' => $other->name,
                'stackable_allowed' => $stackableAllowed,
                'priority_delta' => $priorityDelta,
                'targets' => $conflict['targets'],
                'time_overlap' => $conflict['time_overlap'],
            ];
        }

        return [
            'conflicts' => $summaries,
            'suggestions' => array_values(array_unique($suggestions)),
            'requires_manual_review' => $requiresManualReview,
            'log_entries' => $logEntries,
        ];
    }

    /**
     * Validate if promotions can be stacked
     */
    public function validateStackableRules(Collection $promotions): bool
    {
        $nonStackableCount = $promotions->filter(function (Promotion $promotion) {
            return !$promotion->stackable;
        })->count();

        return $nonStackableCount <= 1;
    }

    /**
     * Get targets for a promotion
     */
    private function getTargetsForPromotion(Promotion $promotion): array
    {
        $products = $promotion->products->pluck('product_id')->map(fn ($id) => (int) $id)->values()->all();
        $categories = $promotion->categories->pluck('category_id')->map(fn ($id) => (int) $id)->values()->all();

        return [
            'products' => $products,
            'categories' => $categories,
            'global' => empty($products) && empty($categories),
        ];
    }

    /**
     * Check if targets overlap
     */
    private function targetsOverlap(array $primaryTargets, array $otherTargets): array
    {
        $productOverlap = array_values(array_intersect($primaryTargets['products'], $otherTargets['products']));
        $categoryOverlap = array_values(array_intersect($primaryTargets['categories'], $otherTargets['categories']));

        $globalOverlap = $primaryTargets['global'] || $otherTargets['global'];
        $hasOverlap = $globalOverlap || !empty($productOverlap) || !empty($categoryOverlap);

        return [
            'overlap' => $hasOverlap,
            'products' => $productOverlap,
            'categories' => $categoryOverlap,
            'global' => $globalOverlap,
        ];
    }

    /**
     * Check if time ranges overlap
     */
    private function timeRangesOverlap(Promotion $primary, Promotion $other): bool
    {
        $primaryStart = Carbon::parse($primary->start_date);
        $primaryEnd = Carbon::parse($primary->end_date);
        $otherStart = Carbon::parse($other->start_date);
        $otherEnd = Carbon::parse($other->end_date);

        return $primaryStart <= $otherEnd && $otherStart <= $primaryEnd;
    }

    /**
     * Get overlap boundary
     */
    private function getOverlapBoundary($primaryDate, $otherDate, string $mode): string
    {
        $primary = Carbon::parse($primaryDate);
        $other = Carbon::parse($otherDate);

        if ($mode === 'max') {
            return ($primary->greaterThan($other) ? $primary : $other)->toDateTimeString();
        }

        return ($primary->lessThan($other) ? $primary : $other)->toDateTimeString();
    }

    /**
     * Compare priority between two promotions
     */
    private function comparePriority(?string $primaryPriority, ?string $otherPriority): int
    {
        $primaryWeight = $this->getPriorityWeight($primaryPriority);
        $otherWeight = $this->getPriorityWeight($otherPriority);

        return $primaryWeight <=> $otherWeight;
    }

    /**
     * Get priority weight
     */
    private function getPriorityWeight(?string $priority): int
    {
        $normalized = $priority ? strtolower($priority) : 'medium';

        return self::PRIORITY_WEIGHTS[$normalized] ?? self::PRIORITY_WEIGHTS['medium'];
    }

    /**
     * Describe overlap in human readable format
     */
    private function describeOverlap(array $targets): string
    {
        if (!empty($targets['global'])) {
            return 'the entire catalog';
        }

        if (!empty($targets['products'])) {
            $sample = array_slice($targets['products'], 0, 5);
            $label = implode(', ', $sample);

            return count($targets['products']) > 5 ? "products {$label}, ..." : "products {$label}";
        }

        if (!empty($targets['categories'])) {
            $sample = array_slice($targets['categories'], 0, 5);
            $label = implode(', ', $sample);

            return count($targets['categories']) > 5 ? "categories {$label}, ..." : "categories {$label}";
        }

        return 'unspecified targets';
    }

    /**
     * Flash conflict notifications to session
     */
    private function flashConflictNotifications(Promotion $promotion, array $resolution): void
    {
        if (empty($resolution['suggestions'])) {
            return;
        }

        $payload = [
            'promotion_id' => $promotion->promotion_id,
            'promotion_name' => $promotion->name,
            'requires_manual_review' => $resolution['requires_manual_review'],
            'suggestions' => $resolution['suggestions'],
            'conflicts' => $resolution['conflicts'],
        ];

        if (app()->bound('session')) {
            session()->flash('promotion_conflicts', $payload);
        }
    }
}