<?php

namespace App\Http\Requests\Wallet;

use Illuminate\Foundation\Http\FormRequest;

class StoreWalletTopupRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'amount' => [
                'required',
                'numeric',
                'min:'.(float) config('wallet.topup.min_amount', 10000),
                'max:'.(float) config('wallet.topup.max_amount', 50000000),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'amount.min' => 'The minimum top-up amount is '.number_format((float) config('wallet.topup.min_amount', 10000), 0, ',', '.').' VND.',
            'amount.max' => 'The maximum top-up amount is '.number_format((float) config('wallet.topup.max_amount', 50000000), 0, ',', '.').' VND.',
        ];
    }
}
