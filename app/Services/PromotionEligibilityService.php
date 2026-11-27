<?php

namespace App\Services;

use App\Models\CartItem;
use App\Models\OrderItem;
use App\Models\ProductVariant;
use App\Models\Promotion;
use Illuminate\Database\Eloquent\Model;

class PromotionEligibilityService
{
    /**
     * Calculate the subtotal of cart/order items the promotion may discount.
     *
     * Promotions without product or category targets apply to the whole cart.
     * Targeted promotions only discount matching products/categories.
     */
    public function eligibleSubtotal(Promotion $promotion, iterable $items): float
    {
        $productIds = $promotion->products()->pluck('products.product_id')->map(fn ($id) => (int) $id)->all();
        $categoryIds = $promotion->categories()->pluck('categories.category_id')->map(fn ($id) => (int) $id)->all();

        $hasTargets = $productIds !== [] || $categoryIds !== [];
        $subtotal = 0.0;

        foreach ($items as $item) {
            $row = $this->normalizeItem($item);

            if ($row === null) {
                continue;
            }

            if ($hasTargets
                && ! in_array($row['product_id'], $productIds, true)
                && ! in_array($row['category_id'], $categoryIds, true)) {
                continue;
            }

            $subtotal += $row['price'] * $row['quantity'];
        }

        return round($subtotal, 2);
    }

    /**
     * @return array{product_id: int|null, category_id: int|null, price: float, quantity: int}|null
     */
    private function normalizeItem(mixed $item): ?array
    {
        if ($item instanceof CartItem || $item instanceof OrderItem) {
            $variant = $item->variant;
            $product = $variant?->product;

            if (! $variant || ! $product) {
                return null;
            }

            $price = $variant->discount_price !== null && (float) $variant->discount_price > 0
                ? (float) $variant->discount_price
                : (float) $variant->price;

            return [
                'product_id' => (int) $product->product_id,
                'category_id' => $product->category_id !== null ? (int) $product->category_id : null,
                'price' => $price,
                'quantity' => (int) $item->quantity,
            ];
        }

        if (is_array($item)) {
            $variant = $item['variant'] ?? null;
            $product = $variant['product'] ?? null;

            $price = (float) ($item['price'] ?? 0);
            $quantity = (int) ($item['quantity'] ?? 0);

            if ($quantity <= 0 || $price <= 0) {
                return null;
            }

            return [
                'product_id' => isset($product['product_id']) ? (int) $product['product_id'] : null,
                'category_id' => isset($product['category_id']) ? (int) $product['category_id'] : null,
                'price' => $price,
                'quantity' => $quantity,
            ];
        }

        if ($item instanceof Model) {
            $variant = $item->getRelationValue('variant');

            if ($variant instanceof ProductVariant && $variant->product) {
                $price = $variant->discount_price !== null && (float) $variant->discount_price > 0
                    ? (float) $variant->discount_price
                    : (float) $variant->price;

                return [
                    'product_id' => (int) $variant->product->product_id,
                    'category_id' => $variant->product->category_id !== null ? (int) $variant->product->category_id : null,
                    'price' => $price,
                    'quantity' => (int) ($item->quantity ?? 0),
                ];
            }
        }

        return null;
    }
}
