<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StorePromotionRequest extends FormRequest
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
            'value' => 'required|numeric|min:0.01',
            'minimum_order_value' => 'nullable|numeric|min:0',
            'max_discount_amount' => 'nullable|numeric|min:0',
            'starts_at' => 'required|date|after_or_equal:today',
            'expires_at' => 'required|date|after:starts_at',
            'usage_limit_per_user' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
            
            // Condition arrays
            'product_ids' => 'nullable|array',
            'product_ids.*' => 'exists:products,product_id',
            'category_ids' => 'nullable|array', 
            'category_ids.*' => 'exists:categories,category_id',
            'selection_rules' => 'nullable|array',
            'selection_rules.*.type' => 'required_with:selection_rules|string|in:price_range,brand,category,seller',
            'selection_rules.*.operator' => 'nullable|string|in:equals,contains,between,greater_than,less_than',
            'selection_rules.*.value' => 'required_with:selection_rules',
            'auto_apply_new_products' => 'boolean',
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $data = $this->all();

            if (($data['type'] ?? null) === 'percentage' && isset($data['value']) && (float) $data['value'] > 100) {
                $validator->errors()->add('value', __('The promotion value cannot exceed 100% for percentage discounts.'));
            }

            if (isset($data['usage_limit_per_user']) && $data['usage_limit_per_user'] !== null && (int) $data['usage_limit_per_user'] < 0) {
                $validator->errors()->add('usage_limit_per_user', __('The usage limit per user must be zero or greater.'));
            }
        });
    }

    /**
     * Get custom validation messages.
     */
    public function messages(): array
    {
        return [
            'name.required' => __('The promotion name is required.'),
            'type.required' => __('The promotion type is required.'),
            'type.in' => __('The selected promotion type is invalid.'),
            'value.required' => __('The promotion value is required.'),
            'value.numeric' => __('The promotion value must be a number.'),
            'starts_at.required' => __('The start date is required.'),
            'starts_at.after_or_equal' => __('The start date must be today or later.'),
            'expires_at.required' => __('The expiry date is required.'),
            'expires_at.after' => __('The expiry date must be after the start date.'),
            'product_ids.*.exists' => __('One or more selected products are invalid.'),
            'category_ids.*.exists' => __('One or more selected categories are invalid.'),
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'starts_at' => __('start date'),
            'expires_at' => __('expiry date'),
            'usage_limit_per_user' => __('usage limit per user'),
            'minimum_order_value' => __('minimum order value'),
            'max_discount_amount' => __('maximum discount amount'),
            'product_ids' => __('products'),
            'category_ids' => __('categories'),
            'selection_rules' => __('selection rules'),
            'selection_rules.*.value' => __('rule value'),
            'selection_rules.*.type' => __('rule type'),
        ];
    }
}
