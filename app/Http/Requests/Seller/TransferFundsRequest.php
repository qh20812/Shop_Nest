<?php

namespace App\Http\Requests\Seller;

use App\Models\SellerPromotionWallet;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class TransferFundsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isSeller() ?? false;
    }

    public function rules(): array
    {
        return [
            'from_wallet_id' => ['required', 'integer', 'exists:seller_promotion_wallets,wallet_id'],
            'to_wallet_id' => ['required', 'integer', 'different:from_wallet_id', 'exists:seller_promotion_wallets,wallet_id'],
            'amount' => ['required', 'numeric', 'min:1000'],
            'description' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $sellerId = $this->user()?->id;
            $fromWalletId = (int) $this->input('from_wallet_id');
            $toWalletId = (int) $this->input('to_wallet_id');

            if (!$sellerId || !$fromWalletId || !$toWalletId) {
                return;
            }

            $wallets = SellerPromotionWallet::query()
                ->whereIn('wallet_id', [$fromWalletId, $toWalletId])
                ->get()
                ->keyBy('wallet_id');

            if ($wallets->count() < 2) {
                return;
            }

            if ((int) $wallets[$fromWalletId]->seller_id !== $sellerId || (int) $wallets[$toWalletId]->seller_id !== $sellerId) {
                $validator->errors()->add('from_wallet_id', 'You can only transfer between your own wallets.');
            }

            if ($wallets[$fromWalletId]->status !== 'active' || $wallets[$toWalletId]->status !== 'active') {
                $validator->errors()->add('from_wallet_id', 'Both wallets must be active.');
            }
        });
    }
}
