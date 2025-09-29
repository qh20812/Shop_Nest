<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePromotionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Assuming admin middleware handles authorization
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255|min:3',
            'description' => 'nullable|string|max:1000',
            'type' => 'required|in:percentage,fixed_amount,free_shipping,buy_x_get_y',
            'value' => 'required|numeric|min:0',
            'minimum_order_value' => 'nullable|numeric|min:0',
            'max_discount_amount' => 'nullable|numeric|min:0',
            'starts_at' => [
                'required',
                'date',
                // Allow current start date or future dates only
                Rule::when(
                    $this->route('promotion')->start_date->isFuture(),
                    'after_or_equal:today',
                    'after_or_equal:' . $this->route('promotion')->start_date->format('Y-m-d')
                )
            ],
            'expires_at' => 'required|date|after:starts_at',
            'usage_limit_per_user' => 'nullable|integer|min:1',
            'is_active' => 'boolean',
            
            // Condition arrays
            'product_ids' => 'nullable|array',
            'product_ids.*' => 'exists:products,id',
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'exists:categories,id',
        ];
    }

    /**
     * Get custom validation messages.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'The promotion name is required.',
            'type.required' => 'The promotion type is required.',
            'type.in' => 'The selected promotion type is invalid.',
            'value.required' => 'The promotion value is required.',
            'value.numeric' => 'The promotion value must be a number.',
            'starts_at.required' => 'The start date is required.',
            'starts_at.after_or_equal' => 'The start date cannot be in the past.',
            'expires_at.required' => 'The expiry date is required.',
            'expires_at.after' => 'The expiry date must be after the start date.',
            'product_ids.*.exists' => 'One or more selected products are invalid.',
            'category_ids.*.exists' => 'One or more selected categories are invalid.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'starts_at' => 'start date',
            'expires_at' => 'expiry date',
            'usage_limit_per_user' => 'usage limit per user',
            'minimum_order_value' => 'minimum order value',
            'max_discount_amount' => 'maximum discount amount',
            'product_ids' => 'products',
            'category_ids' => 'categories',
        ];
    }
}
