<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCategoryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
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
            'name' => 'required|array',
            'name.en' => 'required|string|max:100|min:5',
            'name.vi' => 'required|string|max:100|min:5',
            'description' => 'nullable|array',
            'description.en' => 'nullable|string|max:500|min:5',
            'description.vi' => 'nullable|string|max:500|min:5',
            'parent_category_id' => 'nullable|exists:categories,category_id',
            'is_active' => 'required|boolean',
            'image' => 'nullable|image|mimes:jpg,png,jpeg,webp|max:2048',
        ];
    }
}
