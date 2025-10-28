<?php

namespace App\Http\Controllers\Admin\Concerns;

use App\Exceptions\InventoryException;
use App\Models\ProductVariant;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

trait InventoryCrudTrait
{
    /**
     * Handle stock increases for a single variant.
     */
    public function store(Request $request): RedirectResponse
    {
        $this->authorize('manageInventory', ProductVariant::class);

        $validated = $request->validate([
            'variant_id' => 'required|exists:product_variants,variant_id',
            'quantity' => 'required|integer|min:1',
            'reason' => 'required|string|max:255',
        ]);

        try {
            $this->inventoryService->adjustStock(
                (int) $validated['variant_id'],
                (int) $validated['quantity'],
                __('Stock In: :reason', ['reason' => $this->formatReason($validated['reason'])])
            );
            $this->invalidateInventoryReportCache();
        } catch (InventoryException | ModelNotFoundException $exception) {
            return back()->withErrors(['general' => $exception->getMessage()]);
        }

    return back()->with('success', $this->successMessage());
    }

    /**
     * Handle stock decreases for a single variant.
     */
    public function stockOut(Request $request): RedirectResponse
    {
        $this->authorize('manageInventory', ProductVariant::class);

        $validated = $request->validate([
            'variant_id' => 'required|exists:product_variants,variant_id',
            'quantity' => 'required|integer|min:1',
            'reason' => 'required|string|max:255',
        ]);

        $variant = ProductVariant::find((int) $validated['variant_id']);
        if (! $variant) {
            return back()->withErrors(['variant_id' => __('The selected variant could not be found.')]);
        }

        if ($variant->stock_quantity < (int) $validated['quantity']) {
            return back()->withErrors(['quantity' => __('Cannot stock out more than the available quantity (:quantity).', ['quantity' => $variant->stock_quantity])]);
        }

        try {
            $this->inventoryService->adjustStock(
                (int) $validated['variant_id'],
                -abs((int) $validated['quantity']),
                __('Stock Out: :reason', ['reason' => $this->formatReason($validated['reason'])])
            );
            $this->invalidateInventoryReportCache();
        } catch (InventoryException $exception) {
            return back()->withErrors(['general' => $exception->getMessage()]);
        }

    return back()->with('success', $this->successMessage());
    }

    /**
     * Set stock level to a specific quantity for a variant.
     */
    public function update(Request $request, int $variantId): RedirectResponse
    {
        $this->authorize('manageInventory', ProductVariant::class);

        $validated = $request->validate([
            'new_quantity' => 'required|integer|min:0',
            'reason' => 'required|string|max:255',
        ]);

        try {
            $this->inventoryService->setStock(
                $variantId,
                (int) $validated['new_quantity'],
                __('Adjustment: :reason', ['reason' => $this->formatReason($validated['reason'])])
            );
            $this->invalidateInventoryReportCache();
        } catch (InventoryException $exception) {
            return back()->withErrors(['general' => $exception->getMessage()]);
        }

    return back()->with('success', $this->successMessage());
    }

    /**
     * Bulk adjust stock levels for multiple variants with pre-validation.
     */
    public function bulkUpdate(Request $request): RedirectResponse
    {
        $this->authorize('manageInventory', ProductVariant::class);

        $validated = $request->validate([
            'reason' => 'required|string|max:255',
            'adjustments' => 'required|array|min:1',
            'adjustments.*.variant_id' => 'required|distinct|exists:product_variants,variant_id',
            'adjustments.*.quantity_change' => 'required|integer',
        ]);

        $adjustments = collect($validated['adjustments'])
            ->map(fn (array $adjustment): array => [
                'variant_id' => (int) $adjustment['variant_id'],
                'quantity_change' => (int) $adjustment['quantity_change'],
            ]);

        $variants = ProductVariant::whereIn('variant_id', $adjustments->pluck('variant_id'))
            ->get()
            ->keyBy('variant_id');

        $errors = $this->validateBulkAdjustments($adjustments, $variants);
        if (! empty($errors)) {
            return back()->withErrors($errors);
        }

        try {
            $this->inventoryService->bulkAdjust($adjustments->toArray(), $this->formatReason($validated['reason']));
            $this->invalidateInventoryReportCache();
        } catch (InventoryException | ModelNotFoundException $exception) {
            return back()->withErrors(['general' => $exception->getMessage()]);
        }

    return back()->with('success', $this->successMessage());
    }

    /**
     * Ensure bulk adjustments do not drop any variant below zero.
     */
    private function validateBulkAdjustments(Collection $adjustments, Collection $variants): array
    {
        $errors = [];

        foreach ($adjustments as $index => $adjustment) {
            $variant = $variants->get($adjustment['variant_id']);
            if (! $variant) {
                $errors["adjustments.{$index}.variant_id"] = __('The selected variant could not be found.');
                continue;
            }

            $projected = $variant->stock_quantity + $adjustment['quantity_change'];
            if ($projected < 0) {
                $errors["adjustments.{$index}.quantity_change"] = __('Adjustment for variant :variant would result in negative stock.', ['variant' => $variant->sku ?? $variant->variant_id]);
            }
        }

        return $errors;
    }

    /**
     * Normalize the provided reason string.
     */
    private function formatReason(string $reason): string
    {
        return trim($reason);
    }

    /**
     * Helper to invalidate cached inventory reporting data.
     */
    private function invalidateInventoryReportCache(): void
    {
        $this->reportService->invalidateCache();
    }

    /**
     * Standard success message expected by existing UI/tests.
     */
    private function successMessage(): string
    {
        return __('Cập nhật tồn kho thành công.');
    }
}
