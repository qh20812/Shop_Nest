<?php

namespace App\Http\Requests\Seller;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    /**
     * Quyền được thực hiện request này.
     * Logic phân quyền đã được xử lý bởi Policy, nên ở đây ta trả về true.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Các quy tắc validation.
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'stock' => ['required', 'integer', 'min:0'],
            'category_id' => ['required', 'exists:categories,category_id'],
            'brand_id' => ['required', 'exists:brands,brand_id'],
        ];
    }
}

