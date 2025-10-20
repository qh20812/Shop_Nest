<?php

namespace App\Http\Requests\Seller;

use App\Services\SellerPromotionService;
use App\Services\SellerWalletService;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreSellerPromotionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isSeller() ?? false;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'type' => ['required', 'in:percentage,fixed_amount,free_shipping,buy_x_get_y'],
            'value' => ['required', 'numeric', 'min:0'],
            'product_ids' => ['required', 'array', 'min:1', 'max:50'],
            'product_ids.*' => ['integer', 'exists:products,product_id'],
            'allocated_budget' => ['required', 'numeric', 'min:0'],
            'min_order_amount' => ['nullable', 'numeric', 'min:0'],
            'max_discount_amount' => ['nullable', 'numeric', 'min:0'],
            'start_date' => ['required', 'date', 'after:now'],
            'end_date' => ['required', 'date', 'after:start_date'],
            'usage_limit' => ['nullable', 'integer', 'min:1'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $sellerId = $this->user()?->id;

            if (!$sellerId) {
                return;
            }

            $type = (string) $this->input('type', 'percentage');
            $value = (float) $this->input('value', 0);

            if ($type === 'percentage' && $value > 100) {
                $validator->errors()->add('value', 'Percentage discounts cannot exceed 100%.');
            }

            $promotionService = app(SellerPromotionService::class);
            $productIds = $this->input('product_ids', []);
            if (!$promotionService->validateSellerOwnership($productIds, $sellerId)) {
                $validator->errors()->add('product_ids', 'You can only create promotions for products you own.');
            }

            $allocatedBudget = (float) $this->input('allocated_budget', 0);
            $walletService = app(SellerWalletService::class);
            $wallet = $walletService->getWallet($sellerId);

            if ($wallet->status !== 'active') {
                $validator->errors()->add('allocated_budget', 'Your wallet is not active.');
                return;
            }

            if ($wallet->balance < $allocatedBudget) {
                $validator->errors()->add('allocated_budget', 'Insufficient wallet balance.');
            }
        });
    }
}
