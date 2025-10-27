<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateCustomerSegmentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Add authorization logic as needed
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255|unique:customer_segments,name',
            'description' => 'nullable|string|max:1000',
            'rules' => 'required|array|min:1',
            'rules.*.field' => 'required|string|in:total_orders,total_spent,average_order_value,last_order_date,registration_date,days_since_registration,days_since_last_order,email,name,phone',
            'rules.*.operator' => 'required|string|in:equals,not_equals,greater_than,less_than,greater_than_or_equal,less_than_or_equal,contains,not_contains,starts_with,ends_with,in,not_in',
            'rules.*.value' => 'required|not_in:', // Not empty
            'is_active' => 'boolean',
            'customer_ids' => 'nullable|array',
            'customer_ids.*' => 'integer|exists:users,id',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Segment name is required.',
            'name.unique' => 'A segment with this name already exists.',
            'rules.required' => 'At least one rule is required.',
            'rules.*.field.required' => 'Rule field is required.',
            'rules.*.field.in' => 'Invalid rule field selected.',
            'rules.*.operator.required' => 'Rule operator is required.',
            'rules.*.operator.in' => 'Invalid rule operator selected.',
            'rules.*.value.required' => 'Rule value is required.',
            'customer_ids.*.exists' => 'Selected customer does not exist.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'rules.*.field' => 'rule field',
            'rules.*.operator' => 'rule operator',
            'rules.*.value' => 'rule value',
            'customer_ids.*' => 'customer',
        ];
    }
}
