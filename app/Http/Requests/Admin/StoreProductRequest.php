<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Chỉ admin mới có quyền, logic này có thể được kiểm tra ở middleware hoặc policy
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:200|unique:products,name',
            'description' => 'nullable|string',
            'category_id' => 'required|exists:categories,category_id',
            'brand_id' => 'required|exists:brands,brand_id',
            'status' => 'required|integer|in:1,2,3,4', // Draft, Pending, Published, Hidden
        ];
    }
}