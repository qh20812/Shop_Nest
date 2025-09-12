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
        $categoryId = $this->route('category')->category_id;
        return [
            'name'=>[
                'required',
                'string',
                'max:100',
                Rule::unique('categories','name')->ignore($categoryId, 'category_id')
            ],
            'description' => 'nullable|string|max:500',
            'parent_category_id' => 'nullable|exists:categories,category_id',
            'image_url' => 'nullable|url|max:255',
        ];
    }
}
