<?php

namespace App\Http\Requests\Seller;

use App\Services\SellerPromotionService;
use App\Services\SellerWalletService;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class UpdateSellerPromotionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isSeller() ?? false;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string', 'max:1000'],
            'type' => ['sometimes', 'in:percentage,fixed_amount,free_shipping,buy_x_get_y'],
            'value' => ['sometimes', 'numeric', 'min:0'],
            'product_ids' => ['sometimes', 'array', 'min:1', 'max:50'],
            'product_ids.*' => ['integer', 'exists:products,product_id'],
            'allocated_budget' => ['nullable', 'numeric', 'min:0'],
            'min_order_amount' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'max_discount_amount' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'start_date' => ['sometimes', 'date'],
            'end_date' => ['sometimes', 'date', 'after:start_date'],
            'usage_limit' => ['sometimes', 'nullable', 'integer', 'min:1'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $sellerId = $this->user()?->id;
            $promotion = $this->route('promotion');

            if (!$sellerId || !$promotion) {
                return;
            }

            $type = (string) $this->input('type', $promotion->type);
            $value = (float) $this->input('value', $promotion->value);

            if ($type === 'percentage' && $value > 100) {
                $validator->errors()->add('value', 'Percentage discounts cannot exceed 100%.');
            }

            if ($this->filled('product_ids')) {
                $promotionService = app(SellerPromotionService::class);
                $productIds = $this->input('product_ids', []);
                if (!$promotionService->validateSellerOwnership($productIds, $sellerId)) {
                    $validator->errors()->add('product_ids', 'You can only assign products you own.');
                }
            }

            if ($this->has('allocated_budget')) {
                $newBudget = (float) $this->input('allocated_budget', 0);
                if ($newBudget < (float) ($promotion->spent_budget ?? 0)) {
                    $validator->errors()->add('allocated_budget', 'Allocated budget cannot be less than the amount already spent.');
                    return;
                }

                $currentAllocated = (float) ($promotion->allocated_budget ?? 0);
                $difference = $newBudget - $currentAllocated;

                if ($difference > 0) {
                    $walletService = app(SellerWalletService::class);
                    $wallet = $walletService->getWallet($sellerId);

                    if ($wallet->status !== 'active') {
                        $validator->errors()->add('allocated_budget', 'Your wallet is not active.');
                        return;
                    }

                    if ($wallet->balance < $difference) {
                        $validator->errors()->add('allocated_budget', 'Insufficient wallet balance for the requested increase.');
                    }
                }
            }
        });
    }
}
