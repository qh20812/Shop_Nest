<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PaymentReturnRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Payment returns are public callbacks
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'order_id' => 'sometimes|integer|min:1',
            'status' => 'sometimes|string|in:success,succeeded,cancel,canceled,failed',
            'token' => 'sometimes|string',
            'PayerID' => 'sometimes|string',
            'payment_intent' => 'sometimes|string',
            'session_id' => 'sometimes|string',
        ];
    }
}
